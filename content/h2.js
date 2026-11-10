// 수학Ⅰ: 지수함수와 로그함수 · 삼각함수 · 수열
import { gcd, fr, linTex, polyTex, paren, pm } from '../js/lib.js';

const T = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const uniq = (arr, not) => [...new Set(arr.map(String))].filter((x) => x !== String(not));
const fS = (n, d) => { const g = gcd(n, d) || 1; let a = n / g, b = d / g; if (b < 0) { a = -a; b = -b; } return b === 1 ? `${a}` : `\\dfrac{${a}}{${b}}`; };
const piF = (n, d) => { const g = gcd(n, d) || 1; const a = n / g, b = d / g; const num = a === 1 ? '\\pi' : `${a}\\pi`; return b === 1 ? num : `\\dfrac{${num}}{${b}}`; };
const lg = (b, x) => `\\log_{${b}}${x}`;

export default [
  // ───────────── 지수함수와 로그함수 ─────────────
  {
    id: 'h2.exp',
    lesson: [
      { id: 'c1', t: '거듭제곱근', b: T`$x^n=a$를 만족하는 $x$를 $a$의 ==$n$제곱근==이라 해요.
        - 실수 $a$의 $n$제곱근 중 실수인 것: $n$이 홀수면 $\sqrt[n]{a}$ 하나, $n$이 짝수면 $a>0$일 때 $\pm\sqrt[n]{a}$
        - $\sqrt[3]{27}=3$, $\sqrt[3]{-8}=-2$, $\sqrt[4]{16}=2$ (양수만!)
        - $\sqrt[n]{a}\sqrt[n]{b}=\sqrt[n]{ab}$, $(\sqrt[n]{a})^m=\sqrt[n]{a^m}$` },
      { id: 'c2', t: '지수의 확장과 지수법칙', b: T`$a>0$일 때 $a^{\frac mn}=\sqrt[n]{a^m}$, $a^0=1$, $a^{-n}=\dfrac1{a^n}$

        - $a^xa^y=a^{x+y}$
        - $a^x\div a^y=a^{x-y}$
        - $(a^x)^y=a^{xy}$
        - $(ab)^x=a^xb^x$

        예) $8^{\frac23}=(2^3)^{\frac23}=2^2=4$` },
    ],
    gens: [
      { id: 'root', lv: [1, 3], card: 'c1', make: (R) => {
        const n = R.pick([2, 3, 3, 4]); const b = R.int(2, n === 2 ? 9 : n === 3 ? 4 : 3); let a = b ** n; let sign = 1;
        if (n === 3 && R.chance(0.4)) { a = -a; sign = -1; }
        const ans = sign * b;
        return { q: `$\\sqrt[${n}]{${a}}$의 값은? (실수 범위)`.replace('$\\sqrt[2]', '$\\sqrt'), a: ans, wrong: [-ans, b + 1, a / n | 0].filter((v) => v !== ans), why: `$${ans}^{${n}}=${a}$ 이므로 ${n === 2 ? `$\\sqrt{${a}}=${ans}$` : `$\\sqrt[${n}]{${a}}=${ans}$`}` };
      } },
      { id: 'frac', lv: [2, 4], card: 'c2', make: (R) => {
        const b = R.int(2, 4), n = R.pick([2, 3]); let m; do { m = R.int(1, 4); } while (m === n || m % n === 0); const a = b ** n;
        return { q: `$${a}^{\\frac{${m}}{${n}}}$의 값은?`, a: b ** m, wrong: [a * m, b * m, b ** m + 1].filter((v) => v !== b ** m), why: `$${a}=${b}^{${n}}$ → $(${b}^{${n}})^{\\frac{${m}}{${n}}}=${b}^{${m}}=${b ** m}$` };
      } },
      { id: 'law', lv: [1, 5], card: 'c2', make: (R) => {
        const a = R.pick([2, 3, 5]); const x = R.int(2, 6), y = R.int(1, 5); const k = R.pick(['mul', 'div', 'pow']);
        if (k === 'mul') return { q: `$${a}^{${x}}\\times${a}^{${y}}=${a}^k$일 때 $k$의 값은?`, a: x + y, wrong: [x * y, x - y, x + y + 1].filter((v) => v !== x + y), why: '지수법칙 $a^xa^y=a^{x+y}$' };
        if (k === 'div') return { q: `$${a}^{${x + y}}\\div${a}^{${y}}=${a}^k$일 때 $k$의 값은?`, a: x, wrong: [x + 2 * y, (x + y) * y, x + y].filter((v) => v !== x), why: '지수법칙 $a^x\\div a^y=a^{x-y}$' };
        return { q: `$(${a}^{${x}})^{${y}}=${a}^k$일 때 $k$의 값은?`, a: x * y, wrong: [x + y, x ** y, x * y + 1].filter((v) => v !== x * y), why: '지수법칙 $(a^x)^y=a^{xy}$' };
      } },
      { id: 'neg', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.pick([2, 3, 4, 5]), n = R.int(1, 3);
        return { q: `$${a}^{-${n}}$의 값은?`, correct: `$${fS(1, a ** n)}$`, wrong: [`$-${a * n}$`, `$-${fS(1, a ** n)}$`, `$${a ** n}$`], why: `$a^{-n}=\\dfrac1{a^n}$ → $\\dfrac1{${a ** n}}$` };
      } },
    ],
  },
  {
    id: 'h2.log',
    lesson: [
      { id: 'c1', t: '로그의 뜻', b: T`$a^x=N\iff x=\log_aN$ ($a>0,\ a\ne1,\ N>0$)

        - $\log_28=3$ (2를 몇 제곱하면 8?)
        - $\log_a1=0$, $\log_aa=1$
        - 진수 $N>0$, 밑 $a>0,a\ne1$ 조건 필수!` },
      { id: 'c2', t: '로그의 성질', b: T`- $\log_a(MN)=\log_aM+\log_aN$
        - $\log_a\dfrac MN=\log_aM-\log_aN$
        - $\log_aM^k=k\log_aM$
        - **밑 변환**: $\log_ab=\dfrac{\log_cb}{\log_ca}$
        - $\log_{a^m}b^n=\dfrac nm\log_ab$, $a^{\log_ab}=b$` },
    ],
    gens: [
      { id: 'val', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.pick([2, 3, 5, 10]), n = R.int(1, 4); const N = a ** n;
        return { q: `$${lg(a, N)}$의 값은?`, a: n, wrong: [N, a * n, n + 1].filter((v) => v !== n), why: `$${a}^{${n}}=${N}$이므로 $${lg(a, N)}=${n}$` };
      } },
      { id: 'frac', lv: [2, 4], card: 'c1', make: (R) => {
        const a = R.pick([2, 3, 5]), n = R.int(1, 3);
        return { q: `$\\log_{${a}}\\dfrac1{${a ** n}}$의 값은?`, a: -n, wrong: [n, a ** n, -a * n].filter((v) => v !== -n), why: `$${a}^{-${n}}=\\dfrac1{${a ** n}}$이므로 $-${n}$` };
      } },
      { id: 'sum', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.pick([2, 3, 5]), p = R.int(1, 3), q = R.int(1, 3); const sign = R.pick(['+', '-']);
        const x = a ** p, y = a ** q;
        if (sign === '+') return { q: `$${lg(a, x)}+${lg(a, y)}$의 값은?`, a: p + q, wrong: [p * q, x * y, p + q + 1].filter((v) => v !== p + q), why: `$${lg(a, x)}=${p}$, $${lg(a, y)}=${q}$ → $${p + q}$ (또는 $\\log_a(${x}\\times${y})$)` };
        return { q: `$${lg(a, x * a ** (q + 1))}-${lg(a, a ** q)}$의 값은?`.replace(/./g, (c) => c), a: p + 1, wrong: [p, q, p + q + 1].filter((v) => v !== p + 1), why: `$${lg(a, x * a ** (q + 1))}=${p + q + 1}$, $${lg(a, a ** q)}=${q}$ → $${p + 1}$` };
      } },
      { id: 'base', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.pick([2, 3]), m = R.int(2, 3), n = R.int(1, 4);
        return { q: `$\\log_{${a ** m}}${a ** (m * n)}$의 값은?`, a: n, wrong: [m * n, m, n + 1].filter((v) => v !== n), why: `$\\log_{${a}^{${m}}}${a}^{${m * n}}=\\dfrac{${m * n}}{${m}}\\log_${a}${a}=${n}$` };
      } },
    ],
  },
  {
    id: 'h2.ef',
    lesson: [
      { id: 'c1', t: '지수함수 y = aˣ', b: T`$a>0,\ a\ne1$

        - 정의역: 실수 전체 / 치역: $y>0$
        - $(0,1)$ 지남 (y절편 1), 점근선: $x$축 ($y=0$)
        - $a>1$: 증가함수 / $0<a<1$: 감소함수
        - $y=a^x$와 $y=\left(\dfrac1a\right)^x$는 $y$축 대칭` },
      { id: 'c2', t: '평행이동·대소 비교', b: T`$y=a^{x-p}+q$: $x$축으로 $p$, $y$축으로 $q$ 평행이동 → 점근선 $y=q$

        대소 비교: 밑이 1보다 크면 지수가 클수록 크고, 밑이 0과 1 사이면 지수가 클수록 작아요.
        $2^{1.5}<2^2$, $\left(\dfrac12\right)^{1.5}>\left(\dfrac12\right)^2$` },
    ],
    gens: [
      { id: 'val', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.pick([2, 3, 4]), x = R.int(-2, 4);
        return { q: `$f(x)=${a}^x$일 때 $f(${x})$의 값은?`, correct: x >= 0 ? `$${a ** x}$` : `$${fS(1, a ** -x)}$`, wrong: uniq([x >= 0 ? a * x : `-${a * -x}`, x >= 0 ? `-${a ** x}` : a ** -x, x >= 0 ? a ** x + 1 : `-${fS(1, a ** -x)}`], x >= 0 ? a ** x : fS(1, a ** -x)).map((s) => `$${s}$`), why: x >= 0 ? `$${a}^{${x}}=${a ** x}$` : `$${a}^{${x}}=\\dfrac1{${a}^{${-x}}}=\\dfrac1{${a ** -x}}$` };
      } },
      { id: 'asym', lv: [2, 4], card: 'c2', make: (R) => {
        const a = R.pick([2, 3]), p = R.nz(-3, 3), q = R.nz(-4, 4);
        return { q: `$y=${a}^{x${pm(-p)}}${pm(q)}$의 점근선의 방정식은?`, correct: `$y=${q}$`, wrong: [`$y=${-q}$`, `$x=${p}$`, `$y=${p}$`], why: `$y=a^{x-p}+q$의 점근선은 $y=q$ → $y=${q}$` };
      } },
      { id: 'cmp', lv: [2, 5], card: 'c2', make: (R) => {
        const dec = R.chance(0.5); const a = dec ? '\\dfrac12' : '2'; const x = R.int(-3, 3), y = R.int(x + 1, x + 3);
        const bigger = dec ? x : y; // 더 큰 값을 갖는 지수
        const B = dec ? '\\left(\\dfrac12\\right)' : '2';
        return { q: `$${B}^{${x}}$[과/와] $${B}^{${y}}$ 중 더 큰 것은?`, correct: `$${dec ? `\\left(\\dfrac12\\right)^{${bigger}}` : `2^{${bigger}}`}$`, wrong: [`$${dec ? `\\left(\\dfrac12\\right)^{${bigger === x ? y : x}}` : `2^{${bigger === x ? y : x}}`}$`, '같다'], why: dec ? '밑이 $0$과 $1$ 사이라서 지수가 작을수록 값이 커요.' : '밑이 $1$보다 커서 지수가 클수록 값이 커요.' };
      } },
      { id: 'pass', lv: [3, 5], card: 'c1', make: (R) => {
        const a = R.pick([2, 3, 4]), k = R.int(1, 3);
        return { q: `$y=${a}^x$의 그래프가 점 $(${k},\\ m)$을 지날 때 $m$의 값은?`, a: a ** k, wrong: [a * k, k ** a, a ** k + 1].filter((v) => v !== a ** k), why: `$x=${k}$ 대입: $${a}^{${k}}=${a ** k}$` };
      } },
    ],
  },
  {
    id: 'h2.lf',
    lesson: [
      { id: 'c1', t: '로그함수 y = logₐx', b: T`$y=a^x$의 **역함수**예요. $y=x$에 대칭.

        - 정의역: $x>0$ / 치역: 실수 전체
        - $(1,0)$ 지남, 점근선: $y$축 ($x=0$)
        - $a>1$: 증가 / $0<a<1$: 감소` },
      { id: 'c2', t: '평행이동·정의역', b: T`$y=\log_a(x-p)+q$: 점근선 $x=p$, 정의역 $x>p$

        진수 조건: **진수 > 0**. $y=\log_2(x-3)$의 정의역은 $x>3$.` },
    ],
    gens: [
      { id: 'dom', lv: [1, 4], card: 'c2', make: (R) => {
        const a = R.pick([2, 3, 5]), p = R.nz(-4, 4);
        return { q: `$y=\\log_{${a}}(x${pm(-p)})$의 정의역은?`, correct: `$x>${p}$`, wrong: [`$x\\ge${p}$`, `$x>${-p}$`, `$x<${p}$`], why: `진수 $x${pm(-p)}>0$ → $x>${p}$` };
      } },
      { id: 'asym', lv: [2, 4], card: 'c2', make: (R) => {
        const a = R.pick([2, 3]), p = R.nz(-3, 3), q = R.nz(-3, 3);
        return { q: `$y=\\log_{${a}}(x${pm(-p)})${pm(q)}$의 점근선의 방정식은?`, correct: `$x=${p}$`, wrong: [`$x=${-p}$`, `$y=${q}$`, `$y=${p}$`], why: `$y=\\log_a(x-p)+q$의 점근선은 $x=p$` };
      } },
      { id: 'val', lv: [1, 4], card: 'c1', make: (R) => {
        const a = R.pick([2, 3, 5]), k = R.int(1, 3);
        return { q: `$f(x)=\\log_{${a}}x$일 때 $f(${a ** k})$의 값은?`, a: k, wrong: [a ** k, a * k, k + 1].filter((v) => v !== k), why: `$\\log_{${a}}${a ** k}=${k}$` };
      } },
      { id: 'cmp', lv: [3, 5], card: 'c1', make: (R) => {
        const a = R.pick([2, 3]); const dec = R.chance(0.4); const x = R.int(2, 6), y = x + R.int(1, 4);
        const base = dec ? '\\dfrac12' : `${a}`;
        const bigger = dec ? x : y;
        return { q: `$\\log_{${base}}${x}$와 $\\log_{${base}}${y}$ 중 더 큰 것은?`, correct: `$\\log_{${base}}${bigger}$`, wrong: [`$\\log_{${base}}${bigger === x ? y : x}$`, '같다'], why: dec ? '밑이 $0$과 $1$ 사이면 감소함수 → 진수가 작을수록 커요.' : '밑이 $1$보다 크면 증가함수 → 진수가 클수록 커요.' };
      } },
    ],
  },
  {
    id: 'h2.eq',
    lesson: [
      { id: 'c1', t: '지수방정식·부등식', b: T`- **밑을 같게** 만든 뒤 지수를 비교: $a^{f(x)}=a^{g(x)}\Rightarrow f(x)=g(x)$
        - $a>1$: $a^{f}>a^{g}\iff f>g$ (부등호 방향 유지)
        - $0<a<1$: $a^{f}>a^{g}\iff f<g$ (**부등호 방향 반대**)
        - $a^x=t$로 치환하면 이차방정식이 돼요 ($t>0$ 주의)` },
      { id: 'c2', t: '로그방정식·부등식', b: T`- 진수 조건 ($>0$) **먼저** 확인!
        - $\log_af(x)=\log_ag(x)\Rightarrow f(x)=g(x)$
        - $\log_ax=k\Rightarrow x=a^k$
        - $a>1$: $\log_af>\log_ag\iff f>g$ / $0<a<1$이면 부등호 방향 반대` },
    ],
    gens: [
      { id: 'exp', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.pick([2, 3, 5]), n = R.int(2, 4), c = R.int(-3, 3);
        // a^{x+c} = a^n
        return { q: `$${a}^{x${pm(c)}}=${a ** n}$의 해는?`.replace('x+0', 'x'), a: n - c, wrong: [n + c, n, a ** n - c].filter((v) => v !== n - c), why: `$${a ** n}=${a}^{${n}}$ → ${c === 0 ? '$x' : `$x${pm(c)}`}=${n}$ → $x=${n - c}$` };
      } },
      { id: 'sub', lv: [3, 5], card: 'c1', make: (R) => {
        const a = R.pick([2, 3]); const p = R.int(0, 2), q = R.int(p + 1, 3);
        // t² -(a^p + a^q) t + a^(p+q)=0 → t=a^p, a^q → x=p,q
        const s = a ** p + a ** q, pr = a ** (p + q);
        return { q: `$${a}^{2x}-${s}\\cdot${a}^x+${pr}=0$의 두 근의 합은?`, a: p + q, wrong: [pr, s, p * q].filter((v) => v !== p + q), why: `$${a}^x=t$ → $t^2-${s}t+${pr}=(t-${a ** p})(t-${a ** q})=0$ → $x=${p}$ 또는 $x=${q}$ → 합 $${p + q}$` };
      } },
      { id: 'log', lv: [2, 4], card: 'c2', make: (R) => {
        const a = R.pick([2, 3, 5]), k = R.int(1, 3);
        return { q: `$\\log_{${a}}x=${k}$의 해는?`, a: a ** k, wrong: [a * k, k ** a, a + k].filter((v) => v !== a ** k), why: `$x=${a}^{${k}}=${a ** k}$` };
      } },
      { id: 'logsum', lv: [3, 5], card: 'c2', make: (R) => {
        // log2 x + log2 (x-d) = n → x(x-d)=2^n
        const pr = R.pick([[4, 2, 8], [3, 1, 6], [6, 2, 12], [5, 1, 20]]); // [x, d, product] with 2^? not power. use base-independent: product = 2^n
        const cases = [[4, 2, 3], [8, 4, 5], [2, 1, 1]]; const [x, d, n] = R.pick(cases);
        return { q: `$\\log_2x+\\log_2(x-${d})=${n}$의 해는? (진수 조건 확인)`, a: x, wrong: [-(x - d), x - d, x + d].filter((v) => v !== x), why: `진수 조건 $x>${d}$. $\\log_2x(x-${d})=${n}$ → $x(x-${d})=${2 ** n}$ → $${polyTex([1, -d, -(2 ** n)])}=0$ → $x=${x}$ ($x>${d}$이므로)` };
      } },
      { id: 'ineq', lv: [2, 5], card: 'c1', make: (R) => {
        const dec = R.chance(0.4); const n = R.int(1, 4);
        if (!dec) return { q: `$2^x>${2 ** n}$의 해는?`, correct: `$x>${n}$`, wrong: [`$x<${n}$`, `$x>${2 ** n}$`, `$x\\ge${n}$`], why: `밑 $2>1$ → 부등호 방향 유지: $x>${n}$` };
        return { q: `$\\left(\\dfrac12\\right)^x>\\dfrac1{${2 ** n}}$의 해는?`, correct: `$x<${n}$`, wrong: [`$x>${n}$`, `$x<${2 ** n}$`, `$x\\le${n}$`], why: `$\\dfrac1{${2 ** n}}=\\left(\\dfrac12\\right)^{${n}}$ → 밑이 $0<\\dfrac12<1$이라 부등호 방향 반대: $x<${n}$` };
      } },
    ],
  },

  // ───────────── 삼각함수 ─────────────
  {
    id: 'h2.rad',
    lesson: [
      { id: 'c1', t: '호도법', b: T`$180°=\pi$ (라디안). 반지름과 같은 길이의 호에 대한 중심각이 $1$라디안.

        - 라디안 → 도: $\theta\ \text{rad}=\theta\times\dfrac{180°}{\pi}$
        - 도 → 라디안: $\theta°=\theta\times\dfrac{\pi}{180}$
        - $30°=\dfrac\pi6,\ 45°=\dfrac\pi4,\ 60°=\dfrac\pi3,\ 90°=\dfrac\pi2,\ 180°=\pi,\ 360°=2\pi$` },
      { id: 'c2', t: '부채꼴의 호와 넓이', b: T`반지름 $r$, 중심각 $\theta$ (라디안)
        - 호의 길이 $l=r\theta$
        - 넓이 $S=\dfrac12r^2\theta=\dfrac12rl$` },
    ],
    gens: [
      { id: 'conv', lv: [1, 3], card: 'c1', make: (R) => {
        const d = R.pick([30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 330, 360]);
        if (R.chance(0.5)) return { q: `$${d}°$를 호도법으로 나타내면?`, correct: `$${piF(d, 180)}$`, wrong: uniq([piF(d, 90), piF(d * 2, 180 * 3) === piF(d, 180) ? piF(d, 360) : piF(d * 2, 180 * 3), piF(180, d), piF(d, 360)], piF(d, 180)).slice(0, 3).map((s) => `$${s}$`), why: `$${d}\\times\\dfrac{\\pi}{180}=${piF(d, 180)}$` };
        return { q: `$${piF(d, 180)}$ 라디안을 도로 나타내면?`, a: d, unit: '°', wrong: [Math.round(d / 2), d * 2, d + 30].filter((v) => v !== d), why: `$\\pi=180°$를 곱해요: $${d}°$` };
      } },
      { id: 'arc', lv: [2, 5], card: 'c2', make: (R) => {
        const r = R.int(2, 10), k = R.pick([[1, 6], [1, 4], [1, 3], [1, 2], [2, 3]]);
        const ask = R.pick(['l', 'S']);
        const th = `${piF(k[0], k[1])}`; const rr = R.pick([6, 12, 4, 8]);
        const l = (rr * k[0] * 1) / k[1]; // coefficient of π
        if (ask === 'l') return { q: `반지름이 $${rr}$, 중심각이 $${th}$인 부채꼴의 호의 길이는?`, correct: `$${piF(rr * k[0], k[1])}$`, wrong: uniq([piF(rr * k[0], k[1] * 2), piF(rr * rr * k[0], k[1] * 2), piF(rr * k[0] * 2, k[1])], piF(rr * k[0], k[1])).map((s) => `$${s}$`), why: `$l=r\\theta=${rr}\\times${th}=${piF(rr * k[0], k[1])}$` };
        return { q: `반지름이 $${rr}$, 중심각이 $${th}$인 부채꼴의 넓이는?`, correct: `$${piF(rr * rr * k[0], 2 * k[1])}$`, wrong: uniq([piF(rr * k[0], k[1]), piF(rr * rr * k[0], k[1]), piF(rr * rr * k[0], 4 * k[1])], piF(rr * rr * k[0], 2 * k[1])).map((s) => `$${s}$`), why: `$S=\\dfrac12r^2\\theta=\\dfrac12\\times${rr * rr}\\times${th}=${piF(rr * rr * k[0], 2 * k[1])}$` };
      } },
    ],
  },
  {
    id: 'h2.tf',
    lesson: [
      { id: 'c1', t: '삼각함수의 정의', b: T`동경 $OP$, $P(x,y)$, $r=\sqrt{x^2+y^2}$, 일반각 $\theta$에 대해
        $$\sin\theta=\dfrac yr,\quad\cos\theta=\dfrac xr,\quad\tan\theta=\dfrac yx\ (x\ne0)$$
        단위원 ($r=1$): $P=(\cos\theta,\ \sin\theta)$` },
      { id: 'c2', t: '사분면별 부호', b: T`| 사분면 | 1 | 2 | 3 | 4 |
        |---|---|---|---|---|
        | $\sin$ | + | + | − | − |
        | $\cos$ | + | − | − | + |
        | $\tan$ | + | − | + | − |

        기억법: **All, Sin, Tan, Cos** (1→2→3→4사분면에서 +인 것)` },
    ],
    gens: [
      { id: 'def', lv: [1, 4], card: 'c1', make: (R) => {
        const [a, b, c] = R.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17]]); const sx = R.pick([1, -1]), sy = R.pick([1, -1]); const x = a * sx, y = b * sy;
        const f = R.pick(['sin', 'cos', 'tan']); const num = { sin: y, cos: x, tan: y }[f], den = { sin: c, cos: c, tan: x }[f];
        return { q: `동경 위의 점 $P(${x},\\ ${y})$에 대하여 $\\${f}\\theta$의 값은?`, correct: `$${fS(num, den)}$`, wrong: uniq([fS(-num, den), fS(den, num), fS(num, -den)], fS(num, den)).map((s) => `$${s}$`), why: `$r=\\sqrt{${x * x}+${y * y}}=${c}$ → $\\${f}\\theta=${f === 'tan' ? '\\dfrac yx' : f === 'sin' ? '\\dfrac yr' : '\\dfrac xr'}=${fS(num, den)}$` };
      } },
      { id: 'sign', lv: [2, 5], card: 'c2', make: (R) => {
        const q = R.int(1, 4); const s = { 1: ['+', '+', '+'], 2: ['+', '-', '-'], 3: ['-', '-', '+'], 4: ['-', '+', '-'] }[q];
        const f = R.int(0, 2); const nm = ['\\sin\\theta', '\\cos\\theta', '\\tan\\theta'];
        const sg = s[f] === '+' ? '양수' : '음수';
        return { q: `$\\theta$가 제${q}사분면의 각일 때 $${nm[f]}$의 부호는?`, correct: sg, wrong: [sg === '양수' ? '음수' : '양수', '0'], why: `제${q}사분면: $\\sin$ ${s[0]}, $\\cos$ ${s[1]}, $\\tan$ ${s[2]}` };
      } },
      { id: 'special', lv: [2, 5], card: 'c1', make: (R) => {
        const items = [['\\sin\\dfrac\\pi6', '\\dfrac12'], ['\\cos\\dfrac\\pi3', '\\dfrac12'], ['\\tan\\dfrac\\pi4', '1'], ['\\sin\\dfrac\\pi2', '1'], ['\\cos\\pi', '-1'], ['\\sin\\dfrac{3\\pi}2', '-1'], ['\\cos\\dfrac\\pi2', '0'], ['\\sin\\pi', '0'], ['\\tan\\dfrac\\pi3', '\\sqrt3'], ['\\sin\\dfrac\\pi3', '\\dfrac{\\sqrt3}2']];
        const it = R.pick(items); const pool = ['\\dfrac12', '1', '-1', '0', '\\sqrt3', '\\dfrac{\\sqrt3}2'];
        return { q: `$${it[0]}$의 값은?`, correct: `$${it[1]}$`, wrong: R.sample(pool.filter((p) => p !== it[1]), 3).map((s) => `$${s}$`), why: `특수각의 삼각함수 값: $${it[0]}=${it[1]}$` };
      } },
    ],
  },
  {
    id: 'h2.ti',
    lesson: [
      { id: 'c1', t: '기본 항등식', b: T`$$\sin^2\theta+\cos^2\theta=1,\qquad \tan\theta=\dfrac{\sin\theta}{\cos\theta}$$
        $\sin\theta$ 값이 주어지면 $\cos^2\theta=1-\sin^2\theta$로 $\cos\theta$를 구해요. **부호는 사분면으로!**` },
      { id: 'c2', t: '각의 변환 공식', b: T`- $\sin(-\theta)=-\sin\theta$, $\cos(-\theta)=\cos\theta$
        - $\sin(\pi-\theta)=\sin\theta$, $\cos(\pi-\theta)=-\cos\theta$
        - $\sin(\pi+\theta)=-\sin\theta$, $\cos(\pi+\theta)=-\cos\theta$
        - $\sin\left(\dfrac\pi2-\theta\right)=\cos\theta$, $\cos\left(\dfrac\pi2-\theta\right)=\sin\theta$` },
    ],
    gens: [
      { id: 'cos', lv: [1, 4], card: 'c1', make: (R) => {
        const [a, b, c] = R.pick([[3, 4, 5], [5, 12, 13], [8, 15, 17]]);
        const quad = R.pick([1, 2]);
        return { q: `$\\theta$가 제${quad}사분면의 각이고 $\\sin\\theta=${fS(a, c)}$일 때 $\\cos\\theta$의 값은?`, correct: `$${fS(quad === 1 ? b : -b, c)}$`, wrong: uniq([fS(quad === 1 ? -b : b, c), fS(a, b), fS(c, b)], fS(quad === 1 ? b : -b, c)).map((s) => `$${s}$`), why: `$\\cos^2\\theta=1-\\left(${fS(a, c)}\\right)^2=${fS(b * b, c * c)}$ → $\\cos\\theta=\\pm${fS(b, c)}$. 제${quad}사분면에서 $\\cos$는 ${quad === 1 ? '양수' : '음수'}` };
      } },
      { id: 'tan', lv: [2, 5], card: 'c1', make: (R) => {
        const [a, b, c] = R.pick([[3, 4, 5], [5, 12, 13]]);
        return { q: `$\\theta$가 제1사분면의 각이고 $\\sin\\theta=${fS(a, c)}$일 때 $\\tan\\theta$의 값은?`, correct: `$${fS(a, b)}$`, wrong: [`$${fS(b, a)}$`, `$${fS(a, c)}$`, `$${fS(b, c)}$`], why: `$\\cos\\theta=${fS(b, c)}$ → $\\tan\\theta=\\dfrac{\\sin\\theta}{\\cos\\theta}=${fS(a, b)}$` };
      } },
      { id: 'conv', lv: [2, 5], card: 'c2', make: (R) => {
        const items = [['\\sin(\\pi-\\theta)', '\\sin\\theta', ['-\\sin\\theta', '\\cos\\theta', '-\\cos\\theta']], ['\\cos(\\pi-\\theta)', '-\\cos\\theta', ['\\cos\\theta', '\\sin\\theta', '-\\sin\\theta']], ['\\sin(\\pi+\\theta)', '-\\sin\\theta', ['\\sin\\theta', '\\cos\\theta', '-\\cos\\theta']], ['\\sin\\left(\\dfrac\\pi2-\\theta\\right)', '\\cos\\theta', ['\\sin\\theta', '-\\cos\\theta', '-\\sin\\theta']], ['\\cos(-\\theta)', '\\cos\\theta', ['-\\cos\\theta', '\\sin\\theta', '-\\sin\\theta']], ['\\sin(-\\theta)', '-\\sin\\theta', ['\\sin\\theta', '\\cos\\theta', '-\\cos\\theta']]];
        const it = R.pick(items);
        return { q: `$${it[0]}$[와/과] 같은 것은?`.replace('[와/과]', '[과/와]'), correct: `$${it[1]}$`, wrong: it[2].map((s) => `$${s}$`), why: `각의 변환 공식: $${it[0]}=${it[1]}$` };
      } },
      { id: 'sum', lv: [3, 5], card: 'c1', make: (R) => {
        const k = R.int(2, 9);
        return { q: `$\\sin^2\\theta+\\cos^2\\theta+${k}$의 값은?`, a: k + 1, wrong: [k, k + 2, k - 1], why: `$\\sin^2\\theta+\\cos^2\\theta=1$이므로 $1+${k}=${k + 1}$` };
      } },
    ],
  },
  {
    id: 'h2.tg',
    lesson: [
      { id: 'c1', t: '삼각함수의 그래프', b: T`- $y=\sin x$: 주기 $2\pi$, 치역 $[-1,1]$, 원점 대칭
        - $y=\cos x$: 주기 $2\pi$, 치역 $[-1,1]$, $y$축 대칭
        - $y=\tan x$: 주기 $\pi$, 치역 실수 전체, 점근선 $x=\dfrac\pi2+n\pi$` },
      { id: 'c2', t: 'y = a sin(bx + c) + d', b: T`- 최댓값 $|a|+d$, 최솟값 $-|a|+d$
        - 주기 $\dfrac{2\pi}{|b|}$ ($\tan$이면 $\dfrac\pi{|b|}$)
        - $x$축 방향 평행이동 $-\dfrac cb$, $y$축 방향 $d$` },
    ],
    gens: [
      { id: 'period', lv: [1, 4], card: 'c2', make: (R) => {
        const b = R.pick([2, 3, 4, 6]); const f = R.pick(['sin', 'cos', 'tan']);
        const cor = f === 'tan' ? piF(1, b) : piF(2, b);
        return { q: `$y=\\${f}\\,${b}x$의 주기는?`, correct: `$${cor}$`, wrong: uniq([piF(2 * b, 1), piF(1, b), piF(2, b), '2\\pi', '\\pi'].filter((s) => s !== cor), cor).slice(0, 3).map((s) => `$${s}$`), why: `${f === 'tan' ? '$\\pi$' : '$2\\pi$'}를 $|b|=${b}$로 나눠요 → $${cor}$` };
      } },
      { id: 'range', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.nz(-4, 4), d = R.int(-3, 3); const f = R.pick(['sin', 'cos']);
        const mx = Math.abs(a) + d, mn = -Math.abs(a) + d; const ask = R.pick(['max', 'min']);
        return { q: `$y=${a === 1 ? '' : a === -1 ? '-' : a}\\${f}\\,x${d === 0 ? '' : pm(d)}$의 ${ask === 'max' ? '최댓값' : '최솟값'}은?`, a: ask === 'max' ? mx : mn, wrong: [ask === 'max' ? mn : mx, a + d, Math.abs(a)].filter((v) => v !== (ask === 'max' ? mx : mn)), why: `$-1\\le\\${f}\\,x\\le1$ → $y$는 $${mn}$ 이상 $${mx}$ 이하` };
      } },
      { id: 'prop', lv: [1, 3], card: 'c1', make: (R) => {
        const items = [['$y=\\sin x$의 그래프의 대칭성은?', '원점에 대하여 대칭', ['$y$축에 대하여 대칭', '$x$축에 대하여 대칭', '직선 $y=x$에 대하여 대칭']], ['$y=\\cos x$의 그래프의 대칭성은?', '$y$축에 대하여 대칭', ['원점에 대하여 대칭', '$x$축에 대하여 대칭', '직선 $y=x$에 대하여 대칭']], ['$y=\\tan x$의 주기는?', '$\\pi$', ['$2\\pi$', '$\\dfrac\\pi2$', '$4\\pi$']]];
        const it = R.pick(items); return { q: it[0], correct: it[1], wrong: it[2], why: '삼각함수 그래프의 기본 성질이에요.' };
      } },
    ],
  },
  {
    id: 'h2.te',
    lesson: [
      { id: 'c1', t: '삼각함수의 방정식', b: T`단위원/그래프를 이용해 구해요. ($0\le x<2\pi$)

        $\sin x=\dfrac12$: 기준각 $\dfrac\pi6$, $\sin$이 +인 1·2사분면 → $x=\dfrac\pi6,\ \dfrac{5\pi}6$
        $\cos x=-\dfrac12$: $\cos$이 −인 2·3사분면 → $x=\dfrac{2\pi}3,\ \dfrac{4\pi}3$` },
      { id: 'c2', t: '삼각함수의 부등식', b: T`그래프에서 $y=\sin x$가 직선 $y=k$보다 위에 있는 구간을 찾아요.

        $\sin x>\dfrac12$ ($0\le x<2\pi$) → $\dfrac\pi6<x<\dfrac{5\pi}6$

        이차식 꼴이면 $\sin x=t$ 치환 ($-1\le t\le1$ 주의).` },
    ],
    gens: [
      { id: 'cnt', lv: [1, 4], card: 'c1', make: (R) => {
        const f = R.pick(['sin', 'cos']); const v = R.pick([['\\dfrac12', 2], ['-\\dfrac12', 2], ['0', 2], ['1', 1], ['-1', 1], ['2', 0]]);
        return { q: `$0\\le x<2\\pi$에서 방정식 $\\${f}\\,x=${v[0]}$의 해의 개수는?`, a: v[1], unit: '개', wrong: [0, 1, 2, 3, 4].filter((n) => n !== v[1]).slice(0, 3), why: `그래프에서 $y=\\${f}\\,x$와 직선 $y=${v[0]}$의 교점의 개수예요. ${v[0] === '2' ? '치역이 $[-1,1]$이라 교점이 없어요.' : ''}` };
      } },
      { id: 'sol', lv: [2, 5], card: 'c1', make: (R) => {
        const items = [['\\sin x=\\dfrac12', '\\dfrac\\pi6,\\ \\dfrac{5\\pi}6', ['\\dfrac\\pi3,\\ \\dfrac{2\\pi}3', '\\dfrac\\pi6,\\ \\dfrac{7\\pi}6', '\\dfrac\\pi4,\\ \\dfrac{3\\pi}4']], ['\\cos x=\\dfrac12', '\\dfrac\\pi3,\\ \\dfrac{5\\pi}3', ['\\dfrac\\pi6,\\ \\dfrac{11\\pi}6', '\\dfrac\\pi3,\\ \\dfrac{2\\pi}3', '\\dfrac{2\\pi}3,\\ \\dfrac{4\\pi}3']], ['\\sin x=\\dfrac{\\sqrt3}2', '\\dfrac\\pi3,\\ \\dfrac{2\\pi}3', ['\\dfrac\\pi6,\\ \\dfrac{5\\pi}6', '\\dfrac\\pi3,\\ \\dfrac{5\\pi}3', '\\dfrac{4\\pi}3,\\ \\dfrac{5\\pi}3']], ['\\tan x=1', '\\dfrac\\pi4,\\ \\dfrac{5\\pi}4', ['\\dfrac\\pi4,\\ \\dfrac{3\\pi}4', '\\dfrac\\pi3,\\ \\dfrac{4\\pi}3', '\\dfrac{3\\pi}4,\\ \\dfrac{7\\pi}4']]];
        const it = R.pick(items); return { q: `$0\\le x<2\\pi$에서 $${it[0]}$의 해는?`, correct: `$x=${it[1]}$`, wrong: it[2].map((s) => `$x=${s}$`), why: `기준각과 부호를 이용해 단위원에서 찾아요. ($\\sin$은 1·2사분면, $\\cos$은 1·4사분면, $\\tan$은 1·3사분면에서 +)` };
      } },
      { id: 'ineq', lv: [3, 5], card: 'c2', make: (R) => {
        return { q: '$0\\le x<2\\pi$에서 $\\sin x>\\dfrac12$의 해는?', correct: '$\\dfrac\\pi6<x<\\dfrac{5\\pi}6$', wrong: ['$0\\le x<\\dfrac\\pi6$ 또는 $x>\\dfrac{5\\pi}6$', '$\\dfrac\\pi3<x<\\dfrac{2\\pi}3$', '$\\dfrac{5\\pi}6<x<\\dfrac{13\\pi}6$'], why: '$\\sin x=\\dfrac12$인 $x=\\dfrac\\pi6,\\dfrac{5\\pi}6$ 사이에서 그래프가 직선 위에 있어요.' };
      } },
    ],
  },
  {
    id: 'h2.sin',
    lesson: [
      { id: 'c1', t: '사인법칙', b: T`삼각형 $ABC$의 외접원의 반지름이 $R$일 때
        $$\dfrac a{\sin A}=\dfrac b{\sin B}=\dfrac c{\sin C}=2R$$
        **한 변과 두 각**, 또는 **외접원**이 주어질 때 써요.` },
      { id: 'c2', t: '코사인법칙', b: T`$$a^2=b^2+c^2-2bc\cos A$$
        (다른 두 식도 같은 꼴)
        **두 변과 끼인각**, 또는 **세 변**이 주어질 때 써요. $\cos A=\dfrac{b^2+c^2-a^2}{2bc}$

        $\angle A=90°$이면 피타고라스 정리가 돼요.` },
    ],
    gens: [
      { id: 'sine', lv: [1, 4], card: 'c1', make: (R) => {
        const items = [[30, 45, 2, '\\sqrt2', 2], [30, 90, 1, '2', 4], [45, 30, 2, '1', 2]];
        const R2 = R.int(1, 6);
        return { q: `삼각형 $ABC$에서 $A=30°$, $a=${R2}$일 때 외접원의 반지름 $R$은?`, a: R2, wrong: [R2 * 2, R2 * 3, R2 + 1].filter((v) => v !== R2), why: `$\\dfrac a{\\sin A}=2R$ → $\\dfrac{${R2}}{\\sin30°}=\\dfrac{${R2}}{1/2}=${2 * R2}=2R$ → $R=${R2}$` };
      } },
      { id: 'sine2', lv: [2, 5], card: 'c1', make: (R) => {
        const k = R.int(1, 5);
        return { q: `삼각형 $ABC$에서 $A=30°$, $B=90°$, $b=${2 * k}$일 때 $a$의 길이는?`, a: k, wrong: [2 * k, k * 2 + 1, k + 1].filter((v) => v !== k), why: `$\\dfrac a{\\sin30°}=\\dfrac{${2 * k}}{\\sin90°}$ → $a=${2 * k}\\times\\dfrac12=${k}$` };
      } },
      { id: 'cos', lv: [2, 5], card: 'c2', make: (R) => {
        const b = R.int(2, 8), c = R.int(2, 8); const kind = R.pick([60, 120, 90]);
        const cosv = { 60: 0.5, 120: -0.5, 90: 0 }[kind];
        const a2 = b * b + c * c - 2 * b * c * cosv; const sq = Math.sqrt(a2);
        if (kind === 90) return { q: `삼각형 $ABC$에서 $b=${b}$, $c=${c}$, $A=90°$일 때 $a^2$의 값은?`, a: b * b + c * c, wrong: [b * b + c * c - b * c, b + c, (b + c) ** 2], why: `$\\cos90°=0$ → $a^2=b^2+c^2=${b * b + c * c}$` };
        return { q: `삼각형 $ABC$에서 $b=${b}$, $c=${c}$, $A=${kind}°$일 때 $a^2$의 값은?`, a: a2, wrong: [b * b + c * c, a2 + b * c, b * b + c * c + (kind === 60 ? b * c : -b * c)].filter((v) => v !== a2), why: `$a^2=b^2+c^2-2bc\\cos${kind}°=${b * b}+${c * c}-2\\times${b}\\times${c}\\times${kind === 60 ? '\\dfrac12' : '\\left(-\\dfrac12\\right)'}=${a2}$` };
      } },
      { id: 'cosA', lv: [3, 5], card: 'c2', make: (R) => {
        const [a, b, c] = R.pick([[3, 4, 5], [5, 12, 13], [7, 8, 9], [4, 5, 6]]);
        // cos of angle opposite 'a' with sides b,c
        const num = b * b + c * c - a * a, den = 2 * b * c;
        return { q: `세 변의 길이가 $a=${a}$, $b=${b}$, $c=${c}$인 삼각형에서 $\\cos A$의 값은?`, correct: `$${fS(num, den)}$`, wrong: uniq([fS(den, num || 1), fS(-num, den), fS(a * a + b * b - c * c, 2 * a * b)], fS(num, den)).map((s) => `$${s}$`), why: `$\\cos A=\\dfrac{b^2+c^2-a^2}{2bc}=\\dfrac{${b * b}+${c * c}-${a * a}}{${den}}=${fS(num, den)}$` };
      } },
    ],
  },
  {
    id: 'h2.area',
    lesson: [
      { id: 'c1', t: '삼각형의 넓이', b: T`두 변 $b,\ c$와 끼인각 $A$가 주어지면
        $$S=\dfrac12bc\sin A$$
        세 변이 주어지면 **헤론의 공식**: $s=\dfrac{a+b+c}2$, $S=\sqrt{s(s-a)(s-b)(s-c)}$
        외접원 $R$: $S=\dfrac{abc}{4R}$, 내접원 $r$: $S=\dfrac12r(a+b+c)$` },
      { id: 'c2', t: '사각형의 넓이', b: T`- 평행사변형: $ab\sin\theta$
        - 사각형의 두 대각선 $p,q$가 이루는 각 $\theta$: $S=\dfrac12pq\sin\theta$` },
    ],
    gens: [
      { id: 'tri', lv: [1, 4], card: 'c1', make: (R) => {
        const b = R.int(2, 10), c = R.int(2, 10); const A = R.pick([30, 90, 150]);
        const s = { 30: 0.5, 90: 1, 150: 0.5 }[A]; const area = (b * c * s) / 2;
        return { q: `삼각형 $ABC$에서 $b=${b}$, $c=${c}$, $A=${A}°$일 때 넓이는?`, a: area, fmt: Number.isInteger(area) ? undefined : 'dec', wrong: [b * c, b * c / 4, area + 1].filter((v) => v !== area), why: `$S=\\dfrac12bc\\sin A=\\dfrac12\\times${b}\\times${c}\\times${A === 90 ? '1' : '\\dfrac12'}=${area}$` };
      } },
      { id: 'heron', lv: [3, 5], card: 'c1', make: (R) => {
        const [a, b, c] = R.pick([[3, 4, 5], [5, 12, 13], [13, 14, 15], [6, 8, 10], [7, 15, 20].slice(0, 0).length ? [3, 4, 5] : [9, 10, 17]]);
        const s = (a + b + c) / 2; const S = Math.sqrt(s * (s - a) * (s - b) * (s - c));
        return { q: `세 변의 길이가 $${a},\\ ${b},\\ ${c}$인 삼각형의 넓이는?`, a: S, wrong: [S + 2, S * 2, a * b / 2 + 1].filter((v) => v !== S), why: `$s=${s}$, $S=\\sqrt{${s}(${s - a})(${s - b})(${s - c})}=\\sqrt{${s * (s - a) * (s - b) * (s - c)}}=${S}$` };
      } },
      { id: 'par', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.int(3, 10), b = R.int(3, 10);
        return { q: `이웃한 두 변의 길이가 $${a},\\ ${b}$이고 그 끼인각이 $30°$인 평행사변형의 넓이는?`, a: (a * b) / 2, fmt: (a * b) % 2 ? 'dec' : undefined, wrong: [a * b, a * b / 4, a + b].filter((v) => v !== (a * b) / 2), why: `$ab\\sin30°=${a}\\times${b}\\times\\dfrac12=${(a * b) / 2}$` };
      } },
    ],
  },

  // ───────────── 수열 ─────────────
  {
    id: 'h2.seq',
    lesson: [
      { id: 'c1', t: '수열과 일반항', b: T`==수열==: 수를 일렬로 나열한 것. $a_1,a_2,\dots,a_n,\dots$ ($a_n$: 일반항)

        $a_n=3n-1$이면 $a_1=2,\ a_2=5,\ a_3=8$` },
      { id: 'c2', t: '$S_n$과 $a_n$의 관계', b: T`첫째항부터 $n$항까지의 합 $S_n$이 주어지면
        - $a_1=S_1$
        - $a_n=S_n-S_{n-1}$ ($n\ge2$)

        ⚠️ $a_1$이 $n\ge2$ 식에 맞는지 **반드시 확인**!` },
    ],
    gens: [
      { id: 'term', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.nz(-3, 5), b = R.nz(-5, 6), n = R.int(3, 9);
        return { q: `일반항이 $a_n=${linTex(a, b, 'n')}$인 수열의 제$${n}$항은?`, a: a * n + b, wrong: [a * n - b, a * (n + 1) + b, a + b].filter((v) => v !== a * n + b), why: `$n=${n}$ 대입: $${a}\\times${n}+${paren(b)}=${a * n + b}$` };
      } },
      { id: 'sn', lv: [3, 5], card: 'c2', make: (R) => {
        const p = R.int(1, 3), q = R.int(0, 3), n = R.int(3, 6);
        // S_n = p n² + q n → a_n = p(2n-1)+q
        const an = p * (2 * n - 1) + q;
        return { q: `첫째항부터 제$n$항까지의 합이 $S_n=${polyTex([p, q, 0], 'n')}$일 때 $a_${n}$의 값은?`, a: an, wrong: [p * n * n + q * n, an + p, an - p].filter((v) => v !== an), why: `$a_${n}=S_${n}-S_${n - 1}=${p * n * n + q * n}-${p * (n - 1) ** 2 + q * (n - 1)}=${an}$` };
      } },
      { id: 'a1', lv: [2, 5], card: 'c2', make: (R) => {
        const p = R.int(1, 4), q = R.int(1, 5);
        return { q: `$S_n=${p}n^2+${q}n$일 때 $a_1$의 값은?`, a: p + q, wrong: [p, q, 2 * p + q].filter((v) => v !== p + q), why: `$a_1=S_1=${p}+${q}=${p + q}$` };
      } },
    ],
  },
  {
    id: 'h2.ari',
    lesson: [
      { id: 'c1', t: '등차수열', b: T`이웃한 두 항의 **차가 일정**한 수열 (공차 $d$)
        - 일반항 $a_n=a+(n-1)d$
        - 등차중항: $b=\dfrac{a+c}2$ ($a,b,c$가 이 순서로 등차수열)` },
      { id: 'c2', t: '등차수열의 합', b: T`$$S_n=\dfrac{n(a+l)}2=\dfrac{n\{2a+(n-1)d\}}2$$
        ($l$은 끝항)

        예) $1+2+\dots+100=\dfrac{100\times101}2=5050$` },
    ],
    gens: [
      { id: 'term', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.int(-5, 10), d = R.nz(-4, 5), n = R.int(5, 15);
        return { q: `첫째항이 $${a}$, 공차가 $${d}$인 등차수열의 제$${n}$항은?`, a: a + (n - 1) * d, wrong: [a + n * d, a + (n - 2) * d, a * d + n].filter((v) => v !== a + (n - 1) * d), why: `$a_n=a+(n-1)d=${a}+${n - 1}\\times${paren(d)}=${a + (n - 1) * d}$` };
      } },
      { id: 'find', lv: [2, 4], card: 'c1', make: (R) => {
        const a = R.int(1, 10), d = R.nz(-3, 4); const m = R.int(2, 4), n = R.int(6, 10);
        return { q: `등차수열 $\\{a_n\\}$에서 $a_${m}=${a + (m - 1) * d}$, $a_${n}=${a + (n - 1) * d}$일 때 공차는?`, a: d, wrong: [-d, d + 1, a].filter((v) => v !== d), why: `$a_${n}-a_${m}=${n - m}d$ → $${(n - m) * d}=${n - m}d$ → $d=${d}$` };
      } },
      { id: 'sum', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.int(1, 8), d = R.int(1, 5), n = R.int(5, 12);
        const S = (n * (2 * a + (n - 1) * d)) / 2;
        return { q: `첫째항이 $${a}$, 공차가 $${d}$인 등차수열의 첫째항부터 제$${n}$항까지의 합은?`, a: S, wrong: [S + n, S - d, n * (a + (n - 1) * d)].filter((v) => v !== S), why: `$S_n=\\dfrac{${n}\\{2\\times${a}+${n - 1}\\times${d}\\}}2=${S}$` };
      } },
      { id: 'mid', lv: [1, 4], card: 'c1', make: (R) => {
        const a = R.int(1, 10), c = a + 2 * R.int(1, 8);
        return { q: `세 수 $${a},\\ x,\\ ${c}$가 이 순서로 등차수열을 이룰 때 $x$의 값은?`, a: (a + c) / 2, wrong: [a * c, c - a, (a + c) / 2 + 1].filter((v) => v !== (a + c) / 2), why: `등차중항: $x=\\dfrac{${a}+${c}}2=${(a + c) / 2}$` };
      } },
    ],
  },
  {
    id: 'h2.geo',
    lesson: [
      { id: 'c1', t: '등비수열', b: T`이웃한 두 항의 **비가 일정**한 수열 (공비 $r$)
        - 일반항 $a_n=ar^{n-1}$
        - 등비중항: $b^2=ac$ ($ac>0$일 때 $b=\pm\sqrt{ac}$)` },
      { id: 'c2', t: '등비수열의 합', b: T`$$S_n=\dfrac{a(r^n-1)}{r-1}\ (r>1),\qquad S_n=\dfrac{a(1-r^n)}{1-r}\ (r<1,\ r\ne1)$$
        $r=1$이면 $S_n=na$

        예) $1+2+4+8+16=\dfrac{2^5-1}{2-1}=31$` },
    ],
    gens: [
      { id: 'term', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.int(1, 5), r = R.pick([2, 3, -2, -3]), n = R.int(3, 6);
        return { q: `첫째항이 $${a}$, 공비가 $${r}$인 등비수열의 제$${n}$항은?`, a: a * r ** (n - 1), wrong: [a * r ** n, a * r * (n - 1), a + r * (n - 1)].filter((v) => v !== a * r ** (n - 1)), why: `$a_n=ar^{n-1}=${a}\\times${paren(r)}^{${n - 1}}=${a * r ** (n - 1)}$` };
      } },
      { id: 'ratio', lv: [2, 4], card: 'c1', make: (R) => {
        const a = R.int(1, 4), r = R.pick([2, 3, -2]); const m = R.int(1, 3), n = m + R.int(1, 2) + 1;
        const am = a * r ** (m - 1), an = a * r ** (n - 1);
        return { q: `등비수열 $\\{a_n\\}$에서 $a_${m}=${am}$, $a_${n}=${an}$이고 공비가 정수일 때 공비는?`, a: r, wrong: [-r, r + 1, an - am].filter((v) => v !== r), why: `$\\dfrac{a_${n}}{a_${m}}=r^{${n - m}}=${an / am}$ → $r=${r}$` };
      } },
      { id: 'sum', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.int(1, 4), r = R.pick([2, 3]), n = R.int(3, 6);
        const S = (a * (r ** n - 1)) / (r - 1);
        return { q: `첫째항이 $${a}$, 공비가 $${r}$인 등비수열의 첫째항부터 제$${n}$항까지의 합은?`, a: S, wrong: [S + a, a * r ** n, S - a].filter((v) => v !== S), why: `$S_n=\\dfrac{${a}(${r}^{${n}}-1)}{${r}-1}=${S}$` };
      } },
      { id: 'mid', lv: [2, 5], card: 'c1', make: (R) => {
        const b = R.int(2, 6), r = R.int(2, 3);
        return { q: `세 양수 $${b},\\ x,\\ ${b * r * r}$가 이 순서로 등비수열을 이룰 때 $x$의 값은?`, a: b * r, wrong: [(b + b * r * r) / 2, b * r * r, b * r + 1].filter((v) => v !== b * r), why: `등비중항: $x^2=${b}\\times${b * r * r}=${b * b * r * r}$ → $x=${b * r}$ (양수)` };
      } },
    ],
  },
  {
    id: 'h2.sig',
    lesson: [
      { id: 'c1', t: '합의 기호 ∑', b: T`$$\sum_{k=1}^{n}a_k=a_1+a_2+\cdots+a_n$$
        - $\sum(a_k\pm b_k)=\sum a_k\pm\sum b_k$
        - $\sum ca_k=c\sum a_k$
        - $\sum_{k=1}^{n}c=cn$` },
      { id: 'c2', t: '자연수 거듭제곱의 합', b: T`$$\sum_{k=1}^{n}k=\dfrac{n(n+1)}2,\quad\sum_{k=1}^{n}k^2=\dfrac{n(n+1)(2n+1)}6,\quad\sum_{k=1}^{n}k^3=\left\{\dfrac{n(n+1)}2\right\}^2$$` },
    ],
    gens: [
      { id: 'basic', lv: [1, 3], card: 'c2', make: (R) => {
        const n = R.int(3, 10); const p = R.pick([1, 2, 3]);
        const v = p === 1 ? (n * (n + 1)) / 2 : p === 2 ? (n * (n + 1) * (2 * n + 1)) / 6 : ((n * (n + 1)) / 2) ** 2;
        return { q: `$\\displaystyle\\sum_{k=1}^{${n}}k${p === 1 ? '' : `^${p}`}$의 값은?`, a: v, wrong: [v + n, v - n, p === 1 ? n * n : v * 2].filter((x) => x !== v), why: `공식에 $n=${n}$ 대입 → $${v}$` };
      } },
      { id: 'lin', lv: [2, 5], card: 'c1', make: (R) => {
        const a = R.int(2, 5), b = R.nz(-5, 5), n = R.int(4, 10);
        const v = a * (n * (n + 1)) / 2 + b * n;
        return { q: `$\\displaystyle\\sum_{k=1}^{${n}}(${linTex(a, b, 'k')})$의 값은?`, a: v, wrong: [v + b, a * n * (n + 1) + b * n, v - n].filter((x) => x !== v), why: `$${a}\\sum k+${paren(b)}\\sum1=${a}\\times${(n * (n + 1)) / 2}+${paren(b)}\\times${n}=${v}$` };
      } },
      { id: 'given', lv: [3, 5], card: 'c1', make: (R) => {
        const s1 = R.int(5, 20), s2 = R.int(3, 15), c = R.int(2, 4), n = R.int(5, 10);
        return { q: `$\\displaystyle\\sum_{k=1}^{${n}}a_k=${s1}$, $\\displaystyle\\sum_{k=1}^{${n}}b_k=${s2}$일 때 $\\displaystyle\\sum_{k=1}^{${n}}(${c}a_k-b_k)$의 값은?`, a: c * s1 - s2, wrong: [c * (s1 - s2), s1 - s2, c * s1 + s2].filter((x) => x !== c * s1 - s2), why: `$${c}\\sum a_k-\\sum b_k=${c}\\times${s1}-${s2}=${c * s1 - s2}$` };
      } },
    ],
  },
  {
    id: 'h2.ss',
    lesson: [
      { id: 'c1', t: '분수꼴의 합 (부분분수)', b: T`$$\dfrac1{k(k+1)}=\dfrac1k-\dfrac1{k+1}$$
        $$\sum_{k=1}^{n}\dfrac1{k(k+1)}=1-\dfrac1{n+1}=\dfrac n{n+1}$$
        중간 항이 모두 소거돼요 (망원급수).` },
      { id: 'c2', t: '규칙이 있는 수열의 합', b: T`일반항 $a_k$를 먼저 구하고 $\sum$ 공식으로 계산해요.

        $1\times2+2\times3+\cdots+n(n+1)=\sum k(k+1)=\sum k^2+\sum k$
        $1+3+5+\dots+(2n-1)=n^2$` },
    ],
    gens: [
      { id: 'tele', lv: [2, 5], card: 'c1', make: (R) => {
        const n = R.int(3, 12);
        return { q: `$\\dfrac1{1\\times2}+\\dfrac1{2\\times3}+\\cdots+\\dfrac1{${n}\\times${n + 1}}$의 값은?`, correct: `$${fS(n, n + 1)}$`, wrong: [`$${fS(1, n + 1)}$`, `$${fS(n + 1, n)}$`, `$${fS(n - 1, n)}$`].map(String), why: `$\\dfrac1{k(k+1)}=\\dfrac1k-\\dfrac1{k+1}$ → $1-\\dfrac1{${n + 1}}=${fS(n, n + 1)}$` };
      } },
      { id: 'odd', lv: [1, 4], card: 'c2', make: (R) => {
        const n = R.int(4, 15);
        return { q: `$1+3+5+\\cdots+${2 * n - 1}$의 값은?`, a: n * n, wrong: [n * (n + 1), 2 * n - 1, n * n + n].filter((v) => v !== n * n), why: `첫째항 1, 공차 2, 항 수 ${n}개 → $\\dfrac{${n}(1+${2 * n - 1})}2=${n * n}$` };
      } },
      { id: 'kk1', lv: [3, 5], card: 'c2', make: (R) => {
        const n = R.int(3, 8);
        const v = (n * (n + 1) * (n + 2)) / 3;
        return { q: `$1\\times2+2\\times3+3\\times4+\\cdots+${n}\\times${n + 1}$의 값은?`, a: v, wrong: [v + n, (n * (n + 1)) / 2, v - n].filter((x) => x !== v), why: `$\\sum k(k+1)=\\sum k^2+\\sum k=\\dfrac{${n}(${n + 1})(${2 * n + 1})}6+\\dfrac{${n}(${n + 1})}2=${v}$` };
      } },
    ],
  },
  {
    id: 'h2.rec',
    lesson: [
      { id: 'c1', t: '귀납적 정의', b: T`처음 몇 개의 항과 **이웃하는 항 사이의 관계식**(점화식)으로 수열을 정의하는 방법.

        - $a_{n+1}=a_n+d$: 등차수열 (공차 $d$)
        - $a_{n+1}=ra_n$: 등비수열 (공비 $r$)
        - $a_{n+1}-a_n=f(n)$: $a_n=a_1+\sum_{k=1}^{n-1}f(k)$ (계차수열)

        차례대로 대입해서 항을 구할 수도 있어요.` },
    ],
    gens: [
      { id: 'iter', lv: [1, 4], card: 'c1', make: (R) => {
        const a1 = R.int(1, 4), k = R.pick([2, 3]), c = R.nz(-3, 4), n = R.int(4, 6);
        let a = a1; for (let i = 1; i < n; i++) a = k * a + c;
        return { q: `$a_1=${a1}$, $a_{n+1}=${k}a_n${pm(c)}$ ($n\\ge1$)로 정의된 수열에서 $a_${n}$의 값은?`, a, wrong: [a + c, a - 1, a1 * k ** (n - 1)].filter((v) => v !== a), why: `차례로 계산하면 ${(() => { const arr = [a1]; let x = a1; for (let i = 1; i < n; i++) { x = k * x + c; arr.push(x); } return arr.map((v, i) => `$a_${i + 1}=${v}$`).join(', '); })()}` };
      } },
      { id: 'type', lv: [2, 4], card: 'c1', make: (R) => {
        const d = R.nz(-4, 5), r = R.pick([2, 3, 4]); const k = R.pick(['ari', 'geo']);
        return { q: `$a_{n+1}=${k === 'ari' ? `a_n${pm(d)}` : `${r}a_n`}$으로 정의된 수열은?`, correct: k === 'ari' ? `공차가 $${d}$인 등차수열` : `공비가 $${r}$인 등비수열`, wrong: [k === 'ari' ? `공비가 $${d}$인 등비수열` : `공차가 $${r}$인 등차수열`, '등차수열도 등비수열도 아니다', k === 'ari' ? `공차가 $${-d}$인 등차수열` : `공비가 $${r + 1}$인 등비수열`], why: k === 'ari' ? '이웃한 항의 차가 일정하므로 등차수열' : '이웃한 항의 비가 일정하므로 등비수열' };
      } },
      { id: 'diff', lv: [3, 5], card: 'c1', make: (R) => {
        const a1 = R.int(1, 5), n = R.int(4, 7);
        // a_{n+1} = a_n + 2n → a_n = a1 + n(n-1)
        return { q: `$a_1=${a1}$, $a_{n+1}=a_n+2n$으로 정의된 수열의 $a_${n}$의 값은?`, a: a1 + n * (n - 1), wrong: [a1 + n * n, a1 + 2 * n, a1 + n * (n - 1) + 1].filter((v) => v !== a1 + n * (n - 1)), why: `$a_n=a_1+\\sum_{k=1}^{${n - 1}}2k=${a1}+${n - 1}\\times${n}=${a1 + n * (n - 1)}$` };
      } },
    ],
  },
  {
    id: 'h2.ind',
    lesson: [
      { id: 'c1', t: '수학적 귀납법', b: T`자연수 $n$에 대한 명제 $p(n)$이 **모든 자연수**에서 성립함을 증명하는 방법

        1. $n=1$일 때 성립함을 보인다. (기초 단계)
        2. $n=k$일 때 성립한다고 **가정**하고, $n=k+1$일 때도 성립함을 보인다. (귀납 단계)

        도미노를 첫 번째가 쓰러지고, 하나가 쓰러지면 다음도 쓰러진다는 것과 같아요.` },
      { id: 'c2', t: '예: 1+2+…+n = n(n+1)/2', b: T`$n=k$일 때 $1+2+\cdots+k=\dfrac{k(k+1)}2$ 가정.
        양변에 $(k+1)$을 더하면
        $\dfrac{k(k+1)}2+(k+1)=\dfrac{(k+1)(k+2)}2$ ✅

        $n=k+1$일 때도 성립!` },
    ],
    gens: [
      { id: 'step', lv: [1, 4], card: 'c1', make: (R) => {
        const items = [
          ['수학적 귀납법으로 증명할 때 필요한 두 단계는?', '$n=1$일 때 성립, $n=k$ 가정 시 $n=k+1$ 성립', ['$n=1$, $n=2$일 때 성립', '$n=k$일 때 성립, $n=k+2$일 때 성립', '$n=0$일 때와 $n=k$일 때 성립'], '기초 단계($n=1$)와 귀납 단계($k\\to k+1$)가 모두 필요해요.'],
          ['귀납 단계에서 "$n=k$일 때 성립한다고 가정"하는 이유는?', '$n=k+1$일 때를 증명하는 데 이용하기 위해', ['모든 $n$에서 성립함이 이미 증명되었기 때문에', '$n=1$일 때를 증명하기 위해', '결론이 틀렸는지 확인하기 위해'], '$k$에서 성립한다는 가정을 사용해서 $k+1$에서 성립함을 보여요.'],
        ];
        const it = R.pick(items); return { q: it[0], correct: it[1], wrong: it[2], why: it[3] };
      } },
      { id: 'sub', lv: [2, 5], card: 'c2', make: (R) => {
        const kind = R.pick([0, 1]);
        if (kind === 0) return { q: '$1+2+\\cdots+n=\\dfrac{n(n+1)}2$을 귀납법으로 증명할 때 $n=k$일 때의 식의 양변에 더하는 것은?', correct: '$k+1$', wrong: ['$k$', '$k+2$', '$\\dfrac{k(k+1)}2$'], why: '$n=k+1$일 때의 좌변은 $1+2+\\cdots+k+(k+1)$이므로 $(k+1)$을 더해요.' };
        return { q: '$1+3+5+\\cdots+(2n-1)=n^2$에서 $n=k$일 때의 식의 양변에 더하는 것은?', correct: '$2k+1$', wrong: ['$2k-1$', '$2k$', '$k+1$'], why: '$n=k+1$의 마지막 항은 $2(k+1)-1=2k+1$이에요.' };
      } },
    ],
  },
];
