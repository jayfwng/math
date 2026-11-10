// 중1 ① 소인수분해 · 정수와 유리수 · 문자와 식
import { gcd, lcm, fr, fadd, fsub, fmul, fdiv, toFrac, fTex, linTex, polyTex, isPrime, factorize, factorTex, factorTexOf, divisors, tp, pm, paren, C2 } from '../js/lib.js';
import { numberLine } from '../js/fig.js';

const r = String.raw;
const T = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const sortNums = (a) => a.slice().sort((x, y) => x - y);

// 지수가 정해진 소인수분해 수 만들기
function randFactored(R, primes, expMax, lo, hi) {
  for (let t = 0; t < 200; t++) {
    const ps = R.sample(primes, R.int(2, Math.min(3, primes.length)));
    const pairs = ps.sort((a, b) => a - b).map((p) => [p, R.int(1, expMax)]);
    const n = pairs.reduce((a, [p, e]) => a * p ** e, 1);
    if (n >= lo && n <= hi) return { n, pairs };
  }
  return { n: 12, pairs: [[2, 2], [3, 1]] };
}

export default [
  // ───────────── 소인수분해 ─────────────
  {
    id: 'm1.prime',
    lesson: [
      { id: 'c1', t: '소수와 합성수', b: T`==소수==는 약수가 **1과 자기 자신, 딱 2개**뿐인 수예요.
        예) $2,\ 3,\ 5,\ 7,\ 11,\ 13$

        ==합성수==는 약수가 3개 이상인 수예요.
        예) $4$(약수 1, 2, 4), $9$, $15$

        **꼭 기억할 것**
        - $1$[은/는] 약수가 1개뿐이라 소수도 합성수도 아니에요.
        - $2$[은/는] 소수 중 유일한 짝수예요.

        **소수 확인법:** 2, 3, 5, 7로 차례로 나눠 보세요. 하나라도 나누어떨어지면 합성수예요.` },
      { id: 'c2', t: '거듭제곱', b: T`같은 수를 여러 번 곱한 것을 거듭제곱으로 나타내요.

        $$2\times2\times2=2^3$$

        $2$[을/를] ==밑==, $3$[을/를] ==지수==라고 해요. 지수는 **곱한 횟수**예요.

        ⚠️ $2^3=2\times3=6$이 아니에요! $2^3=2\times2\times2=8$이에요.

        $2^3\times3^2$처럼 밑이 달라도 각각 계산해서 곱해요. $8\times9=72$.` },
    ],
    gens: [
      { id: 'pick', lv: [1, 4], card: 'c1', make: (R, lv) => {
        const max = [0, 20, 40, 70, 100][lv];
        const pr = []; const comp = [];
        for (let n = 2; n <= max; n++) (isPrime(n) ? pr : comp).push(n);
        const hard = comp.filter((n) => n % 2 === 1 && n > 8);
        if (R.chance(0.5)) {
          const ans = R.pick(pr.filter((p) => p >= (lv >= 3 ? 11 : 2)));
          const wrong = R.sample(lv >= 3 ? hard : comp, 3);
          return { q: '다음 중 소수인 것은?', correct: String(ans), wrong: wrong.map(String), m: true, sortNum: true, why: T`$${ans}$의 약수는 1과 ${ans}뿐이에요. 나머지는 1, 자기 자신 말고도 약수가 있어요.` };
        }
        const ans = R.pick(lv >= 3 ? hard : comp);
        const wrong = R.sample(pr, 3);
        const d = divisors(ans).filter((x) => x !== 1 && x !== ans)[0];
        return { q: '다음 중 소수가 아닌 것은?', correct: String(ans), wrong: wrong.map(String), m: true, sortNum: true, why: `$${ans}$[은/는] $${d}$[으로/로] 나누어떨어지므로 약수가 1과 자기 자신 말고도 있어요. 그래서 합성수예요.` };
      } },
      { id: 'stmt', lv: [1, 3], card: 'c1', make: (R) => {
        const T1 = ['2는 소수 중 유일한 짝수이다.', '소수의 약수는 2개이다.', '1은 소수도 합성수도 아니다.', '합성수는 약수가 3개 이상이다.', '가장 작은 소수는 2이다.'];
        const F1 = ['1은 소수이다.', '모든 홀수는 소수이다.', '모든 소수는 홀수이다.', '합성수는 약수가 2개이다.', '가장 작은 소수는 1이다.', '소수의 약수는 3개 이상이다.', '9는 소수이다.', '두 소수의 합은 항상 소수이다.'];
        return { q: '다음 중 옳은 것은?', correct: R.pick(T1), wrong: R.sample(F1, 3), why: '소수는 약수가 1과 자기 자신 2개뿐인 수, 합성수는 약수가 3개 이상인 수예요. 1은 둘 다 아니고, 2는 유일한 짝수 소수예요.' };
      } },
      { id: 'pow', lv: [1, 5], card: 'c2', make: (R, lv) => {
        if (lv <= 2) {
          const b = R.int(2, lv === 1 ? 5 : 9), e = R.int(2, lv === 1 ? 3 : 4);
          const v = b ** e;
          return { q: `$${b}^{${e}}$의 값은?`, a: v, wrong: [b * e, b + e, b ** (e - 1)], why: `$${b}^{${e}}$[은/는] $${b}$[을/를] ${e}번 곱한 것이에요.\n$${Array(e).fill(b).join('\\times ')}=${v}$\n(${b}×${e}=${b * e}로 계산하면 안 돼요!)` };
        }
        const b1 = R.pick([2, 3]), e1 = R.int(2, 4), b2 = R.pick([5, 7]), e2 = R.int(1, 2);
        const v = b1 ** e1 * b2 ** e2;
        return { q: `$${b1}^{${e1}}\\times${b2}^{${e2}}$의 값은?`, a: v, wrong: [b1 ** e1 + b2 ** e2, b1 * e1 * b2 * e2, (b1 * b2) ** (e1 + e2)], why: `각각 먼저 계산해요. $${b1}^{${e1}}=${b1 ** e1}$, $${b2}^{${e2}}=${b2 ** e2}$\n$${b1 ** e1}\\times${b2 ** e2}=${v}$` };
      } },
      { id: 'write', lv: [2, 5], card: 'c2', make: (R, lv) => {
        const b1 = R.pick([2, 3, 5]); let b2 = R.pick([3, 5, 7]); while (b2 === b1) b2 = R.pick([3, 5, 7]);
        const e1 = R.int(2, 4), e2 = R.int(2, 3);
        const lhs = `${Array(e1).fill(b1).join('\\times ')}\\times ${Array(e2).fill(b2).join('\\times ')}`;
        const cor = `${b1}^{${e1}}\\times ${b2}^{${e2}}`;
        return { q: `$${lhs}$[을/를] 거듭제곱으로 나타내면?`, correct: cor, m: true,
          wrong: [`${b1}^{${e2}}\\times ${b2}^{${e1}}`, `${b1}^{${e1 + e2}}\\times ${b2}`, `(${b1}\\times ${b2})^{${e1 + e2}}`],
          why: `$${b1}$[을/를] ${e1}번 곱했으니 $${b1}^{${e1}}$, $${b2}$[을/를] ${e2}번 곱했으니 $${b2}^{${e2}}$[이에요/예요]. 밑이 다르면 하나로 합칠 수 없어요.` };
      } },
    ],
  },
  {
    id: 'm1.factor',
    lesson: [
      { id: 'c1', t: '소인수분해란?', b: T`자연수를 **소수의 곱**으로 나타내는 것을 ==소인수분해==라고 해요.

        $12$[을/를] 소인수분해해 볼게요. 작은 소수부터 나누어 가요.

        $$12\div2=6,\quad 6\div2=3,\quad 3\div3=1$$

        그래서 $12=2\times2\times3=2^2\times3$ 이에요.

        답은 보통 ==거듭제곱==으로, 작은 소수부터 써요.` },
      { id: 'c2', t: '소인수', b: T`소인수분해했을 때 나오는 **소수**들을 그 수의 ==소인수==라고 해요.

        $12=2^2\times3$ 이면 소인수는 $2$[과/와] $3$이에요. (지수 2는 소인수가 아니라 횟수예요.)

        ⚠️ $4$[은/는] 소인수가 아니에요. 4는 소수가 아니니까요.` },
      { id: 'c3', t: '제곱수 만들기', b: T`어떤 수의 제곱인 수(제곱수)는 소인수분해했을 때 **모든 지수가 짝수**예요.

        예) $36=2^2\times3^2$ → 지수가 모두 짝수 ✅

        $12=2^2\times3$ 에서 3의 지수만 홀수예요. 여기에 $3$[을/를] 곱하면 $2^2\times3^2=36$이 되어 제곱수가 돼요.

        **홀수 지수인 소인수들을 곱하면** 가장 작은 수가 나와요.` },
    ],
    gens: [
      { id: 'fz', lv: [1, 5], card: 'c1', make: (R, lv) => {
        const [lo, hi, em] = [null, [12, 36, 2], [30, 72, 3], [60, 150, 3], [150, 360, 4], [300, 900, 4]][lv];
        const { n, pairs } = randFactored(R, [2, 3, 5, 7], em, lo, hi);
        const cor = factorTexOf(pairs);
        const w = [];
        const alt = pairs.map((p) => p.slice());
        alt[0][1] += 1; w.push(factorTexOf(alt)); // 지수 변경
        const ps2 = pairs.map(([p, e]) => (e >= 2 ? `${p ** e}` : `${p}`)).join('\\times ');
        if (ps2 !== cor) w.push(ps2); // 거듭제곱 풀지 않고 합침(소수 아님)
        const q2 = pairs.map((p) => p.slice()); q2[q2.length - 1][0] = q2[q2.length - 1][0] === 7 ? 11 : q2[q2.length - 1][0] + (q2[q2.length - 1][0] === 2 ? 1 : 2);
        w.push(factorTexOf(q2));
        const q3 = pairs.map((p) => p.slice()); q3.push([13, 1]); w.push(factorTexOf(q3));
        return { q: `$${n}$[을/를] 소인수분해하면?`, correct: cor, wrong: w.filter((x) => x !== cor), m: true, why: `작은 소수부터 계속 나누면\n$${n}=${cor}$` };
      } },
      { id: 'pf', lv: [2, 4], card: 'c2', make: (R, lv) => {
        const { n, pairs } = randFactored(R, [2, 3, 5, 7, 11], 3, 20, lv * 80);
        const ps = pairs.map((p) => p[0]);
        const cor = ps.join(', ');
        const w = [
          ['1', ...ps].join(', '),
          pairs.map(([p, e]) => p ** e).join(', '),
          [...ps, ps.reduce((a, b) => a * b, 1)].join(', '),
          ps.length > 1 ? ps.slice(1).join(', ') : `${ps[0]}, ${ps[0] + 2}`,
        ];
        return { q: `$${n}$의 소인수를 모두 구하면?`, correct: cor, wrong: w.filter((x) => x !== cor), why: `$${n}=${factorTexOf(pairs)}$ 이므로 소인수는 지수가 아니라 ==소수들==인 $${cor}$[이에요/예요].` };
      } },
      { id: 'sq', lv: [3, 5], card: 'c3', make: (R, lv) => {
        for (let t = 0; t < 100; t++) {
          const { n, pairs } = randFactored(R, [2, 3, 5, 7], lv >= 4 ? 4 : 3, 12, 400);
          const odd = pairs.filter(([, e]) => e % 2 === 1);
          if (!odd.length) continue;
          const a = odd.reduce((x, [p]) => x * p, 1);
          if (a === 1) continue;
          const all = pairs.reduce((x, [p]) => x * p, 1);
          const wrongs = [all !== a ? all : a * 2, pairs[pairs.length - 1][0], a + 1];
          if (R.chance(0.5)) return { q: `$${n}$에 가장 작은 자연수 $a$[을/를] 곱하여 어떤 자연수의 제곱이 되게 하려고 해요. $a$의 값은?`, a, wrong: wrongs, why: `$${n}=${factorTexOf(pairs)}$ 에서 지수가 홀수인 소인수는 $${odd.map(([p]) => p).join(', ')}$[이에요/예요].\n홀수 지수인 소인수를 곱하면 모든 지수가 짝수가 되니 $a=${a}$` };
          return { q: `$${n}$[을/를] 자연수 $a$[으로/로] 나누어 어떤 자연수의 제곱이 되게 하려고 해요. 가장 작은 $a$의 값은?`, a, wrong: wrongs, why: `$${n}=${factorTexOf(pairs)}$ 에서 지수가 홀수인 소인수는 $${odd.map(([p]) => p).join(', ')}$[이에요/예요].\n이것들로 나누면 지수가 모두 짝수가 되니 $a=${a}$` };
        }
        return { q: '$12$에 가장 작은 자연수 $a$[을/를] 곱해 제곱수가 되게 하려면 $a$[은/는]?', a: 3, why: '$12=2^2\\times3$, 3의 지수가 홀수 → $a=3$' };
      } },
    ],
  },
  {
    id: 'm1.divisors',
    lesson: [
      { id: 'c1', t: '약수 모두 구하기', b: T`곱해서 그 수가 되는 **두 수를 짝지어** 찾으면 빠짐없이 구할 수 있어요.

        $12$의 약수: $1\times12,\ 2\times6,\ 3\times4$ → $1, 2, 3, 4, 6, 12$

        작은 수부터 차례로 나누어떨어지는지 확인하고, 짝이 겹치면 멈추면 돼요.` },
      { id: 'c2', t: '약수의 개수', b: T`$N=a^p\times b^q$ 로 소인수분해될 때, 약수의 개수는

        $$(p+1)\times(q+1)$$

        예) $12=2^2\times3^1$ → $(2+1)(1+1)=6$개 ($1,2,3,4,6,12$ ✅)

        **지수에 1을 더해서 곱하면** 돼요. 소인수가 3개여도 똑같이 곱해요.` },
      { id: 'c3', t: '약수인지 판단하기', b: T`$2^a\times3^b\times\cdots$ 의 약수는 각 소인수의 지수가 **원래 지수 이하**인 수예요.

        $2^2\times3$의 약수 중 $2^3$[은/는]? 2의 지수 3이 원래 지수 2보다 크니까 ❌ (약수 아님)
        $2\times3=6$[은/는]? 지수가 모두 이하 ✅` },
    ],
    gens: [
      { id: 'cnt', lv: [1, 2], card: 'c1', make: (R, lv) => {
        const n = R.int(6, lv === 1 ? 24 : 48);
        const d = divisors(n);
        return { q: `$${n}$의 약수의 개수는?`, a: d.length, why: `${n}의 약수: ${d.join(', ')}\n모두 ${d.length}개예요.` };
      } },
      { id: 'list', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const n = R.pick(lv === 1 ? [6, 8, 10, 12, 14, 15, 16, 18, 20, 21] : [24, 28, 30, 32, 36, 40, 42, 45, 48]);
        const d = divisors(n);
        const missing = d.filter((x) => x !== 1 && x !== n);
        const m1 = d.filter((x) => x !== R.pick(missing));
        const extra = [...d, R.pick([5, 7, 9, 11].filter((x) => !d.includes(x)))].sort((a, b) => a - b);
        const cor = d.join(', ');
        const w = [m1.join(', '), extra.join(', '), d.slice(0, -1).join(', ')];
        return { q: `$${n}$의 약수를 모두 나열한 것은?`, correct: cor, wrong: w.filter((x) => x !== cor), why: `곱해서 ${n}이 되는 두 수를 짝지어 보면 ${d.slice(0, Math.ceil(d.length / 2)).map((x) => `${x}×${n / x}`).join(', ')}\n→ ${cor}` };
      } },
      { id: 'formula', lv: [2, 5], card: 'c2', make: (R, lv) => {
        if (lv <= 3) {
          const { pairs } = randFactored(R, [2, 3, 5, 7], lv === 2 ? 3 : 4, 1, 1e9);
          const cnt = pairs.reduce((x, [, e]) => x * (e + 1), 1);
          return { q: `$${factorTexOf(pairs)}$의 약수의 개수는?`, a: cnt, wrong: [pairs.reduce((x, [, e]) => x * e, 1), pairs.reduce((x, [, e]) => x + e, 0), pairs.reduce((x, [, e]) => x + e + 1, 0)], why: `지수에 1을 더해서 곱해요.\n$${pairs.map(([, e]) => `(${e}+1)`).join('\\times')}=${cnt}$` };
        }
        const { n, pairs } = randFactored(R, [2, 3, 5, 7], 4, 60, lv === 4 ? 400 : 1500);
        const cnt = pairs.reduce((x, [, e]) => x * (e + 1), 1);
        return { q: `$${n}$의 약수의 개수는?`, a: cnt, why: `먼저 소인수분해: $${n}=${factorTexOf(pairs)}$\n약수의 개수: $${pairs.map(([, e]) => `(${e}+1)`).join('\\times')}=${cnt}$` };
      } },
      { id: 'notdiv', lv: [4, 5], card: 'c3', make: (R) => {
        const a = R.int(2, 3), b = R.int(1, 2), c = R.int(1, 2);
        const N = 2 ** a * 3 ** b * 5 ** c;
        const ds = divisors(N).filter((x) => x > 1 && x < N);
        const good = R.sample(ds, 3);
        const bads = [2 ** (a + 1), 3 ** (b + 1), 5 ** (c + 1), 7 * 2, 2 ** a * 3 ** b * 5 ** (c + 1)].filter((x) => N % x !== 0);
        const bad = R.pick(bads);
        return { q: `$2^{${a}}\\times3^{${b}}\\times5^{${c}}$의 약수가 아닌 것은?`, correct: String(bad), wrong: good.map(String), m: true, sortNum: true, why: `약수가 되려면 각 소인수의 지수가 원래 지수 이하여야 해요. $${bad}$[은/는] $${factorTex(bad)}$[이라서/라서] 조건에 맞지 않아요.` };
      } },
    ],
  },
  {
    id: 'm1.gcdlcm',
    lesson: [
      { id: 'c1', t: '최대공약수와 서로소', b: T`두 수의 ==공약수==는 두 수의 공통 약수예요. 그중 가장 큰 수가 ==최대공약수(GCD)==.

        $12$[과/와] $18$ → 공약수: $1,2,3,6$ → 최대공약수 $6$

        공약수가 1뿐인, 즉 **최대공약수가 1**인 두 수를 ==서로소==라고 해요. 예) $8$[과/와] $15$` },
      { id: 'c2', t: '최소공배수', b: T`두 수의 ==공배수==는 공통인 배수예요. 그중 가장 작은 수가 ==최소공배수(LCM)==.

        $12$[과/와] $18$ → 배수: 12, 24, **36**, … / 18, **36**, … → 최소공배수 $36$

        두 수의 곱 = 최대공약수 × 최소공배수 ($12\times18=6\times36$ ✅)` },
      { id: 'c3', t: '소인수분해로 구하기', b: T`$12=2^2\times3$, $18=2\times3^2$

        - ==최대공약수== = 공통인 소인수를 모아서, 지수가 **작은 쪽**
          $2^{1}\times3^{1}=6$
        - ==최소공배수== = 모든 소인수를 모아서, 지수가 **큰 쪽**
          $2^{2}\times3^{2}=36$` },
      { id: 'c4', t: '문제에서 알아보기', b: T`- 똑같은 크기로 **나누어/잘라서** 딱 맞게 → ==최대공약수==
        - **동시에 다시** 만나는(출발하는) 때, 같은 길이로 **쌓아서** 맞추기 → ==최소공배수==

        예) 가로 12cm, 세로 18cm 직사각형을 크기가 같은 정사각형으로 빈틈없이 → 한 변은 최대공약수 6cm` },
    ],
    gens: [
      { id: 'gcd', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const g = R.int(2, 3 + lv * 3);
        let p = R.int(2, 3 + lv * 2), q = R.int(2, 3 + lv * 2);
        while (gcd(p, q) !== 1 || p === q) { p = R.int(2, 3 + lv * 2); q = R.int(2, 3 + lv * 2); }
        const a = g * p, b = g * q;
        return { q: `$${a}$[과/와] $${b}$의 최대공약수는?`, a: g, wrong: [lcm(a, b), Math.min(a, b), Math.abs(a - b)], why: `$${a}=${factorTex(a)}$, $${b}=${factorTex(b)}$\n공통인 소인수의 지수가 작은 쪽을 곱하면 $${g}$` };
      } },
      { id: 'lcm', lv: [1, 3], card: 'c2', make: (R, lv) => {
        const g = R.int(1, 2 + lv);
        let p = R.int(2, 3 + lv * 2), q = R.int(2, 3 + lv * 2);
        while (gcd(p, q) !== 1 || p === q) { p = R.int(2, 3 + lv * 2); q = R.int(2, 3 + lv * 2); }
        const a = g * p, b = g * q, l = lcm(a, b);
        return { q: `$${a}$[과/와] $${b}$의 최소공배수는?`, a: l, wrong: [gcd(a, b), a * b, l * 2], why: `최대공약수가 ${g}이므로 최소공배수 = ${a}×${b}÷${g} = ${l}` };
      } },
      { id: 'form', lv: [3, 5], card: 'c3', make: (R, lv) => {
        const A = [R.int(1, 3), R.int(1, 3), R.int(1, 2)], B = [R.int(1, 3), R.int(1, 3), R.int(1, 2)];
        const base = [2, 3, 5];
        const tx = (e) => factorTexOf(e.map((x, i) => [base[i], x]));
        const gcdE = A.map((x, i) => Math.min(x, B[i])), lcmE = A.map((x, i) => Math.max(x, B[i]));
        const isG = R.chance(0.5);
        const ans = isG ? gcdE : lcmE;
        const cor = tx(ans);
        const w = new Set([tx(isG ? lcmE : gcdE)]);
        for (let t = 0; t < 60 && w.size < 3; t++) {
          const e = ans.map((x) => x);
          const i = R.int(0, 2); e[i] = Math.max(1, e[i] + R.pick([-1, 1, 2]));
          if (R.chance(0.4)) { const j = R.int(0, 2); e[j] = Math.max(1, e[j] + R.pick([-1, 1])); }
          const s2 = tx(e);
          if (s2 !== cor) w.add(s2);
        }
        w.delete(cor);
        return { q: `$${tx(A)}$[과/와] $${tx(B)}$의 ${isG ? '최대공약수' : '최소공배수'}는?`, correct: cor, wrong: [...w].slice(0, 3), m: true, why: isG ? '소인수마다 지수가 **작은 쪽**을 골라 곱해요.' : '소인수마다 지수가 **큰 쪽**을 골라 곱해요.' };
      } },
      { id: 'three', lv: [4, 5], card: 'c3', make: (R) => {
        const g = R.pick([4, 6, 8, 12]); const ps = R.sample([2, 3, 5, 7, 9, 10], 3);
        const nums = ps.map((p) => g * p);
        const gg = nums.reduce(gcd), ll = nums.reduce(lcm);
        return { q: `세 수 $${nums.join(', ')}$의 최대공약수는?`, a: gg, wrong: [ll, g * 2, Math.min(...nums)], why: `세 수를 모두 나누는 가장 큰 수를 찾아요. 소인수분해해서 공통인 소인수의 작은 지수를 곱하면 $${gg}$예요.` };
      } },
      { id: 'word', lv: [3, 5], card: 'c4', make: (R) => {
        const g = R.pick([3, 4, 5, 6, 8, 12]); let p = R.int(2, 7), q = R.int(2, 7); while (gcd(p, q) !== 1 || p === q) { p = R.int(2, 7); q = R.int(2, 7); }
        const a = g * p, b = g * q;
        if (R.chance(0.5)) return { q: `가로 ${a}cm, 세로 ${b}cm인 직사각형 모양의 종이를 크기가 같은 정사각형으로 남김없이 잘라요. 가장 큰 정사각형의 한 변의 길이는?`, a: g, unit: 'cm', wrong: [lcm(a, b), a - b, 1], why: '"가장 큰 크기로 똑같이 나눈다" → 최대공약수\n' + `$${a}$[과/와] $${b}$의 최대공약수는 $${g}$` };
        const l = lcm(a, b);
        return { q: `버스 두 대가 각각 ${a}분, ${b}분 간격으로 출발해요. 두 버스가 오전 9시에 동시에 출발했다면, 다음에 동시에 출발하는 것은 몇 분 후인가요?`, a: l, unit: '분', wrong: [g, a * b, a + b], why: '"다시 동시에" → 최소공배수\n' + `$${a}$[과/와] $${b}$의 최소공배수는 $${l}$` };
      } },
      { id: 'cop', lv: [2, 4], card: 'c1', make: (R) => {
        const pairs = [];
        while (pairs.length < 3) { const a = R.int(4, 30), b = R.int(4, 30); if (a !== b && gcd(a, b) > 1 && !pairs.some((p) => p[0] === a && p[1] === b)) pairs.push([a, b]); }
        let c; do { c = [R.int(4, 30), R.int(4, 30)]; } while (gcd(c[0], c[1]) !== 1 || c[0] === c[1]);
        return { q: '다음 중 두 수가 서로소인 것은?', correct: `(${c[0]}, ${c[1]})`, wrong: pairs.map(([a, b]) => `(${a}, ${b})`), m: true, why: `서로소는 최대공약수가 1인 두 수예요. $${c[0]}$[과/와] $${c[1]}$[은/는] 공통인 약수가 1뿐이에요. 나머지 쌍은 1이 아닌 공약수가 있어요.` };
      } },
    ],
  },

  // ───────────── 정수와 유리수 ─────────────
  {
    id: 'm1.signed',
    lesson: [
      { id: 'c1', t: '양수와 음수', b: T`0을 기준으로 **반대 성질**의 양을 부호로 나타내요.

        - 영상 5℃ → $+5$, 영하 3℃ → $-3$
        - 3000원 이익 → $+3000$, 2000원 손해 → $-2000$
        - 증가 / 해발 / 지상 → $+$ , 감소 / 해저 / 지하 → $-$

        ==양수==: 0보다 큰 수, ==음수==: 0보다 작은 수. 0은 양수도 음수도 아니에요.` },
      { id: 'c2', t: '수직선', b: T`수를 직선 위에 나타낸 것이 ==수직선==이에요. **오른쪽으로 갈수록 커지고**, 왼쪽으로 갈수록 작아져요.

        $-3$[은/는] 0에서 왼쪽으로 3칸, $+4$[은/는] 오른쪽으로 4칸.` },
      { id: 'c3', t: '절댓값', b: T`수직선에서 어떤 수가 **0에서 떨어진 거리**를 ==절댓값==이라 하고 $|\ \ |$[으로/로] 나타내요.

        $$|-3|=3,\quad |+5|=5,\quad |0|=0$$

        - 절댓값은 항상 **0 이상**이에요. (거리는 음수가 없어요)
        - 부호를 떼고 숫자만 읽으면 돼요.
        - 절댓값이 $a$인 수는 $+a$[과/와] $-a$ 두 개예요.` },
    ],
    gens: [
      { id: 'sign', lv: [1, 2], card: 'c1', make: (R) => {
        const bank = [['영상 {n}℃', 1], ['영하 {n}℃', -1], ['{n}원 이익', 1], ['{n}원 손해', -1], ['해발 {n}m', 1], ['해저 {n}m', -1], ['{n}kg 증가', 1], ['{n}kg 감소', -1], ['{n}점 득점', 1], ['{n}점 실점', -1], ['지상 {n}층', 1], ['지하 {n}층', -1], ['{n}분 늦음', -1], ['{n}분 일찍 도착', 1]];
        const [txt, s] = R.pick(bank); const n = R.int(1, 9) * R.pick([1, 5]);
        const f = (v) => `${v < 0 ? '-' : '+'}${Math.abs(v)}`;
        const cor = f(s * n);
        return { q: `다음을 부호(+, −)를 사용한 수로 나타내면?\n**${txt.replace('{n}', n)}**`, correct: cor, wrong: [f(-s * n), f(s * (n + 1)), f(-s * (n + 1))], m: true, why: '기준(0)보다 큰 쪽이면 +, 작은 쪽(반대되는 말)이면 −를 붙여요.' };
      } },
      { id: 'abs', lv: [1, 4], card: 'c3', make: (R, lv) => {
        const n = R.int(1, 9);
        if (lv === 1) { const v = R.pick([n, -n]); return { q: `$|${v < 0 ? '-' : '+'}${n}|$의 값은?`, a: n, wrong: [-n, 0, n + 1], why: `절댓값은 0에서의 거리이므로 부호를 떼면 $${n}$이에요.` }; }
        if (lv === 2) {
          const x = R.int(1, 9), y = R.int(1, 9), sx = R.pick([-1, 1]), sy = R.pick([-1, 1]);
          const op = R.pick(['+', '-']);
          const v = op === '+' ? x + y : x - y;
          return { q: `$|${sx * x}|${op}|${sy * y}|$의 값은?`, a: v, wrong: [sx * x + (op === '+' ? sy * y : -sy * y), -v, x * y], why: `각각 절댓값을 먼저 구해요. $|${sx * x}|=${x}$, $|${sy * y}|=${y}$ → $${x}${op}${y}=${v}$` };
        }
        if (lv === 3) { return { q: `절댓값이 $${n}$인 수를 모두 구하면?`, correct: `${n}, -${n}`, wrong: [`${n}`, `-${n}`, `0, ${n}`], m: true, why: `0에서 거리가 ${n}인 수는 오른쪽 $+${n}$[과/와] 왼쪽 $-${n}$ 두 개예요.` }; }
        const k = R.int(2, 6);
        return { q: `절댓값이 $${k}$ 이하인 정수는 모두 몇 개인가요?`, a: 2 * k + 1, wrong: [2 * k, k, 2 * k + 2], why: `$-${k}$부터 $${k}$까지의 정수예요. 0 포함해서 ${k}+${k}+1=${2 * k + 1}개!` };
      } },
      { id: 'line', lv: [2, 4], card: 'c2', make: (R, lv) => {
        const m = lv === 2 ? 5 : 7; const v = R.int(-m, m);
        return { q: '수직선 위의 점 A가 나타내는 수는?', a: v, fig: numberLine({ min: -m - 1, max: m + 1, marks: [{ v, label: 'A' }] }), why: `0에서 ${v >= 0 ? '오른쪽' : '왼쪽'}으로 ${Math.abs(v)}칸이므로 $${v}$이에요.` };
      } },
      { id: 'maxabs', lv: [3, 5], card: 'c3', make: (R, lv) => {
        let nums; do { nums = R.sample([-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9], 4); } while (new Set(nums.map(Math.abs)).size < 4);
        const big = R.chance(0.5);
        const best = nums.reduce((a, b) => ((big ? Math.abs(b) > Math.abs(a) : Math.abs(b) < Math.abs(a)) ? b : a));
        return { q: `다음 중 절댓값이 가장 ${big ? '큰' : '작은'} 수는?`, correct: String(best), wrong: nums.filter((x) => x !== best).map(String), m: true, why: `각 수의 절댓값은 ${nums.map((x) => `|${x}|=${Math.abs(x)}`).join(', ')} 이에요. 부호는 무시하고 숫자의 크기만 비교해요.` };
      } },
    ],
  },
  {
    id: 'm1.compare',
    lesson: [
      { id: 'c1', t: '수의 크기 비교', b: T`- ==양수 > 0 > 음수==
        - 양수끼리: 절댓값이 클수록 큼
        - ==음수끼리: 절댓값이 클수록 작아요!==

        $-5$[과/와] $-2$ 중에는? 수직선에서 $-5$가 더 왼쪽이므로 $-5<-2$.

        음수는 부호를 뗐을 때 큰 수가 오히려 더 작다고 기억하세요.` },
      { id: 'c2', t: '부등호 읽기', b: T`- $a>b$: a는 b보다 크다 (a 초과 b)
        - $a<b$: a는 b보다 작다
        - $x\ge a$: x는 a **이상** (a 포함)
        - $x\le a$: x는 a **이하** (a 포함)
        - $x>a$: x는 a **초과** (a 미포함), $x<a$: x는 a **미만**

        $-2\le x<5$ 는 "x는 −2 이상 5 미만"이에요.` },
      { id: 'c3', t: '분수·소수 비교', b: T`분수는 **통분**해서, 소수는 같은 자리까지 맞춰서 비교해요.

        $\frac{2}{3}$[과/와] $\frac{3}{4}$ → $\frac{8}{12}$[과/와] $\frac{9}{12}$ → $\frac{2}{3}<\frac{3}{4}$

        음수끼리는 반대로 비교해야 하므로 $-\frac{2}{3}>-\frac{3}{4}$ 가 돼요.` },
    ],
    gens: [
      { id: 'sym', lv: [1, 3], card: 'c1', make: (R, lv) => {
        let a, b, at, bt;
        if (lv < 3) { a = R.int(-9, 9); do { b = R.int(-9, 9); } while (b === a); at = `${a}`; bt = `${b}`; }
        else {
          const f1 = fr(R.int(-7, 7), R.int(2, 6)), f2 = fr(R.int(-7, 7), R.int(2, 6));
          if (f1.n * f2.d === f2.n * f1.d) return { q: '$-\\frac{1}{2}$[과/와] $-\\frac{1}{3}$ 중 큰 수는?', correct: '$-\\frac{1}{3}$', wrong: ['$-\\frac{1}{2}$', '같다'], why: '음수는 절댓값이 작을수록 커요.', max: 3 };
          a = f1.n / f1.d; b = f2.n / f2.d; at = fTex(f1); bt = fTex(f2);
        }
        const sign = a > b ? '>' : '<';
        return { q: `□ 안에 알맞은 부등호는?\n$${at}\\ \\square\\ ${bt}$`, correct: `$${sign}$`, all: ['$>$', '$<$', '$=$'], why: `수직선에서 오른쪽에 있는 수가 더 커요. ${a > b ? `$${at}$이 더 오른쪽에 있으니 $>$` : `$${bt}$이 더 오른쪽에 있으니 $<$`}` };
      } },
      { id: 'max', lv: [2, 4], card: 'c3', make: (R, lv) => {
        const vals = []; const used = new Set();
        while (vals.length < 4) {
          const f = lv === 2 ? fr(R.int(-9, 9), 1) : fr(R.int(-8, 8), R.pick([2, 3, 4, 5]));
          const k = `${f.n}/${f.d}`; if (!used.has(k)) { used.add(k); vals.push(f); }
        }
        const big = R.chance(0.5);
        const best = vals.reduce((x, y) => ((big ? y.n * x.d > x.n * y.d : y.n * x.d < x.n * y.d) ? y : x));
        return { q: `다음 중 가장 ${big ? '큰' : '작은'} 수는?`, correct: `$${fTex(best)}$`, wrong: vals.filter((v) => v !== best).map((v) => `$${fTex(v)}$`), why: `수직선에서 가장 ${big ? '오른쪽' : '왼쪽'}에 있는 수를 찾아요. 음수끼리는 절댓값이 클수록 작아요. 정답: $${fTex(best)}$` };
      } },
      { id: 'sort', lv: [2, 4], card: 'c1', make: (R, lv) => {
        const vals = R.sample(lv === 2 ? [-8, -5, -3, -1, 0, 2, 4, 6, 7] : [-9, -7, -6, -4, -2, 1, 3, 5, 8], 3);
        const asc = sortNums(vals), desc = asc.slice().reverse();
        const byAbs = vals.slice().sort((a, b) => Math.abs(a) - Math.abs(b));
        const f = (arr) => arr.map((x) => `${x}`).join(' < ');
        const cor = f(asc);
        const wr = [f(desc.map((x) => x)), f(byAbs), f([asc[1], asc[0], asc[2]])];
        return { q: `다음 세 수를 작은 것부터 차례로 나열하면?\n$${vals.join(',\\ ')}$`, correct: cor, wrong: [...new Set(wr)].filter((x) => x !== cor), m: true, why: '음수 < 0 < 양수이고, 음수끼리는 절댓값이 큰 수가 더 작아요.' };
      } },
      { id: 'ineq', lv: [3, 5], card: 'c2', make: (R, lv) => {
        if (lv === 3) {
          const a = R.int(-6, 1), b = R.int(a + 3, a + 8);
          const t = R.pick([['\\le ', '\\le ', '이상', '이하'], ['< ', '\\le ', '초과', '이하'], ['\\le ', '< ', '이상', '미만'], ['< ', '< ', '초과', '미만']]);
          const cor = `${a}${t[0]}x${t[1]}${b}`;
          return { q: `다음을 부등호로 나타내면?\n**x는 ${a} ${t[2]} ${b} ${t[3]}**`, correct: cor, wrong: [`${a}${t[0] === '< ' ? '\\le ' : '< '}x${t[1]}${b}`, `${a}${t[0]}x${t[1] === '< ' ? '\\le ' : '< '}${b}`, `${b}${t[0]}x${t[1]}${a}`], m: true, why: '이상·이하는 같다($\\le$)를 포함하고, 초과·미만은 포함하지 않아요($<$).' };
        }
        const lo = R.int(-5, 0), hi = R.int(2, 7);
        const incL = R.chance(0.5), incH = R.chance(0.5);
        let n = 0; for (let x = lo; x <= hi; x++) if ((incL ? x >= lo : x > lo) && (incH ? x <= hi : x < hi)) n++;
        return { q: `$${lo}${incL ? '\\le ' : '<'}x${incH ? '\\le ' : '<'}${hi}$[을/를] 만족하는 정수 $x$[은/는] 모두 몇 개인가요?`, a: n, why: `${lo}${incL ? '(포함)' : '(제외)'}부터 ${hi}${incH ? '(포함)' : '(제외)'}까지 정수를 세면 ${n}개예요.` };
      } },
    ],
  },
  {
    id: 'm1.addsub', anchor: true,
    lesson: [
      { id: 'c1', t: '덧셈', b: T`**① 부호가 같을 때:** 절댓값끼리 더하고 공통 부호를 붙여요.
        $(+3)+(+4)=+7$, $(-3)+(-4)=-7$

        **② 부호가 다를 때:** 절댓값이 큰 쪽의 부호를 따르고, 절댓값의 **차**를 구해요.
        $(+3)+(-5)$ → 5가 더 크고 부호는 −, 차는 2 → $-2$
        $(-3)+(+5)$ → 5가 더 크고 부호는 +, 차는 2 → $+2$

        수직선에서 "시작점에서 더하는 수만큼 이동"한다고 생각해도 돼요.` },
      { id: 'c2', t: '뺄셈', b: T`뺄셈은 ==빼는 수의 부호를 바꿔서 더하기==로 바꿔요.

        $$a-b=a+(-b)$$

        - $(+3)-(+5)=(+3)+(-5)=-2$
        - $(+3)-(-5)=(+3)+(+5)=+8$ ← **음수를 빼면 더하는 것!**
        - $(-3)-(-5)=(-3)+(+5)=+2$` },
      { id: 'c3', t: '여러 수의 계산', b: T`괄호를 풀 때 규칙:
        $+(+a)=+a$, $+(-a)=-a$, $-(+a)=-a$, $-(-a)=+a$

        $(-7)-(+3)+(-5)-(-9)$
        $=-7-3-5+9$
        양수끼리, 음수끼리 모으면 $9-(7+3+5)=9-15=-6$` },
      { id: 'c4', t: '분수·소수', b: T`분수는 **통분**한 뒤 계산해요.

        $-\frac{1}{2}+\frac{3}{4}=-\frac{2}{4}+\frac{3}{4}=\frac{1}{4}$

        부호 규칙은 정수와 완전히 같아요. 소수는 소수점 위치를 맞춰서 계산해요.` },
    ],
    gens: [
      { id: 'add', lv: [1, 2], card: 'c1', make: (R, lv) => {
        const m = lv === 1 ? 9 : 20;
        let a = R.nz(-m, m), b = R.nz(-m, m);
        const v = a + b;
        return { q: `$${tp(a)}+${tp(b)}$[을/를] 계산하면?`, a: v, wrong: [-v, a - b, Math.abs(a) + Math.abs(b)], why: a * b > 0 ? `부호가 같으니 절댓값을 더하고 공통 부호를 붙여요. $|${a}|+|${b}|=${Math.abs(a) + Math.abs(b)}$ → $${v}$` : `부호가 다르니 절댓값의 차를 구하고 절댓값이 큰 수의 부호를 따라요. $${v}$` };
      } },
      { id: 'sub', lv: [1, 3], card: 'c2', make: (R, lv) => {
        const m = lv === 1 ? 9 : 15;
        const a = R.nz(-m, m), b = R.nz(-m, m); const v = a - b;
        return { q: `$${tp(a)}-${tp(b)}$[을/를] 계산하면?`, a: v, wrong: [a + b, -v, b - a === v ? v + 2 : b - a], why: `뺄셈은 빼는 수의 부호를 바꿔 더해요.\n$${tp(a)}-${tp(b)}=${tp(a)}+${tp(-b)}=${v}$` };
      } },
      { id: 'multi', lv: [3, 5], card: 'c3', make: (R, lv) => {
        const n = lv === 5 ? 4 : 3;
        const t = Array.from({ length: n }, () => R.nz(-12, 12));
        const paren4 = lv >= 4;
        let q = '', v = 0;
        t.forEach((x, i) => {
          const sign = i === 0 ? 1 : R.pick([1, -1]);
          const val = x;
          if (paren4) q += (i === 0 ? tp(val) : `${sign > 0 ? '+' : '-'}${tp(val)}`);
          else q += (i === 0 ? `${val}` : `${sign > 0 ? '+' : '-'}${paren(val)}`);
          v += sign * val;
        });
        return { q: `$${q}$[을/를] 계산하면?`, a: v, wrong: [-v, v + 2, v - 2, v + 10], why: `괄호를 풀고 부호를 정리한 뒤 양수끼리, 음수끼리 모아서 계산해요. 결과는 $${v}$.` };
      } },
      { id: 'frac', lv: [3, 5], card: 'c4', make: (R, lv) => {
        const d1 = R.pick([2, 3, 4, 5, 6]), d2 = R.pick([2, 3, 4, 5, 6, 8, 9]);
        const a = fr(R.nz(-7, 7), d1), b = fr(R.nz(-7, 7), d2);
        const sub = R.chance(0.5);
        const v = sub ? fsub(a, b) : fadd(a, b);
        const bt = b.n < 0 ? `(${fTex(b)})` : fTex(b);
        return { q: `$${fTex(a)}${sub ? '-' : '+'}${bt}$[을/를] 계산하면?`, a: v, wrong: [sub ? fadd(a, b) : fsub(a, b), fr(a.n + b.n, a.d + b.d)], why: `분모의 최소공배수 ${lcm(a.d, b.d)}로 통분해서 계산하면 $${fTex(v)}$이에요.` };
      } },
    ],
  },
  {
    id: 'm1.muldiv',
    lesson: [
      { id: 'c1', t: '곱셈과 나눗셈의 부호', b: T`절댓값끼리 곱하고(나누고), 부호는 이렇게 정해요.

        - 부호가 **같으면 +**: $(+)\times(+)=+$, $(-)\times(-)=+$
        - 부호가 **다르면 −**: $(+)\times(-)=-$

        여러 수를 곱할 때는 ==음수의 개수==가 짝수면 +, 홀수면 −예요.

        $(-2)\times(-3)\times(-4)$ → 음수 3개(홀수) → $-24$` },
      { id: 'c2', t: '역수와 나눗셈', b: T`곱해서 1이 되는 두 수가 서로 ==역수==예요. $\frac{3}{4}$의 역수는 $\frac{4}{3}$, $-2$의 역수는 $-\frac{1}{2}$.

        ==나눗셈 = 역수를 곱하기==

        $$a\div b=a\times\frac{1}{b}$$

        예) $(-6)\div\frac{3}{2}=(-6)\times\frac{2}{3}=-4$` },
      { id: 'c3', t: '거듭제곱과 부호', b: T`음수의 거듭제곱은 **괄호가 있는지**가 핵심이에요.

        - $(-2)^2=(-2)\times(-2)=4$ (괄호 전체를 제곱)
        - $-2^2=-(2\times2)=-4$ (2만 제곱하고 마이너스를 붙임)
        - $(-2)^3=-8$ (음수를 홀수 번 곱하면 −)

        음수의 짝수 제곱은 +, 홀수 제곱은 −예요.` },
    ],
    gens: [
      { id: 'mul', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const m = lv === 1 ? 9 : 12;
        const b = R.nz(-m, m); const mulMode = R.chance(0.5);
        if (mulMode) { const a = R.nz(-m, m); return { q: `$${tp(a)}\\times${tp(b)}$의 값은?`, a: a * b, wrong: [-a * b, a + b, a - b], why: `부호가 ${a * b > 0 ? '같으니 +' : '다르니 −'}, 절댓값은 ${Math.abs(a)}×${Math.abs(b)}=${Math.abs(a * b)} → $${a * b}$` }; }
        const q = R.nz(-m, m); const a = b * q;
        return { q: `$${tp(a)}\\div${tp(b)}$의 값은?`, a: q, wrong: [-q, a - b, b * q === a ? q + 1 : 1], why: `부호가 ${q > 0 ? '같으니 +' : '다르니 −'}, 절댓값은 ${Math.abs(a)}÷${Math.abs(b)}=${Math.abs(q)} → $${q}$` };
      } },
      { id: 'three', lv: [2, 4], card: 'c1', make: (R, lv) => {
        const n = lv === 4 ? 4 : 3;
        const t = Array.from({ length: n }, () => R.nz(-5, 5));
        const v = t.reduce((a, b) => a * b, 1);
        const neg = t.filter((x) => x < 0).length;
        return { q: `$${t.map(tp).join('\\times')}$의 값은?`, a: v, wrong: [-v, v + 1, v * 2], why: `음수가 ${neg}개(${neg % 2 === 0 ? '짝수' : '홀수'})이므로 부호는 ${v >= 0 ? '+' : '−'}. 절댓값의 곱은 ${Math.abs(v)} → $${v}$` };
      } },
      { id: 'pow', lv: [2, 5], card: 'c3', make: (R, lv) => {
        const b = R.int(1, lv >= 4 ? 4 : 5); const e = R.int(2, lv >= 4 ? 5 : 4);
        const kinds = lv <= 3 ? [0, 1] : [0, 1, 2];
        const k = R.pick(kinds);
        if (k === 0) { const v = (-b) ** e; return { q: `$(-${b})^{${e}}$의 값은?`, a: v, wrong: [-v, -b * e, b ** e === v ? v + 1 : b ** e], why: `$-${b}$[을/를] ${e}번 곱해요. 음수를 ${e}번(${e % 2 ? '홀수' : '짝수'}) 곱하니 부호는 ${v > 0 ? '+' : '−'} → $${v}$` }; }
        if (k === 1) { const v = -(b ** e); return { q: `$-${b}^{${e}}$의 값은?`, a: v, wrong: [-v, (-b) ** e === v ? v - 1 : (-b) ** e, b * e], why: `$-${b}^{${e}}=-(${b}^{${e}})$ 이에요. ${b}만 ${e}번 곱하고 마이너스를 붙여요 → $${v}$` }; }
        const e1 = R.int(2, 4), e2 = R.int(2, 3);
        const v = (-1) ** e1 * (-2) ** e2;
        return { q: `$(-1)^{${e1}}\\times(-2)^{${e2}}$의 값은?`, a: v, wrong: [-v, 2 * e2, (-1) * 2 ** e2], why: `$(-1)^{${e1}}=${(-1) ** e1}$, $(-2)^{${e2}}=${(-2) ** e2}$ → 곱하면 $${v}$` };
      } },
      { id: 'frac', lv: [3, 5], card: 'c2', make: (R, lv) => {
        const a = fr(R.nz(-7, 7), R.int(2, 6)), b = fr(R.nz(-7, 7), R.int(2, 6));
        const div = R.chance(0.5);
        const v = div ? fdiv(a, b) : fmul(a, b);
        const bt = b.n < 0 ? `\\left(${fTex(b)}\\right)` : fTex(b);
        return { q: `$\\left(${fTex(a)}\\right)${div ? '\\div' : '\\times'}${bt}$의 값은?`, a: v, wrong: [div ? fmul(a, b) : fdiv(a, b), fr(-v.n, v.d)], why: div ? `나눗셈은 역수를 곱해요. $${fTex(a)}\\times${fTex(fr(b.d, b.n))}$ → 약분하면 $${fTex(v)}$` : `분자끼리, 분모끼리 곱하고 약분하면 $${fTex(v)}$이에요. (부호 먼저 정하기)` };
      } },
    ],
  },
  {
    id: 'm1.mixed',
    lesson: [
      { id: 'c1', t: '계산 순서', b: T`섞여 있는 식은 이 순서로 계산해요.

        ① ==거듭제곱==
        ② ==괄호== (소괄호 → 중괄호 → 대괄호)
        ③ ==곱셈·나눗셈== (왼쪽부터)
        ④ ==덧셈·뺄셈== (왼쪽부터)

        $-3+(-2)\times4$ 는? 곱셈 먼저: $-3+(-8)=-11$
        (왼쪽부터 $-3+(-2)=-5$, $-5\times4=-20$ 으로 하면 틀려요!)` },
      { id: 'c2', t: '분배법칙', b: T`$$a\times(b+c)=a\times b+a\times c$$

        계산이 편해지는 경우에 써요.
        $(-25)\times47+(-25)\times53=(-25)\times(47+53)=(-25)\times100=-2500$

        공통인 수를 묶어서 계산하면 빨라요.` },
    ],
    gens: [
      { id: 'order', lv: [1, 5], card: 'c1', make: (R, lv) => {
        if (lv === 1) {
          const a = R.nz(-9, 9), b = R.nz(-5, 5), c = R.nz(-5, 5);
          const v = a + b * c;
          return { q: `$${a}+${tp(b)}\\times${tp(c)}$의 값은?`, a: v, wrong: [(a + b) * c, a - b * c, -v], why: `곱셈을 먼저 계산해요. $${tp(b)}\\times${tp(c)}=${b * c}$ → $${a}+${paren(b * c)}=${v}$` };
        }
        if (lv === 2) {
          const d = R.nz(-4, 4), q = R.nz(-6, 6), a = R.nz(-9, 9), b = R.nz(-4, 4);
          const c = d * q; const v = a * b - c / d * 1;
          return { q: `$${paren(a)}\\times${paren(b)}-${paren(c)}\\div${paren(d)}$의 값은?`, a: v, wrong: [a * b - c / d === v ? v + 2 : a * b - c / d, (a * b - c) / d, -v], why: `곱셈·나눗셈을 먼저 계산해요. $${a * b}-(${c / d})=${v}$` };
        }
        if (lv === 3) {
          const a = R.nz(-6, 6), b = R.nz(-6, 6), c = R.nz(-4, 4), d = R.nz(-9, 9);
          const v = (a + b) * c - d;
          return { q: `$(${paren(a)}+${paren(b)})\\times${paren(c)}-${paren(d)}$의 값은?`, a: v, wrong: [a + b * c - d, (a + b) * (c - d), -v], why: `괄호 안 먼저: $${a + b}$, 곱하기: $${(a + b) * c}$, 마지막으로 빼기 → $${v}$` };
        }
        if (lv === 4) {
          const b = R.int(-3, 4), c = R.int(-3, 4); const t = (b - c) ** 2; if (t === 0) return { q: '$(-2)^2+3\\times(-1)$의 값은?', a: 1, why: '$4+(-3)=1$' };
          const a = R.nz(-5, 5); const P = a * t; const ds = divisors(Math.abs(P)).filter((x) => x > 1); const d = R.pick(ds.length ? ds : [1]) * R.pick([1, -1]);
          const v = P / d;
          return { q: `$${paren(a)}\\times(${b}-${paren(c)})^2\\div${paren(d)}$의 값은?`, a: v, wrong: [-v, v + 1, a * (b - c) ** 2], why: `괄호 안: $${b - c}$, 거듭제곱: $${t}$, 곱하기: $${P}$, 나누기: $${v}$` };
        }
        for (let tt = 0; tt < 100; tt++) {
          const b = R.nz(-6, 6), c = R.nz(-6, 6), d = R.nz(-4, 4), e = R.nz(-4, 4), a = R.nz(-9, 9);
          const inner = b + (c - d * e); if (inner === 0) continue;
          const ds = divisors(Math.abs(inner)).filter((x) => x > 1); if (!ds.length) continue;
          const f = R.pick(ds) * R.pick([1, -1]); const v = a - (inner / f);
          return { q: `$${a}-\\{${b}+(${c}-${paren(d)}\\times${paren(e)})\\}\\div${paren(f)}$의 값은?`, a: v, wrong: [-v, a - inner, v + 2], why: `안쪽 괄호부터: $${c}-(${d * e})=${c - d * e}$ → 중괄호: $${inner}$ → 나눗셈: $${inner / f}$ → $${a}-(${inner / f})=${v}$` };
        }
        return { q: '$2-\\{3+(1-2\\times2)\\}\\div(-3)$의 값은?', a: 2, why: '안쪽부터: $1-4=-3$, $3+(-3)=0$, $0\\div(-3)=0$ → $2-0=2$' };
      } },
      { id: 'dist', lv: [2, 4], card: 'c2', make: (R, lv) => {
        const k = R.nz(-9, 9); const x = R.int(11, 89);
        const base = lv === 2 ? 10 : 100;
        const y = base - x > 0 ? base - x : base + x;
        const useSum = base - x > 0;
        if (!useSum) return { q: '$(-4)\\times37+(-4)\\times63$의 값은?', a: -400, why: '$(-4)\\times(37+63)=(-4)\\times100=-400$' };
        return { q: `분배법칙을 이용해 계산하면?\n$${paren(k)}\\times${x}+${paren(k)}\\times${y}$`, a: k * base, wrong: [k * (x + y) + k, -k * base, k * x], why: `공통인 $${paren(k)}$[으로/로] 묶으면 $${paren(k)}\\times(${x}+${y})=${paren(k)}\\times${base}=${k * base}$` };
      } },
    ],
  },

  // ───────────── 문자와 식 ─────────────
  {
    id: 'm1.expr',
    lesson: [
      { id: 'c1', t: '문자로 식 세우기', b: T`값이 정해지지 않았거나 변하는 수를 $x,\ a$ 같은 ==문자==로 나타내서 식을 세워요.

        - 한 개에 $a$원인 사과 $x$개의 값 → $a\times x$원
        - 시속 $v$km로 $t$시간 간 거리 → $v\times t$ km
        - $x$의 3배보다 2 큰 수 → $3x+2$

        단위나 상황(거리=속력×시간, 값=단가×개수)을 먼저 떠올리면 쉬워요.` },
      { id: 'c2', t: '곱셈 기호 생략', b: T`- 수는 문자 **앞에**: $a\times3=3a$
        - $1\times a=a$, $(-1)\times a=-a$ ($1$[은/는] 생략)
        - 같은 문자의 곱은 거듭제곱: $a\times a=a^2$
        - 문자끼리는 보통 알파벳 순서: $b\times a=ab$
        - 괄호 있는 식은 그대로: $(a+b)\times2=2(a+b)$

        ⚠️ $0.1\times a=0.1a$ (0.1은 생략하지 않아요)` },
      { id: 'c3', t: '나눗셈 기호 생략', b: T`나눗셈은 ==분수==로 나타내요.

        $$a\div b=\frac{a}{b}\quad(b\ne0)$$

        $a\div3=\frac{a}{3}$, $a\div(b\times c)=\frac{a}{bc}$

        곱하기와 섞이면 역수를 곱한 것과 같아요. $a\times b\div c=\frac{ab}{c}$` },
    ],
    gens: [
      { id: 'word', lv: [1, 4], card: 'c1', make: (R, lv) => {
        const bank = [
          { q: '한 개에 $a$원인 사과 $x$개의 값(원)을 문자를 사용한 식으로 나타내면?', c: 'ax', w: ['a+x', '\\frac{a}{x}', 'a-x'], lv: 1 },
          { q: '시속 $v$km로 $t$시간 동안 달린 거리(km)는?', c: 'vt', w: ['v+t', '\\frac{v}{t}', '\\frac{t}{v}'], lv: 1 },
          { q: '한 변의 길이가 $a$cm인 정사각형의 둘레(cm)는?', c: '4a', w: ['a^2', 'a+4', '2a'], lv: 1 },
          { q: '$x$의 3배에 2를 더한 수는?', c: '3x+2', w: ['3(x+2)', 'x+6', '3x-2'], lv: 2 },
          { q: '$a$명 중에서 $b$명을 빼면 남은 사람 수는?', c: 'a-b', w: ['b-a', 'a+b', '\\frac{a}{b}'], lv: 1 },
          { q: '$x$km의 거리를 시속 $y$km로 갈 때 걸리는 시간(시간)은?', c: '\\frac{x}{y}', w: ['xy', '\\frac{y}{x}', 'x-y'], lv: 3 },
          { q: '정가 $x$원인 물건을 20% 할인해서 판 가격(원)은?', c: '0.8x', w: ['0.2x', 'x-20', '1.2x'], lv: 3 },
          { q: '$a$원짜리 공책 3권과 $b$원짜리 볼펜 2자루를 샀을 때 전체 금액(원)은?', c: '3a+2b', w: ['2a+3b', '5(a+b)', '3a-2b'], lv: 2 },
          { q: '농도 $a$%인 소금물 $b$g에 들어 있는 소금의 양(g)은?', c: '\\frac{a}{100}b', w: ['ab', '\\frac{b}{100}a+b', '100ab'], lv: 4 },
          { q: '현재 나이가 $x$살인 사람의 5년 후 나이의 2배는?', c: '2(x+5)', w: ['2x+5', 'x+10', '2x-5'], lv: 4 },
          { q: '십의 자리의 숫자가 $a$, 일의 자리의 숫자가 $b$인 두 자리 자연수는?', c: '10a+b', w: ['ab', 'a+b', '10b+a'], lv: 4 },
        ].filter((x) => x.lv <= lv && x.lv >= lv - 2);
        const it = R.pick(bank.length ? bank : [{ q: '한 변이 $a$cm인 정사각형의 둘레는?', c: '4a', w: ['a^2', 'a+4', '2a'] }]);
        return { q: it.q, correct: it.c, wrong: it.w, m: true, why: '문제의 말을 하나씩 식으로 바꿔 보세요. 곱하기·나누기·더하기가 어디에 필요한지 따져보면 돼요.' };
      } },
      { id: 'omit', lv: [1, 4], card: 'c2', make: (R, lv) => {
        const bank = [
          { q: '$a\\times(-1)\\times b$', c: '-ab', w: ['ab', '-a+b', '-1ab'], lv: 1 },
          { q: '$x\\times3\\times y$', c: '3xy', w: ['x3y', 'x+3+y', '3x+y'], lv: 1 },
          { q: '$a\\times a\\times b$', c: 'a^2b', w: ['2ab', 'ab^2', 'a+a+b'], lv: 2 },
          { q: '$2\\times x\\times x\\times y$', c: '2x^2y', w: ['2xy^2', '4xy', 'x^2y'], lv: 2 },
          { q: '$(a+b)\\times2$', c: '2(a+b)', w: ['2a+b', 'a+b2', '(2a+b)'], lv: 2 },
          { q: '$x\\div3$', c: '\\frac{x}{3}', w: ['3x', '\\frac{3}{x}', 'x^3'], lv: 2 },
          { q: '$a\\div(b\\times c)$', c: '\\frac{a}{bc}', w: ['\\frac{ab}{c}', '\\frac{ac}{b}', 'abc'], lv: 3 },
          { q: '$a\\times b\\div c$', c: '\\frac{ab}{c}', w: ['\\frac{a}{bc}', '\\frac{c}{ab}', 'abc'], lv: 3 },
          { q: '$(x+y)\\div5\\times2$', c: '\\frac{2(x+y)}{5}', w: ['\\frac{x+y}{10}', '\\frac{5(x+y)}{2}', '\\frac{2x+y}{5}'], lv: 4 },
          { q: '$a\\times0.1\\times b$', c: '0.1ab', w: ['ab', 'a0.1b', '0.ab'], lv: 3 },
        ].filter((x) => x.lv <= lv && x.lv >= lv - 2);
        const it = R.pick(bank);
        return { q: `곱셈·나눗셈 기호를 생략해서 나타내면?\n${it.q}`, correct: it.c, wrong: it.w, m: true, why: '수는 문자 앞에, 같은 문자의 곱은 거듭제곱으로, 나눗셈은 분수로 써요.' };
      } },
    ],
  },
  {
    id: 'm1.evalv',
    lesson: [
      { id: 'c1', t: '식의 값 구하기', b: T`식에 있는 문자에 수를 넣어(==대입==) 계산한 결과가 ==식의 값==이에요.

        $2x+1$에서 $x=3$이면 $2\times3+1=7$

        **음수를 대입할 때는 꼭 괄호!** 생략된 곱셈 기호를 살려서 계산해요.
        $3x$에서 $x=-2$ → $3\times(-2)=-6$` },
      { id: 'c2', t: '거듭제곱·분수 식', b: T`$x=-3$일 때

        - $x^2=(-3)^2=9$
        - $-x^2=-(-3)^2=-9$
        - $\frac{6}{x}=6\div(-3)=-2$

        식을 대입하고 나면 이제 ==혼합 계산==이에요. (거듭제곱 → 곱셈·나눗셈 → 덧셈·뺄셈)` },
    ],
    gens: [
      { id: 'lin', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const a = R.nz(-5, 6), b = R.nz(-9, 9), x = R.nz(lv === 1 ? 1 : -6, lv === 1 ? 5 : 6);
        const v = a * x + b;
        return { q: `$x=${x}$일 때, $${linTex(a, b)}$의 값은?`, a: v, wrong: [a * x - b, a + x + b, -a * x + b], why: `$${linTex(a, b)}$에 $x=${paren(x)}$[을/를] 대입해요.\n$${a}\\times${paren(x)}${b >= 0 ? '+' : ''}${b}=${v}$` };
      } },
      { id: 'sq', lv: [2, 4], card: 'c2', make: (R, lv) => {
        const x = R.nz(-5, -1);
        const kind = R.pick(lv === 2 ? [0, 1] : [0, 1, 2]);
        if (kind === 0) return { q: `$x=${x}$일 때, $x^2$의 값은?`, a: x * x, wrong: [-x * x, 2 * x, -2 * x], why: `$(${x})^2=${x * x}$ (음수를 짝수 번 곱하면 +)` };
        if (kind === 1) return { q: `$x=${x}$일 때, $-x^2$의 값은?`, a: -x * x, wrong: [x * x, 2 * x, -2 * x], why: `$-x^2=-(${x})^2=-${x * x}$` };
        const a = R.nz(-3, 3), b = R.nz(-5, 5);
        const v = a * x * x + b * x;
        return { q: `$x=${x}$일 때, $${a === 1 ? '' : a === -1 ? '-' : a}x^2${b > 0 ? '+' : ''}${b === 1 ? '' : b === -1 ? '-' : b}x$의 값은?`, a: v, wrong: [-v, a * x * x - b * x, a * x + b * x], why: `$x^2=${x * x}$, $x=${x}$ 대입: $${a}\\times${x * x}+(${b})\\times(${x})=${v}$` };
      } },
      { id: 'two', lv: [2, 5], card: 'c1', make: (R, lv) => {
        const a = R.nz(-9, 9), b = R.nz(-9, 9);
        const p = R.nz(-4, 4), q = R.nz(-4, 4);
        if (lv <= 3) return { q: `$a=${a}$, $b=${b}$일 때, $${p === 1 ? '' : p === -1 ? '-' : p}a${q > 0 ? '+' : ''}${q === 1 ? '' : q === -1 ? '-' : q}b$의 값은?`, a: p * a + q * b, wrong: [p * a - q * b, p + a + q + b], why: `대입하면 $${p}\\times${paren(a)}+${paren(q)}\\times${paren(b)}=${p * a + q * b}$` };
        const x = R.nz(-6, 6) * 2, y = R.nz(-6, 6) * 3;
        const v = fadd(fr(x, 2), fr(y, 3));
        return { q: `$x=${x}$, $y=${y}$일 때, $\\frac{x}{2}+\\frac{y}{3}$의 값은?`, a: v, wrong: [-v.n, fr(x + y, 5)], why: `$\\frac{${x}}{2}=${x / 2}$, $\\frac{${y}}{3}=${y / 3}$ → 합은 $${fTex(v)}$` };
      } },
      { id: 'inv', lv: [3, 5], card: 'c2', make: (R, lv) => {
        const x = R.pick([-6, -3, -2, 2, 3, 6]); const k = R.pick([6, 12, 18, -12, -6]);
        const v = fr(k, x);
        const add = R.nz(-5, 5);
        const tot = fadd(v, fr(add, 1));
        return { q: `$x=${x}$일 때, $\\frac{${k}}{x}${add > 0 ? '+' : ''}${add}$의 값은?`, a: tot, wrong: [fr(k, x) === tot ? 0 : v, fr(-tot.n, tot.d)], why: `$\\frac{${k}}{x}=${k}\\div${paren(x)}=${fTex(v)}$ 이고 여기에 $${add}$[을/를] 더하면 $${fTex(tot)}$` };
      } },
    ],
  },
  {
    id: 'm1.terms',
    lesson: [
      { id: 'c1', t: '항, 계수, 상수항', b: T`$3x^2-5x+2$ 에서

        - ==항==: $3x^2,\ -5x,\ +2$ (덧셈으로 이어진 각 부분)
        - ==계수==: 문자에 곱해진 수. $x$의 계수는 $-5$, $x^2$의 계수는 $3$
        - ==상수항==: 문자가 없는 항 $2$

        ⚠️ 부호까지 포함해서 계수를 말해요. $-5x$의 계수는 $-5$.
        $x$의 계수는 $1$, $-x$의 계수는 $-1$이에요.` },
      { id: 'c2', t: '차수, 다항식', b: T`- ==다항식==: 항이 여러 개 있는 식 (단항식: 항이 1개)
        - ==차수==: 한 항에서 곱해진 문자의 개수. 다항식의 차수는 항 중 가장 큰 차수

        $3x^2-5x+2$ 의 차수는 $2$ (이차식)
        $xy$[은/는] $x\times y$[으로/로] 문자가 2개 곱해졌으니 차수 $2$` },
      { id: 'c3', t: '일차식', b: T`==일차식== = 차수가 **1**인 다항식. ($ax+b$, $a\ne0$)

        - $2x-5$ ✅ 일차식
        - $x^2+1$ ❌ (이차)
        - $\frac{x}{3}+1$ ✅ (분모에 문자가 없으니 일차)
        - $\frac{2}{x}+1$ ❌ (분모에 문자가 있으면 다항식이 아니에요)
        - $5$ ❌ (상수는 차수가 0)` },
    ],
    gens: [
      { id: 'coef', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const a = R.nz(-9, 9), b = R.nz(-9, 9), c = R.nz(-9, 9);
        const tx = polyTex([a, b, c]);
        const k = R.pick(['x', 'x2', 'c', 'n', 'deg']);
        if (k === 'x') return { q: `다항식 $${tx}$에서 $x$의 계수는?`, a: b, wrong: [a, c, -b], why: `$x$가 한 번 곱해진 항의 계수는 부호를 포함해서 $${b}$` };
        if (k === 'x2') return { q: `다항식 $${tx}$에서 $x^2$의 계수는?`, a: a, wrong: [b, c, -a], why: `$x^2$이 붙은 항 $${a}x^2$의 계수는 $${a}$` };
        if (k === 'c') return { q: `다항식 $${tx}$의 상수항은?`, a: c, wrong: [b, a, -c], why: `문자가 없는 항이 상수항이에요. $${c}$` };
        if (k === 'n') return { q: `다항식 $${tx}$의 항의 개수는?`, a: 3, wrong: [2, 4, 1], why: '덧셈으로 이어진 세 부분이 각각 항이에요.' };
        return { q: `다항식 $${tx}$의 차수는?`, a: 2, wrong: [1, 3, 5], why: '문자의 곱해진 개수가 가장 큰 항 $x^2$이 있으므로 차수는 2예요.' };
      } },
      { id: 'linear', lv: [2, 4], card: 'c3', make: (R) => {
        const lin = ['3x-5', '-x+\\frac{1}{2}', '\\frac{x}{4}', '0.5x-2', '-2x', 'x-y', '\\frac{x+1}{3}', '7-x'];
        const non = ['x^2-3x', '\\frac{2}{x}+1', '7', 'xy+1', 'x^2', 'x^3-x', '-3', '\\frac{5}{x}', 'x^2+x-2'];
        const askLin = R.chance(0.65);
        if (askLin) return { q: '다음 중 일차식인 것은?', correct: R.pick(lin), wrong: R.sample(non, 3), m: true, why: '일차식은 차수가 1인 다항식이에요. 분모에 문자가 있거나, 문자가 두 번 이상 곱해졌거나, 상수뿐이면 일차식이 아니에요.' };
        return { q: '다음 중 일차식이 아닌 것은?', correct: R.pick(non), wrong: R.sample(lin, 3), m: true, why: '일차식은 차수가 1인 다항식이에요. 분모에 문자가 있거나, 문자가 두 번 이상 곱해졌거나, 상수뿐이면 일차식이 아니에요.' };
      } },
      { id: 'fraccoef', lv: [3, 5], card: 'c1', make: (R) => {
        let d, n; do { d = R.pick([2, 3, 4, 5]); n = R.nz(-4, 4); } while (gcd(Math.abs(n), d) !== 1);
        const b = R.nz(-6, 6), c = R.nz(-6, 6);
        const kind = R.pick(['x2', 'x']);
        const tx = `\\frac{${n === 1 ? '' : n === -1 ? '-' : n}x^2}{${d}}${b > 0 ? '+' : ''}${b === 1 ? '' : b === -1 ? '-' : b}x${c > 0 ? '+' : ''}${c}`;
        if (kind === 'x2') return { q: `다항식 $${tx}$에서 $x^2$의 계수는?`, a: fr(n, d), wrong: [n, fr(1, d), b], why: `$\\frac{${n}x^2}{${d}}=\\frac{${n}}{${d}}x^2$ 이므로 계수는 $${fTex(fr(n, d))}$` };
        return { q: `다항식 $${tx}$에서 $x$의 계수와 상수항의 합은?`, a: b + c, wrong: [b * c, b - c, n + b + c], why: `$x$의 계수 $${b}$, 상수항 $${c}$ → 합은 $${b + c}$` };
      } },
    ],
  },
  {
    id: 'm1.linop', anchor: true,
    lesson: [
      { id: 'c1', t: '동류항', b: T`문자와 차수가 **같은 항**을 ==동류항==이라고 해요.

        - $3x$[과/와] $-5x$ → 동류항 ✅
        - $3x$[과/와] $3y$ → 문자가 달라서 ❌
        - $3x$[과/와] $3x^2$ → 차수가 달라서 ❌
        - 상수항끼리($2$[과/와] $-7$)도 동류항이에요.

        동류항끼리는 **계수끼리** 더하고 뺄 수 있어요. $3x+5x=8x$` },
      { id: 'c2', t: '일차식의 덧셈·뺄셈', b: T`동류항끼리 모아서 계산해요.

        $(3x+2)+(2x-5)=3x+2x+2-5=5x-3$

        ==괄호 앞이 −이면 괄호 안 모든 항의 부호가 바뀌어요.==

        $(3x+2)-(2x-5)=3x+2-2x+5=x+7$

        ($-5$의 부호를 바꾸는 걸 가장 많이 틀려요!)` },
      { id: 'c3', t: '분수 꼴 일차식', b: T`분모가 다르면 **통분**해서 계산해요.

        $\frac{x+1}{2}+\frac{2x-1}{3}=\frac{3(x+1)+2(2x-1)}{6}=\frac{3x+3+4x-2}{6}=\frac{7x+1}{6}$

        뺄셈일 때는 분자에 괄호를 쳐서 부호가 바뀌는 걸 놓치지 마세요.` },
    ],
    gens: [
      { id: 'like', lv: [1, 3], card: 'c1', make: (R) => {
        const v = R.pick(['x', 'y', 'a', 'b']); const o = R.sample(['x', 'y', 'a', 'b'].filter((q) => q !== v), 2);
        const k = R.nz(-6, 6);
        const co = (n, s) => `${n === 1 ? '' : n === -1 ? '-' : n}${s}`;
        return { q: `다음 중 $${co(k, v)}$[과/와] 동류항인 것은?`, correct: co(R.nz(-9, 9), v), wrong: [co(R.nz(-9, 9), o[0]), `${co(R.nz(-9, 9), v)}^2`, `${R.int(1, 9)}`], m: true, why: '동류항은 문자와 차수가 같은 항이에요. 계수는 달라도 돼요.' };
      } },
      { id: 'add', lv: [1, 3], card: 'c2', make: (R, lv) => {
        const m = lv === 1 ? 5 : 9;
        const a = R.nz(-m, m), b = R.nz(-m, m), c = R.nz(-m, m), d = R.nz(-m, m);
        const cor = linTex(a + c, b + d);
        const w = [linTex(a + c, b - d), linTex(a - c, b + d), linTex(a + c, 0) + (b + d !== 0 ? '' : '')];
        return { q: `$(${linTex(a, b)})+(${linTex(c, d)})$[을/를] 간단히 하면?`, correct: cor, wrong: w.filter((x) => x !== cor), m: true, why: `$x$의 계수끼리: $${a}+${paren(c)}=${a + c}$, 상수항끼리: $${b}+${paren(d)}=${b + d}$ → $${cor}$` };
      } },
      { id: 'sub', lv: [2, 4], card: 'c2', make: (R, lv) => {
        const m = lv === 2 ? 6 : 9;
        const a = R.nz(-m, m), b = R.nz(-m, m), c = R.nz(-m, m), d = R.nz(-m, m);
        const cor = linTex(a - c, b - d);
        const w = [linTex(a - c, b + d), linTex(a + c, b - d), linTex(a + c, b + d)];
        return { q: `$(${linTex(a, b)})-(${linTex(c, d)})$[을/를] 간단히 하면?`, correct: cor, wrong: [...new Set(w)].filter((x) => x !== cor), m: true, why: `괄호 앞이 −이므로 괄호 안 부호가 바뀌어요. $${linTex(a, b)}${-c < 0 || (c === 0 && -d < 0) ? '' : '+'}${linTex(-c, -d)}$ → $${cor}$` };
      } },
      { id: 'three', lv: [3, 5], card: 'c2', make: (R, lv) => {
        const g = () => R.nz(-6, 6);
        const [a, b, c, d, e, f] = [g(), g(), g(), g(), g(), g()];
        const cor = linTex(-a + c - e, -b + d - f);
        const w = [linTex(a + c + e, b + d + f), linTex(-a + c - e, b + d - f), linTex(a + c - e, -b + d + f)];
        return { q: `$-(${linTex(a, b)})+(${linTex(c, d)})-(${linTex(e, f)})$[을/를] 간단히 하면?`, correct: cor, wrong: [...new Set(w)].filter((x) => x !== cor), m: true, why: `괄호 앞이 −인 식은 부호를 모두 바꿔서 풀고 동류항끼리 모아요. $x$의 계수: $${-a}+${paren(c)}+${paren(-e)}=${-a + c - e}$, 상수항: $${-b}+${paren(d)}+${paren(-f)}=${-b + d - f}$` };
      } },
      { id: 'frac', lv: [4, 5], card: 'c3', make: (R) => {
        for (let t = 0; t < 200; t++) {
          const [m, n] = R.sample([2, 3, 4, 5], 2); if (gcd(m, n) !== 1) continue;
          const a = R.nz(-5, 5), b = R.nz(-5, 5), c = R.nz(-5, 5), d = R.nz(-5, 5);
          const sub = R.chance(0.5); const L = m * n;
          const p = n * a + (sub ? -1 : 1) * m * c, q = n * b + (sub ? -1 : 1) * m * d;
          if (p === 0 || gcd(gcd(Math.abs(p), Math.abs(q)), L) !== 1 || q === 0) continue;
          const cor = `\\frac{${linTex(p, q)}}{${L}}`;
          const wp = n * a + (sub ? 1 : -1) * m * c, wq = n * b + (sub ? 1 : -1) * m * d;
          const w = [`\\frac{${linTex(wp, q)}}{${L}}`, `\\frac{${linTex(p, wq)}}{${L}}`, `\\frac{${linTex(a + c, b + d)}}{${m + n}}`];
          return { q: `$\\frac{${linTex(a, b)}}{${m}}${sub ? '-' : '+'}\\frac{${linTex(c, d)}}{${n}}$[을/를] 간단히 하면?`, correct: cor, wrong: [...new Set(w)].filter((x) => x !== cor), m: true, why: `분모 ${m}, ${n}의 최소공배수 ${L}로 통분해요. 분자: $${n}(${linTex(a, b)})${sub ? '-' : '+'}${m}(${linTex(c, d)})=${linTex(p, q)}$` };
        }
        return { q: '$\\frac{x+1}{2}+\\frac{2x-1}{3}$[을/를] 간단히 하면?', correct: '\\frac{7x+1}{6}', wrong: ['\\frac{3x}{5}', '\\frac{7x-1}{6}', '\\frac{x+7}{6}'], m: true, why: '통분 후 분자: $3(x+1)+2(2x-1)=7x+1$' };
      } },
    ],
  },
  {
    id: 'm1.linmul',
    lesson: [
      { id: 'c1', t: '수 × 일차식', b: T`분배법칙으로 **괄호 안 모든 항**에 곱해요.

        $$k(ax+b)=kax+kb$$

        $3(2x-5)=6x-15$ (상수항에도 곱하는 것 잊지 마세요!)
        $-2(x-4)=-2x+8$ (음수를 곱하면 부호가 바뀌어요)` },
      { id: 'c2', t: '일차식 ÷ 수', b: T`나눗셈은 **역수를 곱하기**로 바꿔요.

        $(6x+9)\div3=(6x+9)\times\frac{1}{3}=2x+3$

        $(-12x+8)\div(-4)=(-12x+8)\times\left(-\frac{1}{4}\right)=3x-2$

        각 항을 나누는 수로 나눈다고 생각하면 편해요.` },
      { id: 'c3', t: '분수 꼴과 섞인 계산', b: T`$\frac{2x-1}{3}\times6=2(2x-1)=4x-2$ 처럼 약분이 되는 경우가 많아요.

        여러 괄호가 섞이면 ① 분배법칙으로 괄호 풀기 → ② 동류항 정리 순서로 해요.

        $2(x+3)-3(x-1)=2x+6-3x+3=-x+9$` },
    ],
    gens: [
      { id: 'mul', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const k = R.nz(lv === 1 ? 2 : -6, lv === 1 ? 6 : 6), a = R.nz(-5, 5), b = R.nz(-6, 6);
        const cor = linTex(k * a, k * b);
        const w = [linTex(k * a, b), linTex(k * a, -k * b), linTex(a + k, b + k)];
        return { q: `$${k < 0 ? `(${k})` : k}(${linTex(a, b)})$[을/를] 간단히 하면?`, correct: cor, wrong: [...new Set(w)].filter((x) => x !== cor), m: true, why: `분배법칙: $${paren(k)}\\times ${linTex(a, 0)}${b >= 0 ? '+' : ''}${paren(k)}\\times ${paren(b)}$ → $${cor}$` };
      } },
      { id: 'div', lv: [2, 4], card: 'c2', make: (R) => {
        const k = R.nz(-6, 6); if (Math.abs(k) < 2) return { q: '$(6x+9)\\div3$[을/를] 간단히 하면?', correct: '2x+3', wrong: ['2x+9', '2x+27', '18x+27'], m: true, why: '각 항을 3으로 나눠요.' };
        const a = R.nz(-6, 6) * k, b = R.nz(-6, 6) * k;
        const cor = linTex(a / k, b / k);
        const w = [linTex(a / k, b), linTex(a / k, -b / k), linTex(a * k, b * k)];
        return { q: `$(${linTex(a, b)})\\div${paren(k)}$[을/를] 간단히 하면?`, correct: cor, wrong: [...new Set(w)].filter((x) => x !== cor), m: true, why: `각 항을 $${paren(k)}$[으로/로] 나누면 $${cor}$` };
      } },
      { id: 'combo', lv: [3, 5], card: 'c3', make: (R, lv) => {
        const k1 = R.nz(-5, 5), k2 = R.nz(-5, 5), a1 = R.nz(-4, 4), b1 = R.nz(-5, 5), a2 = R.nz(-4, 4), b2 = R.nz(-5, 5);
        const cor = linTex(k1 * a1 - k2 * a2, k1 * b1 - k2 * b2);
        const w = [linTex(k1 * a1 - k2 * a2, k1 * b1 + k2 * b2), linTex(k1 * a1 + k2 * a2, k1 * b1 + k2 * b2), linTex(k1 * a1 - k2 * a2, k1 * b1 - b2)];
        return { q: `$${paren(k1)}(${linTex(a1, b1)})-${paren(k2)}(${linTex(a2, b2)})$[을/를] 간단히 하면?`, correct: cor, wrong: [...new Set(w)].filter((x) => x !== cor), m: true, why: `각 괄호를 풀면 $${linTex(k1 * a1, k1 * b1)}${-k2 * a2 >= 0 ? '+' : ''}${linTex(-k2 * a2, -k2 * b2)}$ → 동류항 정리하면 $${cor}$` };
      } },
      { id: 'frac', lv: [4, 5], card: 'c3', make: (R) => {
        const m = R.pick([2, 3, 4, 5]), q = R.int(1, 3), n = m * q;
        const a = R.nz(-5, 5), b = R.nz(-5, 5);
        const cor = linTex(a * q, b * q);
        return { q: `$\\frac{${linTex(a, b)}}{${m}}\\times${n}$[을/를] 간단히 하면?`, correct: cor, wrong: [...new Set([linTex(a * q, b), linTex(a * n, b * n), linTex(a, b * q)])].filter((x) => x !== cor), m: true, why: `$${n}$[을/를] 분모 $${m}$[과/와] 약분하면 $${q}$[이/가] 남아요. $${q}(${linTex(a, b)})=${cor}$` };
      } },
    ],
  },
];
