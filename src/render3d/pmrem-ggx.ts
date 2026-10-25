import type * as THREE from 'three';

/**
 * The PMREM bake's GGX filter (three 0.186.1, `PMREMGenerator._getGGXShader`) samples with
 * the view fixed at the tangent-space pole, `importanceSampleGGX_VNDF(Xi, vec3(0, 0, 1), r)`.
 * The loop has a constant bound, so ANGLE's HLSL compiler unrolls it and folds every sample:
 * terms like `1.0 - t1 * t1` with `t1` about 4e-9 add a number smaller than double precision
 * can hold, and the program log carries warning X4122 on every load (review 2026-10-24).
 *
 * With the view at the pole the general sampler reduces to `t1 = r cos(phi)`,
 * `t2 = r sin(phi)` and `Nh.z = sqrt(1 - Xi.x)` (Heitz 2018, sections 4.2 and 4.3 with
 * `V = (0, 0, 1)`, so `s = 1`), which is the same direction with no tiny addends: `Xi.x` is
 * `i / N`, so `1 - Xi.x` folds exactly. `patchGgx` swaps that call in; the bake's output
 * does not change.
 */
export const GGX_CALL = 'importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness)';
export const GGX_POLE = 'importanceSampleGGX_Pole(Xi, roughness)';

const POLE_FN = /* glsl */ `
			vec3 importanceSampleGGX_Pole(vec2 Xi, float roughness) {
				float alpha = roughness * roughness;
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float z = sqrt(max(0.0, 1.0 - Xi.x));
				return normalize(vec3(alpha * r * cos(phi), alpha * r * sin(phi), z));
			}
`;

/** The GGX fragment source with the pole sampler; the source unchanged if it has no call. */
export function poleGgxSource(src: string): string {
  if (!src.includes(GGX_CALL) || src.includes(GGX_POLE)) return src;
  const at = src.indexOf('void main()');
  if (at < 0) return src;
  return (src.slice(0, at) + POLE_FN + '\n\t\t\t' + src.slice(at)).replace(GGX_CALL, GGX_POLE);
}

/** Patch a PMREM generator's GGX material in place (once; later calls are no-ops). */
export function patchGgx(mat: THREE.Material | null | undefined): void {
  const m = mat as THREE.ShaderMaterial | null | undefined;
  if (!m || typeof m.fragmentShader !== 'string') return;
  const next = poleGgxSource(m.fragmentShader);
  if (next === m.fragmentShader) return;
  m.fragmentShader = next;
  m.needsUpdate = true;
}
