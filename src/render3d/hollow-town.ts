import * as THREE from 'three';
import { ACTS } from '../config/dungeon-acts';
import { HOLLOW_LOCALS, HOLLOW_ZONE_TEXT, TRAINER_LABELS } from '../config/strings';
import { cellCentre, type Floor, type Service } from '../sim/dungeon';
import { trainerOf } from '../sim/trainers';
import { PALETTE } from '../render/sprites/palette';
import { cellTop } from './hollow-dress-path';
import { disposeObjects, mat, type HollowCtx, type HollowModule } from './hollow-ctx';
import { plate } from './hollow-plates';

/**
 * Act camps and fields in Full 3D (R0152, R0147): each camp service's stall, table, board or
 * signpost with its keeper standing beside it (coloured from their trainer look, or the act
 * local's), a name plate over each, and a rock arch over each of a field's cave mouths. The
 * stash is the floor's chest, drawn by the dress module. Plain shapes from shared
 * materials, the same program kinds the cave already links.
 */

/** The act locals' clothes (shirt, trousers, hat), matching the pixel painter's. */
const LOCAL: Record<string, [string, string, string]> = {
  rootways: ['#7a8a4a', '#5a4630', '#c8a060'],
  cloister: ['#6a5a8a', '#3a3046', '#6a5a8a'],
  sandglass: ['#e0c080', '#8a6a3a', '#f2e2b0'],
  frostbell: ['#5a8ac0', '#3a4a6a', '#e8eef8'],
  gloom: ['#4a4060', '#2a2436', '#8a7aa8'],
};

const AWNING: Record<string, string> = { vendor: '#c04a3a', gamble: '#5a4aa8' };

export class HollowTown implements HollowModule {
  private readonly objs: THREE.Object3D[] = [];
  private readonly sprites: THREE.Sprite[] = [];
  private readonly wood = mat('#8a5a32');
  private readonly dark = mat('#5a3a20');
  private readonly paper = mat('#f4ecd8');
  private readonly skin = mat('#e8b890');
  private readonly rock = mat('#7a7060');
  private readonly hole = mat('#141018', { roughness: 1 });
  private readonly cloth = new Map<string, THREE.MeshStandardMaterial>();

  private tint(hex: string): THREE.MeshStandardMaterial {
    let m = this.cloth.get(hex);
    if (!m) {
      m = mat(hex);
      this.cloth.set(hex, m);
    }
    return m;
  }

  private box(
    g: THREE.Group,
    w: number,
    h: number,
    d: number,
    m: THREE.Material,
    x: number,
    y: number,
    z: number,
  ): void {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    g.add(mesh);
  }

  private prop(g: THREE.Group, kind: Service['kind']): void {
    if (kind === 'vendor' || kind === 'gamble') {
      this.box(g, 1.2, 0.5, 0.6, this.wood, 0, 0.25, 0);
      for (const x of [-0.55, 0.55]) this.box(g, 0.08, 1.4, 0.08, this.dark, x, 0.7, -0.25);
      this.box(g, 1.4, 0.08, 0.8, this.tint(AWNING[kind]!), 0, 1.42, -0.05);
      const goods =
        kind === 'vendor' ? ['#e05050', '#f2c040', '#8ad060'] : ['#f2d34c', '#e8e0d0', '#f2d34c'];
      goods.forEach((c, i) => {
        const ball = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), this.tint(c));
        ball.position.set(-0.35 + i * 0.35, 0.6, 0);
        g.add(ball);
      });
    } else if (kind === 'craft') {
      this.box(g, 1.2, 0.08, 0.6, this.wood, 0, 0.6, 0);
      for (const x of [-0.5, 0.5]) this.box(g, 0.08, 0.6, 0.5, this.dark, x, 0.3, 0);
      this.box(g, 0.25, 0.15, 0.2, this.tint('#8a8a96'), -0.25, 0.72, 0);
    } else if (kind === 'hire') {
      for (const x of [-0.45, 0.45]) this.box(g, 0.08, 1.4, 0.08, this.dark, x, 0.7, 0);
      this.box(g, 1.1, 0.75, 0.06, this.wood, 0, 1.15, 0);
      for (const [x, y] of [
        [-0.25, 1.25],
        [0.2, 1.3],
        [-0.15, 1.0],
        [0.25, 1.02],
      ] as const)
        this.box(g, 0.24, 0.18, 0.02, this.paper, x, y, 0.04);
    } else if (kind === 'quest') {
      this.box(g, 0.1, 1.6, 0.1, this.dark, 0, 0.8, 0);
      this.box(g, 0.8, 0.22, 0.05, this.wood, 0.2, 1.35, 0);
      const lamp = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 8, 6),
        mat('#ffe9a0', { emissive: new THREE.Color('#ffd060'), emissiveIntensity: 1 }),
      );
      lamp.position.y = 1.7;
      g.add(lamp);
    }
  }

  /** A keeper: legs, body, arms, head and hat, coloured from their look. */
  private person(g: THREE.Group, s: Service, act: string): void {
    let shirt: string;
    let pants: string;
    let hat: string;
    if (s.keeper === 'local') [shirt, pants, hat] = LOCAL[act] ?? ['#7a8a4a', '#4a3a2a', '#c8a060'];
    else {
      const look = trainerOf(s.keeper).look;
      shirt = PALETTE[look.shirt] ?? '#7a8a4a';
      pants = PALETTE[look.pants] ?? '#4a3a2a';
      hat = PALETTE[look.hat] ?? '#c8a060';
    }
    for (const x of [-0.09, 0.09]) this.box(g, 0.12, 0.45, 0.12, this.tint(pants), x, 0.23, 0);
    this.box(g, 0.36, 0.42, 0.22, this.tint(shirt), 0, 0.66, 0);
    for (const x of [-0.24, 0.24]) this.box(g, 0.1, 0.36, 0.1, this.tint(shirt), x, 0.66, 0);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.17, 12, 8), this.skin);
    head.position.y = 1.04;
    head.castShadow = true;
    g.add(head);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.04, 12), this.tint(hat));
    brim.position.y = 1.16;
    const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.14, 12), this.tint(hat));
    crown.position.y = 1.24;
    g.add(brim, crown);
  }

  build(f: Floor, ctx: HollowCtx): void {
    if (!f.zone) return;
    const act = ACTS[f.act ?? 0]!.id;
    for (const s of f.services ?? []) {
      if (s.kind === 'stash') continue;
      const at = cellCentre(f, s.cell);
      const y = cellTop(f, s.cell);
      const g = new THREE.Group();
      g.name = `hollow-town-${s.kind}`;
      g.position.set(at.x, y, at.z - 0.35);
      this.prop(g, s.kind);
      ctx.group.add(g);
      this.objs.push(g);
      const who = new THREE.Group();
      who.position.set(at.x - 0.6, y, at.z + 0.25);
      this.person(who, s, act);
      const name =
        s.keeper === 'local' ? (HOLLOW_LOCALS[act] ?? '') : (TRAINER_LABELS[s.keeper]?.name ?? '');
      const label = plate(`${name} · ${HOLLOW_ZONE_TEXT.services[s.kind] ?? ''}`, '#fff4d8');
      label.position.set(0.6, 2.0, -0.35);
      who.add(label);
      this.sprites.push(label);
      ctx.group.add(who);
      this.objs.push(who);
    }
    for (const m of f.mouths ?? []) {
      const at = cellCentre(f, m);
      const g = new THREE.Group();
      g.name = 'hollow-mouth';
      g.position.set(at.x, cellTop(f, m), at.z - 0.75);
      const arch = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.32, 6, 12, Math.PI), this.rock);
      arch.position.y = 0.1;
      arch.castShadow = true;
      const back = new THREE.Mesh(new THREE.CircleGeometry(0.62, 16, 0, Math.PI), this.hole);
      back.position.set(0, 0.1, -0.05);
      g.add(arch, back);
      ctx.group.add(g);
      this.objs.push(g);
    }
  }

  dispose(): void {
    for (const s of this.sprites) {
      s.material.map?.dispose();
      s.material.dispose();
    }
    this.sprites.length = 0;
    disposeObjects(this.objs);
  }
}
