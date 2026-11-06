import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { BufferGeometry, Group, type Mesh } from 'three';

// R0439 (LOOK-71): an `art:<id>` look resolves a .glb first and falls back to the sculpt.
// The sculpt side is mocked; the model is the tiny fixture from tests/tools/make-test-glb.ts.
let sculpted = 0;
vi.mock('../../src/render3d/art/species', async (orig) => ({
  ...(await orig<typeof import('../../src/render3d/art/species')>()),
  buildSpecies: () => {
    sculpted++;
    return { group: new Group() };
  },
}));
vi.mock('../../src/render3d/looks', () => ({ specForKey: () => ({}), tintMods: () => [] }));
vi.mock('../../src/render3d/toon-outline', () => ({ addOutlines: () => {} }));

const glb = await import('../../src/render3d/glb-art');
const { CreaturePool } = await import('../../src/render3d/creature-pool');

function fixture(): ArrayBuffer {
  const b = readFileSync(new URL('../fixtures/test-figure.glb', import.meta.url));
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}

function pool() {
  const p = new CreaturePool();
  (p as unknown as { farm: unknown }).farm = {
    surfaces: () => Promise.resolve([new BufferGeometry()]),
    surfaceCount: () => 1,
    forget: () => {},
    dispose: () => {},
    holdWrites: false,
    saveSoon: () => {},
  };
  p.burst = true;
  return p;
}

describe('glb art (R0439)', () => {
  it('reads the species id from an art look key', () => {
    expect(glb.glbArtId('art:zapling')).toBe('zapling');
    expect(glb.glbArtId('art:zapling~shiny~egg:blue')).toBe('zapling');
    expect(glb.glbArtId('variant:child')).toBeNull();
  });

  it('parses the fixture into a scene with named nodes', async () => {
    const art = await glb.parseGlb(fixture());
    const names: string[] = [];
    art.scene.traverse((o) => names.push(o.name));
    expect(names).toEqual(expect.arrayContaining(['head', 'armL', 'armR', 'body']));
  });

  it('builds a listed species from its model, with bones, and poses it', async () => {
    const art = await glb.parseGlb(fixture());
    glb.setGlbManifest(['zapling']);
    glb.setGlbArt('zapling', art);
    const before = sculpted;
    const p = pool();
    p.frame();
    const rig = p.acquire({ key: 'art:zapling', height: 1.2 });
    expect(rig).not.toBeNull();
    expect(sculpted).toBe(before);
    expect(rig!.bones.head).toBeDefined();
    expect(rig!.group.scale.x).toBeGreaterThan(0);
    rig!.setPose('walk');
    rig!.face(1);
    for (let t = 0; t < 1; t += 0.1) rig!.animate(t);
    expect(Number.isFinite(rig!.group.rotation.y)).toBe(true);
    // Its own copy of the geometry, so the pool may free it alone.
    let shared = false;
    art.scene.traverse((o) => {
      const m = o as Mesh;
      rig!.group.traverse((r) => {
        if (m.isMesh && (r as Mesh).geometry === m.geometry) shared = true;
      });
    });
    expect(shared).toBe(false);
  });

  it('sculpts as before when the manifest does not list the species', async () => {
    glb.setGlbManifest([]);
    expect(glb.glbFor('art:zapling')).toBe('none');
    const before = sculpted;
    const p = pool();
    p.frame();
    expect(p.acquire({ key: 'art:zapling', height: 1 })).toBeNull();
    await Promise.resolve();
    await Promise.resolve();
    p.frame();
    expect(p.acquire({ key: 'art:zapling', height: 1 })).not.toBeNull();
    expect(sculpted).toBe(before + 1);
  });

  it('falls back to the sculpt when a listed model fails to load', () => {
    glb.setGlbManifest(['zapling']);
    glb.setGlbArt('zapling', null);
    expect(glb.glbFor('art:zapling')).toBe('none');
    expect(glb.glbFor('variant:child')).toBe('none');
  });
});
