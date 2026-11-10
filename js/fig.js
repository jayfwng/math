// 문제에 넣는 간단한 SVG 그림 도우미 (색은 CSS 변수라 다크모드에서도 보인다)
const f1 = (v) => Math.round(v * 10) / 10;
const wrap = (w, h, inner) => `<svg class="fig" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img">${inner}</svg>`;
const L = (x1, y1, x2, y2, cls = 'f-line') => `<line class="${cls}" x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/>`;
const T = (x, y, s, cls = 'f-txt', anchor = 'middle') => `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}" dominant-baseline="middle">${s}</text>`;
const C = (x, y, r, cls = 'f-pt') => `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>`;

// ── 수직선 ──
export function numberLine({ min, max, marks = [], step = 1, labelEvery = 1 }) {
  const W = 340, H = 80, pad = 22, y = 44;
  const X = (v) => pad + ((v - min) / (max - min)) * (W - 2 * pad);
  let s = L(8, y, W - 8, y, 'f-axis') + `<polygon class="f-fill" points="${W - 6},${y} ${W - 14},${y - 4} ${W - 14},${y + 4}"/>`;
  for (let v = Math.ceil(min); v <= max; v += step) {
    s += L(X(v), y - 5, X(v), y + 5, 'f-axis');
    if ((v - Math.ceil(min)) % labelEvery === 0) s += T(X(v), y + 18, String(v).replace('-', '−'), 'f-tick');
  }
  for (const m of marks) {
    s += C(X(m.v), y, 5.5, m.hollow ? 'f-pt-hollow' : 'f-pt');
    if (m.label) s += T(X(m.v), y - 16, m.label, 'f-txt');
  }
  return wrap(W, H, s);
}

// ── 좌표평면 ──
export function coordPlane({ xmin = -5, xmax = 5, ymin = -5, ymax = 5, pts = [], lines = [], curves = [], segs = [], w = 300, grid = true, ticks = true }) {
  const pad = 20;
  const sx = (w - 2 * pad) / (xmax - xmin);
  const sy = sx;
  const H = Math.round((ymax - ymin) * sy + 2 * pad);
  const X = (x) => pad + (x - xmin) * sx;
  const Y = (y) => H - pad - (y - ymin) * sy;
  let s = '';
  if (grid) {
    for (let x = Math.ceil(xmin); x <= xmax; x++) s += L(X(x), Y(ymin), X(x), Y(ymax), 'f-grid');
    for (let y = Math.ceil(ymin); y <= ymax; y++) s += L(X(xmin), Y(y), X(xmax), Y(y), 'f-grid');
  }
  s += L(X(xmin), Y(0), X(xmax), Y(0), 'f-axis') + L(X(0), Y(ymin), X(0), Y(ymax), 'f-axis');
  s += T(X(xmax) - 2, Y(0) + 12, 'x', 'f-tick') + T(X(0) + 12, Y(ymax) + 2, 'y', 'f-tick') + T(X(0) - 8, Y(0) + 10, 'O', 'f-tick');
  if (ticks) {
    const rng = xmax - xmin;
    const st = rng > 14 ? 5 : rng > 8 ? 2 : 1;
    for (let x = Math.ceil(xmin); x <= xmax; x++) if (x !== 0 && x % st === 0) s += T(X(x), Y(0) + 11, String(x).replace('-', '−'), 'f-tick');
    for (let y = Math.ceil(ymin); y <= ymax; y++) if (y !== 0 && y % st === 0) s += T(X(0) - 10, Y(y), String(y).replace('-', '−'), 'f-tick');
  }
  const clipId = `c${Math.abs((xmin * 7 + xmax * 13 + ymin * 17 + ymax * 19 + w) | 0)}`;
  s = `<defs><clipPath id="${clipId}"><rect x="${pad}" y="${pad}" width="${w - 2 * pad}" height="${H - 2 * pad}"/></clipPath></defs>` + s;
  let g = '';
  for (const ln of lines) {
    const x1 = xmin, x2 = xmax;
    g += L(X(x1), Y(ln.a * x1 + ln.b), X(x2), Y(ln.a * x2 + ln.b), ln.cls || 'f-curve');
  }
  for (const cv of curves) {
    const n = 120; let d = '';
    for (let k = 0; k <= n; k++) {
      const x = xmin + ((xmax - xmin) * k) / n;
      const y = cv.fn(x);
      if (!Number.isFinite(y)) continue;
      d += `${d ? 'L' : 'M'}${f1(X(x))},${f1(Y(y))}`;
    }
    g += `<path class="${cv.cls || 'f-curve'}" d="${d}" fill="none"/>`;
  }
  for (const sg of segs) g += L(X(sg[0]), Y(sg[1]), X(sg[2]), Y(sg[3]), sg[4] || 'f-curve');
  s += `<g clip-path="url(#${clipId})">${g}</g>`;
  for (const p of pts) {
    s += C(X(p.x), Y(p.y), 4.2, p.hollow ? 'f-pt-hollow' : 'f-pt');
    if (p.label) s += T(X(p.x) + (p.dx ?? 11), Y(p.y) + (p.dy ?? -9), p.label, 'f-txt');
  }
  return wrap(w, H, s);
}

// ── 다각형(꼭짓점 라벨, 변·각 표시) ──
// pts: [[x,y],...] (SVG 좌표), names: ['A','B',...], sideLabels: {'0-1':'5cm'}, angleLabels: {0:'70°'}
export function polygonFig({ pts, names = [], sideLabels = {}, angleLabels = {}, w = 260, h = 200, extra = '' }) {
  const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
  const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
  let s = `<polygon class="f-poly" points="${pts.map((p) => p.join(',')).join(' ')}"/>`;
  pts.forEach((p, i) => {
    const dx = p[0] - cx, dy = p[1] - cy, d = Math.hypot(dx, dy) || 1;
    if (names[i]) s += T(p[0] + (dx / d) * 14, p[1] + (dy / d) * 14, names[i], 'f-name');
  });
  for (const [k, lab] of Object.entries(sideLabels)) {
    const [i, j] = k.split('-').map(Number);
    const a = pts[i], b = pts[j];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const dx = mx - cx, dy = my - cy, d = Math.hypot(dx, dy) || 1;
    s += T(mx + (dx / d) * 16, my + (dy / d) * 14, lab, 'f-txt');
  }
  for (const [k, lab] of Object.entries(angleLabels)) {
    const i = +k, p = pts[i];
    const dx = cx - p[0], dy = cy - p[1], d = Math.hypot(dx, dy) || 1;
    s += T(p[0] + (dx / d) * 24, p[1] + (dy / d) * 24, lab, 'f-ang');
  }
  return wrap(w, h, s + extra);
}

// ── 원 ──
// pts: [{ang:도(수학 방향, 반시계), name}] chords: [[i,j]] radii: [i] center: bool
export function circleFig({ pts = [], chords = [], radii = [], center = true, w = 240, r = 80, extra = '', centerName = 'O', lines = [] }) {
  const H = w, cx = w / 2, cy = H / 2;
  const P = (a) => [cx + r * Math.cos((a * Math.PI) / 180), cy - r * Math.sin((a * Math.PI) / 180)];
  let s = `<circle class="f-poly" cx="${cx}" cy="${cy}" r="${r}"/>`;
  if (center) s += C(cx, cy, 3) + T(cx + 2, cy + 14, centerName, 'f-name');
  for (const i of radii) { const p = P(pts[i].ang); s += L(cx, cy, p[0], p[1]); }
  for (const [i, j] of chords) { const a = P(pts[i].ang), b = P(pts[j].ang); s += L(a[0], a[1], b[0], b[1]); }
  for (const ln of lines) s += L(ln[0], ln[1], ln[2], ln[3]);
  pts.forEach((p) => {
    const q = P(p.ang), q2 = [cx + (r + 15) * Math.cos((p.ang * Math.PI) / 180), cy - (r + 15) * Math.sin((p.ang * Math.PI) / 180)];
    s += C(q[0], q[1], 3);
    if (p.name) s += T(q2[0], q2[1], p.name, 'f-name');
  });
  return wrap(w, H, s + extra);
}

// ── 막대그래프 / 히스토그램 ──
export function barChart({ values, labels = [], w = 300, h = 170, gap = 2, unit = '', ymax }) {
  const pad = 28, top = 14;
  const mx = ymax ?? Math.max(...values);
  const bw = (w - pad - 10) / values.length;
  let s = L(pad, h - pad, w - 6, h - pad, 'f-axis') + L(pad, top, pad, h - pad, 'f-axis');
  const steps = Math.min(5, mx);
  for (let k = 1; k <= steps; k++) {
    const v = Math.round((mx * k) / steps * 10) / 10;
    const y = h - pad - ((h - pad - top) * v) / mx;
    s += L(pad, y, w - 6, y, 'f-grid') + T(pad - 4, y, String(v), 'f-tick', 'end');
  }
  values.forEach((v, i) => {
    const bh = ((h - pad - top) * v) / mx;
    s += `<rect class="f-bar" x="${f1(pad + i * bw + gap)}" y="${f1(h - pad - bh)}" width="${f1(bw - gap * 2)}" height="${f1(bh)}"/>`;
    if (labels[i] !== undefined) s += T(pad + i * bw + bw / 2, h - pad + 12, labels[i], 'f-tick');
  });
  if (unit) s += T(w - 8, h - 6, unit, 'f-tick', 'end');
  return wrap(w, h, s);
}

export const svgRaw = (w, h, inner) => wrap(w, h, inner);
export const fig = { L, T, C };
