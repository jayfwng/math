// 중1 ② 일차방정식 · 좌표평면과 그래프
import { gcd, lcm, linTex, paren, pm } from '../js/lib.js';
import { coordPlane } from '../js/fig.js';

const T = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const uniqN = (arr, not) => [...new Set(arr.map(String))].filter((x) => x !== String(not));

// 방정식 ax+b=cx+d 를 정수해 x 로 만든다 (a≠c)
function eqParts(R, lvl) {
  const x = R.nz(-9, 9);
  let a, b, c, d;
  if (lvl === 1) { a = 1; c = 0; b = R.nz(-9, 9); d = x + b; }
  else if (lvl === 2) { a = R.nz(-6, 6); if (Math.abs(a) === 1) a = 2; c = 0; b = R.nz(-9, 9); d = a * x + b; }
  else {
    do { a = R.nz(-7, 7); c = R.nz(-7, 7); } while (a === c);
    b = R.nz(-9, 9); d = a * x + b - c * x;
  }
  return { x, a, b, c, d };
}
const side = (a, b) => linTex(a, b);

export default [
  // ───────────── 일차방정식 ─────────────
  {
    id: 'm1.eqprop',
    lesson: [
      { id: 'c1', t: '등식과 방정식', b: T`==등식==은 $=$[으로/로] 연결한 식이에요. 예) $3+4=7$, $x+2=5$

        ==방정식==은 $x$ 같은 **미지수**가 들어 있고, $x$의 값에 따라 참이 되기도 거짓이 되기도 하는 등식이에요.

        방정식을 **참으로 만드는 값**을 ==해(근)==이라 하고, 해를 구하는 것을 "방정식을 푼다"고 해요.

        예) $x+2=5$의 해는 $x=3$ (넣어 보면 $3+2=5$ ✅)` },
      { id: 'c2', t: '등식의 성질', b: T`저울이 균형을 이루고 있을 때, **양쪽에 똑같이** 하면 균형은 그대로예요.

        - 양변에 같은 수를 더해도 등식은 성립: $a=b\Rightarrow a+c=b+c$
        - 양변에서 같은 수를 빼도 성립
        - 양변에 같은 수를 곱해도 성립
        - 양변을 **0이 아닌** 같은 수로 나눠도 성립

        예) $x-5=3$ → 양변에 $5$를 더하면 $x=8$` },
    ],
    gens: [
      { id: 'iseq', lv: [1, 2], card: 'c1', make: (R) => {
        const a = R.int(2, 6), b = R.int(1, 9), c = R.int(10, 30);
        return { q: '다음 중 방정식인 것은?', correct: `$${a}x+${b}=${c}$`, wrong: [`$${a}x+${b}$`, `$${a}+${b}=${a + b}$`, `$${a}x+${b}>${c}$`], why: T`방정식은 **미지수가 있는 등식**이에요.
          - $${a}x+${b}$는 등호가 없어서 식일 뿐이에요.
          - $${a}+${b}=${a + b}$는 미지수가 없어요.
          - $>$는 등호가 아니라 부등호예요.` };
      } },
      { id: 'root', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const k = R.nz(-6, 6); const a = R.int(2, 5); const b = R.nz(-8, 8);
        const c = a * k + b;
        const mk = (kk) => `$x=${kk}$`;
        const ws = uniqN([k + 1, k - 1, -k, k + 2, k - 2].filter((v) => a * v + b !== c), k).slice(0, 3);
        return { q: `방정식 $${side(a, b)}=${c}$의 해는?`, correct: mk(k), wrong: ws.map(mk), why: `$x=${k}$[을/를] 대입하면 $${a}\\times${paren(k)}${pm(b)}=${c}$ ✅\n다른 값은 좌변이 $${c}$[이/가] 되지 않아요.` };
      } },
      { id: 'prop', lv: [2, 4], card: 'c2', make: (R, lv) => {
        if (R.chance(0.5)) {
          const x = R.nz(-8, 8), a = R.int(2, 6), b = R.nz(-9, 9);
          return { q: `$${side(a, b)}=${a * x + b}$의 양변에서 $${paren(b)}$[을/를] 빼면 $${a}x=\\square$일 때 $\\square$에 알맞은 수는?`.replace('$\\square$에', '$\\square$에'), a: a * x, wrong: [a * x + b, a * x + 2 * b, a * x - b], why: `$${a}x+${paren(b)}$에서 $${paren(b)}$[을/를] 빼면 $${a}x$만 남아요.\n우변도 똑같이: $${a * x + b}-${paren(b)}=${a * x}$` };
        }
        const x = R.nz(-8, 8), a = R.int(2, 7);
        return { q: `$\\dfrac{x}{${a}}=${x === 0 ? 1 : x}$의 양변에 $${a}$[을/를] 곱하면 $x=\\square$일 때 $\\square$는?`, a: a * (x === 0 ? 1 : x), wrong: [(x === 0 ? 1 : x) + a, (x === 0 ? 1 : x), a], why: '양변에 같은 수를 곱해도 등식은 성립해요.' };
      } },
    ],
  },
  {
    id: 'm1.solve', anchor: true,
    lesson: [
      { id: 'c1', t: '이항', b: T`등식의 한 변에 있는 항을 **부호를 바꿔서** 다른 변으로 옮기는 것을 ==이항==이라고 해요.

        $x+3=7$ → $x=7-3$ → $x=4$
        $x-5=2$ → $x=2+5$ → $x=7$

        ➕는 ➖로, ➖는 ➕로! 부호만 바꿔서 건너가요.` },
      { id: 'c2', t: '일차방정식 풀이 순서', b: T`$ax+b=0$ 꼴(정리하면 $x$의 최고차수가 1)을 ==일차방정식==이라고 해요.

        **풀이 순서**
        1. $x$가 있는 항은 **왼쪽**, 숫자는 **오른쪽**으로 이항
        2. 동류항끼리 정리 ($ax=b$ 꼴)
        3. 양변을 $x$의 계수 $a$로 나누기

        예) $3x+2=x+8$
        $3x-x=8-2$ → $2x=6$ → $x=3$` },
      { id: 'c3', t: '검산하기', b: T`풀고 나서 **원래 식에 넣어** 보면 틀렸는지 바로 알 수 있어요.

        $3x+2=x+8$에 $x=3$ 대입
        왼쪽: $3\times3+2=11$, 오른쪽: $3+8=11$ ✅

        계수가 음수일 땐 부호 실수가 많아요. 꼭 검산해 보세요.` },
    ],
    gens: [
      { id: 'one', lv: [1, 2], card: 'c1', make: (R) => {
        const { x, b, d } = eqParts(R, 1);
        return { q: `$x${pm(b)}=${d}$[을/를] 풀면 $x=$?`, a: x, why: `$${b >= 0 ? '+' : '-'}${Math.abs(b)}$[을/를] 이항하면 부호가 바뀌어요.\n$x=${d}${pm(-b)}=${x}$` };
      } },
      { id: 'mul', lv: [1, 3], card: 'c2', make: (R) => {
        const { x, a, b, d } = eqParts(R, 2);
        return { q: `$${side(a, b)}=${d}$[을/를] 풀면 $x=$?`, a: x, wrong: [x + 1, -x, x - 1], why: `$${a}x=${d}${pm(-b)}=${d - b}$\n양변을 $${a}$[으로/로] 나누면 $x=${x}$` };
      } },
      { id: 'two', lv: [3, 5], card: 'c2', make: (R, lv) => {
        const { x, a, b, c, d } = eqParts(R, 3);
        const L = side(a, b), Rr = side(c, d);
        return { q: `$${L}=${Rr}$[을/를] 풀면 $x=$?`, a: x, why: T`$x$항은 왼쪽, 숫자는 오른쪽으로 이항해요.
          $${linTex(a, 0)}${c >= 0 ? '-' : '+'}${Math.abs(c) === 1 ? '' : Math.abs(c)}x=${d}${pm(-b)}$
          $${linTex(a - c, 0)}=${d - b}$ → $x=${x}$
          검산: 왼쪽 $${a * x + b}$ = 오른쪽 $${c * x + d}$ ✅` };
      } },
    ],
  },
  {
    id: 'm1.solve2',
    lesson: [
      { id: 'c1', t: '괄호가 있는 방정식', b: T`분배법칙으로 **괄호부터 풀어요**.

        $2(x-3)=10$ → $2x-6=10$ → $2x=16$ → $x=8$

        ⚠️ 괄호 앞이 −면 안의 **모든 항**의 부호가 바뀌어요.
        $-(x-3)=-x+3$` },
      { id: 'c2', t: '계수가 분수인 방정식', b: T`양변에 **분모의 최소공배수**를 곱해 분수를 없애요.

        $\frac{x}{2}+\frac{x}{3}=5$ → 양변에 $6$을 곱하면
        $3x+2x=30$ → $5x=30$ → $x=6$

        ⚠️ 분수가 없는 항(=5)에도 6을 곱해야 해요!` },
      { id: 'c3', t: '계수가 소수인 방정식', b: T`양변에 $10,\ 100,\ \cdots$을 곱해 정수로 바꿔요.

        $0.2x+0.3=0.5x-0.6$ → 양변에 $10$ 곱하기
        $2x+3=5x-6$ → $-3x=-9$ → $x=3$` },
    ],
    gens: [
      { id: 'paren', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const x = R.nz(-8, 8), a = R.int(2, 5), b = R.nz(-6, 6);
        if (lv >= 3 && R.chance(0.6)) {
          const c = R.int(2, 4), dd = R.nz(-6, 6);
          let ee;
          // a(x+b) = c(x+dd) + e  (a≠c)
          const aa = a === c ? a + 1 : a;
          ee = aa * (x + b) - c * (x + dd);
          return { q: `$${aa}(x${pm(b)})=${c}(x${pm(dd)})${ee === 0 ? '' : pm(ee)}$[을/를] 풀면 $x=$?`, a: x, why: `괄호를 풀면 $${linTex(aa, aa * b)}=${linTex(c, c * dd + ee)}$\n$${linTex(aa - c, 0)}=${c * dd + ee - aa * b}$ → $x=${x}$` };
        }
        const d = a * (x + b);
        return { q: `$${a}(x${pm(b)})=${d}$[을/를] 풀면 $x=$?`, a: x, why: `괄호를 풀면 $${a}x${pm(a * b)}=${d}$\n$${a}x=${d - a * b}$ → $x=${x}$` };
      } },
      { id: 'frac', lv: [2, 5], card: 'c2', make: (R, lv) => {
        const dens = R.pick([[2, 3], [2, 4], [3, 4], [2, 5], [3, 6], [4, 6]]);
        const [p, q] = dens; const m = lcm(p, q);
        const x = m * R.int(1, 3) * (R.chance(0.3) ? -1 : 1);
        const s = R.pick([1, 1, -1]);
        const rhs = x / p + s * (x / q);
        return { q: `$\\dfrac{x}{${p}}${s === 1 ? '+' : '-'}\\dfrac{x}{${q}}=${rhs}$[을/를] 풀면 $x=$?`, a: x, why: T`양변에 분모 ${p}, ${q}의 최소공배수 $${m}$을 곱해요.
          $${m / p === 1 ? '' : m / p}x${s === 1 ? '+' : '-'}${m / q === 1 ? '' : m / q}x=${rhs * m}$
          $${linTex(m / p + s * (m / q), 0)}=${rhs * m}$ → $x=${x}$` };
      } },
      { id: 'dec', lv: [3, 5], card: 'c3', make: (R) => {
        const x = R.nz(-8, 8); const a = R.int(1, 5), c = R.int(1, 5) + 5, b = R.nz(-9, 9);
        const d = a * x + b - c * x;
        const f = (n) => (n / 10).toFixed(1).replace(/\.0$/, '');
        const lhs = `${f(a)}x${b >= 0 ? '+' : '-'}${f(Math.abs(b))}`;
        const rhs = `${f(c)}x${d >= 0 ? '+' : '-'}${f(Math.abs(d))}`;
        return { q: `$${lhs}=${rhs}$[을/를] 풀면 $x=$?`, a: x, why: `양변에 $10$[을/를] 곱하면 $${linTex(a, b)}=${linTex(c, d)}$\n$${linTex(a - c, 0)}=${d - b}$ → $x=${x}$` };
      } },
    ],
  },
  {
    id: 'm1.eqword',
    lesson: [
      { id: 'c1', t: '활용 문제 풀이 4단계', b: T`1. **구하려는 것을 $x$로** 놓기
        2. **같은 양**을 두 가지로 표현해서 식 세우기
        3. 방정식 풀기
        4. 답이 문제에 맞는지 **확인**하기 (사람 수는 자연수, 길이는 양수 등)

        가장 중요한 건 2번! "~와 같다", "~이다"가 등호예요.` },
      { id: 'c2', t: '자주 나오는 유형', b: T`**나이/수**: 지금 $x$살이면 $a$년 후는 $x+a$살.
        **연속하는 세 정수**: $x-1,\ x,\ x+1$
        **거리·속력·시간**: $(\text{거리})=(\text{속력})\times(\text{시간})$
        **농도**: $(\text{소금의 양})=\dfrac{\text{농도}}{100}\times(\text{소금물의 양})$
        **과부족**: 사람 수는 그대로, 물건 수를 두 가지로 표현해서 같다고 놓기` },
    ],
    gens: [
      { id: 'age', lv: [1, 3], card: 'c1', make: (R) => {
        const yrs = R.int(1, 6), x2 = R.int(6, 15);
        const dad = 2 * (x2 + yrs) - yrs;
        return { q: `아버지는 ${dad}세, 아들은 ${x2}세예요. 몇 년 후에 아버지의 나이가 아들의 나이의 2배가 될까요?`, a: yrs, unit: '년 후', wrong: [yrs + 1, yrs + 2, dad - 2 * x2 + 1], why: T`$x$년 후라고 하면
          $${dad}+x=2(${x2}+x)$
          $${dad}+x=${2 * x2}+2x$ → $x=${dad - 2 * x2}$` };
      } },
      { id: 'consec', lv: [2, 4], card: 'c2', make: (R) => {
        const m = R.int(5, 40);
        const sum = 3 * m;
        return { q: `연속하는 세 정수의 합이 ${sum}일 때, 가장 큰 수는?`, a: m + 1, wrong: [m, m - 1, sum / 3 + 2], why: T`가운데 수를 $x$라 하면 세 수는 $x-1,\ x,\ x+1$
          $(x-1)+x+(x+1)=${sum}$ → $3x=${sum}$ → $x=${m}$
          가장 큰 수는 $${m + 1}$` };
      } },
      { id: 'dist', lv: [3, 5], card: 'c2', make: (R) => {
        const v1 = R.pick([3, 4, 5, 6]), v2 = R.pick([2, 3, 4]) + 6 + 0;
        const t = R.int(2, 6); // 시간
        const dist = (v1 + v2) * t; // 마주 보고 걸어 만남
        // 두 사람이 서로 반대 방향으로 가서 만나는 상황: 거리 = (v1+v2) t, 시간(분) 단위를 피하려 km/h
        return { q: `${dist}km 떨어진 두 지점에서 A는 시속 ${v1}km, B는 시속 ${v2}km로 서로를 향해 동시에 출발했어요. 몇 시간 후에 만날까요?`, a: t, unit: '시간', wrong: [t + 1, t - 1 || 8, Math.round(dist / v1)], why: T`$x$시간 후에 만난다고 하면
          (A가 간 거리)+(B가 간 거리)=(전체 거리)
          $${v1}x+${v2}x=${dist}$ → $${v1 + v2}x=${dist}$ → $x=${t}$` };
      } },
      { id: 'short', lv: [3, 5], card: 'c1', make: (R) => {
        const n = R.int(5, 15), a = R.int(2, 5), b = a + R.int(2, 4);
        const extra = R.int(1, (b - a) * n - 1), lack = (b - a) * n - extra;
        return { q: `학생들에게 사탕을 ${a}개씩 나누어 주면 ${extra}개가 남고, ${b}개씩 나누어 주면 ${lack}개가 부족해요. 학생은 몇 명일까요?`, a: n, unit: '명', wrong: [n + 1, n - 1, a * n + extra], why: T`학생 수를 $x$라 하면 사탕의 수는 두 가지로 표현돼요.
          $${a}x+${extra}=${b}x-${lack}$
          $${a - b}x=${-lack - extra}$ → $x=${n}$` };
      } },
    ],
  },

  // ───────────── 좌표평면과 그래프 ─────────────
  {
    id: 'm1.coord',
    lesson: [
      { id: 'c1', t: '순서쌍과 좌표', b: T`수직선 두 개를 직각으로 겹친 것이 ==좌표평면==이에요. 가로축이 $x$축, 세로축이 $y$축, 만나는 점이 원점 $O$예요.

        점의 위치는 **(x좌표, y좌표)** 순서로 적어요. 이것이 ==순서쌍==이에요.
        $(3,\ 2)$는 오른쪽으로 3, 위로 2.
        ⚠️ $(3,2)$와 $(2,3)$은 **다른 점**이에요!` },
      { id: 'c2', t: '사분면', b: T`좌표평면은 축에 의해 4개로 나뉘어요. 오른쪽 위부터 **반시계 방향**으로 제1, 2, 3, 4사분면.

        | 사분면 | $x$ | $y$ |
        | 제1 | + | + |
        | 제2 | − | + |
        | 제3 | − | − |
        | 제4 | + | − |

        축 위의 점은 **어느 사분면에도 속하지 않아요**.` },
      { id: 'c3', t: '대칭인 점', b: T`점 $(a,\ b)$에 대하여
        - $x$축 대칭: $y$좌표의 부호만 바뀜 → $(a,\ -b)$
        - $y$축 대칭: $x$좌표의 부호만 바뀜 → $(-a,\ b)$
        - 원점 대칭: 둘 다 바뀜 → $(-a,\ -b)$

        "축의 이름과 **같은 좌표는 그대로**, 다른 좌표가 바뀐다"고 기억하면 쉬워요. ($x$축 대칭이면 $x$는 그대로)` },
    ],
    gens: [
      { id: 'read', lv: [1, 2], card: 'c1', make: (R) => {
        const x = R.nz(-4, 4), y = R.nz(-4, 4);
        const wr = uniqN([`${y},${x}`, `${-x},${y}`, `${x},${-y}`, `${-x},${-y}`], `${x},${y}`).slice(0, 3);
        const fm = (s) => { const [p, q] = s.split(','); return `$(${p},\\ ${q})$`; };
        return { q: '좌표평면 위의 점 P의 좌표는?', fig: coordPlane({ xmin: -5, xmax: 5, ymin: -5, ymax: 5, pts: [{ x, y, label: 'P' }] }), correct: fm(`${x},${y}`), wrong: wr.map(fm), why: `원점에서 $x$축 방향으로 $${x}$, $y$축 방향으로 $${y}$만큼 이동한 점이에요. $(${x},\\ ${y})$` };
      } },
      { id: 'quad', lv: [1, 3], card: 'c2', make: (R, lv) => {
        const x = R.nz(-9, 9), y = R.nz(-9, 9);
        const qd = x > 0 && y > 0 ? 1 : x < 0 && y > 0 ? 2 : x < 0 && y < 0 ? 3 : 4;
        if (lv >= 3 && R.chance(0.6)) {
          // a>0, b<0 일 때 (a, -b) 는 몇 사분면?
          const sa = R.pick([1, -1]), sb = R.pick([1, -1]);
          const X = R.pick([[1, '$a$'], [-1, '$-a$'], [1, '$ab$']]);
          const sgnA = sa, sgnB = sb;
          const exprs = [['a', sgnA], ['b', sgnB], ['-a', -sgnA], ['-b', -sgnB], ['ab', sgnA * sgnB]];
          const [e1, e2] = R.sample(exprs.filter((e) => e[0] !== 'ab'), 2);
          const qq = (s1, s2) => (s1 > 0 && s2 > 0 ? 1 : s1 < 0 && s2 > 0 ? 2 : s1 < 0 && s2 < 0 ? 3 : 4);
          const ans = qq(e1[1], e2[1]);
          return { q: `$a${sgnA > 0 ? '>' : '<'}0,\\ b${sgnB > 0 ? '>' : '<'}0$일 때, 점 $(${e1[0]},\\ ${e2[0]})$는 제 몇 사분면 위의 점일까요?`, correct: `제${ans}사분면`, wrong: [1, 2, 3, 4].filter((v) => v !== ans).map((v) => `제${v}사분면`), why: `$${e1[0]}$의 부호는 ${e1[1] > 0 ? '+' : '−'}, $${e2[0]}$의 부호는 ${e2[1] > 0 ? '+' : '−'}\n$x$좌표 ${e1[1] > 0 ? '+' : '−'}, $y$좌표 ${e2[1] > 0 ? '+' : '−'}[이므로/므로] 제${ans}사분면이에요.` };
        }
        return { q: `점 $(${x},\\ ${y})$[은/는] 제 몇 사분면 위의 점일까요?`, correct: `제${qd}사분면`, wrong: [1, 2, 3, 4].filter((v) => v !== qd).map((v) => `제${v}사분면`), why: `$x$좌표가 ${x > 0 ? '양수' : '음수'}, $y$좌표가 ${y > 0 ? '양수' : '음수'}[이므로/므로] 제${qd}사분면이에요.` };
      } },
      { id: 'sym', lv: [2, 4], card: 'c3', make: (R) => {
        const a = R.nz(-9, 9), b = R.nz(-9, 9);
        const kind = R.pick([['$x$축', [a, -b]], ['$y$축', [-a, b]], ['원점', [-a, -b]]]);
        const fm = (p) => `$(${p[0]},\\ ${p[1]})$`;
        const all = [[a, -b], [-a, b], [-a, -b], [b, a]];
        const ws = all.filter((p) => String(p) !== String(kind[1])).slice(0, 3);
        return { q: `점 $(${a},\\ ${b})$[을/를] ${kind[0]}에 대하여 대칭이동한 점의 좌표는?`, correct: fm(kind[1]), wrong: ws.map(fm), why: `${kind[0]} 대칭이동은 ${kind[0] === '원점' ? '$x$, $y$좌표의 부호가 모두' : kind[0] === '$x$축' ? '$y$좌표의 부호만' : '$x$좌표의 부호만'} 바뀌어요.\n$(${kind[1][0]},\\ ${kind[1][1]})$` };
      } },
      { id: 'area', lv: [3, 5], card: 'c1', make: (R) => {
        const x1 = R.nz(-5, 5), y1 = R.nz(-5, 5);
        let w = R.int(2, 6), h = R.int(2, 6); if ((w * h) % 2) h += 1;
        const x2 = x1 + w * (R.chance(0.5) ? 1 : -1), y2 = y1 + h * (R.chance(0.5) ? 1 : -1);
        const pts = [{ x: x1, y: y1, label: 'A' }, { x: x2, y: y1, label: 'B' }, { x: x2, y: y2, label: 'C' }];
        return { q: `세 점 $A(${x1},\\ ${y1})$, $B(${x2},\\ ${y1})$, $C(${x2},\\ ${y2})$를 꼭짓점으로 하는 삼각형의 넓이는? (단위 길이는 1)`, a: (w * h) / 2, why: `A와 B는 $y$좌표가 같아서 밑변 $=|${x2}-${paren(x1)}|=${w}$\nB와 C는 $x$좌표가 같아서 높이 $=|${y2}-${paren(y1)}|=${h}$\n넓이 $=\\frac12\\times${w}\\times${h}=${(w * h) / 2}$` };
      } },
    ],
  },
  {
    id: 'm1.direct',
    lesson: [
      { id: 'c1', t: '정비례란?', b: T`$x$가 2배, 3배가 되면 $y$도 2배, 3배가 되는 관계를 ==정비례==라 해요.

        식: $y=ax$ ($a\neq0$)

        $\dfrac{y}{x}=a$로 **항상 일정**해요. ($a$는 비례상수)

        예) 1개에 500원인 사탕 $x$개의 값 $y=500x$` },
      { id: 'c2', t: '정비례 그래프', b: T`$y=ax$의 그래프는 **원점을 지나는 직선**이에요.

        - $a>0$: 오른쪽 위로 향하고 제1·3사분면을 지나요.
        - $a<0$: 오른쪽 아래로 향하고 제2·4사분면을 지나요.
        - $|a|$가 클수록 $y$축에 **가까워져요**(더 가팔라요).` },
      { id: 'c3', t: '식 구하기', b: T`한 점이 주어지면 $y=ax$에 대입해 $a$를 구해요.

        "$x=3$일 때 $y=12$" → $12=a\times3$ → $a=4$ → $y=4x$

        그래프가 점 $(2,\ -6)$을 지나면 $-6=2a$, $a=-3$` },
    ],
    gens: [
      { id: 'find', lv: [1, 3], card: 'c3', make: (R, lv) => {
        const a = R.nz(-8, 8), x = R.nz(-6, 6);
        if (Math.abs(a) === 1) return { q: '$y$가 $x$에 정비례하고 $x=2$일 때 $y=6$이에요. $x=5$일 때 $y$의 값은?', a: 15, why: '$6=a\\times2$ → $a=3$, $y=3x$이므로 $x=5$일 때 $y=15$' };
        if (lv === 1) return { q: `$y$[가/이] $x$에 정비례하고 $x=${x}$일 때 $y=${a * x}$이에요. 비례상수 $a$는?`, a, wrong: [a * x, -a, x], why: `$y=ax$에 대입: $${a * x}=a\\times${paren(x)}$ → $a=${a}$` };
        const t = R.nz(-9, 9);
        return { q: `$y$[가/이] $x$에 정비례하고 $x=${x}$일 때 $y=${a * x}$이에요. $x=${t}$일 때 $y$의 값은?`, a: a * t, why: `$${a * x}=a\\times${paren(x)}$ → $a=${a}$, $y=${a}x$\n$x=${t}$이면 $y=${a * t}$` };
      } },
      { id: 'which', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.int(2, 9);
        const x = R.int(2, 6);
        return { q: '다음 중 $y$[가/이] $x$에 정비례하는 것은?', correct: `$y=${a}x$`, wrong: [`$y=\\dfrac{${a}}{x}$`, `$y=x+${a}$`, `$y=${a}-x$`], why: '정비례는 $y=ax$ 꼴이에요. $\\dfrac{y}{x}$가 항상 일정한 값이어야 해요.' };
      } },
      { id: 'graph', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.nz(-4, 4);
        const fig = coordPlane({ xmin: -4, xmax: 4, ymin: -6, ymax: 6, lines: [{ a, b: 0 }], pts: [{ x: 1, y: a, label: '' }].filter(() => Math.abs(a) <= 6) });
        const kind = R.pick(['a', 'b']);
        if (kind === 'a') return { q: '그래프가 나타내는 식 $y=ax$에서 비례상수 $a$는?', fig, a, why: `점 $(1,\\ ${a})$를 지나요. $y=ax$에 $x=1$을 넣으면 $y=a$[이므로/므로] $a=${a}$` };
        return { q: '그래프의 직선이 지나는 사분면은?', fig, correct: a > 0 ? '제1, 3사분면' : '제2, 4사분면', wrong: [a > 0 ? '제2, 4사분면' : '제1, 3사분면', '제1, 2사분면', '제3, 4사분면'], why: `$a${a > 0 ? '>' : '<'}0$이면 ${a > 0 ? '오른쪽 위로 향해 제1, 3사분면' : '오른쪽 아래로 향해 제2, 4사분면'}을 지나요.` };
      } },
      { id: 'app', lv: [3, 5], card: 'c3', make: (R) => {
        const per = R.int(2, 9) * 50; const n = R.int(3, 9);
        if (R.chance(0.5)) return { q: `물을 1분에 ${R.pick([3, 4, 6])}L씩 받는 수도꼭지가 있어요. 받은 물의 양을 $y$L, 걸린 시간을 $x$분이라 하면 $y=ax$예요. 이 수도꼭지로 10분 동안 받은 물의 양은 몇 L인가요?`.replace(/1분에 \d+L/, `1분에 ${per / 50}L`), a: (per / 50) * 10, unit: 'L', why: `$y=${per / 50}x$에 $x=10$[을/를] 대입하면 $y=${(per / 50) * 10}$` };
        return { q: `볼펜 한 자루에 ${per}원이에요. ${n}자루의 값은 얼마일까요?`, a: per * n, unit: '원', why: `$y=${per}x$에 $x=${n}$[을/를] 대입하면 $y=${per * n}$` };
      } },
    ],
  },
  {
    id: 'm1.inverse',
    lesson: [
      { id: 'c1', t: '반비례란?', b: T`$x$가 2배, 3배가 되면 $y$는 $\frac12$배, $\frac13$배가 되는 관계를 ==반비례==라 해요.

        식: $y=\dfrac{a}{x}$ ($a\neq0$)

        $xy=a$로 **항상 일정**해요.

        예) 12km를 시속 $x$km로 가면 걸리는 시간 $y=\dfrac{12}{x}$` },
      { id: 'c2', t: '반비례 그래프', b: T`$y=\dfrac{a}{x}$의 그래프는 **원점에 대칭인 한 쌍의 곡선**(쌍곡선)이에요. 축과는 만나지 않아요.

        - $a>0$: 제1·3사분면
        - $a<0$: 제2·4사분면
        - $|a|$가 클수록 원점에서 **멀어져요**.` },
      { id: 'c3', t: '식 구하기', b: T`한 점을 대입해 $a=xy$를 구해요.

        "$x=2$일 때 $y=6$" → $a=2\times6=12$ → $y=\dfrac{12}{x}$

        ⚠️ 정비례는 $a=\dfrac{y}{x}$, 반비례는 $a=xy$. 헷갈리지 마세요.` },
    ],
    gens: [
      { id: 'find', lv: [1, 3], card: 'c3', make: (R, lv) => {
        const a = R.nz(-12, 12), xs = [1, 2, 3, 4, 6].filter((v) => a % v === 0).map((v) => v * (R.chance(0.3) ? -1 : 1));
        const x = R.pick(xs);
        const y = a / x;
        if (lv === 1) return { q: `$y$[가/이] $x$에 반비례하고 $x=${x}$일 때 $y=${y}$이에요. 비례상수 $a$는?`, a, wrong: [x + y, y / x || 1, -a], why: `$a=xy=${paren(x)}\\times${paren(y)}=${a}$` };
        const t = R.pick([1, 2, 3, 4, 6, 12].filter((v) => a % v === 0 && v !== Math.abs(x)));
        const tt = t ?? 1;
        return { q: `$y$[가/이] $x$에 반비례하고 $x=${x}$일 때 $y=${y}$이에요. $x=${tt}$일 때 $y$의 값은?`, a: a / tt, why: `$a=xy=${a}$, $y=\\dfrac{${a}}{x}$\n$x=${tt}$이면 $y=${a / tt}$` };
      } },
      { id: 'which', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.int(2, 12);
        return { q: '다음 중 $y$[가/이] $x$에 반비례하는 것은?', correct: `$xy=${a}$`, wrong: [`$y=${a}x$`, `$y=x-${a}$`, `$\\dfrac{y}{x}=${a}$`], why: '반비례는 $xy$가 일정한 값(=$a$)이에요. $y=\\dfrac{a}{x}$와 같은 식이에요.' };
      } },
      { id: 'cmp', lv: [2, 4], card: 'c1', make: (R) => {
        const a = R.pick([12, 24, 36, 60]);
        const x = R.pick([2, 3, 4, 6].filter((v) => a % v === 0));
        const times = R.pick([2, 3].filter((t) => (a / x) % t === 0).concat([2]).slice(0, 2)); 
        return { q: `$y$[가/이] $x$에 반비례하고 $x=${x}$일 때 $y=${a / x}$이에요. $x$가 ${times}배가 되면 $y$는 얼마가 될까요?`, a: a / x / times, why: `$xy=${a}$[이므로/므로] $x=${x * times}$이면 $y=${a}\\div${x * times}=${a / x / times}$\n($x$가 ${times}배 → $y$는 $\\frac1${times}$배)` };
      } },
      { id: 'graph', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.pick([2, 3, 4, 6, -2, -3, -4, -6]);
        const fig = coordPlane({ xmin: -6, xmax: 6, ymin: -6, ymax: 6, curves: [{ fn: (x) => (x > 0.3 ? a / x : NaN) }, { fn: (x) => (x < -0.3 ? a / x : NaN) }], pts: [{ x: 2, y: a / 2 }].filter((p) => Math.abs(p.y) <= 6) });
        if (R.chance(0.5)) {
          const px = R.pick([1, 2, 3, 4, 6].filter((v) => Math.abs(a) % v === 0 && Math.abs(a / v) <= 6)); const py = a / px;
          const fig2 = coordPlane({ xmin: -6, xmax: 6, ymin: -6, ymax: 6, curves: [{ fn: (x) => (x > 0.3 ? a / x : NaN) }, { fn: (x) => (x < -0.3 ? a / x : NaN) }], pts: [{ x: px, y: py, label: 'P' }] });
          return { q: `반비례 관계 $y=\\dfrac{a}{x}$의 그래프가 점 $P(${px},\\ ${py})$를 지나요. $a$의 값은?`, fig: fig2, a, wrong: [px + py, -a, px - py || 7], why: `$a=xy=${px}\\times${paren(py)}=${a}$` };
        }
        return { q: '그래프가 $y=\\dfrac{a}{x}$일 때 $a$[은/는] 양수일까요, 음수일까요?', fig, correct: a > 0 ? '양수' : '음수', wrong: [a > 0 ? '음수' : '양수'], why: `그래프가 제${a > 0 ? '1, 3' : '2, 4'}사분면에 있으므로 $a$[은/는] ${a > 0 ? '양수' : '음수'}예요.` };
      } },
      { id: 'app', lv: [3, 5], card: 'c1', make: (R) => {
        const dist = R.pick([60, 120, 240, 360]);
        const v = R.pick([2, 3, 4, 5, 6, 10, 12, 20, 30, 40, 60].filter((s) => dist % s === 0));
        return { q: `${dist}km 떨어진 곳을 가는데 시속 ${v}km로 가면 몇 시간이 걸릴까요?`, a: dist / v, unit: '시간', why: `(시간)=(거리)÷(속력)이므로 $y=\\dfrac{${dist}}{x}$\n$x=${v}$이면 $y=${dist / v}$` };
      } },
    ],
  },
  {
    id: 'm1.graph',
    lesson: [
      { id: 'c1', t: '그래프 읽는 법', b: T`그래프는 두 양의 관계를 그림으로 나타낸 거예요. 가로축은 보통 **시간**, 세로축은 **거리·양** 같은 변하는 값이에요.

        - 오른쪽 위로 올라가면 → **증가**
        - 오른쪽 아래로 내려가면 → **감소**
        - 수평(가로선)이면 → **변화 없음** (멈춰 있음)` },
      { id: 'c2', t: '기울기가 뜻하는 것', b: T`거리-시간 그래프에서 직선이 **가파를수록 빠르다**는 뜻이에요.

        (속력)$=\dfrac{\text{거리의 변화}}{\text{시간의 변화}}$

        예) 2분 동안 6칸 올라가면 속력 $=\dfrac62=3$.` },
    ],
    gens: [
      { id: 'stop', lv: [1, 3], card: 'c1', make: (R) => {
        const t1 = R.int(2, 4), d1 = t1 * R.int(2, 4), st = R.int(2, 4), t3 = R.int(2, 3), d3 = R.int(1, 3) * t3;
        const segs = [[0, 0, t1, d1], [t1, d1, t1 + st, d1], [t1 + st, d1, t1 + st + t3, d1 + d3]];
        const xmax = t1 + st + t3;
        const fig = coordPlane({ xmin: 0, xmax: xmax + 1, ymin: 0, ymax: d1 + d3 + 1, segs, w: 320, ticks: true });
        const kind = R.pick(['stop', 'dist']);
        if (kind === 'stop') return { q: '어떤 사람이 집에서 출발해 걸어간 거리를 그래프(가로: 시간(분), 세로: 거리(km))로 나타냈어요. 멈춰 있었던 시간은 몇 분일까요?', fig, a: st, unit: '분', why: `그래프가 **수평**인 구간이 멈춘 시간이에요. 그 구간은 ${t1}분~${t1 + st}분이므로 ${st}분이에요.` };
        return { q: '어떤 사람이 집에서 출발해 걸어간 거리를 그래프(가로: 시간(분), 세로: 거리(km))로 나타냈어요. 출발 후 마지막으로 도착했을 때 집에서 떨어진 거리는 몇 km일까요?', fig, a: d1 + d3, unit: 'km', why: `끝점의 세로 값을 읽어요. $${d1}+${d3}=${d1 + d3}$km` };
      } },
      { id: 'speed', lv: [2, 5], card: 'c2', make: (R) => {
        const v = R.int(2, 5), t = R.int(2, 5);
        const fig = coordPlane({ xmin: 0, xmax: t + 1, ymin: 0, ymax: v * t + 1, segs: [[0, 0, t, v * t]], w: 320 });
        return { q: '자전거를 탄 거리를 나타낸 그래프(가로: 시간(분), 세로: 거리(km))예요. 1분에 몇 km를 간 걸까요?', fig, a: v, unit: 'km', why: `${t}분 동안 ${v * t}km를 갔어요. (속력)=${v * t}÷${t}=${v}` };
      } },
      { id: 'which', lv: [3, 5], card: 'c1', make: (R) => {
        const situations = [
          ['처음엔 빠르게 올랐다가 한동안 같은 높이에 있다가 다시 내려오는', '올랐다가 평평하다가 내려가는 그래프'],
          ['일정한 속력으로 계속 걸어가는', '원점에서 시작하는 한 직선'],
          ['갔다가 같은 길로 돌아오는', '올라갔다가 내려오는 그래프'],
        ];
        const k = R.int(0, 2);
        const opts = ['원점에서 시작하는 한 직선', '올랐다가 평평하다가 내려가는 그래프', '올라갔다가 내려오는 그래프', '수평인 직선'];
        return { q: `집에서 출발하여 ${situations[k][0]} 상황을 나타내는 (시간-거리) 그래프의 모양은?`, correct: situations[k][1], wrong: opts.filter((o) => o !== situations[k][1]).slice(0, 3), why: '시간이 흐르면서 거리가 어떻게 변하는지 생각해요. 증가는 올라감, 멈춤은 수평, 되돌아오면 내려가요.' };
      } },
    ],
  },
];
