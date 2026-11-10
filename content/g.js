// 기하: 이차곡선 · 평면벡터 · 공간도형과 공간좌표
import { gcd } from '../js/lib.js';

const T = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const uniq = (arr, not) => [...new Set(arr.map(String))].filter((x) => x !== String(not));
const fS = (n, d) => { const g = gcd(n, d) || 1; let a = n / g, b = d / g; if (b < 0) { a = -a; b = -b; } return b === 1 ? `${a}` : `\\dfrac{${a}}{${b}}`; };
const W = (ans, ...c) => { const s = new Set(); [...c, ans + 1, ans - 1, ans + 2, ans - 2, ans * 2].forEach((v) => { if (v !== ans && Number.isFinite(v)) s.add(v); }); return [...s].slice(0, 4); };
const FO = (n, d, ...alts) => {
  const ans = fS(n, d);
  const cand = uniq([...alts, fS(d - n, d), fS(n + 1, d), fS(n, d + 1), fS(n + 2, d + 1), fS(n - 1, d), fS(1, d + 2), fS(n, d + 2)], ans);
  return { correct: `$${ans}$`, wrong: cand.slice(0, 3).map((s) => `$${s}$`) };
};
const CS = (ans, wr) => { const w = uniq(wr, ans).slice(0, 3); return { correct: `$${ans}$`, wrong: w.map((s) => `$${s}$`) }; };
const pr = (n) => (n < 0 ? `(${n})` : `${n}`);
const sx = (n) => (n === 0 ? '' : n > 0 ? `+${n}` : `${n}`);
const sh = (v, n) => (n === 0 ? v : `(${v}${n > 0 ? '-' : '+'}${Math.abs(n)})`); // (x-h)
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [6, 8, 10], [9, 12, 15], [7, 24, 25]];
const SPACE = [[1, 2, 2, 3], [2, 3, 6, 7], [2, 6, 9, 11], [4, 4, 7, 9], [1, 4, 8, 9], [3, 4, 12, 13], [2, 10, 11, 15]];
const EQ = (n, d) => `\\dfrac{${n}}{${d}}${fS(n, d) === `\\dfrac{${n}}{${d}}` ? '' : `=${fS(n, d)}`}`;
const ellEq = (a, b) => `\\dfrac{x^2}{${a * a}}+\\dfrac{y^2}{${b * b}}=1`;
const hypEq = (a, b) => `\\dfrac{x^2}{${a * a}}-\\dfrac{y^2}{${b * b}}=1`;

export default [
  // ───────────── 이차곡선 ─────────────
  {
    id: 'g.parab',
    lesson: [
      { id: 'c1', t: '포물선의 정의', b: T`평면 위에서 ==한 점 $F$(초점)과 한 직선 $l$(준선)까지의 거리가 같은== 점들의 모임
        - 꼭짓점이 원점, 초점 $F(p,0)$, 준선 $x=-p$ → ==$y^2=4px$==
        - 초점 $F(0,p)$, 준선 $y=-p$ → ==$x^2=4py$==
        - 점 $P$에서 초점까지의 거리 = 준선까지의 거리` },
      { id: 'c2', t: '평행이동한 포물선', b: T`$y^2=4px$를 $x$축으로 $h$, $y$축으로 $k$만큼 평행이동하면
        $$(y-k)^2=4p(x-h)$$
        - 꼭짓점 $(h,k)$
        - 초점 $(h+p,\,k)$
        - 준선 $x=h-p$` },
    ],
    gens: [
      { id: 'focus', lv: [1, 3], card: 'c1', make: (R) => {
        const p = R.nz(-5, 5); const vert = R.chance(0.4);
        if (!vert) return { q: `포물선 $y^2=${4 * p}x$의 초점의 좌표는?`, ...CS(`(${p},0)`, [`(${-p},0)`, `(0,${p})`, `(${2 * p},0)`, `(${4 * p},0)`]), why: `$y^2=4px$ 꼴에서 $4p=${4 * p}$ → $p=${p}$ → 초점 $(${p},0)$` };
        return { q: `포물선 $x^2=${4 * p}y$의 초점의 좌표는?`, ...CS(`(0,${p})`, [`(0,${-p})`, `(${p},0)`, `(0,${2 * p})`, `(0,${4 * p})`]), why: `$x^2=4py$ 꼴에서 $p=${p}$ → 초점 $(0,${p})$` };
      } },
      { id: 'dir', lv: [1, 3], card: 'c1', make: (R) => {
        const p = R.nz(-5, 5);
        return { q: `포물선 $y^2=${4 * p}x$의 준선의 방정식은?`, ...CS(`x=${-p}`, [`x=${p}`, `y=${-p}`, `y=${p}`, `x=${-4 * p}`]), why: `$p=${p}$ → 초점 $(${p},0)$, 준선 $x=-p=${-p}$` };
      } },
      { id: 'eq', lv: [2, 4], card: 'c1', make: (R) => {
        const p = R.nz(-5, 5);
        return { q: `초점이 $F(${p},0)$이고 준선이 $x=${-p}$인 포물선의 방정식은?`, ...CS(`y^2=${4 * p}x`, [`y^2=${p}x`, `y^2=${2 * p}x`, `x^2=${4 * p}y`, `y^2=${-4 * p}x`]), why: `꼭짓점이 원점이고 $p=${p}$ → $y^2=4px=${4 * p}x$` };
      } },
      { id: 'dist', lv: [3, 5], card: 'c1', make: (R) => {
        const p = R.int(1, 4), t = R.int(1, 3); const x1 = p * t * t, y1 = 2 * p * t * R.pick([1, -1]); const ans = x1 + p;
        return { q: `포물선 $y^2=${4 * p}x$ 위의 점 $P(${x1},${y1})$에서 초점까지의 거리는?`, a: ans, wrong: W(ans, x1, x1 - p, Math.abs(y1)), why: `초점까지의 거리 = 준선($x=${-p}$)까지의 거리 $=${x1}-(${-p})=${ans}$` };
      } },
      { id: 'shift', lv: [4, 5], card: 'c2', make: (R) => {
        const p = R.int(1, 4) * R.pick([1, -1]), h = R.int(-3, 4), k = R.int(-3, 4);
        const eq = `(y${k === 0 ? '' : k > 0 ? `-${k}` : `+${-k}`})^2=${4 * p}(x${h === 0 ? '' : h > 0 ? `-${h}` : `+${-h}`})`;
        return { q: `포물선 $${eq.replace('(y)', 'y')}$의 초점의 좌표는?`, ...CS(`(${h + p},${k})`, [`(${h - p},${k})`, `(${h},${k + p})`, `(${h + 4 * p},${k})`, `(${h},${k})`]), why: `꼭짓점 $(${h},${k})$, $4p=${4 * p}$ → $p=${p}$ → 초점 $(${h}+${pr(p)},\\,${k})=(${h + p},${k})$` };
      } },
    ],
  },
  {
    id: 'g.ellipse',
    lesson: [
      { id: 'c1', t: '타원의 정의', b: T`평면 위의 두 정점 $F,F'$(초점)에서의 ==거리의 합이 일정==한 점들의 모임
        $$PF+PF'=2a\ (\text{장축의 길이})$$` },
      { id: 'c2', t: '타원의 방정식', b: T`$\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$
        - $a>b>0$: 초점 $(\pm c,0)$, ==$c^2=a^2-b^2$==, 장축 $2a$(가로), 단축 $2b$
        - $b>a>0$: 초점 $(0,\pm c)$, ==$c^2=b^2-a^2$==, 장축 $2b$(세로)
        - 큰 쪽 분모가 있는 변수 방향이 ==장축==이에요.` },
    ],
    gens: [
      { id: 'foc', lv: [1, 3], card: 'c2', make: (R) => {
        const [a, b, c] = R.pick([[5, 3, 4], [5, 4, 3], [13, 12, 5], [10, 6, 8], [17, 15, 8], [25, 24, 7], [13, 5, 12], [10, 8, 6]]); const vert = R.chance(0.35);
        const [A, B] = vert ? [b, a] : [a, b];
        const eq = ellEq(A, B);
        if (vert) return { q: `타원 $${eq}$의 두 초점의 좌표는?`, ...CS(`(0,\\pm${c})`, [`(\\pm${c},0)`, `(0,\\pm${a})`, `(\\pm${a},0)`, `(0,\\pm${b})`]), why: `$b^2>a^2$이므로 초점은 $y$축 위. $c^2=${a * a}-${b * b}=${c * c}$ → $(0,\\pm${c})$` };
        return { q: `타원 $${eq}$의 두 초점의 좌표는?`, ...CS(`(\\pm${c},0)`, [`(0,\\pm${c})`, `(\\pm${a},0)`, `(\\pm${b},0)`, `(0,\\pm${a})`]), why: `$a^2>b^2$이므로 초점은 $x$축 위. $c^2=${a * a}-${b * b}=${c * c}$ → $(\\pm${c},0)$` };
      } },
      { id: 'cnum', lv: [2, 4], card: 'c2', make: (R) => {
        const [a, b, c] = R.pick([[5, 3, 4], [5, 4, 3], [13, 12, 5], [10, 6, 8], [17, 15, 8], [25, 24, 7]]);
        return { q: `타원 $${ellEq(a, b)}$의 두 초점 사이의 거리는?`, a: 2 * c, wrong: W(2 * c, c, 2 * a, 2 * b), why: `$c^2=${a * a}-${b * b}=${c * c}$ → $c=${c}$ → 초점 사이 거리 $2c=${2 * c}$` };
      } },
      { id: 'axis', lv: [1, 3], card: 'c2', make: (R) => {
        const a = R.int(3, 8), b = R.int(2, a - 1); const maj = R.chance(0.5);
        return { q: `타원 $${ellEq(a, b)}$의 ${maj ? '장축' : '단축'}의 길이는?`, a: maj ? 2 * a : 2 * b, wrong: W(maj ? 2 * a : 2 * b, maj ? a : b, maj ? 2 * b : 2 * a, a * a), why: `$a=${a}$, $b=${b}$ → ${maj ? `장축 $2a=${2 * a}$` : `단축 $2b=${2 * b}$`}` };
      } },
      { id: 'sum', lv: [2, 4], card: 'c1', make: (R) => {
        const [a, b] = R.pick([[5, 3], [5, 4], [13, 12], [10, 6], [17, 15], [7, 4]]);
        return { q: `타원 $${ellEq(a, b)}$ 위의 한 점 $P$에서 두 초점까지의 거리를 각각 $PF$, $PF'$이라 할 때 $PF+PF'$의 값은?`, a: 2 * a, wrong: W(2 * a, a, 2 * b, a + b), why: `타원 위의 점은 두 초점까지 거리의 합이 장축의 길이 $2a=${2 * a}$로 일정` };
      } },
      { id: 'other', lv: [3, 5], card: 'c1', make: (R) => {
        const [a, b] = R.pick([[5, 3], [5, 4], [13, 12], [10, 6], [17, 15]]); const k = R.int(2, a + 1);
        const ans = 2 * a - k;
        return { q: `타원 $${ellEq(a, b)}$의 두 초점을 $F$, $F'$이라 할 때, 타원 위의 점 $P$에 대하여 $PF=${k}$이면 $PF'$의 값은?`, a: ans, wrong: W(ans, k, a, 2 * a + k), why: `$PF+PF'=2a=${2 * a}$ → $PF'=${2 * a}-${k}=${ans}$` };
      } },
      { id: 'eq', lv: [3, 5], card: 'c2', make: (R) => {
        const [b, a, c] = R.pick([[3, 5, 4], [4, 5, 3], [12, 13, 5], [6, 10, 8], [15, 17, 8], [5, 13, 12]]);
        return { q: `두 초점이 $(\\pm${c},0)$이고 장축의 길이가 $${2 * a}$인 타원의 방정식은?`, ...CS(ellEq(a, b), [ellEq(b, a), `\\dfrac{x^2}{${a * a}}+\\dfrac{y^2}{${c * c}}=1`, `\\dfrac{x^2}{${a}}+\\dfrac{y^2}{${b}}=1`, `\\dfrac{x^2}{${a * a}}-\\dfrac{y^2}{${b * b}}=1`]), why: `$2a=${2 * a}$ → $a=${a}$, $b^2=a^2-c^2=${a * a}-${c * c}=${b * b}$` };
      } },
    ],
  },
  {
    id: 'g.hyper',
    lesson: [
      { id: 'c1', t: '쌍곡선의 정의', b: T`평면 위의 두 정점 $F,F'$(초점)에서의 ==거리의 차가 일정==한 점들의 모임
        $$|PF-PF'|=2a$$` },
      { id: 'c2', t: '쌍곡선의 방정식', b: T`$\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$
        - 초점 $(\pm c,0)$, ==$c^2=a^2+b^2$== (타원과 달리 더하기!)
        - 꼭짓점 $(\pm a,0)$, 주축 길이 $2a$
        - ==점근선== $y=\pm\dfrac bax$

        $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=-1$이면 초점이 $y$축 위: $(0,\pm c)$` },
    ],
    gens: [
      { id: 'foc', lv: [1, 3], card: 'c2', make: (R) => {
        const [a, b, c] = R.pick(TRI.concat([[4, 3, 5], [12, 5, 13], [15, 8, 17], [8, 6, 10]]));
        return { q: `쌍곡선 $${hypEq(a, b)}$의 두 초점의 좌표는?`, ...CS(`(\\pm${c},0)`, [`(\\pm${Math.abs(a * a - b * b) > 0 ? Math.round(Math.sqrt(Math.abs(a * a - b * b))) : 1},0)`, `(0,\\pm${c})`, `(\\pm${a},0)`, `(\\pm${b},0)`]), why: `$c^2=a^2+b^2=${a * a}+${b * b}=${c * c}$ → $(\\pm${c},0)$` };
      } },
      { id: 'cnum', lv: [2, 4], card: 'c2', make: (R) => {
        const [a, b, c] = R.pick(TRI.concat([[4, 3, 5], [12, 5, 13]]));
        return { q: `쌍곡선 $${hypEq(a, b)}$의 두 초점 사이의 거리는?`, a: 2 * c, wrong: W(2 * c, c, 2 * a, 2 * b), why: `$c^2=${a * a}+${b * b}=${c * c}$ → $2c=${2 * c}$` };
      } },
      { id: 'asym', lv: [2, 4], card: 'c2', make: (R) => {
        const a = R.int(2, 6); let b; do { b = R.int(2, 6); } while (a === b);
        const f = fS(b, a); const g = fS(a, b);
        return { q: `쌍곡선 $${hypEq(a, b)}$의 점근선의 방정식은?`, ...CS(`y=\\pm${f === `${b}` ? b : f}x`.replace('\\pm1x', '\\pm x'), [`y=\\pm${g}x`, `y=\\pm${a * a}x`, `y=\\pm${fS(b * b, a * a)}x`, `y=\\pm${b}x`].map((s) => s.replace('\\pm1x', '\\pm x'))), why: `$a=${a}$, $b=${b}$ → 점근선 $y=\\pm\\dfrac ba x=\\pm${f}x$` };
      } },
      { id: 'diff', lv: [2, 4], card: 'c1', make: (R) => {
        const [a, b] = R.pick([[3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [2, 3]]);
        return { q: `쌍곡선 $${hypEq(a, b)}$ 위의 한 점 $P$와 두 초점 $F$, $F'$에 대하여 $|PF-PF'|$의 값은?`, a: 2 * a, wrong: W(2 * a, a, 2 * b, a + b), why: `쌍곡선 위의 점은 두 초점까지의 거리의 차가 $2a=${2 * a}$` };
      } },
      { id: 'eq', lv: [3, 5], card: 'c2', make: (R) => {
        const [a, b, c] = R.pick(TRI.concat([[4, 3, 5]]));
        return { q: `두 초점이 $(\\pm${c},0)$이고 두 꼭짓점이 $(\\pm${a},0)$인 쌍곡선의 방정식은?`, ...CS(hypEq(a, b), [`\\dfrac{x^2}{${a * a}}+\\dfrac{y^2}{${b * b}}=1`, hypEq(b, a), `\\dfrac{x^2}{${a * a}}-\\dfrac{y^2}{${c * c}}=1`, `\\dfrac{y^2}{${a * a}}-\\dfrac{x^2}{${b * b}}=1`]), why: `$a=${a}$, $c=${c}$ → $b^2=c^2-a^2=${c * c}-${a * a}=${b * b}$` };
      } },
      { id: 'vert', lv: [3, 5], card: 'c2', make: (R) => {
        const [a, b, c] = R.pick(TRI);
        return { q: `쌍곡선 $\\dfrac{x^2}{${a * a}}-\\dfrac{y^2}{${b * b}}=-1$의 두 초점의 좌표는?`, ...CS(`(0,\\pm${c})`, [`(\\pm${c},0)`, `(0,\\pm${a})`, `(0,\\pm${b})`]), why: `우변이 $-1$이면 초점이 $y$축 위. $c^2=${a * a}+${b * b}=${c * c}$ → $(0,\\pm${c})$` };
      } },
    ],
  },
  {
    id: 'g.tangent',
    lesson: [
      { id: 'c1', t: '접점이 주어진 접선', b: T`곡선 위의 점 $(x_1,y_1)$에서의 접선
        - 포물선 $y^2=4px$: ==$y_1y=2p(x+x_1)$==
        - 타원 $\dfrac{x^2}{a^2}+\dfrac{y^2}{b^2}=1$: ==$\dfrac{x_1x}{a^2}+\dfrac{y_1y}{b^2}=1$==
        - 쌍곡선 $\dfrac{x^2}{a^2}-\dfrac{y^2}{b^2}=1$: ==$\dfrac{x_1x}{a^2}-\dfrac{y_1y}{b^2}=1$==
        ($x^2\to x_1x$, $y^2\to y_1y$ 로 바꾸는 규칙!)` },
      { id: 'c2', t: '기울기가 주어진 접선', b: T`기울기 $m$인 접선
        - 포물선 $y^2=4px$: $y=mx+\dfrac pm$
        - 타원: $y=mx\pm\sqrt{a^2m^2+b^2}$
        - 쌍곡선: $y=mx\pm\sqrt{a^2m^2-b^2}$ ($a^2m^2>b^2$)

        예) $\dfrac{x^2}{25}+\dfrac{y^2}{9}=1$, $m=1$: $y=x\pm\sqrt{25+9}$` },
    ],
    gens: [
      { id: 'par', lv: [2, 4], card: 'c1', make: (R) => {
        const p = R.int(1, 3), t = R.int(1, 3); const x1 = p * t * t, y1 = 2 * p * t; const ans = p * t;
        return { q: `포물선 $y^2=${4 * p}x$ 위의 점 $(${x1},${y1})$에서의 접선의 $y$절편은?`, a: ans, wrong: W(ans, x1, y1, p), why: `접선: $${y1}y=${2 * p}(x+${x1})$ → $y=\\dfrac{${2 * p}}{${y1}}x+\\dfrac{${2 * p * x1}}{${y1}}$ → $y$절편 $${ans}$` };
      } },
      { id: 'ellpt', lv: [3, 5], card: 'c1', make: (R) => {
        let x1, y1; do { x1 = R.int(1, 4); y1 = R.int(1, 4); } while (x1 === y1); const A = 2 * x1 * x1, B = 2 * y1 * y1; const xi = R.chance(0.5);
        return { q: `타원 $\\dfrac{x^2}{${A}}+\\dfrac{y^2}{${B}}=1$ 위의 점 $(${x1},${y1})$에서의 접선의 ${xi ? '$x$절편' : '$y$절편'}은?`, a: xi ? 2 * x1 : 2 * y1, wrong: W(xi ? 2 * x1 : 2 * y1, x1, y1, xi ? 2 * y1 : 2 * x1), why: `접선: $\\dfrac{${x1}x}{${A}}+\\dfrac{${y1}y}{${B}}=1$ → $\\dfrac{x}{${2 * x1}}+\\dfrac{y}{${2 * y1}}=1$ → ${xi ? `$x$절편 $${2 * x1}$` : `$y$절편 $${2 * y1}$`}` };
      } },
      { id: 'ell1', lv: [3, 5], card: 'c2', make: (R) => {
        const [a, b, c] = R.pick(TRI);
        return { q: `타원 $${ellEq(a, b)}$에 접하고 기울기가 $1$인 두 접선 중, $y$절편이 양수인 것의 $y$절편은?`, a: c, wrong: W(c, a + b, a, b), why: `$y=x\\pm\\sqrt{a^2m^2+b^2}=x\\pm\\sqrt{${a * a}+${b * b}}=x\\pm${c}$ → $y$절편 $${c}$` };
      } },
      { id: 'hyp1', lv: [4, 5], card: 'c2', make: (R) => {
        const [b, a, c] = R.pick([[3, 5, 4], [4, 5, 3], [12, 13, 5], [6, 10, 8], [8, 17, 15]]);
        return { q: `쌍곡선 $${hypEq(a, b)}$에 접하고 기울기가 $1$인 두 접선 중, $y$절편이 양수인 것의 $y$절편은?`, a: c, wrong: W(c, a - b, a, a + b), why: `$y=x\\pm\\sqrt{a^2m^2-b^2}=x\\pm\\sqrt{${a * a}-${b * b}}=x\\pm${c}$ → $y$절편 $${c}$` };
      } },
      { id: 'parm', lv: [3, 5], card: 'c2', make: (R) => {
        const m = R.int(1, 3), k = R.int(1, 4), p = m * k;
        return { q: `포물선 $y^2=${4 * p}x$에 접하고 기울기가 $${m}$인 직선의 $y$절편은?`, a: k, wrong: W(k, p, m, 4 * p), why: `$y=mx+\\dfrac pm$, $p=${p}$, $m=${m}$ → $y$절편 $\\dfrac{${p}}{${m}}=${k}$` };
      } },
    ],
  },

  // ───────────── 평면벡터 ─────────────
  {
    id: 'g.vec',
    lesson: [
      { id: 'c1', t: '벡터의 뜻과 연산', b: T`==벡터==: 크기와 방향을 가진 양. $\overrightarrow{AB}$는 $A$에서 $B$로 가는 화살표.
        - 덧셈: $\overrightarrow{AB}+\overrightarrow{BC}=\overrightarrow{AC}$ (끝점과 시작점을 이어요)
        - 뺄셈: $\overrightarrow{AC}-\overrightarrow{AB}=\overrightarrow{BC}$ (같은 시작점)
        - $\overrightarrow{BA}=-\overrightarrow{AB}$, $\vec a+(-\vec a)=\vec0$
        - 실수배: $k\vec a$는 방향 같고(k>0) 크기 $|k||\vec a|$
        - 평행: $\vec a\parallel\vec b\iff\vec a=k\vec b$` },
      { id: 'c2', t: '위치벡터와 내분점', b: T`원점 $O$에 대하여 점 $A$의 위치벡터 $\vec a=\overrightarrow{OA}$
        - $\overrightarrow{AB}=\vec b-\vec a$
        - 선분 $AB$를 $m:n$의 비로 내분하는 점 $P$: $\vec p=\dfrac{m\vec b+n\vec a}{m+n}$ (==반대쪽 벡터에 곱해요==)
        - 중점: $\dfrac{\vec a+\vec b}2$, 삼각형의 무게중심: $\dfrac{\vec a+\vec b+\vec c}3$` },
    ],
    gens: [
      { id: 'sum', lv: [1, 3], card: 'c1', make: (R) => {
        const k = R.pick(['add', 'sub', 'rev', 'zero']);
        if (k === 'add') return { q: '삼각형 $ABC$에서 $\\overrightarrow{AB}+\\overrightarrow{BC}$와 같은 벡터는?', ...CS('\\overrightarrow{AC}', ['\\overrightarrow{CA}', '\\overrightarrow{BA}', '\\overrightarrow{AB}-\\overrightarrow{BC}', '\\vec0']), why: '시작점 $A$에서 $B$를 거쳐 $C$로: $\\overrightarrow{AB}+\\overrightarrow{BC}=\\overrightarrow{AC}$' };
        if (k === 'sub') return { q: '삼각형 $ABC$에서 $\\overrightarrow{AC}-\\overrightarrow{AB}$와 같은 벡터는?', ...CS('\\overrightarrow{BC}', ['\\overrightarrow{CB}', '\\overrightarrow{AB}+\\overrightarrow{AC}', '\\overrightarrow{BA}', '\\vec0']), why: '같은 시작점 $A$인 두 벡터의 차는 (끝) $-$ (끝): $\\overrightarrow{AC}-\\overrightarrow{AB}=\\overrightarrow{BC}$' };
        if (k === 'rev') return { q: '$\\overrightarrow{BA}$와 같은 벡터는?', ...CS('-\\overrightarrow{AB}', ['\\overrightarrow{AB}', '2\\overrightarrow{AB}', '\\vec0']), why: '시작점과 끝점을 바꾸면 방향이 반대 → $\\overrightarrow{BA}=-\\overrightarrow{AB}$' };
        return { q: '$\\overrightarrow{AB}+\\overrightarrow{BC}+\\overrightarrow{CA}$의 값은?', ...CS('\\vec0', ['\\overrightarrow{AC}', '\\overrightarrow{AB}', '2\\overrightarrow{AC}']), why: '$A\\to B\\to C\\to A$로 한 바퀴 돌아 제자리 → 영벡터' };
      } },
      { id: 'div', lv: [2, 4], card: 'c2', make: (R) => {
        const m = R.int(1, 4), n = R.int(1, 4); const kind = R.pick(['AP', 'PB']);
        const num = kind === 'AP' ? m : n;
        return { q: `선분 $AB$를 $${m}:${n}$의 비로 내분하는 점 $P$에 대하여 $\\overrightarrow{${kind === 'AP' ? 'AP' : 'PB'}}=k\\overrightarrow{AB}$일 때, 실수 $k$의 값은?`, ...FO(num, m + n, fS(m, n), fS(n, m)), why: `$AP:PB=${m}:${n}$이므로 $\\overrightarrow{${kind}}$는 $\\overrightarrow{AB}$의 $\\dfrac{${num}}{${m + n}}$배 → $k=${fS(num, m + n)}$` };
      } },
      { id: 'para', lv: [2, 5], card: 'c1', make: (R) => {
        const a1 = R.nz(-3, 4), a2 = R.nz(-4, 5); let kk; do { kk = R.nz(-3, 3); } while (kk === 1); const b1 = a1 * kk, x = a2 * kk;
        return { q: `$\\vec a=(${a1},${a2})$, $\\vec b=(${b1},x)$가 서로 평행할 때 $x$의 값은?`, a: x, wrong: W(x, a2, -x, b1), why: `$\\vec b=${kk}\\vec a$ ($${b1}=${kk}\\times${pr(a1)}$) → $x=${kk}\\times${pr(a2)}=${x}$` };
      } },
      { id: 'cent', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.int(-3, 3), b = R.int(-3, 3); const c = 3 * R.int(-3, 3) - a - b; const s = a + b + c;
        return { q: `삼각형 $ABC$의 세 꼭짓점의 위치벡터의 $x$성분이 각각 $${a}$, $${b}$, $${c}$일 때, 무게중심 $G$의 위치벡터의 $x$성분은?`, a: s / 3, wrong: W(s / 3, s, s / 2, a), why: `$\\vec g=\\dfrac{\\vec a+\\vec b+\\vec c}3$ → $\\dfrac{${a}+${pr(b)}+${pr(c)}}{3}=${s / 3}$` };
      } },
    ],
  },
  {
    id: 'g.comp',
    lesson: [
      { id: 'c1', t: '벡터의 성분과 크기', b: T`$\vec a=(a_1,a_2)$
        - 크기 $|\vec a|=\sqrt{a_1^2+a_2^2}$
        - $\vec a\pm\vec b=(a_1\pm b_1,\,a_2\pm b_2)$, $k\vec a=(ka_1,ka_2)$
        - $A(x_1,y_1),B(x_2,y_2)$이면 $\overrightarrow{AB}=(x_2-x_1,\,y_2-y_1)$` },
      { id: 'c2', t: '내적', b: T`$$\vec a\cdot\vec b=|\vec a||\vec b|\cos\theta=a_1b_1+a_2b_2$$
        - $\cos\theta=\dfrac{\vec a\cdot\vec b}{|\vec a||\vec b|}$ ($\theta$: 두 벡터가 이루는 각)
        - ==수직==: $\vec a\cdot\vec b=0$ ($\vec a\perp\vec b$)
        - $\vec a\cdot\vec a=|\vec a|^2$, $|\vec a+\vec b|^2=|\vec a|^2+2\vec a\cdot\vec b+|\vec b|^2$` },
    ],
    gens: [
      { id: 'mag', lv: [1, 3], card: 'c1', make: (R) => {
        const [x, y, r] = R.pick(TRI); const sx1 = R.pick([1, -1]), sy = R.pick([1, -1]); const sw = R.chance(0.5);
        const a = sw ? [y * sx1, x * sy] : [x * sx1, y * sy];
        return { q: `$\\vec a=(${a[0]},${a[1]})$일 때 $|\\vec a|$는?`, a: r, wrong: W(r, x + y, r * r, Math.abs(a[0] - a[1])), why: `$|\\vec a|=\\sqrt{${a[0] * a[0]}+${a[1] * a[1]}}=\\sqrt{${r * r}}=${r}$` };
      } },
      { id: 'ab', lv: [2, 4], card: 'c1', make: (R) => {
        const x1 = R.int(-4, 4), y1 = R.int(-4, 4); const [dx, dy, r] = R.pick(TRI); const sx1 = R.pick([1, -1]), sy = R.pick([1, -1]);
        const x2 = x1 + dx * sx1, y2 = y1 + dy * sy;
        return { q: `두 점 $A(${x1},${y1})$, $B(${x2},${y2})$에 대하여 $|\\overrightarrow{AB}|$는?`, a: r, wrong: W(r, dx + dy, r * r, dx), why: `$\\overrightarrow{AB}=(${dx * sx1},${dy * sy})$ → $|\\overrightarrow{AB}|=\\sqrt{${dx * dx}+${dy * dy}}=${r}$` };
      } },
      { id: 'dot', lv: [1, 3], card: 'c2', make: (R) => {
        const a = [R.nz(-4, 5), R.nz(-4, 5)], b = [R.nz(-4, 5), R.nz(-4, 5)]; const ans = a[0] * b[0] + a[1] * b[1];
        return { q: `$\\vec a=(${a[0]},${a[1]})$, $\\vec b=(${b[0]},${b[1]})$일 때 $\\vec a\\cdot\\vec b$의 값은?`, a: ans, wrong: W(ans, a[0] * b[1] + a[1] * b[0], a[0] + b[0] + a[1] + b[1], -ans), why: `$\\vec a\\cdot\\vec b=${a[0]}\\times${pr(b[0])}+${pr(a[1])}\\times${pr(b[1])}=${ans}$` };
      } },
      { id: 'perp', lv: [2, 5], card: 'c2', make: (R) => {
        const a = [R.nz(-4, 5), R.nz(-4, 5)]; const b0 = R.nz(-4, 5); const x = (-a[0] * b0) / a[1];
        if (!Number.isInteger(x)) return { q: '$\\vec a=(2,3)$, $\\vec b=(3,x)$가 서로 수직일 때 $x$의 값은?', a: -2, wrong: [2, 3, -3], why: '$\\vec a\\cdot\\vec b=6+3x=0$ → $x=-2$' };
        return { q: `$\\vec a=(${a[0]},${a[1]})$, $\\vec b=(${b0},x)$가 서로 수직일 때 $x$의 값은?`, a: x, wrong: W(x, -x, a[0], b0), why: `$\\vec a\\cdot\\vec b=${a[0]}\\times${pr(b0)}+${a[1] === 1 ? '' : pr(a[1])}x=0$ → $x=${x}$` };
      } },
      { id: 'cos', lv: [3, 5], card: 'c2', make: (R) => {
        const [x1, y1, r1] = R.pick(TRI.slice(0, 3)), [x2, y2, r2] = R.pick(TRI.slice(0, 3)); const s1 = R.pick([1, -1]), s2 = R.pick([1, -1]);
        const a = [x1, y1 * s1], b = [x2 * s2, y2]; const dot = a[0] * b[0] + a[1] * b[1];
        return { q: `$\\vec a=(${a[0]},${a[1]})$, $\\vec b=(${b[0]},${b[1]})$이 이루는 각을 $\\theta$라 할 때 $\\cos\\theta$의 값은?`, ...FO(dot, r1 * r2, fS(dot, r1 * r1 * r2 * r2), fS(r1 * r2, dot || 1)), why: `$\\vec a\\cdot\\vec b=${dot}$, $|\\vec a|=${r1}$, $|\\vec b|=${r2}$ → $\\cos\\theta=${EQ(dot, r1 * r2)}$` };
      } },
      { id: 'sumlen', lv: [3, 5], card: 'c1', make: (R) => {
        const [tx, ty, r] = R.pick(TRI); const a = [R.int(-4, 4), R.int(-4, 4)]; const b = [tx - a[0], ty - a[1]];
        return { q: `$\\vec a=(${a[0]},${a[1]})$, $\\vec b=(${b[0]},${b[1]})$일 때 $|\\vec a+\\vec b|$는?`, a: r, wrong: W(r, Math.abs(tx) + Math.abs(ty), r * r, Math.hypot(a[0], a[1]) | 0), why: `$\\vec a+\\vec b=(${tx},${ty})$ → $|\\vec a+\\vec b|=\\sqrt{${tx * tx}+${ty * ty}}=${r}$` };
      } },
    ],
  },
  {
    id: 'g.veceq',
    lesson: [
      { id: 'c1', t: '직선의 방정식(벡터)', b: T`- 점 $A(x_1,y_1)$를 지나고 ==방향벡터== $\vec u=(a,b)$인 직선: $\dfrac{x-x_1}{a}=\dfrac{y-y_1}{b}$
        - 점 $A$를 지나고 ==법선벡터== $\vec n=(a,b)$인 직선: $a(x-x_1)+b(y-y_1)=0$
        - 직선 $ax+by+c=0$의 법선벡터는 $(a,b)$` },
      { id: 'c2', t: '원의 방정식(벡터)', b: T`- 중심이 $C$(위치벡터 $\vec c$), 반지름 $r$인 원: $|\vec p-\vec c|=r$
        - 두 점 $A,B$를 지름의 양 끝으로 하는 원: $(\vec p-\vec a)\cdot(\vec p-\vec b)=0$
        ($\angle APB=90°$인 점 $P$의 자취)` },
    ],
    gens: [
      { id: 'circ', lv: [1, 3], card: 'c2', make: (R) => {
        const h = R.int(-4, 4), k = R.int(-4, 4), r = R.int(1, 6);
        return { q: `$\\vec c=(${h},${k})$일 때 $|\\vec p-\\vec c|=${r}$을 만족하는 점 $P(x,y)$가 그리는 도형의 방정식은?`, ...CS(`${sh('x', h)}^2+${sh('y', k)}^2=${r * r}`.replace('x^2', 'x^2').replace(/^\(x\)/, 'x').replace('+(y)', '+y'), [`${sh('x', -h)}^2+${sh('y', -k)}^2=${r * r}`, `${sh('x', h)}^2+${sh('y', k)}^2=${r}`, `${sh('x', k)}^2+${sh('y', h)}^2=${r * r}`]), why: `$|\\vec p-\\vec c|=r$은 중심 $(${h},${k})$, 반지름 $${r}$인 원 → $(x${h === 0 ? '' : sx(-h)})^2+(y${k === 0 ? '' : sx(-k)})^2=${r * r}$` };
      } },
      { id: 'diam', lv: [3, 5], card: 'c2', make: (R) => {
        const x1 = R.int(-4, 4), y1 = R.int(-4, 4), dx = 2 * R.int(1, 4), dy = 2 * R.int(1, 4); const x2 = x1 + dx, y2 = y1 + dy; const r2 = (dx * dx + dy * dy) / 4;
        return { q: `두 점 $A(${x1},${y1})$, $B(${x2},${y2})$에 대하여 $(\\vec p-\\vec a)\\cdot(\\vec p-\\vec b)=0$을 만족하는 점 $P$가 그리는 원의 반지름의 제곱($r^2$)은?`, a: r2, wrong: W(r2, 4 * r2, dx * dx + dy * dy, r2 / 2), why: `$AB$를 지름으로 하는 원. $AB^2=${dx * dx}+${dy * dy}=${dx * dx + dy * dy}$ → $r^2=\\dfrac{AB^2}{4}=${r2}$` };
      } },
      { id: 'dirv', lv: [2, 4], card: 'c1', make: (R) => {
        const d1 = R.int(1, 3), m = R.nz(-3, 3), x1 = R.int(-3, 3), y1 = R.int(-4, 4); const d2 = m * d1; const ans = y1 - m * x1;
        return { q: `점 $(${x1},${y1})$를 지나고 방향벡터가 $(${d1},${d2})$인 직선의 $y$절편은?`, a: ans, wrong: W(ans, y1, -ans, m), why: `기울기 $\\dfrac{${d2}}{${d1}}=${m}$ → $y-${pr(y1)}=${m}(x-${pr(x1)})$ → $x=0$일 때 $y=${ans}$` };
      } },
      { id: 'norm', lv: [2, 5], card: 'c1', make: (R) => {
        const a = R.nz(-4, 4), b = R.nz(-4, 4), x1 = R.int(-3, 3), y1 = R.int(-3, 3); const c = a * x1 + b * y1;
        return { q: `점 $(${x1},${y1})$를 지나고 법선벡터가 $(${a},${b})$인 직선이 $${a === 1 ? '' : a === -1 ? '-' : a}x${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}y=k$일 때 $k$의 값은?`, a: c, wrong: W(c, -c, a + b, x1 + y1), why: `$${a}(x-${pr(x1)})+${pr(b)}(y-${pr(y1)})=0$ → $${a === 1 ? '' : a === -1 ? '-' : a}x${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}y=${a}\\times${pr(x1)}+${pr(b)}\\times${pr(y1)}=${c}$` };
      } },
    ],
  },

  // ───────────── 공간도형과 공간좌표 ─────────────
  {
    id: 'g.space',
    lesson: [
      { id: 'c1', t: '직선과 평면의 위치 관계', b: T`- 두 직선: ==한 점에서 만남== / ==평행== / ==꼬인 위치== (만나지도 평행하지도 않음)
        - 직선과 평면: 한 점에서 만남 / 평행 / 포함
        - 두 평면: 한 직선에서 만남 / 평행
        정육면체의 한 모서리에 대해: 만나는 모서리 4개, 평행한 모서리 3개, ==꼬인 위치 4개==` },
      { id: 'c2', t: '삼수선의 정리', b: T`평면 $\alpha$ 밖의 점 $P$, 수선의 발 $H$, 평면 위 직선 $l$ 위의 점 $Q$에 대하여
        $PH\perp\alpha$, $HQ\perp l$이면 ==$PQ\perp l$==
        그래서 $PQ=\sqrt{PH^2+HQ^2}$ (직각삼각형 두 번!)` },
      { id: 'c3', t: '정사영', b: T`도형을 평면 $\alpha$에 수직으로 비춘 그림자 = ==정사영==
        넓이 $S$인 도형과 평면 $\alpha$가 이루는 각이 $\theta$이면
        $$S'=S\cos\theta$$
        (각이 클수록 그림자가 작아져요)` },
    ],
    gens: [
      { id: 'cube', lv: [1, 3], card: 'c1', make: (R) => {
        const k = R.pick([['꼬인 위치에 있는', 4], ['평행한', 3], ['한 점에서 만나는', 4]]);
        return { q: `정육면체의 한 모서리 $AB$에 대하여, 모서리 $AB$와 ${k[0]} 다른 모서리의 개수는?`, a: k[1], wrong: W(k[1], 1, 2, 6, 5).filter((v) => v !== k[1]), why: `정육면체의 모서리 12개 중 자기 자신을 뺀 11개: 평행 3개 + 만남 4개 + 꼬인 위치 4개` };
      } },
      { id: 'pos', lv: [1, 3], card: 'c1', make: (R) => {
        const k = R.pick([0, 1, 2]);
        if (k === 0) return { q: '공간에서 만나지도 않고 평행하지도 않은 두 직선의 위치 관계를 무엇이라 하는가?', correct: '꼬인 위치', wrong: ['평행', '일치', '한 점에서 만난다'], why: '평면에서는 만나지 않으면 평행이지만, 공간에서는 꼬인 위치가 있어요' };
        if (k === 1) return { q: '서로 다른 두 평면의 위치 관계로 가능한 것은?', correct: '평행하거나 한 직선에서 만난다', wrong: ['한 점에서 만난다', '꼬인 위치에 있다', '항상 만난다'], why: '두 평면은 평행하거나, 만나면 그 교선(직선)이 생겨요' };
        return { q: '직선 $l$과 평면 $\\alpha$의 위치 관계로 가능하지 않은 것은?', correct: '꼬인 위치에 있다', wrong: ['평행하다', '한 점에서 만난다', '직선이 평면에 포함된다'], why: '꼬인 위치는 두 직선 사이의 관계예요' };
      } },
      { id: 'tri', lv: [2, 5], card: 'c2', make: (R) => {
        const [a, b, c] = R.pick(TRI); const sw = R.chance(0.5); const [PH, HQ] = sw ? [b, a] : [a, b];
        return { q: `점 $P$에서 평면 $\\alpha$에 내린 수선의 발을 $H$, 평면 위의 직선 $l$에 $H$에서 내린 수선의 발을 $Q$라 하자. $PH=${PH}$, $HQ=${HQ}$일 때 $PQ$의 길이는?`, a: c, wrong: W(c, PH + HQ, c * c, Math.abs(PH - HQ)), why: `삼수선의 정리: $PQ\\perp l$. $\\triangle PHQ$는 $\\angle H=90°$ → $PQ=\\sqrt{${PH * PH}+${HQ * HQ}}=${c}$` };
      } },
      { id: 'proj', lv: [2, 5], card: 'c3', make: (R) => {
        const [n, c] = R.pick([[3, 5], [4, 5], [5, 13], [12, 13], [8, 17], [15, 17]]); const mul = R.int(1, 6); const S = c * mul; const ans = n * mul;
        return { q: `넓이가 $${S}$인 도형을 평면 $\\alpha$에 정사영시킨 도형의 넓이는? (도형이 있는 평면과 $\\alpha$가 이루는 각을 $\\theta$라 할 때 $\\cos\\theta=\\dfrac{${n}}{${c}}$)`, a: ans, wrong: W(ans, S, S * c / n | 0, S - n), why: `$S'=S\\cos\\theta=${S}\\times\\dfrac{${n}}{${c}}=${ans}$` };
      } },
      { id: 'proj60', lv: [1, 3], card: 'c3', make: (R) => {
        const S = 2 * R.int(2, 12);
        return { q: `넓이가 $${S}$인 도형이 평면 $\\alpha$와 $60°$의 각을 이룰 때, 이 도형의 $\\alpha$ 위로의 정사영의 넓이는?`, a: S / 2, wrong: W(S / 2, S, 2 * S, S - 2), why: `$S'=S\\cos60°=${S}\\times\\dfrac12=${S / 2}$` };
      } },
    ],
  },
  {
    id: 'g.coord',
    lesson: [
      { id: 'c1', t: '공간좌표와 거리', b: T`- 점 $(x,y,z)$: 원점에서 $x,y,z$축 방향으로 얼마나 떨어졌는지
        - 대칭: $xy$평면 → $(x,y,-z)$, $yz$평면 → $(-x,y,z)$, $zx$평면 → $(x,-y,z)$, 원점 → $(-x,-y,-z)$
        - 두 점 사이 거리 $AB=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2+(z_2-z_1)^2}$` },
      { id: 'c2', t: '내분점과 구의 방정식', b: T`- $A(x_1,y_1,z_1),B(x_2,y_2,z_2)$를 $m:n$의 비로 내분: $\left(\dfrac{mx_2+nx_1}{m+n},\dfrac{my_2+ny_1}{m+n},\dfrac{mz_2+nz_1}{m+n}\right)$
        - 구: 중심 $(a,b,c)$, 반지름 $r$ → ==$(x-a)^2+(y-b)^2+(z-c)^2=r^2$==
        - 일반형 $x^2+y^2+z^2+Ax+By+Cz+D=0$은 완전제곱식으로 고쳐서 중심·반지름을 읽어요.` },
    ],
    gens: [
      { id: 'dist', lv: [1, 4], card: 'c1', make: (R) => {
        const [p, q, r, d] = R.pick(SPACE); const v = R.shuffle([p, q, r]).map((t) => t * R.pick([1, -1])); const A = [R.int(-3, 3), R.int(-3, 3), R.int(-3, 3)]; const B = A.map((t, i) => t + v[i]);
        return { q: `두 점 $A(${A.join(',')})$, $B(${B.join(',')})$ 사이의 거리는?`, a: d, wrong: W(d, p + q + r, d * d, Math.abs(v[0]) + Math.abs(v[1])), why: `$AB=\\sqrt{${v[0] * v[0]}+${v[1] * v[1]}+${v[2] * v[2]}}=\\sqrt{${d * d}}=${d}$` };
      } },
      { id: 'sym', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.nz(-5, 5), b = R.nz(-5, 5), c = R.nz(-5, 5); const k = R.pick([['$xy$평면', [a, b, -c]], ['$yz$평면', [-a, b, c]], ['$zx$평면', [a, -b, c]], ['원점', [-a, -b, -c]]]);
        const ans = `(${k[1].join(',')})`;
        return { q: `점 $(${a},${b},${c})$를 ${k[0]}에 대하여 대칭이동한 점의 좌표는?`, ...CS(ans, [`(${[-a, b, c].join(',')})`, `(${[a, -b, c].join(',')})`, `(${[a, b, -c].join(',')})`, `(${[-a, -b, -c].join(',')})`, `(${[-a, -b, c].join(',')})`]), why: `${k[0]}에 대한 대칭: 그 평면에 수직인 좌표의 부호만 바뀜 → $${ans}$` };
      } },
      { id: 'div', lv: [2, 4], card: 'c2', make: (R) => {
        const m = R.int(1, 3), n = R.int(1, 3); const s = m + n; const A = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)]; const B = A.map((t) => t + s * R.int(-2, 2)); const idx = R.int(0, 2);
        const ans = (m * B[idx] + n * A[idx]) / s; const nm = ['x', 'y', 'z'][idx];
        return { q: `두 점 $A(${A.join(',')})$, $B(${B.join(',')})$에 대하여 선분 $AB$를 $${m}:${n}$의 비로 내분하는 점의 $${nm}$좌표는?`, a: ans, wrong: W(ans, (n * B[idx] + m * A[idx]) / s, (A[idx] + B[idx]) / 2, B[idx] - A[idx]), why: `$${nm}=\\dfrac{${m}\\times${pr(B[idx])}+${n}\\times${pr(A[idx])}}{${s}}=${ans}$` };
      } },
      { id: 'sphere', lv: [2, 4], card: 'c2', make: (R) => {
        const a = R.int(-3, 3), b = R.int(-3, 3), c = R.int(-3, 3), r = R.int(1, 6);
        return { q: `중심이 $(${a},${b},${c})$이고 반지름이 $${r}$인 구의 방정식은?`, ...CS(`${sh('x', a)}^2+${sh('y', b)}^2+${sh('z', c)}^2=${r * r}`.replace(/\(([xyz])\)/g, '$1'), [`${sh('x', -a)}^2+${sh('y', -b)}^2+${sh('z', -c)}^2=${r * r}`.replace(/\(([xyz])\)/g, '$1'), `${sh('x', a)}^2+${sh('y', b)}^2+${sh('z', c)}^2=${r}`.replace(/\(([xyz])\)/g, '$1'), `${sh('x', a)}^2+${sh('y', b)}^2+${sh('z', c)}^2=-${r * r}`.replace(/\(([xyz])\)/g, '$1')].filter((s, i) => !(i === 0 && a === 0 && b === 0 && c === 0))), why: `$(x-a)^2+(y-b)^2+(z-c)^2=r^2$에 $a=${a},b=${b},c=${c},r=${r}$ 대입` };
      } },
      { id: 'radius', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.int(-3, 3), b = R.int(-3, 3), c = R.int(-3, 3), r = R.int(1, 6); const D = a * a + b * b + c * c - r * r;
        return { q: `구 $x^2+y^2+z^2${sx(-2 * a) ? `${sx(-2 * a)}x` : ''}${sx(-2 * b) ? `${sx(-2 * b)}y` : ''}${sx(-2 * c) ? `${sx(-2 * c)}z` : ''}${sx(D)}=0$의 반지름은?`, a: r, wrong: W(r, r * r, a * a + b * b + c * c, Math.abs(D)), why: `완전제곱식: $(x-${pr(a)})^2+(y-${pr(b)})^2+(z-${pr(c)})^2=${a * a + b * b + c * c}-${pr(D)}=${r * r}$ → $r=${r}$` };
      } },
    ],
  },
];
