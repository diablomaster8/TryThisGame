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
  installTextGuard();
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

/**
 * PERF (2026-11-06): `el.textContent = same text` replaces the text node every time, and a node
 * insertion under the HUD invalidates the `body:has(.modal:not([hidden]))` and `#hud:has(...)`
 * rules, so the whole HUD restyled (about 30 ms on a 4x-throttled phone) for the shells and fruit
 * counters, the fps readout and every other poller that rewrites its text. An element whose only
 * child is a text node now takes the new text in place (and none at all when it is unchanged);
 * anything else goes through the browser's own setter.
 */
function installTextGuard(): void {
  if (typeof Node === 'undefined') return;
  const proto = Node.prototype;
  const d = Object.getOwnPropertyDescriptor(proto, 'textContent');
  if (!d?.get || !d.set || d.configurable === false) return;
  const set = d.set;
  Object.defineProperty(proto, 'textContent', {
    configurable: true,
    enumerable: d.enumerable ?? true,
    get: d.get,
    set(this: Node, v: unknown) {
      if (this.nodeType === 1) {
        const s = v === null || v === undefined ? '' : String(v);
        const first = this.firstChild;
        if (s !== '' && first !== null && first.nodeType === 3 && first.nextSibling === null) {
          if ((first as Text).data !== s) (first as Text).data = s;
          return;
        }
        if (s === '' && first === null) return;
      }
      set.call(this, v);
    },
  });
}
