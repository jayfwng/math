// 고1 ① 다항식 · 방정식과 부등식
import { gcd, fr, linTex, polyTex, polyMul, paren, pm } from '../js/lib.js';

const T = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const uniq = (arr, not) => [...new Set(arr.map(String))].filter((x) => x !== String(not));
const P = (co) => polyTex(co);
const lin = (p) => `x${pm(-p)}`.replace('x+0', 'x').replace('x-0', 'x'); // x−p
// 복소수 a+bi 표기
const cx = (a, b) => {
  const bi = b === 0 ? '' : `${Math.abs(b) === 1 ? '' : Math.abs(b)}i`;
  if (b === 0) return `${a}`;
  if (a === 0) return `${b < 0 ? '-' : ''}${bi}`;
  return `${a}${b < 0 ? '-' : '+'}${bi}`;
};
// 조립제법: co ÷ (x−a) → [몫 계수, 나머지]
const synth = (co, a) => { const q = [co[0]]; for (let i = 1; i < co.length; i++) q.push(co[i] + a * q[i - 1]); return [q.slice(0, -1), q[q.length - 1]]; };
const evalP = (co, x) => co.reduce((acc, c) => acc * x + c, 0);

export default [
  // ───────────── 다항식 ─────────────
  {
    id: 'h1.poly',
    lesson: [
      { id: 'c1', t: '다항식의 덧셈·뺄셈·곱셈', b: T`동류항끼리 모아서 계산하고, 곱셈은 분배법칙으로 전개해요.

        - 교환·결합·분배법칙이 그대로 성립해요.
        - 지수법칙: $a^m\times a^n=a^{m+n}$, $(a^m)^n=a^{mn}$
        - 곱의 차수 = 차수의 합` },
      { id: 'c2', t: '곱셈 공식', b: T`중3에서 배운 것 + 세제곱 공식
        - $(a+b)^3=a^3+3a^2b+3ab^2+b^3$
        - $(a-b)^3=a^3-3a^2b+3ab^2-b^3$
        - $(a+b)(a^2-ab+b^2)=a^3+b^3$
        - $(a-b)(a^2+ab+b^2)=a^3-b^3$
        - $a^2+b^2=(a+b)^2-2ab$
        - $a^3+b^3=(a+b)^3-3ab(a+b)$` },
    ],
    gens: [
      { id: 'cube', lv: [1, 3], card: 'c2', make: (R) => {
        const a = R.nz(-4, 4); const cor = P([1, 3 * a, 3 * a * a, a * a * a]);
        return { q: `$(x${pm(a)})^3$[을/를] 전개하면?`, correct: `$${cor}$`, wrong: uniq([P([1, a, a * a, a * a * a]), P([1, 3 * a, 3 * a, a * a * a]), P([1, 3 * a, 3 * a * a, -a * a * a]), P([1, 0, 0, a * a * a])], cor).slice(0, 3).map((s) => `$${s}$`), why: `$(x+a)^3=x^3+3ax^2+3a^2x+a^3$ 에서 $a=${a}$ → $${cor}$` };
      } },
      { id: 'sum3', lv: [3, 5], card: 'c2', make: (R) => {
        const s = R.int(2, 7), p = R.int(1, 8); const kind = R.pick(['sq', 'cu']);
        if (kind === 'sq') return { q: `$x+y=${s}$, $xy=${p}$일 때 $x^2+y^2$의 값은?`, a: s * s - 2 * p, wrong: [s * s, s * s + 2 * p, s * p], why: `$x^2+y^2=(x+y)^2-2xy=${s * s}-${2 * p}=${s * s - 2 * p}$` };
        return { q: `$x+y=${s}$, $xy=${p}$일 때 $x^3+y^3$의 값은?`, a: s ** 3 - 3 * p * s, wrong: [s ** 3, s ** 3 + 3 * p * s, s * s * s - p], why: `$x^3+y^3=(x+y)^3-3xy(x+y)=${s ** 3}-${3 * p * s}=${s ** 3 - 3 * p * s}$` };
      } },
      { id: 'coef', lv: [2, 5], card: 'c1', make: (R) => {
        const a = R.nz(-4, 4), b = R.nz(-4, 4), c = R.nz(-4, 4);
        const pr = polyMul([1, a, b], [1, c]); // x³ + (a+c)x² + (b+ac)x + bc
        const ask = R.pick([1, 2]);
        const ans = ask === 1 ? pr[1] : pr[2];
        return { q: `$(${P([1, a, b])})(x${pm(c)})$[을/를] 전개했을 때 $x^${ask === 1 ? '2' : ''}$의 계수는?`.replace('^1', '').replace('$x^$', '$x$'), a: ans, wrong: [ans + 1, -ans || 1, pr[3]].filter((v) => v !== ans), why: `전개하면 $${P(pr)}$ 이므로 계수는 $${ans}$` };
      } },
    ],
  },
  {
    id: 'h1.div',
    lesson: [
      { id: 'c1', t: '다항식의 나눗셈', b: T`$A=BQ+R$ ($R$의 차수 < $B$의 차수)

        세로셈(긴 나눗셈): 최고차항끼리 나눠 몫을 세우고 빼는 것을 반복해요.
        $(x^2+5x+6)\div(x+2)$ → 몫 $x+3$, 나머지 $0$` },
      { id: 'c2', t: '조립제법', b: T`$x-a$로 나눌 때는 **조립제법**이 빨라요.

        $x^3+2x^2-5x+1$을 $x-2$로 나누기:
        계수 $1,\ 2,\ -5,\ 1$, 기준 $a=2$
        1 → $2\times1+2=4$ → $2\times4-5=3$ → $2\times3+1=7$
        몫 $x^2+4x+3$, 나머지 $7$

        ($x+a$로 나누면 기준값은 $-a$)` },
    ],
    gens: [
      { id: 'q', lv: [1, 4], card: 'c2', make: (R) => {
        const a = R.nz(-4, 4); const Q = [1, R.nz(-4, 4), R.nz(-4, 4)]; const r = R.int(-5, 5);
        const base = polyMul(Q, [1, -a]); base[base.length - 1] += r;
        const [q, rem] = synth(base, a);
        const ask = R.pick(['q', 'r']);
        const cor = ask === 'q' ? `$${P(q)}$` : rem;
        if (ask === 'q') return { q: `$${P(base)}$[을/를] $x${pm(-a)}$[으로/로] 나눈 몫은?`, correct: cor, wrong: uniq([P([1, q[1] + 1, q[2]]), P([1, -q[1], q[2]]), P([1, q[1], q[2] + 1]), P([1, q[1], -q[2]])], P(q)).slice(0, 3).map((s) => `$${s}$`), why: `조립제법(기준 $${a}$): 계수 $${base.join(',\\ ')}$ → 몫 $${P(q)}$, 나머지 $${rem}$` };
        return { q: `$${P(base)}$[을/를] $x${pm(-a)}$[으로/로] 나눈 나머지는?`, a: rem, wrong: [r + 1, -rem, rem + a].filter((v) => v !== rem), why: `조립제법(기준 $${a}$): 나머지 $${rem}$` };
      } },
      { id: 'rel', lv: [3, 5], card: 'c1', make: (R) => {
        const Bq = [1, R.int(1, 3)], Qq = [1, R.nz(-3, 3)], r = R.int(1, 5);
        const A = polyMul(Bq, Qq); A[A.length - 1] += r;
        return { q: `다항식 $A$를 $${P(Bq)}$[으로/로] 나눈 몫이 $${P(Qq)}$이고 나머지가 $${r}$일 때, $A$는?`, correct: `$${P(A)}$`, wrong: uniq([P(polyMul(Bq, Qq)), P(A.map((c, i) => (i === A.length - 1 ? c - 2 * r : c))), P(A.map((c, i) => (i === 1 ? c + 1 : c)))], P(A)).map((s) => `$${s}$`), why: `$A=BQ+R=(${P(Bq)})(${P(Qq)})+${r}=${P(A)}$` };
      } },
    ],
  },
  {
    id: 'h1.rem',
    lesson: [
      { id: 'c1', t: '나머지정리', b: T`다항식 $P(x)$를 $x-a$로 나눈 나머지는 $P(a)$예요.

        예) $P(x)=x^3-2x+5$를 $x-2$로 나눈 나머지: $P(2)=8-4+5=9$
        $x+3$으로 나누면 $P(-3)$` },
      { id: 'c2', t: '인수정리', b: T`$P(a)=0\iff P(x)$가 $x-a$로 나누어떨어짐 ($x-a$가 인수)

        예) $P(x)=x^2-5x+6$, $P(2)=0$ → $(x-2)$는 인수` },
      { id: 'c3', t: '항등식', b: T`문자에 어떤 값을 대입해도 항상 성립하는 등식을 ==항등식==이라 해요.

        $ax^2+bx+c=0$이 $x$에 대한 항등식 $\iff a=b=c=0$
        $ax^2+bx+c=a'x^2+b'x+c'$ → 양변의 **계수를 비교** ($a=a',\ b=b',\ c=c'$)

        **수치대입법**: 편한 값(0, 1, −1)을 대입해도 돼요.` },
    ],
    gens: [
      { id: 'rem', lv: [1, 4], card: 'c1', make: (R) => {
        const co = [1, R.nz(-4, 4), R.nz(-5, 5), R.nz(-6, 6)]; const a = R.nz(-3, 3);
        return { q: `$${P(co)}$[을/를] $x${pm(-a)}$[으로/로] 나눈 나머지는?`, a: evalP(co, a), wrong: [evalP(co, -a), co[3], evalP(co, a) + 1].filter((v) => v !== evalP(co, a)), why: `나머지정리: $P(${a})=${evalP(co, a)}$` };
      } },
      { id: 'find', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.nz(-3, 3), k = R.nz(-5, 5);
        // P(x)=x^3+kx^2... 인수 x−a → P(a)=0
        const c1 = R.nz(-4, 4), c2 = R.nz(-5, 5);
        // x^3 + k x^2 + c1 x + c2, P(a)=0 → k = -(a^3 + c1 a + c2)/a^2 must be integer
        const num = -(a ** 3 + c1 * a + c2);
        if (num % (a * a) !== 0) return { q: '$x^3+kx^2-4x+4$가 $x-2$로 나누어떨어질 때 상수 $k$의 값은?', a: -1, wrong: [1, 2, -2], why: '$P(2)=8+4k-8+4=0$ → $k=-1$' };
        const kk = num / (a * a);
        return { q: `$x^3${pm(kk)}x^2${pm(c1)}x${pm(c2)}$이 $x${pm(-a)}$로 나누어떨어질 때 ... 이 식의 $x^2$의 계수를 $k$라 할 때 $k$의 값은?`.replace(/ \.\.\. 이 식의 \$x\^2\$의 계수를 \$k\$라 할 때 \$k\$의 값은\?/, ' ... '), a: kk, wrong: [], why: '' };
      } },
      { id: 'ident', lv: [2, 5], card: 'c3', make: (R) => {
        const a = R.nz(-4, 4), b = R.nz(-4, 4), c = R.nz(-5, 5);
        const ex = polyMul([1, a], [1, b]); // x²+(a+b)x+ab
        const kind = R.pick(['sum', 'prod']);
        return { q: `$${P([1, a + b, a * b])}=(x+p)(x+q)$가 $x$에 대한 항등식일 때 $p+q$의 값은?`, a: a + b, wrong: [a * b, a - b, -(a + b)].filter((v) => v !== a + b), why: `우변을 전개하면 $x^2+(p+q)x+pq$ → 계수 비교로 $p+q=${a + b}$, $pq=${a * b}$` };
      } },
    ].filter((g) => g.id !== 'find').concat([
      { id: 'find2', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.pick([1, 2, -1, -2]), c1 = R.int(-4, 4), k = R.nz(-4, 4);
        const c2 = -(a ** 3 + k * a * a + c1 * a);
        return { q: `$x^3+mx^2${pm(c1)}x${pm(c2)}$[이/가] $x${pm(-a)}$[으로/로] 나누어떨어질 때, 상수 $m$의 값은?`.replace('x+0', 'x'), a: k, wrong: [-k, k + 1, c1].filter((v) => v !== k), why: `인수정리: $P(${a})=0$ → $${a ** 3}+${a * a}m${pm(c1 * a)}${pm(c2)}=0$ → $m=${k}$` };
      } },
    ]),
  },
  {
    id: 'h1.fac',
    lesson: [
      { id: 'c1', t: '삼차식의 인수분해', b: T`$P(x)$의 인수 $x-a$를 인수정리로 찾아요. ($P(a)=0$이 되는 $a$는 상수항의 약수 중에서!)
        그 뒤 조립제법으로 몫을 구해 더 인수분해해요.

        $x^3-6x^2+11x-6$: $P(1)=0$ → $(x-1)(x^2-5x+6)=(x-1)(x-2)(x-3)$` },
      { id: 'c2', t: '세제곱 공식', b: T`- $a^3+b^3=(a+b)(a^2-ab+b^2)$
        - $a^3-b^3=(a-b)(a^2+ab+b^2)$
        - $a^3+3a^2b+3ab^2+b^3=(a+b)^3$

        예) $x^3+8=(x+2)(x^2-2x+4)$, $x^3-27=(x-3)(x^2+3x+9)$` },
    ],
    gens: [
      { id: 'cubic', lv: [2, 5], card: 'c1', make: (R) => {
        let r1 = R.nz(-4, 4), r2 = R.nz(-4, 4), r3 = R.nz(-4, 4);
        const co = polyMul(polyMul([1, -r1], [1, -r2]), [1, -r3]);
        const f = (a, b, c) => `(x${pm(-a)})(x${pm(-b)})(x${pm(-c)})`;
        const cor = f(r1, r2, r3);
        return { q: `$${P(co)}$[을/를] 인수분해하면?`, correct: `$${cor}$`, wrong: uniq([f(-r1, r2, r3), f(r1, -r2, r3), f(r1, r2, -r3), f(-r1, -r2, -r3)], cor).slice(0, 3).map((s) => `$${s}$`), why: `$P(${r1})=0$이므로 $x${pm(-r1)}$[은/는] 인수. 조립제법으로 나누면 몫 $${P(polyMul([1, -r2], [1, -r3]))}$ → $${cor}$` };
      } },
      { id: 'cubeform', lv: [1, 4], card: 'c2', make: (R) => {
        const a = R.int(1, 4); const plus = R.chance(0.5);
        const q = `x^3${plus ? '+' : '-'}${a ** 3}`;
        const cor = plus ? `(x+${a})(x^2-${a === 1 ? '' : a}x+${a * a})` : `(x-${a})(x^2+${a === 1 ? '' : a}x+${a * a})`;
        const wrong = plus ? [`(x+${a})(x^2+${a === 1 ? '' : a}x+${a * a})`, `(x-${a})(x^2+${a === 1 ? '' : a}x+${a * a})`, `(x+${a})^3`] : [`(x-${a})(x^2-${a === 1 ? '' : a}x+${a * a})`, `(x+${a})(x^2+${a === 1 ? '' : a}x+${a * a})`, `(x-${a})^3`];
        return { q: `$${q}$[을/를] 인수분해하면?`, correct: `$${cor}$`, wrong: wrong.map((s) => `$${s}$`), why: `$${plus ? 'a^3+b^3=(a+b)(a^2-ab+b^2)' : 'a^3-b^3=(a-b)(a^2+ab+b^2)'}$ 에서 $b=${a}$ → $${cor}$` };
      } },
    ],
  },

  // ───────────── 방정식과 부등식 ─────────────
  {
    id: 'h1.cx',
    lesson: [
      { id: 'c1', t: '허수단위 i', b: T`$i^2=-1$ 로 정의해요. ($i=\sqrt{-1}$)

        ==복소수== $a+bi$ ($a,b$는 실수): $a$는 **실수부분**, $b$는 **허수부분**
        - $b=0$이면 실수, $b\ne0$이면 허수, $a=0,b\ne0$이면 순허수

        $i$의 거듭제곱은 4개 주기: $i,\ -1,\ -i,\ 1,\ i,\dots$` },
      { id: 'c2', t: '복소수의 사칙연산', b: T`$i$를 문자처럼 계산하고 $i^2=-1$로 바꿔요.

        - $(a+bi)+(c+di)=(a+c)+(b+d)i$
        - $(a+bi)(c+di)=(ac-bd)+(ad+bc)i$
        - 켤레복소수 $\overline{a+bi}=a-bi$
        - 나눗셈: 분모의 켤레복소수를 곱해서 실수로 만들어요.
        $(a+bi)(a-bi)=a^2+b^2$` },
      { id: 'c3', t: '복소수가 같다', b: T`$a+bi=c+di\iff a=c,\ b=d$ ($a,b,c,d$ 실수)

        $a+bi=0\iff a=b=0$` },
    ],
    gens: [
      { id: 'pow', lv: [1, 3], card: 'c1', make: (R) => {
        const n = R.int(2, 30); const r = n % 4; const ans = ['1', '-i', '-1', 'i'][(n - 0) % 4 === 0 ? 3 : 0] ;
        const vals = { 0: '1', 1: 'i', 2: '-1', 3: '-i' }; const cor = vals[r];
        return { q: `$i^{${n}}$의 값은?`, correct: `$${cor}$`, wrong: Object.values(vals).filter((v) => v !== cor).map((v) => `$${v}$`), why: `$i$의 거듭제곱은 주기 4: $i^{${n}}=i^{${n - r}+${r}}$, $${n}\\div4$의 나머지가 $${r}$ → $${cor}$` };
      } },
      { id: 'mul', lv: [2, 4], card: 'c2', make: (R) => {
        const a = R.nz(-4, 4), b = R.nz(-4, 4), c = R.nz(-4, 4), d = R.nz(-4, 4);
        const re = a * c - b * d, im = a * d + b * c; const cor = cx(re, im);
        return { q: `$(${cx(a, b)})(${cx(c, d)})$[을/를] $x+yi$ 꼴로 나타내면?`, correct: `$${cor}$`, wrong: uniq([cx(a * c + b * d, im), cx(re, -im), cx(a * c, b * d), cx(re + 1, im)], cor).slice(0, 3).map((s) => `$${s}$`), why: `$(${cx(a, b)})(${cx(c, d)})=${a * c}${pm(a * d)}i${pm(b * c)}i${pm(b * d)}i^2$, $i^2=-1$ → $${cor}$` };
      } },
      { id: 'conj', lv: [1, 4], card: 'c2', make: (R) => {
        const a = R.nz(-6, 6), b = R.nz(-6, 6);
        if (R.chance(0.5)) return { q: `$${cx(a, b)}$의 켤레복소수는?`, correct: `$${cx(a, -b)}$`, wrong: uniq([cx(-a, b), cx(-a, -b), cx(b, a)], cx(a, -b)).map((s) => `$${s}$`), why: '켤레복소수는 허수부분의 부호만 바꿔요.' };
        return { q: `$(${cx(a, b)})(${cx(a, -b)})$의 값은?`, a: a * a + b * b, wrong: [a * a - b * b, (a + b) ** 2, 2 * a].filter((v) => v !== a * a + b * b), why: `켤레복소수의 곱: $a^2+b^2=${a * a}+${b * b}=${a * a + b * b}$` };
      } },
      { id: 'div', lv: [3, 5], card: 'c2', make: (R) => {
        const c = R.int(1, 3), d = R.int(1, 3), k = R.int(1, 3);
        // (a+bi)/(c+di) with integer result: (p+qi)(c+di)/(c²+d²) ; choose p+qi = (m+ni)(c+di)
        const m = R.nz(-3, 3), n = R.nz(-3, 3);
        const num = [m * c - n * d, m * d + n * c];
        return { q: `$\\dfrac{${cx(num[0], num[1])}}{${cx(c, d)}}$[을/를] $x+yi$ 꼴로 나타내면?`, correct: `$${cx(m, n)}$`, wrong: uniq([cx(m, -n), cx(-m, n), cx(n, m)], cx(m, n)).map((s) => `$${s}$`), why: `분모의 켤레복소수 $${cx(c, -d)}$를 분모·분자에 곱하면 분모 $${c * c + d * d}$ → 결과 $${cx(m, n)}$` };
      } },
      { id: 'eq', lv: [2, 5], card: 'c3', make: (R) => {
        const x = R.nz(-6, 6), y = R.nz(-6, 6);
        return { q: `$(x+y)+(x-y)i=${cx(x + y, x - y)}$일 때 실수 $x,\\ y$에 대하여 $xy$의 값은? (복소수가 서로 같을 조건)`.replace(/ \(.*\)/, ''), a: x * y, wrong: [x + y, x - y, -x * y].filter((v) => v !== x * y), why: `$x+y=${x + y}$, $x-y=${x - y}$ → $x=${x},\\ y=${y}$ → $xy=${x * y}$` };
      } },
    ],
  },
  {
    id: 'h1.qd',
    lesson: [
      { id: 'c1', t: '판별식과 근의 종류', b: T`$ax^2+bx+c=0$ ($a,b,c$는 실수)에서 $D=b^2-4ac$

        - $D>0$: 서로 다른 두 **실근**
        - $D=0$: **중근** (실수)
        - $D<0$: 서로 다른 두 **허근** (켤레복소수)

        이제 $D<0$이어도 근이 있어요 (복소수 범위)!` },
      { id: 'c2', t: '조건에서 상수 구하기', b: T`- 실근을 가진다 → $D\ge0$
        - 중근 → $D=0$
        - 서로 다른 두 실근 → $D>0$

        $x^2+kx+9=0$이 중근이면 $D=k^2-36=0$ → $k=\pm6$` },
    ],
    gens: [
      { id: 'kind', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.pick([1, 2, 3]), b = R.nz(-6, 6), c = R.nz(-6, 6); const D = b * b - 4 * a * c;
        const ans = D > 0 ? '서로 다른 두 실근' : D === 0 ? '중근' : '서로 다른 두 허근';
        return { q: `이차방정식 $${P([a, b, c])}=0$의 근의 종류는?`, correct: ans, wrong: ['서로 다른 두 실근', '중근', '서로 다른 두 허근'].filter((x) => x !== ans), why: `$D=${paren(b)}^2-4\\times${a}\\times${paren(c)}=${D}$ → ${ans}` };
      } },
      { id: 'dbl', lv: [2, 5], card: 'c2', make: (R) => {
        const m = R.int(2, 6); // x²+kx+m² : D=k²-4m²=0 → k=±2m
        return { q: `$x^2+kx+${m * m}=0$이 중근을 가질 때 양수 $k$의 값은?`, a: 2 * m, wrong: [m, m * m, 4 * m], why: `$D=k^2-4\\times${m * m}=0$ → $k^2=${4 * m * m}$ → $k=\\pm${2 * m}$, 양수는 $${2 * m}$` };
      } },
      { id: 'range', lv: [3, 5], card: 'c2', make: (R) => {
        const c = R.pick([1, 2, 3, 4, 5, 8]);
        // x²-2x+k=0 ... 서로 다른 두 실근 → 4-4k>0 → k<1. 일반: x²+2bx+c=0 : D/4=b²-c>0
        const b = R.int(1, 5);
        const bound = b * b;
        return { q: `$x^2+${2 * b}x+k=0$이 서로 다른 두 실근을 가질 때 $k$의 범위는?`, correct: `$k<${bound}$`, wrong: [`$k>${bound}$`, `$k\\le${bound}$`, `$k<${2 * b}$`], why: `$\\dfrac D4=${b}^2-k>0$ → $k<${bound}$` };
      } },
    ],
  },
  {
    id: 'h1.qr',
    lesson: [
      { id: 'c1', t: '근과 계수의 관계', b: T`$ax^2+bx+c=0$의 두 근이 $\alpha,\ \beta$이면
        $$\alpha+\beta=-\dfrac ba,\qquad \alpha\beta=\dfrac ca$$
        ($a,b,c$가 복소수여도 성립하지만 고1에서는 실수 범위)` },
      { id: 'c2', t: '식의 값 구하기', b: T`- $\alpha^2+\beta^2=(\alpha+\beta)^2-2\alpha\beta$
        - $\dfrac1\alpha+\dfrac1\beta=\dfrac{\alpha+\beta}{\alpha\beta}$
        - $(\alpha-\beta)^2=(\alpha+\beta)^2-4\alpha\beta$` },
      { id: 'c3', t: '두 수를 근으로 하는 이차방정식', b: T`두 수 $\alpha,\ \beta$를 근으로 하고 $x^2$의 계수가 1인 이차방정식:
        $$x^2-(\alpha+\beta)x+\alpha\beta=0$$` },
    ],
    gens: [
      { id: 'sp', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.pick([1, 2, 3]), r1 = R.nz(-5, 5), r2 = R.nz(-5, 5);
        const co = [a, -a * (r1 + r2), a * r1 * r2];
        const ask = R.pick(['sum', 'prod']);
        return { q: `이차방정식 $${P(co)}=0$의 두 근의 ${ask === 'sum' ? '합' : '곱'}은?`, a: ask === 'sum' ? r1 + r2 : r1 * r2, wrong: [-(r1 + r2), r1 * r2 + 1, co[1]].filter((v) => v !== (ask === 'sum' ? r1 + r2 : r1 * r2)), why: `근과 계수의 관계: 합 $-\\dfrac ba=${r1 + r2}$, 곱 $\\dfrac ca=${r1 * r2}$` };
      } },
      { id: 'val', lv: [2, 5], card: 'c2', make: (R) => {
        const s = R.int(-6, 6), p = R.int(1, 9);
        const ask = R.pick(['sq', 'inv', 'diff']);
        const eq = `x^2${pm(-s)}x${pm(p)}=0`;
        if (ask === 'sq') return { q: `$${eq}$의 두 근을 $\\alpha,\\ \\beta$라 할 때 $\\alpha^2+\\beta^2$의 값은?`, a: s * s - 2 * p, wrong: [s * s, s * s + 2 * p, p], why: `$\\alpha+\\beta=${s}$, $\\alpha\\beta=${p}$ → $${s}^2-2\\times${p}=${s * s - 2 * p}$` };
        if (ask === 'diff') return { q: `$${eq}$의 두 근을 $\\alpha,\\ \\beta$라 할 때 $(\\alpha-\\beta)^2$의 값은?`, a: s * s - 4 * p, wrong: [s * s, s * s + 4 * p, s * s - 2 * p], why: `$(\\alpha-\\beta)^2=(\\alpha+\\beta)^2-4\\alpha\\beta=${s * s}-${4 * p}=${s * s - 4 * p}$` };
        return { q: `$${eq}$의 두 근을 $\\alpha,\\ \\beta$라 할 때 $\\dfrac1\\alpha+\\dfrac1\\beta$의 값은?`, correct: `$${fracTex(s, p)}$`, wrong: [`$${fracTex(p, s || 1)}$`, `$${fracTex(-s, p)}$`, `$${s * p}$`].filter((x) => x !== `$${fracTex(s, p)}$`), why: `$\\dfrac{\\alpha+\\beta}{\\alpha\\beta}=\\dfrac{${s}}{${p}}$` };
      } },
      { id: 'make', lv: [2, 5], card: 'c3', make: (R) => {
        const r1 = R.nz(-5, 5), r2 = R.nz(-5, 5); const cor = `x^2${pm(-(r1 + r2))}x${pm(r1 * r2)}=0`.replace(/x([+-]0)x/, 'x').replace('x^2+0x', 'x^2');
        const co = [1, -(r1 + r2), r1 * r2];
        return { q: `두 수 $${r1},\\ ${r2}$를 근으로 하고 $x^2$의 계수가 1인 이차방정식은?`, correct: `$${P(co)}=0$`, wrong: uniq([P([1, r1 + r2, r1 * r2]), P([1, -(r1 + r2), -r1 * r2]), P([1, r1 + r2, -r1 * r2])], P(co)).slice(0, 3).map((s) => `$${s}=0$`), why: `$x^2-(\\text{합})x+(\\text{곱})=0$ → $x^2-(${r1 + r2})x+(${r1 * r2})=0$` };
      } },
    ],
  },
  {
    id: 'h1.qf',
    lesson: [
      { id: 'c1', t: '이차방정식과 이차함수의 그래프', b: T`이차방정식 $ax^2+bx+c=0$의 실근 = 이차함수 $y=ax^2+bx+c$의 그래프와 **$x$축의 교점의 $x$좌표**

        - $D>0$: 서로 다른 두 점에서 만남
        - $D=0$: 한 점에서 만남 (접함)
        - $D<0$: 만나지 않음` },
      { id: 'c2', t: '이차함수와 직선', b: T`$y=f(x)$와 $y=mx+n$의 교점 → 연립해서 $f(x)=mx+n$의 $D$로 판단
        - $D>0$: 두 점에서 만남
        - $D=0$: 접함 (접선)
        - $D<0$: 만나지 않음` },
    ],
    gens: [
      { id: 'xaxis', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.pick([1, -1, 2]), b = R.nz(-6, 6), c = R.nz(-6, 6); const D = b * b - 4 * a * c; const n = D > 0 ? 2 : D === 0 ? 1 : 0;
        return { q: `$y=${P([a, b, c])}$의 그래프와 $x$축의 교점의 개수는?`, a: n, unit: '개', wrong: [0, 1, 2].filter((v) => v !== n), why: `$D=${b * b - 4 * a * c}$ → ${n === 2 ? '$D>0$' : n === 1 ? '$D=0$' : '$D<0$'}이므로 교점 ${n}개` };
      } },
      { id: 'tan', lv: [3, 5], card: 'c2', make: (R) => {
        const m = R.nz(-4, 4); const b = R.int(1, 5);
        // y=x²+2bx ... y = x² + k 와 y = m x 접함: x² - m x + k = 0 → D = m² - 4k = 0 → k = m²/4 → choose m even
        const mm = 2 * R.nz(-3, 3);
        return { q: `$y=x^2+k$와 직선 $y=${mm}x$가 접할 때 상수 $k$의 값은?`, a: (mm * mm) / 4, wrong: [mm, mm * mm, -(mm * mm) / 4].filter((v) => v !== (mm * mm) / 4), why: `$x^2+k=${mm}x$ → $x^2${pm(-mm)}x+k=0$, $D=${mm * mm}-4k=0$ → $k=${(mm * mm) / 4}$` };
      } },
      { id: 'inter', lv: [2, 5], card: 'c1', make: (R) => {
        const r1 = R.nz(-5, 5); let r2 = R.nz(-5, 5); if (r2 === r1) r2 = r1 + 2;
        return { q: `이차함수 $y=${P([1, -(r1 + r2), r1 * r2])}$의 그래프가 $x$축과 만나는 두 점 사이의 거리는?`, a: Math.abs(r1 - r2), wrong: [Math.abs(r1 + r2), Math.abs(r1 * r2), Math.abs(r1 - r2) + 1].filter((v) => v !== Math.abs(r1 - r2)), why: `$x=${r1}$ 또는 $x=${r2}$ → 거리 $|${r1}-${paren(r2)}|=${Math.abs(r1 - r2)}$` };
      } },
    ],
  },
  {
    id: 'h1.qm',
    lesson: [
      { id: 'c1', t: '제한된 범위에서의 최대·최소', b: T`$y=a(x-p)^2+q$ ($\alpha\le x\le\beta$)

        꼭짓점 $x=p$가 범위 **안**이면 꼭짓점과 양 끝점의 함숫값을 비교, 범위 **밖**이면 양 끝점의 값만 비교해요.

        - $a>0$: 꼭짓점이 최솟값, 최댓값은 꼭짓점에서 먼 끝점
        - $a<0$: 꼭짓점이 최댓값, 최솟값은 꼭짓점에서 먼 끝점` },
    ],
    gens: [
      { id: 'in', lv: [1, 4], card: 'c1', make: (R) => {
        const a = R.pick([1, 2, -1, -2]), p = R.int(-2, 2), q = R.int(-4, 4);
        const lo = p - R.int(1, 3), hi = p + R.int(1, 3);
        const f = (x) => a * (x - p) ** 2 + q; const vals = [f(lo), f(hi), f(p)];
        const ask = R.pick(['max', 'min']);
        const ans = ask === 'max' ? Math.max(...vals) : Math.min(...vals);
        const fx = `${a === 1 ? '' : a === -1 ? '-' : a}(x${pm(-p)})^2${q === 0 ? '' : pm(q)}`.replace('(x+0)', 'x').replace('(x-0)', 'x');
        return { q: `$${lo}\\le x\\le${hi}$에서 $y=${fx}$의 ${ask === 'max' ? '최댓값' : '최솟값'}은?`, a: ans, wrong: vals.filter((v) => v !== ans).concat([ans + 1]).slice(0, 3), why: `꼭짓점 $x=${p}$는 범위 안이에요. $f(${lo})=${f(lo)}$, $f(${p})=${f(p)}$, $f(${hi})=${f(hi)}$ 중 ${ask === 'max' ? '최대' : '최소'} $=${ans}$` };
      } },
      { id: 'out', lv: [3, 5], card: 'c1', make: (R) => {
        const p = R.int(-2, 1), q = R.int(-3, 3); const lo = p + R.int(1, 2), hi = lo + R.int(1, 3);
        const f = (x) => (x - p) ** 2 + q; const ask = R.pick(['max', 'min']);
        const ans = ask === 'max' ? f(hi) : f(lo);
        return { q: `$${lo}\\le x\\le${hi}$에서 $y=(x${pm(-p)})^2${q === 0 ? '' : pm(q)}$의 ${ask === 'max' ? '최댓값' : '최솟값'}은?`.replace('(x+0)', 'x'), a: ans, wrong: [q, f(p), ask === 'max' ? f(lo) : f(hi)].filter((v) => v !== ans), why: `꼭짓점 $x=${p}$가 범위 밖이므로 끝점만 비교: $f(${lo})=${f(lo)}$, $f(${hi})=${f(hi)}$ → ${ask === 'max' ? '최댓값' : '최솟값'} $${ans}$` };
      } },
    ],
  },
  {
    id: 'h1.he',
    lesson: [
      { id: 'c1', t: '삼차·사차방정식', b: T`인수분해(인수정리·조립제법)로 푼 뒤 각 인수 = 0으로 풀어요.

        $x^3-6x^2+11x-6=0$ → $(x-1)(x-2)(x-3)=0$ → $x=1,2,3$
        $x^4-5x^2+4=0$: $x^2=t$로 치환 → $(t-1)(t-4)=0$ → $x=\pm1,\pm2$` },
      { id: 'c2', t: '허근과 ω', b: T`$x^3=1$ → $(x-1)(x^2+x+1)=0$ → $x=1$ 또는 $x=\dfrac{-1\pm\sqrt3\,i}{2}$

        실계수 방정식에서 허근이 있으면 **켤레도 근**이에요.` },
    ],
    gens: [
      { id: 'cubic', lv: [1, 4], card: 'c1', make: (R) => {
        const rs = [R.nz(-4, 4), R.nz(-4, 4), R.nz(-4, 4)]; const co = polyMul(polyMul([1, -rs[0]], [1, -rs[1]]), [1, -rs[2]]);
        const mx = Math.max(...rs);
        return { q: `$${P(co)}=0$의 가장 큰 실근은?`, a: mx, wrong: [Math.min(...rs), -mx, rs.reduce((a, b) => a + b)].filter((v) => v !== mx), why: `인수분해하면 $(x${pm(-rs[0])})(x${pm(-rs[1])})(x${pm(-rs[2])})=0$ → 근 $${rs.join(',\\ ')}$ 중 최대 $${mx}$` };
      } },
      { id: 'quartic', lv: [2, 5], card: 'c1', make: (R) => {
        const a = R.int(1, 3), b = R.int(a + 1, 5);
        return { q: `$x^4-${a * a + b * b}x^2+${a * a * b * b}=0$의 실근 중 가장 큰 것은?`, a: Math.max(a, b), wrong: [a * a, b * b, a + b].filter((v) => v !== Math.max(a, b)), why: `$x^2=t$ → $t^2-${a * a + b * b}t+${a * a * b * b}=(t-${a * a})(t-${b * b})=0$ → $x=\\pm${a},\\ \\pm${b}$` };
      } },
      { id: 'cnt', lv: [3, 5], card: 'c2', make: (R) => {
        const n = R.pick([3, 4, 5]);
        return { q: `$x^3=1$의 복소수 범위의 근의 개수는?`, a: 3, unit: '개', wrong: [1, 2, 4], why: '삼차방정식은 복소수 범위에서 (중근 포함) 항상 근이 3개예요. $x=1$과 두 허근.' };
      } },
    ],
  },
  {
    id: 'h1.se',
    lesson: [
      { id: 'c1', t: '미지수가 2개인 연립이차방정식', b: T`**일차식 + 이차식** 꼴: 일차식에서 한 문자를 정리해 이차식에 대입(대입법)

        $x+y=5,\ xy=6$ → $x,y$는 $t^2-5t+6=0$의 두 근 → $(x,y)=(2,3),\ (3,2)$

        **대칭식**($x+y$, $xy$)은 합과 곱을 이용해요.` },
    ],
    gens: [
      { id: 'sp', lv: [1, 4], card: 'c1', make: (R) => {
        let a = R.int(1, 6), b = R.int(a + 1, 8);
        return { q: `$x+y=${a + b}$, $xy=${a * b}$ 를 만족하는 $x>y$인 해에서 $x-y$의 값은?`, a: b - a, wrong: [a + b, a * b, b - a + 1], why: `$x,\\ y$는 $t^2-${a + b}t+${a * b}=0$의 근 → $${b},\\ ${a}$. $x-y=${b - a}$` };
      } },
      { id: 'sub', lv: [2, 5], card: 'c1', make: (R) => {
        const x = R.int(1, 5), y = R.int(1, 5); if (x === y) return { q: '$x+y=4$, $x^2+y^2=8$을 만족하는 $xy$의 값은?', a: 4, wrong: [2, 8, 16], why: '$xy=\\dfrac{(x+y)^2-(x^2+y^2)}{2}=\\dfrac{16-8}{2}=4$' };
        const s = x + y, q2 = x * x + y * y;
        return { q: `$x+y=${s}$, $x^2+y^2=${q2}$일 때 $xy$의 값은?`, a: x * y, wrong: [s * s, q2 - s, x + y + 1].filter((v) => v !== x * y), why: `$xy=\\dfrac{(x+y)^2-(x^2+y^2)}{2}=\\dfrac{${s * s}-${q2}}{2}=${x * y}$` };
      } },
    ],
  },
  {
    id: 'h1.ie1',
    lesson: [
      { id: 'c1', t: '연립일차부등식', b: T`각 부등식을 풀어 **공통 범위**를 구해요 (수직선에 그리면 쉬워요).

        $x>1$ 이고 $x\le4$ → $1<x\le4$
        공통 범위가 없으면 **해가 없다**` },
      { id: 'c2', t: '절댓값을 포함한 부등식', b: T`$a>0$일 때
        - $|x|<a\iff -a<x<a$
        - $|x|>a\iff x<-a$ 또는 $x>a$

        $|x-3|<2$ → $-2<x-3<2$ → $1<x<5$` },
    ],
    gens: [
      { id: 'sys', lv: [1, 4], card: 'c1', make: (R) => {
        const a = R.int(-4, 1), b = R.int(a + 2, a + 8);
        const cor = `$${a}<x\\le${b}$`;
        return { q: `연립부등식 $x>${a},\\ x\\le${b}$의 해는?`, correct: cor, wrong: [`$x>${b}$`, `$${a}\\le x<${b}$`, `$x<${a}$ 또는 $x>${b}$`], why: '두 부등식의 공통 범위를 수직선에서 찾아요.' };
      } },
      { id: 'abs', lv: [2, 5], card: 'c2', make: (R) => {
        const c = R.nz(-5, 5), r = R.int(1, 6); const lt = R.chance(0.5);
        const lo = c - r, hi = c + r;
        const cor = lt ? `$${lo}<x<${hi}$` : `$x<${lo}$ 또는 $x>${hi}$`;
        return { q: `$|x${pm(-c)}|${lt ? '<' : '>'}${r}$의 해는?`.replace('|x+0|', '|x|'), correct: cor, wrong: [lt ? `$x<${lo}$ 또는 $x>${hi}$` : `$${lo}<x<${hi}$`, lt ? `$${-r}<x<${r}$` : `$x<${-r}$ 또는 $x>${r}$`, `$${lo}\\le x\\le${hi}$`].slice(0, 3), why: `$${lt ? `-${r}<x${pm(-c)}<${r}` : `x${pm(-c)}<-${r}\\text{ 또는 }x${pm(-c)}>${r}`}$ → $x$의 범위는 ${cor}` };
      } },
    ],
  },
  {
    id: 'h1.ie2',
    lesson: [
      { id: 'c1', t: '이차부등식의 풀이', b: T`$a>0$이고 $f(x)=a(x-\alpha)(x-\beta)$ ($\alpha<\beta$)일 때
        - $f(x)>0$: $x<\alpha$ 또는 $x>\beta$ (바깥쪽)
        - $f(x)<0$: $\alpha<x<\beta$ (사이)

        (≥, ≤는 경계 포함) 그래프를 그려서 판단하세요.` },
      { id: 'c2', t: '항상 성립하는 조건', b: T`모든 실수 $x$에 대하여
        - $ax^2+bx+c>0$ → $a>0$ 이고 $D<0$
        - $ax^2+bx+c<0$ → $a<0$ 이고 $D<0$

        해가 없는 경우: $D\le0$이면 $>0$ 이 항상 성립 등을 구분하세요.` },
    ],
    gens: [
      { id: 'solve', lv: [1, 4], card: 'c1', make: (R) => {
        const al = R.int(-5, 1), be = R.int(al + 1, al + 6); const gt = R.chance(0.5);
        const cor = gt ? `$x<${al}$ 또는 $x>${be}$` : `$${al}<x<${be}$`;
        return { q: `$${P([1, -(al + be), al * be])}${gt ? '>' : '<'}0$의 해는?`, correct: cor, wrong: [gt ? `$${al}<x<${be}$` : `$x<${al}$ 또는 $x>${be}$`, gt ? `$x<${-be}$ 또는 $x>${-al}$` : `$${-be}<x<${-al}$`, `$x>${be}$`], why: `$(x${pm(-al)})(x${pm(-be)})${gt ? '>' : '<'}0$ → 그래프(아래로 볼록)에서 ${gt ? '바깥쪽' : '두 근 사이'}` };
      } },
      { id: 'always', lv: [3, 5], card: 'c2', make: (R) => {
        const b = R.int(1, 4);
        return { q: `모든 실수 $x$에 대하여 $x^2+${2 * b}x+k>0$이 성립할 때 $k$의 범위는?`, correct: `$k>${b * b}$`, wrong: [`$k<${b * b}$`, `$k\\ge${b * b}$`, `$k>${2 * b}$`], why: `$a=1>0$이고 $\\dfrac D4=${b}^2-k<0$ → $k>${b * b}$` };
      } },
      { id: 'int', lv: [2, 5], card: 'c1', make: (R) => {
        const al = R.int(-4, 0), be = R.int(al + 3, al + 7);
        const cnt = be - al - 1;
        return { q: `부등식 $(x${pm(-al)})(x${pm(-be)})<0$을 만족하는 정수 $x$의 개수는?`, a: cnt, unit: '개', wrong: [cnt + 1, cnt - 1, be - al + 2].filter((v) => v !== cnt), why: `$${al}<x<${be}$ 이므로 정수는 $${al + 1},\\dots,${be - 1}$ → $${cnt}$개` };
      } },
    ],
  },
];

function fracTex(n, d) { const g = gcd(n, d) || 1; let a = n / g, b = d / g; if (b < 0) { a = -a; b = -b; } return b === 1 ? `${a}` : `\\dfrac{${a}}{${b}}`; }
