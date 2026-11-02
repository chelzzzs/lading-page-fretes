const VERTICE = `
attribute vec2 posicao;
void main() {
  gl_Position = vec4(posicao, 0.0, 1.0);
}
`;

const FRAGMENTO = `
precision mediump float;
uniform vec2 resolucao;
uniform float tempo;
uniform vec2 cursor;

float acaso(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float ruido(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(acaso(i), acaso(i + vec2(1.0, 0.0)), u.x), mix(acaso(i + vec2(0.0, 1.0)), acaso(i + vec2(1.0, 1.0)), u.x), u.y);
}

float camadas(vec2 p) {
  float valor = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    valor += amplitude * ruido(p);
    p *= 2.03;
    amplitude *= 0.5;
  }
  return valor;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolucao;
  vec2 p = uv;
  p.x *= resolucao.x / resolucao.y;
  float t = tempo * 0.06;

  float n = camadas(p * 1.4 + vec2(t, -t * 0.6));
  float faixa = p.y * 1.15 - p.x * 0.42 + n * 0.6;
  float linhas = sin(faixa * 16.0 - tempo * 0.8);
  float rastro = smoothstep(0.94, 1.0, linhas) * smoothstep(0.25, 0.75, n);

  vec3 noite = vec3(0.024, 0.059, 0.141);
  vec3 marinho = vec3(0.043, 0.106, 0.231);
  vec3 ambar = vec3(0.961, 0.62, 0.043);

  vec3 cor = mix(noite, marinho, smoothstep(0.0, 1.0, uv.y * 0.7 + n * 0.55));
  cor += ambar * rastro * 0.5;
  cor += ambar * 0.18 * smoothstep(0.55, 1.0, n) * (1.0 - uv.y);

  vec2 m = (uv - cursor) * vec2(resolucao.x / resolucao.y, 1.0);
  cor += ambar * 0.1 * exp(-dot(m, m) * 6.0);

  cor *= mix(0.7, 1.0, smoothstep(1.25, 0.25, length(uv - vec2(0.5, 0.6))));
  gl_FragColor = vec4(cor, 1.0);
}
`;

const ESCALA = 0.5;

function compilar(gl: WebGLRenderingContext, tipo: number, fonte: string) {
  const shader = gl.createShader(tipo);
  if (!shader) return null;
  gl.shaderSource(shader, fonte);
  gl.compileShader(shader);
  return gl.getShaderParameter(shader, gl.COMPILE_STATUS) ? shader : null;
}

export function iniciarShader(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
  if (!gl) return;

  const vertice = compilar(gl, gl.VERTEX_SHADER, VERTICE);
  const fragmento = compilar(gl, gl.FRAGMENT_SHADER, FRAGMENTO);
  const programa = gl.createProgram();
  if (!vertice || !fragmento || !programa) return;
  gl.attachShader(programa, vertice);
  gl.attachShader(programa, fragmento);
  gl.linkProgram(programa);
  if (!gl.getProgramParameter(programa, gl.LINK_STATUS)) return;
  gl.useProgram(programa);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const posicao = gl.getAttribLocation(programa, "posicao");
  gl.enableVertexAttribArray(posicao);
  gl.vertexAttribPointer(posicao, 2, gl.FLOAT, false, 0, 0);

  const uResolucao = gl.getUniformLocation(programa, "resolucao");
  const uTempo = gl.getUniformLocation(programa, "tempo");
  const uCursor = gl.getUniformLocation(programa, "cursor");

  const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const alvo = { x: 0.7, y: 0.6 };
  const cursor = { x: 0.7, y: 0.6 };
  let quadro = 0;
  let visivel = true;
  const inicio = performance.now();

  const ajustar = () => {
    const densidade = Math.min(window.devicePixelRatio || 1, 2) * ESCALA;
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * densidade));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * densidade));
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const desenhar = (agora: number) => {
    cursor.x += (alvo.x - cursor.x) * 0.06;
    cursor.y += (alvo.y - cursor.y) * 0.06;
    gl.uniform2f(uResolucao, canvas.width, canvas.height);
    gl.uniform1f(uTempo, (agora - inicio) / 1000);
    gl.uniform2f(uCursor, cursor.x, cursor.y);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!reduzir && visivel && !document.hidden) quadro = requestAnimationFrame(desenhar);
  };

  const retomar = () => {
    cancelAnimationFrame(quadro);
    quadro = requestAnimationFrame(desenhar);
  };

  new ResizeObserver(() => {
    ajustar();
    retomar();
  }).observe(canvas);

  new IntersectionObserver(([entrada]) => {
    visivel = entrada.isIntersecting;
    if (visivel) retomar();
  }).observe(canvas);

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) retomar();
  });

  window.addEventListener(
    "pointermove",
    (e) => {
      const caixa = canvas.getBoundingClientRect();
      alvo.x = (e.clientX - caixa.left) / caixa.width;
      alvo.y = 1 - (e.clientY - caixa.top) / caixa.height;
    },
    { passive: true },
  );

  ajustar();
  canvas.dataset.pronto = "";
  retomar();
}
