"""
Hazel's Grove - voice-over builder (v3). Windows-friendly; offline after the first run.

Only the characters' spoken lines are voiced. Stage directions ("beats") are never read out:
they become timed pauses carrying sound effects and ambience.

Natural delivery:
  * flow mode (default): each line is voiced in one go, so the melody carries across sentences
    the way a person speaks; "|" in a line adds a deliberate breath-pause exactly there;
  * emphasis marks steer the voice engine's word stress: *word* stresses a word, _word_ softens
    one it leans on wrongly, ~word~ removes its stress, CAPITALS shout; "pronounce" in
    script.json fixes how names are said;
  * moods set speed, loudness and the pauses around each line; any line can override them;
  * takes: `make_takes.bat` (or --takes 3,7) renders each chosen line four ways (as written,
    slower, sentence by sentence, brisker) so you can pick by ear and set "take" in script.json;
  * a pacing report lists each line's words per minute and flags lines that may sound off;
  * the piece is kept under "max_seconds" by tightening pauses and beats, never speech.

Run make_voiceover.bat, or `python make_voiceover.py`. `--test` uses placeholder tones.
"""
from __future__ import annotations

import json
import math
import re
import sys
import wave
from pathlib import Path

import numpy as np

SR = 24000  # Kokoro's native sample rate
HERE = Path(__file__).resolve().parent
OUT = HERE / "output"
RNG = np.random.default_rng(11)


# ================================================================ DSP helpers
def secs(n: float) -> int:
    return max(0, int(round(n * SR)))


def silence(sec: float) -> np.ndarray:
    return np.zeros(secs(sec), dtype=np.float32)


def t_axis(sec: float) -> np.ndarray:
    return np.arange(secs(sec), dtype=np.float32) / SR


def fade(x: np.ndarray, fin: float = 0.01, fout: float = 0.05) -> np.ndarray:
    x = x.astype(np.float32).copy()
    a, b = min(secs(fin), len(x)), min(secs(fout), len(x))
    if a:
        x[:a] *= np.linspace(0, 1, a, dtype=np.float32)
    if b:
        x[len(x) - b :] *= np.linspace(1, 0, b, dtype=np.float32)
    return x


def gain(x: np.ndarray, db: float) -> np.ndarray:
    return (x * np.float32(10 ** (db / 20))).astype(np.float32)


def band(x: np.ndarray, lo: float = 0.0, hi: float | None = None) -> np.ndarray:
    """Band-pass by FFT (vectorised; fine for minutes of audio)."""
    if len(x) == 0:
        return x
    n = 1 << (len(x) - 1).bit_length()
    spec = np.fft.rfft(x, n)
    f = np.fft.rfftfreq(n, 1 / SR)
    mask = np.ones_like(f)
    if lo > 0:
        mask *= 1 / (1 + (lo / np.maximum(f, 1e-3)) ** 4)
    if hi:
        mask *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(spec * mask, n)[: len(x)].astype(np.float32)


def convolve(x: np.ndarray, ir: np.ndarray) -> np.ndarray:
    n = len(x) + len(ir) - 1
    size = 1 << (n - 1).bit_length()
    return np.fft.irfft(np.fft.rfft(x, size) * np.fft.rfft(ir, size), size)[:n].astype(np.float32)


_IR_CACHE: dict[tuple[float, float], np.ndarray] = {}


def reverb(x: np.ndarray, seconds: float, wet: float, hi: float = 5000) -> np.ndarray:
    key = (seconds, hi)
    if key not in _IR_CACHE:
        t = t_axis(seconds)
        ir = RNG.standard_normal(len(t)).astype(np.float32) * np.exp(-6.5 / seconds * t)
        ir = band(ir, 120, hi)
        _IR_CACHE[key] = ir / (np.sqrt(np.sum(ir ** 2)) or 1)
    tail = convolve(x, _IR_CACHE[key])
    dry = np.concatenate([x, np.zeros(len(tail) - len(x), dtype=np.float32)])
    return (dry * (1 - wet) + tail * wet).astype(np.float32)


def resample(x: np.ndarray, factor: float) -> np.ndarray:
    """Play `factor` times faster: raises pitch (and shortens) by the same factor."""
    if abs(factor - 1) < 1e-6:
        return x
    n = int(len(x) / factor)
    return np.interp(np.arange(n) * factor, np.arange(len(x)), x).astype(np.float32)


def trim(x: np.ndarray, thresh_db: float = -50, pad: float = 0.04) -> np.ndarray:
    """Cut the model's own leading/trailing silence so our pauses are exact."""
    if len(x) == 0:
        return x
    env = np.abs(x)
    th = np.max(env) * 10 ** (thresh_db / 20)
    idx = np.where(env > th)[0]
    if len(idx) == 0:
        return x
    a, b = max(0, idx[0] - secs(pad)), min(len(x), idx[-1] + secs(pad))
    return fade(x[a:b], 0.008, 0.04)


def rms_db(x: np.ndarray) -> float:
    return 20 * math.log10(float(np.sqrt(np.mean(x ** 2))) + 1e-9)


def level(x: np.ndarray, target_db: float) -> np.ndarray:
    return soft_clip(gain(x, target_db - rms_db(x)))


def soft_clip(x: np.ndarray) -> np.ndarray:
    return (np.tanh(x * 1.1) / math.tanh(1.1)).astype(np.float32)


def overlay(track: np.ndarray, clip: np.ndarray, at: float) -> np.ndarray:
    s = secs(at)
    if s + len(clip) > len(track):
        track = np.concatenate([track, np.zeros(s + len(clip) - len(track), dtype=np.float32)])
    track[s : s + len(clip)] += clip
    return track


# ================================================================ voice effects
def fx_voice(x: np.ndarray, kind: str) -> np.ndarray:
    if kind == "letter":  # a remembered voice: warm, a touch distant
        return reverb(band(x, 160, 6500), 1.1, 0.2, 4500)
    if kind == "close":  # quiet, near the ear
        return reverb(band(x, 70, None), 0.35, 0.05)
    if kind == "room":
        return reverb(x, 0.6, 0.12)
    return reverb(x, 0.4, 0.06)  # outdoor


# ================================================================ sound effects (all synthesised)
def tone(freq, sec, decay=0.0, harmonics=((1, 1.0),)) -> np.ndarray:
    t = t_axis(sec)
    x = sum(a * np.sin(2 * np.pi * freq * h * t) for h, a in harmonics)
    if decay:
        x = x * np.exp(-decay * t)
    return np.asarray(x, dtype=np.float32)


def sweep(f0, f1, sec) -> np.ndarray:
    f = np.linspace(f0, f1, secs(sec))
    return np.sin(2 * np.pi * np.cumsum(f) / SR).astype(np.float32)


def noise(sec) -> np.ndarray:
    return RNG.standard_normal(secs(sec)).astype(np.float32)


def env_burst(sec, attack=0.005, decay=20.0) -> np.ndarray:
    t = t_axis(sec)
    return (np.minimum(1, t / attack) * np.exp(-decay * t)).astype(np.float32)


def sfx(name: str) -> np.ndarray:
    if name == "gate":  # a stiff old gate: lift (creak), push (groan), settle (knock)
        t = t_axis(1.3)
        f = 120 + 25 * np.sin(2 * np.pi * 1.3 * t)
        saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
        rough = 0.6 + 0.4 * (np.sin(2 * np.pi * 31 * t) > 0)
        groan = band(saw * rough, 200, 2500) * np.minimum(1, t / 0.15) * np.exp(-1.2 * t)
        knock = np.concatenate([silence(1.15), band(noise(0.15), 80, 600) * env_burst(0.15, 0.002, 35)])
        return gain(fade(groan.astype(np.float32), 0.05, 0.2), -10) + gain(knock[: secs(1.3)], -7)
    if name == "paper":
        parts = [band(noise(d), 1800, 7000) * env_burst(d, 0.01, 9) for d in (0.25, 0.18, 0.32)]
        out = np.concatenate([parts[0], silence(0.1), parts[1], silence(0.15), parts[2]])
        return gain(out, -21)
    if name == "hum":  # something in the long grass, low, like a kettle thinking about it
        t = t_axis(2.6)
        x = tone(110, 2.6, 0, ((1, 1), (2, 0.4), (3, 0.15))) * (0.6 + 0.4 * np.sin(2 * np.pi * 0.7 * t))
        return gain(fade(x, 0.8, 0.9), -21)
    if name == "hatch":
        cracks = [band(noise(0.04), 1500, 6000) * env_burst(0.04, 0.001, 90) for _ in range(4)]
        seq = np.concatenate([cracks[0], silence(0.45), cracks[1], silence(0.3), cracks[2], silence(0.12), cracks[3], silence(0.4)])
        pip = fade(sweep(1800, 2500, 0.12), 0.01, 0.06) * 0.5
        return gain(np.concatenate([seq, pip, silence(0.2), pip * 0.7]), -16)
    if name == "zap":
        x = band(noise(0.35), 1000, 9000) * env_burst(0.35, 0.002, 14)
        x += tone(3100, 0.35, 18) * 0.4
        return gain(x, -12)
    if name == "sneeze":
        tchoo = band(noise(0.12), 1800, 6000) * env_burst(0.12, 0.004, 30)
        spark = band(noise(0.1), 3000, 9000) * env_burst(0.1, 0.001, 40) + tone(4200, 0.1, 50) * 0.3
        return gain(np.concatenate([tchoo, silence(0.08), spark]), -16)
    if name == "lanterns":  # three lanterns come up, one by one
        bells = []
        for f in (523.25, 659.25, 783.99):
            whoomp = band(noise(0.3), 60, 500) * env_burst(0.3, 0.02, 10) * 0.5
            bell = tone(f, 1.4, 2.5, ((1, 1), (2.01, 0.3), (3.0, 0.12))) * 0.35
            bells.append(overlay(whoomp.copy(), bell, 0.05))
        out = silence(0.0)
        for i, b in enumerate(bells):
            out = overlay(out, b, i * 0.9)
        return gain(out, -11)
    if name == "flicker":
        t = t_axis(1.8)
        x = np.zeros(len(t), dtype=np.float32)
        for at in np.sort(RNG.uniform(0, 1.6, 14)):
            c = band(noise(0.03), 800, 5000) * env_burst(0.03, 0.001, 120)
            x = overlay(x, c * RNG.uniform(0.3, 1.0), at)
        return gain(x, -20)
    if name == "wind":
        t = t_axis(3.2)
        x = band(noise(3.2), 150, 900) * (0.5 + 0.5 * np.sin(np.pi * t / 3.2))
        return gain(fade(x, 0.8, 1.0), -27)
    if name == "gate-smooth":  # it swings open for him, smoothly, with no sound it should make
        t = t_axis(1.6)
        x = band(noise(1.6), 300, 1500) * np.sin(np.pi * t / 1.6) * 0.5
        x += tone(1975, 1.6, 0) * 0.05 * np.sin(np.pi * t / 1.6)
        return gain(x, -26)
    if name == "frost":
        x = silence(2.0)
        for at in np.sort(RNG.uniform(0, 1.6, 22)):
            f = RNG.uniform(3500, 8000)
            x = overlay(x, tone(f, 0.25, 22) * RNG.uniform(0.2, 0.6), at)
        return gain(fade(x, 0.1, 0.4), -22)
    raise ValueError(f"unknown sfx: {name}")


def motif() -> np.ndarray:
    """An original eight-note music-box figure, slow and warm, over a low C."""
    notes = [(783.99, 0.5), (659.25, 0.5), (587.33, 0.5), (523.25, 1.0), (587.33, 0.5), (659.25, 0.5), (783.99, 0.5), (659.25, 1.6)]
    out = silence(0.0)
    at = 0.0
    for f, d in notes:
        note = tone(f, 2.2, 2.6, ((1, 1), (2.0, 0.22), (4.0, 0.05)))
        out = overlay(out, fade(note, 0.003, 0.3) * 0.3, at)
        at += d * 0.55
    out = overlay(out, fade(tone(130.81, at + 1.5, 0.6, ((1, 1), (2, 0.3))), 0.4, 1.0) * 0.18, 0.0)
    return gain(out, -14)


# ================================================================ ambience beds
def bed(kind: str, sec: float) -> np.ndarray:
    if sec <= 0:
        return silence(0.0)
    t = t_axis(sec)
    air = band(noise(sec), 100, 700) * (0.7 + 0.3 * np.sin(2 * np.pi * 0.05 * t))
    x = gain(air, -41)
    if kind in ("day", "afternoon"):
        density = 0.55 if kind == "day" else 0.18
        for at in np.sort(RNG.uniform(0, max(0.1, sec - 1), int(sec * density))):
            f0 = RNG.uniform(2600, 4200)
            n = int(RNG.integers(2, 5))
            chirps = np.concatenate([np.concatenate([fade(sweep(f0, f0 * RNG.uniform(1.1, 1.35), 0.07), 0.005, 0.03), silence(0.05)]) for _ in range(n)])
            x = overlay(x, gain(chirps, RNG.uniform(-37, -29)), at)
    if kind == "dusk":
        c = np.sin(2 * np.pi * 4300 * t) * (0.5 + 0.5 * np.sin(2 * np.pi * 28 * t)) * (np.sin(2 * np.pi * 0.55 * t) > 0.25)
        x = x + gain(c.astype(np.float32), -37)
    return fade(x[: secs(sec)], 1.5, 1.5)


# ================================================================ text and voices
LINK = re.compile(r"\[[^\]]+\]\([^)]*\)")


def _outside_links(text: str, pattern: str, repl) -> str:
    """Apply a regex substitution only to text that isn't already inside [word](...) markup."""
    out, last = [], 0
    for m in LINK.finditer(text):
        out.append(re.sub(pattern, repl, text[last : m.start()]))
        out.append(m.group(0))
        last = m.end()
    out.append(re.sub(pattern, repl, text[last:]))
    return "".join(out)


def markup(text: str, pronounce: dict[str, str]) -> tuple[str, str, bool]:
    """
    Turn the script's simple marks into the voice engine's own controls.
      *word*   stress this word (works best on small words: you, me, her, is, ever)
      _word_   take stress off a word the voice leans on wrongly
      ~word~   no stress at all on this word
      WORD     shouted: stressed and a little louder (lower-cased so it isn't spelled out)
      |        a deliberate breath-pause inside a line
    Words in "pronounce" are given fixed phonemes. Raw engine markup [word](/phonemes/),
    [word](+1) or [word](-1) also passes straight through.
    Returns (text for the voice, plain text for the report, shouted?).
    """
    text = text.replace("“", "").replace("”", "").replace('"', "")
    text = text.replace("P.S.", "P S,").replace("--", "—")
    for word, ph in pronounce.items():
        ph = ph if ph.startswith("/") else f"/{ph}/"
        text = _outside_links(text, rf"\b{re.escape(word)}\b", lambda m, ph=ph: f"[{m.group(0)}]({ph})")
    text = _outside_links(text, r"\*([A-Za-z']+)\*", r"[\1](+2)")
    text = _outside_links(text, r"(?<![A-Za-z])_([A-Za-z']+)_(?![A-Za-z])", r"[\1](-1)")
    text = _outside_links(text, r"~([A-Za-z']+)~", r"[\1](-2)")
    shouted = bool(re.search(r"\b[A-Z]{2,}\b", LINK.sub("", text)))
    text = _outside_links(
        text, r"\b[A-Z]{2,}\b",
        lambda m: f"[{m.group(0).capitalize() if m.start() == 0 else m.group(0).lower()}](+2)",
    )
    plain = LINK.sub(lambda m: m.group(0)[1 : m.group(0).index("]")], text).replace("|", " ")
    return text, re.sub(r"\s+", " ", plain).strip(), shouted


def chunks(text: str, mode: str) -> list[tuple[str, str]]:
    """
    Split a line into pieces to voice, with the kind of pause after each piece.
    flow (default): only at | marks, so the voice keeps its natural melody across sentences.
    sentences: at every sentence end, for exact control (can sound more choppy).
    """
    out: list[tuple[str, str]] = []
    for part in [p.strip() for p in text.split("|") if p.strip()]:
        if mode == "sentences":
            sents = re.findall(r".+?(?:\.\.\.|…|[.!?]+|—|$)(?=\s|$)", part)
            sents = [x.strip() for x in sents if x.strip()]
            for x in sents[:-1]:
                out.append((x, "ellipsis" if x.endswith(("...", "…")) else "sentence"))
            if sents:
                out.append((sents[-1], "bar"))
        else:
            out.append((part, "bar"))
    if out:
        out[-1] = (out[-1][0], "end")
    return out


# Alternative takes of a line, like a director asking for "one more, slower".
TAKES = {
    "a": {"label": "as written (flowing)"},
    "b": {"label": "a touch slower", "speed": 0.93},
    "c": {"label": "sentence by sentence (exact pauses)", "mode": "sentences"},
    "d": {"label": "a touch brisker", "speed": 1.06},
}


class Voices:
    def __init__(self, test: bool):
        self.test = test
        self.pipes: dict[str, object] = {}

    def say(self, text: str, voice: str, lang: str, speed: float) -> np.ndarray:
        if self.test:  # placeholder hum at roughly Kokoro's speaking rate
            sec = max(0.35, len(text) / 15.0 / speed)
            t = t_axis(sec)
            return fade((0.3 * np.sin(2 * np.pi * 170 * t) * (0.55 + 0.45 * np.sin(2 * np.pi * 4.5 * t))).astype(np.float32), 0.03, 0.08)
        from kokoro import KPipeline  # imported here so --test works without it

        if lang not in self.pipes:
            self.pipes[lang] = KPipeline(lang_code=lang, repo_id="hexgrad/Kokoro-82M")
        out = []
        for r in self.pipes[lang](text, voice=voice, speed=speed):
            audio = getattr(r, "audio", None)
            if audio is None and isinstance(r, tuple):
                audio = r[2]
            if audio is None:
                continue
            audio = audio.detach().cpu().numpy() if hasattr(audio, "detach") else np.asarray(audio)
            out.append(audio.astype(np.float32))
        if not out:
            raise RuntimeError(f"No audio for: {text!r}")
        return np.concatenate(out)


# ================================================================ build
def write_wav(path: Path, x: np.ndarray) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes())


def write_mp3(path: Path, x: np.ndarray) -> bool:
    try:
        import lameenc
    except ImportError:
        return False
    enc = lameenc.Encoder()
    enc.set_bit_rate(160)
    enc.set_in_sample_rate(SR)
    enc.set_channels(1)
    enc.set_quality(2)
    path.write_bytes(enc.encode((np.clip(x, -1, 1) * 32767).astype("<i2").tobytes()) + enc.flush())
    return True


def voice_line(cue: dict, sc: dict, voices: Voices, global_speed: float, take: str) -> dict:
    """Voice one spoken line in one take. Returns its speech pieces, the pauses between them, and settings."""
    moods, pacing, vcfg = sc["moods"], sc["pacing"], sc["voices"]
    who, mood_name = cue["who"], cue.get("mood", "neutral")
    v, m = vcfg[who], moods.get(mood_name, moods["neutral"])
    t = TAKES.get(take, TAKES["a"])
    mode = t.get("mode", cue.get("mode", pacing.get("mode", "flow")))
    text, plain, shouted = markup(cue["text"], sc.get("pronounce", {}))
    pitch = float(v.get("pitch", 1.0))
    base = global_speed * float(t.get("speed", 1.0)) * float(cue.get("speed", 1.0)) * float(v.get("speed", 1.0)) * float(m["speed"])
    speech: list[np.ndarray] = []
    gaps: list[float] = []
    pieces = chunks(text, mode)
    for i, (piece, after) in enumerate(pieces):
        spd = base * (pacing.get("final_sentence_slowdown", 1.0) if mode == "sentences" and after == "end" and len(pieces) > 1 else 1.0)
        raw = voices.say(piece.rstrip("—"), v["voice"], v["lang"], spd / pitch)
        speech.append(trim(resample(raw, pitch)))
        if after != "end":
            gaps.append({"ellipsis": m["ellipsis"], "sentence": m["sentence"], "bar": m["ellipsis"]}[after])
    return {
        "who": who, "mood": mood_name, "plain": plain, "speech": speech, "gaps": gaps,
        "cut": cue["text"].rstrip().endswith(("—", "--")), "fx": v.get("fx", "outdoor"),
        "level": -19 + m["gain"] + float(cue.get("gain", 0)) + (1.5 if shouted else 0), "m": m,
    }


def finish(line: dict, scale: float = 1.0) -> np.ndarray:
    """Join a line's pieces with its pauses, add the voice effect and set its loudness."""
    parts: list[np.ndarray] = []
    for i, x in enumerate(line["speech"]):
        parts.append(x)
        if i < len(line["gaps"]):
            parts.append(silence(line["gaps"][i] * scale))
    clip = np.concatenate(parts)
    if line["cut"]:
        clip = fade(clip[: max(1, len(clip) - secs(0.05))], 0.0, 0.02)
    line["dry"] = len(clip) / SR  # reverb tails spill into the next pause instead of adding time
    return level(fx_voice(clip, line["fx"]), line["level"])


def voice_all(sc: dict, voices: Voices, global_speed: float) -> tuple[list[dict], list[str]]:
    """Pass 1: voice every spoken line; plan beats as flexible time."""
    pacing = sc["pacing"]
    events: list[dict] = []
    report: list[str] = []
    n_line = 0
    prev_cut = False
    for cue in sc["cues"]:
        if "music" in cue or "ambience" in cue:
            events.append({"kind": "marker", **cue})
            continue
        if "beat" in cue:
            words = len(cue["beat"].split())
            dur = min(pacing["beat_max"], max(pacing["beat_min"], words * pacing["beat_seconds_per_word"]))
            dur = max(dur, cue.get("min", 0))
            clip = sfx(cue["sfx"]) if cue.get("sfx") else None
            fixed = len(clip) / SR + 0.3 if clip is not None else 0.0
            events.append({"kind": "beat", "flex": max(0.0, dur - fixed), "fixed": fixed, "sfx": clip})
            prev_cut = False
            continue

        n_line += 1
        take = cue.get("take", "a")
        line = voice_line(cue, sc, voices, global_speed, take)
        before = float(cue.get("before", line["m"]["before"]))
        if prev_cut:
            before = -pacing["cut_off_overlap"]
        line.update({"kind": "line", "n": n_line, "before": before, "after": float(cue.get("after", pacing["after_line"]))})
        events.append(line)
        prev_cut = line["cut"]

        speech_sec = sum(len(x) for x in line["speech"]) / SR
        words = len(re.findall(r"[A-Za-z']+", line["plain"]))
        wpm = words / max(0.1, speech_sec) * 60
        line["flagged"] = False
        flag = ""
        if wpm > 185:
            flag, line["flagged"] = "  <- may sound rushed: try take b, or \"speed\": 0.92", True
        elif wpm < 105 and words > 3:
            flag, line["flagged"] = "  <- may drag: try take d, or \"speed\": 1.08", True
        tk = f" take {take}" if take != "a" else ""
        report.append(f"{n_line:03d}  {line['who']:<7} {line['mood']:<7} {speech_sec:5.1f}s  {words:3d} words  {wpm:4.0f} wpm{tk}{flag}\n      {line['plain'][:90]}")
        print(f"  {n_line:03d}  {line['who']:<7} {line['mood']:<7} {line['plain'][:60]}")
    return events, report


def render_takes(sc: dict, voices: Voices, which: str, events: list[dict]) -> None:
    """Write every take of the chosen lines to output/takes so you can pick the best by ear."""
    lines = [c for c in sc["cues"] if "who" in c]
    which = which.strip().lower()
    if which in ("", "flagged"):
        wanted = {e["n"] for e in events if e.get("kind") == "line" and e.get("flagged")}
    elif which == "all":
        wanted = set(range(1, len(lines) + 1))
    else:
        wanted = {int(x) for x in re.findall(r"\d+", which)}
    if not wanted:
        print("\n  No lines to make takes for (nothing flagged). Try: make_takes.bat 3,7,12")
        return
    print(f"\nMaking takes for lines {', '.join(str(n) for n in sorted(wanted))}...")
    folder = OUT / "takes"
    folder.mkdir(parents=True, exist_ok=True)
    for n in sorted(wanted):
        cue = lines[n - 1]
        for key in TAKES:
            clip = finish(voice_line(cue, sc, voices, 1.0, key))
            write_wav(folder / f"{n:03d}_{cue['who']}_{key}.wav", clip)
    guide = ["Takes: listen, pick the best, and set it in script.json on that line, e.g.  \"take\": \"b\"", ""]
    guide += [f"  {k}: {v['label']}" for k, v in TAKES.items()]
    (folder / "README.txt").write_text("\n".join(guide) + "\n", encoding="utf-8")
    print(f"  Takes are in {folder}")


def plan(events: list[dict], limit: float, mot: float) -> tuple[float, float]:
    """Scale for pauses and beats (never speech) to fit; returns (scale, total at that scale)."""
    speech = sum(sum(len(x) for x in e["speech"]) for e in events if e["kind"] == "line") / SR
    fixed = sum(e["fixed"] for e in events if e["kind"] == "beat") + 0.6 + mot + 0.8
    flex = sum(e["flex"] for e in events if e["kind"] == "beat")
    flex += sum(max(0.0, e["before"]) + e["after"] + sum(e["gaps"]) for e in events if e["kind"] == "line")
    scale = 1.0
    if speech + fixed + flex > limit and flex > 0:
        scale = max(0.45, (limit - speech - fixed) / flex)
    return scale, speech + fixed + flex * scale


def main() -> None:
    test = "--test" in sys.argv
    sc = json.loads((HERE / "script.json").read_text(encoding="utf-8"))
    voices = Voices(test)
    name = sc.get("output", "voiceover")
    limit = float(sc.get("max_seconds", 300)) - 0.5
    mot = len(motif()) / SR
    print("Voicing spoken lines" + (" (TEST MODE: placeholder tones)" if test else " with Kokoro") + "...\n")

    global_speed = 1.0
    events, report = voice_all(sc, voices, global_speed)
    scale, est = plan(events, limit, mot)
    if est > limit:  # still long with pauses tightened: speak everything a touch faster, once
        global_speed = min(1.12, est / limit * 1.01)
        print(f"\n  Running {est:.0f}s; re-voicing {round((global_speed - 1) * 100)}% faster to fit {limit + 0.5:.0f}s...\n")
        events, report = voice_all(sc, voices, global_speed)
        scale, est = plan(events, limit, mot)

    # assemble each line now that pause lengths are known; apply voice effects and level
    for e in events:
        if e["kind"] != "line":
            continue
        e["clip"] = finish(e, scale)
        write_wav(OUT / "lines" / f"{e['n']:03d}_{e['who']}.wav", e["clip"])

    # ---- pass 2: lay out the timeline
    track = silence(0.6)
    pos = 0.6
    amb_marks: list[tuple[float, str]] = []
    music_at: list[float] = []
    for e in events:
        if e["kind"] == "marker":
            if "ambience" in e:
                amb_marks.append((pos, e["ambience"]))
            if "music" in e:
                music_at.append(pos)
            continue
        if e["kind"] == "beat":
            dur = e["fixed"] + e["flex"] * scale
            if e["sfx"] is not None:
                track = overlay(track, e["sfx"], pos + 0.15)
            track = overlay(track, silence(dur), pos)
            pos += dur
            continue
        pos += e["before"] * (scale if e["before"] > 0 else 1.0)
        pos = max(0.0, pos)
        track = overlay(track, e["clip"], pos)
        pos += e["dry"] + e["after"] * scale
    for at in music_at:
        track = overlay(track, motif(), at)
        pos = max(pos, at + mot)
    total = pos + 0.8
    track = overlay(track, silence(0.0), total)[: secs(total)]

    # ambience beds, cross-faded at each change
    amb = silence(total)
    amb_marks.append((total, "end"))
    for (a, kind), (b, _) in zip(amb_marks, amb_marks[1:]):
        if kind != "none":
            amb = overlay(amb, bed(kind, b - a + 1.5), max(0.0, a - 0.75))
    amb = amb[: len(track)]
    pad = np.pad(amb, (0, len(track) - len(amb)))
    mix = soft_clip(track + pad)
    peak = float(np.max(np.abs(mix))) or 1.0
    mix = fade(mix / peak * 10 ** (-1 / 20), 0.0, 1.5)

    OUT.mkdir(exist_ok=True)
    write_wav(OUT / f"{name}.wav", mix)
    mp3 = write_mp3(OUT / f"{name}.mp3", mix)
    head = [
        f"Pacing report: {sc.get('title', name)}",
        f"Total {int(total//60)}:{total%60:04.1f}  (limit {sc.get('max_seconds', 300)} s; pauses and beats at {scale:.0%} of planned length; speech at {global_speed:.0%} speed)",
        "Natural conversational speech is roughly 130-170 words per minute; soft or sad lines sit lower,",
        "excited lines higher. For a flagged line (or any line that sounds off): run make_takes.bat to hear",
        "takes a-d side by side, then set \"take\" on that line in script.json; or adjust its mood/speed, or",
        "add emphasis marks (*word*, _word_, | for a breath) and run again.",
        "",
    ]
    (OUT / "pacing-report.txt").write_text("\n".join(head + report) + "\n", encoding="utf-8")
    if total > limit + 1:
        msg = f"Still {total - limit - 0.5:.0f}s over the limit: cut a line or two in script.json, or raise max_seconds."
        print("\n  " + msg)
        (OUT / "pacing-report.txt").write_text(msg + "\n\n" + (OUT / "pacing-report.txt").read_text(encoding="utf-8"), encoding="utf-8")
    print(f"\nDone: {int(total//60)}:{total%60:04.1f} long.")
    print(f"  {OUT / (name + ('.mp3' if mp3 else '.wav'))}")
    print(f"  pacing report: {OUT / 'pacing-report.txt'}")
    print(f"  single lines:  {OUT / 'lines'}")
    if "--takes" in sys.argv:
        i = sys.argv.index("--takes")
        render_takes(sc, voices, " ".join(sys.argv[i + 1 :]) or "flagged", events)


if __name__ == "__main__":
    main()
