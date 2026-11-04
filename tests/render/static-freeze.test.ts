/* r11-d3: frozen scenery must thaw the moment anything moves it, whatever the path, so the
 * freezer never leaves a stale matrix on screen; and the audit must catch a stale one. */
import { describe, expect, it } from 'vitest';
import { Group, Mesh, Object3D, Scene, Vector3 } from 'three';
import { StaticFreezer, auditMatrices } from '../../src/render3d/static-freeze';

function build() {
  const scene = new Scene();
  const a = new Group();
  a.position.set(1, 2, 3);
  const b = new Mesh();
  b.position.set(0, 1, 0);
  b.rotation.y = 0.5;
  const c = new Object3D();
  c.scale.set(2, 2, 2);
  const d = new Object3D();
  d.position.x = 4;
  const actors = new Group();
  const rig = new Object3D();
  actors.add(rig);
  scene.add(a, d, actors);
  a.add(b);
  b.add(c);
  const fz = new StaticFreezer(scene, (o) => o === actors, 1000);
  scene.updateMatrixWorld();
  fz.sweep(); // first look
  fz.sweep(); // still since: frozen
  scene.updateMatrixWorld();
  return { scene, a, b, c, d, rig, fz };
}

function clean(scene: Scene, fz: StaticFreezer): void {
  scene.updateMatrixWorld();
  expect(auditMatrices(scene, (o) => fz.isFrozen(o)).stale).toEqual([]);
}

describe('static freezer', () => {
  it('freezes still scenery and leaves the excluded subtree alone', () => {
    const { scene, a, c, rig, fz } = build();
    expect(fz.isFrozen(scene)).toBe(true);
    expect(fz.isFrozen(a)).toBe(true);
    expect(fz.isFrozen(c)).toBe(true);
    expect(rig.matrixAutoUpdate).toBe(true);
    expect(fz.stats.frozen).toBe(5);
    clean(scene, fz);
  });

  it('does not freeze what moved between sweeps', () => {
    const scene = new Scene();
    const o = new Object3D();
    scene.add(o);
    const fz = new StaticFreezer(scene, () => false, 1000);
    fz.sweep();
    o.position.x += 1;
    fz.sweep();
    expect(o.matrixAutoUpdate).toBe(true);
  });

  it('thaws on a write through a kept reference to position', () => {
    const { scene, b, fz } = build();
    const p = b.position;
    p.x = 7;
    expect(fz.isFrozen(b)).toBe(false);
    clean(scene, fz);
    expect(new Vector3().setFromMatrixPosition(b.matrixWorld).x).toBeCloseTo(8);
  });

  it('thaws on rotation, quaternion, lookAt and scale writes', () => {
    const { scene, a, b, c, fz } = build();
    a.rotation.z = 1;
    clean(scene, fz);
    b.quaternion.set(0, 0, 0.6, 0.8);
    clean(scene, fz);
    c.lookAt(5, 5, 5);
    clean(scene, fz);
    fz.sweep();
    fz.sweep(); // c frozen again
    expect(fz.isFrozen(c)).toBe(true);
    c.scale.multiplyScalar(0.5);
    clean(scene, fz);
  });

  it('thaws on reparenting and attach', () => {
    const { scene, a, c, d, fz } = build();
    d.add(c);
    clean(scene, fz);
    fz.sweep();
    fz.sweep();
    a.attach(c);
    clean(scene, fz);
  });

  it('a moved parent still carries its frozen children', () => {
    const { scene, a, c, fz } = build();
    a.position.y += 5;
    expect(fz.isFrozen(c)).toBe(true);
    clean(scene, fz);
  });

  it('the audit flags a frozen object moved behind the freezer', () => {
    const { scene, d, fz } = build();
    d.matrix.makeTranslation(9, 9, 9); // a stale matrix the traps cannot see
    expect(auditMatrices(scene, (o) => fz.isFrozen(o)).stale.length).toBeGreaterThan(0);
  });
});
