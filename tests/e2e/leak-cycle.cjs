/* eslint-disable */
/* hot/perf-leaks: the leak guard. Opt-in, not part of `npm test`:
 *   npm run build && npx vite preview --port 4173 &
 *   MODE=px npm run test:leaks      (then MODE=3d)
 * Boots the built game straight into a free slot with eight Nubbins, then laps through every main scene
 * (Hollow, a dojo bout, a race, the Expedition, a region) and the open/close panels (dialogue, shop, roster,
 * settings, stats sheet, creator gallery). A lap is entered and left in full. Caches fill for a few laps (the
 * sprite-sheet LRU, painted floors), so warm-up laps run until three laps in a row leave the heap, GL geometries and textures flat
 * (at least WARM_MIN, at most WARM_MAX; the Pixel Hollow's floor cache adds geometry on only some visits
 * and settles near 97 after about 8 laps); the baseline is taken there. Then CYCLES more laps run and the last
 * three are compared with the baseline:
 *   heap after GC           within 10 %
 *   GL geometries, textures within 10 % (or +5 absolute)
 *   DOM nodes               within 5 %
 *   live intervals, rAF loops: back to the baseline (+1); live listeners on the page within 5 %
 * Exits 1 with a table when anything is over. Env: E2E_URL (default http://127.0.0.1:4173), MODE=px|3d
 * (default px), VIEW=phone|desktop (default phone, 375x812), CYCLES (10), WARM_MIN (4), WARM_MAX (20), HOLLOW_WARM (12 Hollow-only trips first),
 * E2E_BROWSER (path to a Chromium/Edge), PLAYWRIGHT_CORE (module path). Independent of soak.cjs. */
const BASE = process.env.E2E_URL || 'http://127.0.0.1:4173';
const MODE = process.env.MODE === '3d' ? '3d' : 'px';
const VIEW = process.env.VIEW === 'desktop' ? 'desktop' : 'phone';
const CYCLES = Number(process.env.CYCLES || 10);
const WARM_MIN = Number(process.env.WARM_MIN || 4);
const WARM_MAX = Number(process.env.WARM_MAX || 20);
const HOLLOW_WARM = Number(process.env.HOLLOW_WARM || 12);
const { chromium } = require(process.env.PLAYWRIGHT_CORE || 'playwright-core');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const px = MODE === 'px';

/** Counts live timers, rAF loops and listeners on the page (window/document or a connected node). */
function PROBES() {
  const P = (window.__leak = { intervals: new Set(), raf: new Set(), entries: [], reg: new WeakMap() });
  const si = window.setInterval.bind(window);
  const ci = window.clearInterval.bind(window);
  window.setInterval = (fn, ms, ...a) => {
    const id = si(fn, ms, ...a);
    P.intervals.add(id);
    return id;
  };
  window.clearInterval = (id) => {
    P.intervals.delete(id);
    return ci(id);
  };
  const raf = window.requestAnimationFrame.bind(window);
  const caf = window.cancelAnimationFrame.bind(window);
  window.requestAnimationFrame = (fn) => {
    const id = raf((t) => {
      P.raf.delete(id);
      return fn(t);
    });
    P.raf.add(id);
    return id;
  };
  window.cancelAnimationFrame = (id) => {
    P.raf.delete(id);
    return caf(id);
  };
  const key = (type, o) => type + '|' + (typeof o === 'boolean' ? o : !!(o && o.capture));
  const add = EventTarget.prototype.addEventListener;
  const rem = EventTarget.prototype.removeEventListener;
  EventTarget.prototype.addEventListener = function (type, cb, o) {
    if (cb && !(o && typeof o === 'object' && (o.once || o.signal))) {
      let m = P.reg.get(this);
      if (!m) P.reg.set(this, (m = new Map()));
      const k = key(type, o);
      let s = m.get(k);
      if (!s) m.set(k, (s = new WeakSet()));
      if (!s.has(cb)) {
        s.add(cb);
        P.entries.push({ t: new WeakRef(this), cb: new WeakRef(cb), k });
      }
    }
    return add.call(this, type, cb, o);
  };
  EventTarget.prototype.removeEventListener = function (type, cb, o) {
    const s = P.reg.get(this)?.get(key(type, o));
    if (cb && s) s.delete(cb);
    return rem.call(this, type, cb, o);
  };
  P.listeners = () => {
    let on = 0;
    const keep = [];
    for (const e of P.entries) {
      const t = e.t.deref();
      const cb = e.cb.deref();
      if (!t || !cb || !P.reg.get(t)?.get(e.k)?.has(cb)) continue;
      keep.push(e);
      if (!(t instanceof Node) || t.isConnected) on++;
    }
    P.entries = keep;
    return on;
  };
}

async function clearDialogue(page) {
  for (let i = 0, shut = 0; i < 120 && shut < 3; i++) {
    const open = await page.evaluate(() => !!document.querySelector('.dialogue')?.offsetParent);
    if (!open) {
      shut++;
      await sleep(200);
      continue;
    }
    shut = 0;
    const act = await page.evaluate(() => {
      const b = document.querySelector('.line-act-btn');
      if (b) b.click();
      return !!b;
    });
    if (act) {
      await sleep(400);
      continue;
    }
    const ch = page.locator('.btn-choice:visible');
    const sk = page.locator('.dialogue :text("Skip"):visible');
    if (await ch.count()) await ch.first().click().catch(() => {});
    else if (await sk.count()) await sk.first().click().catch(() => {});
    else await page.locator('.dialogue-box').click({ force: true }).catch(() => {});
    await sleep(150);
  }
}

async function waitFn(page, fn, arg, what, ms = 30000) {
  try {
    await page.waitForFunction(fn, arg, { timeout: ms });
  } catch {
    throw new Error('timed out waiting for ' + what);
  }
}
const settle = () => sleep(px ? 1200 : 2500);
const quit = (page, what) =>
  page.evaluate(() => {
    const b = [...document.querySelectorAll('.quit')].find((x) => x.offsetParent);
    if (b) b.click();
    return !!b;
  }).then((ok) => {
    if (!ok) throw new Error('no visible quit button for the ' + what);
  });

const SCENES = [
  [
    'hollow',
    async (page) => {
      await page.evaluate(() => window.grove.send({ kind: 'enterDungeon', daily: false }));
      await waitFn(page, () => window.grove.world.location === 'dungeon', null, 'the Hollow');
      await settle();
    },
    async (page) => {
      await page.evaluate(() => window.grove.send({ kind: 'leaveDungeon' }));
      await waitFn(page, () => window.grove.world.location === 'grove', null, 'the Grove after the Hollow');
      await settle();
    },
  ],
  [
    'battle',
    async (page) => {
      await page.evaluate(() => {
        const g = window.grove;
        const kid = g.world.nubbins.find((n) => n.stage === 'child' || n.stage === 'adult') || g.world.nubbins[0];
        window.groveUi.karate.screen.begin({ kind: 'dojo', tier: 1, ids: [kid.id] });
      });
      await waitFn(page, () => window.groveUi.karate.screen.isOpen && !!window.grove.world.battle, null, 'a battle');
      await sleep(2500);
    },
    async (page) => {
      await page.evaluate(() => window.groveUi.karate.screen.leave());
      await waitFn(page, () => !window.groveUi.karate.screen.isOpen, null, 'the battle to close');
      await clearDialogue(page);
      await settle();
    },
  ],
  [
    'race',
    async (page) => {
      await page.evaluate(() => window.groveUi.races.startRace('meadow', 1));
      await waitFn(page, () => window.groveUi.races.screen.isOpen, null, 'the race');
      await sleep(3500);
    },
    async (page) => {
      await quit(page, 'race');
      await waitFn(page, () => !window.groveUi.races.screen.isOpen, null, 'the race to close');
      await clearDialogue(page);
      await settle();
    },
  ],
  [
    'expedition',
    async (page) => {
      await page.evaluate(() => {
        const g = window.grove;
        const r = g.world.nubbins.find((n) => n.stage === 'child' || n.stage === 'adult') || g.world.nubbins[0];
        g.renderPaused = true;
        window.groveUi.expedition.start(r, g.view.sheets.forNubbin(r), 12345, (rewards) => {
          g.renderPaused = false;
          g.send({ kind: 'addRewards', rewards });
        });
      });
      await waitFn(page, () => window.groveUi.expedition.isOpen, null, 'the expedition');
      await sleep(3000);
    },
    async (page) => {
      await quit(page, 'expedition');
      await waitFn(page, () => !window.groveUi.expedition.isOpen, null, 'the expedition to close');
      await clearDialogue(page);
      await settle();
    },
  ],
  [
    'region',
    async (page) => {
      await page.evaluate(() => window.grove.send({ kind: 'travel', exit: 'grove-wood' }));
      await waitFn(page, () => String(window.grove.world.location).startsWith('region:'), null, 'a region');
      await settle();
    },
    async (page) => {
      await page.evaluate(() => window.grove.send({ kind: 'setLocation', location: 'grove' }));
      await waitFn(page, () => window.grove.world.location === 'grove', null, 'the Grove after the region');
      await settle();
    },
  ],
  [
    'dialogue',
    async (page) => {
      await page.evaluate(() =>
        window.groveUi.dialogue.playScene(
          { id: 'leak-probe', lines: [{ who: 'narrator', text: 'A quiet line.' }, { who: 'narrator', text: 'Another.' }] },
          {},
          () => {},
        ),
      );
      await waitFn(page, () => window.groveUi.dialogue.isOpen, null, 'the dialogue');
      await sleep(600);
    },
    async (page) => {
      await clearDialogue(page);
      await waitFn(page, () => !window.groveUi.dialogue.isOpen, null, 'the dialogue to close', 15000);
    },
  ],
  ...['shop', 'roster', 'settings'].map((name) => [
    name,
    async (page) => {
      await page.evaluate((n) => window.groveUi[n].open(), name);
      await sleep(500);
    },
    async (page) => {
      await page.evaluate((n) => window.groveUi[n].close(), name);
      await sleep(300);
    },
  ]),
  [
    'sheet',
    async (page) => {
      await page.evaluate(() => window.groveUi.sheet.open(window.grove.world.nubbins[0].id));
      await sleep(500);
    },
    async (page) => {
      await page.evaluate(() => window.groveUi.sheet.close());
      await sleep(300);
    },
  ],
  [
    'creator',
    async (page) => {
      await page.evaluate(() => {
        window.grove.world.creator = true; // the code is secret; e2e builds may set it directly
        window.groveUi.creator.open();
      });
      await waitFn(page, () => window.groveUi.creator.isOpen(), null, 'the creator gallery');
      await sleep(800);
    },
    async (page) => {
      await page.evaluate(() => window.groveUi.creator.close());
      await waitFn(page, () => !window.groveUi.creator.isOpen(), null, 'the creator gallery to close');
      await sleep(300);
    },
  ],
];

async function lap(page) {
  for (const [name, enter, leave] of SCENES) {
    try {
      await enter(page);
      await leave(page);
    } catch (e) {
      throw new Error(`${name}: ${e.message}`);
    }
    await clearDialogue(page);
  }
}

async function measure(page, cdp) {
  await cdp.send('HeapProfiler.collectGarbage');
  await sleep(250);
  await cdp.send('HeapProfiler.collectGarbage');
  await sleep(250);
  const heap = await cdp.send('Runtime.getHeapUsage');
  const m = await page.evaluate(() => {
    const info = window.grove.pipeline?.renderer?.info;
    const P = window.__leak;
    return {
      geometries: info ? info.memory.geometries : 0,
      textures: info ? info.memory.textures : 0,
      dom: document.getElementsByTagName('*').length,
      intervals: P.intervals.size,
      raf: P.raf.size,
      listeners: P.listeners(),
    };
  });
  return { heapMB: heap.usedSize / 1048576, ...m };
}

const median = (xs) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];

(async () => {
  const phone = VIEW === 'phone';
  const launch = { headless: true, args: ['--ignore-gpu-blocklist', '--enable-unsafe-swiftshader'] };
  if (process.platform === 'win32') launch.args.push('--use-angle=d3d11');
  if (process.env.E2E_BROWSER) launch.executablePath = process.env.E2E_BROWSER;
  const browser = await chromium.launch(launch);
  const ctx = await browser.newContext({
    bypassCSP: true,
    viewport: phone ? { width: 375, height: 812 } : { width: 1280, height: 720 },
    deviceScaleFactor: phone ? 2 : 1,
    isMobile: phone,
    hasTouch: phone,
  });
  await ctx.addInitScript((gfx) => {
    try {
      localStorage.setItem('grove.graphics', gfx);
    } catch {}
  }, px ? 'pixel' : '3d');
  await ctx.addInitScript(PROBES);
  const page = await ctx.newPage();
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 200)));
  page.on('pageerror', (e) => errors.push('PAGEERR ' + String(e).slice(0, 200)));
  page.on('dialog', (d) => d.accept());
  try {
    await page.goto(`${BASE}/?debug&e2e&free&slot=1`, { waitUntil: 'domcontentloaded', timeout: 180000 });
    await page.waitForFunction(() => window.grove && window.grove.world && window.groveUi, null, { timeout: 180000 });
    await page.waitForFunction(() => /[0-9]+ fps/.test(document.body.innerText), null, { timeout: 240000 });
    await sleep(px ? 2000 : 6000);
    await clearDialogue(page);
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('HeapProfiler.enable');
    await page.evaluate(() => {
      const g = window.grove;
      const have = g.world.nubbins.length;
      if (have < 8) g.send({ kind: 'debugGive', what: 'egg', amount: 8 - have });
    });
    await sleep(600);
    await page.evaluate(() => {
      const g = window.grove;
      for (const n of g.world.nubbins.filter((x) => x.stage === 'egg')) g.send({ kind: 'debugHatchNow', nubbinId: n.id });
      g.send({ kind: 'teleport', pos: { x: 0, z: 4 } });
    });
    await sleep(1500);
    await clearDialogue(page);
    await page.evaluate(() => document.querySelector('.debug')?.setAttribute('hidden', ''));
    await page.keyboard.press('Shift'); // the first key press lets audio start, as a player's would
    await sleep(px ? 1000 : 3000);

    // The Hollow keeps each floor kind's pieces for its next visit (a bounded cache: the GL geometry count
    // settles near 95 in Pixel), but adds them only on the visits that roll a new kind, so quiet laps alone
    // can end the warm-up early. HOLLOW_WARM extra Hollow trips fill it first.
    const hollow = SCENES.find(([n]) => n === 'hollow');
    for (let i = 0; i < HOLLOW_WARM; i++) {
      await hollow[1](page);
      await hollow[2](page);
      await clearDialogue(page);
    }

    // Warm-up: laps until three in a row are quiet (heap up under 2 %, GL geometries and textures up by 1 at most).
    let prev = await measure(page, cdp);
    let warm = 0;
    let quiet = 0;
    for (;;) {
      await lap(page);
      warm++;
      const now = await measure(page, cdp);
      const calm =
        (now.heapMB - prev.heapMB) / prev.heapMB <= 0.02 &&
        now.geometries - prev.geometries <= 1 &&
        now.textures - prev.textures <= 1;
      quiet = calm ? quiet + 1 : 0;
      console.log(`warm-up lap ${warm}: heap ${now.heapMB.toFixed(1)} MB, geo ${now.geometries}, tex ${now.textures}${calm ? ' (quiet)' : ''}`);
      prev = now;
      if (warm >= WARM_MAX || (warm >= WARM_MIN && quiet >= 3)) break;
    }
    const base = await measure(page, cdp);
    const rows = [];
    for (let i = 1; i <= CYCLES; i++) {
      await lap(page);
      const m = await measure(page, cdp);
      rows.push(m);
      console.log(
        `cycle ${i}: heap ${m.heapMB.toFixed(1)} MB, geo ${m.geometries}, tex ${m.textures}, dom ${m.dom}, intervals ${m.intervals}, raf ${m.raf}, listeners ${m.listeners}`,
      );
    }
    const last = rows.slice(-3);
    const fin = {};
    for (const k of Object.keys(base)) fin[k] = median(last.map((r) => r[k]));
    const checks = [
      ['heap MB after GC', 'heapMB', (b, f) => f <= b * 1.1, '+10 %'],
      ['GL geometries', 'geometries', (b, f) => f <= Math.max(b * 1.1, b + 5), '+10 % or +5'],
      ['GL textures', 'textures', (b, f) => f <= Math.max(b * 1.1, b + 5), '+10 % or +5'],
      ['DOM nodes', 'dom', (b, f) => f <= b * 1.05, '+5 %'],
      ['live intervals', 'intervals', (b, f) => f <= b + 1, 'baseline +1'],
      ['live rAF loops', 'raf', (b, f) => f <= b + 1, 'baseline +1'],
      ['live listeners', 'listeners', (b, f) => f <= b * 1.05, '+5 %'],
    ];
    let bad = 0;
    console.log(`\n${MODE} ${VIEW}: ${warm} warm-up laps, ${CYCLES} cycles (final = median of the last 3)`);
    console.log('metric'.padEnd(20) + 'baseline'.padStart(10) + 'final'.padStart(10) + 'limit'.padStart(16) + '  result');
    for (const [label, k, ok, limit] of checks) {
      const pass = ok(base[k], fin[k]);
      if (!pass) bad++;
      const f = (v) => (k === 'heapMB' ? v.toFixed(1) : String(Math.round(v)));
      console.log(label.padEnd(20) + f(base[k]).padStart(10) + f(fin[k]).padStart(10) + limit.padStart(16) + (pass ? '  ok' : '  OVER'));
    }
    if (errors.length) console.log(`console errors (${errors.length}): ${errors[0]}`);
    await browser.close();
    if (bad) {
      console.error(`\nleak-cycle FAILED: ${bad} metric(s) over their limit`);
      process.exit(1);
    }
    console.log('\nleak-cycle passed');
  } catch (e) {
    console.error('leak-cycle ERROR:', e.message);
    await browser.close().catch(() => {});
    process.exit(1);
  }
})();
