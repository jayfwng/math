// 미적분: 수열의 극한 · 미분법 · 적분법
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
// 문자열 보기: 정답 하나 + 오답 후보(중복 제거, 3개 이상 보장)
const CS = (ans, wr) => { const w = uniq(wr, ans).slice(0, 3); return { correct: `$${ans}$`, wrong: w.map((s) => `$${s}$`) }; };
const sx = (n) => (n === 0 ? '' : n > 0 ? `+${n}` : `${n}`);
const co = (k, s) => (k === 1 ? s : k === -1 ? `-${s}` : `${k}${s}`);
const tn = (b) => (b === 0 ? '' : `${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}n`);
const EQ = (n, d) => `\\dfrac{${n}}{${d}}${fS(n, d) === `\\dfrac{${n}}{${d}}` ? '' : `=${fS(n, d)}`}`;
const lx = (m) => (m === 0 ? '' : `${m > 0 ? '+' : '-'}${Math.abs(m) === 1 ? '' : Math.abs(m)}x`);
const pr = (n) => (n < 0 ? `(${n})` : `${n}`);
const TRI = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]];

export default [
  // ───────────── 수열의 극한 ─────────────
  {
    id: 'c.seqlim',
    lesson: [
      { id: 'c1', t: '수열의 수렴과 발산', b: T`$n\to\infty$일 때 $a_n$이 일정한 값 $\alpha$에 한없이 가까워지면 ==수렴==($\lim a_n=\alpha$), 그렇지 않으면 ==발산==
        - $\lim a_n=\alpha,\ \lim b_n=\beta$ → $\lim(a_n\pm b_n)=\alpha\pm\beta$, $\lim a_nb_n=\alpha\beta$, $\lim\dfrac{a_n}{b_n}=\dfrac\alpha\beta$ ($\beta\ne0$)
        - $\dfrac\infty\infty$ 꼴: 분자·분모를 ==최고차항==으로 나눠요.` },
      { id: 'c2', t: '등비수열 $r^n$의 극한', b: T`$\lim r^n$은
        - $|r|<1$ → $0$
        - $r=1$ → $1$
        - $r=-1$ 또는 $r<-1$ → 진동(발산)
        - $r>1$ → $\infty$ (발산)

        $\dfrac{p^{n+1}+q^n}{p^n+q^n}$ 같은 꼴은 ==밑이 가장 큰 항==으로 분자·분모를 나눠요.` },
    ],
    gens: [
      { id: 'rat', lv: [1, 4], card: 'c1', make: (R) => {
        const k = R.pick(['same', 'same', 'low', 'high']); const a = R.nz(-5, 5), d = R.nz(-4, 4), b = R.int(-4, 4), e = R.int(-4, 4);
        if (k === 'same') { const ans = fS(a, d); return { q: `$\\lim_{n\\to\\infty}\\dfrac{${co(a, 'n^2')}${tn(b)}}{${co(d, 'n^2')}${tn(e)}+1}$의 값은?`, ...CS(ans, [fS(d, a), '0', '\\infty']), why: `분자·분모를 $n^2$으로 나누면 $\\dfrac{${a}+\\frac{${b}}{n}}{${d}+\\frac{${e}}{n}+\\frac1{n^2}}\\to\\dfrac{${a}}{${d}}=${ans}$` }; }
        if (k === 'low') return { q: `$\\lim_{n\\to\\infty}\\dfrac{${co(a, 'n')}${sx(b)}}{${co(d, 'n^2')}+1}$의 값은?`, ...CS('0', [fS(a, d), '1', '\\infty']), why: '분자의 차수 < 분모의 차수 → $0$' };
        return { q: `$\\lim_{n\\to\\infty}\\dfrac{${co(a, 'n^3')}+1}{${co(d, 'n^2')}+n}$은?`, ...CS('\\text{발산}', ['0', fS(a, d), '1']), why: '분자의 차수 > 분모의 차수 → 발산($\\pm\\infty$)' };
      } },
      { id: 'geo', lv: [1, 3], card: 'c2', make: (R) => {
        const opts = [['\\dfrac12', '0'], ['\\dfrac23', '0'], ['1', '1'], ['2', '\\text{발산}'], ['-1', '\\text{발산}'], ['-\\dfrac13', '0'], ['3', '\\text{발산}']];
        const [r, ans] = R.pick(opts);
        return { q: `$\\lim_{n\\to\\infty}\\left(${r}\\right)^n$의 값은? (수렴하지 않으면 발산)`, ...CS(ans, ['0', '1', '\\text{발산}', '-1']), why: `$|r|<1$이면 $0$, $r=1$이면 $1$, $r>1$ 또는 $r\\le-1$이면 발산` };
      } },
      { id: 'geo2', lv: [3, 5], card: 'c2', make: (R) => {
        const p = R.int(2, 5); let q; do { q = R.int(1, p - 1); } while (q === p);
        return { q: `$\\lim_{n\\to\\infty}\\dfrac{${p}^{n+1}+${q}^n}{${p}^n+${q}^{n+1}}$의 값은?`, a: p, wrong: W(p, q, p * q, 1), why: `분자·분모를 $${p}^n$으로 나누면 $\\dfrac{${p}+(\\frac{${q}}{${p}})^n}{1+${q}(\\frac{${q}}{${p}})^n}\\to\\dfrac{${p}+0}{1+0}=${p}$` };
      } },
      { id: 'sqrt', lv: [4, 5], card: 'c1', make: (R) => {
        const a = 2 * R.int(1, 6);
        return { q: `$\\lim_{n\\to\\infty}\\left(\\sqrt{n^2+${a}n}-n\\right)$의 값은?`, a: a / 2, wrong: W(a / 2, a, 0, a * a), why: `유리화: $\\dfrac{${a}n}{\\sqrt{n^2+${a}n}+n}$ → $n$으로 나누면 $\\dfrac{${a}}{1+1}=${a / 2}$` };
      } },
    ],
  },
  {
    id: 'c.series',
    lesson: [
      { id: 'c1', t: '급수의 뜻', b: T`$\sum_{n=1}^\infty a_n$의 ==부분합== $S_n=a_1+\cdots+a_n$이 수렴하면 급수는 수렴하고 그 극한이 합이에요.
        - 급수가 수렴하면 $\lim a_n=0$ (필요조건)
        - ==$\lim a_n\ne0$이면 발산==
        - 하지만 $\lim a_n=0$이어도 수렴한다고 ==보장은 없어요==` },
      { id: 'c2', t: '등비급수', b: T`$\sum_{n=1}^\infty ar^{n-1}=a+ar+ar^2+\cdots$
        - $|r|<1$이면 수렴, 합 $=\dfrac{a}{1-r}$
        - $|r|\ge1$이면 발산 ($a\ne0$)
        예) $\dfrac12+\dfrac14+\dfrac18+\cdots=\dfrac{1/2}{1-1/2}=1$
        순환소수도 등비급수: $0.\overline{3}=\dfrac3{10}+\dfrac3{100}+\cdots=\dfrac13$` },
      { id: 'c3', t: '부분분수와 합', b: T`$\dfrac1{n(n+1)}=\dfrac1n-\dfrac1{n+1}$ → 연달아 소거(==망원급수==)
        $$\sum_{k=1}^n\dfrac1{k(k+1)}=1-\dfrac1{n+1}\to1$$` },
    ],
    gens: [
      { id: 'geo', lv: [1, 4], card: 'c2', make: (R) => {
        const [rn, rd] = R.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [-1, 2], [-1, 3], [1, 5]]); const a = R.int(1, 6);
        const sn = a * rd, sd = rd - rn;
        return { q: `등비급수 $\\sum_{n=1}^\\infty ${a === 1 ? '' : a}\\left(${rn < 0 ? '-' : ''}\\dfrac{${Math.abs(rn)}}{${rd}}\\right)^{n-1}$의 합은?`, ...FO(sn, sd, fS(a, rd), fS(a * rd, rd + rn)), why: `$a=${a}$, $r=${rn < 0 ? '-' : ''}\\dfrac{${Math.abs(rn)}}{${rd}}$ → $\\dfrac{a}{1-r}=\\dfrac{${a}}{${fS(sd, rd)}}=${fS(sn, sd)}$` };
      } },
      { id: 'rep', lv: [2, 4], card: 'c2', make: (R) => {
        const d = R.int(1, 9); const two = R.chance(0.5); const ab = two ? R.int(10, 98) : d;
        const num = ab, den = two ? 99 : 9; const str = two ? `0.\\overline{${ab}}` : `0.\\overline{${d}}`;
        return { q: `순환소수 $${str}$를 기약분수로 나타내면?`, ...FO(num, den, fS(num, den + 1), fS(den, num)), why: `첫째항 $\\dfrac{${num}}{${two ? 100 : 10}}$, 공비 $\\dfrac1{${two ? 100 : 10}}$인 등비급수 → $\\dfrac{a}{1-r}=${EQ(num, den)}$` };
      } },
      { id: 'tele', lv: [3, 5], card: 'c3', make: (R) => {
        const N = R.int(2, 9);
        return { q: `$\\sum_{k=1}^{${N}}\\dfrac{1}{k(k+1)}$의 값은?`, ...FO(N, N + 1, fS(1, N + 1), fS(N + 1, N + 2)), why: `$\\dfrac1{k(k+1)}=\\dfrac1k-\\dfrac1{k+1}$ → $1-\\dfrac1{${N + 1}}=${fS(N, N + 1)}$` };
      } },
      { id: 'tele2', lv: [4, 5], card: 'c3', make: (R) => {
        const k = R.pick([2, 3]); const H = k === 2 ? [3, 4] : [11, 18];
        return { q: `$\\sum_{n=1}^{\\infty}\\dfrac{1}{n(n+${k})}$의 값은?`, ...FO(H[0], H[1], fS(1, k), '1'), why: `$\\dfrac1{n(n+${k})}=\\dfrac1${k}\\left(\\dfrac1n-\\dfrac1{n+${k}}\\right)$ → 남는 항: $\\dfrac1${k}\\left(${k === 2 ? '1+\\dfrac12' : '1+\\dfrac12+\\dfrac13'}\\right)=${fS(H[0], H[1])}$` };
      } },
      { id: 'nec', lv: [2, 4], card: 'c1', make: (R) => {
        const L = R.pick([1, 2, 3, -1, 0.5]); const zero = R.chance(0.4);
        if (zero) return { q: '$\\lim_{n\\to\\infty}a_n=0$일 때, 급수 $\\sum a_n$에 대하여 옳은 것은?', correct: '수렴하는지 발산하는지 이것만으로는 알 수 없다', wrong: ['반드시 수렴한다', '반드시 발산한다'], why: '$\\lim a_n=0$은 수렴하기 위한 필요조건일 뿐 충분조건이 아니에요 (예: $\\sum\\frac1n$은 발산)' };
        return { q: `$\\lim_{n\\to\\infty}a_n=${L === 0.5 ? '\\dfrac12' : L}$일 때, 급수 $\\sum_{n=1}^\\infty a_n$은?`, correct: '발산한다', wrong: ['수렴한다', '합이 $0$이다', '알 수 없다'], why: '급수가 수렴하면 $\\lim a_n=0$이어야 하므로, $\\lim a_n\\ne0$이면 발산' };
      } },
      { id: 'cond', lv: [4, 5], card: 'c2', make: (R) => {
        const k = R.int(2, 6);
        return { q: `등비급수 $\\sum_{n=1}^\\infty\\left(\\dfrac{x}{${k}}\\right)^n$이 수렴하도록 하는 정수 $x$의 개수는?`, a: 2 * k - 1, wrong: W(2 * k - 1, 2 * k, k, 2 * k + 1), why: `공비 $\\left|\\dfrac x${k}\\right|<1$ → $-${k}<x<${k}$ → 정수 $x=-${k - 1},\\dots,${k - 1}$ : $${2 * k - 1}$개` };
      } },
    ],
  },

  // ───────────── 미분법 ─────────────
  {
    id: 'c.explim',
    lesson: [
      { id: 'c1', t: '$e$와 극한', b: T`- $\lim_{x\to0}(1+x)^{\frac1x}=e$, $\lim_{x\to\infty}\left(1+\dfrac1x\right)^x=e$
        - $\lim_{x\to0}\dfrac{e^x-1}{x}=1$, $\lim_{x\to0}\dfrac{\ln(1+x)}{x}=1$
        - $\lim_{x\to0}\dfrac{a^x-1}{x}=\ln a$

        $x$ 앞에 계수가 붙으면: $\lim\dfrac{e^{kx}-1}{x}=k$, $\lim\dfrac{\ln(1+kx)}{x}=k$` },
      { id: 'c2', t: '지수·로그함수의 미분', b: T`- $(e^x)'=e^x$, $(a^x)'=a^x\ln a$
        - $(\ln x)'=\dfrac1x$, $(\log_ax)'=\dfrac1{x\ln a}$

        예) $f(x)=2^x$ → $f'(x)=2^x\ln2$ → $f'(0)=\ln 2$` },
    ],
    gens: [
      { id: 'lim1', lv: [1, 3], card: 'c1', make: (R) => {
        const k = R.nz(-4, 5); const kind = R.pick(['exp', 'ln']);
        const kx = co(k, 'x'); const q = kind === 'exp' ? `$\\lim_{x\\to0}\\dfrac{e^{${kx}}-1}{x}$` : `$\\lim_{x\\to0}\\dfrac{\\ln(1${k > 0 ? '+' : ''}${kx})}{x}$`;
        return { q: `${q}의 값은?`, a: k, wrong: W(k, 1, -k, 0), why: kind === 'exp' ? `$\\dfrac{e^{${kx}}-1}{x}=\\dfrac{e^{${kx}}-1}{${kx}}\\times${k}\\to1\\times${k}=${k}$` : `$\\dfrac{\\ln(1${k > 0 ? '+' : ''}${kx})}{x}=\\dfrac{\\ln(1${k > 0 ? '+' : ''}${kx})}{${kx}}\\times${k}\\to1\\times${k}=${k}$` };
      } },
      { id: 'ratio', lv: [3, 5], card: 'c1', make: (R) => {
        const a = R.nz(-5, 5), b = R.nz(-5, 5);
        return { q: `$\\lim_{x\\to0}\\dfrac{e^{${co(a, 'x')}}-1}{${co(b, 'x')}}$의 값은?`, ...FO(a, b, fS(b, a), '1'), why: `$\\dfrac{e^{${a}x}-1}{${a}x}\\times\\dfrac{${a}x}{${b}x}\\to1\\times\\dfrac{${a}}{${b}}=${fS(a, b)}$` };
      } },
      { id: 'e', lv: [3, 5], card: 'c1', make: (R) => {
        const k = R.int(2, 5); const kind = R.pick(['inf', 'zero']);
        if (kind === 'inf') return { q: `$\\lim_{x\\to\\infty}\\left(1+\\dfrac{${k}}{x}\\right)^x$의 값은?`, ...CS(`e^{${k}}`, [`${k}e`, 'e', `e^{${1}/${k}}`.replace('e^{1/' + k + '}', `e^{\\frac1${k}}`)]), why: `$\\left(1+\\dfrac{${k}}{x}\\right)^{x}=\\left\\{\\left(1+\\dfrac{${k}}{x}\\right)^{\\frac x${k}}\\right\\}^{${k}}\\to e^{${k}}$` };
        return { q: `$\\lim_{x\\to0}(1+${k}x)^{\\frac1x}$의 값은?`, ...CS(`e^{${k}}`, [`${k}e`, 'e', `e^{\\frac1${k}}`]), why: `$(1+${k}x)^{\\frac1x}=\\left\\{(1+${k}x)^{\\frac1{${k}x}}\\right\\}^{${k}}\\to e^{${k}}$` };
      } },
      { id: 'der', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.nz(-4, 5), b = R.nz(-4, 5);
        const f = `${co(a, 'e^x')}${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\\ln x`;
        const ans = `${co(a, 'e')}${sx(b)}`;
        return { q: `$f(x)=${f}$일 때 $f'(1)$의 값은?`, ...CS(ans, [`${co(a, 'e')}${sx(-b)}`, `${co(a, 'e')}`, `${a}${sx(b)}`, `${co(a, 'e')}${sx(2 * b)}`]), why: `$f'(x)=${co(a, 'e^x')}${b > 0 ? '+' : '-'}\\dfrac{${Math.abs(b)}}{x}$ → $f'(1)=${ans}$` };
      } },
      { id: 'ax', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.pick([2, 3, 5]); const x0 = R.pick([0, 1]);
        const ans = x0 === 0 ? `\\ln ${a}` : `${a}\\ln ${a}`;
        return { q: `$f(x)=${a}^x$일 때 $f'(${x0})$의 값은?`, ...CS(ans, [`${a}`, `\\ln ${a}${x0 === 0 ? '+1' : ''}`.replace(/^\\ln (\d)\+1$/, '\\ln $1+1'), `${a}^${x0}`, x0 === 0 ? '1' : `${a}`, `\\dfrac{${a}}{\\ln ${a}}`]), why: `$(a^x)'=a^x\\ln a$ → $f'(x)=${a}^x\\ln ${a}$ → $f'(${x0})=${ans}$` };
      } },
    ],
  },
  {
    id: 'c.trig',
    lesson: [
      { id: 'c1', t: '삼각함수의 덧셈정리·배각', b: T`- $\sin(\alpha\pm\beta)=\sin\alpha\cos\beta\pm\cos\alpha\sin\beta$
        - $\cos(\alpha\pm\beta)=\cos\alpha\cos\beta\mp\sin\alpha\sin\beta$
        - $\sin2\alpha=2\sin\alpha\cos\alpha$
        - $\cos2\alpha=\cos^2\alpha-\sin^2\alpha=1-2\sin^2\alpha=2\cos^2\alpha-1$` },
      { id: 'c2', t: '삼각함수의 극한', b: T`$x$는 라디안일 때
        - $\lim_{x\to0}\dfrac{\sin x}{x}=1$, $\lim_{x\to0}\dfrac{\tan x}{x}=1$
        - $\lim_{x\to0}\dfrac{\sin kx}{x}=k$, $\lim_{x\to0}\dfrac{\sin ax}{\sin bx}=\dfrac ab$
        - $\lim_{x\to0}\dfrac{1-\cos x}{x^2}=\dfrac12$ (분자·분모에 $1+\cos x$를 곱함)` },
      { id: 'c3', t: '삼각함수의 미분', b: T`- $(\sin x)'=\cos x$
        - $(\cos x)'=-\sin x$
        - $(\tan x)'=\sec^2x$ ($\sec x=\dfrac1{\cos x}$)
        - 합성: $\{\sin(ax)\}'=a\cos(ax)$` },
    ],
    gens: [
      { id: 'add', lv: [2, 5], card: 'c1', make: (R) => {
        const [a, b, c] = R.pick(TRI), [p, q, r] = R.pick(TRI); const kind = R.pick(['s+', 'c+', 's-']);
        // sinα=a/c cosα=b/c ; sinβ=p/r cosβ=q/r
        const D = c * r; let n; let name;
        if (kind === 's+') { n = a * q + b * p; name = '\\sin(\\alpha+\\beta)'; } else if (kind === 'c+') { n = b * q - a * p; name = '\\cos(\\alpha+\\beta)'; } else { n = a * q - b * p; name = '\\sin(\\alpha-\\beta)'; }
        const wrong = kind === 's+' ? [fS(a * q - b * p, D), fS(a * p + b * q, D)] : kind === 'c+' ? [fS(b * q + a * p, D), fS(a * q + b * p, D)] : [fS(a * q + b * p, D), fS(a * p - b * q, D)];
        return { q: `$\\alpha,\\beta$가 예각이고 $\\sin\\alpha=\\dfrac{${a}}{${c}}$, $\\sin\\beta=\\dfrac{${p}}{${r}}$일 때 $${name}$의 값은?`, ...FO(n, D, ...wrong), why: `$\\cos\\alpha=\\dfrac{${b}}{${c}}$, $\\cos\\beta=\\dfrac{${q}}{${r}}$ → $${name}=${kind === 's+' ? `\\dfrac{${a}}{${c}}\\cdot\\dfrac{${q}}{${r}}+\\dfrac{${b}}{${c}}\\cdot\\dfrac{${p}}{${r}}` : kind === 'c+' ? `\\dfrac{${b}}{${c}}\\cdot\\dfrac{${q}}{${r}}-\\dfrac{${a}}{${c}}\\cdot\\dfrac{${p}}{${r}}` : `\\dfrac{${a}}{${c}}\\cdot\\dfrac{${q}}{${r}}-\\dfrac{${b}}{${c}}\\cdot\\dfrac{${p}}{${r}}`}=${fS(n, D)}$` };
      } },
      { id: 'double', lv: [2, 4], card: 'c1', make: (R) => {
        const [a, b, c] = R.pick(TRI); const kind = R.chance(0.5);
        if (kind) return { q: `$\\alpha$가 예각이고 $\\sin\\alpha=\\dfrac{${a}}{${c}}$일 때 $\\sin2\\alpha$의 값은?`, ...FO(2 * a * b, c * c, fS(2 * a, c), fS(a * a, c * c)), why: `$\\cos\\alpha=\\dfrac{${b}}{${c}}$ → $\\sin2\\alpha=2\\sin\\alpha\\cos\\alpha=\\dfrac{${2 * a * b}}{${c * c}}=${fS(2 * a * b, c * c)}$` };
        const n = c * c - 2 * a * a; return { q: `$\\sin\\alpha=\\dfrac{${a}}{${c}}$일 때 $\\cos2\\alpha$의 값은?`, ...FO(n, c * c, fS(2 * a * b, c * c), fS(c * c - a * a, c * c)), why: `$\\cos2\\alpha=1-2\\sin^2\\alpha=1-\\dfrac{${2 * a * a}}{${c * c}}=${fS(n, c * c)}$` };
      } },
      { id: 'lim', lv: [1, 5], card: 'c2', make: (R) => {
        const k = R.pick(['sin', 'tan', 'ratio', 'cos']); const a = R.int(2, 6), b = R.int(2, 6);
        if (k === 'sin') return { q: `$\\lim_{x\\to0}\\dfrac{\\sin ${a}x}{x}$의 값은?`, a, wrong: W(a, 1, 0, a * a), why: `$\\dfrac{\\sin${a}x}{${a}x}\\times${a}\\to${a}$` };
        if (k === 'tan') return { q: `$\\lim_{x\\to0}\\dfrac{\\tan ${a}x}{x}$의 값은?`, a, wrong: W(a, 1, 0), why: `$\\dfrac{\\tan${a}x}{${a}x}\\times${a}\\to${a}$` };
        if (k === 'ratio') { if (a === b) return { q: '$\\lim_{x\\to0}\\dfrac{\\sin 2x}{\\sin 3x}$의 값은?', ...FO(2, 3, '1', fS(3, 2)), why: '$\\dfrac{\\sin2x}{2x}\\cdot\\dfrac{3x}{\\sin3x}\\cdot\\dfrac{2}{3}\\to\\dfrac23$' }; return { q: `$\\lim_{x\\to0}\\dfrac{\\sin ${a}x}{\\sin ${b}x}$의 값은?`, ...FO(a, b, fS(b, a), '1'), why: `$\\dfrac{\\sin${a}x}{${a}x}\\cdot\\dfrac{${b}x}{\\sin${b}x}\\cdot\\dfrac{${a}}{${b}}\\to\\dfrac{${a}}{${b}}=${fS(a, b)}$` }; }
        return { q: `$\\lim_{x\\to0}\\dfrac{1-\\cos ${a}x}{x^2}$의 값은?`, ...FO(a * a, 2, fS(a, 2), `${a * a}`), why: `분자·분모에 $1+\\cos${a}x$: $\\dfrac{\\sin^2${a}x}{x^2(1+\\cos${a}x)}\\to\\dfrac{${a}^2}{2}=${fS(a * a, 2)}$` };
      } },
      { id: 'der', lv: [1, 4], card: 'c3', make: (R) => {
        const a = R.nz(-4, 5), b = R.nz(-4, 5); const pts = [[0, '0'], [1, '\\dfrac\\pi2'], [2, '\\pi'], [3, '\\dfrac{3\\pi}{2}']]; const [i, lab] = R.pick(pts);
        const sinV = [0, 1, 0, -1][i], cosV = [1, 0, -1, 0][i]; const ans = a * cosV - b * sinV;
        return { q: `$f(x)=${co(a, '\\sin x')}${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\\cos x$일 때 $f'\\left(${lab}\\right)$의 값은?`, a: ans, wrong: W(ans, a * sinV + b * cosV, a * cosV + b * sinV, -ans), why: `$f'(x)=${co(a, '\\cos x')}${b > 0 ? '-' : '+'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\\sin x$ → $\\cos=${cosV}$, $\\sin=${sinV}$ 대입: $${ans}$` };
      } },
    ],
  },
  {
    id: 'c.rules',
    lesson: [
      { id: 'c1', t: '몫의 미분법·합성함수의 미분', b: T`- $\left\{\dfrac fg\right\}'=\dfrac{f'g-fg'}{g^2}$
        - ==합성함수==(연쇄법칙): $\{f(g(x))\}'=f'(g(x))\cdot g'(x)$ ("바깥 미분 × 안쪽 미분")
        - $\{(ax+b)^n\}'=na(ax+b)^{n-1}$, $(e^{g})'=g'e^{g}$, $\{\sin g\}'=g'\cos g$, $\{\ln g\}'=\dfrac{g'}{g}$` },
      { id: 'c2', t: '매개변수·음함수·역함수', b: T`- 매개변수 $x=f(t),y=g(t)$: $\dfrac{dy}{dx}=\dfrac{g'(t)}{f'(t)}$
        - 음함수: 양변을 $x$로 미분 ($y$는 $x$의 함수이므로 $y^2\to2y\dfrac{dy}{dx}$)
        - 역함수: $(f^{-1})'(b)=\dfrac1{f'(a)}$ ($f(a)=b$)` },
      { id: 'c3', t: '곱의 미분 복습과 이계도함수', b: T`$\{fg\}'=f'g+fg'$ 를 지수·로그·삼각함수에도 그대로 써요.
        예) $(xe^x)'=e^x+xe^x=(1+x)e^x$

        $f''(x)$는 $f'(x)$를 한 번 더 미분한 것 (이계도함수).` },
    ],
    gens: [
      { id: 'chain', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.nz(-3, 3), b = R.int(-3, 3), n = R.int(2, 4), x0 = R.int(-1, 2); const ans = n * a * (a * x0 + b) ** (n - 1);
        return { q: `$f(x)=(${co(a, 'x')}${sx(b)})^{${n}}$일 때 $f'(${x0})$의 값은?`, a: ans, wrong: W(ans, n * (a * x0 + b) ** (n - 1), a * (a * x0 + b) ** (n - 1), (a * x0 + b) ** n), why: `$f'(x)=${n}\\cdot${pr(a)}(${co(a, 'x')}${sx(b)})^{${n - 1}}$ → $x=${x0}$: $${ans}$` };
      } },
      { id: 'chain2', lv: [2, 4], card: 'c1', make: (R) => {
        const k = R.nz(-4, 5); const kind = R.pick(['e', 'sin', 'ln']);
        const inner = `x^2${k > 0 ? '+' : '-'}${Math.abs(k) === 1 ? '' : Math.abs(k)}x`;
        if (kind === 'e') return { q: `$f(x)=e^{${inner}}$일 때 $f'(0)$의 값은?`, a: k, wrong: W(k, 0, 1, -k), why: `$f'(x)=(2x${sx(k)})e^{${inner}}$ → $f'(0)=${k}\\times e^0=${k}$` };
        if (kind === 'sin') return { q: `$f(x)=\\sin(${inner})$일 때 $f'(0)$의 값은?`, a: k, wrong: W(k, 0, 1, -k), why: `$f'(x)=(2x${sx(k)})\\cos(${inner})$ → $f'(0)=${k}\\cos0=${k}$` };
        return { q: `$f(x)=\\ln(${inner}+1)$일 때 $f'(0)$의 값은?`, a: k, wrong: W(k, 0, 1, -k), why: `$f'(x)=\\dfrac{2x${sx(k)}}{${inner}+1}$ → $f'(0)=\\dfrac{${k}}{1}=${k}$` };
      } },
      { id: 'quot', lv: [3, 5], card: 'c1', make: (R) => {
        const a = R.nz(-3, 3), b = R.int(-3, 3), c = R.nz(-3, 3), d = R.int(-3, 3), x0 = R.int(0, 2);
        const den = c * x0 + d; if (den === 0 || a * d - b * c === 0) return { q: '$f(x)=\\dfrac{x+1}{x-1}$일 때 $f\'(2)$의 값은?', a: -2, wrong: [2, -1, 1], why: '$f\'=\\dfrac{1\\cdot(x-1)-(x+1)\\cdot1}{(x-1)^2}=\\dfrac{-2}{(x-1)^2}$ → $f\'(2)=-2$' };
        const n = a * d - b * c;
        return { q: `$f(x)=\\dfrac{${co(a, 'x')}${sx(b)}}{${co(c, 'x')}${sx(d)}}$일 때 $f'(${x0})$의 값은?`, ...FO(n, den * den, fS(a, c), fS(n, den)), why: `$f'(x)=\\dfrac{${a}(${co(c, 'x')}${sx(d)})-(${co(a, 'x')}${sx(b)})\\cdot${c}}{(${co(c, 'x')}${sx(d)})^2}=\\dfrac{${n}}{(${co(c, 'x')}${sx(d)})^2}$ → $x=${x0}$: $${fS(n, den * den)}$` };
      } },
      { id: 'prod', lv: [2, 4], card: 'c3', make: (R) => {
        const k = R.int(1, 4); const kind = R.pick(['xe', 'xln']);
        if (kind === 'xe') return { q: `$f(x)=x^{${k}}e^x$일 때 $f'(1)$의 값은?`, ...CS(`${k + 1}e`, [`${k}e`, `${k}e+1`, 'e', `${k + 2}e`]), why: `$f'(x)=${k}x^{${k - 1}}e^x+x^{${k}}e^x$ → $f'(1)=${k}e+e=${k + 1}e$` };
        return { q: `$f(x)=${k === 1 ? '' : k}x\\ln x$일 때 $f'(e)$의 값은?`, a: 2 * k, wrong: W(2 * k, k, k * (1 + 0), 2 * k + 1), why: `$f'(x)=${k}(\\ln x+1)$ → $f'(e)=${k}(1+1)=${2 * k}$` };
      } },
      { id: 'param', lv: [3, 5], card: 'c2', make: (R) => {
        const p = R.int(1, 3), r = R.int(1, 3), s = R.int(-3, 3), t0 = R.int(1, 2); const q0 = R.int(0, 3);
        const dx = 2 * p * t0, dy = 3 * r * t0 * t0 + s;
        return { q: `$x=${co(p, 't^2')}${sx(q0)}$, $y=${co(r, 't^3')}${s === 0 ? '' : `${s > 0 ? '+' : '-'}${Math.abs(s) === 1 ? '' : Math.abs(s)}t`}$일 때 $t=${t0}$에서 $\\dfrac{dy}{dx}$의 값은?`, ...FO(dy, dx, fS(dx, dy), fS(3 * r * t0 * t0, dx)), why: `$\\dfrac{dx}{dt}=${2 * p}t$, $\\dfrac{dy}{dt}=${3 * r}t^2${sx(s)}$ → $t=${t0}$: $${EQ(dy, dx)}$` };
      } },
      { id: 'impl', lv: [4, 5], card: 'c2', make: (R) => {
        const [x0, y0, r] = R.pick(TRI); const sg = R.pick([1, -1]); const sgx = R.pick([1, -1]);
        const X = sgx * x0, Y = sg * y0;
        return { q: `곡선 $x^2+y^2=${r * r}$ 위의 점 $(${X},${Y})$에서 $\\dfrac{dy}{dx}$의 값은?`, ...FO(-X, Y, fS(X, Y), fS(Y, X), fS(-Y, X)), why: `양변을 $x$로 미분: $2x+2y\\dfrac{dy}{dx}=0$ → $\\dfrac{dy}{dx}=-\\dfrac xy=${fS(-X, Y)}$` };
      } },
      { id: 'inv', lv: [4, 5], card: 'c2', make: (R) => {
        const k = R.int(0, 4);
        return { q: `$f(x)=x^3+${k === 0 ? '' : `${k}`}x${k === 0 ? '' : ''}$의 역함수를 $g$라 할 때 $g'(${1 + k})$의 값은?`.replace('x^3+x', 'x^3+x'), ...FO(1, 3 + k, fS(3 + k, 1), fS(1, 1 + k)), why: `$f(1)=${1 + k}$이므로 $g'(${1 + k})=\\dfrac1{f'(1)}$. $f'(x)=3x^2+${k}$ → $f'(1)=${3 + k}$ → $\\dfrac1{${3 + k}}$` };
      } },
    ],
  },
  {
    id: 'c.app',
    lesson: [
      { id: 'c1', t: '접선과 극값', b: T`지수·로그·삼각함수에서도 방법은 똑같아요.
        - 접선: $y-f(a)=f'(a)(x-a)$
        - 극값: $f'(x)=0$인 곳에서 부호 변화 확인 → 값 대입
        - 예) $f(x)=x-\ln x$: $f'(x)=1-\dfrac1x=0$ → $x=1$에서 극소, 극솟값 $1$` },
      { id: 'c2', t: '이계도함수와 그래프의 모양', b: T`- $f''(x)>0$인 구간: ==아래로 볼록(U 모양)==
        - $f''(x)<0$인 구간: ==위로 볼록(∩ 모양)==
        - $f''$의 부호가 바뀌는 점: ==변곡점==
        - $f'(a)=0$일 때 $f''(a)>0$ → 극소, $f''(a)<0$ → 극대` },
      { id: 'c3', t: '속도와 가속도 (미적분판)', b: T`위치 $x(t)$ → 속도 $v=x'(t)$, 가속도 $a=v'(t)=x''(t)$
        삼각·지수 함수가 섞여도 미분만 하면 돼요. 속력은 $|v(t)|$.` },
    ],
    gens: [
      { id: 'tan', lv: [2, 4], card: 'c1', make: (R) => {
        const a = R.nz(-4, 5), b = R.nz(-4, 5); const kind = R.pick(['e', 'ln']);
        if (kind === 'e') return { q: `곡선 $y=${co(a, 'e^x')}${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}x$ 위의 $x=0$인 점에서의 접선의 기울기는?`, a: a + b, wrong: W(a + b, a, b, a - b), why: `$y'=${co(a, 'e^x')}${sx(b)}$ → $x=0$: $${a}${sx(b)}=${a + b}$` };
        return { q: `곡선 $y=\\ln x${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}x$ 위의 $x=1$인 점에서의 접선의 기울기는?`, a: 1 + b, wrong: W(1 + b, b, 1, b - 1), why: `$y'=\\dfrac1x${sx(b)}$ → $x=1$: $1${sx(b)}=${1 + b}$` };
      } },
      { id: 'ext', lv: [3, 5], card: 'c1', make: (R) => {
        const kind = R.pick(['xe', 'x2e', 'xln']);
        if (kind === 'xe') return { q: '$f(x)=xe^{-x}$의 극댓값은?', ...CS('\\dfrac1e', ['e', '0', '\\dfrac{2}{e}', '\\dfrac{1}{e^2}']), why: '$f\'(x)=(1-x)e^{-x}=0$ → $x=1$에서 극대. $f(1)=\\dfrac1e$' };
        if (kind === 'x2e') return { q: '$f(x)=x^2e^{-x}$의 극댓값은?', ...CS('4e^{-2}', ['2e^{-1}', '4e^{-1}', '0', 'e^{-2}']), why: '$f\'(x)=(2x-x^2)e^{-x}=x(2-x)e^{-x}$ → $x=2$에서 극대. $f(2)=4e^{-2}$' };
        const a = R.int(1, 3); const ans = a === 1 ? '1' : `${a}-${a}\\ln ${a}`;
        return { q: `$x>0$에서 $f(x)=x-${a === 1 ? '' : a}\\ln x$의 극솟값은?`, ...CS(ans, [`${a}`, `${a}+${a}\\ln ${a}`, '0', `${a}-\\ln ${a}`]), why: `$f'(x)=1-\\dfrac${a}x=0$ → $x=${a}$에서 극소. $f(${a})=${a === 1 ? '1-0=1' : `${a}-${a}\\ln${a}`}$` };
      } },
      { id: 'conc', lv: [3, 5], card: 'c2', make: (R) => {
        const k = R.int(-3, 4), m = R.int(-6, 6), c = R.int(-3, 3);
        return { q: `곡선 $y=x^3${k === 0 ? '' : `${-3 * k > 0 ? '+' : '-'}${Math.abs(3 * k)}x^2`}${lx(m)}${sx(c)}$의 변곡점의 $x$좌표는?`, a: k, wrong: W(k, -k, 3 * k, 0), why: `$y''=6x${sx(-6 * k)}=6(x${k === 0 ? '' : sx(-k)})$ → 부호가 바뀌는 $x=${k}$` };
      } },
      { id: 'motion', lv: [2, 5], card: 'c3', make: (R) => {
        const a = R.nz(-4, 5), b = R.nz(-4, 5); const kind = R.pick(['v', 'a']);
        if (kind === 'v') return { q: `수직선 위를 움직이는 점의 시각 $t$에서의 위치가 $x(t)=${co(a, 't')}${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\\sin t$일 때, $t=\\pi$에서의 속도는?`, a: a - b, wrong: W(a - b, a + b, b, a), why: `$v(t)=${a}${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\\cos t$ → $v(\\pi)=${a}${b > 0 ? '+' : '-'}${Math.abs(b)}\\cdot(-1)=${a - b}$` };
        return { q: `점의 위치가 $x(t)=${co(a, 't')}${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\\sin t$일 때, $t=\\dfrac\\pi2$에서의 가속도는?`, a: -b, wrong: W(-b, b, a, a - b), why: `$v=${a}${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\\cos t$, $a(t)=${co(-b, '\\sin t')}$ → $a\\left(\\dfrac\\pi2\\right)=${-b}$` };
      } },
    ],
  },

  // ───────────── 적분법 ─────────────
  {
    id: 'c.int',
    lesson: [
      { id: 'c1', t: '지수·삼각함수의 적분', b: T`- $\int e^x\,dx=e^x+C$, $\int a^x\,dx=\dfrac{a^x}{\ln a}+C$
        - $\int\dfrac1x\,dx=\ln|x|+C$
        - $\int\sin x\,dx=-\cos x+C$, $\int\cos x\,dx=\sin x+C$, $\int\sec^2x\,dx=\tan x+C$

        미분의 거꾸로예요. 부호(−)와 $\ln$ 조심!` },
      { id: 'c2', t: '치환적분', b: T`$g(x)=t$로 놓으면 $g'(x)dx=dt$
        $$\int f(g(x))g'(x)\,dx=\int f(t)\,dt$$
        ==정적분은 구간도 같이 바꿔요==: $x:a\to b$ ⇒ $t:g(a)\to g(b)$
        예) $\int_0^1 2xe^{x^2}dx$: $t=x^2$ → $\int_0^1e^tdt=e-1$` },
      { id: 'c3', t: '부분적분', b: T`$$\int f(x)g'(x)\,dx=f(x)g(x)-\int f'(x)g(x)\,dx$$
        예) $\int xe^x\,dx=xe^x-\int e^x\,dx=(x-1)e^x+C$
        미분하면 간단해지는 쪽(보통 $x$, $\ln x$)을 $f$로 잡아요.` },
    ],
    gens: [
      { id: 'basic', lv: [1, 3], card: 'c1', make: (R) => {
        const k = R.pick(['sin', 'cos', 'e', 'inv']);
        if (k === 'sin') { const a = R.int(1, 6); return { q: `$\\int_0^{\\pi}${a === 1 ? '' : a}\\sin x\\,dx$의 값은?`, a: 2 * a, wrong: W(2 * a, a, 0, -2 * a), why: `$[-${a === 1 ? '' : a}\\cos x]_0^{\\pi}=${a}+${a}=${2 * a}$` }; }
        if (k === 'cos') { const a = R.int(1, 6), b = R.int(1, 6); return { q: `$\\int_0^{\\frac\\pi2}(${co(a, '\\cos x')}+${co(b, '\\sin x')})\\,dx$의 값은?`, a: a + b, wrong: W(a + b, a - b, a * b, 0), why: `$[${co(a, '\\sin x')}-${co(b, '\\cos x')}]_0^{\\frac\\pi2}=${a}+${b}=${a + b}$` }; }
        if (k === 'e') { const m = R.int(2, 5), a = R.int(1, 4); return { q: `$\\int_0^{\\ln ${m}}${a === 1 ? '' : a}e^x\\,dx$의 값은?`, a: a * (m - 1), wrong: W(a * (m - 1), a * m, a, a * (m + 1)), why: `$[${co(a, 'e^x')}]_0^{\\ln${m}}=${a}\\times${m}-${a}=${a * (m - 1)}$` }; }
        const m = R.int(1, 4), a = R.int(1, 5); return { q: `$\\int_1^{e^{${m}}}\\dfrac{${a}}{x}\\,dx$의 값은?`, a: a * m, wrong: W(a * m, a, m, a * m + a), why: `$[${a}\\ln x]_1^{e^{${m}}}=${a}\\times${m}-0=${a * m}$` };
      } },
      { id: 'subst', lv: [3, 5], card: 'c2', make: (R) => {
        const n = R.int(2, 4); const k = R.pick(['pow', 'ln', 'sin']);
        if (k === 'pow') return { q: `$\\int_0^1 2x(x^2+1)^{${n}}\\,dx$의 값은?`, ...FO(2 ** (n + 1) - 1, n + 1, fS(2 ** n, n), fS(2 ** (n + 1), n + 1)), why: `$t=x^2+1$, $dt=2x\\,dx$ → $\\int_1^2t^{${n}}dt=\\left[\\dfrac{t^{${n + 1}}}{${n + 1}}\\right]_1^2=\\dfrac{${2 ** (n + 1)}-1}{${n + 1}}=${fS(2 ** (n + 1) - 1, n + 1)}$` };
        if (k === 'ln') return { q: `$\\int_1^e\\dfrac{(\\ln x)^{${n}}}{x}\\,dx$의 값은?`, ...FO(1, n + 1, fS(1, n), '1'), why: `$t=\\ln x$, $dt=\\dfrac1xdx$ → $\\int_0^1t^{${n}}dt=\\dfrac1{${n + 1}}$` };
        return { q: `$\\int_0^{\\frac\\pi2}\\sin^{${n}}x\\cos x\\,dx$의 값은?`, ...FO(1, n + 1, fS(1, n), '1'), why: `$t=\\sin x$, $dt=\\cos x\\,dx$ → $\\int_0^1t^{${n}}dt=\\dfrac1{${n + 1}}$` };
      } },
      { id: 'parts', lv: [4, 5], card: 'c3', make: (R) => {
        const a = R.int(1, 5); const k = R.pick(['xe', 'ln']);
        if (k === 'xe') return { q: `$\\int_0^1 ${a === 1 ? '' : a}xe^x\\,dx$의 값은?`, a, wrong: W(a, a * (1 - 0) + 1, a * Math.round(Math.E), 0), why: `부분적분: $\\int xe^xdx=xe^x-e^x$ → $[xe^x-e^x]_0^1=(e-e)-(0-1)=1$ → ${a}배: $${a}$` };
        return { q: `$\\int_1^e ${a === 1 ? '' : a}\\ln x\\,dx$의 값은?`, a, wrong: W(a, a * 2, 0, a * 3), why: `부분적분: $\\int\\ln x\\,dx=x\\ln x-x$ → $[x\\ln x-x]_1^e=(e-e)-(0-1)=1$ → ${a}배: $${a}$` };
      } },
      { id: 'ind', lv: [2, 4], card: 'c1', make: (R) => {
        const a = R.nz(-3, 4), b = R.nz(-3, 4);
        const ans = `${co(a, 'e^x')}${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\\sin x+C`;
        const w1 = `${co(a, 'e^x')}${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\\cos x+C`;
        const w2 = `${co(a, 'e^x')}${b > 0 ? '-' : '+'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\\sin x+C`;
        const w3 = `${co(a, 'e^x')}${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\\sin x`;
        return { q: `$\\int(${co(a, 'e^x')}${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}\\cos x)\\,dx$는?`, ...CS(ans, [w1, w2, w3, `${co(a, 'xe^x')}${sx(b)}\\sin x+C`]), why: `$\\int e^xdx=e^x$, $\\int\\cos x\\,dx=\\sin x$ → $${ans}$` };
      } },
    ],
  },
  {
    id: 'c.area',
    lesson: [
      { id: 'c1', t: '넓이', b: T`$y=f(x)$와 $x$축 사이, $a\le x\le b$의 넓이 $\int_a^b|f(x)|dx$
        - 두 곡선 사이: $\int_a^b|f(x)-g(x)|dx$
        - 예) $y=\sin x$, $0\le x\le\pi$: $\int_0^\pi\sin x\,dx=2$` },
      { id: 'c2', t: '회전체의 부피', b: T`곡선 $y=f(x)$를 $x$축 둘레로 한 바퀴 돌린 입체 ($a\le x\le b$)
        $$V=\pi\int_a^b\{f(x)\}^2\,dx$$
        단면이 반지름 $f(x)$인 원판이라서 $\pi r^2$을 쌓는 거예요.` },
      { id: 'c3', t: '곡선의 길이와 속도·거리', b: T`- 곡선 $y=f(x)$의 길이: $\int_a^b\sqrt{1+\{f'(x)\}^2}\,dx$
        - 매개변수 곡선: $\int\sqrt{(x')^2+(y')^2}\,dt$
        - 점의 위치 변화량 $\int_a^bv(t)dt$, 움직인 거리 $\int_a^b|v(t)|dt$` },
    ],
    gens: [
      { id: 'area', lv: [1, 4], card: 'c1', make: (R) => {
        const k = R.pick(['sin', 'e', 'inv']);
        if (k === 'sin') { const a = R.int(1, 5); return { q: `곡선 $y=${a === 1 ? '' : a}\\sin x$ ($0\\le x\\le\\pi$)와 $x$축으로 둘러싸인 부분의 넓이는?`, a: 2 * a, wrong: W(2 * a, a, 0, 4 * a), why: `$\\int_0^\\pi${a === 1 ? '' : a}\\sin x\\,dx=[-${a === 1 ? '' : a}\\cos x]_0^\\pi=${2 * a}$` }; }
        if (k === 'e') { const m = R.int(2, 6); return { q: `곡선 $y=e^x$, $x$축, 직선 $x=0$, $x=\\ln${m}$로 둘러싸인 부분의 넓이는?`, a: m - 1, wrong: W(m - 1, m, 1, m + 1), why: `$\\int_0^{\\ln${m}}e^xdx=[e^x]_0^{\\ln${m}}=${m}-1=${m - 1}$` }; }
        const m = R.int(1, 4); return { q: `곡선 $y=\\dfrac1x$, $x$축, 직선 $x=1$, $x=e^{${m}}$으로 둘러싸인 부분의 넓이는?`, a: m, wrong: W(m, 1, m + 1, m * m), why: `$\\int_1^{e^{${m}}}\\dfrac1xdx=[\\ln x]_1^{e^{${m}}}=${m}$` };
      } },
      { id: 'between', lv: [3, 5], card: 'c1', make: () => ({ q: '구간 $\\left[0,\\dfrac\\pi4\\right]$에서 곡선 $y=\\cos x$와 $y=\\sin x$로 둘러싸인(두 곡선과 $y$축 사이) 부분의 넓이는?', ...CS('\\sqrt2-1', ['1', '\\dfrac{\\sqrt2}{2}', '\\sqrt2+1', '2-\\sqrt2']), why: '$\\int_0^{\\frac\\pi4}(\\cos x-\\sin x)dx=[\\sin x+\\cos x]_0^{\\frac\\pi4}=\\sqrt2-1$' }) },
      { id: 'vol', lv: [3, 5], card: 'c2', make: (R) => {
        const k = R.int(1, 3), a = R.int(2, 4); const kind = R.pick(['sqrt', 'line']);
        if (kind === 'sqrt') { const num = k * a * a; return { q: `곡선 $y=\\sqrt{${k === 1 ? '' : k}x}$ ($0\\le x\\le${a}$)를 $x$축 둘레로 회전시킨 입체의 부피를 $V$라 할 때 $\\dfrac V\\pi$의 값은?`, ...FO(num, 2, `${num}`, fS(num, 3)), why: `$V=\\pi\\int_0^{${a}}${k === 1 ? '' : k}x\\,dx=\\pi\\left[\\dfrac{${k === 1 ? '' : k}x^2}{2}\\right]_0^{${a}}=\\dfrac{${num}}{2}\\pi=${fS(num, 2)}\\pi$` }; }
        const num = k * k * a ** 3; return { q: `직선 $y=${k === 1 ? '' : k}x$ ($0\\le x\\le${a}$)를 $x$축 둘레로 회전시킨 입체(원뿔)의 부피를 $V$라 할 때 $\\dfrac V\\pi$의 값은?`, ...FO(num, 3, `${num}`, fS(num, 2)), why: `$V=\\pi\\int_0^{${a}}${k * k === 1 ? '' : k * k}x^2dx=\\pi\\left[\\dfrac{${k * k === 1 ? '' : k * k}x^3}{3}\\right]_0^{${a}}=\\dfrac{${num}}{3}\\pi$` };
      } },
      { id: 'len', lv: [4, 5], card: 'c3', make: (R) => {
        const m = R.int(2, 5); const a = m * m - 1; const num = 2 * (m ** 3 - 1);
        return { q: `곡선 $y=\\dfrac23x^{\\frac32}$ ($0\\le x\\le${a}$)의 길이는?`, ...FO(num, 3, fS(m ** 3 - 1, 3), fS(2 * m ** 3, 3)), why: `$y'=x^{\\frac12}$ → $\\int_0^{${a}}\\sqrt{1+x}\\,dx=\\left[\\dfrac23(1+x)^{\\frac32}\\right]_0^{${a}}=\\dfrac23(${m ** 3}-1)=${fS(num, 3)}$` };
      } },
      { id: 'dist', lv: [2, 4], card: 'c3', make: (R) => {
        const a = R.int(1, 6); const k = R.pick(['disp', 'dist']);
        if (k === 'disp') return { q: `점 $P$의 속도가 $v(t)=${a === 1 ? '' : a}\\cos t$일 때, $t=0$에서 $t=\\dfrac\\pi2$까지 위치의 변화량은?`, a, wrong: W(a, 0, 2 * a, -a), why: `$\\int_0^{\\frac\\pi2}${a === 1 ? '' : a}\\cos t\\,dt=[${a === 1 ? '' : a}\\sin t]_0^{\\frac\\pi2}=${a}$` };
        return { q: `점 $P$의 속도가 $v(t)=${a === 1 ? '' : a}\\cos t$일 때, $t=0$에서 $t=\\pi$까지 움직인 거리는?`, a: 2 * a, wrong: W(2 * a, 0, a, 4 * a), why: `$\\int_0^{\\pi}|${a === 1 ? '' : a}\\cos t|dt=2\\int_0^{\\frac\\pi2}${a === 1 ? '' : a}\\cos t\\,dt=${2 * a}$ (위치의 변화량은 $0$)` };
      } },
    ],
  },
];
