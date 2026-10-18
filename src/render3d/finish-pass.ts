import * as THREE from 'three';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/**
 * Full 3D's last colour pass in one full-screen draw: the HDR clamp, tone mapping and the
 * sRGB encode (three's OutputPass), then the grade (saturation, tint, vignette). These were
 * three passes, each a full-resolution read and write, which a phone pays for every frame
 * (review C, item 6). The uniforms keep the names the old GRADE pass had (`uTint`,
 * `uSaturation`, `uVignette`), so the scene sets them as before. When bloom is on, a
 * separate clamp still runs ahead of it, so a bright speck cannot flood the glow.
 */
export class FinishPass extends OutputPass {
  constructor(saturation = 1.1) {
    super();
    Object.assign(this.uniforms, {
      uTint: { value: new THREE.Color('#ffffff') },
      uSaturation: { value: saturation },
      uVignette: { value: 0.35 },
    });
    let frag = this.material.fragmentShader;
    const read = 'gl_FragColor = texture2D( tDiffuse, vUv );';
    if (!frag.includes(read) || !/#endif\s*}\s*$/.test(frag)) {
      throw new Error('FinishPass: OutputShader changed shape');
    }
    frag = frag.replace(
      'uniform sampler2D tDiffuse;',
      'uniform sampler2D tDiffuse;\nuniform vec3 uTint;\nuniform float uSaturation;\nuniform float uVignette;',
    );
    frag = frag.replace(read, `${read}\ngl_FragColor.rgb = min( gl_FragColor.rgb, vec3( 4.0 ) );`);
    frag = frag.replace(
      /#endif\s*}\s*$/,
      `#endif
  float l = dot( gl_FragColor.rgb, vec3( 0.299, 0.587, 0.114 ) );
  gl_FragColor.rgb = mix( vec3( l ), gl_FragColor.rgb, uSaturation ) * uTint;
  vec2 d = vUv - 0.5;
  gl_FragColor.rgb *= 1.0 - uVignette * dot( d, d ) * 2.2;
}`,
    );
    this.material.fragmentShader = frag;
    this.material.needsUpdate = true;
  }
}
