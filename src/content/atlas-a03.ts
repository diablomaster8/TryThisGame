/**
 * Atlas campaign, page A3: Forty-Nine Days (Part L). Fourteen quests, A3-1 to A3-14.
 *
 * SOURCE. Along with the Gods (Singwa hamkke), Joo Ho-min's webtoon (Naver Webtoon, 2010–2012),
 * and the two films directed by Kim Yong-hwa: The Two Worlds (2017) and The Last 49 Days (2018)
 * (Realies Pictures and Dexter Studios; released by Lotte Entertainment). Rights: © Joo Ho-min
 * for the webtoon; the films' producers for the films (confirm the holders). A LICENCE IS NEEDED
 * TO SHIP THIS PAGE. The page follows the films' plot (the firefighter, the three guardians, the
 * seven trials, the brother and the mother); the scenes inside each trial are our own staging of
 * those beats. The film character names (Kim Ja-hong, Gang-rim, Haewonmak, Lee Deok-choon, Kim
 * Su-hong, King Yeomra, Private Won) are the source's. The judges of the other hells, the Accuser
 * and the evidence clerk are named by their office only. All art is the atlas's own: an ink-and-
 * colour page, not the films' designs.
 *
 * AUDIENCE. 'teen' (13+): main game only, behind the Mature content setting (Off by default). No
 * Learning Grove version, so no childLines.
 *
 * FRAME. Nova's atlas opens at a page washed in ink and smoke: a city street, a burning building,
 * and under it a long road of white sand. You and your Nubbin step in. On this page your Nubbin
 * shows as a small warm light, a "soul-spark", and the three guardians mistake it for a lost soul
 * and take it under escort. It is not on any list of the dead (Gang-rim checks, A3-2), so it is
 * only lost, and everyone says so early and plainly. You are the living witness who walks with
 * them and fetches evidence for each trial. Ja-hong and the guardians keep their story; you fetch,
 * hold, find and, once, argue (A3-11). Your Nubbin never speaks: it glows, dims, warms, follows.
 *
 * GROVE STATE READ (read-only; the Atlas never writes a Grove flag):
 *   - s24Done (S24, Hazel's margin notes on every Atlas page). ATLAS_A03_VARIANTS
 *     'a03-margin-hazel' plays once, straight after a03-12-complete (A3-12, The Dream) if s24Done
 *     is set; if S24 finishes after A3-12 is done, the first time the atlas is next open at this
 *     page. The note's text is S24's own (side-stories-s24.ts, Hazel's margin notes, the A3 entry,
 *     beside A3-12), word for word. Nothing else is read.
 *
 * FLAGS WRITTEN (Atlas save only, all prefixed a03-):
 *   - a03-01 … a03-14 on each quest; a03-done on A3-14 (atlasDone('A3') for the Night of
 *     Remembering festival).
 *   - a03-letters = kindness | lies | both (A3-5, a03-05-choice): the signature choice. It is the
 *     argument you make for Ja-hong at the trial of filial impiety (A3-11, a03-11-plea*), and it
 *     sets the voice of the verdict (A3-13, a03-13-verdict*) and of Gang-rim's defiance (A3-14,
 *     a03-14-defy*).
 *
 * VARIANTS (ATLAS_A03_VARIANTS): the content note before A3-11, the a03-letters scenes and Hazel's
 *   margin note. See the block above the array.
 *
 * LIFTED TEXT. None. Every line is original. No dialogue from the webtoon or the films.
 *
 * CARE NOTES.
 *   - SUICIDE. "The worst night" is, in the films, the night Ja-hong, worn out by poverty and his
 *     mother's long illness, meant to end her life and his own. The films also include a young
 *     soldier's suicide attempt after Su-hong's death. These are named here for the team only. On
 *     screen the first is only ever "the worst night": never depicted, never described, never
 *     explained (the mirror shows the court; the player sees a closed door). The second is left
 *     out of the page entirely: Private Won lives, confesses, and is not shown in any danger.
 *     A content note plays before A3-11 (a03-11-note), with a support line under it (see A3-11).
 *   - SU-HONG'S DEATH (A3-8) is told as the films have it, without detail: an accident on night
 *     guard, then fear, then a cover-up that called him a deserter. "They hid what happened, and
 *     him with it" is as far as the page goes. No wound, no burial, no body on screen.
 *   - THE FIRE (A3-1): he falls holding the girl; she gets up and he doesn't. No injury shown.
 *   - KOREAN ADVISERS (required before ship): a cultural adviser on the afterlife and folk
 *     religion. The Ten Kings, the jeoseung saja (the messengers who walk the dead to the next
 *     world: grave, dutiful, never villains), the forty-nine days and the courts come from Korean
 *     Buddhist and folk belief that people still hold. They are shown as the films show them, with
 *     dignity: the kings are severe and fair, never mocked; the comedy belongs to Haewonmak's
 *     temper and Deok-choon's tears, never to the beliefs. Words kept few, glossed by context:
 *     jeoseung (the world of the dead), saja, hyung (older brother), eomma (mum). Confirm with
 *     the adviser which king presides over which hell; the page names only King Yeomra.
 *   - Death is said plainly and gently. Rebirth (A3-13) is a walk through a gate into light.
 *   - Hazel's third rule is acted (A3-10, sitting with the brothers), never quoted.
 */
import type { Line, Mood, Scene } from '../config/story';
import type { Quest, Speaker } from './types';

// ------------------------------------------------------------------ helpers

const say =
  (who: string) =>
  (text: string, mood?: Mood): Line =>
    mood ? { who, text, mood } : { who, text };

/** A source character. */
const sp = (id: string, name: string, basedOn: string): Speaker => ({ id, name, kind: 'other', basedOn });

const WHERE = 'Nova’s atlas: the Forty-Nine Days page (Atlas campaign)';
const after = (code: string) => `Any time after ${code}, from Nova’s atlas.`;
const SRC = 'Along with the Gods (Joo Ho-min’s webtoon; the films The Two Worlds, 2017, and The Last 49 Days, 2018)';

// ------------------------------------------------------------------ speakers

const FILMS = 'Along with the Gods (webtoon by Joo Ho-min; films 2017 and 2018); original design and dialogue';
const JAHONG = sp('a03-jahong', 'Ja-hong', `Kim Ja-hong, the firefighter, in ${FILMS}`);
const GANGRIM = sp('a03-gangrim', 'Gang-rim', `Gang-rim, leader of the three guardians, in ${FILMS}`);
const HAEWON = sp('a03-haewonmak', 'Haewonmak', `Haewonmak, the fierce guardian, in ${FILMS}`);
const DEOK = sp('a03-deokchoon', 'Deok-choon', `Lee Deok-choon, the kind guardian, in ${FILMS}`);
const SUHONG = sp('a03-suhong', 'Su-hong', `Kim Su-hong, Ja-hong’s younger brother, in ${FILMS}`);
const MOTHER = sp('a03-mother', 'Ja-hong’s mother', `The brothers’ mother, who can no longer speak, in ${FILMS}`);
const YEOMRA = sp('a03-yeomra', 'King Yeomra', `King Yeomra, greatest of the Ten Kings, in ${FILMS}`);
const ACCUSER = sp('a03-accuser', 'The Accuser', 'The courts’ prosecutor, after the films’ prosecutors; original character');
const KMURDER = sp('a03-king-murder', 'The King of the Hell of Murder', `One of the Ten Kings, in ${FILMS}`);
const KIDLE = sp('a03-king-idle', 'The King of the Hell of Indolence', `One of the Ten Kings, in ${FILMS}`);
const KDECEIT = sp('a03-king-deceit', 'The King of the Hell of Deceit', `One of the Ten Kings, in ${FILMS}`);
const KVIOLENCE = sp('a03-king-violence', 'The King of the Hell of Violence', `One of the Ten Kings, in ${FILMS}`);
const CLERK = sp('a03-clerk', 'The Mirror Clerk', 'An original clerk of the mirror archive; no source character');
const WON = sp('a03-won', 'Private Won', `Private Won, Su-hong’s friend at the base, in ${FILMS}`);
const GIRL = sp('a03-girl', 'The girl', 'The child Ja-hong carries out of the fire, in the films; original dialogue');

const N = say('narrator');
const Y = say('you');
const JH = say('a03-jahong');
const GR = say('a03-gangrim');
const HW = say('a03-haewonmak');
const DC = say('a03-deokchoon');
const SH = say('a03-suhong');
const MO = say('a03-mother');
const YM = say('a03-yeomra');
const AC = say('a03-accuser');
const KM = say('a03-king-murder');
const KI = say('a03-king-idle');
const KD = say('a03-king-deceit');
const KV = say('a03-king-violence');
const CL = say('a03-clerk');
const WN = say('a03-won');
const GI = say('a03-girl');

// =================================================================== FORTY-NINE DAYS

export const ATLAS_A03: Quest[] = [
  // ---------------------------------------------------------------- A3-1
  {
    id: 'a03-01',
    code: 'A3-1',
    title: 'The Fire',
    source: `${SRC}: the fire, and the fall`,
    audience: 'teen',
    trigger: {
      where: WHERE,
      when: 'Any time once Nova’s atlas is in the Grove and Mature content is set to 13+ or 18+; the first quest on the page.',
    },
    speakers: [JAHONG, GIRL, GANGRIM],
    steps: [
      {
        id: 'a03-01-s1',
        goal: 'Step into the smoky page and find the fire.',
        hint: 'Touch the page, then follow the sirens up the street.',
        check: 'explore:a03-city:fire-street',
        scene: {
          id: 'a03-01-page',
          lines: [
            N('Nova’s atlas falls open at a page washed in grey ink. A city street, a tall building, and smoke drawn in long soft strokes.'),
            N('Under the street, as if the paper were thinner there, you can see a road of white sand going a long way down.'),
            N('Somebody has written in the corner, in Nova’s hand: “Forty-nine days. Read it with somebody.”'),
            N('The smoke moves. Then it smells of smoke, and you and your Nubbin are standing on a wet pavement, with sirens coming.'),
            N('Your Nubbin is glowing, very faintly, the way a coal does after the fire has gone down. It looks at its paws, surprised.'),
            N('A fire engine pulls up. A man in a yellow helmet is out of it before it has stopped.'),
            JH('There’s a kid on the seventh floor. Somebody saw her at the window. I’m going up.'),
            N('Nobody argues with him. It looks as if nobody ever has.'),
          ],
          choices: [
            {
              id: 'back',
              label: 'Stay back, and keep your Nubbin close.',
              then: [N('You stand by the engine with your Nubbin in your arms. It is warm, warmer than usual, and it won’t stop looking up.')],
            },
            {
              id: 'call',
              label: 'Call after him to be careful.',
              then: [
                JH('Always am.', 'happy'),
                N('He says it the way people say things they have said a thousand times, and then he is gone into the smoke.'),
              ],
            },
          ],
        },
        done: {
          id: 'a03-01-page-done',
          lines: [N('Floor by floor, a torch moves up past the windows. At the seventh it stops.')],
        },
      },
      {
        id: 'a03-01-s2',
        goal: 'Watch the seventh-floor window.',
        hint: 'Stay by the fire engine and look up.',
        check: 'watch:a03-jahong:window',
        scene: {
          id: 'a03-01-window',
          lines: [
            N('A small face appears at the seventh-floor window, and then his helmet beside it.'),
            N('Behind them the stairwell glows the wrong colour. The way down is gone.'),
            N('He wraps the girl in his coat, all of her, until she is just a bundle with feet.'),
            N('He looks down at the street, at the people with the cushion, at the distance. He doesn’t look for very long.'),
            N('Then he holds her tight against his chest, turns his back to the air, and steps out.'),
            N('Your Nubbin covers its eyes with both paws. You don’t, and afterwards you wish you had.'),
          ],
        },
        done: {
          id: 'a03-01-window-done',
          lines: [
            N('The bundle sits up on the cushion and starts to cry, which is the best sound in the street.'),
            GI('Where’s the man? The man in the hat?', 'shock'),
            N('The man in the hat does not sit up.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a03-01-complete',
      lines: [
        N('A little way off, Ja-hong stands up out of himself, the way you get up from a chair. He pats his chest, puzzled.'),
        JH('Is she all right? Somebody tell me she’s all right.'),
        N('She is, and you nod, because you can’t say it yet. He breathes out, and then he looks down at where he was lying.'),
        JH('Oh.', 'soft'),
        N('By the fire engine three people in long black coats are waiting, as if they have been there all along. Nobody else can see them.'),
        N('The tallest is reading from a list. He looks up at Ja-hong, then, for slightly longer, at your glowing Nubbin.'),
        GR('Kim Ja-hong. Firefighter. You did well today. Come with us, please.'),
      ],
    },
    rewards: [],
    sets: { 'a03-01': true },
    notes:
      'OPENING: the page is grey ink that takes colour as you step through (two seconds, a slow wash). From here to ' +
      'A3-14 your Nubbin is drawn with a soft inner glow (the "soul-spark"); its normal colours return in a03-14. ' +
      'CARE: the fall is one held frame and a cut to the cushion; no impact, no injury, no body detail. Ja-hong ' +
      'standing up out of himself is a pale double that brightens; his body is never shown after the fall, only ' +
      'the shape of him under a coat at frame edge. The guardians are visible only to you, Ja-hong and the Nubbin.',
  },

  // ---------------------------------------------------------------- A3-2
  {
    id: 'a03-02',
    code: 'A3-2',
    title: 'The Three Guardians',
    source: `${SRC}: the guardians meet the paragon`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-1') },
    requires: ['A3-1'],
    speakers: [GANGRIM, HAEWON, DEOK, JAHONG],
    steps: [
      {
        id: 'a03-02-s1',
        goal: 'Meet the three guardians, and find out what they want with your Nubbin.',
        hint: 'Talk to the tall one with the list.',
        check: 'talk:a03-gangrim:list',
        scene: {
          id: 'a03-02-coats',
          lines: [
            N('Up close the black coats are very plain, and very well kept. Their wide black hats throw a shade like a small roof.'),
            HW('The big one’s ours. What’s the little glowing one? A stray? I’ll take it.', 'angry'),
            N('He has a sword nearly as long as he is, and a face that looks ready to start an argument with weather.'),
            DC('You will not take it, you’ll frighten it. Look, it’s shaking. Come here, little one.', 'sad'),
            N('She is young, with a round kind face, and she is already holding out her sleeve for your Nubbin to climb into.'),
            GR('Haewonmak. Deok-choon. Let me check.'),
            N('Gang-rim runs one finger down his list, then down the back of it, then down a second sheet from his coat.'),
            GR('Not on any list. It isn’t dead. It’s lost. The page has drawn it as a spark because it doesn’t know what else to draw.'),
            GR('We’ll walk it with us till we can see it home. And you with it, I suppose. You’re the living one who came in the front.'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Keep your Nubbin in your own arms.',
              then: [
                DC('Of course. Of course you would. I would too.', 'soft'),
                HW('I wasn’t going to hurt it. I was going to put it in a jar. A nice jar.', 'sad'),
              ],
            },
            {
              id: 'sleeve',
              label: 'Let Deok-choon carry it in her sleeve.',
              then: [N('Your Nubbin climbs into the black sleeve and settles. Deok-choon looks as if somebody has given her a medal.')],
            },
            {
              id: 'ask',
              label: 'Ask Gang-rim if it’s safe here.',
              then: [GR('Safer than most. The dead here are mostly sad, and sad people are not much danger to anybody.')],
            },
          ],
        },
        done: {
          id: 'a03-02-coats-done',
          lines: [N('Your Nubbin’s glow steadies. It has decided the black coats are on its side.')],
        },
      },
      {
        id: 'a03-02-s2',
        goal: 'Walk with the guardians and hear what happens next.',
        hint: 'Follow the three black coats down the road of white sand.',
        check: 'walk:a03-guardians:sand-road',
        scene: {
          id: 'a03-02-paragon',
          lines: [
            N('The street goes thin and pale, and then it is sand, white and fine, running down a long slope into a grey sky.'),
            GR('Here is how it works. The dead come before the Ten Kings. Seven trials, in seven hells, in forty-nine days.'),
            GR('Most of the dead we walk are just the dead. You are a paragon, Kim Ja-hong. You died for someone who wasn’t yours.'),
            DC('A paragon who passes all seven is born again. A new life! It hardly ever happens. We’re so lucky to have you.', 'happy'),
            HW('We’ll see. Paragons are always the ones with the most in the cupboard.'),
            JH('I’m not a good man. You’ve got the wrong file. I did things.'),
            DC('That’s what they all say. The good ones, I mean.', 'soft'),
            GR('We are your defence. We’ll need evidence for every trial. The courts don’t believe us. They believe what they can see.'),
          ],
        },
        done: {
          id: 'a03-02-paragon-done',
          lines: [
            GR('Which is where you come in, witness. The living see things here that we have stopped seeing.'),
            N('He hands you a little wooden tag on a black cord. It says, in a very neat hand, Visitor.'),
          ],
        },
      },
      {
        id: 'a03-02-s3',
        goal: 'Reach the first gate of the jeoseung.',
        hint: 'Keep going down the sand road until the gate comes into view.',
        check: 'explore:a03-jeoseung:first-gate',
        scene: {
          id: 'a03-02-gate',
          lines: [
            N('At the bottom of the slope there is a gate as tall as a cliff, with ten doors set in it, all shut.'),
            N('Other dead are queuing in a long quiet line, most of them old, a few not. Everybody is holding a number.'),
            HW('Paragon. Front of the queue. Mind out.'),
            DC('Say sorry when you push past. It’s their last queue. Be nice.'),
            N('Ja-hong says sorry to every single person in the line. Some of them pat his arm as he goes by.'),
            N('Your Nubbin’s glow brightens as you pass an old woman. She smiles at it and gives it her number to hold.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a03-02-complete',
      lines: [
        N('The first door opens on its own, slowly, with the sound of somebody very old clearing their throat.'),
        GR('Welcome to the jeoseung. The world of the dead. You’ll find it better organised than the other one.'),
        HW('Better paperwork, anyway.'),
        DC('Day one of forty-nine. We can do this. We can. Can’t we?', 'think'),
        N('Your Nubbin gives the old woman’s number back to her, very carefully, before you go through.'),
      ],
    },
    rewards: [],
    sets: { 'a03-02': true },
    notes:
      'CARE: the jeoseung saja are dignified messengers, grave and dutiful; Haewonmak’s temper and Deok-choon’s tears ' +
      'are the comedy, never the role. Draw the gat (wide black hat) and coats with care and accuracy (adviser). ' +
      'The queue of the dead is quiet and kind: old people mostly, nobody frightening, nobody hurt. The "Visitor" tag ' +
      'is a page prop, not a reward. A day counter (Day 1 of 49) appears on the page’s corner from here; it is a ' +
      'story counter that moves only with the quests, never in real time (no timer).',
  },

  // ---------------------------------------------------------------- A3-3
  {
    id: 'a03-03',
    code: 'A3-3',
    title: 'The Hell of Murder',
    source: `${SRC}: the first trial`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-2') },
    requires: ['A3-2'],
    speakers: [GANGRIM, HAEWON, DEOK, JAHONG, ACCUSER, KMURDER, CLERK],
    steps: [
      {
        id: 'a03-03-s1',
        goal: 'Attend the first trial, in the Hell of Murder.',
        hint: 'Cross the bridge over the fire lake into the court.',
        check: 'visit:a03-court:murder',
        scene: {
          id: 'a03-03-court',
          lines: [
            N('The first court sits on a bridge over a lake of slow fire. The heat comes up through your boots.'),
            N('The King of the Hell of Murder looks down from a desk as high as a house. He has the face of someone who has heard every excuse twice.'),
            AC('Kim Ja-hong. Seven years ago, in a fire, his partner died in a stairwell. Ja-hong came out. His partner did not.'),
            AC('He left a man behind to save his own skin. The court calls that a killing.'),
            N('Ja-hong doesn’t argue. He looks at his boots, the way a man does who has said this to himself for seven years.'),
            DC('Say something! Tell them!', 'shock'),
            JH('It’s true. I came out and he didn’t.'),
            KM('The defence?'),
            GR('We ask the court’s leave to bring the mirror.'),
          ],
        },
        done: {
          id: 'a03-03-court-done',
          lines: [
            KM('Granted. You have until the lake turns over.'),
            HW('That’s not long. It turns over a lot.'),
          ],
        },
      },
      {
        id: 'a03-03-s2',
        goal: 'Find the stairwell in the mirror archive.',
        hint: 'Search the mirrors with your Nubbin; its glow brightens near the right one.',
        check: 'inspect:a03-mirror:stairwell',
        scene: {
          id: 'a03-03-mirror',
          lines: [
            N('Under the bridge there is a hall of mirrors, row after row, each one the size of a door and each one a life.'),
            CL('Kim Ja-hong. Third aisle, seventh shelf. He’s been a firefighter a long time; there’s a lot of smoke in there. Mind your eyes.'),
            N('In the mirror, fires go by like pages: a kitchen, a warehouse, a bus, a block of flats. In every one he goes in first.'),
            N('Your Nubbin presses its paws against the glass at one fire and goes bright, then brighter.'),
            N('A stairwell, two firefighters and a boy. A beam has come down across the older man’s legs.'),
            N('The older man is shouting at Ja-hong. You can’t hear it, but you don’t need to: he is pointing at the boy, then at the door.'),
            N('Ja-hong carries the boy out, and then, in the mirror, he goes back in, twice. The second time they pull him out by his coat.'),
          ],
          choices: [
            {
              id: 'court',
              label: 'Take it straight to the court.',
              then: [GR('Good. Courts like things straight.')],
            },
            {
              id: 'him',
              label: 'Show Ja-hong first.',
              then: [
                N('Ja-hong watches himself go back in. He watches it twice, as if the second time it might go differently.'),
                JH('I don’t remember going back. I only remember coming out.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'a03-03-mirror-done',
          lines: [CL('I’ll unhook it for you. Carry it flat. Lives don’t like being tipped.')],
        },
      },
      {
        id: 'a03-03-s3',
        goal: 'Bring the mirror to the bench.',
        hint: 'Carry it back up to the court before the lake turns over.',
        check: 'deliver:a03-evidence:murder-bench',
        scene: {
          id: 'a03-03-verdict',
          lines: [
            N('The mirror plays the stairwell for the whole court. The fire lake goes very still to watch.'),
            AC('He still came out alive.'),
            GR('He came out because his partner told him to take the child, and he obeyed. Then he went back. The mirror is plain about it.'),
            N('The King of the Hell of Murder looks for a long time. Then he lifts his brush.'),
            KM('Not guilty. A man who goes back into a fire is not a man who left anyone behind.'),
            KM('The court notes that the accused has been holding his own trial on this for seven years. It may stop now.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a03-03-complete',
      lines: [
        N('Out on the far bank, Ja-hong sits down on the sand as if his legs have only just found out what happened.'),
        JH('I should have gone back a third time.'),
        DC('You did go back. It’s in the mirror. It’s been in the mirror the whole time.', 'sad'),
        HW('One down. Don’t get comfortable. Comfortable is how they get you in the next one.'),
        N('Your Nubbin climbs into Ja-hong’s lap and sits there, glowing, until he puts one big careful hand on its back.'),
      ],
    },
    rewards: [],
    sets: { 'a03-03': true },
    notes:
      'STAGING: the trial evidence is our own staging of the film’s first trial (a colleague’s death in a fire); confirm the ' +
      'beats with the script supervisor. The mirror archive is the films’ karmic mirror in our own design. In the mirror, ' +
      'no one is hurt on screen: the beam is across the partner’s legs and he is calm. The lake "turning over" is a slow ' +
      'roll of light, not a timer the player can fail.',
  },

  // ---------------------------------------------------------------- A3-4
  {
    id: 'a03-04',
    code: 'A3-4',
    title: 'The Hell of Indolence',
    source: `${SRC}: the second trial`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-3') },
    requires: ['A3-3'],
    speakers: [GANGRIM, HAEWON, DEOK, JAHONG, ACCUSER, KIDLE],
    steps: [
      {
        id: 'a03-04-s1',
        goal: 'Attend the second trial, in the Hell of Indolence.',
        hint: 'Walk the endless road to the court at its end.',
        check: 'visit:a03-court:indolence',
        scene: {
          id: 'a03-04-road',
          lines: [
            N('The road to the second court rolls backwards under your feet. You walk and walk and the court stays exactly as far away.'),
            HW('The only way to get there is to stop trying to get there. Don’t ask me. I didn’t build it.'),
            N('You stop, and the road stops. The court is suddenly right in front of you, looking smug.'),
            N('The King of the Hell of Indolence is reclining on cushions. He has not moved in a very long time, on purpose.'),
            AC('The accused had a mother and a brother. For fifteen years he did not go home. Not for a holiday. Not for a single night.'),
            AC('He worked, yes. He hid in work. A man too busy to love is idle where it counts.'),
            KI('Interesting. Was he busy, or was he hiding? Show me.'),
          ],
        },
        done: {
          id: 'a03-04-road-done',
          lines: [GR('We need what he did with his time. All of it. Rosters. Receipts. Anything with a date on it.')],
        },
      },
      {
        id: 'a03-04-s2',
        goal: 'Collect the record of Ja-hong’s working years.',
        hint: 'The ledger shelves are behind the court; your Nubbin can reach the low ones.',
        check: 'collect:a03-receipts:ledger',
        scene: {
          id: 'a03-04-ledger',
          lines: [
            N('Behind the court there are shelves of ledgers, one for every life. His is thick and grubby at the edges.'),
            N('Shift rosters: nights, doubles, holidays, more nights. Somebody else’s Christmas covered, somebody else’s wedding covered.'),
            N('Your Nubbin pulls out a bundle tied with string from the low shelf. It is receipts for money orders, one a month.'),
            N('Every month for fifteen years, to the same address in a small town. Never a letter with them, just the money.'),
            DC('He sent everything home. He kept just enough to eat. Look, look, he ate ramyeon for a whole year.', 'sad'),
            JH('It wasn’t anything. It was just money.'),
            HW('It was all your money. That’s a different thing.'),
          ],
          choices: [
            {
              id: 'much',
              label: 'Argue that he worked too much, not too little.',
              then: [GR('Good. Not idle. Tired. The court knows the difference, if it is shown.')],
            },
            {
              id: 'family',
              label: 'Argue that it was all for his family.',
              then: [DC('Yes! Every won of it. You can’t call that hiding. Can you?', 'think')],
            },
            {
              id: 'ask',
              label: 'Ask Ja-hong why he never went home.',
              then: [
                N('He looks at the receipts for a while. He takes one out and smooths it flat with his thumb.'),
                JH('Because I couldn’t look at her. Sending money was the bit I could do.', 'sad'),
              ],
            },
          ],
        },
        done: {
          id: 'a03-04-ledger-done',
          lines: [N('The bundle is heavier than paper should be. Your Nubbin insists on carrying it.')],
        },
      },
      {
        id: 'a03-04-s3',
        goal: 'Wait for the king of indolence to rule.',
        hint: 'Stand by the cushions while he reads. He is in no hurry.',
        check: 'wait:a03-court:indolence',
        scene: {
          id: 'a03-04-ruling',
          lines: [
            N('Haewonmak sits down on the floor to wait, which nobody has ever done in front of this king. The king approves.'),
            N('The king reads every receipt. It takes him a very long time, and he enjoys every minute of it.'),
            KI('This man never rested. Not once in fifteen years. That is a sin of a sort, but not the sort this court tries.'),
            KI('The charge was idleness. The record says the opposite. Whatever he was hiding from, it was not from work.'),
            KI('Not guilty. Go away, all of you, and someone take that tired man somewhere he can sit.'),
            N('Deok-choon bursts into tears, which she will do at every verdict from here on.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a03-04-complete',
      lines: [
        N('The rolling road lets you go without any argument. On the far side, Ja-hong does sit, because a king told him to.'),
        HW('Two down. And he cried in neither. That’s suspicious. Usually they cry.'),
        DC('I cried for him. That counts.', 'happy'),
        GR('Next is deceit. It is usually the hardest. Everybody has told a lie.'),
        JH('I wrote some letters. You should know before we go in. I wrote letters.'),
      ],
    },
    rewards: [],
    sets: { 'a03-04': true },
    notes:
      'STAGING: the rolling road is our own image for the Hell of Indolence (confirm with the adviser that it sits ' +
      'respectfully beside the films’ version). The king is drawn languid and comic in manner, never in office: his ' +
      'judgement is serious. Ramyeon (instant noodles) is a gentle, real detail. "Won" in Deok-choon’s line is the ' +
      'currency (not Private Won, who comes later); keep the lower-case.',
  },

  // ---------------------------------------------------------------- A3-5
  {
    id: 'a03-05',
    code: 'A3-5',
    title: 'The Hell of Deceit',
    source: `${SRC}: the third trial, and the letters`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-4') },
    requires: ['A3-4'],
    speakers: [GANGRIM, HAEWON, DEOK, JAHONG, ACCUSER, KDECEIT, CLERK],
    steps: [
      {
        id: 'a03-05-s1',
        goal: 'Hear the charge in the Hell of Deceit.',
        hint: 'Go into the court of echoes and stand with the defence.',
        check: 'visit:a03-court:deceit',
        scene: {
          id: 'a03-05-court',
          lines: [
            N('In the third court every word comes back twice: once as it was said, and once as it was meant. It is very noisy.'),
            AC('The accused wrote letters to grieving families. He signed them with the names of the people he failed to save.'),
            AC('“Mum, it didn’t hurt.” “Dad, I wasn’t scared.” Written by a stranger, in a dead child’s name. That is forgery.'),
            N('The echo comes back, and the room hears it the second way too: Please don’t lie awake.'),
            KD('Is this true?'),
            JH('Yes. Eleven of them. Over the years. The ones I couldn’t get out.'),
            KD('Why?'),
            JH('Because I was there, and their families weren’t. Somebody had to tell them something.'),
          ],
        },
        done: {
          id: 'a03-05-court-done',
          lines: [GR('The court will want to see one of them land. Witness, go and find a letter that was kept.')],
        },
      },
      {
        id: 'a03-05-s2',
        goal: 'Find a family who kept one of the letters.',
        hint: 'Ask the Mirror Clerk; your Nubbin will know the right house.',
        check: 'find:a03-letters:bereaved',
        scene: {
          id: 'a03-05-letters',
          lines: [
            CL('Eleven letters, eleven houses. Most were read once and put in a drawer. One was not. Fourth mirror on the left.'),
            N('In the mirror there is a small flat in the evening. A man is eating dinner alone with the radio on.'),
            N('On the wall by the table there is a letter in a frame, in pencil, in big round writing. Under it, a school photo of a girl.'),
            N('He finishes eating, rinses his bowl, and before he turns the light off he touches the frame. Just the corner.'),
            N('Your Nubbin touches the glass of the mirror in the same place, at the same moment.'),
            CL('He does that every night. Nine years. He knows it isn’t her writing, you know. He worked it out the first week.'),
            CL('He kept it up anyway.'),
          ],
        },
        done: {
          id: 'a03-05-letters-done',
          lines: [N('The Clerk lends you the mirror. You carry it back the way you carried the first one: flat, and very carefully.')],
        },
      },
      {
        id: 'a03-05-s3',
        goal: 'Decide what the letters were.',
        hint: 'The defence will use your answer. Think it over before you speak.',
        check: 'choose:a03-letters:argument',
        scene: {
          id: 'a03-05-choice',
          lines: [
            N('Outside the court, the guardians argue in whispers while the echoes argue in shouts.'),
            HW('They were lies. Nice ones. Lies with a ribbon on. Still lies.', 'angry'),
            DC('They were kind! Did you see that man touch the frame?', 'sad'),
            GR('We will use one argument, not three. The court hates a defence that can’t make up its mind.'),
            GR('Witness. You saw the frame. You decide what we say.'),
            N('Ja-hong doesn’t look at you. He is holding the mirror, watching a man in a small flat turn off his light.'),
          ],
          choices: [
            {
              id: 'kindness',
              label: 'They were kindness. Not lies.',
              set: { 'a03-letters': 'kindness' },
              then: [
                Y('He said what their children would have said, if they’d had the chance. That’s not a lie. That’s a message, carried.'),
                DC('Yes. Yes, that.', 'happy'),
              ],
            },
            {
              id: 'lies',
              label: 'They were lies. He should own them.',
              set: { 'a03-letters': 'lies' },
              then: [
                Y('They were lies. Let him say so. A man who owns his lies isn’t a liar any more.'),
                HW('Huh. I like that. Honest about the dishonest bit.', 'think'),
              ],
            },
            {
              id: 'both',
              label: 'Both. He lied so they could sleep.',
              set: { 'a03-letters': 'both' },
              then: [
                Y('They were lies, and they were kind. He knew the price and paid it so they could sleep.'),
                GR('Both. Courts don’t like both. Let’s see if this one does.', 'think'),
              ],
            },
          ],
        },
        done: {
          id: 'a03-05-choice-done',
          lines: [
            N('Gang-rim makes your argument to the court, word for word. The echoes come back the same both times, which never happens.'),
            KD('Not guilty. Go on before I change my mind. And keep that mirror flat.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a03-05-complete',
      lines: [
        N('On the steps, Ja-hong gives the mirror back to the Clerk and stands with his hands empty, not sure what to do with them.'),
        JH('You decided that quickly.'),
        GR('The witness decided it. Remember what they said. You may need it again.', 'think'),
        JH('Eleven letters. I never wrote one to my own mother. Not in fifteen years. Just the money.'),
        N('Nobody says anything. Your Nubbin goes and stands on his boot, which is all it can think of.'),
      ],
    },
    rewards: [],
    sets: { 'a03-05': true },
    notes:
      'SIGNATURE CHOICE (a03-05-choice): a03-letters = kindness | lies | both. It is the argument you make at the trial ' +
      'of filial impiety six quests later (A3-11, a03-11-plea*), and it sets the voice of the verdict (A3-13, ' +
      'a03-13-verdict*) and of Gang-rim’s defiance (A3-14, a03-14-defy*). The quoted letter lines in a03-05-court#2 are ' +
      'original. The bereaved father is narration only. Echo staging: the second, "meant" version of a line appears as ' +
      'a faint second caption under the first.',
  },

  // ---------------------------------------------------------------- A3-6
  {
    id: 'a03-06',
    code: 'A3-6',
    title: 'Two Quiet Gates',
    source: `${SRC}: the hells of injustice and betrayal`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-5') },
    requires: ['A3-5'],
    speakers: [GANGRIM, HAEWON, DEOK, JAHONG],
    steps: [
      {
        id: 'a03-06-s1',
        goal: 'Pass through the gates of Injustice and Betrayal.',
        hint: 'Walk with the guardians through both gates.',
        check: 'walk:a03-gates:injustice-betrayal',
        scene: {
          id: 'a03-06-gates',
          lines: [
            N('The fourth court is a long hall of scales. The king there looks at Ja-hong once, and stamps a paper, and waves.'),
            N('The fifth court is a gate of knotted rope, and its king doesn’t even look up. Another stamp, another wave.'),
            N('It’s over before your Nubbin has finished being nervous about it.'),
            JH('That’s it? Two trials? Nobody asked me anything.', 'shock'),
            HW('Don’t complain. People don’t usually complain about not being shouted at.'),
            N('Gang-rim is already walking on, quickly. Faster than he walked anywhere else.'),
          ],
        },
        done: {
          id: 'a03-06-gates-done',
          lines: [N('Day twenty-one of forty-nine. You have the feeling that was supposed to take longer.')],
        },
      },
      {
        id: 'a03-06-s2',
        goal: 'Find out why the gates opened so easily.',
        hint: 'Someone in a black coat knows. Pick who to ask.',
        check: 'talk:a03-guardians:why',
        scene: {
          id: 'a03-06-why',
          lines: [
            N('You fall in step beside the guardians. Ja-hong is a little way ahead, out of earshot.'),
            N('He is counting on his fingers as he walks: the days gone, the days left, the courts still to come.'),
            N('Gang-rim walks with his list held tight against his coat, as if somebody might try to read it.'),
            N('Haewonmak whistles, badly, the way people do when they are trying to look like they have nothing to say.'),
            N('Deok-choon keeps glancing back at the two quiet gates, and then at Gang-rim, and then at her own feet.'),
            N('Your Nubbin looks from one black coat to another. It has noticed the hurry too.'),
          ],
          choices: [
            {
              id: 'deok',
              label: 'Ask Deok-choon.',
              then: [
                DC('Those kings found nothing to try him for. He never betrayed anybody. And the unfairness he did, he paid back.', 'soft'),
                DC('And also… he’s our forty-eighth. Paragons, I mean. At forty-nine, we… oh. I wasn’t meant to say.', 'shock'),
              ],
            },
            {
              id: 'haewon',
              label: 'Ask Haewonmak.',
              then: [
                HW('Because he’s clean on those two. And because we need him through. He’s our forty-eighth.'),
                HW('A thousand years we’ve been walking the dead. Forty-nine paragons reborn, and we get to be born again too. That’s the deal.'),
              ],
            },
            {
              id: 'gangrim',
              label: 'Ask Gang-rim why he’s hurrying.',
              then: [
                GR('Because we have twenty-eight days and two hells left, and the hardest is last.'),
                N('He says it smoothly. Behind his back, Haewonmak holds up four fingers and then eight: forty-eight.'),
              ],
            },
          ],
        },
        done: {
          id: 'a03-06-why-done',
          lines: [N('A thousand years of walking other people to their next lives. You look at the three black coats differently after that.')],
        },
      },
    ],
    complete: {
      id: 'a03-06-complete',
      lines: [
        N('Gang-rim slows down at last, and waits for you to catch up.'),
        GR('Yes. He is the forty-eighth. And yes, it matters to us. It matters a great deal.'),
        GR('But forty-eight is a number, and he is a man. Don’t let me mix them up. If I do, say so.'),
        N('He means it. You can tell because Haewonmak stops pretending not to listen.'),
        HW('I’ll say so. Loudly. I’ve been waiting a thousand years for permission.'),
      ],
    },
    rewards: [],
    sets: { 'a03-06': true },
    notes:
      'The outline’s "ask why" is the step 2 choice; every branch reveals the forty-eighth paragon (the films’ guardians ' +
      'are promised rebirth after forty-nine paragons). Gang-rim’s "say so" line pays off in A3-14, where he is the one ' +
      'who chooses the man over the number. The day counter moves to Day 21 here.',
  },

  // ---------------------------------------------------------------- A3-7
  {
    id: 'a03-07',
    code: 'A3-7',
    title: 'The Storm',
    source: `${SRC}: the vengeful spirit`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-6') },
    requires: ['A3-6'],
    speakers: [GANGRIM, HAEWON, DEOK, JAHONG, SUHONG, YEOMRA],
    steps: [
      {
        id: 'a03-07-s1',
        goal: 'Shelter from the storm tearing through the courts.',
        hint: 'Get Ja-hong and your Nubbin behind the stone wall by the road.',
        check: 'wait:a03-storm:shelter',
        scene: {
          id: 'a03-07-storm',
          lines: [
            N('Halfway to the sixth court the sky goes the colour of a bruise. Then the wind arrives, all at once, from below.'),
            N('Sand lifts off the road in sheets. Somewhere behind you, a court’s roof comes off and goes past, still tidy.'),
            HW('That’s not weather. There’s no weather here. Somebody’s doing that.', 'angry'),
            DC('A vengeful spirit. In the world of the living. Somebody who died wrong and is shaking the floor to make us look.', 'shock'),
            GR('Get behind the wall. All of you. Witness, keep hold of the spark; it’s light enough to blow away.'),
            N('You tuck your Nubbin inside your coat. Its glow comes through the cloth like a lamp under a blanket.'),
          ],
        },
        done: {
          id: 'a03-07-storm-done',
          lines: [N('Behind the wall, the wind howls over your heads. It sounds almost like a voice, shouting one word over and over.')],
        },
      },
      {
        id: 'a03-07-s2',
        goal: 'Look into the eye of the storm.',
        hint: 'When the wind drops, look up over the wall with your Nubbin.',
        check: 'inspect:a03-storm:eye',
        scene: {
          id: 'a03-07-eye',
          lines: [
            N('For a moment the wind drops, and in the middle of it, high up, you see him: a young man in a soldier’s winter uniform.'),
            N('He is very angry, and very young. His face keeps coming and going, as if he can’t hold it together for long.'),
            SH('Somebody look! Somebody look at what they did!', 'angry'),
            N('Ja-hong stands up straight into the wind before anyone can stop him.'),
            JH('Su-hong?', 'shock'),
            N('The figure turns, and the wind turns with it, and for one second the storm is looking right at him. Then it tears away.'),
            JH('That’s my brother. That’s my little brother. He’s in the army. He’s twenty-two. He can’t be…', 'shock'),
          ],
          choices: [
            {
              id: 'hold',
              label: 'Take hold of Ja-hong’s sleeve.',
              then: [N('He lets you. Your Nubbin climbs out of your coat and up his arm, and holds on to his collar.')],
            },
            {
              id: 'gangrim',
              label: 'Ask Gang-rim what happens to a spirit like that.',
              then: [GR('If it isn’t settled, the kings will put it out like a lamp. And his brother’s trials stop till it is.', 'sad')],
            },
          ],
        },
        done: {
          id: 'a03-07-eye-done',
          lines: [DC('Oh no. Oh no, oh no. It’s family. It’s always worse when it’s family.', 'sad')],
        },
      },
    ],
    complete: {
      id: 'a03-07-complete',
      lines: [
        N('A messenger comes down the sand road with a scroll sealed in red. The guardians bow before they open it.'),
        YM('The vengeful spirit is the brother of your paragon. Settle it, or his trials end where they stand. You have till the sixth court sits.'),
        HW('I’ll go down. I’ll sort it. I’ll sort it with this.', 'angry'),
        GR('No. I’ll go. You two take Ja-hong to the sixth court and keep him out of the wind.'),
        GR('Witness, come with me. The living can see things in the living world that I can’t. Bring the spark.'),
        N('Ja-hong catches your arm as you go. He doesn’t say anything, and he doesn’t need to.'),
      ],
    },
    rewards: [],
    sets: { 'a03-07': true },
    notes:
      'STAGING: the storm is wind, sand and a torn sky; Su-hong is a figure in it whose face keeps forming and breaking, ' +
      'angry and grieving, never ghoulish. King Yeomra speaks through the scroll (his voice over the red seal); he is ' +
      'first seen in person in A3-10. CARE: the threat to "put it out like a lamp" is the films’ stakes (an unsettled ' +
      'vengeful spirit is destroyed) said once, plainly.',
  },

  // ---------------------------------------------------------------- A3-8
  {
    id: 'a03-08',
    code: 'A3-8',
    title: 'The Base',
    source: `${SRC}: Su-hong’s story in the world of the living`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-7') },
    requires: ['A3-7'],
    speakers: [GANGRIM, SUHONG, WON],
    steps: [
      {
        id: 'a03-08-s1',
        goal: 'Go to the army base where Su-hong served.',
        hint: 'Follow Gang-rim up the hill road to the guard post in the snow.',
        check: 'explore:a03-base:guard-post',
        scene: {
          id: 'a03-08-post',
          lines: [
            N('The world of the living is very loud after the jeoseung. Snow, diesel, a dog somewhere, a radio playing in a hut.'),
            N('The base is on a hill near a border fence. Young men in thick coats stamp their feet and look at nothing.'),
            GR('Nobody can see me here. They can see you, but they won’t look twice. Soldiers stop looking twice at things.'),
            N('On the noticeboard by the gate there is a poster with Su-hong’s face on it. Underneath it says DESERTER.'),
            GR('Missing three weeks. They say he walked off his post one night. The family has been told he ran.'),
            N('Your Nubbin looks at the poster for a long time. Its glow goes very small.'),
          ],
        },
        done: {
          id: 'a03-08-post-done',
          lines: [GR('A boy who ran wouldn’t be a vengeful spirit. Something happened here. Let’s find it.')],
        },
      },
      {
        id: 'a03-08-s2',
        goal: 'Find what the duty log leaves out.',
        hint: 'Check the guard hut. Your Nubbin can fit under the desk.',
        check: 'inspect:a03-base:duty-log',
        scene: {
          id: 'a03-08-log',
          lines: [
            N('The guard hut smells of wet wool and instant coffee. The duty log is on the desk, open, with a pen in the spine.'),
            N('One page has been cut out, neatly, with a ruler. Somebody wanted it gone and wanted nobody to notice.'),
            N('Your Nubbin squeezes under the desk and comes out with something in its mouth: the cut page, folded small, pushed behind the skirting.'),
            N('The night Su-hong vanished: two men on the post, Kim Su-hong and Won Dong-yeon. One shot fired, 02:10, “accidental”.'),
            N('Under it, in a different pen: “Reported to Lt. Park. Said not to write it down.”'),
            GR('Whoever cut this out couldn’t bring himself to burn it. That tells you who he is.', 'think'),
          ],
        },
        done: {
          id: 'a03-08-log-done',
          lines: [N('Through the hut window you can see the barracks. One light is still on, at three in the morning.')],
        },
      },
      {
        id: 'a03-08-s3',
        goal: 'Follow Private Won.',
        hint: 'Keep a little way behind him; let him go where he’s going.',
        check: 'watch:a03-won:mother-gate',
        scene: {
          id: 'a03-08-won',
          lines: [
            N('Private Won is nineteen and has not slept properly in three weeks. You can see it in the way he walks.'),
            N('On his day’s leave he doesn’t go home. He takes two buses to a small town, and stands at the gate of a small house.'),
            N('He takes his cap off, and puts it back on, and takes it off again and holds it in both hands.'),
            WN('Su-hong’s mother. I’m sorry to come like this. I have to tell you about Su-hong. I have to tell you the truth.', 'sad'),
            N('He is practising it under his breath. He has been practising it, you think, for three weeks.'),
            N('It is a house you have seen before, on a stack of money-order receipts. A woman is inside, in a chair by the window.'),
            N('Above you the sky is darkening. Su-hong is coming, and he is angry, and the snow is starting to blow sideways.'),
            GR('If his brother’s storm reaches this house now, it will hurt the people in it. Including the one he loves.'),
          ],
          choices: [
            {
              id: 'glow',
              label: 'Let your Nubbin glow, so Won sees he isn’t alone.',
              then: [
                N('Your Nubbin steps out into the snow by the gate and glows as brightly as it can. Won sees it, though he doesn’t know what it is.'),
                N('He takes it as a sign anyway, the way people do, and pushes the gate open.'),
              ],
            },
            {
              id: 'wait',
              label: 'Stay hidden and let him find his own nerve.',
              then: [
                N('You stay behind the wall while Won stands at the gate for a long minute. Then he pushes it open on his own.'),
                GR('Good. It has to be his.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'a03-08-won-done',
          lines: [
            N('Won kneels on the floor in front of the woman in the chair, and tells her. You can’t hear it through the glass.'),
            N('Over the house, the storm stops. Just stops, in the air, like someone holding their breath.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a03-08-complete',
      lines: [
        N('Su-hong comes down out of the sky, small now, a young man in the snow in a uniform too thin for it.'),
        SH('He told her. He actually told her.', 'shock'),
        GR('Tell me the rest, Kim Su-hong. I’m your guardian now. I need to hear it from you.'),
        SH('It was an accident. Dong-yeon’s rifle. Neither of us knew it was loaded. And then everybody was so frightened.'),
        SH('They hid what happened, and me with it. And they told my mum I ran.', 'sad'),
        N('He looks at the house. Inside, his mother has put her hand on the young soldier’s head, the way you would with a child.'),
        GR('You weren’t a deserter. It will be said in court, in front of kings. I promise you that.'),
      ],
    },
    rewards: [],
    sets: { 'a03-08': true },
    notes:
      'CARE (see the file header): Su-hong’s death is told only as "an accident", "everybody was so frightened" and "they ' +
      'hid what happened, and me with it". No wound, no burial, no body on screen. The films’ later scene of a soldier’s ' +
      'suicide attempt is LEFT OUT of this page entirely; Won is never shown in danger, and nothing hints at it. The ' +
      'officer (Lt. Park) is named once on the log and never appears. Won’s confession is seen through glass, unheard. ' +
      'Su-hong may speak in court from here on; he is a source character (canon 31), not a Nubbin.',
  },

  // ---------------------------------------------------------------- A3-9
  {
    id: 'a03-09',
    code: 'A3-9',
    title: 'The Hell of Violence',
    source: `${SRC}: the sixth trial`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-8') },
    requires: ['A3-8'],
    speakers: [GANGRIM, HAEWON, DEOK, JAHONG, SUHONG, ACCUSER, KVIOLENCE],
    steps: [
      {
        id: 'a03-09-s1',
        goal: 'Return to the jeoseung for the sixth trial.',
        hint: 'Go back down the sand road with Gang-rim and Su-hong.',
        check: 'visit:a03-court:violence',
        scene: {
          id: 'a03-09-court',
          lines: [
            N('The sixth court is a ring of black iron in a field of ice. Haewonmak and Deok-choon are waiting at its edge, stamping their feet.'),
            DC('You’re back! You found him! Is that… is that him?', 'happy'),
            N('Su-hong walks a step behind Gang-rim and doesn’t look at his brother. Ja-hong can’t look at anything else.'),
            AC('The Hell of Violence. The accused struck a member of his own family, and left him lying on a doorstep in the dark.'),
            AC('The victim is present. How convenient. Let the victim speak.'),
            KV('Kim Su-hong. Did your brother strike you?'),
          ],
        },
        done: {
          id: 'a03-09-court-done',
          lines: [N('Su-hong looks at the iron floor for a long time. The ice creaks.')],
        },
      },
      {
        id: 'a03-09-s2',
        goal: 'Stay near the brothers while Su-hong gives his evidence.',
        hint: 'Choose where you and your Nubbin stand in the ring.',
        check: 'talk:a03-suhong:witness',
        scene: {
          id: 'a03-09-witness',
          lines: [
            SH('Yes. Once. The night he left home. I was seven.'),
            SH('I ran after him down the lane in my socks and grabbed his bag, and he pushed me off, hard. I hit the step.'),
            SH('He didn’t stop. He didn’t look round. He never came back, not once, not in fifteen years.', 'angry'),
            JH('I didn’t look round because if I had I’d have stayed. And I couldn’t stay. Not after that night.', 'sad'),
            KV('Which night?'),
            JH('The worst night. That’s for another court. I won’t say it in this one.'),
            N('The ice goes quiet. Even the Accuser doesn’t push.'),
          ],
          choices: [
            {
              id: 'suhong',
              label: 'Stand by Su-hong.',
              then: [N('You go and stand by Su-hong, and your Nubbin sits on his boot. He looks down at it, startled, and some of the anger goes out of his face.')],
            },
            {
              id: 'jahong',
              label: 'Stand by Ja-hong.',
              then: [N('You stand by Ja-hong, a little behind him, and your Nubbin leans on his leg. He puts his hand down without looking.')],
            },
            {
              id: 'between',
              label: 'Stand in the middle, between them.',
              then: [N('You stand in the empty space between them. After a while, each of them takes one small step closer to it.')],
            },
          ],
        },
        done: {
          id: 'a03-09-witness-done',
          lines: [KV('The one who was wronged is in the room. The court will hear what he wants.')],
        },
      },
    ],
    complete: {
      id: 'a03-09-complete',
      lines: [
        SH('He hit me once. I’ve hit him back a hundred times since, in my head. I think we’re about even.'),
        SH('I don’t want him in a hell for it. I want him to have looked round.', 'sad'),
        KV('Then he passes. A wound the wounded one forgives is out of this court’s hands.'),
        N('Deok-choon cries, as promised. Haewonmak pretends something is in his eye, and then admits it’s tears, and then is cross about admitting it.'),
        N('Su-hong and Ja-hong walk out of the iron ring side by side, not touching. It is more than they have managed in fifteen years.'),
      ],
    },
    rewards: [],
    sets: { 'a03-09': true },
    notes:
      'CARE: the push is told, not shown; a boy in socks, a step, nothing more. "The worst night" is named here for the ' +
      'first time, only as that, and Ja-hong refuses to tell it in this court; it belongs to A3-11, where it is still ' +
      'never told. The trial details are our own staging of the films’ Hell of Violence (confirm with the adviser).',
  },

  // ---------------------------------------------------------------- A3-10
  {
    id: 'a03-10',
    code: 'A3-10',
    title: 'The Brothers’ Trial',
    source: `${SRC}: two souls, one judgement`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-9') },
    requires: ['A3-9'],
    speakers: [GANGRIM, HAEWON, DEOK, JAHONG, SUHONG, YEOMRA],
    steps: [
      {
        id: 'a03-10-s1',
        goal: 'Hear what the kings mean to do with Su-hong.',
        hint: 'Talk to Gang-rim outside the great hall.',
        check: 'talk:a03-gangrim:case',
        scene: {
          id: 'a03-10-bound',
          lines: [
            N('The last court is the great hall of King Yeomra, and its doors are taller than anything you have ever seen made by hands.'),
            N('Outside them, Gang-rim reads a second red-sealed scroll. He reads it twice, which you have not seen him do before.'),
            GR('The kings say the storm was a crime. A spirit who shakes the jeoseung is to be judged first, and closed.'),
            HW('Closed. That means put out. Like a lamp.', 'angry'),
            DC('But he’s calm now. Look at him. He’s just sitting on the steps with his brother!', 'sad'),
            GR('Then we ask for one judgement for both. Two brothers, one family, one hearing. If he was wronged, the court must say so.'),
          ],
        },
        done: {
          id: 'a03-10-bound-done',
          lines: [GR('For that, the court needs proof he died wrong. Witness, you still have the page from the duty log?')],
        },
      },
      {
        id: 'a03-10-s2',
        goal: 'Lay the duty log page before King Yeomra.',
        hint: 'Carry the folded page up the long hall to the high desk.',
        check: 'deliver:a03-log:yeomra',
        scene: {
          id: 'a03-10-trial',
          lines: [
            N('King Yeomra is not old and not young. He looks like a man who has been fair for a very long time, and is tired of it, and is fair anyway.'),
            YM('A wronged spirit is still a spirit that broke the peace. Show me why I should not close him.'),
            N('Your Nubbin carries the folded page in its mouth up the long hall. It is the longest walk it has ever taken, and it doesn’t hurry.'),
            N('It lays the page on the lowest step of the high desk, and steps back.'),
            YM('One shot. “Accidental.” “Said not to write it down.”', 'think'),
            GR('He was not a deserter, Majesty. He was hidden, and his mother was told he ran. The storm was a boy shouting to be found.'),
            YM('And he was found. Very well. The spirit will not be closed today.'),
          ],
        },
        done: {
          id: 'a03-10-trial-done',
          lines: [YM('The brothers will be judged together, in my court, for what remains. Rest. My hall opens at first light.')],
        },
      },
      {
        id: 'a03-10-s3',
        goal: 'Wait with the brothers on the steps.',
        hint: 'Sit down near them. Nobody needs to say anything.',
        check: 'sit:a03-brothers:steps',
        scene: {
          id: 'a03-10-sit',
          lines: [
            N('Night in the jeoseung is the same grey as day, only quieter. The two brothers sit on the steps of the great hall.'),
            N('They don’t talk. Fifteen years is a lot of not talking to break, and neither of them knows where to start.'),
            N('Ja-hong has his hands between his knees, and Su-hong has his arms folded. They sit exactly as far apart as two people can on one step.'),
            N('Above them the great doors are shut. Somewhere inside, King Yeomra’s brush is still moving.'),
            N('Your Nubbin looks at the gap between the brothers. It is just about the right size for a Nubbin.'),
            N('The guardians keep a little way off. Deok-choon looks at you, and at the step beside them, and nods.'),
          ],
          choices: [
            {
              id: 'sit',
              label: 'Sit down beside them, and wait.',
              then: [
                N('You sit down on the step. Your Nubbin sits down between the two brothers, glowing, a small lamp nobody has to tend.'),
                N('After a long time Su-hong says, “You got fat,” and Ja-hong says, “You got tall.” That will do, for a start.', 'soft'),
              ],
            },
            {
              id: 'leave',
              label: 'Leave them alone together.',
              then: [
                N('You leave them to it, and sit with the guardians instead. Your Nubbin stays behind on the step without being asked.'),
                N('Much later, you hear Su-hong laugh at something. Just once, short and surprised, as if it got out on its own.', 'soft'),
              ],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a03-10-complete',
      lines: [
        N('Near first light, Su-hong comes and finds you. He has your Nubbin in his arms, asleep, and hands it over very carefully.'),
        SH('Tomorrow’s the one about the worst night. He’s scared. He won’t say, but he is.'),
        SH('I was there that night, you know. I was little. I don’t know what I saw. I’ve never asked.'),
        N('He looks back at his brother, who is pretending to be asleep against a pillar.'),
        SH('I think I don’t want to know. I think I just want him to get through.', 'sad'),
      ],
    },
    rewards: [],
    sets: { 'a03-10': true },
    notes:
      'Merges the outline’s "two souls, one judgement" with the evidence hand-in: the duty log page from A3-8 is the ' +
      'proof. Hazel’s third rule is acted in a03-10-sit ("sit") and never quoted. CARE: Su-hong’s last lines name the ' +
      'worst night and refuse to tell it; nothing is explained. King Yeomra is first seen here: severe, fair, tired, ' +
      'never mocked (adviser).',
  },

  // ---------------------------------------------------------------- A3-11
  {
    id: 'a03-11',
    code: 'A3-11',
    title: 'The Hell of Filial Impiety',
    source: `${SRC}: the seventh trial`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-10') },
    requires: ['A3-10'],
    speakers: [GANGRIM, HAEWON, DEOK, JAHONG, SUHONG, YEOMRA, ACCUSER],
    steps: [
      {
        id: 'a03-11-s1',
        goal: 'Enter King Yeomra’s hall for the last trial.',
        hint: 'Walk in with the brothers and the guardians at first light.',
        check: 'visit:a03-court:yeomra',
        scene: {
          id: 'a03-11-hall',
          lines: [
            N('The doors of the great hall open by themselves, and the light that comes out is the colour of first light, only steadier.'),
            N('King Yeomra sits high. The Accuser stands below him with one scroll, and only one, very thin.'),
            AC('The Hell of Filial Impiety. The charge is the worst a child can answer: harm to a parent.'),
            AC('One night, fifteen years ago. The accused will not speak of it. He has not spoken of it to anyone, ever.'),
            YM('He doesn’t need to speak of it. This court has the mirror.'),
            N('Ja-hong closes his eyes. Su-hong, beside him, takes hold of the back of his brother’s coat, the way a small boy would.'),
          ],
        },
        done: {
          id: 'a03-11-hall-done',
          lines: [DC('Whatever happens, we’re here. We’re right here. All three of us. Four. Five, with the spark.', 'sad')],
        },
      },
      {
        id: 'a03-11-s2',
        goal: 'Stand with Ja-hong while the mirror shows the court the worst night.',
        hint: 'You won’t be shown it. Stay where he can see you.',
        check: 'watch:a03-mirror:door',
        scene: {
          id: 'a03-11-door',
          lines: [
            N('A great mirror turns to face the kings. What it shows, it shows to them.'),
            N('From where you stand you see only the edge of it: the door of a small house at night, shut, and a light going on inside.'),
            N('That is all you are shown, and all you need. The hall is so quiet you can hear the Accuser’s scroll uncurl.'),
            N('When the mirror turns away, King Yeomra sits very still. The Accuser doesn’t say anything at all.'),
            JH('I was nineteen. She’d been ill for years. Su-hong was little. There wasn’t any money. I wasn’t thinking straight.', 'sad'),
            JH('I’m not saying that makes it all right. Nothing does. I ran in the morning and I never went back. That’s all of it.'),
          ],
          choices: [
            {
              id: 'look',
              label: 'Keep your eyes on Ja-hong.',
              then: [N('He finds your face across the hall and holds on to it, the way people in the sea hold on to whatever floats.')],
            },
            {
              id: 'nubbin',
              label: 'Let your Nubbin go to him.',
              then: [N('Your Nubbin walks out alone across the great floor, small and glowing, and sits down against his boot. Nobody stops it.')],
            },
          ],
        },
        done: {
          id: 'a03-11-door-done',
          lines: [YM('Does the defence have anything to say? Anything at all?')],
        },
      },
      {
        id: 'a03-11-s3',
        goal: 'Make the argument for Ja-hong.',
        hint: 'Gang-rim gives the floor to you. Say what you decided about the letters.',
        check: 'talk:a03-yeomra:plea',
        scene: {
          id: 'a03-11-plea',
          lines: [
            GR('Majesty, the defence asks that the witness speak. They saw the letters land. Let them say what they told the Hell of Deceit.'),
            Y('He wrote eleven letters to strangers, in other people’s names. They weren’t lies. They were kindness, carried the long way round.'),
            Y('He couldn’t say sorry at home, so he said it for other people’s children, to other people’s mothers. Eleven times.'),
            Y('And every month for fifteen years he sent everything he had to her. That’s a letter too. He just couldn’t write the words.'),
            N('Ja-hong is crying now, without any sound, the way grown men do when they have had a lot of practice not crying.'),
            YM('Kindness to strangers is not the same as asking forgiveness of the one you wronged.', 'think'),
            YM('This court cannot forgive what a mother has not. I will hear her before I rule.'),
            AC('Majesty, the mother cannot speak. She has not spoken in years. And she is living.'),
          ],
        },
        done: {
          id: 'a03-11-plea-done',
          lines: [GR('Then we will go where the living can speak, Majesty. We will go into her dream.')],
        },
      },
    ],
    complete: {
      id: 'a03-11-complete',
      lines: [
        N('King Yeomra looks down at Gang-rim for a long moment. The whole hall waits.'),
        YM('Guardians do not walk in the dreams of the living. You know this.'),
        GR('I know it. I’m asking anyway.'),
        YM('Then take the brother. A son may visit his mother’s sleep. And take the witness, and the spark, to carry back what she says.'),
        YM('Bring me her answer, and I will rule on it. Whatever it is.'),
        N('Ja-hong doesn’t look up. Su-hong lets go of the back of his brother’s coat, and squares his shoulders, and goes.'),
      ],
    },
    rewards: [],
    sets: { 'a03-11': true },
    notes:
      'CONTENT NOTE: before a03-11-hall plays, play ATLAS_A03_VARIANTS a03-11-note. Its "not now" choice closes the ' +
      'page and returns to the atlas without progress, and the note plays again next time; once the player picks ' +
      '"Go on" it may be skipped on replays. Under the note, the UI shows a ' +
      'localised support line from strings (a crisis line for the player’s region, e.g. 988 in the US, Samaritans in ' +
      'the UK, 109 in Korea; confirm numbers per region before ship). ' +
      'CARE: "the worst night" is never depicted, described or explained. The mirror faces the kings; the player sees ' +
      'only a shut door and a light inside. Ja-hong’s statement gives context (illness, poverty, nineteen) and nothing ' +
      'about what he did. Do not add detail in art, audio or text. ' +
      'SIGNATURE PAYOFF (a03-letters, A3-5). The plea scene shown, a03-11-plea, is for kindness. For lies play ' +
      'ATLAS_A03_VARIANTS a03-11-plea-lies; for both play a03-11-plea-both. Each ends on Yeomra’s "I will hear her" and the ' +
      'Accuser’s objection, so the done scene and the complete scene are shared.',
  },

  // ---------------------------------------------------------------- A3-12
  {
    id: 'a03-12',
    code: 'A3-12',
    title: 'The Dream',
    source: `${SRC}: the mother’s dream`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-11') },
    requires: ['A3-11'],
    speakers: [GANGRIM, SUHONG, MOTHER, HAEWON],
    steps: [
      {
        id: 'a03-12-s1',
        goal: 'Go to the mother’s house in the world of the living.',
        hint: 'Follow Gang-rim and Su-hong to the small house by the gate.',
        check: 'visit:a03-house:mother',
        scene: {
          id: 'a03-12-house',
          lines: [
            N('The small house is warm and very tidy. Somebody comes in every day to help; you can tell by the folded towels.'),
            N('Their mother is asleep in her chair by the window. She is small, and older than she should be, and her hands are folded.'),
            N('On the shelf by her chair there is a biscuit tin. Inside, fifteen years of money-order envelopes, every one, flattened and kept.'),
            N('Not the money, which was spent long ago on medicine and rice. Just the envelopes, with his handwriting on the front.'),
            SH('She kept them. She kept every single one. Eomma.', 'sad'),
            GR('Go in, Su-hong. You’re her son; her sleep will open for you. The witness and the spark come with you. I stay at the door.'),
          ],
        },
        done: {
          id: 'a03-12-house-done',
          lines: [N('Su-hong takes your hand like a boy crossing a road, and your Nubbin takes hold of your other sleeve. You close your eyes.')],
        },
      },
      {
        id: 'a03-12-s2',
        goal: 'Wait in the mother’s dream until she speaks.',
        hint: 'Stay at the kitchen table. Let her come to you.',
        check: 'wait:a03-dream:kitchen',
        scene: {
          id: 'a03-12-dream',
          lines: [
            N('In the dream it is the same house, younger. There is rice on the stove, and the radio is on, and the light is summer light.'),
            N('Their mother is at the stove, well and quick, humming something with no words. She turns round, and sees her son.'),
            MO('Su-hong-ah. Look at you. You came. They said you ran, and I never believed it, not for a day.', 'happy'),
            N('Su-hong can’t say anything. He just goes to her, and she holds him, and the rice nearly burns.'),
            SH('Eomma. It’s about hyung. He’s on trial. They need to know if you…'),
            MO('If I forgave him. For the worst night.', 'soft'),
            MO('I was awake that night. I saw his face. I forgave him before morning. He was gone before I could tell him.'),
            MO('Fifteen years, a letter every month with nothing in it but money. I read his handwriting on the front, over and over.', 'sad'),
          ],
          choices: [
            {
              id: 'ask',
              label: 'Ask her what to tell him.',
              then: [
                MO('Tell him it wasn’t his fault. Tell him he was a boy carrying a house. Tell him to come home sometimes, in his sleep.'),
                MO('And tell him to eat properly. I saw those envelopes. Nobody sends that much home who eats properly.'),
              ],
            },
            {
              id: 'quiet',
              label: 'Say nothing. Let her finish in her own time.',
              then: [
                N('You stay quiet at the table. After a while she sits down across from you, and takes your Nubbin’s paw in her fingers.'),
                MO('Tell him he’s forgiven. Tell him he always was. And tell him to eat properly, the silly boy.', 'soft'),
              ],
            },
          ],
        },
        done: {
          id: 'a03-12-dream-done',
          lines: [
            N('She presses something into your Nubbin’s paws: one of the empty envelopes, with his writing on the front.'),
            N('On the back, in a hand that hasn’t held a pen in years, she has written one word. You don’t read it; it isn’t yours.'),
          ],
        },
      },
      {
        id: 'a03-12-s3',
        goal: 'Carry the mother’s message back to King Yeomra’s hall.',
        hint: 'Your Nubbin holds the envelope. Keep it safe all the way down the sand road.',
        check: 'carry:a03-message:yeomra',
        scene: {
          id: 'a03-12-carry',
          lines: [
            N('You wake in the chair by the window. The mother is still asleep, and smiling, and one hand has come unfolded.'),
            N('Your Nubbin is holding the envelope in both paws. It is real, and it came out of the dream with you.'),
            GR('That isn’t possible. Nothing comes out of a dream.', 'shock'),
            SH('She always did find a way to get a letter where it was going.', 'soft'),
            GR('Then we don’t waste it. Yeomra’s hall. Now.'),
            N('Down the sand road, past the gates and the courts and the queue, your Nubbin carries the envelope and won’t let anyone else touch it.'),
          ],
        },
      },
    ],
    complete: {
      id: 'a03-12-complete',
      lines: [
        N('At the doors of the great hall, Su-hong stops and straightens his uniform, and then his brother’s collar, without asking.'),
        SH('Whatever she wrote, hyung, she wrote it herself. I watched her do it.'),
        N('Haewonmak, at the door, unfolds a little wooden board on a post and nails it up by the hall steps, crooked.'),
        HW('For notes. People always want to leave each other notes in here and never have anywhere to put them.'),
        N('Your Nubbin looks at it with great interest. Back in the Grove, there will be one just like it.'),
      ],
    },
    rewards: [
      {
        id: 'a03-letters-board',
        kind: 'feature',
        label: 'Letters',
        description:
          'A little notice board on a post. Your Nubbins leave each other notes on it: a drawing, a leaf, a pebble, a scrap with a paw print.',
      },
    ],
    sets: { 'a03-12': true },
    notes:
      'The mother cannot speak in waking life (as in the films); in her dream she speaks, and these are her only lines. ' +
      'The complete scene plays back at the doors of the great hall, where Haewonmak and Deok-choon have been waiting. ' +
      'CARE: the mother names "the worst night" and nothing more. The one word on the envelope is never shown or read ' +
      'aloud on this page. ' +
      'HAZEL’S MARGIN NOTE (S24): if s24Done is set when a03-12-complete ends, play ATLAS_A03_VARIANTS ' +
      'a03-margin-hazel once, straight after it; if S24 finishes after A3-12 is done, play it once, the first time the ' +
      'atlas is next open at this page. Its pencil note sits beside the dream scene’s window; the text is S24’s. ' +
      'SIM: the Letters board is a Grove feature, unlimited: Nubbins pin small found objects and doodles on it as an ' +
      'idle behaviour; the player can read and pin too. No reward from it, no timer.',
  },

  // ---------------------------------------------------------------- A3-13
  {
    id: 'a03-13',
    code: 'A3-13',
    title: 'Reincarnation',
    source: `${SRC}: the verdict and the new life`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-12') },
    requires: ['A3-12'],
    speakers: [GANGRIM, HAEWON, DEOK, JAHONG, SUHONG, YEOMRA],
    steps: [
      {
        id: 'a03-13-s1',
        goal: 'Give Ja-hong his mother’s message.',
        hint: 'Your Nubbin carries the envelope; walk it to him.',
        check: 'deliver:a03-message:jahong',
        scene: {
          id: 'a03-13-message',
          lines: [
            N('In the great hall, your Nubbin walks to Ja-hong and holds up the envelope with both paws.'),
            N('He knows his own handwriting on the front. He turns it over and reads the one word on the back.'),
            N('Then he sits down on the floor of King Yeomra’s hall, very suddenly, like a man whose strings have been cut.'),
            JH('Eomma.', 'sad'),
            SH('She said to tell you it wasn’t your fault. She said she forgave you before morning. She said to eat properly.'),
            N('Ja-hong laughs, and it turns into crying halfway, and doesn’t stop for a long time. Nobody asks it to.'),
          ],
        },
        done: {
          id: 'a03-13-message-done',
          lines: [N('Deok-choon cries, and Haewonmak cries. Gang-rim looks very hard at a pillar.')],
        },
      },
      {
        id: 'a03-13-s2',
        goal: 'Hear King Yeomra’s verdict.',
        hint: 'Stand with the defence before the high desk.',
        check: 'wait:a03-verdict:yeomra',
        scene: {
          id: 'a03-13-verdict',
          lines: [
            YM('The witness argued kindness. I said kindness to strangers was not enough.'),
            YM('I was right. And I was wrong, because it was never only for strangers. The mother read every envelope as a letter.', 'think'),
            YM('This court cannot forgive what a mother has not. It cannot hold what she has.'),
            YM('Kim Ja-hong. Seven hells, seven acquittals. You are a paragon. You will be born again.'),
            N('Far off, a bell rings once, and every king in the hall bows his head.'),
            N('Ja-hong stands, and looks at his brother first, before anybody else. He doesn’t know how to be glad yet.'),
          ],
        },
      },
      {
        id: 'a03-13-s3',
        goal: 'Walk Ja-hong to the gate of rebirth.',
        hint: 'Go with the brothers to the gate of light at the end of the hall.',
        check: 'escort:a03-jahong:rebirth-gate',
        scene: {
          id: 'a03-13-gate',
          lines: [
            N('At the far end of the hall there is a gate made of nothing but light, the warm sort, like a kitchen window at night.'),
            N('The guardians stop a few steps short of it. Even they don’t go nearer than that.'),
            JH('Su-hong. What happens to you?'),
            SH('Don’t worry about me. I’ve got a guardian. He’s very grumpy. He’ll sort it.'),
            JH('I should have looked round. That night in the lane. I should have looked round.', 'sad'),
            SH('You’re looking round now, hyung. Go on. Eat properly in the next one.', 'soft'),
          ],
          choices: [
            {
              id: 'nubbin',
              label: 'Let your Nubbin say goodbye first.',
              then: [N('Your Nubbin reaches up, and Ja-hong picks it up one last time, and it presses its warm forehead against his chin.')],
            },
            {
              id: 'brothers',
              label: 'Step back and let the brothers have it.',
              then: [N('You step back. The brothers hold on to each other, hard, in a way they haven’t since one of them was seven.')],
            },
          ],
        },
      },
    ],
    complete: {
      id: 'a03-13-complete',
      lines: [
        N('Ja-hong walks into the light without looking back, because this time he doesn’t need to.'),
        N('For a moment the gate is the size of a door, and then of a window, and then of a lantern, hanging in the air.'),
        N('Deok-choon takes it down off nothing, and puts it in your hands. It is warm.'),
        DC('For your Grove. The living light them for the ones who’ve gone on. Or for the ones they’ve forgiven. Or both.', 'soft'),
        HW('Forty-eight. One to go.'),
        N('Gang-rim doesn’t say anything. He is looking at Su-hong, still standing by the empty gate in his thin uniform.'),
      ],
    },
    rewards: [
      {
        id: 'a03-forgiveness-lantern',
        kind: 'decor',
        label: 'Forgiveness Lantern',
        description:
          'A small warm paper lantern that glows without a candle. Place it anywhere in the Grove; Nubbins like to sit under it.',
      },
    ],
    sets: { 'a03-13': true },
    notes:
      'SIGNATURE PAYOFF (a03-letters, A3-5). The verdict scene shown, a03-13-verdict, is for kindness. For lies play ' +
      'ATLAS_A03_VARIANTS a03-13-verdict-lies; for both play a03-13-verdict-both. All three end with the same acquittal ' +
      'and rebirth. CARE: rebirth is a walk into warm light; nothing about it reads as death imagery. "Eomma" (mum) and ' +
      '"hyung" (older brother) are glossed by context; check with the adviser.',
  },

  // ---------------------------------------------------------------- A3-14
  {
    id: 'a03-14',
    code: 'A3-14',
    title: 'The Last Soul',
    source: `${SRC}: Gang-rim takes Su-hong’s case`,
    audience: 'teen',
    trigger: { where: WHERE, when: after('A3-13') },
    requires: ['A3-13'],
    speakers: [GANGRIM, HAEWON, DEOK, SUHONG, YEOMRA],
    steps: [
      {
        id: 'a03-14-s1',
        goal: 'Hear what becomes of Su-hong.',
        hint: 'Stay in the great hall with the guardians.',
        check: 'talk:a03-yeomra:suhong',
        scene: {
          id: 'a03-14-case',
          lines: [
            YM('The paragon is reborn. Now, the spirit. He broke the peace of the jeoseung. Wronged or not, there is a rule.'),
            YM('A vengeful spirit has no defence, no forty-nine days, and no trials. He goes to the dark between lives and waits.'),
            DC('How long?', 'shock'),
            YM('Until somebody remembers to fetch him.'),
            N('Su-hong nods, as if he expected exactly this. He looks as if he has been expecting it for three weeks.'),
            SH('That’s all right. Hyung got through. That’s what I came for.'),
          ],
        },
        done: {
          id: 'a03-14-case-done',
          lines: [N('Haewonmak looks at Gang-rim, and so does Deok-choon. You find that you are looking at Gang-rim too.')],
        },
      },
      {
        id: 'a03-14-s2',
        goal: 'Stand with Gang-rim while he defies the king.',
        hint: 'Stay at his side. Your Nubbin can stand on the other.',
        check: 'watch:a03-gangrim:defy',
        scene: {
          id: 'a03-14-defy',
          lines: [
            GR('Majesty. I said once that I would not mix up a number and a man. The witness heard me.'),
            GR('Kim Su-hong died for nothing he did. He is a paragon as much as his brother. I take his case. He will be my forty-ninth.'),
            YM('A vengeful spirit, as a paragon? You would stake a thousand years on that boy?', 'angry'),
            GR('A thousand years and the rest. The witness made the argument for his brother. It holds for him.'),
            GR('He wrote his storm in the only ink he had, Majesty, so that his mother would know he never ran. That was kindness too.'),
            YM('If he fails a single trial, guardian, your forty-nine are void. All three of you. Do you understand?'),
            HW('We understand. Get on with it.', 'angry'),
            DC('We do! We understand! Sorry, Majesty. We understand.', 'shock'),
          ],
        },
        done: {
          id: 'a03-14-defy-done',
          lines: [
            N('King Yeomra looks at them for a very long time. Then, almost too quietly to hear, he sighs.'),
            YM('Forty-nine days, from tomorrow. Take your boy.'),
          ],
        },
      },
      {
        id: 'a03-14-s3',
        goal: 'Let the guardians walk you and your Nubbin to the edge of the page.',
        hint: 'Follow the black coats back up the sand road.',
        check: 'walk:a03-guardians:page-edge',
        scene: {
          id: 'a03-14-home',
          lines: [
            N('They walk you back up the long sand road, all four of them now: three black coats and one thin uniform.'),
            N('At the top, where the sand turns back into a city pavement and then into paper, Gang-rim stops.'),
            GR('This is where the lost go home. Your spark isn’t lost now. It knows exactly where it’s going.'),
            N('Your Nubbin’s glow goes softer, and softer, and then it is only its own colours again, and it sneezes.'),
            HW('Here. Spare. Too small for me. Don’t ask why I have a coat too small for me.'),
            N('He shoves a black coat into your arms, folded very neatly for somebody so cross.'),
            SH('Thank you. For finding the page in the hut. For telling them I didn’t run.', 'soft'),
          ],
        },
      },
    ],
    complete: {
      id: 'a03-14-complete',
      lines: [
        N('The page goes thin under your feet. The last thing you see is Deok-choon waving with both arms, crying, happy.'),
        N('You are back in the Grove, with Nova’s atlas on your knee, a black coat over your arm and a paper lantern by your boot.'),
        N('Your Nubbin is entirely its own colour. It keeps checking, just in case.'),
        N('On the page, at the bottom of the white sand road, four small figures in ink are setting out again. Day one of forty-nine.'),
      ],
    },
    rewards: [
      {
        id: 'a03-guardian-coat',
        kind: 'cosmetic',
        label: 'Guardian’s Black Coat',
        description: 'A long plain black coat, very well kept, folded by somebody cross. Fits a Keeper; there is a tiny one for a Nubbin too.',
      },
      {
        id: 'a03-remembering-bookmark',
        kind: 'item',
        label: 'Night of Remembering Bookmark',
        description: 'A strip of paper the colour of white sand, with a little black hat drawn at the top. It marks the Forty-Nine Days page, and counts towards the Night of Remembering.',
      },
    ],
    sets: { 'a03-14': true, 'a03-done': true },
    notes:
      'SIGNATURE PAYOFF (a03-letters, A3-5). The defiance scene shown, a03-14-defy, is for kindness. For lies play ' +
      'ATLAS_A03_VARIANTS a03-14-defy-lies; for both play a03-14-defy-both (each changes Gang-rim’s argument lines #3–4 ' +
      'only; the rest is the same). The ending is open, as the first film’s is: Su-hong’s trials are the second film, ' +
      'not this page. The page’s last image is the four figures setting out. ' +
      'SIM: (a) the coat is a Keeper cosmetic with a Nubbin-size twin. (b) The bookmark is an atlas item; the Night of ' +
      'Remembering (A3, A5, A7, A16, A21, A23; any two) reads atlasDone(\'A3\'). (c) The Forgiveness Lantern (A3-13) and ' +
      'the Letters board (A3-12) are already in the Grove.',
  },
];

// =================================================================== variants

/**
 * Variant scenes chosen by flags. Each quest's notes say which scene each replaces.
 *   Before A3-11 (until the player picks "Go on"): a03-11-note (the content note).
 *   a03-letters (A3-5): a03-11-plea-lies / -both, a03-13-verdict-lies / -both, a03-14-defy-lies / -both.
 *   s24Done (Grove, read-only): a03-margin-hazel, once, straight after a03-12-complete (A3-12 notes).
 */
export const ATLAS_A03_VARIANTS: Scene[] = [
  // ---------------------------------------------------------------- A3-11, content note (before a03-11-hall)
  {
    id: 'a03-11-note',
    lines: [
      N('A note before the last trial.'),
      N('The next part of this page is about the worst night in a family’s life, and about a son’s despair, and a mother’s forgiveness.'),
      N('Nothing of that night is shown or told. But it is heavy, and it touches on suicide.'),
      N('If any of this is close to home for you, please talk to someone you trust. You don’t have to carry it on your own.'),
    ],
    choices: [
      { id: 'on', label: 'Go on.' },
      { id: 'later', label: 'Not now. Close the atlas.' },
    ],
  },
  // ---------------------------------------------------------------- A3-11, step 3 scene (lies)
  {
    id: 'a03-11-plea-lies',
    lines: [
      GR('Majesty, the defence asks that the witness speak. They saw the letters land. Let them say what they told the Hell of Deceit.'),
      Y('The letters were lies. He knew it, and so do I. He never once pretended otherwise to any court.'),
      Y('He’s a man who owns what he did. He owned the letters. He owns that night. He hasn’t asked anyone to call it anything else.'),
      Y('Don’t judge him on whether he’s good. Ask the one person who has the right to answer. Ask her.'),
      N('Ja-hong lifts his head and looks at you, as if nobody has ever said the plain thing out loud before.'),
      YM('An honest defence. Rarer than a paragon.', 'think'),
      YM('You are right that this court cannot forgive what a mother has not. I will hear her before I rule.'),
      AC('Majesty, the mother cannot speak. She has not spoken in years. And she is living.'),
    ],
  },
  // ---------------------------------------------------------------- A3-11, step 3 scene (both)
  {
    id: 'a03-11-plea-both',
    lines: [
      GR('Majesty, the defence asks that the witness speak. They saw the letters land. Let them say what they told the Hell of Deceit.'),
      Y('The letters were lies, and they were kind. Both. He paid for the lie himself so somebody else could sleep.'),
      Y('That’s what he did at home too. Fifteen years of money, no words. A lie about being all right, and the kindest thing he had.'),
      Y('He doesn’t need you to say he was good. He needs to hear what she says. So do we.'),
      N('Ja-hong is crying now, without any sound, the way grown men do when they have had a lot of practice not crying.'),
      YM('Both. Courts don’t care for both. This one, today, does.', 'think'),
      YM('This court cannot forgive what a mother has not. I will hear her before I rule.'),
      AC('Majesty, the mother cannot speak. She has not spoken in years. And she is living.'),
    ],
  },
  // ---------------------------------------------------------------- A3-13, step 2 scene (lies)
  {
    id: 'a03-13-verdict-lies',
    lines: [
      YM('The witness told me plainly that his letters were lies, and asked me to ask her. I have.'),
      YM('A man who calls his own lies lies is a man who can hear the truth when it comes. It has come.', 'think'),
      YM('This court cannot forgive what a mother has not. It cannot hold what she has.'),
      YM('Kim Ja-hong. Seven hells, seven acquittals. You are a paragon. You will be born again.'),
      N('Far off, a bell rings once, and every king in the hall bows his head.'),
      N('Ja-hong stands, and looks at his brother first, before anybody else. He doesn’t know how to be glad yet.'),
    ],
  },
  // ---------------------------------------------------------------- A3-13, step 2 scene (both)
  {
    id: 'a03-13-verdict-both',
    lines: [
      YM('The witness told me the letters were lies and kindness both. I said courts don’t care for both.'),
      YM('His mother read fifteen years of empty envelopes as love. That is both, too. I find I care for it after all.', 'think'),
      YM('This court cannot forgive what a mother has not. It cannot hold what she has.'),
      YM('Kim Ja-hong. Seven hells, seven acquittals. You are a paragon. You will be born again.'),
      N('Far off, a bell rings once, and every king in the hall bows his head.'),
      N('Ja-hong stands, and looks at his brother first, before anybody else. He doesn’t know how to be glad yet.'),
    ],
  },
  // ---------------------------------------------------------------- A3-14, step 2 scene (lies)
  {
    id: 'a03-14-defy-lies',
    lines: [
      GR('Majesty. I said once that I would not mix up a number and a man. The witness heard me.'),
      GR('Kim Su-hong died for nothing he did. He is a paragon as much as his brother. I take his case. He will be my forty-ninth.'),
      YM('A vengeful spirit, as a paragon? You would stake a thousand years on that boy?', 'angry'),
      GR('The witness told you plainly what the brother’s letters were. I’ll be as plain. His storm broke your peace. It was wrong.'),
      GR('And it was the only voice he had left to say he never ran. Judge the wrong. Then judge the boy. That’s all I ask.'),
      YM('If he fails a single trial, guardian, your forty-nine are void. All three of you. Do you understand?'),
      HW('We understand. Get on with it.', 'angry'),
      DC('We do! We understand! Sorry, Majesty. We understand.', 'shock'),
    ],
  },
  // ---------------------------------------------------------------- A3-14, step 2 scene (both)
  {
    id: 'a03-14-defy-both',
    lines: [
      GR('Majesty. I said once that I would not mix up a number and a man. The witness heard me.'),
      GR('Kim Su-hong died for nothing he did. He is a paragon as much as his brother. I take his case. He will be my forty-ninth.'),
      YM('A vengeful spirit, as a paragon? You would stake a thousand years on that boy?', 'angry'),
      GR('You said this court could care for both, Majesty. The storm was a crime. It was also a son calling home.'),
      GR('Both. The same as his brother’s letters. I ask you to care for both one more time.'),
      YM('If he fails a single trial, guardian, your forty-nine are void. All three of you. Do you understand?'),
      HW('We understand. Get on with it.', 'angry'),
      DC('We do! We understand! Sorry, Majesty. We understand.', 'shock'),
    ],
  },
  // ---------------------------------------------------------------- Hazel's margin note (s24Done; after a03-12-complete)
  {
    id: 'a03-margin-hazel',
    lines: [
      N('For a moment the page is only paper again: the small house by the gate, and a woman asleep in her chair by the window.'),
      N('Beside the window, in faint pencil you have never noticed, there is a note in the margin. You know the hand.'),
      N('“His mother forgave him before he asked. They mostly do. That’s the hard part. H.”'),
      N('You read it twice. The second time, you are not sure it is about the page.'),
      N('Your Nubbin puts its paw on the little inked biscuit tin on the shelf, and leaves it there a while.'),
    ],
  },
];

// =================================================================== flags and checks

/** Every flag this line sets (Atlas save only). It reads s24Done (Grove, read-only) and writes no Grove flag. */
export const ATLAS_A03_FLAGS: string[] = [
  'a03-01',
  'a03-02',
  'a03-03',
  'a03-04',
  'a03-05',
  'a03-06',
  'a03-07',
  'a03-08',
  'a03-09',
  'a03-10',
  'a03-11',
  'a03-12',
  'a03-13',
  'a03-14',
  'a03-done', // A3-14: the whole page; read by atlasDone('A3') for the Night of Remembering
  'a03-letters', // kindness | lies | both (a03-05-choice): A3-11 plea, A3-13 verdict, A3-14 defiance
];

export const ATLAS_A03_CHECKS: string[] = [
  'explore:a03-city:fire-street',
  'watch:a03-jahong:window',
  'talk:a03-gangrim:list',
  'walk:a03-guardians:sand-road',
  'explore:a03-jeoseung:first-gate',
  'visit:a03-court:murder',
  'inspect:a03-mirror:stairwell',
  'deliver:a03-evidence:murder-bench',
  'visit:a03-court:indolence',
  'collect:a03-receipts:ledger',
  'wait:a03-court:indolence',
  'visit:a03-court:deceit',
  'find:a03-letters:bereaved',
  'choose:a03-letters:argument',
  'walk:a03-gates:injustice-betrayal',
  'talk:a03-guardians:why',
  'wait:a03-storm:shelter',
  'inspect:a03-storm:eye',
  'explore:a03-base:guard-post',
  'inspect:a03-base:duty-log',
  'watch:a03-won:mother-gate',
  'visit:a03-court:violence',
  'talk:a03-suhong:witness',
  'talk:a03-gangrim:case',
  'deliver:a03-log:yeomra',
  'sit:a03-brothers:steps',
  'visit:a03-court:yeomra',
  'watch:a03-mirror:door',
  'talk:a03-yeomra:plea',
  'visit:a03-house:mother',
  'wait:a03-dream:kitchen',
  'carry:a03-message:yeomra',
  'deliver:a03-message:jahong',
  'wait:a03-verdict:yeomra',
  'escort:a03-jahong:rebirth-gate',
  'talk:a03-yeomra:suhong',
  'watch:a03-gangrim:defy',
  'walk:a03-guardians:page-edge',
];
