// 문제 생성기에서 쓰는 수학 도우미 함수들
export const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
export const lcm = (a, b) => (a / gcd(a, b)) * b;

// ── 분수: {n, d} (d > 0, 기약) ──
export const fr = (n, d = 1) => {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g };
};
export const fadd = (x, y) => fr(x.n * y.d + y.n * x.d, x.d * y.d);
export const fsub = (x, y) => fr(x.n * y.d - y.n * x.d, x.d * y.d);
export const fmul = (x, y) => fr(x.n * y.n, x.d * y.d);
export const fdiv = (x, y) => fr(x.n * y.d, x.d * y.n);
export const feq = (x, y) => x.n === y.n && x.d === y.d;
export const toFrac = (v) => {
  if (v && typeof v === 'object') return fr(v.n, v.d);
  if (Number.isInteger(v)) return fr(v, 1);
  let d = 1;
  while (!Number.isInteger(Math.round(v * d * 1e9) / 1e9) && d < 1e6) d *= 10;
  return fr(Math.round(v * d), d);
};
// 분수를 LaTeX로 (음수 부호는 앞으로)
export const fTex = (f) => {
  f = toFrac(f);
  if (f.d === 1) return `${f.n}`;
  return `${f.n < 0 ? '-' : ''}\\frac{${Math.abs(f.n)}}{${f.d}}`;
};
export const fStr = (f) => (f.d === 1 ? `${f.n}` : `${f.n}/${f.d}`);
// 사용자가 입력한 문자열 → 분수 (정수, a/b, 소수 지원). 해석 불가면 null
export function parseNum(str) {
  let s = String(str).trim().replace(/−/g, '-').replace(/\s+/g, '');
  if (!s) return null;
  let m = s.match(/^(-?\d+)\/(\d+)$/);
  if (m) { const d = +m[2]; if (d === 0) return null; return fr(+m[1], d); }
  m = s.match(/^(-?)(\d*)\.(\d+)$/);
  if (m) { const frac = m[3]; const n = +((m[2] || '0') + frac); return fr((m[1] ? -1 : 1) * n, 10 ** frac.length); }
  m = s.match(/^-?\d+$/);
  if (m) return fr(+s, 1);
  return null;
}

// ── 식 표기 도우미 ──
export const paren = (n) => (n < 0 ? `(${n})` : `${n}`);
export const tp = (n) => `(${n >= 0 ? '+' : '-'}${Math.abs(n)})`; // (+3), (-5)
export const pm = (n) => `${n >= 0 ? '+' : '-'}${Math.abs(n)}`;      // +3, -5
export const C2 = (n) => (n * (n - 1)) / 2;
export const sgn = (n) => (n < 0 ? `- ${-n}` : `+ ${n}`); // "+ 3" / "- 3" (띄어쓰기 포함)
// a x + b 꼴 (계수 1 생략, 0 항 생략)
export function linTex(a, b, v = 'x') {
  let s = '';
  if (a !== 0) s += a === 1 ? v : a === -1 ? `-${v}` : `${a}${v}`;
  if (b !== 0) s += s ? (b > 0 ? `+${b}` : `${b}`) : `${b}`;
  return s || '0';
}
// 다항식 (내림차순 계수 배열) → LaTeX. 예) [2,-3,1] → 2x^2-3x+1
export function polyTex(co, v = 'x') {
  const deg = co.length - 1;
  let s = '';
  co.forEach((c, k) => {
    const p = deg - k;
    if (c === 0) return;
    const a = Math.abs(c);
    let term = '';
    if (p === 0) term = `${a}`;
    else {
      term = (a === 1 ? '' : `${a}`) + v + (p === 1 ? '' : `^{${p}}`);
    }
    s += s ? (c > 0 ? `+${term}` : `-${term}`) : (c > 0 ? term : `-${term}`);
  });
  return s || '0';
}
export const polyMul = (p, q) => {
  const r = new Array(p.length + q.length - 1).fill(0);
  p.forEach((a, i) => q.forEach((b, j) => { r[i + j] += a * b; }));
  return r;
};
export const polyAdd = (p, q) => {
  const n = Math.max(p.length, q.length);
  const r = new Array(n).fill(0);
  p.forEach((a, i) => { r[n - p.length + i] += a; });
  q.forEach((a, i) => { r[n - q.length + i] += a; });
  return r;
};
export const polyScale = (p, k) => p.map((a) => a * k);
export const polyEval = (p, x) => p.reduce((acc, c) => acc * x + c, 0);

// ── 소수·소인수분해 ──
export const isPrime = (n) => {
  if (n < 2) return false;
  for (let k = 2; k * k <= n; k++) if (n % k === 0) return false;
  return true;
};
export const PRIMES = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
export function factorize(n) {
  const out = [];
  for (let p = 2; p * p <= n; p++) {
    if (n % p === 0) {
      let e = 0;
      while (n % p === 0) { n /= p; e++; }
      out.push([p, e]);
    }
  }
  if (n > 1) out.push([n, 1]);
  return out;
}
export const factorTex = (n) => factorize(n).map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join('\\times ');
export const factorTexOf = (pairs) => pairs.map(([p, e]) => (e === 1 ? `${p}` : `${p}^{${e}}`)).join('\\times ');
export const divisors = (n) => {
  const d = [];
  for (let k = 1; k <= n; k++) if (n % k === 0) d.push(k);
  return d;
};

// ── 오답 보기 만들기 도우미 ──
export const uniq = (arr) => [...new Set(arr)];
