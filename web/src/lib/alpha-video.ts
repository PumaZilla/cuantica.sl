/** MP4 atlas: RGB on the left, silhouette on the right. A single decoder keeps
 * the mask in sync on browsers without native transparent video support. */
export function createAlphaVideo(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
 const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false });
 if (!gl) return null;
 const compile = (type: number, source: string) => {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source); gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
  return shader;
 };
 const vertex = compile(gl.VERTEX_SHADER, `attribute vec2 position; varying vec2 uv;
 void main(){uv=vec2((position.x+1.0)*0.5,(1.0-position.y)*0.5);gl_Position=vec4(position,0.0,1.0);}`);
 const fragment = compile(gl.FRAGMENT_SHADER, `precision mediump float; varying vec2 uv; uniform sampler2D film;
 void main(){vec3 color=texture2D(film,vec2(uv.x*0.5,uv.y)).rgb;
 float alpha=texture2D(film,vec2(0.5+uv.x*0.5,uv.y)).r;
 gl_FragColor=vec4(color,smoothstep(0.025,0.975,alpha));}`);
 if (!vertex || !fragment) return null;
 const program = gl.createProgram()!;
 gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
 gl.deleteShader(vertex); gl.deleteShader(fragment);
 if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
 gl.useProgram(program);
 const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
 const position = gl.getAttribLocation(program, 'position');
 gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
 const texture = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, texture);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
 gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
 let lastFrame = -1;
 return {
  render() {
   if (gl.isContextLost() || video.readyState < 2) return false;
   if (video.seeking) return lastFrame >= 0;
   const frame = Math.floor(video.currentTime * 24);
   if (lastFrame === frame) return true;
   const width = video.videoWidth / 2, height = video.videoHeight;
   if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height);
   }
   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
   gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
   lastFrame = frame;
   return true;
  }
 };
}
