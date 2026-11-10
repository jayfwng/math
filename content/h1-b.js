// 고1 ② 도형의 방정식 · 집합과 명제 · 함수 · 순열과 조합
import { gcd, fr, linTex, polyTex, paren, pm } from '../js/lib.js';

const T = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const uniq = (arr, not) => [...new Set(arr.map(String))].filter((x) => x !== String(not));
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const perm = (n, r) => fact(n) / fact(n - r);
const comb = (n, r) => perm(n, r) / fact(r);
const pt = (x, y) => `(${x},\\ ${y})`;
const TR = [[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17]];
const L = (a, b, c) => { // ax+by+c=0 문자열
  const t = (k, v) => (k === 0 ? '' : `${k === 1 ? '' : k === -1 ? '-' : k}${v}`);
  let s = t(a, 'x'); const addT = (k, v) => { if (k === 0) return; const body = v ? `${Math.abs(k) === 1 ? '' : Math.abs(k)}${v}` : `${Math.abs(k)}`; s += s ? (k > 0 ? `+${body}` : `-${body}`) : (k > 0 ? body : `-${body}`); };
  s = ''; addT(a, 'x'); addT(b, 'y'); addT(c, '');
  return `${s}=0`;
};
const circ = (a, b, r) => `(x${pm(-a)})^2+(y${pm(-b)})^2=${r}`.replace('(x+0)', 'x').replace('(x-0)', 'x').replace('(y+0)', 'y').replace('(y-0)', 'y');
const setTex = (arr) => `\\{${arr.join(',\\ ')}\\}`;

export default [
  // ───────────── 도형의 방정식 ─────────────
  {
    id: 'h1.dist',
    lesson: [
      { id: 'c1', t: '두 점 사이의 거리', b: T`$A(x_1,y_1),\ B(x_2,y_2)$ 사이의 거리
        $$\overline{AB}=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$$
        (피타고라스 정리!) 원점과의 거리: $\sqrt{x^2+y^2}$` },
      { id: 'c2', t: '선분의 내분점·중점', b: T`선분 $AB$를 $m:n$으로 **내분**하는 점
        $$\left(\dfrac{mx_2+nx_1}{m+n},\ \dfrac{my_2+ny_1}{m+n}\right)$$
        $m:n=1:1$이면 **중점** $\left(\dfrac{x_1+x_2}2,\ \dfrac{y_1+y_2}2\right)$
        ⚠️ 내분점은 **끝점 $B$의 좌표에 $m$**을 곱해요 (엇갈림!)` },
    ],
    gens: [
      { id: 'dist', lv: [1, 4], card: 'c1', make: (R) => {
        const [a, b, c] = R.pick(TR); const x1 = R.int(-4, 4), y1 = R.int(-4, 4); const sx = R.pick([1, -1]), sy = R.pick([1, -1]); const sw = R.chance(0.5);
        const dx = (sw ? b : a) * sx, dy = (sw ? a : b) * sy;
        return { q: `두 점 $A${pt(x1, y1)}$, $B${pt(x1 + dx, y1 + dy)}$ 사이의 거리는?`, a: c, wrong: [Math.abs(dx) + Math.abs(dy), c + 1, c * c].filter((v) => v !== c), why: `$\\sqrt{${paren(dx)}^2+${paren(dy)}^2}=\\sqrt{${dx * dx + dy * dy}}=${c}$` };
      } },
      { id: 'mid', lv: [1, 3], card: 'c2', make: (R) => {
        const x1 = R.int(-6, 6), y1 = R.int(-6, 6), x2 = x1 + 2 * R.nz(-4, 4), y2 = y1 + 2 * R.nz(-4, 4);
        const cor = `$${pt((x1 + x2) / 2, (y1 + y2) / 2)}$`;
        return { q: `두 점 $A${pt(x1, y1)}$, $B${pt(x2, y2)}$를 이은 선분 $AB$의 중점은?`, correct: cor, wrong: uniq([`$${pt(x1 + x2, y1 + y2)}$`, `$${pt((x2 - x1) / 2, (y2 - y1) / 2)}$`, `$${pt((x1 + x2) / 2 + 1, (y1 + y2) / 2)}$`], cor), why: `중점 $=\\left(\\dfrac{${x1}+${paren(x2)}}{2},\\ \\dfrac{${y1}+${paren(y2)}}{2}\\right)=${pt((x1 + x2) / 2, (y1 + y2) / 2)}$` };
      } },
      { id: 'div', lv: [3, 5], card: 'c2', make: (R) => {
        let m, n; do { m = R.int(1, 3); n = R.int(1, 3); } while (m === n); const k = m + n;
        const x1 = R.int(-5, 5), y1 = R.int(-5, 5), x2 = x1 + k * R.nz(-3, 3), y2 = y1 + k * R.nz(-3, 3);
        const px = (m * x2 + n * x1) / k, py = (m * y2 + n * y1) / k;
        return { q: `두 점 $A${pt(x1, y1)}$, $B${pt(x2, y2)}$를 이은 선분 $AB$를 $${m}:${n}$[으로/로] 내분하는 점의 좌표는?`, correct: `$${pt(px, py)}$`, wrong: uniq([`$${pt(Math.round((n * x2 + m * x1) / k), Math.round((n * y2 + m * y1) / k))}$`, `$${pt(Math.round((x1 + x2) / 2), Math.round((y1 + y2) / 2))}$`, `$${pt(px + 1, py)}$`, `$${pt(px, py - 1)}$`], `$${pt(px, py)}$`).slice(0, 3), why: `$\\left(\\dfrac{${m}\\times${paren(x2)}+${n}\\times${paren(x1)}}{${k}},\\ \\dfrac{${m}\\times${paren(y2)}+${n}\\times${paren(y1)}}{${k}}\\right)=${pt(px, py)}$` };
      } },
    ],
  },
  {
    id: 'h1.ln',
    lesson: [
      { id: 'c1', t: '직선의 방정식', b: T`- 기울기 $m$, 점 $(x_1,y_1)$ 지남: $y-y_1=m(x-x_1)$
        - 두 점 $(x_1,y_1),\ (x_2,y_2)$ 지남: 기울기 $m=\dfrac{y_2-y_1}{x_2-x_1}$ 구한 뒤 위 식
        - $x$절편 $a$, $y$절편 $b$: $\dfrac xa+\dfrac yb=1$
        - 일반형: $ax+by+c=0$` },
    ],
    gens: [
      { id: 'slope', lv: [1, 3], card: 'c1', make: (R) => {
        const m = R.nz(-4, 4), x1 = R.int(-4, 4), y1 = R.int(-5, 5), d = R.nz(-3, 3);
        return { q: `두 점 $${pt(x1, y1)}$, $${pt(x1 + d, y1 + m * d)}$를 지나는 직선의 기울기는?`, a: m, wrong: [-m, 1 / m === Infinity ? 2 : Math.round(1 / m) || 3, m + 1].filter((v) => v !== m), why: `기울기 $=\\dfrac{${y1 + m * d}-${paren(y1)}}{${x1 + d}-${paren(x1)}}=${m}$` };
      } },
      { id: 'eq', lv: [2, 5], card: 'c1', make: (R) => {
        const m = R.nz(-3, 3), x1 = R.int(-3, 3), y1 = R.int(-4, 4);
        // y - y1 = m(x - x1) → mx - y + (y1 - m x1) = 0
        const cor = `$${L(m, -1, y1 - m * x1)}$`;
        return { q: `점 $${pt(x1, y1)}$을 지나고 기울기가 $${m}$인 직선의 방정식은?`, correct: cor, wrong: uniq([L(m, -1, y1 + m * x1), L(-m, -1, y1 - m * x1), L(m, 1, y1 - m * x1)], cor.replace(/\$/g, '')).slice(0, 3).map((s) => `$${s}$`), why: `$y${pm(-y1)}=${m}(x${pm(-x1)})$ 정리 → ${cor}` };
      } },
      { id: 'icpt', lv: [2, 5], card: 'c1', make: (R) => {
        const a = R.nz(-5, 5), b = R.nz(-5, 5);
        return { q: `$x$절편이 $${a}$, $y$절편이 $${b}$인 직선의 기울기는?`, correct: `$${fracS(-b, a)}$`, wrong: uniq([fracS(b, a), fracS(-a, b), fracS(a, b)], fracS(-b, a)).map((s) => `$${s}$`), why: `두 점 $(${a},\\ 0)$, $(0,\\ ${b})$ → 기울기 $\\dfrac{${b}-0}{0-${paren(a)}}=${fracS(-b, a)}$` };
      } },
    ],
  },
  {
    id: 'h1.lp',
    lesson: [
      { id: 'c1', t: '두 직선의 위치 관계', b: T`$y=mx+n$ 꼴일 때
        - **평행**: $m=m'$, $n\ne n'$ / **일치**: $m=m',\ n=n'$
        - **수직**: $mm'=-1$

        일반형 $ax+by+c=0$, $a'x+b'y+c'=0$:
        - 평행: $\dfrac a{a'}=\dfrac b{b'}\ne\dfrac c{c'}$
        - 수직: $aa'+bb'=0$` },
      { id: 'c2', t: '점과 직선 사이의 거리', b: T`점 $(x_1,y_1)$과 직선 $ax+by+c=0$ 사이의 거리
        $$d=\dfrac{|ax_1+by_1+c|}{\sqrt{a^2+b^2}}$$
        평행한 두 직선 사이의 거리: 한 직선 위의 점을 잡아 다른 직선까지의 거리를 구해요.` },
    ],
    gens: [
      { id: 'par', lv: [1, 4], card: 'c1', make: (R) => {
        const m = R.nz(-4, 4), x1 = R.int(-3, 3), y1 = R.int(-4, 4); const par = R.chance(0.5);
        const mm = par ? m : -1; // 수직이면 기울기 -1/m: 정수 되도록 m=±1
        if (par) return { q: `직선 $y=${linTex(m, 3)}$에 평행하고 점 $${pt(x1, y1)}$을 지나는 직선의 기울기는?`, a: m, wrong: [-m, 1 / m === 1 ? 2 : Math.round(1 / m) || 3, m + 1].filter((v) => v !== m), why: '평행한 두 직선의 기울기는 같아요.' };
        const k = R.pick([1, -1, 2, -2]);
        return { q: `직선 $y=${linTex(k, 3)}$에 수직인 직선의 기울기를 구하면? (정수가 아니면 분수)`.replace(/ \(.*\)/, ''), correct: `$${fracS(-1, k)}$`, wrong: uniq([fracS(1, k), `${k}`, `${-k}`], fracS(-1, k)).map((s) => `$${s}$`), why: `수직이면 기울기의 곱이 $-1$ → $${k}\\times m=-1$ → $m=${fracS(-1, k)}$` };
      } },
      { id: 'dist', lv: [2, 5], card: 'c2', make: (R) => {
        const [p, q, r] = R.pick(TR.slice(0, 2)); const sx = R.pick([1, -1]); const a = p * sx, b = q;
        const x1 = R.int(-3, 3), y1 = R.int(-3, 3); const k = R.int(1, 4) * r; // 분자 = k
        const c = k - a * x1 - b * y1;
        return { q: `점 $${pt(x1, y1)}$과 직선 $${L(a, b, c)}$ 사이의 거리는?`, a: k / r, wrong: [k, k / r + 1, Math.abs(k - r) / r || 2].filter((v) => v !== k / r), why: `$\\dfrac{|${a}\\times${paren(x1)}+${b}\\times${paren(y1)}${pm(c)}|}{\\sqrt{${a * a}+${b * b}}}=\\dfrac{${k}}{${r}}=${k / r}$` };
      } },
      { id: 'cond', lv: [3, 5], card: 'c1', make: (R) => {
        const a = R.int(1, 4);
        return { q: `두 직선 $${a}x+2y+1=0$, $x+ky-3=0$이 서로 수직일 때 상수 $k$의 값은?`, correct: `$${fracS(-a, 2)}$`, wrong: uniq([fracS(a, 2), fracS(2, a), fracS(-2, a)], fracS(-a, 2)).map((s) => `$${s}$`), why: `$aa'+bb'=0$ → $${a}\\times1+2k=0$ → $k=${fracS(-a, 2)}$` };
      } },
    ],
  },
  {
    id: 'h1.cr',
    lesson: [
      { id: 'c1', t: '원의 방정식', b: T`중심 $(a,b)$, 반지름 $r$인 원
        $$(x-a)^2+(y-b)^2=r^2$$
        중심이 원점이면 $x^2+y^2=r^2$` },
      { id: 'c2', t: '일반형', b: T`$x^2+y^2+Ax+By+C=0$ → 완전제곱식으로 고쳐요.
        $x^2+y^2-4x+6y-3=0$
        $(x-2)^2+(y+3)^2=3+4+9=16$ → 중심 $(2,-3)$, 반지름 $4$

        중심 $\left(-\dfrac A2,\ -\dfrac B2\right)$, 반지름 $\sqrt{\dfrac{A^2+B^2}4-C}$` },
    ],
    gens: [
      { id: 'std', lv: [1, 3], card: 'c1', make: (R) => {
        let a, b; do { a = R.nz(-5, 5); b = R.nz(-5, 5); } while (a === b); const r = R.int(2, 6);
        const ask = R.pick(['c', 'r']);
        if (ask === 'c') return { q: `원 $${circ(a, b, r * r)}$의 중심의 좌표는?`, correct: `$${pt(a, b)}$`, wrong: uniq([`$${pt(-a, -b)}$`, `$${pt(b, a)}$`, `$${pt(-a, b)}$`], `$${pt(a, b)}$`).map((s) => s.replace(/^\$|\$$/g, '')).filter((s) => s !== pt(a, b)).map((s) => `$${s}$`).slice(0, 3), why: `$(x-a)^2+(y-b)^2=r^2$ 의 중심은 $(a,\\ b)$. 부호가 반대로 보이는 것에 주의!` };
        return { q: `원 $${circ(a, b, r * r)}$의 반지름은?`, a: r, wrong: [r * r, r + 1, 2 * r].filter((v) => v !== r), why: `$r^2=${r * r}$ → $r=${r}$` };
      } },
      { id: 'make', lv: [2, 5], card: 'c1', make: (R) => {
        let a, b; do { a = R.nz(-4, 4); b = R.nz(-4, 4); } while (a === b); const r = R.int(1, 5);
        const cor = `$${circ(a, b, r * r)}$`;
        return { q: `중심이 $${pt(a, b)}$이고 반지름이 $${r}$인 원의 방정식은?`, correct: cor, wrong: uniq([circ(-a, -b, r * r), circ(a, b, r), circ(-a, b, r * r)], cor.replace(/\$/g, '')).slice(0, 3).map((s) => `$${s}$`), why: `$(x-${paren(a)})^2+(y-${paren(b)})^2=${r}^2$ → ${cor}` };
      } },
      { id: 'gen', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.int(-4, 4), b = R.int(-4, 4), r = R.int(2, 5);
        const A = -2 * a, B = -2 * b, C = a * a + b * b - r * r;
        const gen = `x^2+y^2${A === 0 ? '' : pm(A) + 'x'}${B === 0 ? '' : pm(B) + 'y'}${C === 0 ? '' : pm(C)}=0`;
        return { q: `$${gen}$이 나타내는 원의 반지름은?`, a: r, wrong: [r * r, r + 1, Math.abs(C)].filter((v) => v !== r), why: `완전제곱식: $${circ(a, b, r * r)}$ → 반지름 $${r}$` };
      } },
    ],
  },
  {
    id: 'h1.cl',
    lesson: [
      { id: 'c1', t: '원과 직선의 위치 관계', b: T`원의 중심에서 직선까지의 거리 $d$, 반지름 $r$

        - $d<r$: 서로 다른 **두 점**에서 만남
        - $d=r$: **접함** (한 점)
        - $d>r$: 만나지 않음

        (또는 연립해서 판별식 $D$ 사용)` },
      { id: 'c2', t: '현의 길이와 접선', b: T`현의 길이: $2\sqrt{r^2-d^2}$
        원 $x^2+y^2=r^2$ 위의 점 $(x_1,y_1)$에서의 접선: $x_1x+y_1y=r^2$` },
    ],
    gens: [
      { id: 'pos', lv: [1, 4], card: 'c1', make: (R) => {
        const r = R.int(2, 6); const d = R.pick([r - 1, r, r + 1, r + 2].filter((v) => v > 0)); // 3x+4y = 5d 형태: 원점-직선 거리 d
        const ans = d < r ? '서로 다른 두 점에서 만난다' : d === r ? '접한다' : '만나지 않는다';
        return { q: `원 $x^2+y^2=${r * r}$과 직선 $3x+4y=${5 * d}$의 위치 관계는?`, correct: ans, wrong: ['서로 다른 두 점에서 만난다', '접한다', '만나지 않는다'].filter((x) => x !== ans), why: `중심(원점)에서 직선까지의 거리 $d=\\dfrac{${5 * d}}{5}=${d}$, 반지름 $r=${r}$ → $d${d < r ? '<' : d === r ? '=' : '>'}r$` };
      } },
      { id: 'tan', lv: [3, 5], card: 'c1', make: (R) => {
        const r = R.int(1, 5);
        return { q: `원 $x^2+y^2=${r * r}$과 직선 $3x+4y=k$가 접할 때 양수 $k$의 값은?`, a: 5 * r, wrong: [r, 5, r * r].filter((v) => v !== 5 * r), why: `$\\dfrac{|k|}{5}=${r}$ → $k=\\pm${5 * r}$, 양수는 $${5 * r}$` };
      } },
      { id: 'chord', lv: [3, 5], card: 'c2', make: (R) => {
        const [h, d, r] = R.pick([[3, 4, 5], [5, 12, 13], [4, 3, 5], [8, 6, 10]]);
        return { q: `반지름이 $${r}$인 원의 중심에서 직선까지의 거리가 $${d}$일 때, 이 직선이 원에서 잘라내는 현의 길이는?`, a: 2 * h, wrong: [h, 2 * d, r + h].filter((v) => v !== 2 * h), why: `$2\\sqrt{${r}^2-${d}^2}=2\\sqrt{${r * r - d * d}}=${2 * h}$` };
      } },
      { id: 'tline', lv: [2, 5], card: 'c2', make: (R) => {
        const [x1, y1, r] = R.pick([[3, 4, 5], [4, 3, 5], [5, 12, 13], [6, 8, 10]]);
        return { q: `원 $x^2+y^2=${r * r}$ 위의 점 $${pt(x1, y1)}$에서의 접선의 방정식은?`, correct: `$${x1}x+${y1}y=${r * r}$`, wrong: [`$${y1}x+${x1}y=${r * r}$`, `$${x1}x-${y1}y=${r * r}$`, `$${x1}x+${y1}y=${r}$`], why: `접선: $x_1x+y_1y=r^2$ → $${x1}x+${y1}y=${r * r}$` };
      } },
    ],
  },
  {
    id: 'h1.mv',
    lesson: [
      { id: 'c1', t: '평행이동', b: T`점 $(x,y)$를 $x$축 방향으로 $a$, $y$축 방향으로 $b$만큼 평행이동 → $(x+a,\ y+b)$

        도형의 방정식 $f(x,y)=0$은 $x$ 대신 $x-a$, $y$ 대신 $y-b$를 넣어요: $f(x-a,\ y-b)=0$` },
      { id: 'c2', t: '대칭이동', b: T`점 $(x,y)$의 대칭
        - $x$축 대칭: $(x,\ -y)$
        - $y$축 대칭: $(-x,\ y)$
        - 원점 대칭: $(-x,\ -y)$
        - 직선 $y=x$ 대칭: $(y,\ x)$

        도형의 방정식도 같은 규칙으로 문자를 바꿔요 (예: $x$축 대칭이면 $y$ 대신 $-y$).` },
    ],
    gens: [
      { id: 'pt', lv: [1, 3], card: 'c1', make: (R) => {
        const x = R.int(-5, 5), y = R.int(-5, 5), a = R.nz(-4, 4), b = R.nz(-4, 4);
        return { q: `점 $${pt(x, y)}$을 $x$축 방향으로 $${a}$, $y$축 방향으로 $${b}$만큼 평행이동한 점의 좌표는?`, correct: `$${pt(x + a, y + b)}$`, wrong: uniq([pt(x - a, y - b), pt(x + b, y + a), pt(x + a, y - b)], pt(x + a, y + b)).map((s) => `$${s}$`), why: `$(${x}+${paren(a)},\\ ${y}+${paren(b)})=${pt(x + a, y + b)}$` };
      } },
      { id: 'sym', lv: [1, 4], card: 'c2', make: (R) => {
        const x = R.nz(-6, 6), y = R.nz(-6, 6); const k = R.pick(['x축', 'y축', '원점', '직선 $y=x$']);
        const res = { 'x축': pt(x, -y), 'y축': pt(-x, y), '원점': pt(-x, -y), '직선 $y=x$': pt(y, x) }[k];
        return { q: `점 $${pt(x, y)}$[을/를] ${k}에 대하여 대칭이동한 점의 좌표는?`.replace('x축에', '$x$축에').replace('y축에', '$y$축에').replace(/^(.*)\[을\/를\] x축/, '$1[을/를] $x$축'), correct: `$${res}$`, wrong: uniq([pt(x, -y), pt(-x, y), pt(-x, -y), pt(y, x)], res).map((s) => `$${s}$`).slice(0, 3), why: `${k}에 대한 대칭: ${k === 'x축' ? '$y$의 부호만 바꿔요' : k === 'y축' ? '$x$의 부호만 바꿔요' : k === '원점' ? '$x,y$ 둘 다 부호를 바꿔요' : '$x$와 $y$를 서로 바꿔요'} → $${res}$` };
      } },
      { id: 'line', lv: [3, 5], card: 'c1', make: (R) => {
        const a = R.nz(-4, 4), b = R.nz(-4, 4);
        const cor = `$y=${linTex(1, 0)}${pm(b)}$`;
        return { q: `직선 $y=x$를 $x$축 방향으로 $${a}$, $y$축 방향으로 $${b}$만큼 평행이동한 직선의 방정식은?`, correct: `$y=x${pm(b - a)}$`.replace('x+0', 'x'), wrong: uniq([`y=x${pm(a - b)}`, `y=x${pm(a + b)}`, `y=x${pm(b + a + 1)}`], `y=x${pm(b - a)}`).map((s) => `$${s}$`), why: `$x$ 대신 $x-${paren(a)}$, $y$ 대신 $y-${paren(b)}$ → $y${pm(-b)}=x${pm(-a)}$ → $y=x${pm(b - a)}$` };
      } },
    ],
  },

  // ───────────── 집합과 명제 ─────────────
  {
    id: 'h1.set',
    lesson: [
      { id: 'c1', t: '집합과 원소', b: T`==집합==: 조건에 의해 대상이 명확한 모임. 속하는 대상은 ==원소==.
        - $a\in A$: $a$는 $A$의 원소 / $a\notin A$
        - 원소나열법 $\{1,2,3\}$, 조건제시법 $\{x\mid x\text{는 }6\text{의 약수}\}$
        - 공집합 $\varnothing$ (원소 0개), 유한집합·무한집합` },
      { id: 'c2', t: '부분집합', b: T`$A$의 모든 원소가 $B$에도 속하면 $A\subset B$ (부분집합)

        - 원소가 $n$개인 집합의 부분집합 수: $2^n$
        - 진부분집합 수: $2^n-1$ (자기 자신 제외)
        - $A\subset B$이고 $B\subset A$ ⟹ $A=B$
        - 특정 원소 $k$개를 반드시 포함: $2^{n-k}$` },
    ],
    gens: [
      { id: 'cnt', lv: [1, 3], card: 'c2', make: (R) => {
        const n = R.int(2, 6); const kind = R.pick(['all', 'proper', 'must']);
        if (kind === 'all') return { q: `원소가 $${n}$개인 집합의 부분집합의 개수는?`, a: 2 ** n, wrong: [2 * n, n * n, 2 ** n - 1], why: `$2^{${n}}=${2 ** n}$` };
        if (kind === 'proper') return { q: `원소가 $${n}$개인 집합의 진부분집합의 개수는?`, a: 2 ** n - 1, wrong: [2 ** n, 2 ** n - 2, 2 * n], why: `$2^{${n}}-1=${2 ** n - 1}$` };
        const k = R.int(1, n - 1);
        return { q: `집합 $A$의 원소가 $${n}$개일 때, 특정한 원소 $${k}$개를 반드시 포함하는 $A$의 부분집합의 개수는?`, a: 2 ** (n - k), wrong: [2 ** n, 2 ** k, 2 ** (n - k) - 1], why: `나머지 $${n - k}$개의 원소는 넣고 빼기가 자유 → $2^{${n - k}}=${2 ** (n - k)}$` };
      } },
      { id: 'elem', lv: [1, 3], card: 'c1', make: (R) => {
        const n = R.pick([12, 18, 20, 24, 30]); const divs = []; for (let d = 1; d <= n; d++) if (n % d === 0) divs.push(d);
        return { q: `집합 $A=\\{x\\mid x\\text{는 }${n}\\text{의 약수}\\}$의 원소의 개수는?`, a: divs.length, unit: '개', wrong: [divs.length + 1, divs.length - 1, n / 2], why: `$${n}$의 약수: $${divs.join(',\\ ')}$ → $${divs.length}$개` };
      } },
      { id: 'sub', lv: [2, 5], card: 'c2', make: (R) => {
        const k = R.int(2, 6);
        return { q: `$A=\\{1,\\ 2,\\ 3\\}$, $B=\\{1,\\ 2,\\ 3,\\ 4,\\ ${k + 4}\\}$일 때 $A\\subset X\\subset B$를 만족하는 집합 $X$의 개수는?`, a: 4, unit: '개', wrong: [2, 3, 8], why: `$X$는 $1,2,3$을 반드시 포함하고, $4,\\ ${k + 4}$는 넣고 빼기 자유 → $2^2=4$` };
      } },
    ],
  },
  {
    id: 'h1.setop',
    lesson: [
      { id: 'c1', t: '집합의 연산', b: T`- ==합집합== $A\cup B$: $A$ 또는 $B$에 속하는 원소
        - ==교집합== $A\cap B$: $A$와 $B$ 둘 다에 속하는 원소
        - ==차집합== $A-B$: $A$에는 속하고 $B$에는 속하지 않는 원소
        - ==여집합== $A^c$: 전체집합 $U$에서 $A$를 뺀 것 $=U-A$` },
      { id: 'c2', t: '원소의 개수와 드모르간', b: T`$n(A\cup B)=n(A)+n(B)-n(A\cap B)$
        $n(A^c)=n(U)-n(A)$

        드모르간의 법칙: $(A\cup B)^c=A^c\cap B^c$, $(A\cap B)^c=A^c\cup B^c$` },
    ],
    gens: [
      { id: 'op', lv: [1, 3], card: 'c1', make: (R) => {
        const U = [1, 2, 3, 4, 5, 6, 7, 8]; let A, B; do { A = R.sample(U, 4).sort((a, b) => a - b); B = R.sample(U, 4).sort((a, b) => a - b); } while (!A.some((x) => B.includes(x)) || !A.some((x) => !B.includes(x)) || A.join() === B.join());
        const k = R.pick(['cup', 'cap', 'diff', 'cA']);
        const f = { cup: [...new Set([...A, ...B])], cap: A.filter((x) => B.includes(x)), diff: A.filter((x) => !B.includes(x)), cA: U.filter((x) => !A.includes(x)) }[k].sort((a, b) => a - b);
        const name = { cup: 'A\\cup B', cap: 'A\\cap B', diff: 'A-B', cA: 'A^c' }[k];
        const cor = f.length ? setTex(f) : '\\varnothing';
        const alt = uniq([setTex(A), setTex(B), setTex([...new Set([...A, ...B])].sort((a, b) => a - b)), setTex(A.filter((x) => B.includes(x))) || '', setTex(B.filter((x) => !A.includes(x)))].map((s) => s), cor).filter((s) => s !== '\\{\\}');
        return { q: `전체집합 $U=\\{1,2,3,4,5,6,7,8\\}$, $A=${setTex(A)}$, $B=${setTex(B)}$일 때 $${name}$은?`, correct: `$${cor}$`, wrong: alt.slice(0, 3).map((s) => `$${s}$`), why: `$${name}=${cor}$` };
      } },
      { id: 'cnt', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.int(10, 30), b = R.int(10, 30), c = R.int(2, Math.min(a, b) - 1);
        const ask = R.pick(['cup', 'cap']);
        if (ask === 'cup') return { q: `$n(A)=${a}$, $n(B)=${b}$, $n(A\\cap B)=${c}$일 때 $n(A\\cup B)$는?`, a: a + b - c, wrong: [a + b, a + b + c, a - c], why: `$n(A\\cup B)=${a}+${b}-${c}=${a + b - c}$` };
        return { q: `$n(A)=${a}$, $n(B)=${b}$, $n(A\\cup B)=${a + b - c}$일 때 $n(A\\cap B)$는?`, a: c, wrong: [a + b, a + b - c, a - c], why: `$n(A\\cap B)=n(A)+n(B)-n(A\\cup B)=${a}+${b}-${a + b - c}=${c}$` };
      } },
      { id: 'demorgan', lv: [3, 5], card: 'c2', make: (R) => {
        const items = [['$(A\\cup B)^c$', '$A^c\\cap B^c$', ['$A^c\\cup B^c$', '$A\\cap B$', '$A\\cup B$']], ['$(A\\cap B)^c$', '$A^c\\cup B^c$', ['$A^c\\cap B^c$', '$A\\cup B$', '$A\\cap B$']]];
        const it = R.pick(items);
        return { q: `드모르간의 법칙에 의해 ${it[0]}[와/과] 같은 것은?`.replace('[와/과]', '[과/와]'), correct: it[1], wrong: it[2], why: '합집합의 여집합은 각 여집합의 교집합, 교집합의 여집합은 각 여집합의 합집합이에요.' };
      } },
    ],
  },
  {
    id: 'h1.prop',
    lesson: [
      { id: 'c1', t: '명제와 조건', b: T`==명제==: 참·거짓을 판별할 수 있는 문장. ==조건==: 변수에 따라 참·거짓이 달라지는 식 (예: $x>3$)

        - 조건 $p$의 ==진리집합== $P$: $p$를 참이 되게 하는 원소의 집합
        - 부정 $\sim p$: 진리집합은 $P^c$` },
      { id: 'c2', t: '"모든", "어떤"의 부정', b: T`- "모든 $x$에 대하여 $p$" 의 부정 → "**어떤** $x$에 대하여 $\sim p$"
        - "어떤 $x$에 대하여 $p$" 의 부정 → "**모든** $x$에 대하여 $\sim p$"

        ≥의 부정은 <, ≤의 부정은 >, =의 부정은 ≠` },
      { id: 'c3', t: '명제 p → q의 참·거짓', b: T`$P\subset Q$이면 $p\Rightarrow q$는 **참**.
        반례가 하나라도 있으면 거짓.

        "$x>2$이면 $x>5$이다" → 반례 $x=3$ → 거짓` },
    ],
    gens: [
      { id: 'neg', lv: [1, 3], card: 'c2', make: (R) => {
        const k = R.int(1, 9);
        const items = [
          [`모든 실수 $x$에 대하여 $x^2\\ge0$이다.`, '어떤 실수 $x$에 대하여 $x^2<0$이다.', ['모든 실수 $x$에 대하여 $x^2<0$이다.', '어떤 실수 $x$에 대하여 $x^2\\le0$이다.', '모든 실수 $x$에 대하여 $x^2>0$이다.']],
          [`어떤 자연수 $x$에 대하여 $x>${k}$이다.`, `모든 자연수 $x$에 대하여 $x\\le${k}$이다.`, [`어떤 자연수 $x$에 대하여 $x\\le${k}$이다.`, `모든 자연수 $x$에 대하여 $x<${k}$이다.`, `모든 자연수 $x$에 대하여 $x>${k}$이다.`]],
          [`모든 자연수 $x$에 대하여 $x\\ge${k}$이다.`, `어떤 자연수 $x$에 대하여 $x<${k}$이다.`, [`모든 자연수 $x$에 대하여 $x<${k}$이다.`, `어떤 자연수 $x$에 대하여 $x\\le${k}$이다.`, `어떤 자연수 $x$에 대하여 $x>${k}$이다.`]],
        ];
        const it = R.pick(items); return { q: `다음 명제의 부정은? "${it[0]}"`, correct: it[1], wrong: it[2], why: '"모든"↔"어떤"을 바꾸고 결론을 부정해요. (≥의 부정은 <, >의 부정은 ≤)' };
      } },
      { id: 'truth', lv: [2, 5], card: 'c3', make: (R) => {
        const a = R.int(1, 4), b = a + R.int(1, 4); const tr = R.chance(0.5);
        const [p, q] = tr ? [b, a] : [a, b]; // x>p ⇒ x>q : 참 iff p≥q
        return { q: `"$x>${p}$이면 $x>${q}$이다."의 참·거짓은?`, correct: p >= q ? '참' : '거짓', wrong: [p >= q ? '거짓' : '참'], why: p >= q ? `$\\{x\\mid x>${p}\\}\\subset\\{x\\mid x>${q}\\}$이므로 참` : `반례: $x=${(p + q) / 2 > p ? Math.ceil((p + q) / 2) : p + 1}$은 $x>${p}$이지만 $x>${q}$가 아니...`.slice(0, 0) + `반례: $x=${p + 1}$은 $x>${p}$를 만족하지만 $x>${q}$를 만족하지 않아요. 진리집합이 포함되지 않으므로 거짓` };
      } },
      { id: 'pset', lv: [2, 5], card: 'c1', make: (R) => {
        const k = R.int(2, 7);
        return { q: `전체집합이 자연수 전체일 때 조건 $p$: $x\\le${k}$의 부정 $\\sim p$의 진리집합의 최소 원소는?`, a: k + 1, wrong: [k, k - 1, 1], why: `$\\sim p$: $x>${k}$ → 진리집합 $\\{${k + 1},\\ ${k + 2},\\dots\\}$` };
      } },
    ],
  },
  {
    id: 'h1.cond',
    lesson: [
      { id: 'c1', t: '충분조건과 필요조건', b: T`$p\Rightarrow q$가 참일 때
        - $p$는 $q$이기 위한 **충분**조건
        - $q$는 $p$이기 위한 **필요**조건
        - $P\subset Q$ ⟺ $p\Rightarrow q$

        $p\Rightarrow q$이고 $q\Rightarrow p$이면 **필요충분조건** ($P=Q$)

        기억법: **화살표를 쏘는 쪽이 충분**, 맞는 쪽이 필요` },
      { id: 'c2', t: '역·이·대우', b: T`명제 $p\Rightarrow q$에 대해
        - 역: $q\Rightarrow p$
        - 이: $\sim p\Rightarrow\sim q$
        - **대우**: $\sim q\Rightarrow\sim p$

        ==명제와 그 대우는 참·거짓이 항상 같아요== (역·이는 다를 수 있어요).
        대우로 증명하면 쉬운 경우가 많아요.` },
    ],
    gens: [
      { id: 'suff', lv: [1, 4], card: 'c1', make: (R) => {
        const items = [
          ['$x=2$', '$x^2=4$', '충분조건', '$x=2$이면 $x^2=4$ (참), 역은 $x=-2$가 반례'],
          ['$x>3$', '$x>1$', '충분조건', '$x>3$이면 $x>1$ (참), 역은 $x=2$가 반례'],
          ['$x^2=9$', '$x=3$', '필요조건', '$q\\Rightarrow p$는 참, $p\\Rightarrow q$는 $x=-3$이 반례 → $p$는 $q$의 필요조건'],
          ['$xy>0$', '$x>0,\\ y>0$', '필요조건', '$q\\Rightarrow p$는 참, $p\\Rightarrow q$는 $x,y$가 둘 다 음수일 때 반례 → $p$는 $q$의 필요조건'],
          ['$a=b$', '$a^2=b^2$', '충분조건', '$a=b$이면 $a^2=b^2$ (참), 역은 $a=-b$가 반례'],
        ];
        const it = R.pick(items); const all = ['충분조건', '필요조건', '필요충분조건', '아무 조건도 아니다'];
        return { q: `$p$: ${it[0]}, $q$: ${it[1]}일 때 $p$는 $q$이기 위한 무슨 조건인가? (충분/필요 중 필요충분이 아닌 경우)`.replace(/ \(.*\)/, ''), correct: it[2], wrong: all.filter((x) => x !== it[2]), why: it[3] };
      } },
      { id: 'contra', lv: [2, 5], card: 'c2', make: (R) => {
        const items = [
          ['$x>2$이면 $x>0$이다.', '$x\\le0$이면 $x\\le2$이다.', ['$x>0$이면 $x>2$이다.', '$x\\le2$이면 $x\\le0$이다.', '$x\\le0$이면 $x>2$이다.']],
          ['$xy=0$이면 $x=0$ 또는 $y=0$이다.', '$x\\ne0$이고 $y\\ne0$이면 $xy\\ne0$이다.', ['$x=0$ 또는 $y=0$이면 $xy=0$이다.', '$xy\\ne0$이면 $x\\ne0$ 또는 $y\\ne0$이다.', '$x\\ne0$ 또는 $y\\ne0$이면 $xy\\ne0$이다.']],
        ];
        const it = R.pick(items); return { q: `명제 "${it[0]}"의 대우는?`, correct: it[1], wrong: it[2], why: '대우는 가정과 결론을 서로 바꾸고 둘 다 부정한 명제예요. 결론의 부정이 새 가정이 돼요.' };
      } },
      { id: 'range', lv: [3, 5], card: 'c1', make: (R) => {
        const a = R.int(2, 6);
        return { q: `$x>${a}$이 $x>k$이기 위한 충분조건일 때, 실수 $k$의 최댓값은?`, a: a, wrong: [a + 1, a - 1, 0], why: `$\\{x\\mid x>${a}\\}\\subset\\{x\\mid x>k\\}$ 이려면 $k\\le${a}$ → 최댓값 $${a}$` };
      } },
    ],
  },
  {
    id: 'h1.proof',
    lesson: [
      { id: 'c1', t: '증명의 방법', b: T`- **직접증명**: 가정에서 결론까지 논리 전개
        - **대우증명**: 대우가 참임을 증명
        - **귀류법(背理法)**: 결론을 부정하면 모순이 생김을 보임. 예) $\sqrt2$는 무리수` },
      { id: 'c2', t: '절대부등식', b: T`항상 성립하는 부등식을 ==절대부등식==이라 해요.

        - $a^2+b^2\ge2ab$ (등호: $a=b$)
        - **산술·기하평균**: $a>0,b>0$이면 $\dfrac{a+b}2\ge\sqrt{ab}$ (등호: $a=b$)
        - 코시-슈바르츠: $(a^2+b^2)(x^2+y^2)\ge(ax+by)^2$

        최솟값 문제: $x+\dfrac4x\ge2\sqrt{x\cdot\dfrac4x}=4$ ($x>0$)` },
    ],
    gens: [
      { id: 'amgm', lv: [2, 5], card: 'c2', make: (R) => {
        const k = R.pick([1, 4, 9, 16, 25]); const s = Math.sqrt(k);
        return { q: `$x>0$일 때 $x+\\dfrac{${k}}{x}$의 최솟값은?`, a: 2 * s, wrong: [s, k, 2 * k].filter((v) => v !== 2 * s), why: `산술·기하평균: $x+\\dfrac{${k}}{x}\\ge2\\sqrt{x\\times\\dfrac{${k}}{x}}=2\\sqrt{${k}}=${2 * s}$ (등호: $x=${s}$)` };
      } },
      { id: 'prod', lv: [3, 5], card: 'c2', make: (R) => {
        const s = R.pick([4, 6, 8, 10, 12]);
        return { q: `$a>0,\\ b>0$이고 $a+b=${s}$일 때 $ab$의 최댓값은?`, a: (s / 2) ** 2, wrong: [s, s * s, s / 2].filter((v) => v !== (s / 2) ** 2), why: `$\\dfrac{a+b}2\\ge\\sqrt{ab}$ → $\\sqrt{ab}\\le${s / 2}$ → $ab\\le${(s / 2) ** 2}$ (등호: $a=b=${s / 2}$)` };
      } },
      { id: 'method', lv: [1, 3], card: 'c1', make: (R) => {
        const items = [
          ['"$\\sqrt2$는 무리수이다."를 증명할 때 주로 쓰는 방법은?', '귀류법', ['직접증명', '수학적 귀납법', '대우증명'], '결론을 부정해 모순을 보이는 귀류법을 써요.'],
          ['"$a^2$이 짝수이면 $a$도 짝수이다."를 증명하기 쉬운 방법은?', '대우증명', ['귀류법만 가능', '수치대입', '직접증명'], '대우 "$a$가 홀수이면 $a^2$도 홀수"가 증명하기 쉬워요.'],
        ];
        const it = R.pick(items); return { q: it[0], correct: it[1], wrong: it[2], why: it[3] };
      } },
    ],
  },

  // ───────────── 함수 ─────────────
  {
    id: 'h1.fn',
    lesson: [
      { id: 'c1', t: '함수의 뜻', b: T`집합 $X$의 각 원소에 집합 $Y$의 원소가 **하나씩만** 대응할 때 $f:X\to Y$ ==함수==
        - ==정의역== $X$, ==공역== $Y$, ==치역== $\{f(x)\mid x\in X\}$ (공역의 부분집합)` },
      { id: 'c2', t: '여러 가지 함수', b: T`- ==일대일함수==: 서로 다른 원소에 서로 다른 값이 대응
        - ==일대일대응==: 일대일함수이면서 **치역 = 공역**
        - ==항등함수==: $f(x)=x$ / ==상수함수==: 치역의 원소가 1개

        $|X|=m,\ |Y|=n$일 때 함수의 개수 $n^m$, 일대일함수 $_nP_m$, 일대일대응 $n!$ ($m=n$)` },
    ],
    gens: [
      { id: 'val', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.nz(-3, 3), b = R.nz(-5, 5), c = R.int(-4, 4); const x = R.nz(-3, 3);
        return { q: `$f(x)=${polyTex([a, b, c])}$일 때 $f(${x})$의 값은?`, a: a * x * x + b * x + c, wrong: [a * x * x + b * x + c + 1, a * x * x - b * x + c, a * x + b + c].filter((v) => v !== a * x * x + b * x + c), why: `$x=${x}$[을/를] 대입: $${a}\\times${paren(x)}^2+${paren(b)}\\times${paren(x)}+${paren(c)}=${a * x * x + b * x + c}$` };
      } },
      { id: 'count', lv: [2, 5], card: 'c2', make: (R) => {
        const m = R.int(2, 4), n = R.int(m, 5); const kind = R.pick(['all', 'one', 'bij']);
        if (kind === 'all') return { q: `$X=\\{1,\\dots,${m}\\}$에서 $Y=\\{1,\\dots,${n}\\}$로의 함수의 개수는?`, a: n ** m, wrong: [m ** n, n * m, perm(n, m)].filter((v) => v !== n ** m), why: `각 원소마다 $${n}$가지 선택 → $${n}^{${m}}=${n ** m}$` };
        if (kind === 'one') return { q: `$X=\\{1,\\dots,${m}\\}$에서 $Y=\\{1,\\dots,${n}\\}$로의 일대일함수의 개수는?`, a: perm(n, m), wrong: [n ** m, comb(n, m), m ** n].filter((v) => v !== perm(n, m)), why: `$_{${n}}P_{${m}}=${perm(n, m)}$` };
        return { q: `$X=\\{1,\\dots,${m}\\}$에서 $X$로의 일대일대응의 개수는?`, a: fact(m), wrong: [m ** m, m * 2, fact(m) + m].filter((v) => v !== fact(m)), why: `${m}개를 일렬로 배열하는 방법과 같아요. $${m}!=${fact(m)}$` };
      } },
      { id: 'range', lv: [2, 4], card: 'c1', make: (R) => {
        const a = R.int(1, 3), b = R.int(-3, 3); const X = [-1, 0, 1, 2];
        const Y = [...new Set(X.map((x) => a * x + b))].sort((p, q) => p - q);
        return { q: `정의역이 $\\{-1,\\ 0,\\ 1,\\ 2\\}$인 함수 $f(x)=${linTex(a, b)}$의 치역의 원소의 개수는?`, a: Y.length, unit: '개', wrong: [Y.length + 1, Y.length - 1, 2].filter((v) => v !== Y.length), why: `$f$의 값: $${Y.join(',\\ ')}$ → $${Y.length}$개 (일대일이라 정의역과 같아요)` };
      } },
    ],
  },
  {
    id: 'h1.comp',
    lesson: [
      { id: 'c1', t: '합성함수', b: T`$(g\circ f)(x)=g(f(x))$ — **안쪽 $f$부터** 적용해요.

        $f(x)=2x+1,\ g(x)=x^2$ → $(g\circ f)(x)=(2x+1)^2$, $(f\circ g)(x)=2x^2+1$
        ⚠️ 일반적으로 $g\circ f\ne f\circ g$` },
      { id: 'c2', t: '역함수', b: T`$f$가 일대일대응일 때 역함수 $f^{-1}$가 있어요.
        - $f(a)=b\iff f^{-1}(b)=a$
        - 구하는 법: $y=f(x)$를 $x$에 대해 풀고 $x$와 $y$를 바꿔요.
        - $f$와 $f^{-1}$의 그래프는 $y=x$에 대칭

        $f(x)=2x+4$ → $x=\dfrac{y-4}{2}$ → $f^{-1}(x)=\dfrac{x-4}{2}$` },
    ],
    gens: [
      { id: 'comp', lv: [1, 4], card: 'c1', make: (R) => {
        const a = R.nz(-3, 3), b = R.nz(-4, 4), c = R.nz(-3, 3), d = R.nz(-4, 4); const x = R.int(-3, 3);
        const f = (v) => a * v + b, g = (v) => c * v + d;
        const ask = R.pick(['gf', 'fg']);
        const v = ask === 'gf' ? g(f(x)) : f(g(x));
        const name = ask === 'gf' ? '(g\\circ f)' : '(f\\circ g)';
        return { q: `$f(x)=${linTex(a, b)}$, $g(x)=${linTex(c, d)}$일 때 $${name}(${x})$의 값은?`, a: v, wrong: [ask === 'gf' ? f(g(x)) : g(f(x)), v + 1, f(x) + g(x)].filter((q) => q !== v), why: `${ask === 'gf' ? `$f(${x})=${f(x)}$, $g(${f(x)})=${v}$` : `$g(${x})=${g(x)}$, $f(${g(x)})=${v}$`}` };
      } },
      { id: 'inv', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.pick([1, 2, 3, -1, -2]), b = R.nz(-6, 6); const x0 = R.int(-3, 3);
        const y0 = a * x0 + b;
        return { q: `$f(x)=${linTex(a, b)}$일 때 $f^{-1}(${y0})$의 값은?`, a: x0, wrong: [y0, -x0 || 1, a * y0 + b].filter((v) => v !== x0), why: `$f^{-1}(${y0})=k$이면 $f(k)=${y0}$ → $${linTex(a, b).replace('x', 'k')}=${y0}$ → $k=${x0}$` };
      } },
      { id: 'invfn', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.pick([2, 3, 4]), b = R.nz(-6, 6);
        const cor = `$\\dfrac{x${pm(-b)}}{${a}}$`.replace('x+0', 'x');
        return { q: `$f(x)=${a}x${pm(b)}$의 역함수 $f^{-1}(x)$는?`, correct: cor, wrong: uniq([`\\dfrac{x${pm(b)}}{${a}}`, `${a}x${pm(-b)}`, `\\dfrac{${a}}{x${pm(-b)}}`], cor.replace(/\$/g, '')).map((s) => `$${s}$`), why: `$y=${a}x${pm(b)}$ → $x=\\dfrac{y${pm(-b)}}{${a}}$ → 문자를 바꾸면 $f^{-1}(x)=\\dfrac{x${pm(-b)}}{${a}}$` };
      } },
    ],
  },
  {
    id: 'h1.rat',
    lesson: [
      { id: 'c1', t: '유리함수의 그래프', b: T`$y=\dfrac kx$ ($k\ne0$): **쌍곡선**, 점근선 $x=0$ ($y$축), $y=0$ ($x$축)

        $y=\dfrac k{x-p}+q$: $y=\dfrac kx$를 $x$축으로 $p$, $y$축으로 $q$ 평행이동
        - 점근선: $x=p,\ y=q$
        - 정의역 $x\ne p$, 치역 $y\ne q$
        - $k>0$: 1·3사분면 방향 / $k<0$: 2·4사분면 방향` },
      { id: 'c2', t: '$\dfrac{ax+b}{cx+d}$ 꼴', b: T`분자를 분모로 나누어 $\dfrac k{x-p}+q$ 꼴로 고쳐요.

        $y=\dfrac{2x+3}{x+1}=\dfrac{2(x+1)+1}{x+1}=\dfrac1{x+1}+2$ → 점근선 $x=-1,\ y=2$` },
    ],
    gens: [
      { id: 'asym', lv: [1, 4], card: 'c1', make: (R) => {
        const k = R.nz(-6, 6), p = R.nz(-4, 4), q = R.nz(-4, 4);
        const f = `\\dfrac{${k}}{x${pm(-p)}}${q === 0 ? '' : pm(q)}`;
        return { q: `$y=${f}$의 점근선의 방정식은?`, correct: `$x=${p},\\ y=${q}$`, wrong: uniq([`x=${-p},\\ y=${q}`, `x=${p},\\ y=${-q}`, `x=${q},\\ y=${p}`], `x=${p},\\ y=${q}`).map((s) => `$${s}$`), why: `$y=\\dfrac k{x-p}+q$ 의 점근선은 $x=p,\\ y=q$ → $x=${p},\\ y=${q}$` };
      } },
      { id: 'dom', lv: [2, 4], card: 'c1', make: (R) => {
        const k = R.nz(-5, 5), p = R.nz(-5, 5), q = R.nz(-4, 4);
        const ask = R.pick(['dom', 'rng']);
        return { q: `$y=\\dfrac{${k}}{x${pm(-p)}}${pm(q)}$의 ${ask === 'dom' ? '정의역' : '치역'}에서 제외되는 값은?`.replace(/\+0$/, ''), a: ask === 'dom' ? p : q, wrong: [ask === 'dom' ? q : p, -(ask === 'dom' ? p : q), k].filter((v) => v !== (ask === 'dom' ? p : q)), why: ask === 'dom' ? `분모가 0이 되는 $x=${p}$ 제외` : `치역은 $y\\ne${q}$ (점근선 $y=${q}$)` };
      } },
      { id: 'conv', lv: [4, 5], card: 'c2', make: (R) => {
        const a = R.int(1, 4), p = R.nz(-3, 3), k = R.nz(-4, 4);
        // y = (a x + b)/(x - p) = a + (a p + b)/(x-p) → b = k - a p
        const b = k - a * p;
        return { q: `$y=\\dfrac{${a}x${pm(b)}}{x${pm(-p)}}$의 점근선 중 $y$축과 평행하지 않은 것(수평 점근선)의 방정식은 $y=m$이에요. $m$은?`, a: a, wrong: [p, k, -a], why: `분자를 분모로 나누면 $${a}+\\dfrac{${k}}{x${pm(-p)}}$ → 수평 점근선 $y=${a}$` };
      } },
    ],
  },
  {
    id: 'h1.irr',
    lesson: [
      { id: 'c1', t: '무리함수', b: T`$y=\sqrt{ax+b}+c$ 처럼 근호 안에 $x$가 있는 함수.
        **근호 안이 0 이상**이어야 해요 → 정의역 결정.

        $y=\sqrt{x-p}+q$ ($a>0$): 정의역 $x\ge p$, 치역 $y\ge q$
        $y=-\sqrt{x-p}+q$: 치역 $y\le q$

        $y=\sqrt x$를 $x$축으로 $p$, $y$축으로 $q$ 평행이동한 그래프예요.` },
    ],
    gens: [
      { id: 'dom', lv: [1, 4], card: 'c1', make: (R) => {
        const a = R.pick([1, 2, 3]), b = R.nz(-6, 6);
        // √(ax+b) 정의역 x ≥ -b/a
        const cor = `$x\\ge${fracS(-b, a)}$`;
        return { q: `$y=\\sqrt{${linTex(a, b)}}$의 정의역은?`, correct: cor, wrong: uniq([`x\\le${fracS(-b, a)}`, `x\\ge${fracS(b, a)}`, `x>${fracS(-b, a)}`], cor.replace(/\$/g, '')).map((s) => `$${s}$`), why: `근호 안 $${linTex(a, b)}\\ge0$ → $x\\ge${fracS(-b, a)}$` };
      } },
      { id: 'rng', lv: [2, 5], card: 'c1', make: (R) => {
        const p = R.nz(-4, 4), q = R.nz(-4, 4), neg = R.chance(0.4);
        return { q: `$y=${neg ? '-' : ''}\\sqrt{x${pm(-p)}}${pm(q)}$의 치역은?`, correct: neg ? `$y\\le${q}$` : `$y\\ge${q}$`, wrong: [neg ? `$y\\ge${q}$` : `$y\\le${q}$`, `$y\\ge${p}$`, `$y\\ge${-q}$`], why: `근호 부분 $\\sqrt{x${pm(-p)}}\\ge0$ → ${neg ? `$-\\sqrt{\\ }\\le0$이므로 $y\\le${q}$` : `$y\\ge${q}$`}` };
      } },
      { id: 'pt', lv: [2, 5], card: 'c1', make: (R) => {
        const s = R.int(1, 5), q = R.nz(-3, 3), p = R.int(-3, 3); const x = p + s * s;
        return { q: `$y=\\sqrt{x${pm(-p)}}${pm(q)}$에서 $x=${x}$일 때 $y$의 값은?`, a: s + q, wrong: [s * s + q, s - q, x + q].filter((v) => v !== s + q), why: `$\\sqrt{${x}${pm(-p)}}=\\sqrt{${s * s}}=${s}$ → $y=${s}${pm(q)}=${s + q}$` };
      } },
    ],
  },

  // ───────────── 순열과 조합 ─────────────
  {
    id: 'h1.perm',
    lesson: [
      { id: 'c1', t: '합의 법칙과 곱의 법칙', b: T`- **합의 법칙**: 두 사건이 동시에 일어나지 않을 때 $m+n$
        - **곱의 법칙**: 두 사건이 잇달아 일어날 때 $m\times n$

        ($A$ 또는 $B$ → 더하기, $A$ 그리고 $B$ → 곱하기)` },
      { id: 'c2', t: '순열', b: T`서로 다른 $n$개에서 $r$개를 뽑아 **순서 있게** 나열하는 경우의 수
        $$_nP_r=n(n-1)\cdots(n-r+1)=\dfrac{n!}{(n-r)!}$$
        $_nP_n=n!$, $0!=1$

        - **이웃하는 경우**: 묶어서 한 덩어리로 생각 → 묶음 안의 순서도 곱하기
        - **이웃하지 않는 경우**: 나머지를 먼저 나열하고 사이사이에 끼우기` },
    ],
    gens: [
      { id: 'basic', lv: [1, 3], card: 'c2', make: (R) => {
        const n = R.int(4, 9), r = R.int(2, 4); const kind = R.pick(['P', 'fact']);
        if (kind === 'fact') { const m = R.int(3, 6); return { q: `$${m}!$의 값은?`, a: fact(m), wrong: [fact(m) + m, m * m, fact(m - 1)], why: `$${m}!=${Array.from({ length: m }, (_, i) => m - i).join('\\times ')}=${fact(m)}$` }; }
        return { q: `$_{${n}}P_{${r}}$의 값은?`, a: perm(n, r), wrong: [comb(n, r), n * r, perm(n, r) + n].filter((v) => v !== perm(n, r)), why: `$_{${n}}P_{${r}}=${Array.from({ length: r }, (_, i) => n - i).join('\\times ')}=${perm(n, r)}$` };
      } },
      { id: 'rule', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.int(2, 5), b = R.int(2, 5), c = R.int(2, 4);
        if (R.chance(0.5)) return { q: `상의 ${a}종류, 하의 ${b}종류가 있을 때 상의 하나와 하의 하나를 짝지어 입는 방법의 수는?`, a: a * b, wrong: [a + b, a * b * 2, a ** b].filter((v) => v !== a * b), why: `곱의 법칙: $${a}\\times${b}=${a * b}$` };
        return { q: `서점에서 소설 ${a}권, 수필 ${b}권 중 한 권을 고르는 방법의 수는?`, a: a + b, wrong: [a * b, a + b + 1, a], why: `합의 법칙: $${a}+${b}=${a + b}$` };
      } },
      { id: 'line', lv: [2, 5], card: 'c2', make: (R) => {
        const n = R.int(4, 6); const kind = R.pick(['adj', 'nonadj']);
        if (kind === 'adj') return { q: `${n}명이 한 줄로 설 때 특정한 두 사람이 이웃하는 경우의 수는?`, a: fact(n - 1) * 2, wrong: [fact(n), fact(n - 1), fact(n - 2) * 2].filter((v) => v !== fact(n - 1) * 2), why: `두 사람을 한 묶음으로 보면 $${n - 1}!$, 묶음 안의 순서 $2!$ → $${n - 1}!\\times2=${fact(n - 1) * 2}$` };
        return { q: `${n}명이 한 줄로 설 때 특정한 두 사람이 이웃하지 않는 경우의 수는?`, a: fact(n) - fact(n - 1) * 2, wrong: [fact(n - 1) * 2, fact(n), fact(n - 2) * 2].filter((v) => v !== fact(n) - fact(n - 1) * 2), why: `전체 $${n}!=${fact(n)}$에서 이웃하는 경우 $${fact(n - 1) * 2}$를 빼요 → $${fact(n) - fact(n - 1) * 2}$` };
      } },
      { id: 'digits', lv: [3, 5], card: 'c2', make: (R) => {
        const n = R.int(4, 6);
        return { q: `$1,2,\\dots,${n}$ 중 서로 다른 세 수를 뽑아 만들 수 있는 세 자리 자연수의 개수는?`, a: perm(n, 3), wrong: [comb(n, 3), n ** 3, perm(n, 2)].filter((v) => v !== perm(n, 3)), why: `$_{${n}}P_3=${perm(n, 3)}$` };
      } },
    ],
  },
  {
    id: 'h1.comb',
    lesson: [
      { id: 'c1', t: '조합', b: T`서로 다른 $n$개에서 **순서 없이** $r$개를 뽑는 경우의 수
        $$_nC_r=\dfrac{_nP_r}{r!}=\dfrac{n!}{r!(n-r)!}$$
        - $_nC_r={}_nC_{n-r}$
        - $_nC_0=_nC_n=1$
        - $_nC_r=_{n-1}C_{r-1}+_{n-1}C_r$

        **순서가 의미 있으면 순열, 없으면 조합**` },
      { id: 'c2', t: '조합의 활용', b: T`- 특정 원소를 **포함**하는 경우: 그 원소를 뽑은 뒤 나머지에서 $r-1$개
        - 특정 원소를 **제외**하는 경우: 나머지 $n-1$개에서 $r$개
        - 팀 나누기, 대표 뽑기, 도형(삼각형)의 개수 등
        - 대각선의 수: $_nC_2-n$` },
    ],
    gens: [
      { id: 'basic', lv: [1, 3], card: 'c1', make: (R) => {
        const n = R.int(5, 10), r = R.int(2, 4);
        return { q: `$_{${n}}C_{${r}}$의 값은?`, a: comb(n, r), wrong: [perm(n, r), comb(n, r) + n, comb(n, r - 1)].filter((v) => v !== comb(n, r)), why: `$_{${n}}C_{${r}}=\\dfrac{${n}!}{${r}!\\,${n - r}!}=${comb(n, r)}$` };
      } },
      { id: 'pick', lv: [1, 4], card: 'c1', make: (R) => {
        const n = R.int(5, 10), r = R.int(2, 3);
        return { q: `${n}명 중에서 대표 ${r}명을 뽑는 경우의 수는?`, a: comb(n, r), wrong: [perm(n, r), n * r, comb(n, r) + 1].filter((v) => v !== comb(n, r)), why: `순서가 없으므로 조합: $_{${n}}C_{${r}}=${comb(n, r)}$` };
      } },
      { id: 'incl', lv: [3, 5], card: 'c2', make: (R) => {
        const n = R.int(6, 10), r = R.int(2, 4);
        const kind = R.pick(['in', 'out']);
        if (kind === 'in') return { q: `${n}명 중 ${r}명을 뽑을 때 특정한 한 사람이 반드시 포함되는 경우의 수는?`, a: comb(n - 1, r - 1), wrong: [comb(n, r), comb(n - 1, r), comb(n - 1, r - 1) + 1].filter((v) => v !== comb(n - 1, r - 1)), why: `그 사람을 뽑고 나머지 ${n - 1}명에서 ${r - 1}명: $_{${n - 1}}C_{${r - 1}}=${comb(n - 1, r - 1)}$` };
        return { q: `${n}명 중 ${r}명을 뽑을 때 특정한 한 사람이 포함되지 않는 경우의 수는?`, a: comb(n - 1, r), wrong: [comb(n, r), comb(n - 1, r - 1), comb(n - 1, r) + 1].filter((v) => v !== comb(n - 1, r)), why: `그 사람을 제외한 ${n - 1}명에서 ${r}명: $_{${n - 1}}C_{${r}}=${comb(n - 1, r)}$` };
      } },
      { id: 'geo', lv: [3, 5], card: 'c2', make: (R) => {
        const n = R.int(5, 9);
        if (R.chance(0.5)) return { q: `원 위의 서로 다른 ${n}개의 점 중 세 점을 이어 만들 수 있는 삼각형의 개수는?`, a: comb(n, 3), wrong: [perm(n, 3), comb(n, 2), n * 3].filter((v) => v !== comb(n, 3)), why: `세 점을 고르면 삼각형이 하나 정해져요 → $_{${n}}C_3=${comb(n, 3)}$` };
        return { q: `볼록 ${n}각형의 대각선의 개수는?`, a: comb(n, 2) - n, wrong: [comb(n, 2), n * (n - 1), comb(n, 2) - n + 1].filter((v) => v !== comb(n, 2) - n), why: `꼭짓점 두 개를 잇는 선분 $_{${n}}C_2=${comb(n, 2)}$에서 변 ${n}개를 빼요 → $${comb(n, 2) - n}$` };
      } },
    ],
  },
];

function fracS(n, d) { const g = gcd(n, d) || 1; let a = n / g, b = d / g; if (b < 0) { a = -a; b = -b; } return b === 1 ? `${a}` : `\\dfrac{${a}}{${b}}`; }
