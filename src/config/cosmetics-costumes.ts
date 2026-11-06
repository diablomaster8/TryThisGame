/**
 * R0413 (LOOK-33, lane E r11): body costumes that keep the Nubbin's face. Each recolours the
 * body roles and adds a few parts (`px`/`mesh` on the body, `head`/`headMesh` on the head).
 * None of them covers the eyes or the mouth: hoods and helmets stop at the brow. The looks
 * are art suggestions only, drawn by both renderers from this data.
 */
import type { Cosmetic, MeshOp, PxOp } from './cosmetics';
import { COSTUME_LABELS } from './strings-look-r11e';

const mirror = <T>(f: (s: 1 | -1) => T[]): T[] => [...f(-1), ...f(1)];

const costume = (
  id: keyof typeof COSTUME_LABELS,
  recolour: NonNullable<Cosmetic['costume']>,
  px: readonly PxOp[],
  mesh: readonly MeshOp[],
  head: readonly PxOp[],
  headMesh: readonly MeshOp[],
): Cosmetic => ({
  id,
  label: COSTUME_LABELS[id],
  slot: 'body',
  rarity: 'rare',
  source: 'shop',
  costume: recolour,
  px,
  mesh,
  head,
  headMesh,
});

export const COSTUME_COSMETICS: readonly Cosmetic[] = [
  costume(
    'costume-bee',
    { body: 'sunYellow', shade: 'sunDeep', belly: 'sunLight' },
    [
      ['rect', -6, 0, 12, 1, 'ink'],
      ['rect', -6, 3, 12, 1, 'ink'],
      ['ellipse', -8, -3, 2.5, 1.5, 'white'],
      ['ellipse', 8, -3, 2.5, 1.5, 'white'],
    ],
    [
      ['torus', 'ink', [0, 0.1, 0], [0.8, 0.8, 0.1], [Math.PI / 2, 0, 0]],
      ['torus', 'ink', [0, -0.2, 0], [0.82, 0.82, 0.1], [Math.PI / 2, 0, 0]],
      ['sphere', 'white', [-0.55, 0.35, -0.45], [0.3, 0.04, 0.2]],
      ['sphere', 'white', [0.55, 0.35, -0.45], [0.3, 0.04, 0.2]],
    ],
    mirror<PxOp>((s) => [
      ['line', s * 2, 0, s * 4, -5, 'ink'],
      ['disc', s * 4, -5, 1.1, 'sunYellow'],
    ]),
    mirror<MeshOp>((s) => [
      ['cyl', 'ink', [s * 0.16, 0.22, 0], [0.02, 0.32, 0.02], [0, 0, -s * 0.3]],
      ['sphere', 'sunYellow', [s * 0.24, 0.4, 0], 0.07],
    ]),
  ),
  costume(
    'costume-frog',
    { body: 'leaf', shade: 'leafDeep', belly: 'mint' },
    [
      ['ellipse', 0, 4, 4, 2, 'leafLight'],
      ['px', -3, 8, 'leafDeep'],
      ['px', 3, 8, 'leafDeep'],
    ],
    [['sphere', 'leafLight', [0, -0.2, 0.62], [0.4, 0.22, 0.12]]],
    [
      ['ellipse', 0, 2, 7, 3, 'leaf'],
      ['disc', -4, -1, 2.2, 'white'],
      ['disc', 4, -1, 2.2, 'white'],
      ['px', -4, -1, 'ink'],
      ['px', 4, -1, 'ink'],
    ],
    [
      ['dome', 'leaf', [0, -0.12, 0], [0.7, 0.4, 0.7]],
      ...mirror<MeshOp>((s) => [
        ['sphere', 'white', [s * 0.28, 0.14, 0.12], 0.15],
        ['sphere', 'ink', [s * 0.28, 0.14, 0.25], 0.065],
      ]),
    ],
  ),
  costume(
    'costume-ghost',
    { body: 'white', shade: 'lilacGrey', belly: 'pale' },
    [
      ['tri', -7, 6, -3, 6, -5, 10, 'white'],
      ['tri', -3, 6, 1, 6, -1, 10, 'white'],
      ['tri', 1, 6, 5, 6, 3, 10, 'white'],
      ['tri', 4, 6, 8, 6, 6, 10, 'white'],
    ],
    [
      ['torus', 'white', [0, -0.5, 0], [0.84, 0.84, 0.6], [Math.PI / 2, 0, 0]],
      ['torus', 'pale', [0, -0.62, 0], [0.88, 0.88, 0.3], [Math.PI / 2, 0, 0]],
    ],
    [
      ['ellipse', 0, 2, 8, 3.5, 'white'],
      ['line', -6, 5, 6, 5, 'pale'],
    ],
    [['dome', 'white', [0, -0.1, 0], [0.78, 0.46, 0.78]]],
  ),
  costume(
    'costume-dino',
    { body: 'leaf', shade: 'leafDeep', belly: 'sunLight' },
    [
      ['tri', -2, -5, 2, -5, 0, -9, 'orange'],
      ['tri', -2, -1, 2, -1, 0, -5, 'orange'],
      ['tri', 6, 4, 10, 6, 6, 8, 'leaf'],
      ['tri', 9, 5, 12, 6, 9, 7, 'leafLight'],
    ],
    [
      ...[0.35, 0, -0.35].map(
        (y, i) =>
          [
            'cone',
            'orange',
            [0, y + 0.1, -0.7 - i * 0.04],
            [0.12, 0.2, 0.12],
            [-1.1, 0, 0],
          ] as MeshOp,
      ),
      ['cone', 'leaf', [0, -0.45, -0.75], [0.28, 0.6, 0.28], [-1.4, 0, 0]],
    ],
    [
      ['ellipse', 0, 2, 7, 3, 'leaf'],
      ['tri', -4, 0, -1, 0, -2.5, -4, 'orange'],
      ['tri', -1.5, 0, 1.5, 0, 0, -5, 'orange'],
      ['tri', 1, 0, 4, 0, 2.5, -4, 'orange'],
    ],
    [
      ['dome', 'leaf', [0, -0.12, 0], [0.7, 0.4, 0.7]],
      ...[-0.28, 0, 0.28].map((x) => ['cone', 'orange', [x, 0.2, 0], [0.11, 0.24, 0.11]] as MeshOp),
    ],
  ),
  costume(
    'costume-knight',
    { body: 'lilacGrey', shade: 'greyDeep', belly: 'greyLight' },
    [
      ['rect', 9, -4, 2, 8, 'sand'],
      ['rect', 8, 4, 4, 1, 'bark'],
      ['rect', 9, 5, 2, 2, 'darkBark'],
    ],
    [
      ['box', 'sand', [0.92, 0.1, 0.12], [0.07, 0.8, 0.03]],
      ['box', 'bark', [0.92, -0.32, 0.12], [0.26, 0.05, 0.05]],
      ['cyl', 'darkBark', [0.92, -0.45, 0.12], [0.04, 0.18, 0.04]],
    ],
    [
      ['ellipse', 0, 2, 7, 3.5, 'lilacGrey'],
      ['rect', -7, 4, 15, 1, 'greyDeep'],
      ['tri', -1.5, -1, 1.5, -1, 0, -6, 'berry'],
    ],
    [
      ['dome', 'lilacGrey', [0, -0.1, 0], [0.76, 0.44, 0.76]],
      ['cone', 'berry', [0, 0.28, 0], [0.1, 0.3, 0.1]],
    ],
  ),
];
