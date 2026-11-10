// 수학Ⅱ: 함수의 극한과 연속 · 미분 · 적분
import { gcd, linTex, polyTex, polyMul, polyEval, pm, paren } from '../js/lib.js';

const T = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const uniq = (arr, not) => [...new Set(arr.map(String))].filter((x) => x !== String(not));
const fS = (n, d) => { const g = gcd(n, d) || 1; let a = n / g, b = d / g; if (b < 0) { a = -a; b = -b; } return b === 1 ? `${a}` : `\\dfrac{${a}}{${b}}`; };
// 숫자 오답 후보: 후보 + 정답±1,2 로 보충
const W = (ans, ...c) => { const s = new Set(); [...c, ans + 1, ans - 1, ans + 2, ans - 2, ans * 2].forEach((v) => { if (v !== ans && Number.isFinite(v)) s.add(v); }); return [...s].slice(0, 4); };
const dP = (co) => co.slice(0, -1).map((c, i) => c * (co.length - 1 - i));          // 도함수 계수
const iP = (co) => [...co.map((c, i) => c / (co.length - i)), 0];                    // 부정적분 계수(상수항 0)
const ev = polyEval;
const sx = (n) => (n === 0 ? '' : n > 0 ? `+${n}` : `${n}`);                          // 상수 붙이기
const fac = (p, e = 1) => { const b = p === 0 ? 'x' : `(x${pm(-p)})`; return e === 1 ? b : (p === 0 ? `x^{${e}}` : `${b}^{${e}}`); };
const rp = (R, deg) => { const co = [R.nz(-3, 3)]; for (let i = 0; i < deg; i++) co.push(R.int(-5, 5)); return co; };
// 삼차함수 f'(x)=3(x-p)(x-q), p+q 짝수 → f = x^3 - 3(p+q)/2 x^2 + 3pq x + c0
const cubic = (R, lo = 0, hi = 6) => {
  let p, q;
  do { p = R.int(lo, hi); q = R.int(lo, hi); } while (!(p < q) || (p + q) % 2);
  const c0 = R.int(-5, 5);
  return { p, q, c0, co: [1, -3 * (p + q) / 2, 3 * p * q, c0] };
};

export default [
  // ───────────── 함수의 극한과 연속 ─────────────
  {
    id: 'h3.lim',
    lesson: [
      { id: 'c1', t: '극한의 뜻', b: T`$x$가 $a$에 한없이 가까워질 때 $f(x)$가 한없이 가까워지는 값 $L$을 ==극한값==이라 하고 $\lim_{x\to a}f(x)=L$로 써요.
        - 다항함수는 그냥 ==대입==하면 돼요: $\lim_{x\to2}(x^2+1)=5$
        - $x=a$에서의 함숫값 $f(a)$와 극한값은 달라도 괜찮아요(극한은 "가까이 갈 때"의 값).` },
      { id: 'c2', t: '좌극한·우극한', b: T`- ==좌극한==: $x\to a^{-}$ (왼쪽에서 접근) → $\lim_{x\to a^-}f(x)$
        - ==우극한==: $x\to a^{+}$ (오른쪽에서 접근)
        - 극한이 존재 $\iff$ ==좌극한 = 우극한==

        예) $f(x)=\begin{cases}x+1&(x<2)\\2x-3&(x\ge2)\end{cases}$ → 좌극한 $3$, 우극한 $1$ → 극한 없음` },
    ],
    gens: [
      { id: 'poly', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const co = lv < 3 ? [R.nz(-3, 3), R.int(-5, 5), R.int(-6, 6)] : rp(R, 3); const k = R.int(-3, 3); const ans = ev(co, k);
        return { q: `$\\lim_{x\\to${k}}(${polyTex(co)})$의 값은?`, a: ans, wrong: W(ans, ev(co, 0), ev(co, k + 1), ev(co, -k)), why: `다항함수는 $x=${k}$를 대입 → $${ans}$` };
      } },
      { id: 'side', lv: [2, 5], card: 'c2', make: (R) => {
        const p = R.int(-4, 4), s = R.nz(-3, 3), c = R.int(-2, 3), r = R.int(-6, 6); const left = R.chance(0.5);
        const L = c + p, Rr = s * c + r;
        const f = `f(x)=\\begin{cases}x${sx(p)}&(x<${c})\\\\${linTex(s, r)}&(x\\ge${c})\\end{cases}`;
        const ans = left ? L : Rr;
        return { q: `$${f}$일 때 $\\lim_{x\\to${c}^{${left ? '-' : '+'}}}f(x)$의 값은?`, a: ans, wrong: W(ans, left ? Rr : L), why: left ? `$x<${c}$ 쪽 식에 대입: $${c}${sx(p)}=${L}$` : `$x\\ge${c}$ 쪽 식에 대입: $${s}\\times${paren(c)}${sx(r)}=${Rr}$` };
      } },
      { id: 'exist', lv: [3, 5], card: 'c2', make: (R) => {
        const p = R.int(-4, 4), s = R.nz(-3, 3), c = R.int(-2, 3); const eq = R.chance(0.5);
        const r = c + p - s * c + (eq ? 0 : R.nz(-3, 3)); const L = c + p, Rr = s * c + r;
        const f = `f(x)=\\begin{cases}x${sx(p)}&(x<${c})\\\\${linTex(s, r)}&(x\\ge${c})\\end{cases}`;
        return { q: `$${f}$일 때 $\\lim_{x\\to${c}}f(x)$는?`, correct: eq ? '극한값이 존재한다' : '극한값이 존재하지 않는다', wrong: [eq ? '극한값이 존재하지 않는다' : '극한값이 존재한다'], why: `좌극한 $${L}$, 우극한 $${Rr}$ → ${eq ? '같으므로 존재' : '다르므로 존재하지 않음'}` };
      } },
    ],
  },
  {
    id: 'h3.lc',
    lesson: [
      { id: 'c1', t: '극한의 성질', b: T`$\lim f=\alpha,\ \lim g=\beta$이면
        - $\lim(f\pm g)=\alpha\pm\beta$, $\lim kf=k\alpha$
        - $\lim fg=\alpha\beta$, $\lim\dfrac fg=\dfrac\alpha\beta$ ($\beta\ne0$)` },
      { id: 'c2', t: '$\\frac00$ 꼴 — 인수분해', b: T`대입했더니 $\dfrac00$이면 분자·분모를 인수분해해서 ==약분==한 뒤 다시 대입!

        $\lim_{x\to2}\dfrac{x^2-4}{x-2}=\lim_{x\to2}\dfrac{(x-2)(x+2)}{x-2}=\lim_{x\to2}(x+2)=4$

        무리식이 있으면 ==유리화==(켤레식을 곱함)를 해요.` },
      { id: 'c3', t: '$x\\to\\infty$ 일 때', b: T`분자·분모의 ==최고차항==만 보면 돼요. (분모의 최고차항으로 분자·분모를 나눔)
        - 차수 같음 → 최고차항 계수의 비
        - 분자 차수 < 분모 차수 → $0$
        - 분자 차수 > 분모 차수 → 발산($\infty$ 또는 $-\infty$)

        $\sqrt{\ }$ 꼴의 차는 유리화 후 최고차항 비교.` },
    ],
    gens: [
      { id: 'fac', lv: [1, 4], card: 'c2', make: (R, lv) => {
        const a = R.int(-4, 4); let r; do { r = R.int(-4, 4); } while (r === a);
        const m = lv >= 3 ? R.int(2, 3) : 1; const ans = m * (a - r);
        const num = polyTex([m, -m * (a + r), m * a * r]);
        return { q: `$\\lim_{x\\to${a}}\\dfrac{${num}}{${polyTex([1, -a])}}$의 값은?`, a: ans, wrong: W(ans, m * (r - a), m * (a + r), -m * r), why: `분자 $=${m === 1 ? '' : m}(x${pm(-a)})(x${pm(-r)})$ → 약분하면 $${m === 1 ? '' : m}(x${pm(-r)})$ → $x=${a}$ 대입: $${ans}$` };
      } },
      { id: 'inf', lv: [2, 5], card: 'c3', make: (R) => {
        const k = R.pick(['same', 'same', 'low', 'high']);
        const a = R.nz(-5, 5), b = R.int(-4, 4), c = R.int(-4, 4), d = R.nz(-4, 4), e = R.int(-4, 4), f = R.int(-4, 4);
        if (k === 'same') {
          const ans = fS(a, d);
          return { q: `$\\lim_{x\\to\\infty}\\dfrac{${polyTex([a, b, c])}}{${polyTex([d, e, f])}}$의 값은?`, correct: `$${ans}$`, wrong: uniq([`$${fS(d, a)}$`, '$0$', '$\\infty$ (발산)'], `$${ans}$`).slice(0, 3), why: `차수가 같으므로 최고차항 계수의 비: $\\dfrac{${a}}{${d}}=${ans}$` };
        }
        if (k === 'low') return { q: `$\\lim_{x\\to\\infty}\\dfrac{${polyTex([a, b])}}{${polyTex([d, e, f])}}$의 값은?`, correct: '$0$', wrong: [`$${fS(a, d)}$`, '$\\infty$ (발산)', '$1$'], why: '분자의 차수(1) < 분모의 차수(2) → 극한값 $0$' };
        return { q: `$\\lim_{x\\to\\infty}\\dfrac{${polyTex([a, b, c, 1])}}{${polyTex([d, e, f])}}$의 값은?`, correct: '발산한다 ($\\pm\\infty$)', wrong: ['$0$', `$${fS(a, d)}$`, '$1$'], why: '분자의 차수(3) > 분모의 차수(2) → 발산' };
      } },
      { id: 'rat', lv: [3, 5], card: 'c2', make: (R) => {
        const c = R.int(2, 4), a = R.int(1, 8), b = c * c - a;
        const ans = fS(1, 2 * c);
        return { q: `$\\lim_{x\\to${a}}\\dfrac{\\sqrt{x${sx(b)}}-${c}}{x-${a}}$의 값은?`, correct: `$${ans}$`, wrong: uniq([`$${fS(1, c)}$`, `$${c}$`, `$${fS(1, 4 * c)}$`, `$${fS(2, c)}$`], `$${ans}$`).slice(0, 3), why: `분자·분모에 $\\sqrt{x${sx(b)}}+${c}$를 곱하면 분자가 $x-${a}$가 되어 약분 → $\\dfrac1{\\sqrt{x${sx(b)}}+${c}}$ → $\\dfrac1{${2 * c}}$` };
      } },
      { id: 'sqinf', lv: [4, 5], card: 'c3', make: (R) => {
        const a = 2 * R.int(1, 6); const ans = a / 2;
        return { q: `$\\lim_{x\\to\\infty}(\\sqrt{x^2+${a}x}-x)$의 값은?`, a: ans, wrong: W(ans, a, 0, a * a), why: `유리화: $\\dfrac{${a}x}{\\sqrt{x^2+${a}x}+x}$ → 분자·분모를 $x$로 나누면 $\\dfrac{${a}}{1+1}=${ans}$` };
      } },
    ],
  },
  {
    id: 'h3.ct',
    lesson: [
      { id: 'c1', t: '연속의 뜻', b: T`$f$가 $x=a$에서 ==연속==이려면 세 가지가 모두 필요해요.
        1. $f(a)$가 정의됨
        2. $\lim_{x\to a}f(x)$가 존재
        3. $\lim_{x\to a}f(x)=f(a)$

        그래프가 $x=a$에서 ==끊기지 않고 이어진== 것이라 생각하면 돼요.` },
      { id: 'c2', t: '연속함수의 성질과 사잇값 정리', b: T`- 연속인 두 함수의 합·차·곱·몫(분모≠0)은 연속
        - 다항함수는 모든 실수에서 연속
        - ==최대·최소 정리==: 닫힌구간 $[a,b]$에서 연속이면 최댓값·최솟값이 존재
        - ==사잇값 정리==: $[a,b]$에서 연속이고 $f(a)f(b)<0$이면 $(a,b)$에서 $f(x)=0$인 실근이 ==적어도 하나== 존재` },
    ],
    gens: [
      { id: 'k', lv: [2, 4], card: 'c1', make: (R) => {
        const c = R.int(-3, 3); let r; do { r = R.int(-4, 4); } while (r === c);
        const num = polyTex([1, -(c + r), c * r]); const ans = c - r;
        return { q: `함수 $f(x)=\\begin{cases}\\dfrac{${num}}{x${pm(-c)}}&(x\\ne${c})\\\\k&(x=${c})\\end{cases}$가 $x=${c}$에서 연속일 때 $k$의 값은?`.replace(`x${pm(-c)}}`, `${polyTex([1, -c])}}`), a: ans, wrong: W(ans, r - c, c + r, c * r), why: `$k=\\lim_{x\\to${c}}f(x)$: 분자 $=(x${pm(-c)})(x${pm(-r)})$ → 약분 후 $x=${c}$ 대입 → $${ans}$` };
      } },
      { id: 'ab', lv: [2, 5], card: 'c1', make: (R) => {
        const p = R.int(-4, 4), s = R.nz(-3, 3), c = R.int(-2, 3); const a = c + p - s * c;
        return { q: `함수 $f(x)=\\begin{cases}x${sx(p)}&(x<${c})\\\\${s === 1 ? '' : s === -1 ? '-' : s}x+a&(x\\ge${c})\\end{cases}$가 $x=${c}$에서 연속일 때 상수 $a$의 값은?`, a, wrong: W(a, c + p, s * c + p, a + s), why: `좌극한 $${c}${sx(p)}=${c + p}$ = 우극한 $${s}\\times${paren(c)}+a$ → $a=${a}$` };
      } },
      { id: 'chk', lv: [1, 3], card: 'c1', make: (R) => {
        const c = R.int(-3, 3); const A = R.int(-3, 5); const ok = R.chance(0.4); const kind = ok ? 0 : R.int(1, 3);
        let L = A, Rr = A, fa = A;
        if (kind === 1) Rr = A + R.nz(-3, 3);
        if (kind === 2) { L = A + R.nz(-3, 3); Rr = L; }
        if (kind === 3) fa = A + R.nz(-3, 3);
        return { q: `$f(${c})=${fa}$, $\\lim_{x\\to${c}^-}f(x)=${L}$, $\\lim_{x\\to${c}^+}f(x)=${Rr}$일 때, $f$는 $x=${c}$에서?`, correct: ok ? '연속이다' : '불연속이다', wrong: [ok ? '불연속이다' : '연속이다'], why: ok ? '극한값 = 함숫값이므로 연속' : (L !== Rr ? '좌극한 ≠ 우극한이라 극한이 없으므로 불연속' : '극한값 ≠ 함숫값이므로 불연속') };
      } },
      { id: 'ivt', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.int(-2, 2), b = a + R.int(1, 3); const u = R.nz(-6, 6), v = R.nz(-6, 6); const ok = u * v < 0;
        return { q: `$f$가 닫힌구간 $[${a},${b}]$에서 연속이고 $f(${a})=${u}$, $f(${b})=${v}$일 때, 사잇값 정리로 알 수 있는 것은?`, correct: ok ? `$(${a},${b})$에서 $f(x)=0$인 실근이 적어도 하나 있다` : `$(${a},${b})$에서 $f(x)=0$인 실근이 있다고 확정할 수 없다`, wrong: [ok ? `$(${a},${b})$에서 $f(x)=0$인 실근이 있다고 확정할 수 없다` : `$(${a},${b})$에서 $f(x)=0$인 실근이 적어도 하나 있다`], why: ok ? '$f(a)f(b)<0$이므로 사잇값 정리로 근이 존재' : '$f(a)f(b)>0$(같은 부호)이면 사잇값 정리를 쓸 수 없음' };
      } },
    ],
  },

  // ───────────── 미분 ─────────────
  {
    id: 'h3.dv',
    lesson: [
      { id: 'c1', t: '미분계수', b: T`$x=a$에서의 ==순간변화율==(= 접선의 기울기)

        $f'(a)=\lim_{h\to0}\dfrac{f(a+h)-f(a)}{h}=\lim_{x\to a}\dfrac{f(x)-f(a)}{x-a}$

        $\lim_{h\to0}\dfrac{f(a+kh)-f(a)}{h}=k\,f'(a)$ ($k$가 붙으면 $k$배!)` },
      { id: 'c2', t: '도함수', b: T`각 $x$에 미분계수를 대응시킨 함수 $f'(x)$.
        - $(x^n)'=nx^{n-1}$, $(c)'=0$
        - 계수는 그대로: $(3x^2)'=6x$

        예) $f(x)=x^3-2x^2+5$ → $f'(x)=3x^2-4x$` },
      { id: 'c3', t: '미분가능과 연속', b: T`- $x=a$에서 ==미분가능하면 연속==이에요.
        - 하지만 ==연속이어도 미분가능하다는 보장은 없어요==. (뾰족한 점) 예) $y=|x|$는 $x=0$에서 연속이지만 미분 불가능.
        - 좌미분계수 = 우미분계수일 때 미분가능.` },
    ],
    gens: [
      { id: 'def', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const co = rp(R, lv < 3 ? 2 : 3); const a = R.int(-2, 3); const ans = ev(dP(co), a);
        return { q: `$f(x)=${polyTex(co)}$일 때 $\\lim_{h\\to0}\\dfrac{f(${a}+h)-f(${a})}{h}$의 값은?`, a: ans, wrong: W(ans, ev(co, a), -ans, ev(dP(co), a + 1)), why: `이 극한이 곧 $f'(${a})$. $f'(x)=${polyTex(dP(co))}$ → $f'(${a})=${ans}$` };
      } },
      { id: 'kh', lv: [3, 5], card: 'c1', make: (R) => {
        const co = rp(R, 2); const a = R.int(-2, 3); const k = R.pick([2, 3, -2, 4]); const d = ev(dP(co), a); const ans = k * d;
        return { q: `$f(x)=${polyTex(co)}$일 때 $\\lim_{h\\to0}\\dfrac{f(${a}${k > 0 ? '+' : '-'}${Math.abs(k)}h)-f(${a})}{h}$의 값은?`, a: ans, wrong: W(ans, d, -ans, k + d), why: `$${k}h$가 들어 있으므로 $${k}\\,f'(${a})$. $f'(${a})=${d}$ → $${ans}$` };
      } },
      { id: 'der', lv: [1, 4], card: 'c2', make: (R, lv) => {
        const co = rp(R, lv < 3 ? 2 : 3); const d = dP(co);
        const wr = uniq([polyTex(co.slice(0, -1)), polyTex(d.map((c, i) => (i === d.length - 1 ? c : c))), polyTex([...d.slice(0, -1), d[d.length - 1] + 1]), polyTex(co.map((c, i) => c * (co.length - i)).slice(0, -1))], polyTex(d));
        return { q: `$f(x)=${polyTex(co)}$일 때 $f'(x)$는?`, correct: `$f'(x)=${polyTex(d)}$`, wrong: wr.slice(0, 3).map((s) => `$f'(x)=${s}$`), why: `$(x^n)'=nx^{n-1}$, 상수는 $0$ → $${polyTex(d)}$` };
      } },
      { id: 'val', lv: [2, 4], card: 'c2', make: (R) => {
        const co = rp(R, 3); const a = R.int(-2, 3); const ans = ev(dP(co), a);
        return { q: `$f(x)=${polyTex(co)}$일 때 $f'(${a})$의 값은?`, a: ans, wrong: W(ans, ev(co, a), ev(dP(co), -a)), why: `$f'(x)=${polyTex(dP(co))}$ → $f'(${a})=${ans}$` };
      } },
      { id: 'diff', lv: [3, 5], card: 'c3', make: (R) => {
        const k = R.pick(['abs', 'sq', 'xabs']); const a = R.pick([-2, 0, 1, 2, 3]);
        const xa = `x${pm(-a)}`.replace(/^x\+0|^x-0/, 'x');
        let f, ok, why;
        if (k === 'abs') { f = `|${a === 0 ? 'x' : xa}|`; ok = false; why = `$x=${a}$에서 뾰족한 점: 좌미분계수 $-1$, 우미분계수 $1$이 달라서 미분 불가능`; }
        else if (k === 'sq') { f = `${a === 0 ? 'x' : `(${xa})`}^2`; ok = true; why = `다항함수이므로 모든 실수에서 미분가능`; }
        else { f = `x|${a === 0 ? 'x' : xa}|`; ok = a === 0; why = ok ? '$x|x|$는 $x=0$에서 좌·우미분계수가 모두 $0$이라 미분가능' : `$x=${a}$에서 좌미분계수 $-${a}$, 우미분계수 $${a}$로 다르므로 미분 불가능 ($a\\ne0$)`; }
        return { q: `함수 $f(x)=${f}$는 $x=${a}$에서?`, correct: ok ? '미분가능하다' : '미분가능하지 않다', wrong: [ok ? '미분가능하지 않다' : '미분가능하다'], why };
      } },
    ],
  },
  {
    id: 'h3.dr',
    lesson: [
      { id: 'c1', t: '합·차·상수배', b: T`- $\{f\pm g\}'=f'\pm g'$
        - $\{kf\}'=kf'$

        항마다 따로 미분해서 더하면 돼요.` },
      { id: 'c2', t: '곱의 미분법', b: T`$\{f(x)g(x)\}'=f'(x)g(x)+f(x)g'(x)$

        ==앞 미분 × 뒤 그대로 + 앞 그대로 × 뒤 미분==
        $(\,f\,g\,)'\ne f'g'$ 임에 주의!

        예) $\{(x+1)(x^2-2)\}'=1\cdot(x^2-2)+(x+1)\cdot2x$` },
    ],
    gens: [
      { id: 'prod2', lv: [1, 3], card: 'c2', make: (R) => {
        const f = R.int(-4, 5), fp = R.int(-4, 5), g = R.int(-4, 5), gp = R.int(-4, 5); const ans = fp * g + f * gp;
        return { q: `$f(1)=${f}$, $f'(1)=${fp}$, $g(1)=${g}$, $g'(1)=${gp}$일 때 $y=f(x)g(x)$의 $x=1$에서의 미분계수는?`, a: ans, wrong: W(ans, fp * gp, f * g, fp * g - f * gp), why: `$(fg)'=f'g+fg'$ → $${fp}\\times${paren(g)}+${paren(f)}\\times${paren(gp)}=${ans}$` };
      } },
      { id: 'prod', lv: [3, 5], card: 'c2', make: (R) => {
        const g = [R.nz(-2, 2), R.int(-3, 3), R.int(-4, 4)], h = [R.nz(-3, 3), R.int(-4, 4)]; const a = R.int(-2, 2);
        const P = polyMul(g, h); const ans = ev(dP(P), a);
        return { q: `$f(x)=(${polyTex(g)})(${polyTex(h)})$일 때 $f'(${a})$의 값은?`, a: ans, wrong: W(ans, ev(dP(g), a) * ev(dP(h), a), ev(g, a) * ev(h, a)), why: `곱의 미분법: $f'=g'h+gh'$ → $${ev(dP(g), a)}\\times${paren(ev(h, a))}+${paren(ev(g, a))}\\times${paren(ev(dP(h), a))}=${ans}$` };
      } },
      { id: 'find', lv: [3, 5], card: 'c1', make: (R) => {
        const a = R.int(-3, 3), b = R.int(-4, 4);
        const f1 = 3 + 2 * a + b, f2 = 3 - 2 * a + b;
        return { q: `$f(x)=x^3+ax^2+bx$ ($a,b$는 상수)에서 $f'(1)=${f1}$, $f'(-1)=${f2}$일 때 $a$의 값은?`, a, wrong: W(a, b, a + b), why: `$f'(x)=3x^2+2ax+b$ → $f'(1)-f'(-1)=4a=${f1 - f2}$ → $a=${a}$` };
      } },
    ],
  },
  {
    id: 'h3.tn',
    lesson: [
      { id: 'c1', t: '접선의 기울기', b: T`곡선 $y=f(x)$ 위의 점 $(a,f(a))$에서 접선의 ==기울기는 $f'(a)$==.` },
      { id: 'c2', t: '접선의 방정식', b: T`점 $(a,f(a))$에서의 접선:
        $$y-f(a)=f'(a)(x-a)$$
        1. $f'(x)$를 구하고 $f'(a)$(기울기)를 계산
        2. 접점 $(a,f(a))$ 확인
        3. 점-기울기 꼴에 대입` },
    ],
    gens: [
      { id: 'slope', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const co = rp(R, lv < 2 ? 2 : 3); const a = R.int(-2, 3); const ans = ev(dP(co), a);
        return { q: `곡선 $y=${polyTex(co)}$ 위의 $x=${a}$인 점에서의 접선의 기울기는?`, a: ans, wrong: W(ans, ev(co, a)), why: `$y'=${polyTex(dP(co))}$ → $x=${a}$ 대입: $${ans}$` };
      } },
      { id: 'eq', lv: [2, 4], card: 'c2', make: (R) => {
        const co = rp(R, 2); const a = R.int(-2, 3); const m = ev(dP(co), a), y0 = ev(co, a), n = y0 - m * a;
        const wr = uniq([`y=${linTex(m, -n)}`, `y=${linTex(m, y0)}`, `y=${linTex(-m, n)}`, `y=${linTex(m + 1, n)}`], `y=${linTex(m, n)}`);
        return { q: `곡선 $y=${polyTex(co)}$ 위의 점 $(${a},${y0})$에서의 접선의 방정식은?`, correct: `$y=${linTex(m, n)}$`, wrong: wr.slice(0, 3).map((s) => `$${s}$`), why: `$y'=${polyTex(dP(co))}$ → 기울기 $${m}$ → $y-${paren(y0)}=${m}(x${pm(-a)})$ → $y=${linTex(m, n)}$` };
      } },
      { id: 'yint', lv: [3, 5], card: 'c2', make: (R) => {
        const co = rp(R, R.pick([2, 3])); const a = R.int(-2, 3); const m = ev(dP(co), a), y0 = ev(co, a), n = y0 - m * a;
        return { q: `곡선 $y=${polyTex(co)}$ 위의 $x=${a}$인 점에서의 접선의 $y$절편은?`, a: n, wrong: W(n, y0, -n, m), why: `기울기 $${m}$, 접점 $(${a},${y0})$ → $y=${linTex(m, n)}$ → $y$절편 $${n}$` };
      } },
      { id: 'pt', lv: [3, 5], card: 'c1', make: (R) => {
        const a = R.int(-3, 4), b = R.int(-4, 4), c = R.int(-4, 4); const m = 2 * a + b;
        return { q: `곡선 $y=x^2${sx(b) ? sx(b) + 'x' : ''}${sx(c)}$ 위의 한 점에서의 접선의 기울기가 $${m}$일 때, 그 접점의 $x$좌표는?`, a, wrong: W(a, m, -a), why: `$y'=2x${sx(b)}=${m}$ → $x=${a}$` };
      } },
    ],
  },
  {
    id: 'h3.ex',
    lesson: [
      { id: 'c1', t: '증가와 감소', b: T`- $f'(x)>0$인 구간에서 ==증가==
        - $f'(x)<0$인 구간에서 ==감소==

        $f'(x)=0$이 되는 $x$ 근처에서 부호가 바뀌는지 표(증감표)로 확인해요.` },
      { id: 'c2', t: '극대·극소', b: T`$f'(a)=0$이고 $x=a$ 좌우에서
        - $f'$이 ==+ → −== : ==극대== (극댓값 $f(a)$)
        - $f'$이 ==− → +== : ==극소== (극솟값 $f(a)$)

        부호가 안 바뀌면(예: $f'(x)=x^2$) 극값이 아니에요.
        ※ 극값을 찾으면 마지막에 반드시 $f$에 대입해 ==값==을 구해요.` },
    ],
    gens: [
      { id: 'crit', lv: [2, 4], card: 'c2', make: (R) => {
        const { p, q, co } = cubic(R, -2, 5); const mx = R.chance(0.5);
        return { q: `$f(x)=${polyTex(co)}$이 ${mx ? '극대' : '극소'}가 되는 $x$의 값은?`, a: mx ? p : q, wrong: W(mx ? p : q, mx ? q : p, p + q), why: `$f'(x)=3${fac(p)}${fac(q)}$ → $x=${p},${q}$에서 부호 변화. $x^3$ 계수가 양수이므로 $x=${p}$에서 +→− (극대), $x=${q}$에서 −→+ (극소)` };
      } },
      { id: 'interval', lv: [2, 4], card: 'c1', make: (R) => {
        const { p, q, co } = cubic(R, -3, 5);
        const dec = R.chance(0.6);
        const good = dec ? `$${p}<x<${q}$` : `$x<${p}$ 또는 $x>${q}$`;
        const bad = dec ? [`$x<${p}$ 또는 $x>${q}$`, `$x<${-q}$ 또는 $x>${-p}$`, `$${-q}<x<${-p}$`] : [`$${p}<x<${q}$`, `$x<${-q}$ 또는 $x>${-p}$`, `$${-q}<x<${-p}$`];
        return { q: `$f(x)=${polyTex(co)}$이 ${dec ? '감소' : '증가'}하는 $x$의 범위는?`, correct: good, wrong: bad, why: `$f'(x)=3${fac(p)}${fac(q)}$ → $${p}<x<${q}$에서 $f'<0$(감소), 그 밖에서 $f'>0$(증가)` };
      } },
      { id: 'val', lv: [3, 5], card: 'c2', make: (R) => {
        const { p, q, co } = cubic(R, -2, 5); const mx = R.chance(0.5); const ans = ev(co, mx ? p : q);
        return { q: `$f(x)=${polyTex(co)}$의 ${mx ? '극댓값' : '극솟값'}은?`, a: ans, wrong: W(ans, ev(co, mx ? q : p)), why: `$f'(x)=3${fac(p)}${fac(q)}$ → ${mx ? '극대' : '극소'}는 $x=${mx ? p : q}$ → $f(${mx ? p : q})=${ans}$` };
      } },
      { id: 'gap', lv: [4, 5], card: 'c2', make: (R) => {
        const { p, q, co } = cubic(R, -3, 5); const ans = ev(co, p) - ev(co, q);
        return { q: `$f(x)=${polyTex(co)}$의 (극댓값)−(극솟값)은?`, a: ans, wrong: W(ans, -ans, ev(co, p)), why: `극대 $x=${p}$: $${ev(co, p)}$, 극소 $x=${q}$: $${ev(co, q)}$ → 차 $${ans}$` };
      } },
      { id: 'param', lv: [4, 5], card: 'c2', make: (R) => {
        const m = R.int(1, 3), v = R.int(-6, 6); const a = v + 2 * m ** 3;
        return { q: `$f(x)=x^3-${3 * m * m}x+a$의 극솟값이 $${v}$일 때 상수 $a$의 값은?`, a, wrong: W(a, v - 2 * m ** 3, v), why: `$f'(x)=3x^2-${3 * m * m}=3(x+${m})(x-${m})$ → 극소는 $x=${m}$: $f(${m})=${m ** 3}-${3 * m ** 3}+a=-${2 * m ** 3}+a=${v}$ → $a=${a}$` };
      } },
    ],
  },
  {
    id: 'h3.gp',
    lesson: [
      { id: 'c1', t: '극값의 개수', b: T`$f'(x)=0$의 근 중에서 ==부호가 바뀌는== 근만 극값의 위치예요.
        - $f'(x)=(x-p)(x-q)$ ($p\ne q$) → 극값 ==2개==
        - $f'(x)=(x-p)^2(x-q)$ → $x=q$에서만 부호 변화 → 극값 ==1개==
        - $f'(x)=(x-p)^2$ → 극값 없음(항상 증가)` },
      { id: 'c2', t: '함수의 그래프', b: T`증감표 → 극값 → $y$절편 → 개형 순서로 그려요.
        - 삼차함수 $x^3$ 계수가 양수: 좌하 → 우상 (극값이 있으면 N자 모양)
        - 사차함수 $x^4$ 계수가 양수: 양쪽 끝이 위로 (W자 또는 U자)

        ==항상 증가==하려면 $f'(x)\ge0$이 모든 $x$에서 성립해야 하므로 $f'$의 판별식 $D\le0$.` },
    ],
    gens: [
      { id: 'cnt', lv: [2, 4], card: 'c1', make: (R) => {
        const ps = R.sample([-3, -2, -1, 0, 1, 2, 3], 3); const [p, q, r] = ps;
        const k = R.pick([['(x-p)(x-q)', 2], ['(x-p)^2(x-q)', 1], ['(x-p)^2', 0], ['(x-p)(x-q)(x-r)', 3]]);
        const f = k[0] === '(x-p)(x-q)' ? fac(p) + fac(q) : k[0] === '(x-p)^2(x-q)' ? fac(p, 2) + fac(q) : k[0] === '(x-p)^2' ? fac(p, 2) : fac(p) + fac(q) + fac(r);
        const ans = k[1];
        const why = ans === 0 ? '$f\'$이 한 번도 부호를 바꾸지 않으므로(항상 $\\ge0$) 극값 없음' : ans === 1 ? '중근(제곱) 쪽은 부호가 안 바뀌어 극값이 아님 → 나머지 한 근에서만 극값' : `서로 다른 일차 인수 ${ans}개 → 부호가 ${ans}번 바뀜`;
        return { q: `$f'(x)=${f}$일 때 $f(x)$의 극값을 갖는 $x$의 개수는?`, a: ans, wrong: W(ans).filter((v) => v >= 0 && v <= 4), why };
      } },
      { id: 'quartic', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.int(1, 3), k = R.int(-4, 4); const ans = k - a ** 4;
        return { q: `$f(x)=x^4-${2 * a * a}x^2${sx(k)}$의 극솟값은?`, a: ans, wrong: W(ans, k, a ** 4, -(a ** 4)), why: `$f'(x)=4x^3-${4 * a * a}x=4x(x+${a})(x-${a})$ → $x=\\pm${a}$에서 극소: $f(${a})=${a ** 4}-${2 * a ** 4}${sx(k)}=${ans}$` };
      } },
      { id: 'inc', lv: [4, 5], card: 'c2', make: (R) => {
        const b = R.int(2, 12); const m = Math.floor(Math.sqrt(3 * b)); const ans = 2 * m + 1;
        return { q: `삼차함수 $f(x)=x^3+ax^2+${b}x+1$이 모든 실수 $x$에서 증가하도록 하는 정수 $a$의 개수는?`, a: ans, wrong: W(ans, 2 * m, m), why: `$f'(x)=3x^2+2ax+${b}\\ge0$ → 판별식 $\\dfrac D4=a^2-${3 * b}\\le0$ → $|a|\\le\\sqrt{${3 * b}}$ → 정수 $a=-${m},\\dots,${m}$: $${ans}$개` };
      } },
    ],
  },
  {
    id: 'h3.ap',
    lesson: [
      { id: 'c1', t: '닫힌구간의 최대·최소', b: T`닫힌구간 $[a,b]$에서 연속인 $f$의 최대·최소는
        - ==극값(구간 안의 것)==과 ==양 끝값== $f(a),f(b)$ 중 가장 큰/작은 값

        끝값을 빼먹지 않는 게 포인트!` },
      { id: 'c2', t: '방정식의 실근의 개수', b: T`$f(x)=0$의 서로 다른 실근 수 = 그래프가 $x$축과 만나는 점의 수.
        삼차함수 (극댓값 $M$, 극솟값 $m$)
        - $Mm<0$ → 서로 다른 ==세== 실근
        - $Mm=0$ → ==두== 실근(하나는 중근)
        - $Mm>0$ → ==한== 실근` },
      { id: 'c3', t: '부등식에의 활용', b: T`"모든 $x$에서 $f(x)\ge0$" ⟺ ==($f$의 최솟값) ≥ 0==.
        최솟값을 구해서 조건에 넣으면 상수의 범위가 나와요.` },
    ],
    gens: [
      { id: 'range', lv: [2, 5], card: 'c1', make: (R) => {
        const { p, q, co } = cubic(R, 0, 5); const lo = R.int(-1, q), hi = lo + R.int(1, 4); const mx = R.chance(0.5);
        const c = [lo, hi]; if (p > lo && p < hi) c.push(p); if (q > lo && q < hi) c.push(q);
        const vals = c.map((x) => ev(co, x)); const ans = mx ? Math.max(...vals) : Math.min(...vals);
        return { q: `$-1\\le$ 가 아니라 구간 $[${lo},${hi}]$에서 $f(x)=${polyTex(co)}$의 ${mx ? '최댓값' : '최솟값'}은?`.replace('$-1\\le$ 가 아니라 구간', '구간'), a: ans, wrong: W(ans, mx ? Math.min(...vals) : Math.max(...vals), ev(co, lo), ev(co, hi)), why: `$f'(x)=3${fac(p)}${fac(q)}$. 후보: ${c.map((x) => `$f(${x})=${ev(co, x)}$`).join(', ')} → ${mx ? '최대' : '최소'} $${ans}$` };
      } },
      { id: 'roots', lv: [3, 5], card: 'c2', make: (R) => {
        const m = R.int(1, 2), j = R.int(-3, 3), u = m ** 3; const k = j * u; const ans = Math.abs(j) < 2 ? 3 : Math.abs(j) === 2 ? 2 : 1;
        return { q: `방정식 $x^3-${3 * m * m}x${sx(k)}=0$의 서로 다른 실근의 개수는?`, a: ans, wrong: [1, 2, 3, 0].filter((v) => v !== ans).slice(0, 3), why: `$f(x)=x^3-${3 * m * m}x${sx(k)}$: 극대 $f(-${m})=${2 * u + k}$, 극소 $f(${m})=${-2 * u + k}$ → ${ans === 3 ? '곱이 음수이므로 세 실근' : ans === 2 ? '곱이 $0$이므로 두 실근' : '곱이 양수이므로 한 실근'}` };
      } },
      { id: 'ineq', lv: [4, 5], card: 'c3', make: (R) => {
        const m = R.int(1, 4); const ans = 2 * m ** 3;
        return { q: `$x\\ge0$인 모든 $x$에 대하여 $x^3-${3 * m * m}x+k\\ge0$이 성립하도록 하는 $k$의 최솟값은?`, a: ans, wrong: W(ans, m ** 3, -ans, m), why: `$f(x)=x^3-${3 * m * m}x+k$, $f'(x)=3(x+${m})(x-${m})$ → $x\\ge0$에서 최솟값은 $f(${m})=-${ans}+k\\ge0$ → $k\\ge${ans}$` };
      } },
    ],
  },
  {
    id: 'h3.mo',
    lesson: [
      { id: 'c1', t: '속도와 가속도', b: T`수직선 위를 움직이는 점의 위치 $x(t)$에 대하여
        - ==속도== $v(t)=x'(t)$
        - ==가속도== $a(t)=v'(t)=x''(t)$
        - 속력 $=|v(t)|$` },
      { id: 'c2', t: '운동 방향', b: T`- $v>0$: 양의 방향 / $v<0$: 음의 방향
        - $v=0$이고 그 좌우에서 부호가 바뀌면 ==운동 방향이 바뀌는== 순간
        - $v=0$인 순간 = 순간적으로 멈춤` },
    ],
    gens: [
      { id: 'v', lv: [1, 3], card: 'c1', make: (R) => {
        const co = [R.nz(-2, 2), R.int(-4, 4), R.int(-5, 5), 0]; const t = R.int(1, 4); const ans = ev(dP(co), t);
        return { q: `수직선 위를 움직이는 점의 시각 $t$에서의 위치가 $x(t)=${polyTex(co, 't')}$일 때, $t=${t}$에서의 속도는?`, a: ans, wrong: W(ans, ev(co, t), ev(dP(dP(co)), t)), why: `$v(t)=x'(t)=${polyTex(dP(co), 't')}$ → $v(${t})=${ans}$` };
      } },
      { id: 'a', lv: [2, 4], card: 'c1', make: (R) => {
        const co = [R.nz(-2, 2), R.int(-4, 4), R.int(-5, 5), R.int(-3, 3)]; const t = R.int(1, 4); const ans = ev(dP(dP(co)), t);
        return { q: `점 $P$의 위치가 $x(t)=${polyTex(co, 't')}$일 때 $t=${t}$에서의 가속도는?`, a: ans, wrong: W(ans, ev(dP(co), t), ev(co, t)), why: `$v=x\'=${polyTex(dP(co), 't')}$, $a=v'=${polyTex(dP(dP(co)), 't')}$ → $a(${t})=${ans}$` };
      } },
      { id: 'stop', lv: [3, 5], card: 'c2', make: (R) => {
        const { p, q, co } = cubic(R, 1, 6); const last = R.chance(0.5);
        return { q: `점 $P$의 위치가 $x(t)=${polyTex([...co.slice(0, 3), 0], 't')}$ ($t\\ge0$)일 때, 점 $P$가 ${last ? '두 번째로' : '처음으로'} 운동 방향을 바꾸는 시각은?`, a: last ? q : p, wrong: W(last ? q : p, last ? p : q, p + q), why: `$v(t)=3t^2-${3 * (p + q)}t+${3 * p * q}=3(t${pm(-p)})(t${pm(-q)})$ → $v$의 부호가 $t=${p}$, $t=${q}$에서 바뀜` };
      } },
      { id: 'a0', lv: [4, 5], card: 'c1', make: (R) => {
        const { p, q, co } = cubic(R, 1, 6); const ans = (p + q) / 2;
        return { q: `점 $P$의 위치가 $x(t)=${polyTex([...co.slice(0, 3), 0], 't')}$일 때, 가속도가 $0$이 되는 시각은?`, a: ans, wrong: W(ans, p, q, p + q), why: `$a(t)=x''(t)=6t-${3 * (p + q)}=0$ → $t=${ans}$` };
      } },
    ],
  },

  // ───────────── 적분 ─────────────
  {
    id: 'h3.ind',
    lesson: [
      { id: 'c1', t: '부정적분', b: T`미분하면 $f(x)$가 되는 함수 $F(x)$ (미분의 거꾸로) → $\int f(x)\,dx=F(x)+C$ ($C$는 ==적분상수==)

        - $\int x^n\,dx=\dfrac{x^{n+1}}{n+1}+C$ ($n\ne-1$)
        - $\int k\,dx=kx+C$
        - $\int\{f\pm g\}dx=\int f\,dx\pm\int g\,dx$, $\int kf\,dx=k\int f\,dx$

        ==지수를 1 올리고 그 지수로 나눔==. 마지막에 $+C$ 잊지 마세요!` },
      { id: 'c2', t: '조건이 주어진 문제', b: T`$F'(x)=f(x)$이고 $F(a)$ 같은 값이 주어지면
        1. 부정적분 $F(x)+C$를 구함
        2. 주어진 값을 대입해 $C$를 결정` },
    ],
    gens: [
      { id: 'integ', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const A = R.nz(-3, 3), B = R.int(-3, 3), c = R.int(-5, 5); const co = [3 * A, 2 * B, c];
        const F = iP(co); const wr = uniq([`${polyTex([...co, 0])}+C`, `${polyTex(dP(co))}+C`, `${polyTex(F)}`, `${polyTex([A, B, c, 0])}+C`], `${polyTex(F)}+C`);
        return { q: `$\\int(${polyTex(co)})\\,dx$는? ($C$는 적분상수)`, correct: `$${polyTex(F)}+C$`, wrong: wr.slice(0, 3).map((s) => `$${s}$`), why: `$\\int x^n dx=\\dfrac{x^{n+1}}{n+1}$ → 각 항을 적분: $${polyTex(F)}+C$` };
      } },
      { id: 'init', lv: [2, 5], card: 'c2', make: (R) => {
        const A = R.nz(-2, 3), B = R.int(-3, 3), c = R.int(-4, 4), d = R.int(-5, 5); const t = R.int(1, 3);
        const fp = [3 * A, 2 * B, c]; const F = [A, B, c, d]; const ans = ev(F, t);
        return { q: `$f'(x)=${polyTex(fp)}$이고 $f(0)=${d}$일 때 $f(${t})$의 값은?`, a: ans, wrong: W(ans, ev(F, -t), ev(fp, t), ans - d), why: `$f(x)=${polyTex(F.slice(0, 3).concat([0]))}+C$, $f(0)=${d}$ → $C=${d}$ → $f(${t})=${ans}$` };
      } },
      { id: 'rev', lv: [3, 5], card: 'c1', make: (R) => {
        const A = R.nz(-3, 3), B = R.int(-3, 3), c = R.int(-4, 4), d = R.int(-4, 4); const t = R.int(-2, 3);
        const F = [A, B, c, d]; const ans = ev(dP(F), t);
        return { q: `$f(x)$의 한 부정적분이 $F(x)=${polyTex(F)}$일 때 $f(${t})$의 값은?`, a: ans, wrong: W(ans, ev(F, t), ev(dP(dP(F)), t)), why: `$F'(x)=f(x)$이므로 $f(x)=${polyTex(dP(F))}$ → $f(${t})=${ans}$` };
      } },
    ],
  },
  {
    id: 'h3.def',
    lesson: [
      { id: 'c1', t: '정적분의 계산', b: T`$F'(x)=f(x)$일 때 $$\int_a^bf(x)\,dx=\left[F(x)\right]_a^b=F(b)-F(a)$$
        적분상수 $C$는 빼기에서 사라지므로 안 써도 돼요.
        예) $\int_1^3 2x\,dx=[x^2]_1^3=9-1=8$` },
      { id: 'c2', t: '정적분의 성질', b: T`- $\int_a^bf\,dx=-\int_b^af\,dx$, $\int_a^af\,dx=0$
        - $\int_a^bf\,dx+\int_b^cf\,dx=\int_a^cf\,dx$
        - ==대칭구간== $[-k,k]$: 홀수차항(원점대칭)은 $0$, 짝수차항은 $2\int_0^k$
        - $\int_a^b\{f\pm g\}dx=\int_a^bf\,dx\pm\int_a^bg\,dx$` },
    ],
    gens: [
      { id: 'basic', lv: [1, 4], card: 'c1', make: (R, lv) => {
        const A = R.nz(-2, 3), B = R.int(-3, 3), c = R.int(-4, 4); const co = [3 * A, 2 * B, c]; const F = iP(co);
        const p = lv < 3 ? 0 : R.int(-2, 1), t = p + R.int(1, 3); const ans = ev(F, t) - ev(F, p);
        return { q: `$\\int_{${p}}^{${t}}(${polyTex(co)})\\,dx$의 값은?`, a: ans, wrong: W(ans, ev(F, t), ev(co, t) - ev(co, p), ev(F, p) - ev(F, t)), why: `$F(x)=${polyTex(F)}$ → $F(${t})-F(${p})=${ev(F, t)}-${paren(ev(F, p))}=${ans}$` };
      } },
      { id: 'add', lv: [1, 3], card: 'c2', make: (R) => {
        const m = R.int(-6, 9), n = R.int(-6, 9), k = R.pick(['sum', 'rev', 'diff']);
        if (k === 'sum') return { q: `$\\int_0^2f(x)dx=${m}$, $\\int_2^5f(x)dx=${n}$일 때 $\\int_0^5f(x)dx$는?`, a: m + n, wrong: W(m + n, m - n, m * n), why: '구간을 이어 붙이면 값을 더함' };
        if (k === 'rev') return { q: `$\\int_0^3f(x)dx=${m}$일 때 $\\int_3^0f(x)dx$는?`, a: -m, wrong: W(-m, m, m + 1).filter((v) => v !== -m), why: '위끝과 아래끝을 바꾸면 부호가 반대' };
        return { q: `$\\int_1^4f(x)dx=${m}$, $\\int_1^4g(x)dx=${n}$일 때 $\\int_1^4\\{2f(x)-g(x)\\}dx$는?`, a: 2 * m - n, wrong: W(2 * m - n, m - n, 2 * m + n), why: `$2\\times${paren(m)}-${paren(n)}=${2 * m - n}$` };
      } },
      { id: 'sym', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.nz(-3, 3), B = R.nz(-2, 2), c = R.int(-3, 3), d = R.int(-3, 3), k = R.int(1, 3);
        const co = [a, 3 * B, c, d]; const ans = 2 * (B * k ** 3 + d * k);
        return { q: `$\\int_{-${k}}^{${k}}(${polyTex(co)})\\,dx$의 값은?`, a: ans, wrong: W(ans, ans / 2, 0), why: `홀수차항($x^3$, $x$)은 대칭구간에서 $0$. 짝수차항: $2\\int_0^{${k}}(${polyTex([3 * B, 0, d])})dx=2[${polyTex([B, 0, d, 0])}]_0^{${k}}=${ans}$` };
      } },
    ],
  },
  {
    id: 'h3.ar',
    lesson: [
      { id: 'c1', t: '곡선과 $x$축 사이의 넓이', b: T`$y=f(x)$[과/와] $x$축, $x=a$, $x=b$로 둘러싸인 넓이
        $$S=\int_a^b|f(x)|\,dx$$
        - $f\ge0$이면 그냥 $\int f$
        - $f<0$인 구간이 섞이면 ==구간을 나눠== 그 구간은 부호를 뒤집어 적분

        ==정적분 값은 음수가 될 수 있지만 넓이는 항상 양수==.` },
      { id: 'c2', t: '두 곡선 사이의 넓이', b: T`$S=\int_a^b\{(\text{위})-(\text{아래})\}\,dx$

        포물선과 직선(또는 포물선과 $x$축)이 $x=\alpha,\beta$에서 만날 때 $x^2$ 계수가 $a$이면
        $$S=\dfrac{|a|}{6}(\beta-\alpha)^3$$
        (6분의 1 공식! 시험에서 시간 절약)` },
    ],
    gens: [
      { id: 'int', lv: [1, 3], card: 'c1', make: (R) => {
        const A = R.int(1, 3), B = R.int(1, 3), c = R.int(1, 5); const co = [3 * A, 2 * B, c]; const F = iP(co); const t = R.int(1, 3);
        const ans = ev(F, t);
        return { q: `곡선 $y=${polyTex(co)}$[과/와] $x$축, 직선 $x=0$, $x=${t}$로 둘러싸인 부분의 넓이는?`, a: ans, wrong: W(ans, ev(co, t), ev(F, t) + 1), why: `구간에서 $y>0$이므로 $\\int_0^{${t}}(${polyTex(co)})dx=[${polyTex(F)}]_0^{${t}}=${ans}$` };
      } },
      { id: 'pq', lv: [2, 4], card: 'c2', make: (R) => {
        let a, d; do { a = R.nz(-6, 6); d = R.int(1, 5); } while ((Math.abs(a) * d ** 3) % 6);
        const p = R.int(-3, 2), q = p + d; const co = [a, -a * (p + q), a * p * q]; const ans = Math.abs(a) * d ** 3 / 6;
        return { q: `곡선 $y=${polyTex(co)}$[과/와] $x$축으로 둘러싸인 부분의 넓이는?`, a: ans, wrong: W(ans, ans * 6, ans * 2), why: `$y=${a === 1 ? '' : a === -1 ? '-' : a}${fac(p)}${fac(q)}$ → $x=${p},${q}$에서 만남. $S=\\dfrac{${Math.abs(a)}}6(${d})^3=${ans}$` };
      } },
      { id: 'line', lv: [3, 5], card: 'c2', make: (R) => {
        const p = R.int(-3, 1), d = R.int(1, 5), q = p + d; const num = d ** 3;
        const ans = fS(num, 6); const line = linTex(p + q, -p * q);
        return { q: `포물선 $y=x^2$과 직선 $y=${line}$[으로/로] 둘러싸인 부분의 넓이는?`, correct: `$${ans}$`, wrong: uniq([`$${fS(num, 3)}$`, `$${fS(num, 2)}$`, `$${num}$`, `$${fS(num, 12)}$`], `$${ans}$`).slice(0, 3), why: `$x^2=${line}$ → $${fac(p)}${fac(q)}=0$ → $x=${p},${q}$. $S=\\dfrac16(${q}-${paren(p)})^3=\\dfrac{${num}}{6}${ans === `\\dfrac{${num}}{6}` ? '' : `=${ans}`}$` };
      } },
      { id: 'neg', lv: [3, 5], card: 'c1', make: (R) => {
        let a, d; do { a = R.int(1, 6); d = R.int(2, 6); } while ((a * d ** 3) % 6);
        const co = [a, -a * d, 0]; const ans = -a * d ** 3 / 6;
        return { q: `$f(x)=${polyTex(co)}$일 때 정적분 $\\int_0^{${d}}f(x)\\,dx$의 값은? (곡선이 $x$축 아래에 있다)`, a: ans, wrong: W(ans, -ans, 0), why: `$0<x<${d}$에서 $f<0$이므로 정적분은 음수: $-\\dfrac{${a}}6\\times${d ** 3}=${ans}$ (넓이는 $${-ans}$)` };
      } },
    ],
  },
  {
    id: 'h3.dist',
    lesson: [
      { id: 'c1', t: '위치의 변화량과 움직인 거리', b: T`점 $P$의 속도 $v(t)$에 대하여 $t=a$에서 $t=b$까지
        - ==위치의 변화량(변위)== $=\int_a^bv(t)\,dt$
        - ==움직인 거리== $=\int_a^b|v(t)|\,dt$

        $v$의 부호가 바뀌면(방향 전환) 구간을 나눠서 절댓값 처리해요.` },
      { id: 'c2', t: '시각 $t$에서의 위치', b: T`$x(t)=x(0)+\int_0^tv(s)\,ds$

        가속도 $a(t)$가 주어지면 $v(t)=v(0)+\int_0^ta(s)\,ds$.` },
    ],
    gens: [
      { id: 'disp', lv: [1, 3], card: 'c1', make: (R) => {
        const a = 2 * R.int(1, 3), p = R.int(1, 4), T0 = p + R.int(1, 3); const ans = a * T0 * T0 / 2 - a * p * T0;
        return { q: `수직선 위를 움직이는 점 $P$의 시각 $t$에서의 속도가 $v(t)=${a}t-${a * p}$일 때, $t=0$에서 $t=${T0}$까지 위치의 변화량은?`, a: ans, wrong: W(ans, Math.abs(ans) + 2), why: `$\\int_0^{${T0}}(${a}t-${a * p})dt=[${a / 2 === 1 ? '' : a / 2}t^2-${a * p}t]_0^{${T0}}=${ans}$` };
      } },
      { id: 'dist', lv: [3, 5], card: 'c1', make: (R) => {
        const a = 2 * R.int(1, 3), p = R.int(1, 3), T0 = p + R.int(1, 3); const disp = a * T0 * T0 / 2 - a * p * T0; const ans = a * p * p / 2 + a * (T0 - p) ** 2 / 2;
        return { q: `점 $P$의 속도가 $v(t)=${a}t-${a * p}$일 때, $t=0$에서 $t=${T0}$까지 움직인 거리는?`, a: ans, wrong: W(ans, disp, Math.abs(disp)), why: `$t=${p}$에서 $v=0$이고 부호가 바뀜. $\\int_0^{${p}}|v|dt=${a * p * p / 2}$, $\\int_{${p}}^{${T0}}v\\,dt=${a * (T0 - p) ** 2 / 2}$ → 합 $${ans}$` };
      } },
      { id: 'pos', lv: [2, 4], card: 'c2', make: (R) => {
        const a = 2 * R.int(1, 3), p = R.int(1, 4), T0 = p + R.int(1, 3), x0 = R.int(-5, 5); const disp = a * T0 * T0 / 2 - a * p * T0; const ans = x0 + disp;
        return { q: `시각 $t=0$일 때 위치가 $${x0}$인 점 $P$의 속도가 $v(t)=${a}t-${a * p}$일 때, $t=${T0}$에서의 위치는?`, a: ans, wrong: W(ans, disp, x0), why: `$x(${T0})=x(0)+\\int_0^{${T0}}v\\,dt=${x0}+${paren(disp)}=${ans}$` };
      } },
      { id: 'acc', lv: [2, 5], card: 'c2', make: (R) => {
        const k = 2 * R.int(1, 3), v0 = R.int(-4, 4), t = R.int(1, 4); const ans = v0 * t + k * t * t / 2;
        return { q: `점 $P$의 가속도가 $a(t)=${k}$ (일정), $t=0$에서의 속도가 $${v0}$일 때, $t=0$에서 $t=${t}$까지 위치의 변화량은?`, a: ans, wrong: W(ans, v0 + k * t, k * t * t / 2), why: `$v(t)=${v0}+${k}t$ → $\\int_0^{${t}}(${v0}+${k}t)dt=${v0 * t}+${k * t * t / 2}=${ans}$` };
      } },
    ],
  },
];
