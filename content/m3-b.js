// 중3 ② 이차함수 · 삼각비 · 원의 성질 · 통계
import { gcd, fr, linTex, polyTex, paren, pm } from '../js/lib.js';
import { coordPlane, circleFig, svgRaw } from '../js/fig.js';

const T = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const uniq = (arr, not) => [...new Set(arr.map(String))].filter((x) => x !== String(not));
const quad = (a, b, c) => polyTex([a, b, c]);
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15]];
const frT = (n, d) => { const g = gcd(n, d); return `\\dfrac{${n / g}}{${d / g}}`; };
// a(x-p)^2+q 꼴 문자열
const vform = (a, p, q) => `${a === 1 ? '' : a === -1 ? '-' : a}(x${pm(-p)})^2${q === 0 ? '' : pm(q)}`.replace('(x+0)', 'x');
const vf = (a, p, q) => (p === 0 ? `${a === 1 ? '' : a === -1 ? '-' : a}x^2${q === 0 ? '' : pm(q)}` : vform(a, p, q));
const aTex = (a) => (a === 1 ? '' : a === -1 ? '-' : `${a}`);

export default [
  // ───────────── 이차함수와 그래프 ─────────────
  {
    id: 'm3.quad1',
    lesson: [
      { id: 'c1', t: '이차함수란?', b: T`$y=ax^2+bx+c$ ($a\ne0$) 꼴로 나타내지는 함수를 ==이차함수==라 해요.

        - $y=2x^2-3$ ⭕ (이차함수)
        - $y=3x+1$ ❌ (일차함수)
        - $y=x(x+2)=x^2+2x$ ⭕ (전개해서 확인!)` },
      { id: 'c2', t: 'y = ax² 의 그래프', b: T`원점을 꼭짓점으로 하는 **포물선**이에요.

        - $a>0$: 아래로 볼록 (U자). $a<0$: 위로 볼록 (∩자)
        - $|a|$가 클수록 폭이 **좁아져요** (뾰족)
        - $y$축에 대칭 → 축: $y$축 ($x=0$), 꼭짓점: $(0,0)$
        - $y=ax^2$과 $y=-ax^2$은 $x$축에 대칭` },
    ],
    gens: [
      { id: 'is', lv: [1, 3], card: 'c1', make: (R) => {
        const yes = ['$y=x^2$', '$y=2x^2-3$', '$y=x(x+2)$', '$y=-x^2+5x$', '$y=(x-1)^2$'];
        const no = ['$y=3x+1$', '$y=\\dfrac{2}{x}$', '$y=x(x+2)-x^2$', '$y=(x+1)^2-x^2$', '$y=5$'];
        if (R.chance(0.5)) return { q: '다음 중 $y$가 $x$에 대한 이차함수인 것은?', correct: R.pick(yes), wrong: R.sample(no, 3), why: '우변을 전개해서 $ax^2+bx+c$ ($a\\ne0$) 꼴이 되는지 확인해요. $y=x(x+2)-x^2=2x$, $y=(x+1)^2-x^2=2x+1$은 일차함수예요.' };
        return { q: '다음 중 $y$가 $x$에 대한 이차함수가 **아닌** 것은?', correct: R.pick(no), wrong: R.sample(yes, 3), why: '전개해서 $x^2$ 항이 사라지면 이차함수가 아니에요.' };
      } },
      { id: 'open', lv: [1, 3], card: 'c2', make: (R) => {
        const a = R.nz(-4, 4);
        return { q: `$y=${aTex(a)}x^2$의 그래프의 모양은?`, correct: a > 0 ? '아래로 볼록' : '위로 볼록', wrong: [a > 0 ? '위로 볼록' : '아래로 볼록', '직선', '꼭짓점이 $(0,1)$'], why: `$a=${a}$[이라서/라서] ${a > 0 ? '$a>0$ → 아래로 볼록' : '$a<0$ → 위로 볼록'}이에요.` };
      } },
      { id: 'wide', lv: [2, 4], card: 'c2', make: (R) => {
        const xs = R.sample([-4, -3, -2, -1, 1, 2, 3, 4], 3);
        const widest = xs.reduce((m, v) => (Math.abs(v) < Math.abs(m) ? v : m));
        const tex = (v) => `$y=${aTex(v)}x^2$`;
        if (new Set(xs.map(Math.abs)).size < 3) return { q: '$y=x^2,\\ y=2x^2,\\ y=3x^2$ 중 폭이 가장 좁은 것은?', correct: '$y=3x^2$', wrong: ['$y=x^2$', '$y=2x^2$'], why: '$|a|$가 클수록 폭이 좁아요.' };
        return { q: `${xs.map(tex).join(', ')} 중 그래프의 폭이 가장 **넓은** 것은?`, correct: tex(widest), wrong: xs.filter((v) => v !== widest).map(tex), why: `$|a|$가 작을수록 폭이 넓어요. $|a|$가 가장 작은 ${tex(widest)}` };
      } },
      { id: 'pt', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.nz(-3, 3), x = R.nz(-4, 4);
        return { q: `$y=${aTex(a)}x^2$의 그래프가 점 $(${x},\\ k)$를 지날 때 $k$의 값은?`, a: a * x * x, wrong: [a * x, -a * x * x, a * x * x + a], why: `$x=${x}$[을/를] 대입: $y=${paren(a)}\\times${paren(x)}^2=${a * x * x}$` };
      } },
      { id: 'graph', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.pick([-2, -1, 1, 2]); const x0 = R.pick([1, 2]);
        const fig = coordPlane({ xmin: -4, xmax: 4, ymin: -8, ymax: 8, w: 260, curves: [{ fn: (x) => a * x * x }], pts: [{ x: x0, y: a * x0 * x0, label: `(${x0}, ${a * x0 * x0})` }] });
        return { q: '그래프가 $y=ax^2$일 때, 상수 $a$의 값은?', fig, a, wrong: [-a, a * 2, a + 1].filter((v) => v !== a), why: `점 $(${x0},\\ ${a * x0 * x0})$[을/를] 지나므로 $${a * x0 * x0}=a\\times${x0}^2$ → $a=${a}$` };
      } },
    ],
  },
  {
    id: 'm3.quad2',
    anchor: true,
    lesson: [
      { id: 'c1', t: '평행이동', b: T`$y=ax^2$을 $x$축으로 $p$, $y$축으로 $q$만큼 평행이동하면
        $$y=a(x-p)^2+q$$

        - 꼭짓점: $(p,\ q)$
        - 축: 직선 $x=p$
        - ⚠️ $x$ 쪽은 **부호가 반대**로 들어가요: $(x-3)^2$이면 $p=+3$` },
      { id: 'c2', t: '꼭짓점과 축 읽기', b: T`$y=2(x+1)^2-5$ → $y=2(x-(-1))^2+(-5)$
        꼭짓점 $(-1,\ -5)$, 축 $x=-1$

        - $a>0$: 아래로 볼록 → 꼭짓점이 **최솟값**
        - $a<0$: 위로 볼록 → 꼭짓점이 **최댓값**
        - $y$절편: $x=0$ 대입` },
    ],
    gens: [
      { id: 'move', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.pick([1, 2, 3, -1, -2]), p = R.nz(-4, 4), q = R.nz(-5, 5);
        const cor = `$y=${vf(a, p, q)}$`;
        const wr = [vf(a, -p, q), vf(a, p, -q), vf(a, -p, -q)].map((s) => `$y=${s}$`);
        return { q: `$y=${aTex(a)}x^2$의 그래프를 $x$축 방향으로 $${p}$, $y$축 방향으로 $${q}$만큼 평행이동한 그래프의 식은?`, correct: cor, wrong: uniq(wr, cor), why: `$y=a(x-p)^2+q$ 에 $p=${p}$, $q=${q}$ 대입 → ${cor}\n($x$ 쪽은 $x-p$로 부호가 반대!)` };
      } },
      { id: 'vertex', lv: [1, 4], card: 'c2', make: (R) => {
        const a = R.pick([1, 2, 3, -1, -2, -3]), p = R.nz(-5, 5), q = R.int(-6, 6);
        const ask = R.pick(['v', 'axis', 'xp']);
        const f = `$y=${vf(a, p, q)}$`;
        if (ask === 'v') return { q: `${f}의 꼭짓점의 좌표는?`, correct: `$(${p},\\ ${q})$`, wrong: uniq([`$(${-p},\\ ${q})$`, `$(${p},\\ ${-q})$`, `$(${-p},\\ ${-q})$`], `$(${p},\\ ${q})$`).map(String), why: `$y=a(x-p)^2+q$의 꼭짓점은 $(p,\\ q)$. $(x${pm(-p)})$이므로 $p=${p}$, $q=${q}$` };
        if (ask === 'axis') return { q: `${f}의 축의 방정식은?`, correct: `$x=${p}$`, wrong: [`$x=${-p}$`, `$y=${q}$`, `$y=${-q}$`].filter((s) => s !== `$x=${p}$`), why: `축은 꼭짓점을 지나는 수직선 $x=p=${p}$` };
        return { q: `${f}의 꼭짓점의 $x$좌표는?`, a: p, wrong: [-p, q, -q], why: `$(x${pm(-p)})^2$ → $x=${p}$일 때 괄호 안이 0이에요.` };
      } },
      { id: 'maxmin', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.pick([1, 2, 3, -1, -2, -3]), p = R.nz(-5, 5), q = R.nz(-6, 6);
        return { q: `$y=${vf(a, p, q)}$의 ${a > 0 ? '최솟값' : '최댓값'}은?`, a: q, wrong: [-q, p, -p].filter((v) => v !== q), why: `$a=${a}$${a > 0 ? '>0이라 아래로 볼록 → 꼭짓점에서 최솟값' : '<0이라 위로 볼록 → 꼭짓점에서 최댓값'}. 꼭짓점의 $y$좌표 $${q}$` };
      } },
      { id: 'yint', lv: [3, 5], card: 'c2', make: (R) => {
        const a = R.pick([1, 2, -1, -2]), p = R.nz(-4, 4), q = R.nz(-5, 5);
        const v = a * p * p + q;
        return { q: `$y=${vf(a, p, q)}$의 그래프가 $y$축과 만나는 점의 $y$좌표는?`, a: v, wrong: [q, a * p * p, v + 1, -v].filter((x) => x !== v), why: `$x=0$ 대입: $y=${aTex(a)}(0${pm(-p)})^2${pm(q)}=${a * p * p}${pm(q)}=${v}$` };
      } },
    ],
  },
  {
    id: 'm3.quad3',
    lesson: [
      { id: 'c1', t: 'y = ax²+bx+c를 꼭짓점 꼴로', b: T`**완전제곱식**으로 고쳐요.

        $y=x^2-4x+5$
        $=(x^2-4x+4)-4+5$
        $=(x-2)^2+1$ → 꼭짓점 $(2,\ 1)$

        $a\ne1$이면 $a$로 먼저 묶어요: $y=2x^2+8x+3=2(x^2+4x)+3=2(x+2)^2-5$` },
      { id: 'c2', t: '꼭짓점 공식 & 절편', b: T`$y=ax^2+bx+c$에서
        - 축: $x=-\dfrac{b}{2a}$
        - $y$절편: $c$
        - $x$절편: $ax^2+bx+c=0$의 해 (판별식 $D>0$이면 2개, $D=0$이면 1개, $D<0$이면 없음)

        $a$, $b$의 부호: 축이 $y$축 **오른쪽**이면 $a,b$가 **다른 부호**, 왼쪽이면 **같은 부호**` },
    ],
    gens: [
      { id: 'tovertex', lv: [1, 4], card: 'c1', make: (R) => {
        const p = R.nz(-5, 5), q = R.nz(-6, 6); const a = R.pick([1, 1, -1, 2]);
        // a(x-p)^2+q 전개
        const B = -2 * a * p, Cc = a * p * p + q;
        const cor = `(${p},\\ ${q})`;
        return { q: `$y=${quad(a, B, Cc)}$의 꼭짓점의 좌표는?`, correct: `$${cor}$`, wrong: [`$(${-p},\\ ${q})$`, `$(${p},\\ ${-q})$`, `$(${p},\\ ${Cc})$`].filter((s) => s !== `$${cor}$`), why: `$y=${vf(a, p, q)}$로 고치면 꼭짓점은 $${cor}$` };
      } },
      { id: 'axis', lv: [2, 5], card: 'c2', make: (R) => {
        const p = R.nz(-5, 5), a = R.pick([1, 2, -1, -2, 3]);
        const B = -2 * a * p, Cc = R.nz(-5, 5);
        return { q: `$y=${quad(a, B, Cc)}$의 축의 방정식은 $x=k$예요. $k$의 값은?`, a: p, wrong: [-p, B, p + 1], why: `축 $x=-\\dfrac{b}{2a}=-\\dfrac{${B}}{${2 * a}}=${p}$` };
      } },
      { id: 'int', lv: [2, 5], card: 'c2', make: (R) => {
        const a = R.pick([1, 2, -1, -2]), B = R.nz(-6, 6), c = R.nz(-8, 8);
        const kind = R.pick(['y', 'xcount']);
        if (kind === 'y') return { q: `$y=${quad(a, B, c)}$의 그래프의 $y$절편은?`, a: c, wrong: [-c, B, a], why: '$x=0$을 대입하면 $y=c$예요.' };
        const D = B * B - 4 * a * c; const n = D > 0 ? 2 : D === 0 ? 1 : 0;
        return { q: `$y=${quad(a, B, c)}$의 그래프가 $x$축과 만나는 점은 몇 개일까요?`, a: n, unit: '개', wrong: [0, 1, 2].filter((v) => v !== n), why: `$D=${paren(B)}^2-4\\times${paren(a)}\\times${paren(c)}=${D}$ → ${D > 0 ? '$D>0$이라 2개' : D === 0 ? '$D=0$이라 1개' : '$D<0$이라 0개'}` };
      } },
      { id: 'sign', lv: [4, 5], card: 'c2', make: (R) => {
        const items = [
          ['아래로 볼록하고 $y$축과 $y$절편이 양수인 포물선 $y=ax^2+bx+c$에서 $a,\\ c$의 부호는?', '$a>0,\\ c>0$', ['$a>0,\\ c<0$', '$a<0,\\ c>0$', '$a<0,\\ c<0$'], '아래로 볼록 → $a>0$, $y$절편이 양수 → $c>0$'],
          ['위로 볼록하고 $y$축과 음수에서 만나는 포물선 $y=ax^2+bx+c$에서 $a,\\ c$의 부호는?', '$a<0,\\ c<0$', ['$a>0,\\ c>0$', '$a>0,\\ c<0$', '$a<0,\\ c>0$'], '위로 볼록 → $a<0$, $y$절편이 음수 → $c<0$'],
        ];
        const it = R.pick(items); return { q: it[0], correct: it[1], wrong: it[2], why: it[3] };
      } },
    ],
  },
  {
    id: 'm3.quadfind',
    lesson: [
      { id: 'c1', t: '꼭짓점과 한 점이 주어질 때', b: T`꼭짓점 $(p,\ q)$와 지나는 점이 주어지면
        $y=a(x-p)^2+q$ 에 점을 대입해 $a$를 구해요.

        예) 꼭짓점 $(1,\ 2)$, 점 $(3,\ 10)$ 지남
        $10=a(3-1)^2+2$ → $4a=8$ → $a=2$ → $y=2(x-1)^2+2$` },
      { id: 'c2', t: '세 점 또는 $x$절편이 주어질 때', b: T`- **$x$절편이 $\alpha,\ \beta$**이면 $y=a(x-\alpha)(x-\beta)$
        - 세 점이 주어지면 $y=ax^2+bx+c$에 대입해 연립방정식으로 $a,b,c$ 구하기

        예) $x$절편이 $-1,\ 3$이고 점 $(0,\ -6)$을 지남
        $y=a(x+1)(x-3)$, $x=0$: $-6=-3a$ → $a=2$` },
      { id: 'c3', t: '최댓값·최솟값 활용', b: T`꼭짓점 꼴로 고쳐서 **꼭짓점의 $y$좌표**가 최댓값/최솟값이에요.

        예) 둘레가 $20$m인 직사각형의 가로를 $x$라 하면 세로는 $10-x$ → 넓이 $y=x(10-x)=-(x-5)^2+25$ → $x=5$일 때 **최대 25**` },
    ],
    gens: [
      { id: 'vp', lv: [1, 4], card: 'c1', make: (R) => {
        const p = R.nz(-3, 3), q = R.nz(-4, 4), a = R.pick([1, 2, 3, -1, -2]), x1 = p + R.pick([1, 2, -1, -2]);
        const y1 = a * (x1 - p) ** 2 + q;
        return { q: `꼭짓점이 $(${p},\\ ${q})$이고 점 $(${x1},\\ ${y1})$을 지나는 이차함수 $y=a(x-p)^2+q$의 $a$의 값은?`.replace('(x-p)', '(x-p)'), a, wrong: [-a, a + 1, y1 - q].filter((v) => v !== a), why: `$${y1}=a(${x1}${pm(-p)})^2${pm(q)}$ → $${y1 - q}=${(x1 - p) ** 2}a$ → $a=${a}$` };
      } },
      { id: 'xint', lv: [2, 5], card: 'c2', make: (R) => {
        const al = R.nz(-4, 4); let be = R.nz(-4, 4); if (be === al) be = al + 2;
        const a = R.pick([1, 2, -1, -2]);
        const y0 = a * al * be; // x=0 대입
        return { q: `$x$절편이 $${al},\\ ${be}$이고 점 $(0,\\ ${y0})$을 지나는 이차함수 $y=a(x${pm(-al)})(x${pm(-be)})$의 $a$의 값은?`, a, wrong: [-a, a * 2, y0].filter((v) => v !== a), why: `$x=0$ 대입: $${y0}=a\\times${paren(-al)}\\times${paren(-be)}=${al * be}a$ → $a=${a}$` };
      } },
      { id: 'max', lv: [3, 5], card: 'c3', make: (R) => {
        const s = R.pick([8, 10, 12, 14, 16, 20]); const h = s / 2;
        return { q: `둘레가 $${s}$m인 직사각형의 넓이가 가장 클 때의 넓이(m²)는?`, a: h * h, unit: 'm²', wrong: [h * (h - 1), s, h * h * 2], why: `가로 $x$, 세로 $${h}-x$ → $y=x(${h}-x)=-(x-${h / 2})^2+${h * h / 4}$ ... 가로=세로=${h}/2일 때가 아니라 한 변이 $${h}$ 둘레의 절반이므로 정사각형(한 변 $${s / 4}$)일 때 최대 넓이 $${(s / 4) ** 2}$`.slice(0, 0) + `둘레가 일정할 때는 정사각형일 때 넓이가 최대예요. 한 변 $${s / 4}$m → 넓이 ${(s / 4) ** 2}` };
      } },
    ].filter((g) => g.id !== 'max').concat([
      { id: 'max2', lv: [3, 5], card: 'c3', make: (R) => {
        const k = R.pick([2, 4, 6, 8, 10]); // 가로+세로 = k*? : x(2k - x) 형태
        const s = 2 * k; // 가로+세로 합
        return { q: `합이 $${s}$인 두 수 $x,\\ ${s}-x$의 곱의 최댓값은?`, a: k * k, wrong: [k * (k - 1), s, k * k + k], why: `$y=x(${s}-x)=-(x-${k})^2+${k * k}$ → $x=${k}$일 때 최대 $${k * k}$` };
      } },
    ]),
  },

  // ───────────── 삼각비 ─────────────
  {
    id: 'm3.trig',
    lesson: [
      { id: 'c1', t: '삼각비의 정의', b: T`직각삼각형 $ABC$ ($\angle C=90°$)에서 $\angle A$를 기준으로

        - $\sin A=\dfrac{(\text{높이})}{(\text{빗변})}$
        - $\cos A=\dfrac{(\text{밑변})}{(\text{빗변})}$
        - $\tan A=\dfrac{(\text{높이})}{(\text{밑변})}$

        **기준각에 따라 높이·밑변이 바뀌어요!** 기준각 맞은편 변이 높이, 기준각에 닿아 있는 변(빗변 아님)이 밑변.
        기억법: sin = ㄴ(높이/빗변), cos = ㅁ... 필기체 s, c, t의 획 순서` },
      { id: 'c2', t: '삼각비의 값 구하기', b: T`피타고라스 정리로 모르는 변을 먼저 구해요.

        $3,\ 4,\ 5$ 직각삼각형에서 $\angle A$의 맞은편이 $3$, 밑변이 $4$:
        $\sin A=\dfrac35,\ \cos A=\dfrac45,\ \tan A=\dfrac34$` },
    ],
    gens: [
      { id: 'val', lv: [1, 4], card: 'c1', make: (R) => {
        const [a, b, c] = R.pick(TRIPLES); // a: 높이, b: 밑변, c: 빗변 (기준각 A)
        const swap = R.chance(0.5);
        const h = swap ? b : a, base = swap ? a : b;
        const kind = R.pick(['sin', 'cos', 'tan']);
        const num = kind === 'sin' ? h : kind === 'cos' ? base : h, den = kind === 'tan' ? base : c;
        const cor = `$${frT(num, den)}$`;
        const others = uniq([`$${frT(base, c)}$`, `$${frT(h, c)}$`, `$${frT(h, base)}$`, `$${frT(base, h)}$`, `$${frT(c, h)}$`], cor);
        const fig = svgRaw(240, 160, `<polygon class="f-poly" points="30,130 190,130 190,${130 - 160 * (h / base) > 20 ? 130 - 160 * (h / base) : 40}"/><text class="f-name" x="14" y="136">A</text><text class="f-name" x="200" y="136">C</text><text class="f-name" x="200" y="${(130 - 160 * (h / base) > 20 ? 130 - 160 * (h / base) : 40) - 6}">B</text><text class="f-txt" x="110" y="146">${base}</text><text class="f-txt" x="206" y="90">${h}</text>`);
        return { q: `직각삼각형 $ABC$ ($\\angle C=90°$)에서 $\\overline{AC}=${base}$, $\\overline{BC}=${h}$, $\\overline{AB}=${c}$일 때 $\\${kind}\\,A$의 값은?`, fig, correct: cor, wrong: others.slice(0, 3), why: `$\\angle A$ 기준: 높이 $\\overline{BC}=${h}$, 밑변 $\\overline{AC}=${base}$, 빗변 $\\overline{AB}=${c}$\n$\\${kind}\\,A=${frT(num, den)}$` };
      } },
      { id: 'miss', lv: [3, 5], card: 'c2', make: (R) => {
        const [a, b, c] = R.pick(TRIPLES);
        return { q: `직각삼각형에서 $\\sin A=${frT(a, c)}$일 때 $\\cos A$의 값은? ($0°<A<90°$)`, correct: `$${frT(b, c)}$`, wrong: [`$${frT(a, b)}$`, `$${frT(c, a)}$`, `$${frT(b, a)}$`], why: `빗변 $${c}$, 높이 $${a}$로 놓으면 밑변은 $\\sqrt{${c}^2-${a}^2}=${b}$ → $\\cos A=${frT(b, c)}$` };
      } },
      { id: 'side', lv: [2, 5], card: 'c2', make: (R) => {
        const [a, b, c] = R.pick(TRIPLES);
        return { q: `직각삼각형에서 $\\tan A=${frT(a, b)}$이고 밑변이 $${b}$일 때 높이는? (밑변·높이가 간단한 비율 그대로)`.replace(' (밑변·높이가 간단한 비율 그대로)', ''), a, wrong: [b, c, a + b], why: `$\\tan A=\\dfrac{\\text{높이}}{\\text{밑변}}=\\dfrac{x}{${b}}=${frT(a, b)}$ → $x=${a}$` };
      } },
    ],
  },
  {
    id: 'm3.trigspecial',
    anchor: true,
    lesson: [
      { id: 'c1', t: '특수각의 삼각비', b: T`| $A$ | $30°$ | $45°$ | $60°$ |
        |---|---|---|---|
        | $\sin A$ | $\dfrac12$ | $\dfrac{\sqrt2}{2}$ | $\dfrac{\sqrt3}{2}$ |
        | $\cos A$ | $\dfrac{\sqrt3}{2}$ | $\dfrac{\sqrt2}{2}$ | $\dfrac12$ |
        | $\tan A$ | $\dfrac{\sqrt3}{3}$ | $1$ | $\sqrt3$ |

        반드시 **외워두세요**. 변의 비로 기억하면 쉬워요:
        - $30°,60°,90°$ 삼각형: 변의 비 $1:\sqrt3:2$
        - $45°,45°,90°$ 삼각형: 변의 비 $1:1:\sqrt2$` },
      { id: 'c2', t: '0°와 90°의 삼각비', b: T`- $\sin0°=0,\ \cos0°=1,\ \tan0°=0$
        - $\sin90°=1,\ \cos90°=0$ ($\tan90°$는 정의되지 않아요)

        $\sin A$와 $\cos A$는 값이 $0\sim1$ 사이. $\tan A$는 $A$가 커질수록 커져요.` },
    ],
    gens: [
      { id: 'table', lv: [1, 3], card: 'c1', make: (R) => {
        const T3 = { sin: { 30: '\\dfrac{1}{2}', 45: '\\dfrac{\\sqrt{2}}{2}', 60: '\\dfrac{\\sqrt{3}}{2}' }, cos: { 30: '\\dfrac{\\sqrt{3}}{2}', 45: '\\dfrac{\\sqrt{2}}{2}', 60: '\\dfrac{1}{2}' }, tan: { 30: '\\dfrac{\\sqrt{3}}{3}', 45: '1', 60: '\\sqrt{3}' } };
        const f = R.pick(['sin', 'cos', 'tan']), ang = R.pick([30, 45, 60]);
        const cor = `$${T3[f][ang]}$`;
        const pool = uniq(['\\dfrac{1}{2}', '\\dfrac{\\sqrt{2}}{2}', '\\dfrac{\\sqrt{3}}{2}', '\\dfrac{\\sqrt{3}}{3}', '1', '\\sqrt{3}'].map((s) => `$${s}$`), cor);
        return { q: `$\\${f}\\,${ang}°$의 값은?`, correct: cor, wrong: R.sample(pool, 3), why: `특수각 표: $\\${f}\\,${ang}°=${T3[f][ang]}$` };
      } },
      { id: 'calc', lv: [3, 5], card: 'c1', make: (R) => {
        const kind = R.pick([0, 1, 2]);
        if (kind === 0) return { q: '$\\sin30°+\\cos60°$의 값은?', a: 1, wrong: [0, 2, '1/4'].map((v) => (v === '1/4' ? fr(1, 4) : v)), why: '$\\dfrac12+\\dfrac12=1$' };
        if (kind === 1) return { q: '$\\tan45°\\times\\sin90°+\\cos0°$의 값은?', a: 2, wrong: [1, 3, 0], why: '$1\\times1+1=2$' };
        return { q: '$\\sin60°\\div\\cos30°$의 값은?', a: 1, wrong: [2, 0, fr(1, 2)], why: '$\\sin60°=\\cos30°=\\dfrac{\\sqrt3}{2}$이므로 $1$' };
      } },
      { id: 'angle', lv: [2, 5], card: 'c1', make: (R) => {
        const opts = [['\\sin A=\\dfrac{1}{2}', 30], ['\\cos A=\\dfrac{1}{2}', 60], ['\\tan A=1', 45], ['\\tan A=\\sqrt{3}', 60], ['\\sin A=\\dfrac{\\sqrt{3}}{2}', 60], ['\\cos A=\\dfrac{\\sqrt{2}}{2}', 45]];
        const it = R.pick(opts);
        return { q: `$${it[0]}$일 때 예각 $A$의 크기는?`, a: it[1], unit: '°', wrong: [30, 45, 60, 90].filter((v) => v !== it[1]).slice(0, 3), why: `특수각 표에서 $${it[0]}$가 되는 각은 $${it[1]}°$` };
      } },
      { id: 'edge', lv: [4, 5], card: 'c2', make: (R) => {
        const items = [
          ['$\\sin90°-\\cos0°$의 값은?', 0, [1, -1, 2], '$\\sin90°=1$, $\\cos0°=1$이므로 $1-1=0$'],
          ['$\\cos90°+\\tan0°$의 값은?', 0, [1, -1, 2], '$\\cos90°=0$, $\\tan0°=0$이므로 $0+0=0$'],
          ['$\\sin0°+\\cos0°$의 값은?', 1, [0, 2, -1], '$\\sin0°=0$, $\\cos0°=1$이므로 $0+1=1$'],
        ];
        const it = R.pick(items); return { q: it[0], a: it[1], wrong: it[2], why: it[3] };
      } },
    ],
  },
  {
    id: 'm3.trigapp',
    lesson: [
      { id: 'c1', t: '변의 길이 구하기', b: T`직각삼각형에서 한 각과 한 변이 주어지면 삼각비로 다른 변을 구해요.

        빗변 $c$, $\angle A=\theta$일 때
        - 높이 $=c\sin\theta$
        - 밑변 $=c\cos\theta$

        밑변 $b$일 때 높이 $=b\tan\theta$` },
      { id: 'c2', t: '높이·거리 구하기', b: T`**올려다본 각(앙각)** 문제:
        건물에서 $d$ m 떨어진 곳에서 건물 꼭대기를 올려다본 각이 $\theta$이면
        $$(\text{건물 높이})=d\tan\theta\ (+\text{눈높이})$$

        예) $d=10$, $\theta=45°$ → 높이 $=10\times1=10$m` },
    ],
    gens: [
      { id: 'side', lv: [1, 4], card: 'c1', make: (R) => {
        const c = R.pick([2, 4, 6, 8, 10, 12, 20]); const f = R.pick([['\\sin', 30, c / 2, '\\dfrac{1}{2}'], ['\\cos', 60, c / 2, '\\dfrac{1}{2}']]);
        return { q: `빗변의 길이가 $${c}$인 직각삼각형에서 한 예각이 $${f[1]}°$일 때, 이 각의 ${f[0] === '\\sin' ? '맞은편 변(높이)' : '이웃한 밑변'}의 길이는?`, a: f[2], wrong: [c, f[2] * 2 + 1, f[2] + 2].filter((v) => v !== f[2]), why: `$${f[0]}\\,${f[1]}°=${f[3]}$ 이므로 $${c}\\times${f[3]}=${f[2]}$` };
      } },
      { id: 'height', lv: [2, 5], card: 'c2', make: (R) => {
        const d = R.pick([10, 20, 30, 40, 50]);
        const kind = R.pick([45, 45, 60, 30]);
        if (kind === 45) return { q: `나무에서 $${d}$m 떨어진 곳에서 꼭대기를 올려다본 각이 $45°$예요. 나무의 높이는? (눈높이 무시)`, a: d, unit: 'm', wrong: [d * 2, d / 2, d + 5], why: `$\\tan45°=1$ → 높이 $=${d}\\times1=${d}$m` };
        if (kind === 60) { const dd = R.pick([10, 20, 30]); return { q: `건물에서 $${dd}$m 떨어진 곳에서 꼭대기를 올려다본 각이 $60°$일 때 높이는? ($\\sqrt3$ 그대로)`, correct: `$${dd}\\sqrt{3}$ m`, wrong: [`$${dd}$ m`, `$${dd * 2}$ m`, `$\\dfrac{${dd}\\sqrt{3}}{3}$ m`], why: `$\\tan60°=\\sqrt3$ → $${dd}\\times\\sqrt3=${dd}\\sqrt3$` }; }
        const dd = R.pick([3, 6, 9]);
        return { q: `건물에서 $${dd}\\sqrt{3}$m 떨어진 곳에서 꼭대기를 올려다본 각이 $30°$일 때 건물의 높이는?`, a: dd, unit: 'm', wrong: [dd * 3, dd * 2, dd + 1], why: `$\\tan30°=\\dfrac{\\sqrt3}{3}$ → $${dd}\\sqrt3\\times\\dfrac{\\sqrt3}{3}=${dd}$` };
      } },
      { id: 'slope', lv: [3, 5], card: 'c2', make: (R) => {
        const [a, b, c] = R.pick(TRIPLES);
        return { q: `수평 거리 $${b}$m 동안 $${a}$m 올라가는 비탈길의 경사각을 $\\theta$라 할 때 $\\tan\\theta$의 값은?`, correct: `$${frT(a, b)}$`, wrong: [`$${frT(b, a)}$`, `$${frT(a, c)}$`, `$${frT(b, c)}$`], why: `$\\tan\\theta=\\dfrac{\\text{높이}}{\\text{수평 거리}}=\\dfrac{${a}}{${b}}$` };
      } },
    ],
  },

  // ───────────── 원의 성질 ─────────────
  {
    id: 'm3.inscribed',
    lesson: [
      { id: 'c1', t: '원주각과 중심각', b: T`한 호에 대한 ==원주각==의 크기는 그 호에 대한 ==중심각==의 크기의 **절반**이에요.

        $$\angle APB=\dfrac12\angle AOB$$

        - 중심각 $100°$ → 원주각 $50°$
        - 같은 호에 대한 원주각은 **모두 같아요**` },
      { id: 'c2', t: '지름의 원주각', b: T`지름에 대한 원주각은 항상 $90°$ (중심각 $180°$의 절반).

        지름 $AB$ 위에 있지 않은 원 위의 점 $P$에 대해 $\angle APB=90°$` },
      { id: 'c3', t: '호의 길이와 원주각', b: T`한 원에서 **크기가 같은 원주각**에 대한 호의 길이는 같고, 호의 길이는 원주각의 크기에 **정비례**해요.

        원주각 $30°$인 호 : 원주각 $60°$인 호 $=1:2$` },
    ],
    gens: [
      { id: 'half', lv: [1, 3], card: 'c1', make: (R) => {
        const c = R.pick([60, 80, 100, 120, 140, 160, 70, 90]);
        const fig = circleFig({ pts: [{ ang: 200, name: 'A' }, { ang: 340, name: 'B' }, { ang: 90, name: 'P' }], radii: [0, 1], chords: [[2, 0], [2, 1]] });
        if (R.chance(0.5)) return { q: `원에서 호 $AB$에 대한 중심각이 $${c}°$일 때, 같은 호에 대한 원주각 $\\angle APB$의 크기는?`, a: c / 2, unit: '°', wrong: [c, c * 2, 180 - c], why: `원주각은 중심각의 $\\dfrac12$ → $${c}°\\div2=${c / 2}°$` };
        return { q: `원에서 호 $AB$에 대한 원주각이 $${c / 2}°$일 때, 중심각 $\\angle AOB$의 크기는?`, a: c, unit: '°', wrong: [c / 2, c * 2, 180 - c / 2], why: `중심각은 원주각의 $2$배 → $${c / 2}°\\times2=${c}°$` };
      } },
      { id: 'diam', lv: [2, 4], card: 'c2', make: (R) => {
        const x = R.int(20, 70);
        return { q: `$\\overline{AB}$가 원의 지름이고 점 $P$가 원 위의 점일 때, $\\angle PAB=${x}°$이면 $\\angle PBA$의 크기는?`, a: 90 - x, unit: '°', wrong: [x, 180 - x, 90 + x], why: `지름에 대한 원주각 $\\angle APB=90°$ → 삼각형 내각의 합 $180°$에서 $180-90-${x}=${90 - x}°$` };
      } },
      { id: 'same', lv: [3, 5], card: 'c1', make: (R) => {
        const x = R.int(25, 70);
        return { q: `같은 호 $AB$에 대한 원주각 $\\angle APB=${x}°$일 때, 이 호에 대한 다른 원주각 $\\angle AQB$의 크기는?`, a: x, unit: '°', wrong: [x * 2, 180 - x, x / 2 | 0 || 1].filter((v) => v !== x), why: '같은 호에 대한 원주각의 크기는 모두 같아요.' };
      } },
      { id: 'arc', lv: [3, 5], card: 'c3', make: (R) => {
        const a = R.pick([20, 30, 40]), k = R.int(2, 4); const L1 = R.int(2, 5);
        return { q: `한 원에서 원주각이 $${a}°$인 호의 길이가 $${L1}$cm이면, 원주각이 $${a * k}°$인 호의 길이는?`, a: L1 * k, unit: 'cm', wrong: [L1 + k, L1 * k * 2, L1], why: `호의 길이는 원주각에 정비례 → $${L1}\\times${k}=${L1 * k}$cm` };
      } },
    ],
  },
  {
    id: 'm3.chords',
    lesson: [
      { id: 'c1', t: '현의 수직이등분선', b: T`원의 중심에서 현에 내린 수선은 그 현을 **이등분**해요.

        반지름 $r$, 중심에서 현까지 거리 $d$이면 현의 길이 $=2\sqrt{r^2-d^2}$
        (피타고라스 정리: 반지름이 빗변인 직각삼각형)` },
      { id: 'c2', t: '현의 길이', b: T`- 중심에서 **같은 거리**에 있는 두 현의 길이는 **같아요**.
        - 길이가 같은 두 현은 중심에서의 거리도 같아요.
        - 중심에서 **가까울수록** 현이 길어요 (지름이 가장 긴 현!)` },
    ],
    gens: [
      { id: 'len', lv: [1, 4], card: 'c1', make: (R) => {
        const [h, d, r] = R.pick([[3, 4, 5], [5, 12, 13], [8, 6, 10], [12, 5, 13], [4, 3, 5], [12, 9, 15], [6, 8, 10]]);
        const half = h;
        const kind = R.pick(['chord', 'd']);
        if (kind === 'chord') return { q: `반지름이 $${r}$cm인 원의 중심에서 현까지의 거리가 $${d}$cm일 때 현의 길이는?`, a: 2 * half, unit: 'cm', wrong: [half, 2 * d, r * 2], why: `수선이 현을 이등분 → 직각삼각형에서 $\\sqrt{${r}^2-${d}^2}=${half}$ → 현의 길이 $2\\times${half}=${2 * half}$cm` };
        return { q: `반지름이 $${r}$cm인 원에서 길이가 $${2 * half}$cm인 현과 중심 사이의 거리는?`, a: d, unit: 'cm', wrong: [half, r, d + 1], why: `현의 절반 $${half}$, 반지름 $${r}$ → $\\sqrt{${r}^2-${half}^2}=${d}$cm` };
      } },
      { id: 'cmp', lv: [2, 5], card: 'c2', make: (R) => {
        const d1 = R.int(1, 4), d2 = R.int(d1 + 1, 7);
        return { q: `같은 원에서 중심에서의 거리가 $${d1}$cm인 현 $AB$와 $${d2}$cm인 현 $CD$ 중 더 긴 현은?`, correct: '$AB$', wrong: ['$CD$', '길이가 같다'], why: '중심에서 가까울수록 현의 길이가 길어요.' };
      } },
      { id: 'eq', lv: [2, 5], card: 'c2', make: (R) => {
        const d = R.int(2, 8);
        return { q: `같은 원에서 $\\overline{AB}=\\overline{CD}$이고, 중심 $O$에서 $\\overline{AB}$까지의 거리가 $${d}$cm이면 $\\overline{CD}$까지의 거리는?`, a: d, unit: 'cm', wrong: [d * 2, d + 1, d - 1], why: '길이가 같은 두 현은 중심으로부터의 거리도 같아요.' };
      } },
    ],
  },
  {
    id: 'm3.tangent',
    lesson: [
      { id: 'c1', t: '접선과 반지름', b: T`원의 ==접선==은 원과 한 점에서 만나는 직선이에요. 그 점을 ==접점==이라 해요.

        **접선은 접점을 지나는 반지름에 수직**이에요. ($\angle OTP=90°$)` },
      { id: 'c2', t: '접선의 길이', b: T`원 밖의 한 점 $P$에서 원에 그은 두 접선의 길이는 **같아요**.
        $$\overline{PA}=\overline{PB}$$

        직각삼각형 $OAP$에서 $\overline{PA}=\sqrt{\overline{OP}^2-r^2}$` },
      { id: 'c3', t: '삼각형의 내접원', b: T`삼각형의 내접원에서 접선의 길이가 같다는 성질을 쓰면 변의 길이를 구할 수 있어요.

        내접원의 반지름 $r$, 둘레 $l$, 넓이 $S$ → $S=\dfrac12rl$` },
    ],
    gens: [
      { id: 'perp', lv: [1, 3], card: 'c1', make: (R) => {
        const x = R.int(20, 70);
        return { q: `원 $O$의 접선 $PT$ ($T$는 접점)에서 $\\angle TPO=${x}°$일 때 $\\angle POT$의 크기는?`, a: 90 - x, unit: '°', wrong: [x, 180 - x, 90 + x], why: `$\\angle OTP=90°$ (접선 ⟂ 반지름) → 삼각형 내각의 합에서 $180-90-${x}=${90 - x}°$` };
      } },
      { id: 'len', lv: [2, 5], card: 'c2', make: (R) => {
        const [r, t, op] = R.pick([[3, 4, 5], [5, 12, 13], [6, 8, 10], [8, 15, 17], [9, 12, 15]]);
        if (R.chance(0.5)) return { q: `원 밖의 점 $P$에서 반지름 $${r}$인 원에 접선을 그었다. $\\overline{OP}=${op}$일 때 접선의 길이 $\\overline{PT}$는?`, a: t, wrong: [op - r, r + t, op], why: `$\\angle OTP=90°$이므로 $\\overline{PT}=\\sqrt{${op}^2-${r}^2}=${t}$` };
        return { q: `원 밖의 점 $P$에서 원에 두 접선 $PA$, $PB$를 그었다. $\\overline{PA}=${t}$일 때 $\\overline{PB}$의 길이는?`, a: t, wrong: [t * 2, t + r, r], why: '한 점에서 원에 그은 두 접선의 길이는 같아요.' };
      } },
      { id: 'tri', lv: [3, 5], card: 'c3', make: (R) => {
        const x = R.int(1, 4), y = R.int(2, 5), z = R.int(1, 4);
        // 접선 길이 x,y,z: 변 = x+y, y+z, z+x
        return { q: `삼각형 $ABC$의 내접원이 변 $AB,\\ BC,\\ CA$와 만나는 접점을 $D,\\ E,\\ F$라 하자. $\\overline{AD}=${x}$, $\\overline{BE}=${y}$, $\\overline{CF}=${z}$일 때 $\\triangle ABC$의 둘레의 길이는?`, a: 2 * (x + y + z), wrong: [x + y + z, 2 * (x + y + z) + 1, x * y * z], why: `접선의 길이가 같으므로 $\\overline{AB}=${x + y}$, $\\overline{BC}=${y + z}$, $\\overline{CA}=${z + x}$ → 둘레 $2(${x}+${y}+${z})=${2 * (x + y + z)}$` };
      } },
    ],
  },
  {
    id: 'm3.cyclic',
    lesson: [
      { id: 'c1', t: '원에 내접하는 사각형', b: T`네 꼭짓점이 모두 한 원 위에 있는 사각형을 ==원에 내접하는 사각형==이라 해요.

        - **마주 보는 두 내각의 합은 $180°$**
        - 한 외각의 크기는 그 **이웃하지 않는 내대각**의 크기와 같아요

        $\angle A+\angle C=180°,\ \angle B+\angle D=180°$` },
      { id: 'c2', t: '내접 조건', b: T`사각형이 원에 내접하려면 (조건 중 하나)
        - 한 쌍의 대각의 합이 $180°$
        - 한 외각이 그 내대각과 같음

        평행사변형이 내접하면 직사각형이에요. (대각이 같고 합이 180° → 각각 90°)` },
      { id: 'c3', t: '접선과 현이 이루는 각', b: T`원의 접선과 그 접점을 지나는 현이 이루는 각은 그 각 안에 있는 호에 대한 **원주각**과 같아요. (접선-현 각 정리)

        접선과 현이 이루는 각이 $\theta$이면 그 호에 대한 중심각은 $2\theta$` },
    ],
    gens: [
      { id: 'opp', lv: [1, 3], card: 'c1', make: (R) => {
        const A = R.int(50, 130);
        return { q: `원에 내접하는 사각형 $ABCD$에서 $\\angle A=${A}°$일 때 $\\angle C$의 크기는?`, a: 180 - A, unit: '°', wrong: [A, 360 - A, 90], why: `마주 보는 두 내각의 합은 $180°$ → $180-${A}=${180 - A}°$` };
      } },
      { id: 'ext', lv: [3, 5], card: 'c1', make: (R) => {
        const D = R.int(60, 120);
        return { q: `원에 내접하는 사각형 $ABCD$에서 $\\angle D=${D}°$일 때 $\\angle B$의 외각의 크기는?`, a: D, unit: '°', wrong: [180 - D, 360 - D, D / 2 | 0], why: `$\\angle B$의 외각은 $180°-\\angle B$이고 $\\angle B=180°-\\angle D$이므로 외각 $=\\angle D=${D}°$` };
      } },
      { id: 'tcond', lv: [2, 5], card: 'c2', make: (R) => {
        const A = R.int(60, 120), B = R.int(60, 120);
        const C = R.chance(0.5) ? 180 - A : A + R.pick([10, 20, 30]);
        const ok = A + C === 180;
        return { q: `사각형 $ABCD$에서 $\\angle A=${A}°$, $\\angle C=${C}°$일 때 원에 내접할 수 있는 조건을 만족하는가? ($\\angle B+\\angle D$는 따로 맞다고 가정)`.replace(/ \(.*가정\)/, ''), correct: ok ? '만족한다' : '만족하지 않는다', wrong: [ok ? '만족하지 않는다' : '만족한다'], why: `대각의 합 $${A}°+${C}°=${A + C}°$이므로 ${A + C === 180 ? '$180°$ → 내접 가능' : '$180°$가 아니라서 내접할 수 없어요'}` };
      } },
      { id: 'tcs', lv: [3, 5], card: 'c3', make: (R) => {
        const t = R.int(25, 75);
        return { q: `원의 접선과 접점을 지나는 현 $AB$가 이루는 각이 $${t}°$일 때, 그 호 $AB$에 대한 중심각의 크기는?`, a: 2 * t, unit: '°', wrong: [t, 180 - t, 360 - 2 * t], why: `접선과 현이 이루는 각 $=$ 원주각 $=${t}°$ → 중심각은 $2\\times${t}=${2 * t}°$` };
      } },
    ],
  },

  // ───────────── 통계 ─────────────
  {
    id: 'm3.central',
    lesson: [
      { id: 'c1', t: '대푯값', b: T`자료 전체를 대표하는 값이에요.

        - ==평균==: (변량의 총합) ÷ (변량의 개수)
        - ==중앙값==: 크기순으로 나열했을 때 **가운데 값** (개수가 짝수면 가운데 두 값의 평균)
        - ==최빈값==: **가장 많이 나타난** 값 (여러 개일 수도 있어요)

        예) $2,\ 3,\ 3,\ 7,\ 10$: 평균 $5$, 중앙값 $3$, 최빈값 $3$` },
      { id: 'c2', t: '어느 대푯값이 좋을까?', b: T`- 극단적인 값(매우 크거나 작은 값)이 있으면 평균이 흔들려요 → **중앙값**이 더 적절
        - 가장 인기 있는 것(신발 사이즈, 메뉴)을 알고 싶으면 → **최빈값**
        - 자료가 고르면 → 평균` },
    ],
    gens: [
      { id: 'mean', lv: [1, 3], card: 'c1', make: (R) => {
        const n = R.int(4, 6); const m = R.int(5, 15);
        const arr = []; for (let i = 0; i < n - 1; i++) arr.push(R.int(m - 4, m + 4));
        const last = m * n - arr.reduce((a, b) => a + b, 0); arr.push(last);
        if (arr.some((v) => v <= 0)) return { q: '변량 $4,\\ 6,\\ 8,\\ 10,\\ 12$의 평균은?', a: 8, wrong: [7, 9, 10], why: '$\\dfrac{4+6+8+10+12}{5}=8$' };
        return { q: `변량 $${arr.join(',\\ ')}$의 평균은?`, a: m, wrong: [m + 1, m - 1, Math.max(...arr)], why: `총합 $${arr.join('+')}=${m * n}$ → $${m * n}\\div${n}=${m}$` };
      } },
      { id: 'median', lv: [2, 5], card: 'c1', make: (R) => {
        const n = R.pick([5, 6, 7, 8]); const arr = Array.from({ length: n }, () => R.int(1, 20));
        const s = [...arr].sort((a, b) => a - b);
        const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
        return { q: `변량 $${arr.join(',\\ ')}$의 중앙값은?`, a: med, fmt: Number.isInteger(med) ? undefined : 'dec', wrong: [s[0], s[n - 1], Math.round(arr.reduce((a, b) => a + b, 0) / n)].filter((v) => v !== med), why: `크기순: $${s.join(',\\ ')}$ → ${n % 2 ? `가운데 값 $${med}$` : `가운데 두 값 $${s[n / 2 - 1]},\\ ${s[n / 2]}$의 평균 $${med}$`}` };
      } },
      { id: 'mode', lv: [1, 4], card: 'c1', make: (R) => {
        const m = R.int(2, 9); const arr = [m, m, m]; while (arr.length < 7) { const v = R.int(1, 12); if (v !== m && arr.filter((x) => x === v).length < 2) arr.push(v); }
        arr.sort(() => R.next() - 0.5);
        return { q: `변량 $${arr.join(',\\ ')}$의 최빈값은?`, a: m, wrong: [Math.max(...arr), Math.min(...arr), m + 1].filter((v) => v !== m), why: `$${m}$[이/가] 3번으로 가장 많이 나타나요.` };
      } },
      { id: 'which', lv: [3, 5], card: 'c2', make: (R) => {
        const items = [
          ['자료에 매우 큰 값이 하나 섞여 있을 때 대푯값으로 가장 적절한 것은?', '중앙값', ['평균', '합계', '범위'], '극단값의 영향이 큰 평균 대신 중앙값이 더 적절해요.'],
          ['신발 가게에서 가장 많이 준비해야 할 사이즈를 정하려고 할 때 가장 적절한 대푯값은?', '최빈값', ['평균', '중앙값', '범위'], '가장 많이 팔리는 사이즈 = 최빈값'],
        ];
        const it = R.pick(items); return { q: it[0], correct: it[1], wrong: it[2], why: it[3] };
      } },
    ],
  },
  {
    id: 'm3.var',
    lesson: [
      { id: 'c1', t: '편차', b: T`(편차) = (변량) − (평균)

        **편차의 총합은 항상 $0$** 이에요. 편차가 크면 평균에서 멀리 떨어진 값이에요.` },
      { id: 'c2', t: '분산과 표준편차', b: T`- ==분산==: (편차)²의 평균 $=\dfrac{(\text{편차})^2\text{의 합}}{(\text{변량의 개수})}$
        - ==표준편차==: 분산의 양의 제곱근 $=\sqrt{\text{분산}}$

        **표준편차가 작을수록** 자료가 평균 주변에 **모여 있어요** (고르다). 클수록 흩어져 있어요.` },
      { id: 'c3', t: '분산 계산 순서', b: T`1. 평균 구하기
        2. 편차 구하기 (총합이 0인지 검산!)
        3. 편차를 제곱해서 더하고 개수로 나누기 → 분산
        4. 제곱근 → 표준편차` },
    ],
    gens: [
      { id: 'dev', lv: [1, 3], card: 'c1', make: (R) => {
        const m = R.int(5, 12), x = R.int(2, 18);
        return { q: `평균이 $${m}$인 자료에서 변량 $${x}$의 편차는?`, a: x - m, wrong: [m - x, x + m, x], why: `(편차)=(변량)−(평균)=$${x}-${m}=${x - m}$` };
      } },
      { id: 'sumdev', lv: [2, 4], card: 'c1', make: (R) => {
        const m = R.int(4, 10); const d = [R.int(-4, 4), R.int(-4, 4), R.int(-4, 4)];
        const last = -d.reduce((a, b) => a + b, 0);
        const x = R.int(1, 3);
        return { q: `평균이 $${m}$인 자료의 편차가 $${d[0]},\\ ${d[1]},\\ ${d[2]},\\ x$일 때 $x$의 값은?`, a: last, wrong: [-last, last + 1, m].filter((v) => v !== last), why: `편차의 총합은 $0$ → $${d[0]}+(${d[1]})+(${d[2]})+x=0$ → $x=${last}$` };
      } },
      { id: 'var', lv: [3, 5], card: 'c2', make: (R) => {
        const sets = [[[2, 4, 6, 8, 10], 8, '$\\sqrt8=2\\sqrt2$'], [[3, 5, 7], 8 / 3, null], [[1, 3, 5, 7, 9], 8, null], [[4, 6, 8, 10], 5, null], [[2, 6, 10], 32 / 3, null], [[5, 5, 5, 5], 0, null], [[1, 2, 3, 4, 5], 2, null], [[10, 20, 30], 200 / 3, null]];
        const exact = [[2, 4, 6, 8, 10], [1, 3, 5, 7, 9], [4, 6, 8, 10], [1, 2, 3, 4, 5], [5, 5, 5, 5], [6, 8, 10, 12], [3, 6, 9]];
        const arr = R.pick(exact); const n = arr.length; const m = arr.reduce((a, b) => a + b, 0) / n;
        const v = arr.reduce((a, b) => a + (b - m) ** 2, 0) / n;
        const ask = R.pick(['var', 'sd']);
        if (ask === 'sd' && Number.isInteger(Math.sqrt(v))) return { q: `변량 $${arr.join(',\\ ')}$의 표준편차는?`, a: Math.sqrt(v), wrong: [v, Math.sqrt(v) + 1, m], why: `평균 $${m}$, 분산 $${v}$ → 표준편차 $\\sqrt{${v}}=${Math.sqrt(v)}$` };
        return { q: `변량 $${arr.join(',\\ ')}$의 분산은?`, a: v, fmt: Number.isInteger(v) ? undefined : 'dec', wrong: [Math.sqrt(v) | 0 || 1, v + 1, m].filter((x) => x !== v), why: `평균 $${m}$, 편차 $${arr.map((x) => x - m).join(',\\ ')}$ → 편차²의 합 $${v * n}$ → 분산 $${v * n}\\div${n}=${v}$` };
      } },
      { id: 'compare', lv: [2, 5], card: 'c2', make: (R) => {
        const s1 = R.int(1, 5), s2 = R.int(s1 + 1, 9);
        return { q: `A반 점수의 표준편차는 $${s1}$점, B반은 $${s2}$점이에요. 점수가 더 고르게 분포한 반은?`, correct: 'A반', wrong: ['B반', '같다'], why: '표준편차가 작을수록 평균 주변에 모여 있어(고르게 분포해) 있어요.'.replace('있어(고르게 분포해) 있어요', '있어요(고르게 분포)') };
      } },
    ],
  },
  {
    id: 'm3.scatter',
    lesson: [
      { id: 'c1', t: '산점도', b: T`두 변량의 값을 **순서쌍 $(x,\ y)$**로 좌표평면에 점으로 찍은 그래프를 ==산점도==라 해요.

        예) 키($x$)와 몸무게($y$), 공부 시간($x$)과 시험 점수($y$)` },
      { id: 'c2', t: '상관관계', b: T`산점도에서 점들이 퍼진 모양으로 두 변량의 관계를 알 수 있어요.

        - ==양의 상관관계==: $x$가 늘면 $y$도 늘어요 (오른쪽 위로 향함). 예) 키와 몸무게
        - ==음의 상관관계==: $x$가 늘면 $y$는 줄어요 (오른쪽 아래로). 예) 운동량과 체지방
        - ==상관관계가 없다==: 점들이 흩어져 일정한 경향이 없음. 예) 키와 시력
        - 점들이 **직선에 가까울수록** 상관관계가 **강해요**.` },
    ],
    gens: [
      { id: 'type', lv: [1, 3], card: 'c2', make: (R) => {
        const items = [
          ['키와 몸무게', '양의 상관관계'], ['공부 시간과 시험 점수', '양의 상관관계'], ['겨울철 기온과 난방비', '음의 상관관계'],
          ['운동 시간과 체지방률', '음의 상관관계'], ['신발 크기와 수학 점수', '상관관계가 없다'], ['달리기 속도와 기록(걸린 시간)', '음의 상관관계'], ['나이(성장기)와 키', '양의 상관관계'],
        ];
        const it = R.pick(items); const all = ['양의 상관관계', '음의 상관관계', '상관관계가 없다'];
        return { q: `"${it[0]}"의 관계에 가장 알맞은 것은?`, correct: it[1], wrong: all.filter((x) => x !== it[1]), why: `${it[1] === '양의 상관관계' ? '한 변량이 늘면 다른 변량도 늘어요.' : it[1] === '음의 상관관계' ? '한 변량이 늘면 다른 변량은 줄어요.' : '두 변량 사이에 뚜렷한 경향이 없어요.'}` };
      } },
      { id: 'graph', lv: [2, 5], card: 'c2', make: (R) => {
        const kind = R.pick(['pos', 'neg', 'none']);
        const pts = []; for (let i = 0; i < 12; i++) { const x = R.int(-4, 4); const y = kind === 'pos' ? x + R.int(-1, 1) : kind === 'neg' ? -x + R.int(-1, 1) : R.int(-4, 4); pts.push({ x, y }); }
        const fig = coordPlane({ xmin: -5, xmax: 5, ymin: -5, ymax: 5, w: 240, pts: pts.map((p) => ({ ...p })), ticks: false });
        const ans = kind === 'pos' ? '양의 상관관계' : kind === 'neg' ? '음의 상관관계' : '상관관계가 없다';
        const all = ['양의 상관관계', '음의 상관관계', '상관관계가 없다'];
        return { q: '산점도가 나타내는 두 변량의 관계는?', fig, correct: ans, wrong: all.filter((x) => x !== ans), why: kind === 'pos' ? '점들이 오른쪽 위로 향해서 $x$가 늘면 $y$도 늘어요.' : kind === 'neg' ? '점들이 오른쪽 아래로 향해서 $x$가 늘면 $y$는 줄어요.' : '점들이 흩어져 있어서 뚜렷한 경향이 없어요.' };
      } },
      { id: 'strong', lv: [3, 5], card: 'c2', make: (R) => {
        const items = [
          ['상관관계가 강할수록 산점도의 점들은 어떻게 분포할까요?', '한 직선 가까이에 모인다', ['넓게 흩어진다', '원 모양으로 퍼진다', '한 점에 모인다'], '점들이 직선에 가까울수록 상관관계가 강해요.'],
          ['한 변량이 증가할 때 다른 변량이 감소하는 경향이 있는 관계는?', '음의 상관관계', ['양의 상관관계', '상관관계가 없다'], '음의 상관관계의 정의예요.'],
        ];
        const it = R.pick(items); return { q: it[0], correct: it[1], wrong: it[2], why: it[3] };
      } },
    ],
  },
];
