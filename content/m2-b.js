// 중2 ② 일차함수 · 삼각형과 사각형 · 닮음 · 피타고라스 · 경우의 수와 확률
import { gcd, fr, linTex, paren, pm } from '../js/lib.js';
import { coordPlane } from '../js/fig.js';

const T = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const uniq = (arr, not) => [...new Set(arr.map(String))].filter((x) => x !== String(not));
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const perm = (n, r) => fact(n) / fact(n - r);
const comb = (n, r) => perm(n, r) / fact(r);
const co2 = (a, b) => `${a === 1 ? '' : a}x${b > 0 ? '+' : '-'}${Math.abs(b) === 1 ? '' : Math.abs(b)}y`;
const TRIPLES = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [7, 24, 25], [9, 12, 15], [12, 16, 20], [20, 21, 29], [15, 20, 25], [10, 24, 26]];

export default [
  // ───────────── 일차함수와 그래프 ─────────────
  {
    id: 'm2.func',
    lesson: [
      { id: 'c1', t: '함수란?', b: T`두 변수 $x,\ y$에서 $x$의 값이 하나 정해지면 그에 따라 $y$의 값이 **오직 하나** 정해질 때, $y$[을/를] $x$의 ==함수==라 하고 $y=f(x)$로 나타내요.

        - 함수 ⭕: $y=2x$ ($x=3$ → $y=6$ 하나뿐)
        - 함수 ❌: "$x$의 약수 $y$" ($x=6$ → $y=1,2,3,6$ 여러 개)

        한 $x$에 $y$가 **둘 이상**이면 함수가 아니에요.` },
      { id: 'c2', t: '함숫값', b: T`$f(x)=2x+1$일 때 $x=3$에서의 ==함숫값==은 $f(3)=2\times3+1=7$

        **$x$ 자리에 값을 통째로 대입**하면 돼요. 음수는 괄호를 꼭 써요.
        $f(-2)=2\times(-2)+1=-3$` },
    ],
    gens: [
      { id: 'is', lv: [1, 2], card: 'c1', make: (R) => {
        const yes = ['$y=3x$', '$y=x+5$', '$y=\\dfrac{12}{x}\\ (x\\ne0)$', '$y=-2x+1$'];
        const no = ['$x$의 약수 $y$', '자연수 $x$보다 큰 수 $y$', '절댓값이 $x$인 수 $y$ (x>0)'];
        const isFn = R.chance(0.6);
        if (isFn) return { q: '다음 중 $y$가 $x$의 함수인 것은?', correct: R.pick(yes), wrong: R.sample(no, 3), why: '$x$의 값이 정해질 때 $y$가 하나로 정해지면 함수예요.' };
        const c = R.pick(no);
        return { q: '다음 중 $y$가 $x$의 함수가 **아닌** 것은?', correct: c, wrong: R.sample(yes, 3), why: '한 $x$에 대해 $y$가 여러 개 생기면 함수가 아니에요.' };
      } },
      { id: 'val', lv: [1, 4], card: 'c2', make: (R, lv) => {
        const a = R.nz(-5, 5), b = R.nz(-9, 9), x = R.nz(-6, 6);
        const f = linTex(a, b);
        if (lv >= 3 && R.chance(0.5)) {
          const y = a * x + b;
          return { q: `$f(x)=${f}$일 때 $f(k)=${y}$[이면/이면] $k$의 값은?`.replace('[이면/이면]', '이면'), a: x, wrong: [y, -x, x + 1], why: `$${f.replace(/x/g, '(k)')}$ … 간단히: $${a}k${pm(b)}=${y}$ → $k=${x}$` };
        }
        return { q: `$f(x)=${f}$일 때 $f(${x})$의 값은?`, a: a * x + b, wrong: [a + x + b, a * x - b, -a * x + b], why: `$x$ 자리에 $${paren(x)}$[을/를] 대입해요. $${a}\\times${paren(x)}${pm(b)}=${a * x + b}$` };
      } },
    ],
  },
  {
    id: 'm2.linear', anchor: true,
    lesson: [
      { id: 'c1', t: '일차함수란?', b: T`$y=ax+b$ ($a\ne0$) 꼴의 함수를 ==일차함수==라 해요.

        $y=3x-2$ ⭕, $y=5$ ❌($x$ 없음), $y=x^2$ ❌(이차)

        $y=ax$[은/는] $b=0$인 일차함수(정비례)예요.` },
      { id: 'c2', t: '그래프: 평행이동', b: T`$y=ax+b$의 그래프는 $y=ax$의 그래프를 **$y$축 방향으로 $b$만큼 평행이동**한 직선이에요.

        $y=2x$[을/를] 위로 $3$만큼 → $y=2x+3$
        $y=2x$[을/를] 아래로 $4$만큼 → $y=2x-4$

        $a$가 같으면 평행(기울기 같음), $b$[은/는] $y$절편이에요.` },
      { id: 'c3', t: '절편', b: T`- ==$y$절편==: 그래프가 $y$축과 만나는 점의 $y$좌표 → $x=0$ 대입 → $y=b$
        - ==$x$절편==: 그래프가 $x$축과 만나는 점의 $x$좌표 → $y=0$ 대입 → $x=-\dfrac{b}{a}$

        예) $y=2x-6$: $y$절편 $-6$, $x$절편: $0=2x-6$ → $3$` },
    ],
    gens: [
      { id: 'shift', lv: [1, 2], card: 'c2', make: (R) => {
        const a = R.nz(-4, 4), b = R.nz(-7, 7);
        return { q: `일차함수 $y=${linTex(a, 0)}$의 그래프를 $y$축 방향으로 $${b}$만큼 평행이동한 그래프의 식은?`, correct: `$y=${linTex(a, b)}$`, wrong: [`$y=${linTex(a + b, 0)}$`, `$y=${linTex(a, -b)}$`, `$y=${linTex(a * b || 2, 0)}$`], why: `$y$축 방향으로 $${b}$만큼 평행이동하면 $y=ax+b$ 꼴이 돼요. $y=${linTex(a, b)}$` };
      } },
      { id: 'icpt', lv: [2, 4], card: 'c3', make: (R, lv) => {
        const a = R.nz(-4, 4), x0 = R.nz(-6, 6); const b = -a * x0;
        const ask = R.pick(['x', 'y']);
        return { q: `일차함수 $y=${linTex(a, b)}$의 ${ask}절편은?`.replace('x절편', '$x$절편').replace('y절편', '$y$절편'), a: ask === 'x' ? x0 : b, wrong: [ask === 'x' ? b : x0, -(ask === 'x' ? x0 : b), a], why: ask === 'x' ? `$y=0$[을/를] 대입: $0=${linTex(a, b)}$ → $x=${x0}$` : `$x=0$[을/를] 대입하면 $y=${b}$` };
      } },
      { id: 'pass', lv: [1, 4], card: 'c1', make: (R, lv) => {
        const a = R.nz(-4, 4), b = R.nz(-6, 6);
        const x = R.nz(-4, 4), y = a * x + b;
        const mk = (p, q) => `$(${p},\\ ${q})$`;
        const pts = [mk(x, y), mk(x, y + 1), mk(x + 1, y), mk(-x, y)];
        const cor = mk(x, y);
        return { q: `일차함수 $y=${linTex(a, b)}$의 그래프 위의 점은?`, correct: cor, wrong: uniq(pts, cor).slice(0, 3).map(String), why: `$x=${x}$[을/를] 대입하면 $y=${a}\\times${paren(x)}${pm(b)}=${y}$` };
      } },
      { id: 'graph', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.pick([-2, -1, 1, 2]), b = R.nz(-3, 3);
        const fig = coordPlane({ xmin: -5, xmax: 5, ymin: -6, ymax: 6, lines: [{ a, b }], pts: [{ x: 0, y: b }] });
        return { q: '그래프가 나타내는 일차함수 $y=ax+b$에서 $b$의 값은?', fig, a: b, wrong: [a, -b, a + b], why: `그래프가 $y$축과 $(0,\\ ${b})$에서 만나므로 $y$절편 $b=${b}$` };
      } },
    ],
  },
  {
    id: 'm2.slope',
    lesson: [
      { id: 'c1', t: '기울기', b: T`$$(\text{기울기})=\dfrac{(y\text{의 증가량})}{(x\text{의 증가량})}$$

        일차함수 $y=ax+b$에서 기울기는 $a$예요. $x$가 1 늘 때 $y$가 $a$만큼 변해요.

        두 점 $(x_1,\ y_1),\ (x_2,\ y_2)$[을/를] 지나는 직선의 기울기 $=\dfrac{y_2-y_1}{x_2-x_1}$` },
      { id: 'c2', t: '기울기의 부호와 모양', b: T`- $a>0$: **오른쪽 위**로 향함 (증가)
        - $a<0$: **오른쪽 아래**로 향함 (감소)
        - $|a|$가 클수록 $y$축에 가까워져요 (가파르다)

        기울기가 같고 $y$절편이 다르면 **평행**, 기울기와 $y$절편이 모두 같으면 **일치**.` },
    ],
    gens: [
      { id: 'two', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const a = R.nz(-4, 4), b = R.nz(-5, 5); const x1 = R.nz(-4, 3), dx = R.int(1, 3);
        const x2 = x1 + dx; const y1 = a * x1 + b, y2 = a * x2 + b;
        return { q: `두 점 $(${x1},\\ ${y1})$, $(${x2},\\ ${y2})$[을/를] 지나는 직선의 기울기는?`, a, wrong: [-a, a + 1, dx], why: `$\\dfrac{${y2}-${paren(y1)}}{${x2}-${paren(x1)}}=\\dfrac{${y2 - y1}}{${dx}}=${a}$` };
      } },
      { id: 'delta', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.nz(-5, 5), dx = R.int(2, 6);
        return { q: `일차함수 $y=${linTex(a, R.nz(-5, 5))}$에서 $x$의 값이 ${dx}만큼 증가할 때 $y$의 값은 얼마만큼 변할까요? (감소는 음수)`, a: a * dx, wrong: [a, dx, a + dx], why: `기울기 $${a}$ × $x$의 증가량 $${dx}$ $=${a * dx}$` };
      } },
      { id: 'par', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.nz(-4, 4), b = R.nz(-5, 5);
        return { q: `$y=${linTex(a, b)}$의 그래프와 평행한 직선은?`, correct: `$y=${linTex(a, b + R.pick([1, 2, 3]))}$`, wrong: [`$y=${linTex(-a, b)}$`, `$y=${linTex(a + 1, b)}$`, `$y=${linTex(a * 2, b)}$`], why: '평행한 직선은 기울기가 같고 $y$절편이 달라요.' };
      } },
    ],
  },
  {
    id: 'm2.linfind',
    lesson: [
      { id: 'c1', t: '기울기와 한 점을 알 때', b: T`기울기가 $a$이고 점 $(p,\ q)$[을/를] 지나면
        $y=ax+b$에 $(p,\ q)$[을/를] 대입해 $b$[을/를] 구해요.

        예) 기울기 $2$, 점 $(1,\ 5)$ → $5=2\times1+b$ → $b=3$ → $y=2x+3$` },
      { id: 'c2', t: '서로 다른 두 점을 알 때', b: T`1. 기울기 $a=\dfrac{y_2-y_1}{x_2-x_1}$
        2. 한 점을 대입해 $b$ 구하기

        예) $(1,\ 3),\ (3,\ 9)$ → $a=\dfrac{9-3}{3-1}=3$ → $3=3\times1+b$ → $b=0$ → $y=3x$` },
      { id: 'c3', t: '절편이 주어질 때', b: T`$x$절편이 $p$, $y$절편이 $q$이면 두 점 $(p,\ 0),\ (0,\ q)$[을/를] 지나요.
        기울기 $=\dfrac{q-0}{0-p}=-\dfrac qp$` },
    ],
    gens: [
      { id: 'pt', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.nz(-4, 4), b = R.nz(-6, 6), x = R.nz(-4, 4); const y = a * x + b;
        const t = R.nz(-5, 5);
        return { q: `기울기가 $${a}$이고 점 $(${x},\\ ${y})$[을/를] 지나는 일차함수에서 $x=${t}$일 때 $y$의 값은?`, a: a * t + b, wrong: [a * t, a + t + b, a * t - b], why: `$${y}=${a}\\times${paren(x)}+b$ → $b=${b}$\n$y=${linTex(a, b)}$에 $x=${t}$[을/를] 대입하면 $${a * t + b}$` };
      } },
      { id: 'two', lv: [2, 5], card: 'c2', make: (R, lv) => {
        const a = R.nz(-4, 4), b = R.nz(-6, 6); const x1 = R.nz(-3, 2), x2 = x1 + R.int(1, 3);
        const t = R.nz(-5, 5);
        const ask = R.pick(['b', 'at']);
        if (ask === 'b') return { q: `두 점 $(${x1},\\ ${a * x1 + b})$, $(${x2},\\ ${a * x2 + b})$[을/를] 지나는 일차함수 $y=ax+b$에서 $b$의 값은?`, a: b, wrong: [a, -b, a + b], why: `기울기 $a=${a}$, $(${x1},\\ ${a * x1 + b})$[을/를] 대입하면 $b=${b}$` };
        return { q: `두 점 $(${x1},\\ ${a * x1 + b})$, $(${x2},\\ ${a * x2 + b})$[을/를] 지나는 일차함수에서 $x=${t}$일 때 $y$의 값은?`, a: a * t + b, wrong: [a * t, a * t - b, a + b + t], why: `기울기 $a=${a}$, $b=${b}$ → $y=${linTex(a, b)}$\n$x=${t}$이면 $y=${a * t + b}$` };
      } },
      { id: 'icpt', lv: [3, 5], card: 'c3', make: (R) => {
        const p = R.pick([2, 3, 4, 6, -2, -3, -4]), q = R.nz(-8, 8); const a = -q / p;
        if (!Number.isInteger(a)) { const pp = 2, qq = R.pick([2, 4, 6, -2, -4]); return { q: `$x$절편이 $${pp}$, $y$절편이 $${qq}$인 일차함수의 기울기는?`, a: -qq / pp, wrong: [qq / pp, fr(pp, qq), fr(-pp, qq)], why: `두 점 $(${pp},\\ 0),\\ (0,\\ ${qq})$[을/를] 지나요. 기울기 $\\dfrac{${qq}-0}{0-${pp}}=${-qq / pp}$` }; }
        return { q: `$x$절편이 $${p}$, $y$절편이 $${q}$인 일차함수의 기울기는?`, a, wrong: [-a, fr(p, q), q], why: `두 점 $(${p},\\ 0),\\ (0,\\ ${q})$[을/를] 지나요. 기울기 $\\dfrac{${q}-0}{0-${paren(p)}}=${a}$` };
      } },
    ],
  },
  {
    id: 'm2.lineq',
    lesson: [
      { id: 'c1', t: '일차방정식 ax+by+c=0의 그래프', b: T`$ax+by+c=0$ ($b\ne0$)은 $y=-\dfrac{a}{b}x-\dfrac{c}{b}$로 바꾸면 일차함수예요. 그래프는 **직선**이에요.

        - $x=k$ → $y$축에 **평행**한 직선
        - $y=k$ → $x$축에 **평행**한 직선

        예) $2x+y-4=0$ → $y=-2x+4$` },
      { id: 'c2', t: '연립방정식과 그래프', b: T`연립방정식의 해 = 두 직선의 **교점의 좌표** $(x,\ y)$

        - 한 점에서 만난다 → 해가 하나
        - 평행 → 해 없음
        - 일치 → 해가 무수히 많음

        두 직선의 교점은 두 식을 연립해서 풀면 구해요.` },
    ],
    gens: [
      { id: 'conv', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.int(1, 4), b = R.pick([1, 2]), c = R.nz(-6, 6);
        // a x + b y + c = 0 → y = -(a/b) x - c/b
        const y_a = -a / b, y_b = -c / b;
        if (!Number.isInteger(y_a) || !Number.isInteger(y_b)) return { q: '$y=3$의 그래프는 어떤 직선일까요?', correct: '$x$축에 평행한 직선', wrong: ['$y$축에 평행한 직선', '원점을 지나는 직선', '기울기가 3인 직선'], why: '$y=k$ 꼴은 $x$축에 평행해요.' };
        return { q: `$${linTex(a, 0)}${b === 1 ? '+y' : '+2y'}${pm(c)}=0$[을/를] $y=mx+n$ 꼴로 나타내면 $m$의 값은? ($m$[은/는] 기울기)`, a: y_a, wrong: [a, -y_a, y_b], why: b === 1 ? `$y=${linTex(y_a, y_b)}$` : `$2y=${linTex(-a, -c)}$ → $y=${linTex(y_a, y_b)}$` };
      } },
      { id: 'inter', lv: [2, 5], card: 'c2', make: (R, lv) => {
        const x = R.nz(-5, 6), y = R.nz(-5, 6);
        const a1 = R.nz(-3, 3), a2 = R.nz(-3, 3);
        if (a1 === a2) return { q: '두 직선이 평행할 때 연립방정식의 해는?', correct: '해가 없다', wrong: ['해가 하나', '해가 무수히 많다', '해가 2개'], why: '평행한 두 직선은 만나지 않으므로 해가 없어요.' };
        const b1 = y - a1 * x, b2 = y - a2 * x;
        return { q: `두 직선 $y=${linTex(a1, b1)}$, $y=${linTex(a2, b2)}$의 교점의 $x$좌표는?`, a: x, wrong: [y, x + 1, x - y], why: `두 식이 같을 때의 $x$[을/를] 구해요.\n$${linTex(a1, b1)}=${linTex(a2, b2)}$ → $${linTex(a1 - a2, 0)}=${b2 - b1}$ → $x=${x}$` };
      } },
      { id: 'cnt', lv: [3, 5], card: 'c2', make: (R) => {
        const kind = R.pick(['one', 'none', 'many']); const a = R.int(1, 4), b = R.int(1, 3), c = R.int(1, 5);
        const l2 = kind === 'one' ? `${co2(a + 1, b)}=${c}` : kind === 'none' ? `${co2(2 * a, 2 * b)}=${2 * c + 1}` : `${co2(2 * a, 2 * b)}=${2 * c}`;
        const ans = { one: '한 점에서 만난다', none: '평행하다 (만나지 않는다)', many: '일치한다' }[kind];
        return { q: `두 일차방정식 $${co2(a, b)}=${c}$, $${l2}$의 그래프의 위치 관계는?`, correct: ans, wrong: Object.values({ one: '한 점에서 만난다', none: '평행하다 (만나지 않는다)', many: '일치한다' }).filter((v) => v !== ans), why: kind === 'one' ? '기울기가 달라서 한 점에서 만나요.' : kind === 'none' ? '기울기는 같고 절편이 달라서 평행해요.' : '둘째 식이 첫 식의 2배라서 같은 직선이에요.' };
      } },
    ],
  },

  // ───────────── 삼각형과 사각형의 성질 ─────────────
  {
    id: 'm2.isos',
    lesson: [
      { id: 'c1', t: '이등변삼각형의 성질', b: T`두 변의 길이가 같은 삼각형이 ==이등변삼각형==이에요. 길이가 같은 두 변이 만나는 각이 ==꼭지각==, 나머지 두 각이 ==밑각==.

        - ==두 밑각의 크기는 같아요.==
        - 꼭지각의 이등분선은 밑변을 **수직이등분**해요.

        $\angle A=100^\circ$이면 밑각 $=(180-100)\div2=40^\circ$` },
      { id: 'c2', t: '이등변삼각형이 되는 조건', b: T`**두 각의 크기가 같은 삼각형은 이등변삼각형**이에요. (성질의 거꾸로)

        $\angle B=\angle C$이면 $\overline{AB}=\overline{AC}$

        그래서 정삼각형은 세 각이 모두 $60^\circ$이고 세 변이 모두 같아요.` },
    ],
    gens: [
      { id: 'base', lv: [1, 3], card: 'c1', make: (R) => {
        const top = R.int(2, 17) * 10; const b = (180 - top) / 2;
        if (R.chance(0.5)) return { q: `$\\overline{AB}=\\overline{AC}$인 이등변삼각형 ABC에서 $\\angle A=${top}^\\circ$일 때 $\\angle B$의 크기는?`, a: b, unit: '°', wrong: [180 - top, top, 90 - top / 2 + 5], why: `밑각은 크기가 같아요. $\\angle B=(180-${top})\\div2=${b}^\\circ$` };
        const bb = R.int(20, 80);
        return { q: `$\\overline{AB}=\\overline{AC}$인 이등변삼각형 ABC에서 $\\angle B=${bb}^\\circ$일 때 $\\angle A$의 크기는?`, a: 180 - 2 * bb, unit: '°', wrong: [180 - bb, bb, 2 * bb], why: `밑각 $\\angle B=\\angle C=${bb}^\\circ$이므로 $\\angle A=180-${bb}\\times2=${180 - 2 * bb}^\\circ$` };
      } },
      { id: 'ext', lv: [3, 5], card: 'c1', make: (R) => {
        const base = R.int(25, 70);
        return { q: `$\\overline{AB}=\\overline{AC}$인 이등변삼각형 ABC에서 $\\angle B=${base}^\\circ$일 때, 변 BC의 연장선 위 점 D에 대해 $\\angle ACD$(꼭짓점 C의 외각)의 크기는?`, a: 180 - base, unit: '°', wrong: [base, 2 * base, 180 - 2 * base], why: `$\\angle ACB=\\angle B=${base}^\\circ$ (밑각)\n외각은 이웃한 내각과 합이 $180^\\circ$: $180-${base}=${180 - base}^\\circ$` };
      } },
      { id: 'cond', lv: [2, 4], card: 'c2', make: (R) => {
        const a = R.int(30, 80);
        return { q: `삼각형 ABC에서 $\\angle B=\\angle C=${a}^\\circ$일 때, 길이가 같은 두 변은?`, correct: '$\\overline{AB}=\\overline{AC}$', wrong: ['$\\overline{AB}=\\overline{BC}$', '$\\overline{AB}=\\overline{BC}=\\overline{CA}$ (세 변 모두)', '알 수 없다'], why: '두 각이 같으면 그 두 각의 **마주 보는 변**이 같아요. $\\angle B$의 대변 $\\overline{AC}$, $\\angle C$의 대변 $\\overline{AB}$' };
      } },
    ],
  },
  {
    id: 'm2.rtcong',
    lesson: [
      { id: 'c1', t: '직각삼각형의 합동 조건', b: T`직각삼각형은 한 각이 직각이라서, 일반 삼각형보다 **조건이 하나 더 쉬워요.**

        - ==RHA 합동==: 빗변의 길이와 한 **예각**의 크기가 같을 때
        - ==RHS 합동==: 빗변의 길이와 다른 **한 변**의 길이가 같을 때

        (R: 직각, H: 빗변, A: 각, S: 변)` },
      { id: 'c2', t: '활용', b: T`**각의 이등분선 위의 점은 각의 두 변까지의 거리가 같아요.** (RHA 합동으로 증명)

        두 직각삼각형이 **빗변을 공유**하고 한 예각이 같으면 → RHA로 합동이에요.` },
    ],
    gens: [
      { id: 'cond', lv: [1, 3], card: 'c1', make: (R) => {
        const items = [
          ['두 직각삼각형에서 빗변의 길이와 한 예각의 크기가 각각 같다.', 'RHA 합동'],
          ['두 직각삼각형에서 빗변의 길이와 다른 한 변의 길이가 각각 같다.', 'RHS 합동'],
        ];
        const it = R.pick(items);
        return { q: `${it[0]} 이때의 합동 조건은?`, correct: it[1], wrong: ['SSS 합동', 'SAS 합동', ['RHA 합동', 'RHS 합동'].find((x) => x !== it[1])], why: it[1] === 'RHA 합동' ? '빗변(H)과 예각(A)이 같아요.' : '빗변(H)과 다른 한 변(S)이 같아요.' };
      } },
      { id: 'not', lv: [2, 4], card: 'c1', make: (R) => {
        return { q: '두 직각삼각형이 합동이 **되지 않는** 경우는?', correct: '두 예각의 크기가 각각 같을 때', wrong: ['빗변과 한 예각이 같을 때', '빗변과 다른 한 변이 같을 때', '직각을 낀 두 변이 같을 때'], why: '각만 같으면 크기가 다를 수 있어요(닮음). 변이 하나는 같아야 합동이에요.' };
      } },
      { id: 'len', lv: [3, 5], card: 'c2', make: (R) => {
        const d = R.int(3, 12), ang = R.pick([30, 40, 50]);
        return { q: `각 $\\angle XOY$의 이등분선 위의 점 P에서 변 OX까지의 거리가 ${d}cm일 때, 변 OY까지의 거리는?`, a: d, unit: 'cm', wrong: [d * 2, d / 2 === Math.floor(d / 2) ? d / 2 : d + 1, d + 2], why: '각의 이등분선 위의 점에서 각의 두 변까지의 거리는 같아요.' };
      } },
    ],
  },
  {
    id: 'm2.centers',
    lesson: [
      { id: 'c1', t: '삼각형의 외심', b: T`세 변의 **수직이등분선**의 교점을 ==외심==이라 해요. 외심 O는 세 꼭짓점에서 **거리가 같아요**($\overline{OA}=\overline{OB}=\overline{OC}$). 외접원의 중심이에요.

        - 예각삼각형: 외심이 삼각형 안
        - 직각삼각형: 외심이 **빗변의 중점**
        - 둔각삼각형: 외심이 삼각형 밖

        $\angle BOC=2\angle A$ (중심각은 원주각의 2배)` },
      { id: 'c2', t: '삼각형의 내심', b: T`세 각의 **이등분선**의 교점을 ==내심==이라 해요. 내심 I는 세 변에서 **거리가 같아요**. 내접원의 중심이에요(항상 삼각형 안).

        $\angle BIC=90^\circ+\dfrac12\angle A$

        내접원의 반지름 $r$로 넓이: $S=\dfrac12r(a+b+c)$` },
    ],
    gens: [
      { id: 'out', lv: [1, 3], card: 'c1', make: (R) => {
        const A = R.int(3, 8) * 10;
        return { q: `점 O가 삼각형 ABC의 외심이고 $\\angle A=${A}^\\circ$일 때 $\\angle BOC$의 크기는?`, a: 2 * A, unit: '°', wrong: [A, A / 2, 180 - A], why: `중심각은 원주각의 2배예요. $\\angle BOC=2\\angle A=${2 * A}^\\circ$` };
      } },
      { id: 'in', lv: [3, 5], card: 'c2', make: (R) => {
        const A = R.int(3, 8) * 10;
        return { q: `점 I가 삼각형 ABC의 내심이고 $\\angle A=${A}^\\circ$일 때 $\\angle BIC$의 크기는?`, a: 90 + A / 2, unit: '°', wrong: [90 + A, 2 * A, 180 - A], why: `$\\angle BIC=90^\\circ+\\frac12\\angle A=90+${A / 2}=${90 + A / 2}^\\circ$` };
      } },
      { id: 'kind', lv: [1, 3], card: 'c1', make: (R) => {
        const items = [
          ['세 변의 수직이등분선의 교점', '외심', '외심'],
          ['세 각의 이등분선의 교점', '내심', '내심'],
          ['세 꼭짓점에서의 거리가 같은 점', '외심', '외심'],
          ['세 변에서의 거리가 같은 점', '내심', '내심'],
        ];
        const it = R.pick(items);
        return { q: `${it[0]}은?`, correct: it[1], wrong: ['외심', '내심', '무게중심', '수심'].filter((x) => x !== it[1]).slice(0, 3), why: `${it[1]}[은/는] ${it[1] === '외심' ? '세 변의 수직이등분선의 교점이고 세 꼭짓점까지 거리가 같아요' : '세 각의 이등분선의 교점이고 세 변까지 거리가 같아요'}.` };
      } },
      { id: 'rt', lv: [3, 5], card: 'c1', make: (R) => {
        const t = R.pick(TRIPLES);
        return { q: `직각삼각형 ABC($\\angle C=90^\\circ$)의 빗변 AB의 길이가 ${t[2]}cm일 때, 외심에서 꼭짓점 A까지의 거리는?`, a: t[2] / 2, fmt: 'dec', unit: 'cm', wrong: [t[2], t[0], t[1]], why: `직각삼각형의 외심은 빗변의 중점이에요. 외접원의 반지름 $=${t[2]}\\div2=${t[2] / 2}$` };
      } },
    ],
  },
  {
    id: 'm2.parallelogram',
    lesson: [
      { id: 'c1', t: '평행사변형의 성질', b: T`두 쌍의 대변이 각각 평행한 사각형이 ==평행사변형==이에요.

        - 두 쌍의 대변의 길이가 각각 같다
        - 두 쌍의 대각의 크기가 각각 같다
        - 두 대각선이 서로 다른 것을 **이등분**한다
        - 이웃한 두 각의 합은 $180^\circ$` },
      { id: 'c2', t: '평행사변형이 되는 조건', b: T`다음 중 하나만 성립해도 평행사변형이에요.
        1. 두 쌍의 대변이 각각 평행
        2. 두 쌍의 대변의 길이가 각각 같다
        3. 두 쌍의 대각의 크기가 각각 같다
        4. 두 대각선이 서로 다른 것을 이등분
        5. **한 쌍의 대변이 평행하고 그 길이가 같다**` },
    ],
    gens: [
      { id: 'angle', lv: [1, 3], card: 'c1', make: (R) => {
        const A = R.int(5, 17) * 10; if (A === 90) return { q: '평행사변형에서 이웃한 두 각의 합은?', a: 180, unit: '°', why: '이웃한 두 각의 합은 $180^\\circ$예요.' };
        const ask = R.pick(['B', 'C', 'D']);
        const v = ask === 'C' ? A : 180 - A;
        return { q: `평행사변형 ABCD에서 $\\angle A=${A}^\\circ$일 때 $\\angle ${ask}$의 크기는?`, a: v, unit: '°', wrong: [A, 180 - A, 90].filter((x) => x !== v), why: ask === 'C' ? '대각은 크기가 같아요. $\\angle C=\\angle A$' : `이웃한 각의 합은 $180^\\circ$예요. $180-${A}=${180 - A}$` };
      } },
      { id: 'side', lv: [1, 4], card: 'c1', make: (R) => {
        const a = R.int(3, 12), b = R.int(3, 12);
        if (R.chance(0.5)) return { q: `평행사변형 ABCD에서 $\\overline{AB}=${a}$cm, $\\overline{BC}=${b}$cm일 때 둘레는?`, a: 2 * (a + b), unit: 'cm', wrong: [a + b, a * b, 2 * a + b], why: `대변의 길이가 같으므로 둘레 $=2\\times(${a}+${b})=${2 * (a + b)}$` };
        const d1 = R.int(2, 9) * 2;
        return { q: `평행사변형 ABCD의 두 대각선의 교점을 O라 하자. $\\overline{AC}=${d1}$cm일 때 $\\overline{AO}$의 길이는?`, a: d1 / 2, unit: 'cm', wrong: [d1, d1 * 2, d1 / 2 + 1], why: '두 대각선은 서로 다른 것을 이등분해요.' };
      } },
      { id: 'cond', lv: [3, 5], card: 'c2', make: (R) => {
        const ok = R.pick(['한 쌍의 대변이 평행하고 그 길이가 같다', '두 쌍의 대각의 크기가 각각 같다', '두 대각선이 서로 다른 것을 이등분한다']);
        return { q: '다음 중 사각형 ABCD가 평행사변형이 되는 조건은?', correct: ok, wrong: ['한 쌍의 대변이 평행하다', '두 대각선의 길이가 같다', '한 쌍의 대변의 길이가 같다'], why: '평행사변형이 되려면 위의 5가지 조건 중 하나를 만족해야 해요. "한 쌍의 대변이 평행"만으로는 사다리꼴일 수 있어요.' };
      } },
    ],
  },
  {
    id: 'm2.special',
    lesson: [
      { id: 'c1', t: '여러 가지 사각형', b: T`- ==직사각형==: 네 각이 모두 직각. **두 대각선의 길이가 같고** 서로 이등분
        - ==마름모==: 네 변의 길이가 모두 같음. **두 대각선이 서로 수직**이고 이등분
        - ==정사각형==: 네 각이 직각이고 네 변이 같음. (직사각형+마름모)
        - ==등변사다리꼴==: 평행하지 않은 두 변의 길이가 같은 사다리꼴. 두 대각선의 길이가 같음` },
      { id: 'c2', t: '사각형 사이의 관계', b: T`사다리꼴 ⊃ 평행사변형 ⊃ (직사각형, 마름모) ⊃ 정사각형

        - 평행사변형이 **직각**을 하나 가지면 → 직사각형
        - 평행사변형이 **이웃한 두 변이 같으면** → 마름모
        - 직사각형이 이웃한 두 변이 같으면 → 정사각형
        - 마름모가 한 각이 직각이면 → 정사각형` },
    ],
    gens: [
      { id: 'diag', lv: [1, 3], card: 'c1', make: (R) => {
        const items = [
          ['두 대각선의 길이가 같은 평행사변형은?', '직사각형', ['마름모', '평행사변형', '사다리꼴']],
          ['두 대각선이 서로 수직인 평행사변형은?', '마름모', ['직사각형', '등변사다리꼴', '평행사변형']],
          ['두 대각선이 서로 수직이고 길이가 같은 평행사변형은?', '정사각형', ['직사각형', '마름모', '평행사변형']],
          ['이웃한 두 변의 길이가 같은 평행사변형은?', '마름모', ['직사각형', '사다리꼴', '정사각형은 아니다']],
        ];
        const it = R.pick(items);
        return { q: it[0], correct: it[1], wrong: it[2], why: '직사각형은 대각선의 길이가 같고, 마름모는 대각선이 수직이에요.' };
      } },
      { id: 'cond', lv: [2, 5], card: 'c2', make: (R) => {
        const items = [
          ['평행사변형이 직사각형이 되기 위한 조건은?', '한 내각이 직각이다', ['이웃한 두 변이 같다', '대각선이 수직이다', '대변이 평행하다']],
          ['평행사변형이 마름모가 되기 위한 조건은?', '이웃한 두 변의 길이가 같다', ['한 내각이 직각이다', '두 대각선의 길이가 같다', '대각이 같다']],
          ['직사각형이 정사각형이 되기 위한 조건은?', '이웃한 두 변의 길이가 같다', ['대각선이 이등분된다', '대변이 평행하다', '대각이 같다']],
          ['마름모가 정사각형이 되기 위한 조건은?', '한 내각이 직각이다', ['대각선이 수직이다', '네 변이 같다', '대각이 같다']],
        ];
        const it = R.pick(items);
        return { q: it[0], correct: it[1], wrong: it[2], why: '각 사각형의 정의를 떠올려 보세요. 직각이 추가되면 직사각형, 이웃한 변이 같아지면 마름모예요.' };
      } },
      { id: 'area', lv: [3, 5], card: 'c1', make: (R) => {
        const d1 = R.int(2, 8) * 2, d2 = R.int(2, 8) * 2;
        return { q: `마름모의 두 대각선의 길이가 ${d1}cm, ${d2}cm일 때 넓이는?`, a: (d1 * d2) / 2, unit: 'cm²', wrong: [d1 * d2, d1 + d2, (d1 * d2) / 4], why: `마름모의 넓이 $=\\frac12\\times(\\text{대각선})\\times(\\text{대각선})=\\frac12\\times${d1}\\times${d2}=${(d1 * d2) / 2}$` };
      } },
    ],
  },

  // ───────────── 도형의 닮음 ─────────────
  {
    id: 'm2.similar',
    lesson: [
      { id: 'c1', t: '닮음과 닮음비', b: T`한 도형을 일정한 비율로 **확대·축소**해서 다른 도형과 합동이 되면 두 도형은 ==닮음==이에요. 기호 $\triangle ABC\backsim\triangle DEF$

        - 대응변의 길이의 비는 모두 같아요 → 그 비를 ==닮음비==라고 해요.
        - 대응각의 크기는 같아요.` },
      { id: 'c2', t: '닮음비, 넓이의 비, 부피의 비', b: T`닮음비가 $m:n$일 때
        - 둘레(길이)의 비: $m:n$
        - ==넓이의 비: $m^2:n^2$==
        - ==부피의 비: $m^3:n^3$== (입체도형)

        예) 닮음비 $2:3$ → 넓이의 비 $4:9$, 부피의 비 $8:27$` },
    ],
    gens: [
      { id: 'ratio', lv: [1, 3], card: 'c1', make: (R) => {
        const m = R.int(1, 4), n = R.int(m + 1, 6), k = R.int(2, 5);
        const a = m * k, b = n * k;
        return { q: `닮은 두 삼각형에서 대응변의 길이가 ${a}cm, ${b}cm일 때 닮음비를 가장 간단한 자연수의 비로 나타내면 $m:n$일 때 $m+n$의 값은?`, a: (m + n) / gcd(m, n), wrong: [a + b, m * n, n - m], why: `$${a}:${b}=${m}:${n}$ (약분) → $m+n=${m + n}$` };
      } },
      { id: 'len', lv: [2, 4], card: 'c1', make: (R) => {
        const m = R.int(1, 3), n = R.int(m + 1, 5), k = R.int(2, 4);
        const side = m * k, ans = n * k;
        return { q: `$\\triangle ABC\\backsim\\triangle DEF$이고 닮음비가 $${m}:${n}$이에요. $\\overline{AB}=${side}$cm일 때 대응변 $\\overline{DE}$의 길이는?`, a: ans, unit: 'cm', wrong: [side + (n - m), side * n, k], why: `$\\overline{AB}:\\overline{DE}=${m}:${n}$ → $${side}:x=${m}:${n}$ → $x=${ans}$` };
      } },
      { id: 'area', lv: [3, 5], card: 'c2', make: (R) => {
        const m = R.int(1, 4), n = R.int(m + 1, 5);
        const base = R.int(2, 6);
        const kind = R.pick(['area', 'vol']);
        if (kind === 'area') { const S = base * m * m; return { q: `닮음비가 $${m}:${n}$인 두 도형이 있어요. 작은 도형의 넓이가 ${S}cm²일 때 큰 도형의 넓이는?`, a: base * n * n, unit: 'cm²', wrong: [S * n / m, S * n, base * n], why: `넓이의 비는 $${m}^2:${n}^2=${m * m}:${n * n}$\n$${S}:x=${m * m}:${n * n}$ → $x=${base * n * n}$` }; }
        const V = base * m ** 3;
        return { q: `닮음비가 $${m}:${n}$인 두 입체도형이 있어요. 작은 도형의 부피가 ${V}cm³일 때 큰 도형의 부피는?`, a: base * n ** 3, unit: 'cm³', wrong: [V * n / m, V * (n / m) ** 2, base * n * n], why: `부피의 비는 $${m}^3:${n}^3=${m ** 3}:${n ** 3}$\n$${V}:x=${m ** 3}:${n ** 3}$ → $x=${base * n ** 3}$` };
      } },
    ],
  },
  {
    id: 'm2.simcond',
    lesson: [
      { id: 'c1', t: '삼각형의 닮음 조건', b: T`- ==SSS 닮음==: 세 쌍의 대응변의 길이의 **비가 같다**
        - ==SAS 닮음==: 두 쌍의 대응변의 길이의 비가 같고 그 **끼인각**의 크기가 같다
        - ==AA 닮음==: 두 쌍의 대응각의 크기가 각각 같다

        ⚠️ 합동 조건과 다르게 **변의 길이가 같은 게 아니라 "비"가 같으면** 돼요. AA는 각 두 개면 충분해요 (세 번째 각은 자동으로 같으니까).` },
      { id: 'c2', t: '닮음 활용', b: T`닮음인 두 삼각형을 찾으면 **대응변의 비가 같다**는 식을 세울 수 있어요.

        $\triangle ABC\backsim\triangle ADE$이면 $\dfrac{AB}{AD}=\dfrac{AC}{AE}=\dfrac{BC}{DE}$

        대응하는 꼭짓점 순서를 맞춰서 비례식을 세워요.` },
    ],
    gens: [
      { id: 'cond', lv: [1, 3], card: 'c1', make: (R) => {
        const items = [
          ['두 쌍의 대응각의 크기가 각각 같다', 'AA 닮음'],
          ['세 쌍의 대응변의 길이의 비가 같다', 'SSS 닮음'],
          ['두 쌍의 대응변의 길이의 비가 같고 그 끼인각의 크기가 같다', 'SAS 닮음'],
        ];
        const it = R.pick(items);
        return { q: `두 삼각형에서 ${it[0]}면 두 삼각형은 어떤 조건으로 닮음일까요?`, correct: it[1], wrong: ['AA 닮음', 'SSS 닮음', 'SAS 닮음', 'ASA 합동'].filter((x) => x !== it[1]).slice(0, 3), why: it[1] === 'AA 닮음' ? '각 두 개만 같으면 닮음이에요.' : it[1] === 'SSS 닮음' ? '세 변의 비가 같아요.' : '두 변의 비와 끼인각이 같아요.' };
      } },
      { id: 'find', lv: [2, 5], card: 'c2', make: (R) => {
        const k = R.int(2, 4), a = R.int(2, 6), b = R.int(a + 1, 9);
        const c = R.int(Math.abs(a - b) + 1, a + b - 1);
        return { q: `삼각형 ABC와 DEF가 닮음이에요. $\\overline{AB}=${a}$, $\\overline{BC}=${b}$, $\\overline{AC}=${c}$이고 닮음비가 $1:${k}$예요. $\\overline{EF}$의 길이는? ($\\overline{BC}$의 대응변)`, a: b * k, wrong: [b + k, a * k, c * k], why: `닮음비 $1:${k}$이므로 $\\overline{EF}=${b}\\times${k}=${b * k}$` };
      } },
      { id: 'shadow', lv: [3, 5], card: 'c2', make: (R) => {
        const h = R.int(2, 8) * 5, s1 = R.int(1, 3) * 10, k = R.int(2, 4);
        return { q: `키가 ${h}cm인 막대의 그림자가 ${s1}cm일 때, 같은 시각에 그림자가 ${s1 * k}cm인 나무의 높이는?`, a: h * k, unit: 'cm', wrong: [h + s1, h * k / 2, h * s1], why: `햇빛의 각도가 같아서 삼각형이 닮음이에요.\n$${h}:${s1}=x:${s1 * k}$ → $x=${h * k}$` };
      } },
    ],
  },
  {
    id: 'm2.parlines',
    lesson: [
      { id: 'c1', t: '삼각형에서 평행선과 선분의 비', b: T`삼각형 ABC에서 $\overline{DE}\parallel\overline{BC}$이면
        $$\dfrac{AD}{AB}=\dfrac{AE}{AC}=\dfrac{DE}{BC}$$
        $$\dfrac{AD}{DB}=\dfrac{AE}{EC}$$

        (D는 AB 위, E는 AC 위의 점)` },
      { id: 'c2', t: '삼각형의 중점연결정리', b: T`삼각형에서 두 변의 **중점**을 이은 선분은 나머지 한 변과 **평행**하고, 길이는 그 **절반**이에요.

        $\overline{AM}=\overline{MB}$, $\overline{AN}=\overline{NC}$이면 $\overline{MN}\parallel\overline{BC}$, $\overline{MN}=\dfrac12\overline{BC}$` },
      { id: 'c3', t: '평행선 사이의 선분의 비', b: T`세 개 이상의 평행선이 두 직선과 만날 때, **대응하는 선분의 길이의 비는 같아요.**

        $l\parallel m\parallel n$이면 $a:b=c:d$

        비례식은 **같은 쪽 선분끼리** 짝지어야 해요.` },
    ],
    gens: [
      { id: 'basic', lv: [1, 3], card: 'c1', make: (R) => {
        const m = R.int(1, 4), n = R.int(1, 4), k = R.int(1, 3);
        const AD = m * k, DB = n * k;
        const BC = R.int(2, 6) * (m + n);
        const DE = (BC * m) / (m + n);
        const ask = R.pick(['DE', 'AE']);
        if (ask === 'DE') return { q: `삼각형 ABC에서 $\\overline{DE}\\parallel\\overline{BC}$이고 $\\overline{AD}=${AD}$, $\\overline{DB}=${DB}$, $\\overline{BC}=${BC}$일 때 $\\overline{DE}$의 길이는?`, a: DE, wrong: [BC - DE, fr(BC * AD, DB), AD + DB], why: `$AD:AB=DE:BC$ → $${AD}:${AD + DB}=x:${BC}$ → $x=${DE}$` };
        const AC = R.int(2, 5) * (m + n); const AE = (AC * m) / (m + n);
        return { q: `삼각형 ABC에서 $\\overline{DE}\\parallel\\overline{BC}$이고 $\\overline{AD}=${AD}$, $\\overline{DB}=${DB}$, $\\overline{AC}=${AC}$일 때 $\\overline{AE}$의 길이는?`, a: AE, wrong: [AC - AE, AD + DB, fr(AC * AD, DB)], why: `$AD:AB=AE:AC$ → $${AD}:${AD + DB}=x:${AC}$ → $x=${AE}$` };
      } },
      { id: 'mid', lv: [2, 4], card: 'c2', make: (R) => {
        const bc = R.int(2, 12) * 2;
        return { q: `삼각형 ABC에서 두 변 AB, AC의 중점을 각각 M, N이라 할 때 $\\overline{BC}=${bc}$cm이면 $\\overline{MN}$의 길이는?`, a: bc / 2, unit: 'cm', wrong: [bc, bc * 2, bc / 2 + 1], why: '중점연결정리: $\\overline{MN}=\\frac12\\overline{BC}$' };
      } },
      { id: 'lines', lv: [3, 5], card: 'c3', make: (R) => {
        const a = R.int(2, 6), b = R.int(2, 6), k = R.int(2, 3);
        return { q: `세 평행선이 한 직선과 만나 만든 선분의 길이가 ${a}, ${b}이고, 다른 직선 위에서 대응하는 선분의 길이가 ${a * k}, $x$일 때 $x$의 값은?`, a: b * k, wrong: [b + k, a * b, b], why: `대응하는 선분의 비가 같아요. $${a}:${b}=${a * k}:x$ → $x=${b * k}$` };
      } },
    ],
  },
  {
    id: 'm2.centroid',
    lesson: [
      { id: 'c1', t: '무게중심', b: T`삼각형의 **세 중선**(꼭짓점과 대변의 중점을 잇는 선분)이 한 점에서 만나는 점을 ==무게중심==이라 해요.

        ==무게중심은 각 중선을 꼭짓점으로부터 $2:1$로 나눠요.==

        중선 $\overline{AM}$에서 무게중심 G: $\overline{AG}:\overline{GM}=2:1$
        $\overline{AG}=\dfrac23\overline{AM}$` },
      { id: 'c2', t: '넓이의 성질', b: T`- 중선은 삼각형의 넓이를 **이등분**해요.
        - 무게중심과 세 꼭짓점을 이으면 삼각형이 **세 개의 같은 넓이**로 나뉘어요. 각각 $\dfrac13S$
        - 중선 3개로 나누면 **6개의 같은 넓이**의 삼각형. 각각 $\dfrac16S$` },
    ],
    gens: [
      { id: 'ratio', lv: [1, 3], card: 'c1', make: (R) => {
        const am = R.int(2, 8) * 3;
        const ask = R.pick(['AG', 'GM']);
        return { q: `삼각형 ABC의 무게중심을 G, 변 BC의 중점을 M이라 하자. $\\overline{AM}=${am}$cm일 때 $\\overline{${ask}}$의 길이는?`, a: ask === 'AG' ? (am * 2) / 3 : am / 3, unit: 'cm', wrong: [am / 2, am, ask === 'AG' ? am / 3 : (am * 2) / 3].filter((x) => x !== (ask === 'AG' ? (am * 2) / 3 : am / 3)), why: `무게중심은 중선을 꼭짓점에서 $2:1$로 나눠요.\n$\\overline{AG}=\\frac23\\times${am}=${(am * 2) / 3}$, $\\overline{GM}=\\frac13\\times${am}=${am / 3}$` };
      } },
      { id: 'area', lv: [3, 5], card: 'c2', make: (R) => {
        const S = R.int(2, 10) * 6;
        const kind = R.pick(['third', 'sixth']);
        return { q: `삼각형 ABC의 넓이가 ${S}cm²이고 점 G가 무게중심일 때, ${kind === 'third' ? '삼각형 GBC' : '중선 3개로 나뉜 6개의 삼각형 중 하나'}의 넓이는?`, a: kind === 'third' ? S / 3 : S / 6, unit: 'cm²', wrong: [S / 2, kind === 'third' ? S / 6 : S / 3, S / 4], why: kind === 'third' ? '무게중심과 세 꼭짓점을 이으면 삼각형이 3등분돼요. $S\\div3$' : '중선으로 6등분돼요. $S\\div6$' };
      } },
    ],
  },

  // ───────────── 피타고라스 정리 ─────────────
  {
    id: 'm2.pyth', anchor: true,
    lesson: [
      { id: 'c1', t: '피타고라스 정리', b: T`직각삼각형에서 **빗변**(직각의 맞은편, 가장 긴 변)의 길이를 $c$, 나머지 두 변을 $a,\ b$라 하면
        $$a^2+b^2=c^2$$

        예) 두 변이 $3,\ 4$ → $c^2=9+16=25$ → $c=5$

        자주 나오는 쌍: $(3,4,5),\ (5,12,13),\ (8,15,17),\ (7,24,25)$ 와 그 배수` },
      { id: 'c2', t: '직각삼각형인지 확인하기', b: T`세 변의 길이가 $a,\ b,\ c$일 때 **가장 긴 변을 $c$**로 놓고 $a^2+b^2=c^2$이 성립하면 직각삼각형이에요.

        - $a^2+b^2>c^2$: 예각삼각형
        - $a^2+b^2=c^2$: 직각삼각형
        - $a^2+b^2<c^2$: 둔각삼각형` },
    ],
    gens: [
      { id: 'hyp', lv: [1, 3], card: 'c1', make: (R) => {
        const t = R.pick(TRIPLES);
        return { q: `직각을 낀 두 변의 길이가 ${t[0]}, ${t[1]}인 직각삼각형의 빗변의 길이는?`, a: t[2], wrong: [t[0] + t[1], t[1] - t[0], t[2] + 1], why: `$${t[0]}^2+${t[1]}^2=${t[0] ** 2}+${t[1] ** 2}=${t[2] ** 2}$ → 빗변 $=${t[2]}$` };
      } },
      { id: 'leg', lv: [2, 5], card: 'c1', make: (R) => {
        const t = R.pick(TRIPLES); const k = R.int(0, 1);
        const known = t[k], ans = t[1 - k];
        return { q: `빗변의 길이가 ${t[2]}이고 한 변의 길이가 ${known}인 직각삼각형의 나머지 한 변의 길이는?`, a: ans, wrong: [t[2] - known, t[2] + known, ans + 1], why: `$${known}^2+x^2=${t[2]}^2$ → $x^2=${t[2] ** 2}-${known ** 2}=${ans ** 2}$ → $x=${ans}$` };
      } },
      { id: 'is', lv: [3, 5], card: 'c2', make: (R) => {
        const t = R.pick(TRIPLES);
        const yes = R.chance(0.5);
        const s = yes ? t : [t[0], t[1], t[2] + R.int(1, 2)];
        return { q: `세 변의 길이가 ${s.join(', ')}인 삼각형은 직각삼각형일까요?`, correct: yes ? '직각삼각형이다' : '직각삼각형이 아니다', wrong: yes ? ['직각삼각형이 아니다', '예각삼각형이다'] : ['직각삼각형이다', '알 수 없다'], why: `가장 긴 변 ${s[2]}를 빗변으로 생각해요.\n$${s[0]}^2+${s[1]}^2=${s[0] ** 2 + s[1] ** 2}$, $${s[2]}^2=${s[2] ** 2}$ → ${yes ? '같으므로 직각삼각형' : '같지 않으므로 직각삼각형이 아니에요'}` };
      } },
    ],
  },
  {
    id: 'm2.pythapp',
    lesson: [
      { id: 'c1', t: '직사각형·정사각형의 대각선', b: T`가로 $a$, 세로 $b$인 직사각형의 대각선 $d=\sqrt{a^2+b^2}$

        예) 가로 12, 세로 5 → $d=13$

        한 변이 $a$인 정사각형의 대각선은 $a\sqrt2$` },
      { id: 'c2', t: '이등변삼각형의 높이와 넓이', b: T`이등변삼각형의 꼭지각에서 밑변에 **수선**을 그으면 밑변이 이등분되고 직각삼각형 두 개가 생겨요.

        두 변 $13,\ 13$, 밑변 $10$ → 밑변의 절반 $5$, 높이 $\sqrt{13^2-5^2}=12$
        넓이 $=\dfrac12\times10\times12=60$` },
      { id: 'c3', t: '좌표평면에서 두 점 사이의 거리', b: T`두 점 $A(x_1,\ y_1),\ B(x_2,\ y_2)$ 사이의 거리
        $$\overline{AB}=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}$$

        가로 $x_2-x_1$, 세로 $y_2-y_1$인 직각삼각형의 빗변이에요.` },
    ],
    gens: [
      { id: 'diag', lv: [1, 3], card: 'c1', make: (R) => {
        const t = R.pick(TRIPLES);
        return { q: `가로 ${t[0]}cm, 세로 ${t[1]}cm인 직사각형의 대각선의 길이는?`, a: t[2], unit: 'cm', wrong: [t[0] + t[1], t[2] + 1, t[1]], why: `$d^2=${t[0]}^2+${t[1]}^2=${t[2] ** 2}$ → $d=${t[2]}$` };
      } },
      { id: 'iso', lv: [3, 5], card: 'c2', make: (R) => {
        const t = R.pick(TRIPLES.slice(0, 6));
        // 변 t[2], t[2], 밑변 2 t[0] → 높이 t[1]
        const w = R.pick(['height', 'area']);
        const base = 2 * t[0];
        return { q: `두 변의 길이가 ${t[2]}, ${t[2]}이고 밑변의 길이가 ${base}인 이등변삼각형의 ${w === 'height' ? '높이' : '넓이'}는?`, a: w === 'height' ? t[1] : (base * t[1]) / 2, wrong: w === 'height' ? [t[0], t[2], t[1] + 1] : [base * t[1], t[0] * t[2], (base * t[1]) / 2 + 2], why: `밑변의 절반 $${t[0]}$, 빗변 $${t[2]}$인 직각삼각형에서 높이 $=\\sqrt{${t[2]}^2-${t[0]}^2}=${t[1]}$${w === 'area' ? `\n넓이 $=\\frac12\\times${base}\\times${t[1]}=${(base * t[1]) / 2}$` : ''}` };
      } },
      { id: 'dist', lv: [3, 5], card: 'c3', make: (R) => {
        const t = R.pick(TRIPLES.filter((x) => x[2] < 30));
        const x1 = R.nz(-4, 4), y1 = R.nz(-4, 4);
        const sx = R.pick([1, -1]), sy = R.pick([1, -1]);
        const x2 = x1 + sx * t[0], y2 = y1 + sy * t[1];
        return { q: `두 점 $A(${x1},\\ ${y1})$, $B(${x2},\\ ${y2})$ 사이의 거리는?`, a: t[2], wrong: [t[0] + t[1], t[2] + 1, Math.abs(t[1] - t[0])], why: `$\\sqrt{(${x2}-${paren(x1)})^2+(${y2}-${paren(y1)})^2}=\\sqrt{${t[0] ** 2}+${t[1] ** 2}}=${t[2]}$` };
      } },
    ],
  },

  // ───────────── 경우의 수와 확률 ─────────────
  {
    id: 'm2.cases',
    lesson: [
      { id: 'c1', t: '경우의 수와 합의 법칙', b: T`==경우의 수==는 어떤 일이 일어날 수 있는 **모든 가짓수**예요.

        ==합의 법칙==: 두 일이 **동시에 일어나지 않을 때**, 각각의 경우의 수를 **더해요.** ("또는")
        예) 주사위에서 2의 배수 또는 5의 배수: $3+1=4$가지(2,4,6,5)` },
      { id: 'c2', t: '곱의 법칙', b: T`두 일이 **잇달아 (동시에)** 일어날 때, 각각의 경우의 수를 **곱해요.** ("그리고")

        예) 상의 3가지, 하의 4가지 → 입는 방법 $3\times4=12$가지
        주사위 하나와 동전 하나 → $6\times2=12$가지` },
    ],
    gens: [
      { id: 'add', lv: [1, 2], card: 'c1', make: (R) => {
        const a = R.int(2, 9), b = R.int(2, 9);
        return { q: `서점에서 소설책 ${a}권과 시집 ${b}권 중 한 권만 사는 경우의 수는?`, a: a + b, unit: '가지', wrong: [a * b, a + b + 1, Math.abs(a - b)], why: `소설 또는 시 → 합의 법칙 $${a}+${b}=${a + b}$` };
      } },
      { id: 'mul', lv: [1, 3], card: 'c2', make: (R) => {
        const a = R.int(2, 6), b = R.int(2, 6), c = R.int(2, 4);
        if (R.chance(0.5)) return { q: `티셔츠 ${a}벌과 바지 ${b}벌이 있어요. 티셔츠와 바지를 각각 한 벌씩 골라 입는 방법은 모두 몇 가지일까요?`, a: a * b, unit: '가지', wrong: [a + b, a * b + 1, a * b * 2], why: `곱의 법칙: $${a}\\times${b}=${a * b}$` };
        return { q: `집에서 학교까지 가는 길이 ${a}가지, 학교에서 도서관까지 가는 길이 ${b}가지, 도서관에서 공원까지 ${c}가지예요. 집에서 공원까지 가는 방법은 모두 몇 가지일까요?`, a: a * b * c, unit: '가지', wrong: [a + b + c, a * b + c, a * b * c + a], why: `차례로 가야 하니까 곱의 법칙이에요. $${a}\\times${b}\\times${c}=${a * b * c}$` };
      } },
      { id: 'dice', lv: [2, 5], card: 'c1', make: (R, lv) => {
        const kind = R.pick(['sum', 'coin', 'both']);
        if (kind === 'sum') { const s = R.int(4, 10); const n = [...Array(6)].map((_, i) => i + 1).flatMap((a) => [...Array(6)].map((_, j) => [a, j + 1])).filter(([a, b]) => a + b === s).length; return { q: `서로 다른 두 주사위를 동시에 던질 때 나온 눈의 합이 ${s}인 경우의 수는?`, a: n, unit: '가지', wrong: [n + 1, n - 1 || 7, 6], why: `(눈의 수의 순서쌍) 중 합이 ${s}인 것을 세요. 총 $${n}$가지예요.` }; }
        if (kind === 'coin') { const c = R.int(2, 4); return { q: `동전 ${c}개를 동시에 던질 때 나오는 모든 경우의 수는?`, a: 2 ** c, unit: '가지', wrong: [2 * c, c * c, 2 ** c + 1], why: `각 동전마다 2가지이므로 $2^{${c}}=${2 ** c}$` }; }
        return { q: '주사위 한 개와 동전 한 개를 동시에 던질 때 나오는 모든 경우의 수는?', a: 12, unit: '가지', wrong: [8, 6, 36], why: '주사위 6가지 × 동전 2가지 = 12가지' };
      } },
    ],
  },
  {
    id: 'm2.arrange',
    lesson: [
      { id: 'c1', t: '한 줄로 세우기', b: T`$n$명을 한 줄로 세우는 경우의 수 $=n\times(n-1)\times\dots\times1=n!$ (팩토리얼)

        $3!=6,\ 4!=24,\ 5!=120$

        $n$명 중 $r$명을 뽑아 한 줄로 세우기: $n\times(n-1)\times\dots$ ($r$개 곱) $={}_nP_r$
        예) 5명 중 3명 → $5\times4\times3=60$` },
      { id: 'c2', t: '자연수 만들기', b: T`숫자 카드로 자연수를 만들 때
        - **0이 있으면** 맨 앞자리에 올 수 없어요.
        - 같은 숫자를 다시 쓸 수 있나 확인!

        예) 1, 2, 3으로 두 자리 정수: $3\times2=6$개
        0, 1, 2로 두 자리: 십의 자리는 0 제외 → $2\times2=4$개` },
      { id: 'c3', t: '대표 뽑기', b: T`- **자격이 다른** 대표(회장, 부회장): 순서가 있음 → $n\times(n-1)$
        - **자격이 같은** 대표 2명: 순서 없음 → $\dfrac{n\times(n-1)}{2}$
        - 자격이 같은 대표 3명: $\dfrac{n(n-1)(n-2)}{6}$` },
    ],
    gens: [
      { id: 'line', lv: [1, 3], card: 'c1', make: (R) => {
        const n = R.int(3, 6);
        if (R.chance(0.5)) return { q: `${n}명을 한 줄로 세우는 경우의 수는?`, a: fact(n), unit: '가지', wrong: [n * n, fact(n) + n, fact(n - 1)], why: `$${Array.from({ length: n }, (_, i) => n - i).join('\\times')}=${fact(n)}$` };
        const r = R.int(2, n - 1);
        return { q: `${n}명 중 ${r}명을 뽑아 한 줄로 세우는 경우의 수는?`, a: perm(n, r), unit: '가지', wrong: [comb(n, r), fact(n), perm(n, r) + n], why: `$${Array.from({ length: r }, (_, i) => n - i).join('\\times')}=${perm(n, r)}$` };
      } },
      { id: 'num', lv: [2, 5], card: 'c2', make: (R) => {
        const withZero = R.chance(0.5);
        const digs = withZero ? [0, 1, 2, 3] : [1, 2, 3, 4];
        const r = R.pick([2, 3]);
        const arr = (list, r) => (r === 0 ? [[]] : list.flatMap((d, i) => arr(list.filter((_, j) => j !== i), r - 1).map((rest) => [d, ...rest])));
        const cnt = arr(digs, r).filter((a) => a[0] !== 0).length;
        return { q: `숫자 ${digs.join(', ')}가 각각 적힌 카드 ${digs.length}장 중 ${r}장을 뽑아 만들 수 있는 ${r}자리 자연수는 모두 몇 개일까요?`, a: cnt, unit: '개', wrong: [perm(4, r), cnt + 2, perm(4, r) - 2].filter((x) => x !== cnt), why: withZero ? `맨 앞자리에는 0이 올 수 없어요.\n백(십)의 자리: 3가지, 나머지는 남은 ${digs.length - 1}장에서 ${r - 1}장 순서대로 → $${cnt}$개` : `${perm(4, r)}개 (0이 없으니 모두 가능)`.replace(/^/, '') };
      } },
      { id: 'rep', lv: [2, 5], card: 'c3', make: (R) => {
        const n = R.int(4, 8);
        if (R.chance(0.5)) return { q: `${n}명 중 회장 1명과 부회장 1명을 뽑는 경우의 수는?`, a: n * (n - 1), unit: '가지', wrong: [(n * (n - 1)) / 2, n * n, n + n - 1], why: `자격이 다르니 순서가 있어요. $${n}\\times${n - 1}=${n * (n - 1)}$` };
        return { q: `${n}명 중 대표 2명을 뽑는 경우의 수는? (자격은 같다)`, a: (n * (n - 1)) / 2, unit: '가지', wrong: [n * (n - 1), n * 2, n * n], why: `$\\dfrac{${n}\\times${n - 1}}{2}=${(n * (n - 1)) / 2}$ (같은 두 사람을 순서만 바꿔 두 번 센 걸 나눠요)` };
      } },
    ],
  },
  {
    id: 'm2.prob',
    lesson: [
      { id: 'c1', t: '확률의 뜻', b: T`$$(\text{확률})=\dfrac{(\text{어떤 일이 일어나는 경우의 수})}{(\text{일어날 수 있는 모든 경우의 수})}$$

        단, 모든 경우가 **같은 정도로** 일어난다고 볼 때예요.
        예) 주사위에서 짝수가 나올 확률 $=\dfrac36=\dfrac12$` },
      { id: 'c2', t: '확률의 성질', b: T`- $0\le p\le1$
        - 반드시 일어나는 일의 확률 $=1$, 절대 일어나지 않는 일의 확률 $=0$
        - ==여사건==: 어떤 일이 **일어나지 않는** 경우
          $$(\text{어떤 일이 일어나지 않을 확률})=1-(\text{일어날 확률})$$

        "적어도 하나는 ~" 형태는 **여사건**으로 풀면 쉬워요.` },
    ],
    gens: [
      { id: 'basic', lv: [1, 3], card: 'c1', make: (R) => {
        const kind = R.pick(['dice', 'ball', 'card']);
        if (kind === 'dice') { const goal = R.pick([['짝수', 3], ['3의 배수', 2], ['소수', 3], ['4 이상', 3], ['5 이하', 5]]); return { q: `주사위 한 개를 던질 때 ${goal[0]}의 눈이 나올 확률은?`, a: fr(goal[1], 6), wrong: [fr(goal[1], 3), fr(1, 6), fr(goal[1] + 1, 6)], why: `전체 6가지 중 ${goal[0]}[은/는] ${goal[1]}가지예요. $\\dfrac{${goal[1]}}{6}$` }; }
        if (kind === 'ball') { const r = R.int(2, 6), w = R.int(2, 6), b = R.int(1, 5); const t = r + w + b; return { q: `빨간 공 ${r}개, 흰 공 ${w}개, 파란 공 ${b}개가 들어 있는 주머니에서 공 한 개를 꺼낼 때 빨간 공일 확률은?`, a: fr(r, t), wrong: [fr(r, w), fr(1, t), fr(r + 1, t)], why: `전체 $${t}$개 중 빨간 공 $${r}$개: $\\dfrac{${r}}{${t}}$` }; }
        const n = R.int(10, 20); const m = R.pick([2, 3, 4, 5]);
        const cnt = Math.floor(n / m);
        return { q: `1부터 ${n}까지의 수가 각각 적힌 ${n}장의 카드에서 한 장을 뽑을 때 ${m}의 배수일 확률은?`, a: fr(cnt, n), wrong: [fr(cnt + 1, n), fr(1, n), fr(cnt, n - 1)], why: `${m}의 배수는 ${cnt}개: $\\dfrac{${cnt}}{${n}}$` };
      } },
      { id: 'comp', lv: [2, 5], card: 'c2', make: (R) => {
        const kind = R.pick(['rain', 'coin', 'prop']);
        if (kind === 'rain') { const p = R.pick([[1, 5], [3, 10], [2, 7], [3, 8], [5, 12]]); return { q: `내일 비가 올 확률이 $\\dfrac{${p[0]}}{${p[1]}}$일 때, 비가 오지 않을 확률은?`, a: fr(p[1] - p[0], p[1]), wrong: [fr(p[0], p[1]), fr(p[1], p[0]), fr(1, p[1])], why: `$1-\\dfrac{${p[0]}}{${p[1]}}=\\dfrac{${p[1] - p[0]}}{${p[1]}}$` }; }
        if (kind === 'coin') { const c = R.int(2, 4); return { q: `동전 ${c}개를 동시에 던질 때 **적어도 하나는 앞면**이 나올 확률은?`, a: fr(2 ** c - 1, 2 ** c), wrong: [fr(1, 2 ** c), fr(1, 2), fr(2 ** c - 2, 2 ** c)], why: `여사건(모두 뒷면)의 확률은 $\\dfrac{1}{${2 ** c}}$\n$1-\\dfrac{1}{${2 ** c}}=\\dfrac{${2 ** c - 1}}{${2 ** c}}$` }; }
        return { q: '다음 중 확률이 될 수 **없는** 값은?', correct: '$\\dfrac{7}{5}$', wrong: ['$0$', '$\\dfrac{3}{4}$', '$1$'], why: '확률은 0 이상 1 이하의 값이에요. $\\frac75>1$이라 확률이 될 수 없어요.' };
      } },
    ],
  },
  {
    id: 'm2.probcalc',
    lesson: [
      { id: 'c1', t: '확률의 덧셈 (또는)', b: T`두 사건 A, B가 **동시에 일어나지 않을 때**
        $$P(A\text{ 또는 }B)=P(A)+P(B)$$

        예) 주사위에서 1 또는 6이 나올 확률 $=\dfrac16+\dfrac16=\dfrac13$` },
      { id: 'c2', t: '확률의 곱셈 (그리고)', b: T`두 사건 A, B가 **서로 영향을 주지 않을 때**
        $$P(A\text{ 그리고 }B)=P(A)\times P(B)$$

        예) 동전 앞면 $\dfrac12$, 주사위 6 $\dfrac16$ → 둘 다 $\dfrac12\times\dfrac16=\dfrac1{12}$` },
      { id: 'c3', t: '꺼낸 것을 도로 넣는지 확인', b: T`- **꺼낸 것을 도로 넣는다(복원)**: 두 번째에도 전체 개수가 그대로
        - **도로 넣지 않는다(비복원)**: 두 번째는 전체 개수가 1 줄어요.

        예) 흰 3, 검은 2 → 흰, 흰 (비복원): $\dfrac35\times\dfrac24=\dfrac{3}{10}$` },
    ],
    gens: [
      { id: 'or', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.int(1, 4), b = R.int(1, 4), t = a + b + R.int(2, 5);
        return { q: `주머니에 전체 ${t}개의 구슬이 있고 빨간 구슬이 ${a}개, 파란 구슬이 ${b}개 있어요. 한 개를 꺼낼 때 빨간 구슬 또는 파란 구슬일 확률은?`, a: fr(a + b, t), wrong: [fr(a * b, t * t), fr(a, t), fr(a + b, t + 1)], why: `동시에 일어날 수 없는 사건이라 확률을 더해요.\n$\\dfrac{${a}}{${t}}+\\dfrac{${b}}{${t}}=\\dfrac{${a + b}}{${t}}$` };
      } },
      { id: 'and', lv: [2, 4], card: 'c2', make: (R) => {
        const kind = R.pick(['coin', 'ball']);
        if (kind === 'coin') { const c = R.int(2, 4); return { q: `동전 ${c}개를 던질 때 모두 앞면이 나올 확률은?`, a: fr(1, 2 ** c), wrong: [fr(1, 2 * c), fr(c, 2 ** c), fr(1, c)], why: `각각 $\\dfrac12$이므로 $\\left(\\dfrac12\\right)^{${c}}=\\dfrac1{${2 ** c}}$` }; }
        const p = R.pick([[1, 2], [1, 3], [2, 3], [3, 4]]), q = R.pick([[1, 5], [2, 5], [1, 4], [3, 5]]);
        const res = fr(p[0] * q[0], p[1] * q[1]);
        return { q: `A가 문제를 맞힐 확률이 $\\dfrac{${p[0]}}{${p[1]}}$, B가 맞힐 확률이 $\\dfrac{${q[0]}}{${q[1]}}$일 때 두 사람 모두 맞힐 확률은?`, a: res, wrong: [fr(p[0] * q[1] + q[0] * p[1], p[1] * q[1]), fr(p[0] + q[0], p[1] + q[1]), fr(p[0] * q[0], p[1])], why: `서로 영향이 없으므로 곱해요.\n$\\dfrac{${p[0]}}{${p[1]}}\\times\\dfrac{${q[0]}}{${q[1]}}=\\dfrac{${p[0] * q[0]}}{${p[1] * q[1]}}${res.d !== p[1] * q[1] ? `=\\dfrac{${res.n}}{${res.d}}` : ''}$` };
      } },
      { id: 'draw', lv: [3, 5], card: 'c3', make: (R) => {
        const w = R.int(2, 5), b = R.int(2, 4), t = w + b;
        const back = R.chance(0.5);
        const res = back ? fr(w * w, t * t) : fr(w * (w - 1), t * (t - 1));
        return { q: `흰 공 ${w}개, 검은 공 ${b}개가 들어 있는 주머니에서 공을 한 개씩 두 번 꺼내요(${back ? '꺼낸 공은 다시 넣는다' : '꺼낸 공은 다시 넣지 않는다'}). 두 번 모두 흰 공일 확률은?`, a: res, wrong: [fr(w * w, t * t) === res ? fr(w * (w - 1), t * (t - 1)) : fr(w * w, t * t), fr(w, t), fr(2 * w, t + t)], why: back ? `두 번 모두 전체가 ${t}개: $\\dfrac{${w}}{${t}}\\times\\dfrac{${w}}{${t}}$` : `두 번째는 전체 ${t - 1}개, 흰 공 ${w - 1}개: $\\dfrac{${w}}{${t}}\\times\\dfrac{${w - 1}}{${t - 1}}$` };
      } },
    ],
  },
];
