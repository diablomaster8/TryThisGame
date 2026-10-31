import * as THREE from 'three';
import { packPlate } from '../render/hollow-packs-pixel';
import { elevationAt, type Floor } from '../sim/dungeon';
import { actorShown } from '../sim/dungeon-sight';
import { disposeObjects, type HollowCtx, type HollowFrame, type HollowModule } from './hollow-ctx';

/**
 * Name plates over the Hollow's special packs in Full 3D (R0155): a champion's ◆, an elite's
 * ◈ or a boss's ★, then each modifier's icon and word ("◆ » Zoomy"), so the shape and the
 * words carry the meaning and colour only backs them up. One small canvas sprite per special
 * pack, drawn once per floor; hidden in the fog, and once the pack has gone home.
 */
export class HollowPlates implements HollowModule {
  private readonly objs: THREE.Object3D[] = [];
  private plates: Array<{ id: string; sprite: THREE.Sprite }> = [];
  private floor: Floor | null = null;

  build(f: Floor, ctx: HollowCtx): void {
    this.floor = f;
    for (const p of f.packs ?? []) {
      // The plate's words are shared with the Pixel view (`packPlate`, lane B r8).
      const ps = packPlate(p);
      if (!ps) continue;
      const sprite = plate(ps.text, ps.colour);
      sprite.name = 'hollow-plate';
      sprite.visible = false;
      ctx.group.add(sprite);
      this.objs.push(sprite);
      this.plates.push({ id: p.id, sprite });
    }
  }

  dispose(): void {
    for (const p of this.plates) {
      const m = p.sprite.material;
      m.map?.dispose();
      m.dispose();
    }
    disposeObjects(this.objs);
    this.plates = [];
    this.floor = null;
  }

  update(_t: number, keeper: { x: number; z: number }, fr: HollowFrame): void {
    const f = this.floor;
    const run = fr.run;
    for (const { id, sprite } of this.plates) {
      const live = run?.packs?.find((p) => p.id === id);
      const show =
        fr.on &&
        !!f &&
        !!run &&
        !!live &&
        live.state !== 'beaten' &&
        actorShown(run, f, keeper, live.pos);
      sprite.visible = show;
      if (show) sprite.position.set(live!.pos.x, elevationAt(f!, live!.pos) + LIFT, live!.pos.z);
    }
  }
}

const LIFT = 1.55;

/** A rounded label on a canvas, as a sprite about 0.3 world units tall. */
export function plate(text: string, colour: string): THREE.Sprite {
  const px = 28;
  const c = document.createElement('canvas');
  const g = c.getContext('2d')!;
  g.font = `600 ${px}px system-ui, sans-serif`;
  const w = Math.ceil(g.measureText(text).width) + 24;
  c.width = w;
  c.height = px + 16;
  g.font = `600 ${px}px system-ui, sans-serif`;
  g.fillStyle = 'rgba(20, 16, 36, 0.78)';
  g.beginPath();
  g.roundRect(0, 0, w, c.height, 12);
  g.fill();
  g.fillStyle = colour;
  g.textBaseline = 'middle';
  g.fillText(text, 12, c.height / 2 + 1);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  const mat = new THREE.SpriteMaterial({
    map: tex,
    depthTest: false,
    fog: false,
    transparent: true,
  });
  const s = new THREE.Sprite(mat);
  const h = 0.3;
  s.scale.set((h * w) / c.height, h, 1);
  s.renderOrder = 10;
  return s;
}
