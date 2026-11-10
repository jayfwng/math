// 중2 ① 유리수와 순환소수 · 식의 계산 · 일차부등식 · 연립일차방정식
import { gcd, lcm, fr, linTex, polyTex, polyMul, polyAdd, polyScale, paren, pm, factorize } from '../js/lib.js';

const T = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const uniq = (arr, not) => [...new Set(arr.map(String))].filter((x) => x !== String(not));
const co = (n, s) => `${n === 1 ? '' : n === -1 ? '-' : n}${s}`;

// 이차 이하 다항식 계수 [x^2, x, 1]
const quad = (c) => polyTex(c);

export default [
  // ───────────── 유리수와 순환소수 ─────────────
  {
    id: 'm2.decimal',
    lesson: [
      { id: 'c1', t: '유한소수와 무한소수', b: T`분수를 소수로 나타내면 두 가지 중 하나예요.

        - ==유한소수==: 소수점 아래 숫자가 **끝나는** 소수. 예) $\frac14=0.25$
        - ==무한소수==: 소수점 아래 숫자가 **끝없이** 계속되는 소수. 예) $\frac13=0.333\cdots$

        무한소수 중 같은 숫자 배열이 **반복**되는 것을 ==순환소수==라고 해요.` },
      { id: 'c2', t: '순환마디와 표기', b: T`순환소수에서 **반복되는 가장 짧은 숫자 배열**을 ==순환마디==라 해요.

        $0.3333\cdots=0.\overline{3}$ (순환마디 3)
        $0.141414\cdots=0.\overline{14}$ (순환마디 14)
        $0.2353535\cdots=0.2\overline{35}$ (순환마디 35)

        순환마디의 **첫 숫자와 끝 숫자 위에 점**을 찍어서 쓰기도 해요.` },
      { id: 'c3', t: '소수점 아래 n번째 자리 숫자', b: T`순환마디의 길이로 **나머지**를 보면 돼요.

        $0.\overline{142857}$ (마디 길이 6)의 $20$번째 숫자는?
        $20\div6=3\cdots2$ → 마디의 **2번째** 숫자 = 4

        나머지가 0이면 마디의 **마지막** 숫자예요.` },
    ],
    gens: [
      { id: 'type', lv: [1, 2], card: 'c1', make: (R) => {
        const fin = R.pick([[1, 2, '0.5'], [1, 4, '0.25'], [3, 5, '0.6'], [3, 8, '0.375'], [7, 20, '0.35'], [9, 25, '0.36']]);
        const inf = R.pick([[1, 3, '0.333\\cdots'], [2, 3, '0.666\\cdots'], [1, 6, '0.1666\\cdots'], [5, 11, '0.4545\\cdots'], [1, 7, '0.142857142857\\cdots']]);
        const f = R.chance(0.5);
        const x = f ? fin : inf;
        return { q: `$\\dfrac{${x[0]}}{${x[1]}}$을 소수로 나타내면 $${x[2]}$예요. 이 소수는?`, correct: f ? '유한소수' : '무한소수 (순환소수)', wrong: f ? ['무한소수', '순환소수', '정수'] : ['유한소수', '정수', '자연수'], why: f ? '소수점 아래 숫자가 끝나므로 유한소수예요.' : '소수점 아래 숫자가 끝없이 반복되므로 순환소수(무한소수)예요.' };
      } },
      { id: 'mado', lv: [1, 3], card: 'c2', make: (R, lv) => {
        const len = lv === 1 ? R.int(1, 2) : R.int(2, 3);
        const digs = Array.from({ length: len }, () => R.int(0, 9));
        if (new Set(digs).size === 1 && len > 1) digs[0] = (digs[0] + 1) % 10;
        const pre = R.chance(0.5) ? [R.int(1, 9)] : [];
        const rep = digs.join('');
        const shown = pre.join('') + rep.repeat(3).slice(0, 7 - pre.length);
        return { q: `$0.${pre.join('')}${rep}${rep}${rep}\\cdots$의 순환마디는?`, correct: rep, wrong: uniq([pre.join('') + rep, rep.length > 1 ? rep[0] : rep + rep, rep.length > 1 ? rep.split('').reverse().join('') : (+rep + 1) % 10], rep).slice(0, 3), why: `계속 반복되는 가장 짧은 숫자 배열은 $${rep}$예요.` };
      } },
      { id: 'nth', lv: [3, 5], card: 'c3', make: (R, lv) => {
        const bank = [['142857', '1/7'], ['27', '3/11'], ['3', '1/3'], ['18', '2/11'], ['09', '1/11'], ['576923', '3/52']];
        const [m] = R.pick([['142857'], ['27'], ['18'], ['09'], ['1234'], ['405']]);
        const n = R.int(10, lv >= 4 ? 100 : 40);
        const d = m[(n - 1) % m.length];
        return { q: `$0.\\overline{${m}}$의 소수점 아래 ${n}번째 자리의 숫자는?`, a: +d, wrong: [(+d + 1) % 10, (+d + 2) % 10, (+d + 7) % 10], why: `순환마디의 길이는 ${m.length}이고 $${n}\\div ${m.length}$의 나머지는 $${n % m.length}$이에요.\n${n % m.length === 0 ? `나머지가 0이므로 마디의 마지막 숫자 $${d}$` : `마디의 ${n % m.length}번째 숫자 $${d}$`}.` };
      } },
    ],
  },
  {
    id: 'm2.fracdec',
    lesson: [
      { id: 'c1', t: '유한소수가 되는 조건', b: T`분수를 **기약분수**로 만들었을 때 **분모의 소인수가 2나 5뿐**이면 유한소수예요. (그 외의 소인수가 하나라도 있으면 순환소수)

        - $\frac{3}{20}$: $20=2^2\times5$ → 유한소수 ✅
        - $\frac{5}{12}$: $12=2^2\times3$ → 3이 있으니 순환소수 ❌
        - $\frac{6}{15}=\frac25$ → 기약분수로 먼저! 유한소수 ✅` },
      { id: 'c2', t: '기약분수 만들기가 먼저!', b: T`분모에 3이나 7 같은 소인수가 있어도 **분자와 약분되면** 유한소수가 될 수 있어요.

        $\frac{9}{30}=\frac{3}{10}$ → 유한소수 ✅ (분자의 3과 약분)

        그래서 순서는 ① 기약분수로 만든다 → ② 분모를 소인수분해한다 → ③ 2, 5 외의 소인수가 있는지 본다.` },
      { id: 'c3', t: '곱할 수 / 구할 수 찾기', b: T`$\frac{a}{2\times3\times5}$가 유한소수가 되려면 분모의 **3을 약분**해야 하므로 $a$는 3의 배수여야 해요.

        가장 작은 자연수 $a=3$.

        (분모의 2, 5 외의 소인수를 모두 찾아서 곱한 수가 **가장 작은 답**)` },
    ],
    gens: [
      { id: 'is', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const fin = R.pick([[3, 20], [7, 40], [9, 50], [11, 80], [13, 25], [17, 100]]);
        const bad = R.pick([[5, 12], [7, 18], [2, 21], [11, 30], [4, 7], [5, 24]]);
        const yes = R.chance(0.5);
        const ok = yes ? fin : bad;
        const others = yes ? [bad, R.pick([[1, 3], [5, 6], [1, 14]]), R.pick([[1, 7], [2, 9], [3, 11]])] : [fin, R.pick([[1, 4], [3, 8]]), R.pick([[7, 10], [9, 16]])];
        const t = (p) => `$\\dfrac{${p[0]}}{${p[1]}}$`;
        return { q: `다음 중 유한소수로 나타낼 수 ${yes ? '있는' : '없는'} 것은?`, correct: t(ok), wrong: others.map(t), why: `기약분수의 분모를 소인수분해해요. $${ok[1]}=${factorize(ok[1]).map(([p, e]) => (e > 1 ? `${p}^{${e}}` : p)).join('\\times')}$ → ${yes ? '2, 5뿐이라 유한소수' : '2, 5 외의 소인수가 있어서 순환소수'}예요.` };
      } },
      { id: 'red', lv: [3, 4], card: 'c2', make: (R) => {
        const [n, d, cl] = R.pick([[9, 30, '$\\frac{3}{10}$'], [14, 35, '$\\frac{2}{5}$'], [21, 60, '$\\frac{7}{20}$'], [6, 15, '$\\frac{2}{5}$'], [33, 55, '$\\frac{3}{5}$']]);
        return { q: `$\\dfrac{${n}}{${d}}$을 소수로 나타내면 유한소수일까요, 순환소수일까요?`, correct: '유한소수', wrong: ['순환소수', '알 수 없다'], why: `먼저 약분해요. $\\dfrac{${n}}{${d}}=${cl.slice(1, -1)}$\n분모가 2, 5만으로 이루어져 있으니 유한소수예요.` };
      } },
      { id: 'find', lv: [3, 5], card: 'c3', make: (R, lv) => {
        const k = R.pick([3, 7, 9, 11, 13, 21]);
        const base = R.pick([[2, 5], [4, 5], [2, 25], [8, 5], [4, 25]]);
        const den = k * base[0] * base[1];
        return { q: `$\\dfrac{a}{${den}}$가 유한소수가 되도록 하는 가장 작은 자연수 $a$는?`, a: k, wrong: [den, k * 2, k + 2], why: `$${den}=${factorize(den).map(([p, e]) => (e > 1 ? `${p}^{${e}}` : p)).join('\\times')}$에서 2, 5 외의 소인수 $${k}$를 약분하려면 $a$는 $${k}$의 배수여야 해요. 가장 작은 수는 $${k}$예요.` };
      } },
    ],
  },
  {
    id: 'm2.repeat',
    lesson: [
      { id: 'c1', t: '순환소수 → 분수 (마디만 있을 때)', b: T`$x=0.\overline{3}$이라 하면
        $10x=3.333\cdots$
        $10x-x=3$ → $9x=3$ → $x=\frac13$

        **공식으로 외워도 돼요**
        $0.\overline{a}=\dfrac{a}{9}$, $0.\overline{ab}=\dfrac{ab}{99}$, $0.\overline{abc}=\dfrac{abc}{999}$

        예) $0.\overline{36}=\dfrac{36}{99}=\dfrac{4}{11}$ (꼭 **약분**하기)` },
      { id: 'c2', t: '순환소수 → 분수 (마디 앞에 숫자가 있을 때)', b: T`$0.a\overline{b}=\dfrac{(ab)-a}{90}$ 처럼 **분모는 9 뒤에 0**이 붙어요.

        예) $0.1\overline{6}=\dfrac{16-1}{90}=\dfrac{15}{90}=\dfrac16$

        분자 = (소수점 아래 전체)−(순환하지 않는 부분)
        분모 = 9를 마디 길이만큼 + 0을 순환하지 않는 자릿수만큼` },
    ],
    gens: [
      { id: 'pure', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const len = lv === 1 ? 1 : 2;
        const max = len === 1 ? 8 : 98;
        const n = R.int(1, max);
        const den = len === 1 ? 9 : 99;
        const f = fr(n, den);
        const digs = String(n).padStart(len, '0');
        return { q: `$0.\\overline{${digs}}$[을/를] 기약분수로 나타내면?`, a: f, wrong: [fr(n, den + 1), fr(n, den - 9 || 90), fr(n * 10, den)], input: lv >= 3, why: `마디의 숫자가 ${len}개이므로 분모는 ${'9'.repeat(len)}이에요.\n$0.\\overline{${digs}}=\\dfrac{${n}}{${den}}${f.d !== den ? `=\\dfrac{${f.n}}{${f.d}}` : ''}$` };
      } },
      { id: 'mixed', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.int(1, 9), b = R.int(0, 9);
        const num = a * 10 + b - a;
        const f = fr(num, 90);
        return { q: `$0.${a}\\overline{${b}}$[을/를] 기약분수로 나타내면?`, a: f, wrong: [fr(a * 10 + b, 99), fr(a * 10 + b, 90), fr(b, 9)], why: `$0.${a}\\overline{${b}}=\\dfrac{${a}${b}-${a}}{90}=\\dfrac{${num}}{90}${f.d !== 90 ? `=\\dfrac{${f.n}}{${f.d}}` : ''}$` };
      } },
    ],
  },

  // ───────────── 식의 계산 ─────────────
  {
    id: 'm2.exp',
    lesson: [
      { id: 'c1', t: '곱셈과 나눗셈의 지수법칙', b: T`$m,\ n$이 자연수일 때

        - $a^m\times a^n=a^{m+n}$ (밑이 같으면 지수를 **더해요**)
        - $a^m\div a^n=a^{m-n}$ ($m>n$) (지수를 **빼요**)
        - $a^m\div a^n=1$ ($m=n$)
        - $a^m\div a^n=\dfrac{1}{a^{n-m}}$ ($m<n$)

        예) $a^3\times a^4=a^7$, $a^5\div a^2=a^3$` },
      { id: 'c2', t: '거듭제곱의 거듭제곱', b: T`- $(a^m)^n=a^{mn}$ (지수를 **곱해요**)
        - $(ab)^n=a^nb^n$ (각각에 지수를 분배)
        - $\left(\dfrac ab\right)^n=\dfrac{a^n}{b^n}$

        ⚠️ $(a^2)^3=a^6$ 이지 $a^5$가 아니에요! ($a^2\times a^3=a^5$)
        ⚠️ $(2a)^3=8a^3$ ($2$도 세제곱해요!)` },
    ],
    gens: [
      { id: 'mul', lv: [1, 2], card: 'c1', make: (R) => {
        const a = R.pick(['a', 'x', 'y', 'b']); const m = R.int(2, 7), n = R.int(2, 7);
        if (R.chance(0.5)) return { q: `$${a}^{${m}}\\times ${a}^{${n}}=${a}^{\\square}$에서 $\\square$에 알맞은 수는?`, a: m + n, wrong: [m * n, Math.abs(m - n) || 1, m + n + 1], why: `밑이 같으면 지수를 더해요. $${m}+${n}=${m + n}$` };
        const mm = m + n;
        return { q: `$${a}^{${mm}}\\div ${a}^{${n}}=${a}^{\\square}$에서 $\\square$에 알맞은 수는?`, a: m, wrong: [mm + n, mm * n, m + 1], why: `밑이 같으면 지수를 빼요. $${mm}-${n}=${m}$` };
      } },
      { id: 'pow', lv: [2, 4], card: 'c2', make: (R) => {
        const a = R.pick(['a', 'x']); const m = R.int(2, 5), n = R.int(2, 5);
        if (R.chance(0.5)) return { q: `$(${a}^{${m}})^{${n}}=${a}^{\\square}$에서 $\\square$에 알맞은 수는?`, a: m * n, wrong: [m + n, m ** n, m * n + 1], why: `지수끼리 곱해요. $${m}\\times ${n}=${m * n}$` };
        const c = R.int(2, 4);
        return { q: `$(${c}${a}^{${m}})^{${n}}$[을/를] 간단히 하면?`, correct: `${c ** n}${a}^{${m * n}}`, m: true, wrong: [`${c * n}${a}^{${m * n}}`, `${c ** n}${a}^{${m + n}}`, `${c}${a}^{${m * n}}`], why: `괄호 안의 모든 것에 지수를 곱해요.\n$${c}^{${n}}=${c ** n}$, $(${a}^{${m}})^{${n}}=${a}^{${m * n}}$` };
      } },
      { id: 'mix', lv: [3, 5], card: 'c2', make: (R) => {
        const m = R.int(2, 6), n = R.int(2, 5), p = R.int(2, 5);
        const kind = R.int(0, 1);
        if (kind === 0) return { q: `$(x^{${m}})^{${n}}\\div x^{${p}}=x^{\\square}$에서 $\\square$[은/는]?`, a: m * n - p, wrong: [m + n - p, m * n + p, m * n], why: `$(x^{${m}})^{${n}}=x^{${m * n}}$, 그다음 나눗셈은 지수를 빼요. $${m * n}-${p}=${m * n - p}$` };
        return { q: `$2^{${m}}\\times2^{${n}}=2^{\\square}$일 때 $\\square$[은/는]?`, a: m + n, wrong: [4 ** (m + n) > 0 ? m * n : 0, m + n + 1, 2 * (m + n)], why: `밑 2가 같으므로 지수끼리 더해요. $${m}+${n}=${m + n}$ (밑을 $4$로 만들면 안 돼요!)` };
      } },
    ],
  },
  {
    id: 'm2.monomial',
    lesson: [
      { id: 'c1', t: '단항식의 곱셈', b: T`**계수는 계수끼리, 문자는 문자끼리** 곱해요.

        $(3x^2y)\times(-2xy^3)=3\times(-2)\times x^{2+1}\times y^{1+3}=-6x^3y^4$

        순서: ① 부호 ② 계수 ③ 같은 문자의 지수 더하기` },
      { id: 'c2', t: '단항식의 나눗셈', b: T`**분수로 바꾸거나 역수를 곱해요.**

        $12x^3y^2\div4xy=\dfrac{12x^3y^2}{4xy}=3x^2y$

        계수는 약분하고, 문자는 지수를 빼요. 나누는 식이 분수일 땐 역수를 곱해요.
        ⚠️ $\div(-2x)$는 부호도 같이 바뀌어요.` },
    ],
    gens: [
      { id: 'mul', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const a = R.nz(-6, 6), b = R.nz(-6, 6);
        const p1 = R.int(1, 3), q1 = R.int(0, 2), p2 = R.int(1, 3), q2 = R.int(1, 3);
        const t = (c, p, q) => `${co(c, '')}${c === 1 || c === -1 ? '' : ''}${p ? `x${p > 1 ? `^{${p}}` : ''}` : ''}${q ? `y${q > 1 ? `^{${q}}` : ''}` : ''}`;
        const lhs = (c, p, q) => { const s = `${c === 1 ? '' : c === -1 ? '-' : c}${p ? `x${p > 1 ? `^{${p}}` : ''}` : ''}${q ? `y${q > 1 ? `^{${q}}` : ''}` : ''}`; return s || String(c); };
        const rc = a * b, rp = p1 + p2, rq = q1 + q2;
        const res = (c, p, q) => `${c === 1 ? '' : c === -1 ? '-' : c}${p ? `x${p > 1 ? `^{${p}}` : ''}` : ''}${q ? `y${q > 1 ? `^{${q}}` : ''}` : ''}`;
        const cor = res(rc, rp, rq);
        const w = uniq([res(a + b || 7, rp, rq), res(rc, rp * 1, rq + 1), res(rc, p1 * p2, rq), res(-rc, rp, rq), res(rc, rp + 1, rq)], cor).slice(0, 3);
        return { q: `$(${lhs(a, p1, q1)})\\times(${lhs(b, p2, q2)})$[을/를] 간단히 하면?`, correct: cor, m: true, wrong: w.map(String), why: `계수: $${paren(a)}\\times ${paren(b)}=${rc}$\n$x$: 지수 $${p1}+${p2}=${rp}$, $y$: 지수 $${q1}+${q2}=${rq}$\n$${cor}$` };
      } },
      { id: 'div', lv: [2, 5], card: 'c2', make: (R, lv) => {
        const a = R.nz(-4, 4), b = R.pick([1, 2, 3, 4, -1, -2, -3, -4]);
        const rc = a; const num = a * b;
        const p = R.int(1, 3), q = R.int(1, 3), p2 = R.int(0, p - 1), q2 = R.int(0, q - 1);
        const fmt = (c, pp, qq) => { const s = `${c === 1 ? '' : c === -1 ? '-' : c}${pp ? `x${pp > 1 ? `^{${pp}}` : ''}` : ''}${qq ? `y${qq > 1 ? `^{${qq}}` : ''}` : ''}`; return s || String(c); };
        const cor = fmt(rc, p - p2, q - q2);
        const w = uniq([fmt(-rc, p - p2, q - q2), fmt(rc, p + p2, q + q2), fmt(num + b === 0 ? 5 : num + b, p - p2, q - q2), fmt(rc, p - p2 + 1, q - q2)], cor).slice(0, 3);
        return { q: `$${fmt(num, p, q)}\\div(${fmt(b, p2, q2)})$[을/를] 간단히 하면?`, correct: cor, m: true, wrong: w, why: `계수: $${num}\\div ${paren(b)}=${rc}$\n문자: 지수를 빼요.\n$${cor}$` };
      } },
    ],
  },
  {
    id: 'm2.poly',
    lesson: [
      { id: 'c1', t: '다항식의 덧셈', b: T`괄호를 풀고 **동류항(문자와 차수가 같은 항)끼리** 모아요.

        $(3x^2+2x-1)+(x^2-4x+5)$
        $=3x^2+x^2+2x-4x-1+5$
        $=4x^2-2x+4$` },
      { id: 'c2', t: '다항식의 뺄셈', b: T`==빼는 식의 괄호 안 모든 항의 부호를 바꿔서== 더해요.

        $(3x^2+2x-1)-(x^2-4x+5)$
        $=3x^2+2x-1-x^2+4x-5$
        $=2x^2+6x-6$

        ⚠️ $-5$의 부호 바꾸는 것(−(+5)=−5, −(−1)=+1)을 가장 많이 놓쳐요.` },
    ],
    gens: [
      { id: 'add', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const A = [R.nz(-5, 5), R.nz(-6, 6), R.nz(-8, 8)], B = [R.nz(-5, 5), R.nz(-6, 6), R.nz(-8, 8)];
        const S = polyAdd(A, B);
        if (S[0] === 0) B[0] = A[0] === 1 ? 2 : 1;
        const S2 = polyAdd(A, B);
        const w = uniq([polyTex(polyAdd(A, B.map((v, i) => (i === 1 ? -v : v)))), polyTex([S2[0], S2[1], S2[2] + 1]), polyTex([S2[0] + 1, S2[1], S2[2]])], polyTex(S2)).slice(0, 3);
        return { q: `$(${polyTex(A)})+(${polyTex(B)})$[을/를] 간단히 하면?`, correct: polyTex(S2), m: true, wrong: w, why: `동류항끼리 더해요.\n$x^2$: $${A[0]}+${paren(B[0])}=${S2[0]}$, $x$: $${A[1]}+${paren(B[1])}=${S2[1]}$, 상수: $${A[2]}+${paren(B[2])}=${S2[2]}$` };
      } },
      { id: 'sub', lv: [2, 5], card: 'c2', make: (R, lv) => {
        const A = [R.nz(-5, 5), R.nz(-6, 6), R.nz(-8, 8)], B = [R.nz(-5, 5), R.nz(-6, 6), R.nz(-8, 8)];
        if (A[0] === B[0]) B[0] = A[0] + 1 || 2;
        const D = A.map((v, i) => v - B[i]);
        const wr1 = [A[0] - B[0], A[1] - B[1], A[2] + B[2]]; // 마지막 항 부호 실수
        const wr2 = [A[0] - B[0], A[1] + B[1], A[2] - B[2]];
        const wr3 = A.map((v, i) => v + B[i]);
        const cor = polyTex(D);
        const w = uniq([polyTex(wr1), polyTex(wr2), polyTex(wr3)], cor).slice(0, 3);
        return { q: `$(${polyTex(A)})-(${polyTex(B)})$[을/를] 간단히 하면?`, correct: cor, m: true, wrong: w, why: `괄호 앞의 −로 인해 $(${polyTex(B)})$의 모든 부호가 바뀌어요.\n$${polyTex(A)}${B.map((v, i) => (v === 0 ? '' : `${-v >= 0 ? '+' : '-'}${Math.abs(v) === 1 && i < 2 ? '' : Math.abs(v)}${['x^2', 'x', ''][i]}`)).join('')}$\n$=${cor}$` };
      } },
    ],
  },
  {
    id: 'm2.polymul',
    lesson: [
      { id: 'c1', t: '단항식 × 다항식', b: T`**분배법칙**으로 하나씩 곱해요.

        $2x(3x-4)=2x\times3x+2x\times(-4)=6x^2-8x$
        $-3x(x^2-2x+1)=-3x^3+6x^2-3x$

        ⚠️ 괄호 앞이 음수면 **모든 항**의 부호가 바뀌어요.` },
      { id: 'c2', t: '다항식 ÷ 단항식', b: T`**각 항을 단항식으로 나눠요.**

        $(12x^2-8x)\div4x=\dfrac{12x^2}{4x}-\dfrac{8x}{4x}=3x-2$

        ⚠️ 모든 항을 다 나눠야 해요. 첫 번째 항만 나누고 끝내면 틀려요!` },
      { id: 'c3', t: '식의 값 · 혼합 계산', b: T`곱셈·나눗셈을 먼저, 덧셈·뺄셈은 나중에. 괄호는 먼저 풀고 **동류항끼리 정리**해요.

        $3x(x+2)-x(2x-1)=3x^2+6x-2x^2+x=x^2+7x$` },
    ],
    gens: [
      { id: 'mul', lv: [1, 3], card: 'c1', make: (R) => {
        const k = R.nz(-5, 5), a = R.nz(-6, 6), b = R.nz(-8, 8);
        const cor = polyTex([k * a, k * b]); // kx*(ax+b)
        const w = uniq([polyTex([k * a, b]), polyTex([k + a, k + b]), polyTex([k * a, -k * b])], cor).slice(0, 3);
        const kk = k === 1 ? '' : k === -1 ? '-' : k;
        return { q: `$${kk}x(${linTex(a, b)})$[을/를] 전개하면?`, correct: polyTex([k * a, k * b, 0]), m: true, wrong: [polyTex([k * a, b, 0]), polyTex([k + a, k + b, 0]), polyTex([k * a, -k * b, 0])].filter((x) => x !== polyTex([k * a, k * b, 0])), why: `$${kk}x$[을/를] 각 항에 곱해요.\n$${kk}x\\times ${paren(a)}x=${k * a}x^2$, $${kk}x\\times ${paren(b)}=${k * b}x$`.replace('x^2$, ', 'x^2$, ') };
      } },
      { id: 'div', lv: [2, 5], card: 'c2', make: (R) => {
        const k = R.pick([2, 3, 4, -2, -3]), a = R.nz(-6, 6), b = R.nz(-8, 8);
        const num = [k * a, k * b, 0];
        const cor = linTex(a, b);
        const w = uniq([linTex(a, k * b), linTex(a * k, b), linTex(a, -b)], cor).slice(0, 3);
        return { q: `$(${polyTex(num)})\\div(${k}x)$[을/를] 간단히 하면?`, correct: cor, m: true, wrong: w, why: `각 항을 $${k}x$[으로/로] 나눠요.\n$\\dfrac{${k * a}x^2}{${k}x}=${a}x$, $\\dfrac{${k * b}x}{${k}x}=${b}$\n$${cor}$` };
      } },
      { id: 'mixed', lv: [4, 5], card: 'c3', make: (R) => {
        const k1 = R.int(2, 4), k2 = R.int(1, 3);
        const a1 = R.nz(-4, 4), b1 = R.nz(-5, 5), a2 = R.nz(-4, 4), b2 = R.nz(-5, 5);
        const S = polyAdd([k1 * a1, k1 * b1, 0], polyScale([k2 * a2, k2 * b2, 0], -1));
        const cor = polyTex(S);
        const w = uniq([polyTex(polyAdd([k1 * a1, k1 * b1, 0], [k2 * a2, k2 * b2, 0])), polyTex(polyAdd([k1 * a1, k1 * b1, 0], [-k2 * a2, k2 * b2, 0])), polyTex([S[0], S[1] + 1, 0])], cor).slice(0, 3);
        const kk = (k) => (k === 1 ? '' : k);
        return { q: `$${kk(k1)}x(${linTex(a1, b1)})-${kk(k2)}x(${linTex(a2, b2)})$[을/를] 간단히 하면?`, correct: cor, m: true, wrong: w, why: `각각 전개한 뒤 뺄셈에서 부호를 바꿔요.\n$${polyTex([k1 * a1, k1 * b1, 0])}-(${polyTex([k2 * a2, k2 * b2, 0])})=${cor}$` };
      } },
    ],
  },

  // ───────────── 일차부등식 ─────────────
  {
    id: 'm2.ineqprop',
    lesson: [
      { id: 'c1', t: '부등식이란?', b: T`부등호($<,\ >,\ \le,\ \ge$)로 나타낸 식을 ==부등식==이라 해요.

        - $a>b$: $a$는 $b$보다 크다
        - $a\ge b$: $a$는 $b$보다 크거나 같다 (이상)
        - $a<b$: 작다 / $a\le b$: 작거나 같다 (이하)

        "$x$는 3 이상이다" → $x\ge3$, "$x$는 3 초과이다" → $x>3$` },
      { id: 'c2', t: '부등식의 성질', b: T`양변에 같은 수를 **더하거나 빼도** 부등호 방향은 그대로.
        $a<b\Rightarrow a+c<b+c$

        양변에 **양수**를 곱하거나 나눠도 방향은 그대로.
        $a<b,\ c>0\Rightarrow ac<bc$

        ==양변에 음수를 곱하거나 나누면 부등호의 방향이 바뀌어요!==
        $a<b,\ c<0\Rightarrow ac>bc$

        예) $-2<3$의 양변에 $-1$을 곱하면 $2>-3$` },
    ],
    gens: [
      { id: 'say', lv: [1, 2], card: 'c1', make: (R) => {
        const n = R.int(2, 20);
        const items = [[`$x$는 ${n} 이상이다`, `x\\ge ${n}`], [`$x$는 ${n} 초과이다`, `x>${n}`], [`$x$는 ${n} 이하이다`, `x\\le ${n}`], [`$x$는 ${n} 미만이다`, `x<${n}`]];
        const it = R.pick(items);
        return { q: `"${it[0].replace(/\$/g, '')}"를 부등식으로 나타내면?`.replace('"x', '"x'), correct: `$${it[1]}$`, wrong: items.filter((x) => x[1] !== it[1]).map((x) => `$${x[1]}$`), why: '이상·이하는 같은 경우를 포함(≥, ≤), 초과·미만은 포함하지 않아요(>, <).' };
      } },
      { id: 'dir', lv: [2, 4], card: 'c2', make: (R) => {
        const c = R.nz(-6, 6); const op = R.pick(['<', '>']);
        const flip = c < 0;
        const res = flip ? (op === '<' ? '>' : '<') : op;
        const kind = R.pick(['mul', 'add']);
        if (kind === 'add') return { q: `$a${op}b$일 때 $a${pm(c)}\\ \\square\\ b${pm(c)}$에서 $\\square$ 안에 알맞은 부등호는?`.replace('\\ \\square\\ ', '\\ \\square\\ '), correct: op, wrong: [op === '<' ? '>' : '<', '=', '≤'], why: '양변에 같은 수를 더하거나 빼도 부등호의 방향은 그대로예요.' };
        return { q: `$a${op}b$일 때 $${c}a\\ \\square\\ ${c}b$에서 $\\square$ 안에 알맞은 부등호는?`, correct: res, wrong: [res === '<' ? '>' : '<', '=', op === '<' ? '≤' : '≥'], why: c > 0 ? '양수를 곱하면 부등호의 방향은 그대로예요.' : '음수를 곱하면 부등호의 방향이 바뀌어요!' };
      } },
      { id: 'apply', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.int(1, 5), b = R.int(a + 1, 9);
        const k = R.int(2, 4);
        const c = R.int(1, 5);
        const op = R.pick(['<']);
        const ex = [
          [`$x<y$일 때 $-3x+1\\ \\square\\ -3y+1$에서 알맞은 부등호는?`, '>', '음수 −3을 곱하면 방향이 바뀌고, +1은 영향이 없어요.'],
          [`$x\\ge y$일 때 $2x-5\\ \\square\\ 2y-5$에서 알맞은 부등호는?`, '≥', '양수를 곱하고 같은 수를 빼도 방향은 그대로예요.'],
          [`$a>b$일 때 $-\\dfrac{a}{2}\\ \\square\\ -\\dfrac{b}{2}$에서 알맞은 부등호는?`, '<', '음수로 나누는 것과 같아서 방향이 바뀌어요.'],
          [`$2<x<5$일 때 $-x$의 값의 범위는?`, '$-5<-x<-2$', '음수를 곱하면 부등호 방향이 바뀌고 크기 순서가 뒤집혀요.'],
        ];
        const it = R.pick(ex);
        if (it[1].startsWith('$')) return { q: it[0], correct: it[1], wrong: ['$-2<-x<-5$', '$2<-x<5$', '$-5>-x>-2$'], why: it[2] };
        const all = ['<', '>', '≤', '≥'];
        return { q: it[0], correct: it[1], wrong: all.filter((v) => v !== it[1]), why: it[2] };
      } },
    ],
  },
  {
    id: 'm2.ineq',
    lesson: [
      { id: 'c1', t: '일차부등식 풀기', b: T`일차방정식과 **풀이 순서가 똑같아요.**

        $3x-4>5$ → $3x>9$ → $x>3$

        ==단, 양변에 음수를 곱하거나 나눌 땐 부등호의 방향이 바뀌어요.==
        $-2x+1\ge7$ → $-2x\ge6$ → $x\le-3$` },
      { id: 'c2', t: '수직선으로 나타내기', b: T`- $x>3$: 3에 ○(속이 빈 점), 오른쪽으로
        - $x\ge3$: 3에 ●(속이 찬 점), 오른쪽으로
        - $x<3$: ○, 왼쪽으로
        - $x\le3$: ●, 왼쪽으로

        "이상·이하"는 **그 수를 포함**하니까 ●, "초과·미만"은 ○예요.` },
      { id: 'c3', t: '해 중 정수(자연수) 구하기', b: T`$x\le4$를 만족하는 **자연수** → 1, 2, 3, 4 (4개)
        $x<4$를 만족하는 **자연수** → 1, 2, 3 (3개)
        $x>-2$를 만족하는 **음이 아닌 정수** → 0, 1, 2, …

        경계값을 포함하는지(≤, ≥) 꼭 확인하세요!` },
    ],
    gens: [
      { id: 'solve', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const x = R.nz(-8, 8), a = R.pick(lv === 1 ? [2, 3, 4, 5] : [2, 3, 4, 5, -2, -3, -4]), b = R.nz(-9, 9);
        const op = R.pick(['>', '<', '\\ge ', '\\le ']);
        const fl = { '>': '<', '<': '>', '\\ge ': '\\le ', '\\le ': '\\ge ' };
        const c = a * x + b;
        const ans = a > 0 ? op : fl[op];
        const cor = `x${ans}${x}`;
        const wr = [`x${fl[ans]}${x}`, `x${ans}${-x}`, `x${ans}${x + 1}`];
        return { q: `$${linTex(a, b)}${op}${c}$[을/를] 풀면?`, correct: `$${cor}$`, wrong: wr.map((s) => `$${s}$`), why: `$${a}x${op}${c - b}$ ${a < 0 ? `→ 양변을 $${a}$[으로/로] 나누면 **부등호 방향이 바뀌어요.**` : `→ 양변을 $${a}$[으로/로] 나눠요.`}\n$${cor}$` };
      } },
      { id: 'both', lv: [3, 5], card: 'c1', make: (R, lv) => {
        const x = R.nz(-6, 6), a = R.int(2, 6), c = R.int(1, a - 1);
        const b = R.nz(-8, 8), d = a * x + b - c * x; // a x + b OP c x + d  → (a-c) x OP d-b
        const op = R.pick(['>', '<', '\\ge ', '\\le ']);
        const cor = `x${op}${x}`;
        const wr = [`x${{ '>': '<', '<': '>', '\\ge ': '\\le ', '\\le ': '\\ge ' }[op]}${x}`, `x${op}${-x}`, `x${op}${x + 2}`];
        return { q: `$${linTex(a, b)}${op}${linTex(c, d)}$[을/를] 풀면?`, correct: `$${cor}$`, wrong: wr.map((s) => `$${s}$`), why: `$x$항은 왼쪽, 숫자는 오른쪽으로 이항해요.\n$${linTex(a - c, 0)}${op}${d - b}$ → $${cor}$` };
      } },
      { id: 'count', lv: [3, 5], card: 'c3', make: (R) => {
        const n = R.int(3, 9);
        const kind = R.pick([['\\le ', n, `자연수 $x$의 개수`, n], ['<', n, `자연수 $x$의 개수`, n - 1]]);
        const a = R.int(2, 4), b = R.int(1, 6);
        // a x + b OP a n + b
        const rhs = a * kind[1] + b;
        return { q: `부등식 $${linTex(a, b)}${kind[0]}${rhs}$[을/를] 만족하는 ${kind[2]}는?`, a: kind[3], unit: '개', wrong: [kind[3] + 1, kind[3] - 1, n * 2], why: `$${a}x${kind[0]}${rhs - b}$ → $x${kind[0]}${kind[1]}$\n만족하는 자연수는 1부터 ${kind[3]}까지 $${kind[3]}$개예요.` };
      } },
    ],
  },
  {
    id: 'm2.ineqword',
    lesson: [
      { id: 'c1', t: '활용 문제 풀이', b: T`1. 구하려는 것을 $x$로 놓는다
        2. 문제 문장을 **부등식**으로 바꾼다 ("이하·이상·초과·미만" 체크!)
        3. 부등식을 푼다
        4. 문제 조건(자연수, 개수 등)에 맞는지 확인한다

        **~ 이하**: $\le$ / **~ 이상**: $\ge$ / **~ 미만**: $<$ / **~ 초과**: $>$` },
      { id: 'c2', t: '자주 나오는 유형', b: T`- **예산**: (물건 값)+(다른 값) $\le$ (가진 돈)
        - **최대 개수**: 해 중 **가장 큰 정수**
        - **최소 개수**: 해 중 **가장 작은 정수**
        - **평균**: (점수의 합)÷(횟수) $\ge$ 목표

        가장 큰 정수를 구할 땐 소수 해를 **내림**하고, 가장 작은 정수는 **올림**해요.` },
    ],
    gens: [
      { id: 'budget', lv: [1, 4], card: 'c1', make: (R, lv) => {
        const p = R.pick([300, 400, 500, 600, 700, 800]), fixed = R.pick([500, 1000, 1500, 2000]);
        const n = R.int(3, 12); const total = p * n + fixed + R.int(0, p / 100 - 1) * 100;
        return { q: `한 개에 ${p}원인 과자를 사고 포장비 ${fixed}원을 내려고 해요. ${total}원 이하로 쓰려면 과자를 최대 몇 개까지 살 수 있을까요?`, a: n, unit: '개', wrong: [n + 1, n - 1, Math.round(total / p)], why: `$${p}x+${fixed}\\le${total}$ → $${p}x\\le${total - fixed}$ → $x\\le${+((total - fixed) / p).toFixed(2)}$\n정수 중 가장 큰 값은 $${n}$이에요.` };
      } },
      { id: 'avg', lv: [3, 5], card: 'c2', make: (R) => {
        for (let t = 0; t < 200; t++) {
          const k = R.pick([3, 4]); const scores = Array.from({ length: k }, () => R.int(65, 95));
          const goal = R.pick([80, 85, 90]);
          const need = goal * (k + 1) - scores.reduce((a, b) => a + b, 0);
          if (need < 60 || need > 100) continue;
          return { q: `수학 시험 ${k}번의 점수가 ${scores.join(', ')}점이에요. 다음 시험까지 ${k + 1}번의 평균이 ${goal}점 이상이 되려면 마지막 시험에서 최소 몇 점을 받아야 할까요?`, a: need, unit: '점', wrong: [need + 1, need - 1, goal], why: `$\\dfrac{${scores.join('+')}+x}{${k + 1}}\\ge${goal}$ → $${scores.reduce((a, b) => a + b, 0)}+x\\ge${goal * (k + 1)}$ → $x\\ge${need}$` };
        }
        return { q: '"$x$는 7 이상이다"를 바르게 나타낸 것은?', correct: '$x\\ge7$', wrong: ['$x>7$', '$x\\le7$', '$x<7$'], why: '이상은 ≥ 로 나타내요.' };
      } },
      { id: 'dist', lv: [4, 5], card: 'c2', make: (R) => {
        const n = R.int(2, 6), extra = R.int(1, 8);
        const price = R.pick([1200, 1500, 2000]), pack = R.pick([4000, 5000, 6000]);
        // n개 사면 개당 price, 상자 단체값 pack → 몇 개부터 단체가 더 싸나 (price*x > pack)
        const need = Math.floor(pack / price) + 1;
        return { q: `한 개에 ${price}원인 물건을 낱개로 사거나, 상자(개수 상관없이) ${pack}원에 살 수 있어요. 상자로 사는 것이 더 이익이 되려면 최소 몇 개를 사야 할까요?`, a: need, unit: '개', wrong: [need - 1, need + 1, Math.round(pack / price) + 2], why: `$${price}x>${pack}$ → $x>${+(pack / price).toFixed(2)}$\n이를 만족하는 가장 작은 자연수는 $${need}$이에요.` };
      } },
    ],
  },

  // ───────────── 연립일차방정식 ─────────────
  {
    id: 'm2.sys', anchor: true,
    lesson: [
      { id: 'c1', t: '연립방정식이란?', b: T`미지수가 2개인 일차방정식 두 개를 한 쌍으로 묶은 것을 ==연립방정식==이라 해요.
        $\begin{cases}x+y=5\\x-y=1\end{cases}$

        두 식을 **동시에 만족하는 $(x,\ y)$**가 해예요. 위 식의 해는 $x=3,\ y=2$ (둘 다 대입해 확인!)` },
      { id: 'c2', t: '가감법 (더하거나 빼서 하나 없애기)', b: T`한 미지수의 **계수 절댓값을 같게** 맞춘 뒤, 두 식을 더하거나 빼서 그 미지수를 없애요.

        $\begin{cases}x+y=5\\x-y=1\end{cases}$ → 두 식을 더하면 $2x=6$ → $x=3$, 그다음 $y=2$

        $\begin{cases}2x+y=7\\x+y=4\end{cases}$ → 위 식−아래 식: $x=3$, $y=1$` },
      { id: 'c3', t: '대입법 (한 식을 다른 식에 넣기)', b: T`한 식을 $x=\cdots$ 또는 $y=\cdots$ 꼴로 만들어 **다른 식에 대입**해요.

        $\begin{cases}y=x+2\\3x+y=10\end{cases}$ → $3x+(x+2)=10$ → $4x=8$ → $x=2$, $y=4$

        ⚠️ 대입할 땐 **괄호로 감싸요**. $3x+(x+2)$처럼요.` },
    ],
    gens: [
      { id: 'find', lv: [1, 2], card: 'c2', make: (R, lv) => {
        const x = R.nz(-6, 8), y = R.nz(-6, 8);
        const ask = R.pick(['x', 'y']);
        return { q: `연립방정식 $\\begin{cases}x+y=${x + y}\\\\x-y=${x - y}\\end{cases}$의 해에서 $${ask}$의 값은?`, a: ask === 'x' ? x : y, wrong: [ask === 'x' ? y : x, x + y, x - y], why: `두 식을 더하면 $2x=${2 * x}$ → $x=${x}$\n$x+y=${x + y}$에 대입하면 $y=${y}$` };
      } },
      { id: 'elim', lv: [2, 4], card: 'c2', make: (R, lv) => {
        const x = R.nz(-5, 6), y = R.nz(-5, 6);
        const a = R.int(1, 4), b = R.int(1, 4), c = R.int(1, 4), d = R.int(1, 4);
        if (a * d === b * c) return { q: '연립방정식에서 한 미지수를 없애려고 해요. 이때 하는 일은?', correct: '계수의 절댓값을 같게 맞춘 뒤 더하거나 뺀다', wrong: ['두 식을 곱한다', '두 식을 나눈다', '하나의 식만 푼다'], why: '가감법은 계수를 맞추고 식끼리 더하거나 빼서 한 문자를 없애는 방법이에요.' };
        const ask = R.pick(['x', 'y', 'xy']);
        const e1 = a * x + b * y, e2 = c * x - d * y;
        const ans = ask === 'x' ? x : ask === 'y' ? y : x + y;
        return { q: `연립방정식 $\\begin{cases}${linTex2(a, b)}=${e1}\\\\${linTex2(c, -d)}=${e2}\\end{cases}$의 해가 $x=p,\\ y=q$일 때, ${ask === 'x' ? '$p$' : ask === 'y' ? '$q$' : '$p+q$'}의 값은?`, a: ans, wrong: [ans + 1, ans - 1, -ans], why: `가감법으로 풀면 $x=${x},\\ y=${y}$\n${ask === 'x' ? `$p=${x}$` : ask === 'y' ? `$q=${y}$` : `$p+q=${x}+${paren(y)}=${x + y}$`}` };
      } },
      { id: 'subst', lv: [2, 5], card: 'c3', make: (R, lv) => {
        const x = R.nz(-5, 6), y = R.nz(-6, 6);
        let k = R.nz(-3, 3), a = R.int(1, 4), b = R.int(1, 3);
        while (a + b * k === 0) k = R.nz(-3, 3);
        const m = y - k * x; // y = kx + m
        const e = a * x + b * y;
        return { q: `연립방정식 $\\begin{cases}y=${linTex(k, m)}\\\\${linTex2(a, b)}=${e}\\end{cases}$에서 $x$의 값은?`, a: x, wrong: [y, x + 1, e], why: `첫 식을 둘째 식의 $y$에 대입해요.\n$${a === 1 ? '' : a}x+${b === 1 ? '' : b}(${linTex(k, m)})=${e}$ → $${linTex(a + b * k, m * b)}=${e}$ → $x=${x}$` };
      } },
      { id: 'check', lv: [1, 3], card: 'c1', make: (R) => {
        const x = R.nz(-4, 6), y = R.nz(-4, 6); const a = R.int(1, 4), b = R.int(1, 4);
        const e1 = a * x + y, e2 = x - b * y;
        const mk = (p, q) => `$(${p},\\ ${q})$`;
        return { q: `연립방정식 $\\begin{cases}${linTex2(a, 1)}=${e1}\\\\${linTex2(1, -b)}=${e2}\\end{cases}$의 해는?`, correct: mk(x, y), wrong: [mk(y, x), mk(x, -y), mk(-x, y)].filter((s) => s !== mk(x, y)), why: `해를 두 식에 모두 대입해 보세요.\n$${a}\\times ${paren(x)}+${paren(y)}=${e1}$ ✅, $${x}-${b}\\times ${paren(y)}=${e2}$ ✅` };
      } },
    ],
  },
  {
    id: 'm2.syssp',
    lesson: [
      { id: 'c1', t: '먼저 간단히 정리하기', b: T`괄호, 분수, 소수가 있으면 **먼저 $ax+by=c$ 꼴**로 정리해요.

        - 괄호: 분배법칙으로 풀기
        - 분수: 양변에 **분모의 최소공배수** 곱하기
        - 소수: 양변에 **10, 100, …** 곱하기` },
      { id: 'c2', t: 'A = B = C 꼴', b: T`$A=B=C$ 꼴은 다음 중 하나로 풀어요.
        $\begin{cases}A=B\\A=C\end{cases}$ 또는 $\begin{cases}A=B\\B=C\end{cases}$ 또는 $\begin{cases}A=C\\B=C\end{cases}$

        **가장 간단한 식**(상수가 있는 부분)을 기준으로 하면 편해요.

        예) $x+y=2x-y=5$ → $\begin{cases}x+y=5\\2x-y=5\end{cases}$` },
      { id: 'c3', t: '해가 특수한 경우', b: T`$\begin{cases}ax+by=c\\a'x+b'y=c'\end{cases}$에서
        - $\dfrac a{a'}=\dfrac b{b'}=\dfrac c{c'}$: 해가 **무수히 많다** (두 식이 사실상 같음)
        - $\dfrac a{a'}=\dfrac b{b'}\ne\dfrac c{c'}$: 해가 **없다** (평행)
        - $\dfrac a{a'}\ne\dfrac b{b'}$: 해가 **하나**` },
    ],
    gens: [
      { id: 'paren', lv: [2, 4], card: 'c1', make: (R) => {
        const x = R.nz(-4, 5), y = R.nz(-4, 5);
        const a = R.int(2, 4), b = R.int(1, 3);
        const c = R.int(1, 3), d = R.int(2, 4);
        const e1 = a * (x + y) - b * y; // a(x+y) - b y = e1
        const e2 = c * x + d * (x - y); // c x + d(x−y) = e2
        return { q: `연립방정식 $\\begin{cases}${a}(x+y)-${b}y=${e1}\\\\${c}x+${d}(x-y)=${e2}\\end{cases}$에서 $x$의 값은?`, a: x, wrong: [y, x + y, x - y], why: `괄호를 풀어 정리해요.\n$${linTex2(a, a - b)}=${e1}$\n$${linTex2(c + d, -d)}=${e2}$\n푸면 $x=${x}$, $y=${y}$` };
      } },
      { id: 'frac', lv: [3, 5], card: 'c1', make: (R) => {
        const x = R.int(1, 3) * 6, y = R.int(1, 3) * 6;
        const e1 = x / 2 + y / 3, e2 = x / 3 - y / 6;
        return { q: `연립방정식 $\\begin{cases}\\dfrac{x}{2}+\\dfrac{y}{3}=${e1}\\\\\\dfrac{x}{3}-\\dfrac{y}{6}=${e2}\\end{cases}$에서 $x$의 값은?`, a: x, wrong: [y, x + y, e1], why: `첫 식에 $6$, 둘째 식에 $6$을 곱해 분수를 없애요.\n$3x+2y=${6 * e1}$, $2x-y=${6 * e2}$\n푸면 $x=${x}$, $y=${y}$` };
      } },
      { id: 'abc', lv: [4, 5], card: 'c2', make: (R) => {
        for (let t = 0; t < 400; t++) {
          const x = R.nz(-4, 6), y = R.nz(-4, 6), a = R.int(1, 3), b = R.int(1, 3), c = R.int(1, 4);
          const e = a * x + b * y; const dd = (c * x - e) / -y; // c x + d y = e → d = (e - c x)/y
          const d = (e - c * x) / y;
          if (!Number.isInteger(d) || d === 0 || Math.abs(d) > 6 || (a === c && b === d) || a * d === b * c) continue;
          return { q: `$${linTex2(a, b)}=${linTex2(c, d)}=${e}$[을/를] 만족하는 $x$의 값은?`, a: x, wrong: [y, x + y, e], why: `$A=B=C$ 꼴은 $\\begin{cases}${linTex2(a, b)}=${e}\\\\${linTex2(c, d)}=${e}\\end{cases}$로 바꿔서 풀어요.\n푸면 $x=${x},\\ y=${y}$` };
        }
        return { q: '$A=B=C$ 꼴의 연립방정식을 풀 때 바르게 바꾼 것은?', correct: '$A=B,\\ B=C$ 중 두 식을 골라 연립한다', wrong: ['$A+B=C$로 바꾼다', '$A=B=C$를 모두 곱한다', '식 하나만 푼다'], why: '$A=B=C$는 세 가지 짝 중 두 개를 골라 연립해요.' };
      } },
      { id: 'special', lv: [4, 5], card: 'c3', make: (R) => {
        const a = R.int(1, 4), b = R.int(1, 4), c = R.int(1, 6), k = R.int(2, 3);
        const kind = R.pick(['many', 'none', 'one']);
        const l2 = kind === 'one' ? `${a + 1}x+${b}y=${c * k}` : `${a * k}x+${b * k}y=${kind === 'many' ? c * k : c * k + 1}`;
        return { q: `연립방정식 $\\begin{cases}${a}x+${b}y=${c}\\\\${l2}\\end{cases}$의 해는?`, correct: kind === 'many' ? '해가 무수히 많다' : kind === 'none' ? '해가 없다' : '해가 하나이다', wrong: ['해가 무수히 많다', '해가 없다', '해가 하나이다', '해가 2개이다'].filter((s) => s !== (kind === 'many' ? '해가 무수히 많다' : kind === 'none' ? '해가 없다' : '해가 하나이다')).slice(0, 3), why: kind === 'many' ? `둘째 식은 첫 식의 ${k}배예요. 같은 식이므로 해가 무수히 많아요.` : kind === 'none' ? `$x,\\ y$의 계수비는 같은데 상수항의 비가 달라서 해가 없어요.` : `계수의 비가 같지 않으므로 해가 하나예요.` };
      } },
    ],
  },
  {
    id: 'm2.sysword',
    lesson: [
      { id: 'c1', t: '활용 문제 풀이', b: T`1. 구하려는 두 수를 $x,\ y$로 놓는다
        2. 문제의 **두 가지 조건**으로 식 2개를 세운다
        3. 연립방정식을 푼다
        4. 답이 문제에 맞는지 확인한다 (사람 수, 개수는 자연수!)` },
      { id: 'c2', t: '자주 나오는 유형', b: T`- **합과 차**: $x+y=a,\ x-y=b$
        - **닭과 토끼(다리 수)**: 마리 수 $x+y=n$, 다리 수 $2x+4y=m$
        - **나이**: 지금 나이와 몇 년 후 나이 관계
        - **거리·속력·시간**: 걸린 시간의 합, 거리의 합으로 식 세우기
        - **농도**: 소금물의 양과 소금의 양 두 가지로 식 세우기` },
    ],
    gens: [
      { id: 'chic', lv: [1, 3], card: 'c2', make: (R) => {
        const x = R.int(3, 12), y = R.int(3, 12);
        const kind = R.pick(['animal', 'ticket']);
        if (kind === 'animal') return { q: `닭과 토끼가 모두 ${x + y}마리 있고, 다리의 수는 모두 ${2 * x + 4 * y}개예요. 토끼는 몇 마리일까요?`, a: y, unit: '마리', wrong: [x, x + y, y + 1], why: `닭 $x$마리, 토끼 $y$마리라 하면\n$x+y=${x + y}$, $2x+4y=${2 * x + 4 * y}$\n푸면 $x=${x},\\ y=${y}$` };
        const p1 = R.pick([1000, 1500, 2000]), p2 = R.pick([2500, 3000, 3500]);
        return { q: `어린이 입장권 ${p1}원, 어른 입장권 ${p2}원이에요. 모두 ${x + y}장을 사는 데 ${p1 * x + p2 * y}원을 냈다면 어른 입장권은 몇 장일까요?`, a: y, unit: '장', wrong: [x, x + y, y + 2], why: `어린이 $x$장, 어른 $y$장이라 하면\n$x+y=${x + y}$, $${p1}x+${p2}y=${p1 * x + p2 * y}$\n푸면 $x=${x},\\ y=${y}$` };
      } },
      { id: 'sumdiff', lv: [1, 3], card: 'c1', make: (R) => {
        const x = R.int(10, 40), y = R.int(3, x - 2);
        return { q: `두 수의 합이 ${x + y}이고 차가 ${x - y}일 때 큰 수는?`, a: x, wrong: [y, x + y, x - y], why: `큰 수 $x$, 작은 수 $y$라 하면 $x+y=${x + y}$, $x-y=${x - y}$\n더하면 $2x=${2 * x}$ → $x=${x}$` };
      } },
      { id: 'age', lv: [3, 5], card: 'c2', make: (R) => {
        const ratio = R.int(2, 3), t = R.int(2, 8), son = R.int(8, 14);
        const dad = ratio * (son + t) - t;
        return { q: `현재 아버지는 ${dad}세, 아들은 ${son}세예요. 몇 년 후에 아버지의 나이가 아들의 나이의 ${ratio}배가 될까요?`, a: t, unit: '년 후', wrong: [t + 1, t + 2, dad - son], why: `$x$년 후라고 하면 $${dad}+x=${ratio}(${son}+x)$ → $${ratio - 1}x=${dad - ratio * son}$ → $x=${t}$` };
      } },
      { id: 'speed', lv: [4, 5], card: 'c2', make: (R) => {
        const v = R.int(3, 6), w = R.int(2, 4), t = R.int(2, 5);
        const up = (v + w) * t, down = (v - w) * t;
        return { q: `강을 따라 내려갈 때는 ${t}시간에 ${up}km를, 거슬러 올라갈 때는 ${t}시간에 ${down}km를 가는 배가 있어요. 강물이 흐르는 속력은 시속 몇 km일까요?`, a: w, unit: 'km', wrong: [v, v + w, up / t], why: `배의 속력 $x$, 강물의 속력 $y$라 하면\n$(x+y)\\times ${t}=${up}$, $(x-y)\\times ${t}=${down}$\n$x+y=${v + w}$, $x-y=${v - w}$ → $y=${w}$` };
      } },
    ],
  },
];

// x, y 계수 표기 (ax+by 꼴)
function linTex2(a, b) {
  const t = (c, v) => (c === 0 ? '' : `${c === 1 ? '' : c === -1 ? '-' : c}${v}`);
  let s = t(a, 'x');
  const bt = t(b, 'y');
  if (bt) s += s ? (b > 0 ? `+${bt}` : bt) : bt;
  return s || '0';
}
