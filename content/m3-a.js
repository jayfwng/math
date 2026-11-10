// 중3 ① 제곱근과 실수 · 다항식의 곱셈과 인수분해 · 이차방정식
import { gcd, lcm, fr, linTex, polyTex, polyMul, paren, pm, isPrime, factorize } from '../js/lib.js';

const T = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const uniq = (arr, not) => [...new Set(arr.map(String))].filter((x) => x !== String(not));

// a√b 꼴 (b는 제곱인수 없는 수로 정리)
function simp(n) {
  let a = 1, b = n;
  for (let k = 2; k * k <= b; k++) while (b % (k * k) === 0) { a *= k; b /= k * k; }
  return [a, b];
}
const rad = (a, b) => {
  if (b === 1) return `${a}`;
  return `${a === 1 ? '' : a}\\sqrt{${b}}`;
};
const radSigned = (a, b) => (a < 0 ? `-${rad(-a, b)}` : rad(a, b));
const SQ = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
const NONSQ = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 15, 18, 20, 24, 27, 28, 32, 45, 48, 50, 75];
// ax²+bx+c 문자열 (x 변수)
const quad = (a, b, c) => polyTex([a, b, c]);
const fx = (p, q) => `(x${pm(p)})(x${pm(q)})`;

export default [
  // ───────────── 제곱근과 실수 ─────────────
  {
    id: 'm3.sqrt',
    lesson: [
      { id: 'c1', t: '제곱근이란?', b: T`$x^2=a$일 때 $x$를 $a$의 ==제곱근==이라 해요. ($a\ge0$)

        - 양수의 제곱근은 **2개** (양수와 음수): $9$의 제곱근 $=\pm3$
        - $0$의 제곱근은 $0$ 하나
        - 음수의 제곱근은 **없어요** (제곱하면 항상 0 이상이니까)` },
      { id: 'c2', t: '근호(√) 표기', b: T`제곱근을 기호 $\sqrt{\ \ }$ (근호)로 나타내요.

        - $a$의 **양의 제곱근**: $\sqrt a$
        - $a$의 **음의 제곱근**: $-\sqrt a$
        - $a$의 제곱근: $\pm\sqrt a$

        $\sqrt{16}=4$ (양의 제곱근, 값이 하나!) 하지만 "16의 제곱근"은 $\pm4$ (2개)
        ⚠️ **"제곱근 16"은 $\sqrt{16}=4$**, **"16의 제곱근"은 $\pm4$** 예요.` },
    ],
    gens: [
      { id: 'root', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.pick(SQ.slice(0, 8)); const s = Math.sqrt(a);
        return { q: `$${a}$의 제곱근은?`, correct: `$\\pm${s}$`, wrong: [`$${s}$`, `$-${s}$`, `$\\pm${a / 2 === Math.floor(a / 2) ? a / 2 : a + 1}$`], why: `제곱해서 $${a}$[이/가] 되는 수는 $${s}$[과/와] $-${s}$예요. $(\\pm${s})^2=${a}$` };
      } },
      { id: 'val', lv: [1, 3], card: 'c2', make: (R) => {
        const a = R.pick(SQ); const s = Math.sqrt(a);
        const kind = R.pick(['pos', 'neg', 'pm', 'root']);
        if (kind === 'pos') return { q: `$${a}$의 양의 제곱근은?`, a: s, wrong: [-s, a, s + 2], why: `$${a}$의 양의 제곱근은 $\\sqrt{${a}}=${s}$` };
        if (kind === 'neg') return { q: `$${a}$의 음의 제곱근은?`, a: -s, wrong: [s, a, -a], why: `음의 제곱근은 $-\\sqrt{${a}}=-${s}$` };
        if (kind === 'root') return { q: `$\\sqrt{${a}}$의 값은?`, a: s, wrong: [-s, s + 2, s + 1], why: `$\\sqrt{${a}}$[은/는] $${a}$의 **양의** 제곱근이에요. $${s}$` };
        return { q: `$(-${s})^2$의 값은?`, a: a, wrong: [-a, -s * 2, s], why: `음수를 제곱하면 양수가 돼요. $(-${s})^2=${a}$` };
      } },
      { id: 'count', lv: [2, 5], card: 'c1', make: (R) => {
        const items = [
          ['$0$의 제곱근의 개수는?', 1, '$0$의 제곱근은 $0$ 하나뿐이에요.'],
          ['$-4$의 제곱근의 개수는?', 0, '음수의 제곱근은 없어요. 제곱하면 항상 0 이상이니까요.'],
          ['$25$의 제곱근의 개수는?', 2, '양수의 제곱근은 양수와 음수 두 개예요.'],
        ];
        const it = R.pick(items);
        return { q: it[0], a: it[1], unit: '개', wrong: [0, 1, 2, 3].filter((x) => x !== it[1]), why: it[2] };
      } },
      { id: 'tell', lv: [3, 5], card: 'c2', make: (R) => {
        const n = R.pick([16, 25, 36, 49, 64, 81]); const s = Math.sqrt(n);
        const items = [
          [`$\\sqrt{${n}}$[을/를] 근호 없이 나타내면?`, `$${s}$`, [`$\\pm${s}$`, `$-${s}$`, `$${n / 2}$`]],
          [`"${n}의 제곱근"과 "제곱근 ${n}"[을/를] 순서대로 나타내면?`, `$\\pm${s},\\ ${s}$`, [`$${s},\\ \\pm${s}$`, `$${s},\\ ${s}$`, `$\\pm${s},\\ \\pm${s}$`]],
        ];
        const it = R.pick(items);
        return { q: it[0], correct: it[1], wrong: it[2], why: `$${n}$의 제곱근은 $\\pm${s}$이고, 제곱근 $${n}$[은/는] $\\sqrt{${n}}=${s}$예요.` };
      } },
    ],
  },
  {
    id: 'm3.sqrtprop',
    lesson: [
      { id: 'c1', t: '제곱근의 성질', b: T`$a>0$일 때
        - $(\sqrt a)^2=a$
        - $(-\sqrt a)^2=a$
        - $\sqrt{a^2}=a$
        - $\sqrt{(-a)^2}=a$

        ==$\sqrt{a^2}=|a|$== : 근호 안이 제곱이면 근호를 벗기고 **절댓값**을 붙여요.
        $\sqrt{(-5)^2}=5$ (−5가 아니에요!)` },
      { id: 'c2', t: '$\sqrt{a^2}$의 부호 판단', b: T`$\sqrt{a^2}=|a|=\begin{cases}a&(a\ge0)\\-a&(a<0)\end{cases}$

        예) $a<0$일 때 $\sqrt{a^2}=-a$ (양수가 되도록)
        예) $\sqrt{(x-3)^2}$에서 $x<3$이면 $=-(x-3)=3-x$` },
      { id: 'c3', t: '제곱근의 대소 비교', b: T`$a>0,\ b>0$일 때 $a<b\Leftrightarrow\sqrt a<\sqrt b$

        근호 안의 수가 클수록 제곱근도 커요.
        - $\sqrt3<\sqrt5$ ✅
        - 근호 밖의 수가 있으면 **제곱해서** 비교: $3$과 $\sqrt{10}$ → $3^2=9<10$ → $3<\sqrt{10}$` },
    ],
    gens: [
      { id: 'calc', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const a = R.int(2, 12);
        const kind = R.pick(['sq', 'neg', 'abs']);
        if (kind === 'sq') return { q: `$(\\sqrt{${a}})^2$의 값은?`, a, wrong: [a * a, Math.sqrt(a) | 0 || 2, -a], why: `$(\\sqrt a)^2=a$이므로 $${a}$` };
        if (kind === 'neg') return { q: `$\\sqrt{(-${a})^2}$의 값은?`, a, wrong: [-a, a * a, 0], why: `$\\sqrt{(-${a})^2}=\\sqrt{${a * a}}=${a}$ (양의 제곱근)` };
        return { q: `$(-\\sqrt{${a}})^2$의 값은?`, a, wrong: [-a, a * a, 2 * a], why: `$(-\\sqrt{${a}})^2=(\\sqrt{${a}})^2=${a}$` };
      } },
      { id: 'mix', lv: [2, 5], card: 'c1', make: (R) => {
        const a = R.int(2, 9), b = R.int(2, 9), c = R.int(2, 9);
        const kind = R.pick([0, 1, 2]);
        if (kind === 0) return { q: `$\\sqrt{${a}^2}+\\sqrt{(-${b})^2}$의 값은?`, a: a + b, wrong: [a - b, a * b, a * a + b * b], why: `$\\sqrt{${a}^2}=${a}$, $\\sqrt{(-${b})^2}=${b}$ → $${a}+${b}=${a + b}$` };
        if (kind === 1) return { q: `$(\\sqrt{${c}})^2\\times\\sqrt{${b}^2}$의 값은?`, a: c * b, wrong: [c + b, c * c * b, c * b * b], why: `$(\\sqrt{${c}})^2=${c}$, $\\sqrt{${b}^2}=${b}$ → $${c}\\times${b}=${c * b}$` };
        return { q: `$\\sqrt{(-${a})^2}-(-\\sqrt{${b}})^2$의 값은?`, a: a - b, wrong: [a + b, b - a, a * a - b], why: `$\\sqrt{(-${a})^2}=${a}$, $(-\\sqrt{${b}})^2=${b}$ → $${a}-${b}=${a - b}$` };
      } },
      { id: 'sign', lv: [3, 5], card: 'c2', make: (R) => {
        const k = R.int(2, 6);
        const items = [
          [`$a<0$일 때 $\\sqrt{a^2}$[을/를] 간단히 하면?`, '$-a$', ['$a$', '$a^2$', '$|a^2|$ 이 아닌 $-a^2$'], '$a<0$이면 $\\sqrt{a^2}=|a|=-a$예요. (양수가 되어야 하니까)'],
          [`$a>0$일 때 $\\sqrt{(-a)^2}$[을/를] 간단히 하면?`, '$a$', ['$-a$', '$a^2$', '$0$'], '$\\sqrt{(-a)^2}=|-a|=a$ ($a>0$이니까)'],
          [`$x<${k}$일 때 $\\sqrt{(x-${k})^2}$[을/를] 간단히 하면?`, `$${k}-x$`, [`$x-${k}$`, `$x+${k}$`, `$-x-${k}$`], `$x-${k}<0$이므로 $\\sqrt{(x-${k})^2}=-(x-${k})=${k}-x$`],
        ];
        const it = R.pick(items);
        return { q: it[0], correct: it[1], wrong: it[2].map((x) => x.replace(' 이 아닌 $-a^2$', '')).slice(0, 3), why: it[3] };
      } },
      { id: 'cmp', lv: [2, 5], card: 'c3', make: (R) => {
        const a = R.int(2, 8), b = R.int(a + 1, 14);
        const k = R.int(2, 5);
        if (R.chance(0.5)) return { q: `두 수 $\\sqrt{${a}}$, $\\sqrt{${b}}$ 중 더 큰 수는?`, correct: `$\\sqrt{${b}}$`, wrong: [`$\\sqrt{${a}}$`, '같다'], why: `근호 안의 수가 클수록 크므로 $\\sqrt{${b}}>\\sqrt{${a}}$` };
        const m = R.int(k * k + 1, k * k + 6);
        return { q: `두 수 $${k}$, $\\sqrt{${m}}$ 중 더 큰 수는?`, correct: `$\\sqrt{${m}}$`, wrong: [`$${k}$`, '같다'], why: `$${k}=\\sqrt{${k * k}}$이고 $${k * k}<${m}$[이므로/므로] $\\sqrt{${m}}>${k}$` };
      } },
    ],
  },
  {
    id: 'm3.real',
    lesson: [
      { id: 'c1', t: '무리수와 실수', b: T`- ==유리수==: $\dfrac{(\text{정수})}{(0\text{이 아닌 정수})}$ 꼴로 나타낼 수 있는 수 (유한소수, 순환소수)
        - ==무리수==: 유리수가 **아닌** 수. 순환하지 않는 무한소수. 예) $\sqrt2,\ \sqrt3,\ \pi$
        - ==실수==: 유리수와 무리수를 합친 수

        $\sqrt4=2$는 유리수, $\sqrt5$는 무리수. **근호를 없앨 수 있는지**가 판단 기준이에요.` },
      { id: 'c2', t: '수직선과 실수', b: T`실수는 수직선 위의 점과 **1:1로 대응**해요. 유리수만으로는 수직선이 빈틈투성이지만, 무리수까지 넣으면 꽉 찬 직선이 돼요.

        두 실수 사이에는 **무수히 많은 유리수와 무리수**가 있어요.

        $\sqrt2\approx1.414,\ \sqrt3\approx1.732,\ \sqrt5\approx2.236$` },
      { id: 'c3', t: '실수의 대소 비교', b: T`- 부호가 다르면 양수가 커요.
        - 둘 다 양수: 제곱해서 비교하거나 어림값으로 비교
        - $a-b$의 부호로: $a-b>0\Leftrightarrow a>b$

        예) $\sqrt5$와 $2.2$: $\sqrt5\approx2.236>2.2$
        예) $1+\sqrt2$와 $3$: $\sqrt2$와 $2$를 비교 → $\sqrt2<2$ → $1+\sqrt2<3$` },
    ],
    gens: [
      { id: 'kind', lv: [1, 3], card: 'c1', make: (R) => {
        const irr = R.pick(['\\sqrt{2}', '\\sqrt{3}', '\\sqrt{5}', '\\sqrt{7}', '\\sqrt{10}', '\\pi', '\\sqrt{11}']);
        const rat = R.pick(['\\sqrt{4}', '\\sqrt{9}', '\\sqrt{16}', '0.\\dot{3}'.replace('\\dot{3}', '\\overline{3}'), '\\dfrac{3}{7}', '-1.5']);
        const ask = R.chance(0.5);
        if (ask) return { q: '다음 중 무리수인 것은?', correct: `$${irr}$`, wrong: R.sample([...new Set(['\\sqrt{4}', '\\sqrt{9}', '\\sqrt{16}', '\\dfrac{3}{7}', '-1.5', '0.\\overline{3}'])], 3).map((x) => `$${x}$`), why: `근호를 없앨 수 없고 순환하지 않는 무한소수이므로 무리수예요.` };
        return { q: '다음 중 유리수인 것은?', correct: `$${rat}$`, wrong: R.sample(['\\sqrt{2}', '\\sqrt{3}', '\\sqrt{5}', '\\sqrt{7}', '\\pi', '\\sqrt{10}'], 3).map((x) => `$${x}$`), why: rat.startsWith('\\sqrt') ? `$${rat}=${Math.sqrt(+rat.match(/\d+/)[0])}$[으로/로] 근호를 없앨 수 있어서 유리수예요.` : '분수(또는 유한소수·순환소수)로 나타낼 수 있어서 유리수예요.' };
      } },
      { id: 'between', lv: [2, 4], card: 'c2', make: (R) => {
        const n = R.int(1, 6); const m = R.int(n * n + 1, (n + 1) * (n + 1) - 1);
        return { q: `$n<\\sqrt{${m}}<n+1$을 만족하는 정수 $n$은?`, a: n, wrong: [n + 1, n - 1, Math.round(m / 2)], why: `$${n}^2=${n * n}<${m}<${(n + 1) ** 2}=${n + 1}^2$ 이므로 $${n}<\\sqrt{${m}}<${n + 1}$` };
      } },
      { id: 'cmp', lv: [3, 5], card: 'c3', make: (R) => {
        const k = R.int(1, 4), m = R.pick([2, 3, 5, 6, 7]);
        const x = `${k}+\\sqrt{${m}}`;
        const v = R.int(k + 1, k + 3);
        const bigger = k + Math.sqrt(m) > v ? 'a' : 'b';
        return { q: `두 수 $${x}$[과/와] $${v}$ 중 더 큰 수는?`, correct: bigger === 'a' ? `$${x}$` : `$${v}$`, wrong: [bigger === 'a' ? `$${v}$` : `$${x}$`, '같다'], why: `$${x}-${v}=\\sqrt{${m}}-${v - k}$. $\\sqrt{${m}}$과 $${v - k}$를 비교하면 $${m}$과 $${(v - k) ** 2}$를 비교하는 것과 같아요. ${m > (v - k) ** 2 ? '앞의 수가 더 커요.' : '뒤의 수가 더 커요.'}` };
      } },
    ],
  },
  {
    id: 'm3.sqrtcalc', anchor: true,
    lesson: [
      { id: 'c1', t: '곱셈과 나눗셈', b: T`$a>0,\ b>0$일 때
        - $\sqrt a\times\sqrt b=\sqrt{ab}$
        - $\sqrt a\div\sqrt b=\sqrt{\dfrac ab}$
        - $m\sqrt a\times n\sqrt b=mn\sqrt{ab}$

        예) $\sqrt2\times\sqrt8=\sqrt{16}=4$` },
      { id: 'c2', t: '근호 안의 수 정리', b: T`근호 안에 **제곱수 인수**가 있으면 밖으로 꺼내요.
        $\sqrt{12}=\sqrt{2^2\times3}=2\sqrt3$
        $\sqrt{50}=\sqrt{5^2\times2}=5\sqrt2$

        반대로 $a\sqrt b=\sqrt{a^2b}$ 로 근호 안에 넣을 수도 있어요. $3\sqrt2=\sqrt{18}$` },
      { id: 'c3', t: '분모의 유리화', b: T`분모에 근호가 있으면 **분모와 분자에 같은 수**를 곱해서 분모를 유리수로 만들어요.

        $\dfrac{1}{\sqrt2}=\dfrac{1\times\sqrt2}{\sqrt2\times\sqrt2}=\dfrac{\sqrt2}{2}$
        $\dfrac{3}{2\sqrt3}=\dfrac{3\sqrt3}{2\times3}=\dfrac{\sqrt3}{2}$` },
    ],
    gens: [
      { id: 'mul', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.pick([2, 3, 5, 6, 7]), k = R.int(1, 4);
        // √a × √(a k²) = a k ... 정수가 나오도록
        const b = a * k * k;
        return { q: `$\\sqrt{${a}}\\times\\sqrt{${b}}$[을/를] 간단히 하면?`, correct: `$${a * k}$`, wrong: [`$${a + k}$`, `$\\sqrt{${a * k}}$`, `$${a * k * k}$`], why: `$\\sqrt{${a}}\\times\\sqrt{${b}}=\\sqrt{${a * b}}=${a * k}$` };
      } },
      { id: 'simp', lv: [2, 4], card: 'c2', make: (R) => {
        const n = R.pick([8, 12, 18, 20, 24, 27, 28, 32, 45, 48, 50, 72, 75]); const [a, b] = simp(n);
        const kind = R.pick(['out', 'in']);
        if (kind === 'out') return { q: `$\\sqrt{${n}}$[을/를] $a\\sqrt b$ 꼴로 나타낼 때 $a+b$의 값은? ($b$는 가장 작은 자연수)`, a: a + b, wrong: [a * b, n, a + b + 1], why: `$\\sqrt{${n}}=\\sqrt{${a * a}\\times${b}}=${a}\\sqrt{${b}}$ → $a+b=${a}+${b}=${a + b}$` };
        return { q: `$${rad(a, b)}$[을/를] $\\sqrt{\\ \\ }$ 안에 넣으면 $\\sqrt{N}$일 때 $N$의 값은?`, a: n, wrong: [a * b, a + b, n + 1], why: `$${rad(a, b)}=\\sqrt{${a}^2\\times${b}}=\\sqrt{${n}}$` };
      } },
      { id: 'rat', lv: [3, 5], card: 'c3', make: (R) => {
        const a = R.pick([2, 3, 5, 6, 7]), k = R.int(1, 6);
        const kind = R.pick([0, 1]);
        if (kind === 0) return { q: `$\\dfrac{${k}}{\\sqrt{${a}}}$의 분모를 유리화하면?`, correct: `$\\dfrac{${k === 1 ? '' : k}\\sqrt{${a}}}{${a}}$`, wrong: [`$\\dfrac{${k}}{${a}}$`, `$${k}\\sqrt{${a}}$`, `$\\dfrac{\\sqrt{${a}}}{${k}}$`], why: `분모, 분자에 $\\sqrt{${a}}$[을/를] 곱해요.\n$\\dfrac{${k}\\times\\sqrt{${a}}}{\\sqrt{${a}}\\times\\sqrt{${a}}}=\\dfrac{${k}\\sqrt{${a}}}{${a}}$` };
        return { q: `$\\dfrac{${a}}{\\sqrt{${a}}}$[을/를] 간단히 하면?`, correct: `$\\sqrt{${a}}$`, wrong: [`$${a}$`, `$\\dfrac{1}{\\sqrt{${a}}}$`, `$${a}\\sqrt{${a}}$`], why: `분모, 분자에 $\\sqrt{${a}}$를 곱하면 $\\dfrac{${a}\\sqrt{${a}}}{${a}}=\\sqrt{${a}}$` };
      } },
      { id: 'mix', lv: [4, 5], card: 'c2', make: (R) => {
        const a = R.pick([2, 3, 5]), p = R.int(2, 4), q = R.int(2, 4);
        return { q: `$${p}\\sqrt{${a}}\\times${q}\\sqrt{${a}}$의 값은?`, a: p * q * a, wrong: [p * q, (p + q) * a, p * q * a * a], why: `$${p}\\times${q}\\times\\sqrt{${a}}\\times\\sqrt{${a}}=${p * q}\\times${a}=${p * q * a}$` };
      } },
    ],
  },
  {
    id: 'm3.sqrtadd',
    lesson: [
      { id: 'c1', t: '근호를 포함한 덧셈과 뺄셈', b: T`**근호 안의 수가 같은 것끼리** 계수를 더하고 빼요. (동류항처럼!)

        $2\sqrt3+5\sqrt3=7\sqrt3$
        $4\sqrt2-\sqrt2=3\sqrt2$

        ⚠️ $\sqrt2+\sqrt3\ne\sqrt5$ (근호 안이 다르면 더할 수 없어요!)` },
      { id: 'c2', t: '먼저 근호 안을 정리', b: T`근호 안의 수가 달라 보여도 **간단히 하면** 같아질 수 있어요.

        $\sqrt{12}+\sqrt{27}=2\sqrt3+3\sqrt3=5\sqrt3$
        $\sqrt{50}-\sqrt{8}=5\sqrt2-2\sqrt2=3\sqrt2$

        순서: ① 근호 안을 간단히 ② 같은 근호끼리 계수를 더하고 빼기` },
      { id: 'c3', t: '분배법칙과 혼합 계산', b: T`$\sqrt2(\sqrt3+\sqrt2)=\sqrt6+2$
        $(2+\sqrt3)(2-\sqrt3)=4-3=1$ (합차 공식)
        $(\sqrt3+1)^2=3+2\sqrt3+1=4+2\sqrt3$

        곱셈 공식과 분배법칙을 그대로 써요.` },
    ],
    gens: [
      { id: 'same', lv: [1, 3], card: 'c1', make: (R) => {
        const r = R.pick([2, 3, 5, 6, 7]); const a = R.nz(-6, 8), b = R.nz(-6, 8);
        const s = a + b;
        if (s === 0) return { q: '$3\\sqrt2-3\\sqrt2$의 값은?', a: 0, wrong: [1, 6, 2], why: '같은 근호끼리 계수를 계산하면 $3-3=0$' };
        const t = (c) => `${c === 1 ? '' : c === -1 ? '-' : c}\\sqrt{${r}}`;
        return { q: `$${t(a)}${b >= 0 ? '+' : ''}${t(b)}$[을/를] 간단히 하면?`, correct: `$${t(s)}$`, wrong: [`$${t(a * b)}$`, `$${t(a - b || 3)}$`, `$${a + b}\\sqrt{${r * 2}}$`].filter((x) => x !== `$${t(s)}$`), why: `$\\sqrt{${r}}$의 계수끼리 계산해요. $${a}+${paren(b)}=${s}$` };
      } },
      { id: 'simp', lv: [2, 5], card: 'c2', make: (R) => {
        const b = R.pick([2, 3, 5, 6]); const k1 = R.int(1, 4), k2 = R.int(1, 4);
        const op = R.pick(['+', '-']);
        const n1 = k1 * k1 * b, n2 = k2 * k2 * b;
        const res = op === '+' ? k1 + k2 : k1 - k2;
        if (res === 0) return { q: '$\\sqrt{8}+\\sqrt{2}$[을/를] 간단히 하면?', correct: '$3\\sqrt2$', wrong: ['$\\sqrt{10}$', '$2\\sqrt2$', '$4\\sqrt2$'], why: '$\\sqrt8=2\\sqrt2$이므로 $2\\sqrt2+\\sqrt2=3\\sqrt2$' };
        const cor = `${res === 1 ? '' : res === -1 ? '-' : res}\\sqrt{${b}}`;
        return { q: `$\\sqrt{${n1}}${op}\\sqrt{${n2}}$[을/를] 간단히 하면?`, correct: `$${cor}$`, wrong: [`$\\sqrt{${op === '+' ? n1 + n2 : Math.abs(n1 - n2)}}$`, `$${radSigned(res + 1 === 0 ? 2 : res + 1, b)}$`, `$${rad(k1 * k2 + 5, b)}$`].filter((x) => x !== `$${cor}$`), why: `$\\sqrt{${n1}}=${rad(k1, b)}$, $\\sqrt{${n2}}=${rad(k2, b)}$\n$${rad(k1, b)}${op}${rad(k2, b)}=${cor}$` };
      } },
      { id: 'dist', lv: [4, 5], card: 'c3', make: (R) => {
        const a = R.pick([2, 3, 5]), b = R.pick([2, 3, 5, 6, 7].filter((x) => x !== a));
        const kind = R.pick([0, 1]);
        if (kind === 0) { // √a (√a + √b) 단순화: a + √(ab)
          return { q: `$\\sqrt{${a}}(\\sqrt{${a}}+\\sqrt{${b}})$[을/를] 간단히 하면?`, correct: `$${a}+\\sqrt{${a * b}}$`, wrong: [`$\\sqrt{${a}}+\\sqrt{${b}}$`, `$${a}+\\sqrt{${a + b}}$`, `$\\sqrt{${a * a}}+\\sqrt{${a * b}}$ 이 아닌 $${a * a}+\\sqrt{${b}}$`.replace(' 이 아닌 ', '').slice(0, 0) + `$${a}\\sqrt{${b}}$`], why: `분배법칙: $\\sqrt{${a}}\\times\\sqrt{${a}}=${a}$, $\\sqrt{${a}}\\times\\sqrt{${b}}=\\sqrt{${a * b}}$` };
        }
        return { q: `$(${a}+\\sqrt{${b}})(${a}-\\sqrt{${b}})$의 값은?`, a: a * a - b, wrong: [a * a + b, a * a, a - b], why: `합차 공식 $(p+q)(p-q)=p^2-q^2$\n$${a}^2-(\\sqrt{${b}})^2=${a * a}-${b}=${a * a - b}$` };
      } },
    ],
  },

  // ───────────── 다항식의 곱셈과 인수분해 ─────────────
  {
    id: 'm3.mulform',
    lesson: [
      { id: 'c1', t: '곱셈 공식 (기본)', b: T`- $(a+b)^2=a^2+2ab+b^2$
        - $(a-b)^2=a^2-2ab+b^2$
        - $(a+b)(a-b)=a^2-b^2$

        ⚠️ $(a+b)^2\ne a^2+b^2$ ! 가운데 항 $2ab$가 빠지면 안 돼요.` },
      { id: 'c2', t: '곱셈 공식 (일차항의 계수가 1)', b: T`$(x+a)(x+b)=x^2+(a+b)x+ab$

        예) $(x+2)(x+3)=x^2+5x+6$
        예) $(x-4)(x+1)=x^2-3x-4$

        가운데 항은 **합**, 상수항은 **곱**!` },
      { id: 'c3', t: '곱셈 공식 (일반)', b: T`$(ax+b)(cx+d)=acx^2+(ad+bc)x+bd$

        예) $(2x+1)(3x-4)=6x^2-8x+3x-4=6x^2-5x-4$

        **가운데 항은 "엇갈려 곱해서 더한 것"**이에요.` },
    ],
    gens: [
      { id: 'sq', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.pick([1, 1, 2, 3]), b = R.nz(-7, 7);
        const cor = quad(a * a, 2 * a * b, b * b);
        const wrong = uniq([quad(a * a, 0, b * b), quad(a * a, a * b, b * b), quad(a * a, 2 * a * b, -b * b), quad(a * a, -2 * a * b, b * b)], cor).slice(0, 3);
        return { q: `$(${linTex(a, b)})^2$[을/를] 전개하면?`, correct: `$${cor}$`, wrong: wrong.map((s) => `$${s}$`), why: `$(p+q)^2=p^2+2pq+q^2$ 에서 $p=${a === 1 ? '' : a}x,\\ q=${b}$\n$${a === 1 ? '' : a * a}x^2+2\\times ${a === 1 ? '' : a}x\\times ${paren(b)}+${paren(b)}^2=${cor}$` };
      } },
      { id: 'diff', lv: [2, 4], card: 'c1', make: (R) => {
        const a = R.pick([1, 2, 3]), b = R.int(1, 8);
        const cor = quad(a * a, 0, -b * b);
        return { q: `$(${linTex(a, b)})(${linTex(a, -b)})$[을/를] 전개하면?`, correct: `$${cor}$`, wrong: [`$${quad(a * a, 0, b * b)}$`, `$${quad(a * a, -2 * a * b, -b * b)}$`, `$${quad(a * a, 2 * a * b, b * b)}$`], why: `합차 공식 $(p+q)(p-q)=p^2-q^2$ → $${cor}$` };
      } },
      { id: 'xab', lv: [2, 4], card: 'c2', make: (R) => {
        const a = R.nz(-8, 8), b = R.nz(-8, 8);
        const cor = quad(1, a + b, a * b);
        return { q: `$(x${pm(a)})(x${pm(b)})$[을/를] 전개하면?`, correct: `$${cor}$`, wrong: uniq([quad(1, a * b, a + b), quad(1, a + b, a + b), quad(1, a + b, -a * b), quad(1, a - b, a * b)], cor).slice(0, 3).map((s) => `$${s}$`), why: `$x^2+(${a}+${paren(b)})x+${paren(a)}\\times${paren(b)}=${cor}$` };
      } },
      { id: 'gen', lv: [3, 5], card: 'c3', make: (R) => {
        const a = R.int(1, 4), b = R.nz(-6, 6), c = R.int(1, 4), d = R.nz(-6, 6);
        const p = polyMul([a, b], [c, d]);
        const cor = quad(p[0], p[1], p[2]);
        return { q: `$(${linTex(a, b)})(${linTex(c, d)})$[을/를] 전개하면?`, correct: `$${cor}$`, wrong: uniq([quad(p[0], a * d + b * c + 1, p[2]), quad(p[0], a + c + b + d, p[2]), quad(p[0], p[1], -p[2]), quad(p[0], a * d - b * c, p[2])], cor).slice(0, 3).map((s) => `$${s}$`), why: `$x^2$: $${a}\\times${c}=${p[0]}$ / $x$: $${a}\\times${paren(d)}+${paren(b)}\\times${c}=${p[1]}$ / 상수: $${paren(b)}\\times${paren(d)}=${p[2]}$` };
      } },
    ],
  },
  {
    id: 'm3.factor1',
    lesson: [
      { id: 'c1', t: '인수분해란?', b: T`다항식을 **다항식의 곱으로** 나타내는 것을 ==인수분해==라 해요. (곱셈 공식을 거꾸로!)

        $x^2+5x+6\ \Rightarrow\ (x+2)(x+3)$ (인수분해)
        $(x+2)(x+3)\ \Rightarrow\ x^2+5x+6$ (전개)

        곱해서 만든 각 식을 원래 식의 ==인수==라고 해요.` },
      { id: 'c2', t: '공통인수로 묶기', b: T`모든 항에 공통으로 들어 있는 인수를 **괄호 밖으로** 꺼내요.

        $ax+ay=a(x+y)$
        $6x^2y-9xy^2=3xy(2x-3y)$

        ⚠️ **먼저 공통인수가 있는지** 확인하는 게 인수분해의 첫 단계예요!` },
      { id: 'c3', t: '완전제곱식과 합차 공식', b: T`- $a^2+2ab+b^2=(a+b)^2$
        - $a^2-2ab+b^2=(a-b)^2$
        - $a^2-b^2=(a+b)(a-b)$

        예) $x^2+6x+9=(x+3)^2$, $4x^2-25=(2x+5)(2x-5)$
        완전제곱식: 상수항이 어떤 수의 제곱이고, 일차항의 계수가 그 수의 **2배**인지 확인!` },
    ],
    gens: [
      { id: 'common', lv: [1, 3], card: 'c2', make: (R) => {
        const k = R.int(2, 6), a = R.nz(-5, 5), b = R.nz(-5, 5);
        const cor = `${k}x(${linTex(a, b)})`;
        const p = polyMul([k, 0], [a, b]);
        return { q: `$${quad(p[0], p[1], 0)}$[을/를] 인수분해하면?`, correct: `$${cor}$`, wrong: [`$${k}(${linTex(a * k === 0 ? 1 : a, b)})$`, `$x(${linTex(k * a, k * b)})$ 이 아닌`.slice(0, 0) + `$${k}x(${linTex(a, -b)})$`, `$${k}x^2(${linTex(a, b)})$`], why: `$${quad(p[0], p[1], 0)}$의 공통인수는 $${k}x$예요. $${cor}$` };
      } },
      { id: 'sq', lv: [2, 4], card: 'c3', make: (R) => {
        let b, a; do { b = R.int(1, 9) * R.pick([1, -1]); a = R.pick([1, 1, 2, 3]); } while (gcd(a, b) !== 1);
        const cor = `(${linTex(a, b)})^2`;
        const p = polyMul([a, b], [a, b]);
        return { q: `$${quad(p[0], p[1], p[2])}$[을/를] 인수분해하면?`, correct: `$${cor}$`, wrong: [`$(${linTex(a, -b)})^2$`, `$(${linTex(a, b)})(${linTex(a, -b)})$`, `$(${linTex(a * a, b)})(x+${Math.abs(b)})$ 이 아닌`.slice(0, 0) + `$(${linTex(a, b * b)})^2$`], why: `첫 항은 $(${a === 1 ? '' : a}x)^2$, 끝 항은 $${Math.abs(b)}^2$, 가운데 항 $${p[1]}x$는 $2\\times ${a === 1 ? '' : a}x\\times ${b}$ → 완전제곱식 $${cor}$` };
      } },
      { id: 'diff', lv: [2, 5], card: 'c3', make: (R) => {
        let a, b; do { a = R.pick([1, 2, 3, 4]); b = R.int(1, 9); } while (gcd(a, b) !== 1);
        const cor = `(${linTex(a, b)})(${linTex(a, -b)})`;
        return { q: `$${quad(a * a, 0, -b * b)}$[을/를] 인수분해하면?`, correct: `$${cor}$`, wrong: [`$(${linTex(a, b)})^2$`, `$(${linTex(a, -b)})^2$`, `$(${linTex(a * a, b)})(x-${b})$`.replace(/x-/, 'x-')], why: `$A^2-B^2=(A+B)(A-B)$ 에서 $A=${a === 1 ? '' : a}x,\\ B=${b}$ → $${cor}$` };
      } },
      { id: 'mixed', lv: [4, 5], card: 'c2', make: (R) => {
        const k = R.int(2, 5), b = R.int(1, 6);
        const p = polyMul([k, 0, 0].slice(0, 2), [1, 0]); // k x * x
        // k x² − k b² = k (x+b)(x−b)
        return { q: `$${k}x^2-${k * b * b}$[을/를] 인수분해하면?`, correct: `$${k}(x+${b})(x-${b})$`, wrong: [`$(${k}x+${b})(${k}x-${b})$`, `$${k}(x-${b})^2$`, `$${k}(x^2-${b * b})$`], why: `공통인수 $${k}$를 먼저 묶고 합차 공식을 써요.\n$${k}(x^2-${b * b})=${k}(x+${b})(x-${b})$` };
      } },
    ],
  },
  {
    id: 'm3.factor2', anchor: true,
    lesson: [
      { id: 'c1', t: 'x² + bx + c 꼴', b: T`**곱해서 $c$, 더해서 $b$**가 되는 두 수 $p,\ q$를 찾아요.
        $$x^2+bx+c=(x+p)(x+q)\qquad(p+q=b,\ pq=c)$$

        예) $x^2+7x+12$: 곱 12, 합 7 → $3,\ 4$ → $(x+3)(x+4)$
        예) $x^2-x-6$: 곱 $-6$, 합 $-1$ → $-3,\ 2$ → $(x-3)(x+2)$

        팁: **상수항의 부호**가 +이면 두 수는 같은 부호, −이면 다른 부호예요.` },
      { id: 'c2', t: 'ax² + bx + c 꼴 (a≠1)', b: T`**교차해서 곱해 더한 것이 $b$**가 되도록 찾아요 (십자 곱셈, 다시 맞추기).

        $2x^2+7x+3$: $2x\times x$, $3=1\times3$
        $\begin{array}{c}2x\ \ \ 1\\ x\ \ \ 3\end{array}$ → 가운데 $2x\times3+x\times1=7x$ ✅
        → $(2x+1)(x+3)$

        여러 가지를 시도해 보고 가운데 항이 맞는 것을 골라요.` },
    ],
    gens: [
      { id: 'monic', lv: [1, 4], card: 'c1', make: (R, lv) => {
        const p = R.nz(-8, 8), q = R.nz(-8, 8);
        const b = p + q, c = p * q;
        const cor = fx(p, q);
        const alt = [fx(-p, -q), fx(p, -q), fx(p + 1, q), fx(c, 1)];
        return { q: `$${quad(1, b, c)}$[을/를] 인수분해하면?`, correct: `$${cor}$`, wrong: uniq(alt, cor).slice(0, 3).map((s) => `$${s}$`), why: `곱이 $${c}$, 합이 $${b}$인 두 수를 찾아요. $${p},\\ ${q}$\n$${cor}$` };
      } },
      { id: 'gen', lv: [3, 5], card: 'c2', make: (R) => {
        let a, b, c, d, p; do { a = R.int(2, 3); c = R.int(1, 3); b = R.nz(-5, 5); d = R.nz(-5, 5); p = polyMul([a, b], [c, d]); } while ((a === c && b === d) || gcd(gcd(p[0], p[1]), p[2]) !== 1 || p[1] === 0);
        if (p[1] === 0) return { q: '$x^2+6x+9$[을/를] 인수분해하면?', correct: '$(x+3)^2$', wrong: ['$(x-3)^2$', '$(x+3)(x-3)$', '$(x+9)(x+1)$'], why: '완전제곱식 $(x+3)^2$' };
        const cor = `(${linTex(a, b)})(${linTex(c, d)})`;
        return { q: `$${quad(p[0], p[1], p[2])}$[을/를] 인수분해하면?`, correct: `$${cor}$`, wrong: uniq([`(${linTex(a, d)})(${linTex(c, b)})`, `(${linTex(a, -b)})(${linTex(c, -d)})`, `(${linTex(a, b)})(${linTex(c, -d)})`], cor).slice(0, 3).map((s) => `$${s}$`), why: `$x^2$의 계수 $${p[0]}=${a}\\times${c}$, 상수항 $${p[2]}=${b}\\times${d}$ 로 나누고 가운데 항 $${p[1]}x$가 맞는 조합을 찾으면 $${cor}$` };
      } },
      { id: 'sumprod', lv: [2, 5], card: 'c1', make: (R) => {
        const p = R.nz(-9, 9), q = R.nz(-9, 9);
        return { q: `$x^2+bx+${p * q}$이 $(x${pm(p)})(x${pm(q)})$로 인수분해될 때 상수 $b$의 값은?`.replace('+-', '-'), a: p + q, wrong: [p * q, p - q, -p - q], why: `$(x${pm(p)})(x${pm(q)})=x^2+(${p}+${paren(q)})x${pm(p * q)}$ → $b=${p + q}$` };
      } },
    ],
  },
  {
    id: 'm3.factorapp',
    lesson: [
      { id: 'c1', t: '수의 계산에 활용', b: T`인수분해(곱셈 공식)를 이용하면 큰 수의 계산이 쉬워져요.

        $101^2-99^2=(101+99)(101-99)=200\times2=400$
        $98^2=(100-2)^2=10000-400+4=9604$
        $53^2-47^2=(53+47)(53-47)=100\times6=600$` },
      { id: 'c2', t: '식의 값 구하기', b: T`$x+y,\ xy$ 같은 값이 주어졌을 때 **인수분해로 정리한 뒤 대입**해요.

        $x^2+xy=x(x+y)$
        $x^2-y^2=(x+y)(x-y)$
        $x^2+y^2=(x+y)^2-2xy$` },
    ],
    gens: [
      { id: 'num', lv: [1, 4], card: 'c1', make: (R) => {
        const kind = R.pick(['diff', 'sq', 'big']);
        if (kind === 'diff') { const m = R.pick([50, 100]), d = R.int(1, 9); return { q: `$${m + d}^2-${m - d}^2$의 값은?`, a: 4 * m * d, wrong: [2 * d * d, 2 * m, (m + d) ** 2], why: `$(${m + d}+${m - d})(${m + d}-${m - d})=${2 * m}\\times${2 * d}=${4 * m * d}$` }; }
        if (kind === 'sq') { const d = R.int(1, 4); const base = R.pick([50, 100]); return { q: `$${base - d}^2$의 값은?`, a: (base - d) ** 2, wrong: [base * base - d * d, (base - d) * 2, base * base - d], why: `$(${base}-${d})^2=${base * base}-${2 * base * d}+${d * d}=${(base - d) ** 2}$` }; }
        const a = R.int(11, 19); return { q: `$${a}^2-${a - 1}^2$의 값은?`, a: 2 * a - 1, wrong: [1, a, 2 * a], why: `$(${a}+${a - 1})(${a}-${a - 1})=${2 * a - 1}\\times1=${2 * a - 1}$` };
      } },
      { id: 'val', lv: [3, 5], card: 'c2', make: (R) => {
        const x = R.int(3, 9), y = R.int(1, x - 1);
        const kind = R.pick([0, 1, 2]);
        if (kind === 0) return { q: `$x+y=${x + y}$, $xy=${x * y}$일 때 $x^2+y^2$의 값은?`, a: x * x + y * y, wrong: [(x + y) ** 2, x * y, (x + y) ** 2 + 2 * x * y], why: `$x^2+y^2=(x+y)^2-2xy=${(x + y) ** 2}-${2 * x * y}=${x * x + y * y}$` };
        if (kind === 1) return { q: `$x+y=${x + y}$, $x-y=${x - y}$일 때 $x^2-y^2$의 값은?`, a: (x + y) * (x - y), wrong: [x * x + y * y, x + y + x - y, (x - y) ** 2], why: `$x^2-y^2=(x+y)(x-y)=${x + y}\\times${x - y}=${(x + y) * (x - y)}$` };
        return { q: `$x=${x}$, $y=${y}$일 때 $x^2+2xy+y^2$의 값은?`, a: (x + y) ** 2, wrong: [x * x + y * y, (x - y) ** 2, 2 * x * y], why: `$x^2+2xy+y^2=(x+y)^2=${x + y}^2=${(x + y) ** 2}$` };
      } },
    ],
  },

  // ───────────── 이차방정식 ─────────────
  {
    id: 'm3.qeq', anchor: true,
    lesson: [
      { id: 'c1', t: '이차방정식이란?', b: T`$ax^2+bx+c=0$ ($a\ne0$) 꼴의 방정식을 ==이차방정식==이라 해요. 해(근)는 최대 **2개**예요.

        $x^2-5x+6=0$의 해: $x=2$ 또는 $x=3$ (각각 대입해 보세요 ✅)` },
      { id: 'c2', t: '인수분해로 풀기', b: T`**$AB=0$이면 $A=0$ 또는 $B=0$** 이라는 성질을 이용해요.

        $x^2-5x+6=0$
        $(x-2)(x-3)=0$
        $x-2=0$ 또는 $x-3=0$ → $x=2$ 또는 $x=3$

        ⚠️ 먼저 **우변을 0으로** 만들고 인수분해해야 해요. (우변이 0이 아닌 채로 인수분해하면 안 돼요!)` },
      { id: 'c3', t: '중근', b: T`두 근이 같을 때(예: $(x-3)^2=0$)를 ==중근==이라 해요.

        $x^2-6x+9=0\ \to\ (x-3)^2=0\ \to\ x=3$ (중근)

        완전제곱식 꼴이면 중근을 가져요.` },
    ],
    gens: [
      { id: 'roots', lv: [1, 3], card: 'c2', make: (R, lv) => {
        const p = R.nz(-7, 7), q = R.nz(-7, 7);
        const hi = Math.max(p, q), lo = Math.min(p, q);
        const ask = R.pick(['hi', 'lo', 'sum', 'prod']);
        const q0 = `$${quad(1, -(p + q), p * q)}=0$`;
        if (p === q) return { q: `${q0}의 해는? (중근)`, a: p, wrong: [-p, p + 1, 0], why: `$(x${pm(-p)})^2=0$ → $x=${p}$ (중근)` };
        const m = { hi: ['큰 근', hi], lo: ['작은 근', lo], sum: ['두 근의 합', p + q], prod: ['두 근의 곱', p * q] }[ask];
        return { q: `이차방정식 ${q0}의 ${m[0]}은?`.replace('은?', ask === 'hi' || ask === 'lo' ? '은?' : '은?'), a: m[1], wrong: [-m[1], hi + lo + 1, p * q + 1].filter((x) => x !== m[1]), why: `인수분해하면 $(x${pm(-p)})(x${pm(-q)})=0$ → $x=${p}$ 또는 $x=${q}$` };
      } },
      { id: 'solve', lv: [2, 5], card: 'c2', make: (R, lv) => {
        const p = R.nz(-8, 8), q = R.nz(-8, 8); const a = lv >= 4 ? R.pick([2, 3]) : 1;
        // a(x-p)(x-q)=0 → ax² -a(p+q)x + a p q
        const co = [a, -a * (p + q), a * p * q];
        const fm = (v) => `$x=${v}$`;
        const ans = p === q ? [p] : [p, q].sort((x, y) => x - y);
        const correct = ans.length === 1 ? fm(p) : `$x=${ans[0]}$ 또는 $x=${ans[1]}$`;
        const wr = [`$x=${-ans[0]}$ 또는 $x=${-(ans[1] ?? p)}$`, `$x=${ans[0] + 1}$ 또는 $x=${(ans[1] ?? p) + 1}$`, `$x=${ans[0]}$ 또는 $x=${-(ans[1] ?? p)}$`];
        return { q: `$${quad(co[0], co[1], co[2])}=0$[을/를] 풀면?`, correct, wrong: uniq(wr, correct).slice(0, 3), why: `$${a === 1 ? '' : a}(x${pm(-p)})(x${pm(-q)})=0$ → $x=${p}$ 또는 $x=${q}$\n(부호에 주의! $x-p=0$이면 $x=p$)` };
      } },
      { id: 'rhs', lv: [3, 5], card: 'c2', make: (R) => {
        const p = R.int(1, 6), q = R.int(1, 6) * R.pick([1, -1]);
        // x² + b x = c 형태: x(x - (p+q)) ... 우변 이항
        const b = -(p + q), c = p * q;
        const k = R.int(1, 6);
        return { q: `$${quad(1, b, 0)}=${-c}$[을/를] 풀 때 가장 먼저 해야 할 일은?`, correct: '우변을 0으로 만든다 (이항한다)', wrong: ['양변을 $x$로 나눈다', '양변에 제곱근을 씌운다', '좌변만 인수분해한다'], why: `이차방정식은 먼저 $ax^2+bx+c=0$ 꼴로 정리한 뒤 인수분해해요.` };
      } },
      { id: 'find', lv: [3, 5], card: 'c1', make: (R) => {
        const p = R.int(1, 6), q = R.int(1, 6);
        return { q: `이차방정식 $x^2+ax+${p * q}=0$의 한 근이 $x=-${p}$일 때, 다른 한 근과 상수 $a$의 합 $a+$(다른 근)의 값은? ($p\\neq q$ 가정 없이 계산)`.replace(/\(.*\)/, ''), a: 0, why: '' };
      } },
    ].filter((g) => g.id !== 'find'),
  },
  {
    id: 'm3.qsq',
    lesson: [
      { id: 'c1', t: '제곱근을 이용한 풀이', b: T`$x^2=k$ ($k\ge0$)이면 $x=\pm\sqrt k$
        $(x+p)^2=k$이면 $x+p=\pm\sqrt k$ → $x=-p\pm\sqrt k$

        예) $(x-2)^2=7$ → $x-2=\pm\sqrt7$ → $x=2\pm\sqrt7$
        $x^2=0$이면 $x=0$ (중근), $k<0$이면 해가 **없어요**.` },
      { id: 'c2', t: '완전제곱식으로 고쳐 풀기', b: T`$x^2+bx+c=0$을 $(x+p)^2=q$ 꼴로 바꿔요.

        1. 상수항을 우변으로 이항: $x^2+6x=-2$
        2. 양변에 $\left(\dfrac{b}{2}\right)^2=9$ 더하기: $x^2+6x+9=7$
        3. $(x+3)^2=7$ → $x=-3\pm\sqrt7$` },
    ],
    gens: [
      { id: 'sq', lv: [1, 3], card: 'c1', make: (R) => {
        const p = R.nz(-6, 6), k = R.pick([2, 3, 5, 6, 7, 10, 11]);
        const kk = R.chance(0.4) ? R.pick(SQ.slice(0, 6)) : k;
        const s = Math.sqrt(kk);
        if (Number.isInteger(s)) {
          const r = [-p + s, -p - s].sort((a, b) => a - b);
          return { q: `$(x${pm(p)})^2=${kk}$[을/를] 풀면?`, correct: `$x=${r[0]}$ 또는 $x=${r[1]}$`, wrong: [`$x=${p + s}$ 또는 $x=${p - s}$`, `$x=${-p}$`, `$x=${r[0]}$`], why: `$x${pm(p)}=\\pm${s}$ → $x=${-p}\\pm${s}$` };
        }
        return { q: `$(x${pm(p)})^2=${kk}$[을/를] 풀면?`, correct: `$x=${-p}\\pm\\sqrt{${kk}}$`, wrong: [`$x=${p}\\pm\\sqrt{${kk}}$`, `$x=${-p}\\pm${kk}$`, `$x=${-p}+\\sqrt{${kk}}$ 만`.replace(' 만', '')], why: `$x${pm(p)}=\\pm\\sqrt{${kk}}$ → $x=${-p}\\pm\\sqrt{${kk}}$` };
      } },
      { id: 'complete', lv: [3, 5], card: 'c2', make: (R) => {
        const h = R.int(1, 6), c = R.nz(-8, 8);
        const b = 2 * h;
        const rhs = h * h - c;
        return { q: `$x^2+${b}x${pm(c)}=0$[을/를] $(x+p)^2=q$ 꼴로 나타낼 때 $q$의 값은?`, a: rhs, wrong: [-c, h * h, rhs + 1], why: `$x^2+${b}x=${-c}$ → 양변에 $${h}^2=${h * h}$를 더하면 $(x+${h})^2=${-c}+${h * h}=${rhs}$` };
      } },
      { id: 'none', lv: [2, 4], card: 'c1', make: (R) => {
        const k = R.int(1, 9);
        return { q: `$x^2=-${k}$의 실수인 해는 몇 개일까요?`, a: 0, unit: '개', wrong: [1, 2, 3], why: '제곱하면 항상 0 이상이므로 음수가 되는 실수는 없어요.' };
      } },
    ],
  },
  {
    id: 'm3.qformula', anchor: true,
    lesson: [
      { id: 'c1', t: '근의 공식', b: T`이차방정식 $ax^2+bx+c=0$ ($a\ne0$)의 해는
        $$x=\dfrac{-b\pm\sqrt{b^2-4ac}}{2a}$$

        예) $x^2-3x+1=0$: $a=1,\ b=-3,\ c=1$
        $x=\dfrac{3\pm\sqrt{9-4}}{2}=\dfrac{3\pm\sqrt5}{2}$

        ⚠️ $-b$는 $b$의 **부호를 바꾼 값**이에요. $b=-3$이면 $-b=3$.` },
      { id: 'c2', t: '짝수 b일 때 간단한 공식', b: T`$b=2b'$ (일차항의 계수가 짝수)이면
        $$x=\dfrac{-b'\pm\sqrt{b'^2-ac}}{a}$$

        예) $x^2+6x+4=0$: $b'=3$ → $x=-3\pm\sqrt{9-4}=-3\pm\sqrt5$` },
      { id: 'c3', t: '판별식 D로 근의 개수 알기', b: T`$D=b^2-4ac$
        - $D>0$: 서로 다른 **두 실근**
        - $D=0$: **중근** (실근 1개)
        - $D<0$: **실근 없음**

        근호 안의 값이 바로 판별식이에요.` },
    ],
    gens: [
      { id: 'disc', lv: [1, 3], card: 'c3', make: (R) => {
        const a = R.pick([1, 2, 3]), b = R.nz(-7, 7), c = R.nz(-6, 6);
        const D = b * b - 4 * a * c;
        return { q: `이차방정식 $${quad(a, b, c)}=0$의 판별식 $D=b^2-4ac$의 값은?`, a: D, wrong: [b * b + 4 * a * c, b * b - 2 * a * c, -D], why: `$a=${a},\\ b=${b},\\ c=${c}$ → $D=${paren(b)}^2-4\\times${a}\\times${paren(c)}=${b * b}${-4 * a * c >= 0 ? '+' : ''}${-4 * a * c}=${D}$` };
      } },
      { id: 'count', lv: [2, 4], card: 'c3', make: (R) => {
        const a = R.pick([1, 2]), b = R.nz(-6, 6), c = R.nz(-5, 5);
        const D = b * b - 4 * a * c;
        const ans = D > 0 ? '서로 다른 두 실근' : D === 0 ? '중근' : '실근 없음';
        return { q: `이차방정식 $${quad(a, b, c)}=0$의 해의 개수(종류)는?`, correct: ans, wrong: ['서로 다른 두 실근', '중근', '실근 없음'].filter((x) => x !== ans), why: `$D=${paren(b)}^2-4\\times${a}\\times${paren(c)}=${D}$ ${D > 0 ? '→ $D>0$이므로 서로 다른 두 실근' : D === 0 ? '→ $D=0$이므로 중근' : '→ $D<0$이므로 실근이 없어요'}` };
      } },
      { id: 'solve', lv: [3, 5], card: 'c1', make: (R) => {
        // 정수 근이 나오도록: x = (-b ± √D)/2a
        const p = R.nz(-7, 7), q = R.nz(-7, 7); const a = R.pick([1, 1, 2]);
        const b = -a * (p + q), c = a * p * q;
        const D = b * b - 4 * a * c;
        const ask = R.pick(['hi', 'sqrtD']);
        if (ask === 'sqrtD') return { q: `$${quad(a, b, c)}=0$[을/를] 근의 공식으로 풀 때 근호 안의 값 $b^2-4ac$[은/는]?`, a: D, wrong: [b * b, D + 4, Math.abs(c) * 4], why: `$${paren(b)}^2-4\\times${a}\\times${paren(c)}=${D}$` };
        const hi = Math.max(p, q);
        return { q: `$${quad(a, b, c)}=0$의 두 근 중 큰 근은?`, a: hi, wrong: [Math.min(p, q), -hi, p + q], why: `$x=\\dfrac{${-b}\\pm\\sqrt{${D}}}{${2 * a}}=\\dfrac{${-b}\\pm${Math.sqrt(D)}}{${2 * a}}$ → $x=${p}$ 또는 $x=${q}$` };
      } },
      { id: 'irr', lv: [4, 5], card: 'c1', make: (R) => {
        const bb = R.int(1, 4) * R.pick([1, -1]), c = R.nz(-6, 5);
        const b = 2 * bb; const D2 = bb * bb - c; // b'^2 - ac with a=1
        if (D2 <= 0 || Number.isInteger(Math.sqrt(D2))) return { q: `$x^2-2x-1=0$의 해는?`, correct: '$x=1\\pm\\sqrt2$', wrong: ['$x=-1\\pm\\sqrt2$', '$x=2\\pm\\sqrt2$', '$x=1\\pm\\sqrt3$'], why: '$b\'=-1$ → $x=1\\pm\\sqrt{1+1}=1\\pm\\sqrt2$' };
        return { q: `$${quad(1, b, c)}=0$의 해는?`, correct: `$x=${-bb}\\pm\\sqrt{${D2}}$`, wrong: [`$x=${bb}\\pm\\sqrt{${D2}}$`, `$x=${-bb}\\pm\\sqrt{${D2 + 1}}$`, `$x=${-b}\\pm\\sqrt{${D2}}$`], why: `$b=${b}$이므로 $b'=${bb}$ → $x=-${paren(bb)}\\pm\\sqrt{${bb * bb}-${paren(c)}}=${-bb}\\pm\\sqrt{${D2}}$` };
      } },
    ],
  },
  {
    id: 'm3.qeqword',
    lesson: [
      { id: 'c1', t: '활용 문제 풀이', b: T`1. 구하려는 것을 $x$로 놓기
        2. 이차방정식 세우기
        3. 풀어서 **해가 둘이면 조건에 맞는 것만** 고르기 (길이, 개수는 양수/자연수)
        4. 답 확인

        ⚠️ 이차방정식의 해가 **둘 다 답이 되는 건 아니에요**. 음수나 조건에 안 맞는 건 버려요.` },
      { id: 'c2', t: '자주 나오는 유형', b: T`- **연속하는 두 자연수의 곱**: $x(x+1)=k$
        - **직사각형의 넓이**: (가로)×(세로) = 넓이
        - **길의 넓이, 상자 만들기**
        - **공을 위로 던졌을 때 높이**: $h=-5t^2+vt$ 형태` },
    ],
    gens: [
      { id: 'consec', lv: [1, 4], card: 'c2', make: (R) => {
        const x = R.int(3, 12);
        const kind = R.pick(['prod', 'sq']);
        if (kind === 'prod') return { q: `연속하는 두 자연수의 곱이 ${x * (x + 1)}일 때, 두 수 중 큰 수는?`, a: x + 1, wrong: [x, x + 2, x * (x + 1) / 2], why: `작은 수를 $x$라 하면 $x(x+1)=${x * (x + 1)}$\n$x^2+x-${x * (x + 1)}=0$ → $(x-${x})(x+${x + 1})=0$ → $x=${x}$ ($x>0$)\n큰 수는 $${x + 1}$` };
        return { q: `어떤 자연수를 제곱한 값에 그 수의 ${R.int(2, 3)}배를 더했더니 ...`.slice(0, 0) + `자연수 $x$에 대하여 $x^2=${x * x}$일 때 $x$의 값은?`, a: x, wrong: [-x, x * x, x + 1], why: `$x^2=${x * x}$ → $x=\\pm${x}$이고 자연수이므로 $x=${x}$` };
      } },
      { id: 'rect', lv: [2, 5], card: 'c2', make: (R) => {
        const w = R.int(3, 10), d = R.int(1, 6);
        const area = w * (w + d);
        return { q: `가로가 세로보다 ${d}cm 더 긴 직사각형의 넓이가 ${area}cm²일 때 세로의 길이는?`, a: w, unit: 'cm', wrong: [w + d, w - 1, area], why: `세로 $x$, 가로 $x+${d}$ → $x(x+${d})=${area}$\n$x^2+${d}x-${area}=0$ → $(x-${w})(x+${w + d})=0$ → $x=${w}$ ($x>0$)` };
      } },
      { id: 'throw', lv: [3, 5], card: 'c2', make: (R) => {
        const t1 = R.int(1, 3), t2 = R.int(t1 + 1, t1 + 4);
        const v = 5 * (t1 + t2); const h = 5 * t1 * t2;
        return { q: `공을 위로 던졌을 때 $t$초 후의 높이가 $h=-5t^2+${v}t$ (m)이에요. 높이가 ${h}m가 되는 시각 중 **늦은** 시각은 몇 초 후일까요?`, a: t2, unit: '초', wrong: [t1, t1 + t2, v / 5], why: `$-5t^2+${v}t=${h}$ → $t^2-${v / 5}t+${h / 5}=0$ → $(t-${t1})(t-${t2})=0$\n$t=${t1}$ 또는 $t=${t2}$ → 늦은 시각은 $${t2}$초` };
      } },
    ],
  },
];
