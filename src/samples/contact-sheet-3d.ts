import * as THREE from 'three';

/**
 * Contact-sheet helpers for the 3D stage's likeness reviews (`&creature=art`, R0408):
 * `&angles` repeats each figure turned 0/45/90/180 degrees, `&silhouette` draws the figures
 * solid black on white with everything else hidden, and every figure gets its id as an HTML
 * label under its feet, so a screenshot names what it shows.
 */

/** The extra turns `&angles` gives each figure (radians), or a single zero turn. */
export function sheetTurns(query: URLSearchParams): number[] {
  return query.has('angles') ? [0, 45, 90, 180].map((d) => (d * Math.PI) / 180) : [0];
}

/** Black figures on white: hide the world, blank the post look, flatten every creature. */
export function silhouette(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  figures: THREE.Object3D[],
): void {
  const keep = new Set(figures);
  for (const child of [...scene.children]) {
    if (!keep.has(child) && !(child instanceof THREE.Light)) child.visible = false;
  }
  scene.background = new THREE.Color('#ffffff');
  scene.fog = null;
  scene.environment = null;
  renderer.toneMapping = THREE.NoToneMapping;
  const black = new THREE.MeshBasicMaterial({ color: '#000000' });
  for (const f of figures) {
    f.traverse((o) => {
      const m = o as THREE.Mesh;
      // The contact-shadow blob (an offset, depth-less card) is not part of the figure.
      const mat = m.material as THREE.Material | undefined;
      if (m.isMesh && mat && !Array.isArray(mat) && mat.polygonOffset && !mat.depthWrite)
        o.visible = false;
      else if (m.isMesh || (o as THREE.Points).isPoints) m.material = black;
      if (m.isMesh) m.castShadow = false;
      // Sprite catchlights and emotes would punch white holes in the shape.
      if ((o as THREE.Sprite).isSprite) o.visible = false;
    });
  }
}

/**
 * Id labels over the canvas, one per labelled figure, placed under its feet every frame.
 * Returns the per-frame update and an unmount.
 */
export function sheetLabels(
  canvas: HTMLCanvasElement,
  camera: THREE.Camera,
  figures: Array<{ group: THREE.Object3D; label: string }>,
): { update: () => void; dispose: () => void } {
  const layer = document.createElement('div');
  layer.style.cssText =
    'position:fixed;inset:0;pointer-events:none;font:600 11px/1.2 system-ui,sans-serif;z-index:5';
  document.body.appendChild(layer);
  const tags = figures.map(({ label }) => {
    const t = document.createElement('div');
    t.textContent = label;
    t.style.cssText =
      'position:absolute;transform:translate(-50%,0);padding:1px 4px;border-radius:3px;' +
      'background:rgba(255,255,255,0.85);color:#111;white-space:nowrap';
    layer.appendChild(t);
    return t;
  });
  const v = new THREE.Vector3();
  const update = () => {
    const r = canvas.getBoundingClientRect();
    figures.forEach(({ group }, i) => {
      v.setFromMatrixPosition(group.matrixWorld).project(camera);
      const tag = tags[i]!;
      tag.style.left = `${r.left + ((v.x + 1) / 2) * r.width}px`;
      tag.style.top = `${r.top + ((1 - v.y) / 2) * r.height + 4}px`;
    });
  };
  return { update, dispose: () => layer.remove() };
}
