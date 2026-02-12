/**
 * Threads Background — ReactBits inspired, raw WebGL (no dependencies)
 */
(function () {
  'use strict';

  var container = document.getElementById('threads-bg');
  if (!container) return;

  var canvas = document.createElement('canvas');
  container.appendChild(canvas);

  var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
  if (!gl) return;

  var vertSrc = 'attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0.0,1.0);}';

  var fragSrc = [
    'precision highp float;',
    'uniform float iTime;',
    'uniform vec3 iRes;',
    'uniform vec3 uCol;',
    'uniform float uAmp;',
    'uniform float uDist;',
    '#define PI 3.1415926538',
    'const int LC=40;',
    'const float LW=7.0;',
    'const float LB=10.0;',
    'float perlin(vec2 P){',
    '  vec2 Pi=floor(P);',
    '  vec4 Pf=P.xyxy-vec4(Pi,Pi+1.0);',
    '  vec4 Pt=vec4(Pi.xy,Pi.xy+1.0);',
    '  Pt=Pt-floor(Pt*(1.0/71.0))*71.0;',
    '  Pt+=vec2(26.0,161.0).xyxy;',
    '  Pt*=Pt;Pt=Pt.xzxz*Pt.yyww;',
    '  vec4 hx=fract(Pt*(1.0/951.135664));',
    '  vec4 hy=fract(Pt*(1.0/642.949883));',
    '  vec4 gx=hx-0.49999;vec4 gy=hy-0.49999;',
    '  vec4 gr=inversesqrt(gx*gx+gy*gy)*(gx*Pf.xzxz+gy*Pf.yyww);',
    '  gr*=1.414213562373;',
    '  vec2 bl=Pf.xy*Pf.xy*Pf.xy*(Pf.xy*(Pf.xy*6.0-15.0)+10.0);',
    '  vec4 b2=vec4(bl,vec2(1.0-bl));',
    '  return dot(gr,b2.zxzx*b2.wwyy);',
    '}',
    'float px(float c,vec2 r){return(1.0/max(r.x,r.y))*c;}',
    'float lineFn(vec2 st,float w,float p,float t){',
    '  float sp=0.1+p*0.4;',
    '  float an=smoothstep(sp,0.7,st.x)*0.5*uAmp;',
    '  float ts=t/10.0;',
    '  float blur=smoothstep(sp,sp+0.05,st.x)*p;',
    '  float xn=mix(perlin(vec2(ts,st.x+p)*2.5),perlin(vec2(ts,st.x+ts)*3.5)/1.5,st.x*0.3);',
    '  float y=0.5+(p-0.5)*uDist+xn/2.0*an;',
    '  float ls=smoothstep(y+w/2.0+LB*px(1.0,iRes.xy)*blur,y,st.y);',
    '  float le=smoothstep(y,y-w/2.0-LB*px(1.0,iRes.xy)*blur,st.y);',
    '  return clamp((ls-le)*(1.0-smoothstep(0.0,1.0,pow(p,0.3))),0.0,1.0);',
    '}',
    'void main(){',
    '  vec2 uv=gl_FragCoord.xy/iRes.xy;',
    '  float s=1.0;',
    '  for(int i=0;i<LC;i++){',
    '    float p=float(i)/float(LC);',
    '    s*=(1.0-lineFn(uv,LW*px(1.0,iRes.xy)*(1.0-p),p,iTime));',
    '  }',
    '  float c=1.0-s;',
    '  gl_FragColor=vec4(uCol*c,c);',
    '}'
  ].join('\n');

  function compileShader(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  var vs = compileShader(gl.VERTEX_SHADER, vertSrc);
  var fs = compileShader(gl.FRAGMENT_SHADER, fragSrc);
  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  gl.useProgram(prog);

  // Fullscreen triangle
  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  // Uniforms
  var uTime = gl.getUniformLocation(prog, 'iTime');
  var uRes = gl.getUniformLocation(prog, 'iRes');
  var uCol = gl.getUniformLocation(prog, 'uCol');
  var uAmp = gl.getUniformLocation(prog, 'uAmp');
  var uDist = gl.getUniformLocation(prog, 'uDist');

  gl.uniform3f(uCol, 0.23, 0.51, 0.96);
  gl.uniform1f(uAmp, 1.0);
  gl.uniform1f(uDist, 0.0);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  function resize() {
    var w = container.clientWidth;
    var h = container.clientHeight;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    gl.uniform3f(uRes, w, h, w / h);
  }
  window.addEventListener('resize', resize);
  resize();

  function loop(t) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uTime, t * 0.001);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
