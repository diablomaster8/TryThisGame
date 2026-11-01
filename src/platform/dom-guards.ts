/**
 * PERF (2026-11-01): the HUD's frame pollers (routine props, gags, chips, the beacon arrow and
 * others, about 400 `el.hidden = …` sites) set `hidden` every frame whether or not it changed.
 * Each write is an attribute mutation, and `#hud:has(> .modal:not([hidden]))`-style rules make
 * any of them restyle the whole HUD: about 7 ms a frame on a 4x-throttled phone. Writing only
 * when the value differs keeps every element exactly as before and drops the restyle.
 *
 * Installed once at boot from `main.ts`; tests (jsdom) run without it, which is fine because
 * the behaviour is the same either way.
 */
export function installHiddenGuard(): void {
  if (typeof HTMLElement === 'undefined') return;
  const proto = HTMLElement.prototype;
  const d = Object.getOwnPropertyDescriptor(proto, 'hidden');
  if (!d?.get || !d.set || d.configurable === false) return;
  const get = d.get;
  const set = d.set;
  Object.defineProperty(proto, 'hidden', {
    configurable: true,
    enumerable: d.enumerable ?? true,
    get,
    set(this: HTMLElement, v: unknown) {
      const cur: unknown = get.call(this);
      // `hidden` also takes "until-found"; only plain booleans are compared.
      if (typeof v !== 'string' && typeof cur === 'boolean' && cur === !!v) return;
      set.call(this, v);
    },
  });
}
