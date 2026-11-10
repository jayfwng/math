// 중1 ④ 평면도형 · 입체도형 · 자료의 정리와 해석
import { gcd, paren } from '../js/lib.js';
import { svgRaw, fig, barChart } from '../js/fig.js';

const { L, T } = fig;
const T_ = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const r3 = (v) => Math.round(v * 1000) / 1000;

export default [
  // ───────────── 평면도형 ─────────────
  {
    id: 'm1.polygon',
    lesson: [
      { id: 'c1', t: '다각형과 대각선', b: T_`선분으로만 둘러싸인 도형을 ==다각형==이라 해요. 변이 $n$개면 ==$n$각형==.

        ==대각선==: 이웃하지 않는 두 꼭짓점을 이은 선분.
        $n$각형의 대각선 수: $\dfrac{n(n-3)}{2}$ (한 꼭짓점에서 $n-3$개씩, 중복이라 2로 나눔)

        ==정다각형==은 모든 변의 길이와 모든 내각의 크기가 같아요.` },
      { id: 'c2', t: '삼각형의 내각과 외각', b: T_`삼각형의 세 내각의 합은 $180^\circ$예요.

        ==외각==은 한 변을 연장했을 때 생기는 바깥쪽 각이고,
        ==삼각형의 한 외각의 크기는 이웃하지 않는 두 내각의 크기의 합과 같아요.==

        예) 내각이 $50^\circ,\ 60^\circ$이면 나머지 내각은 $70^\circ$, 70°의 이웃한 외각은 $110^\circ$` },
      { id: 'c3', t: '다각형의 내각과 외각의 합', b: T_`$n$각형의 내각의 크기의 합 $=180^\circ\times(n-2)$
        (한 꼭짓점에서 대각선을 그으면 삼각형이 $n-2$개)

        ==다각형의 외각의 크기의 합은 항상 $360^\circ$== ($n$에 상관없이!)

        정$n$각형 한 내각 $=\dfrac{180^\circ\times(n-2)}{n}$, 한 외각 $=\dfrac{360^\circ}{n}$` },
    ],
    gens: [
      { id: 'diag', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const n = R.int(5, lv === 1 ? 8 : 12);
        if (R.chance(0.5)) return { q: `${n}각형의 대각선의 개수는?`, a: (n * (n - 3)) / 2, unit: '개', wrong: [n * (n - 3), n - 3, (n * (n - 1)) / 2], why: `$\\dfrac{n(n-3)}{2}=\\dfrac{${n}\\times${n - 3}}{2}=${(n * (n - 3)) / 2}$` };
        const d = n - 3;
        return { q: `한 꼭짓점에서 그을 수 있는 대각선의 개수가 $${d}$개인 다각형은 몇 각형일까요?`, correct: `${n}각형`, wrong: [n - 1, n + 1, d].map((v) => `${v}각형`), why: `한 꼭짓점에서 그을 수 있는 대각선은 $n-3$개예요. $n-3=${d}$ → $n=${n}$` };
      } },
      { id: 'tri', lv: [1, 3], card: 'c2', make: (R) => {
        const a = R.int(25, 80), b = R.int(25, 80);
        if (R.chance(0.5)) return { q: `삼각형의 두 내각이 $${a}^\\circ$, $${b}^\\circ$일 때 나머지 한 내각의 크기는?`, a: 180 - a - b, unit: '°', wrong: [a + b, 180 - a, 90], why: `내각의 합은 $180^\\circ$예요. $180-${a}-${b}=${180 - a - b}$` };
        return { q: `삼각형 ABC에서 $\\angle A=${a}^\\circ$, $\\angle B=${b}^\\circ$일 때 $\\angle C$의 외각의 크기는?`, a: a + b, unit: '°', wrong: [180 - a - b, 180 - a, 180 - b], why: `외각은 이웃하지 않는 두 내각의 합이에요. $${a}+${b}=${a + b}$` };
      } },
      { id: 'sum', lv: [2, 4], card: 'c3', make: (R, lv) => {
        const n = R.int(5, 12);
        if (R.chance(0.5)) return { q: `${n}각형의 내각의 크기의 합은?`, a: 180 * (n - 2), unit: '°', wrong: [180 * n, 180 * (n - 1), 360], why: `$180^\\circ\\times(n-2)=180\\times${n - 2}=${180 * (n - 2)}^\\circ$` };
        const s = 180 * (n - 2);
        return { q: `내각의 크기의 합이 $${s}^\\circ$인 다각형은 몇 각형일까요?`, correct: `${n}각형`, wrong: [n - 1, n + 1, n + 2].map((v) => `${v}각형`), why: `$180\\times(n-2)=${s}$ → $n-2=${n - 2}$ → $n=${n}$` };
      } },
      { id: 'reg', lv: [3, 5], card: 'c3', make: (R, lv) => {
        const n = R.pick([3, 4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36]);
        const inn = (180 * (n - 2)) / n, out = 360 / n;
        if (lv <= 4 && Number.isInteger(inn)) {
          if (R.chance(0.5)) return { q: `정${n}각형의 한 내각의 크기는?`, a: inn, unit: '°', wrong: [out, 180 - inn * 0 - 10, 360 - inn], why: `내각의 합 $180\\times${n - 2}=${180 * (n - 2)}$를 ${n}으로 나눠요. $${inn}^\\circ$\n(또는 한 외각 $360\\div${n}=${out}$를 180에서 빼도 돼요.)` };
          return { q: `정${n}각형의 한 외각의 크기는?`, a: out, unit: '°', wrong: [inn, 180 - out - 10, 360 - out], why: `외각의 합은 항상 $360^\\circ$[이므로/므로] $360\\div${n}=${out}^\\circ$` };
        }
        const e = R.pick([30, 36, 40, 45, 60, 72, 90]);
        return { q: `한 외각의 크기가 $${e}^\\circ$인 정다각형은 정 몇 각형일까요?`, correct: `정${360 / e}각형`, wrong: [360 / e + 1, 360 / e - 1, 360 / e + 2].map((v) => `정${v}각형`), why: `외각의 합 $360^\\circ$를 한 외각 $${e}^\\circ$[으로/로] 나눠요. $360\\div${e}=${360 / e}$` };
      } },
    ],
  },
  {
    id: 'm1.circle',
    lesson: [
      { id: 'c1', t: '원과 부채꼴의 용어', b: T_`- ==호== (⌒AB): 원 위의 두 점 사이의 부분
        - ==현==: 원 위의 두 점을 잇는 선분. 가장 긴 현은 **지름**
        - ==부채꼴==: 호와 두 반지름으로 이루어진 도형
        - ==중심각==: 부채꼴에서 두 반지름이 이루는 각

        **한 원에서 중심각의 크기에 호의 길이, 부채꼴의 넓이는 정비례**해요. 중심각이 2배면 호의 길이도 넓이도 2배.` },
      { id: 'c2', t: '원의 둘레와 넓이', b: T_`반지름이 $r$인 원
        - 둘레 $l=2\pi r$
        - 넓이 $S=\pi r^2$

        $\pi$(원주율)는 약 $3.14$인 무한히 계속되는 수라서, 보통 $\pi$ 그대로 써요.
        예) $r=3$이면 $l=6\pi,\ S=9\pi$` },
      { id: 'c3', t: '부채꼴의 호의 길이와 넓이', b: T_`반지름 $r$, 중심각 $x^\circ$인 부채꼴은 원의 $\dfrac{x}{360}$이에요.

        - 호의 길이 $l=2\pi r\times\dfrac{x}{360}$
        - 넓이 $S=\pi r^2\times\dfrac{x}{360}$

        호의 길이 $l$을 알면 $S=\dfrac12rl$ 도 쓸 수 있어요.` },
    ],
    gens: [
      { id: 'prop', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.int(2, 6) * 10, k = R.int(2, 4), L0 = R.int(2, 6);
        return { q: `한 원에서 중심각이 $${a}^\\circ$인 부채꼴의 호의 길이가 $${L0}$cm일 때, 중심각이 $${a * k}^\\circ$인 부채꼴의 호의 길이는?`, a: L0 * k, unit: 'cm', wrong: [L0 + k, L0 * k * 2, L0], why: `호의 길이는 중심각의 크기에 정비례해요.\n중심각이 ${k}배이므로 호의 길이도 ${k}배: $${L0}\\times${k}=${L0 * k}$cm` };
      } },
      { id: 'circ', lv: [1, 3], card: 'c2', make: (R) => {
        const r = R.int(2, 12);
        if (R.chance(0.5)) return { q: `반지름이 $${r}$cm인 원의 둘레는?`, a: 2 * r, suf: '\\pi', unit: 'cm', wrong: [r, r * r, 4 * r], why: `$2\\pi r=2\\pi\\times${r}=${2 * r}\\pi$` };
        return { q: `반지름이 $${r}$cm인 원의 넓이는?`, a: r * r, suf: '\\pi', unit: 'cm²', wrong: [2 * r, r, r * r * 2], why: `$\\pi r^2=\\pi\\times${r}^2=${r * r}\\pi$` };
      } },
      { id: 'sector', lv: [3, 5], card: 'c3', make: (R, lv) => {
        const combos = [];
        for (const r of [3, 4, 5, 6, 8, 9, 10, 12]) for (const x of [30, 45, 60, 90, 120, 135, 180, 240, 270]) { if (Number.isInteger((2 * r * x) / 360) && Number.isInteger((r * r * x) / 360)) combos.push([r, x]); }
        const [r, x] = R.pick(combos);
        const arcN = (2 * r * x) / 360, areaN = (r * r * x) / 360;
        const ask = R.pick(['arc', 'area']);
        const val = ask === 'arc' ? arcN : areaN;
        return { q: `반지름이 $${r}$cm, 중심각이 $${x}^\\circ$인 부채꼴의 ${ask === 'arc' ? '호의 길이' : '넓이'}는?`, a: val, suf: '\\pi', unit: ask === 'arc' ? 'cm' : 'cm²', wrong: [val * 2, val + 1, ask === 'arc' ? areaN : arcN].filter((v) => v !== val), why: ask === 'arc' ? `$l=2\\pi\\times${r}\\times\\dfrac{${x}}{360}=${arcN}\\pi$` : `$S=\\pi\\times${r}^2\\times\\dfrac{${x}}{360}=${areaN}\\pi$` };
      } },
      { id: 'angle', lv: [4, 5], card: 'c3', make: (R) => {
        const r = R.pick([3, 6, 9, 12]); const x = R.pick([40, 60, 90, 120, 150, 180]);
        const l = (2 * r * x) / 360;
        if (!Number.isInteger(l * 2)) return { q: '한 원에서 중심각의 크기와 호의 길이는 어떤 관계일까요?', correct: '정비례', wrong: ['반비례', '관계없다', '제곱에 비례'], why: '한 원에서 중심각의 크기에 호의 길이는 정비례해요.' };
        return { q: `반지름이 $${r}$cm인 부채꼴의 호의 길이가 $${l}\\pi$cm일 때, 중심각의 크기는?`, a: x, unit: '°', wrong: [x / 2, x * 2, 360 - x], why: `$2\\pi\\times${r}\\times\\dfrac{x}{360}=${l}\\pi$ → $\\dfrac{x}{360}=\\dfrac{${l}}{${2 * r}}$ → $x=${x}$` };
      } },
    ],
  },

  // ───────────── 입체도형 ─────────────
  {
    id: 'm1.solids',
    lesson: [
      { id: 'c1', t: '다면체', b: T_`다각형인 면으로만 둘러싸인 입체도형을 ==다면체==라 해요. 면의 개수에 따라 사면체, 오면체, 육면체…

        | 종류 | 옆면 | 면의 개수($n$각 ~) |
        | $n$각기둥 | 직사각형 | $n+2$ |
        | $n$각뿔 | 삼각형 | $n+1$ |
        | $n$각뿔대 | 사다리꼴 | $n+2$ |

        **꼭짓점**: $n$각기둥 $2n$, $n$각뿔 $n+1$ / **모서리**: $n$각기둥 $3n$, $n$각뿔 $2n$` },
      { id: 'c2', t: '정다면체', b: T_`모든 면이 합동인 정다각형이고, 각 꼭짓점에 모인 면의 수가 같은 다면체를 ==정다면체==라 해요. **딱 5가지**뿐이에요.

        | 이름 | 면의 모양 | 면의 수 |
        | 정사면체 | 정삼각형 | 4 |
        | 정육면체 | 정사각형 | 6 |
        | 정팔면체 | 정삼각형 | 8 |
        | 정십이면체 | 정오각형 | 12 |
        | 정이십면체 | 정삼각형 | 20 |` },
      { id: 'c3', t: '회전체', b: T_`평면도형을 한 직선(==회전축==)을 중심으로 **한 바퀴 돌려** 얻은 입체도형이 ==회전체==예요.

        - 직사각형 → 원기둥
        - 직각삼각형 → 원뿔
        - 반원 → 구

        ==회전축에 수직인 평면==으로 자른 단면은 항상 **원**이에요.
        ==회전축을 포함하는 평면==으로 자른 단면은 **선대칭도형**이에요.` },
    ],
    gens: [
      { id: 'count', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const n = R.int(3, 9);
        const kind = R.pick(['기둥', '뿔']);
        const what = R.pick(['면', '꼭짓점', '모서리']);
        const f = kind === '기둥' ? { 면: n + 2, 꼭짓점: 2 * n, 모서리: 3 * n } : { 면: n + 1, 꼭짓점: n + 1, 모서리: 2 * n };
        const ex = kind === '기둥' ? { 면: `밑면 2개 + 옆면 ${n}개`, 꼭짓점: `밑면마다 ${n}개씩 2개`, 모서리: `밑면 ${n}×2 + 옆 모서리 ${n}` } : { 면: `밑면 1개 + 옆면 ${n}개`, 꼭짓점: `밑면 ${n}개 + 꼭대기 1개`, 모서리: `밑면 ${n}개 + 옆 모서리 ${n}개` };
        return { q: `${n}각${kind}의 ${what}의 개수는?`, a: f[what], unit: '개', wrong: [f[what] + 1, f[what] - 1, f[what] + n], why: `${ex[what]}\n$${f[what]}$개예요.` };
      } },
      { id: 'euler', lv: [3, 5], card: 'c1', make: (R) => {
        const n = R.int(4, 9);
        const v = n + 1, e = 2 * n, f = n + 1;
        const ask = R.pick(['v', 'e', 'f']);
        const given = { v: `꼭짓점 ${v}개`, e: `모서리 ${e}개`, f: `면 ${f}개` };
        // 각뿔: 모서리 수에서 n 알아내기
        return { q: `모서리의 개수가 ${e}개인 각뿔의 꼭짓점의 개수는?`, a: v, unit: '개', wrong: [e, n, v + 1], why: `$n$각뿔의 모서리는 $2n$개 → $2n=${e}$ → $n=${n}$\n꼭짓점은 $n+1=${v}$개예요.` };
      } },
      { id: 'reg', lv: [2, 4], card: 'c2', make: (R) => {
        const reg = [['정사면체', '정삼각형', 4], ['정육면체', '정사각형', 6], ['정팔면체', '정삼각형', 8], ['정십이면체', '정오각형', 12], ['정이십면체', '정삼각형', 20]];
        const x = R.pick(reg);
        if (R.chance(0.5)) return { q: `${x[0]}의 면의 모양은?`, correct: x[1], wrong: ['정삼각형', '정사각형', '정오각형', '정육각형'].filter((v) => v !== x[1]).slice(0, 3), why: `${x[0]}의 면은 모두 ${x[1]}이에요.` };
        return { q: `면의 모양이 ${x[1]}인 정다면체가 아닌 것은?`, correct: reg.find((y) => y[1] !== x[1])[0], wrong: reg.filter((y) => y[1] === x[1]).map((y) => y[0]).slice(0, 3), why: '정다면체 5가지: 정사면체·정팔면체·정이십면체(정삼각형), 정육면체(정사각형), 정십이면체(정오각형)' };
      } },
      { id: 'rot', lv: [2, 5], card: 'c3', make: (R) => {
        const items = [
          ['직사각형을 한 변을 축으로 회전시키면 어떤 입체도형이 될까요?', '원기둥', ['원뿔', '구', '원뿔대']],
          ['직각삼각형을 직각을 낀 한 변을 축으로 회전시키면?', '원뿔', ['원기둥', '구', '원뿔대']],
          ['반원을 지름을 축으로 회전시키면?', '구', ['원기둥', '원뿔', '반구']],
          ['회전체를 회전축에 수직인 평면으로 자를 때의 단면은?', '원', ['직사각형', '삼각형', '타원이 아닌 사다리꼴']],
          ['구를 어떤 평면으로 잘라도 그 단면의 모양은?', '원', ['삼각형', '직사각형', '부채꼴']],
        ];
        const it = R.pick(items);
        return { q: it[0], correct: it[1], wrong: it[2], why: `${it[1]}[이/가] 돼요. 평면도형이 한 바퀴 돌면서 입체를 만들어요.`.replace('[이/가]', ['원', '구'].includes(it[1]) ? '이' : '이') };
      } },
    ],
  },
  {
    id: 'm1.surface',
    lesson: [
      { id: 'c1', t: '기둥의 겉넓이', b: T_`==겉넓이== = (밑넓이)$\times2$ + (옆넓이)

        - 옆넓이 = (밑면의 둘레) $\times$ (높이)

        직육면체: $2(ab+bc+ca)$
        예) 밑면 $3\times4$, 높이 $5$: $2\times12+(3+4)\times2\times5=24+70=94$` },
      { id: 'c2', t: '원기둥 · 원뿔 · 구의 겉넓이', b: T_`반지름 $r$, 높이 $h$

        - 원기둥: $2\pi r^2+2\pi rh$ (밑넓이 2개 + 옆넓이=밑둘레×높이)
        - 원뿔 (모선의 길이 $l$): $\pi r^2+\pi rl$
        - 구: $4\pi r^2$

        원뿔의 옆넓이 $\pi rl$은 부채꼴 넓이 $\dfrac12\times l\times(\text{호의 길이 }2\pi r)$ 에서 나와요.` },
    ],
    gens: [
      { id: 'prism', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const a = R.int(2, 8), b = R.int(2, 8), h = R.int(2, 9);
        if (R.chance(0.5)) return { q: `밑면이 가로 ${a}cm, 세로 ${b}cm인 직사각형이고 높이가 ${h}cm인 직육면체의 겉넓이는?`, a: 2 * (a * b + b * h + h * a), unit: 'cm²', wrong: [a * b * h, 2 * a * b + (a + b) * h, 2 * (a * b + b * h)], why: `$2(ab+bh+ha)=2(${a * b}+${b * h}+${h * a})=${2 * (a * b + b * h + h * a)}$` };
        const s = a;
        return { q: `한 모서리의 길이가 ${s}cm인 정육면체의 겉넓이는?`, a: 6 * s * s, unit: 'cm²', wrong: [s ** 3, 4 * s * s, 12 * s], why: `정사각형 6개: $6\\times${s}^2=${6 * s * s}$` };
      } },
      { id: 'cyl', lv: [3, 5], card: 'c2', make: (R) => {
        const r = R.int(2, 8), h = R.int(2, 10);
        return { q: `밑면의 반지름이 ${r}cm, 높이가 ${h}cm인 원기둥의 겉넓이는?`, a: 2 * r * r + 2 * r * h, suf: '\\pi', unit: 'cm²', wrong: [r * r + 2 * r * h, 2 * r * r + r * h, r * r * h], why: `밑넓이 $\\pi r^2=${r * r}\\pi$ (2개 → $${2 * r * r}\\pi$)\n옆넓이 $2\\pi rh=${2 * r * h}\\pi$\n합 $${2 * r * r + 2 * r * h}\\pi$` };
      } },
      { id: 'cone', lv: [4, 5], card: 'c2', make: (R) => {
        const r = R.int(2, 8), l = r + R.int(2, 7);
        if (R.chance(0.5)) return { q: `밑면의 반지름이 ${r}cm, 모선의 길이가 ${l}cm인 원뿔의 겉넓이는?`, a: r * r + r * l, suf: '\\pi', unit: 'cm²', wrong: [r * l, r * r + 2 * r * l, 2 * r * r + r * l], why: `밑넓이 $\\pi r^2=${r * r}\\pi$, 옆넓이 $\\pi rl=${r * l}\\pi$\n합 $${r * r + r * l}\\pi$` };
        return { q: `반지름이 ${r}cm인 구의 겉넓이는?`, a: 4 * r * r, suf: '\\pi', unit: 'cm²', wrong: [2 * r * r, r * r, (4 * r * r * r) / 3 === Math.floor((4 * r * r * r) / 3) ? (4 * r * r * r) / 3 : 4 * r], why: `$4\\pi r^2=4\\pi\\times${r}^2=${4 * r * r}\\pi$` };
      } },
    ],
  },
  {
    id: 'm1.volume',
    lesson: [
      { id: 'c1', t: '기둥의 부피', b: T_`==기둥의 부피== = (밑넓이) $\times$ (높이)

        원기둥: $V=\pi r^2h$

        예) 밑넓이 $12\text{cm}^2$, 높이 $5\text{cm}$ → $60\text{cm}^3$` },
      { id: 'c2', t: '뿔의 부피', b: T_`==뿔의 부피== = $\dfrac13\times$ (밑넓이) $\times$ (높이)

        같은 밑넓이, 같은 높이인 기둥의 **$\dfrac13$**이에요.
        원뿔: $V=\dfrac13\pi r^2h$

        ⚠️ $\dfrac13$ 곱하는 것을 자주 잊어요!` },
      { id: 'c3', t: '구의 부피', b: T_`반지름이 $r$인 구
        $$V=\dfrac43\pi r^3\qquad S=4\pi r^2$$

        부피는 **3제곱**, 겉넓이는 **제곱**이에요.
        예) $r=3$: $V=\dfrac43\pi\times27=36\pi$` },
    ],
    gens: [
      { id: 'prism', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.int(2, 9), b = R.int(2, 9), h = R.int(2, 9);
        if (R.chance(0.5)) return { q: `밑면이 가로 ${a}cm, 세로 ${b}cm이고 높이가 ${h}cm인 직육면체의 부피는?`, a: a * b * h, unit: 'cm³', wrong: [a * b + h, 2 * (a * b + b * h + h * a), a * b * h * 2], why: `(밑넓이)×(높이)=$${a}\\times${b}\\times${h}=${a * b * h}$` };
        const r = R.int(2, 7);
        return { q: `밑면의 반지름이 ${r}cm, 높이가 ${h}cm인 원기둥의 부피는?`, a: r * r * h, suf: '\\pi', unit: 'cm³', wrong: [r * h, 2 * r * h, r * r * h * 3], why: `$\\pi r^2h=\\pi\\times${r}^2\\times${h}=${r * r * h}\\pi$` };
      } },
      { id: 'pyr', lv: [2, 5], card: 'c2', make: (R, lv) => {
        if (R.chance(0.5)) {
          const a = R.int(2, 9) * (R.chance(0.5) ? 1 : 1), b = R.int(2, 9), h = R.int(1, 5) * 3;
          const v = (a * b * h) / 3;
          return { q: `밑면이 가로 ${a}cm, 세로 ${b}cm인 직사각형이고 높이가 ${h}cm인 사각뿔의 부피는?`, a: v, unit: 'cm³', wrong: [a * b * h, v * 2, a * b + h], why: `뿔의 부피는 (밑넓이)×(높이)×$\\frac13$\n$\\frac13\\times${a * b}\\times${h}=${v}$` };
        }
        const r = R.int(2, 7), h = R.int(1, 5) * 3;
        return { q: `밑면의 반지름이 ${r}cm, 높이가 ${h}cm인 원뿔의 부피는?`, a: (r * r * h) / 3, suf: '\\pi', unit: 'cm³', wrong: [r * r * h, (r * r * h) / 3 + 3, r * h], why: `$\\frac13\\pi r^2h=\\frac13\\pi\\times${r * r}\\times${h}=${(r * r * h) / 3}\\pi$` };
      } },
      { id: 'sphere', lv: [3, 5], card: 'c3', make: (R) => {
        const r = R.pick([3, 6, 9]);
        const v = (4 * r ** 3) / 3;
        return { q: `반지름이 ${r}cm인 구의 부피는?`, a: v, suf: '\\pi', unit: 'cm³', wrong: [4 * r * r, v * 3, 2 * r ** 3], why: `$\\frac43\\pi r^3=\\frac43\\pi\\times${r ** 3}=${v}\\pi$` };
      } },
      { id: 'cmp', lv: [4, 5], card: 'c2', make: (R) => {
        const r = R.pick([3, 6]);
        const cyl = r * r * 2 * r; // 지름=높이=2r 인 원기둥
        const cone = cyl / 3, sph = (4 * r ** 3) / 3;
        return { q: `반지름이 ${r}cm인 구가 꼭 들어가는 원기둥(높이 ${2 * r}cm)이 있어요. 이 원기둥의 부피에서 구의 부피를 뺀 값은?`, a: cyl - sph, suf: '\\pi', unit: 'cm³', wrong: [sph, cyl, cyl + sph], why: `원기둥 $\\pi r^2h=\\pi\\times${r * r}\\times${2 * r}=${cyl}\\pi$\n구 $\\frac43\\pi r^3=${sph}\\pi$\n차 $${cyl}\\pi-${sph}\\pi=${cyl - sph}\\pi$` };
      } },
    ],
  },

  // ───────────── 자료의 정리와 해석 ─────────────
  {
    id: 'm1.stemleaf',
    lesson: [
      { id: 'c1', t: '줄기와 잎 그림', b: T_`자료를 **줄기**(앞자리)와 **잎**(끝자리)으로 나눠 나타낸 그림이에요.

        | 줄기 | 잎 |
        | 5 | 2 6 8 |
        | 6 | 0 3 |

        → 52, 56, 58, 60, 63 (모두 5개)

        잎은 **크기순**으로 쓰고, 줄기 한 칸에 잎을 모두 적어요.` },
      { id: 'c2', t: '도수분포표', b: T_`자료의 개수가 많을 땐 **구간**으로 나눠 세요.

        - ==계급==: 나눈 구간 (예: 50 이상 60 미만)
        - ==계급의 크기==: 구간의 폭 (60−50=10)
        - ==도수==: 각 계급에 속하는 자료의 개수
        - ==계급값==: 계급의 가운데 값 (예: 50 이상 60 미만 → 55)

        **도수의 총합 = 전체 자료의 개수**` },
    ],
    gens: [
      { id: 'read', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const stems = R.sample([1, 2, 3, 4, 5, 6], 3).sort((a, b) => a - b);
        const leaves = stems.map(() => R.sample([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], R.int(2, 5)).sort((a, b) => a - b));
        let s = T(20, 14, '줄기', 'f-tick', 'start') + T(70, 14, '잎', 'f-tick', 'start');
        stems.forEach((st, i) => { s += T(30, 40 + i * 24, String(st), 'f-txt') + L(48, 28 + i * 24, 48, 52 + i * 24, 'f-axis') + T(60, 40 + i * 24, leaves[i].join('  '), 'f-txt', 'start'); });
        const total = leaves.reduce((a, l) => a + l.length, 0);
        const all = stems.flatMap((st, i) => leaves[i].map((l) => st * 10 + l));
        const kind = R.pick(['n', 'max', 'min', 'cls']);
        const f = svgRaw(230, 100, s);
        if (kind === 'n') return { q: '줄기와 잎 그림에서 전체 자료의 개수는? (줄기 5, 잎 3 → 53)', fig: f, a: total, unit: '개', wrong: [total + 1, total - 1, stems.length], why: '잎의 개수를 모두 세요.' };
        if (kind === 'max') return { q: '가장 큰 값은? (줄기 5, 잎 3 → 53)', fig: f, a: Math.max(...all), wrong: [Math.min(...all), Math.max(...all) - 1, stems[stems.length - 1]], why: '마지막 줄기의 가장 오른쪽 잎을 읽어요.' };
        if (kind === 'min') return { q: '가장 작은 값은? (줄기 5, 잎 3 → 53)', fig: f, a: Math.min(...all), wrong: [Math.max(...all), Math.min(...all) + 1, stems[0]], why: '첫 줄기의 가장 왼쪽 잎을 읽어요.' };
        const k = R.int(0, stems.length - 1);
        return { q: `${stems[k] * 10} 이상 ${stems[k] * 10 + 10} 미만인 자료의 개수는? (줄기 5, 잎 3 → 53)`, fig: f, a: leaves[k].length, unit: '개', wrong: [leaves[k].length + 1, leaves[k].length - 1 || 6, total], why: `줄기가 ${stems[k]}인 행의 잎 개수예요.` };
      } },
      { id: 'table', lv: [2, 5], card: 'c2', make: (R, lv) => {
        const size = R.pick([5, 10]); const lo = R.pick([40, 50, 60]);
        const kind = R.pick(['size', 'mid', 'sum', 'freq']);
        if (kind === 'size') return { q: `계급이 ${lo} 이상 ${lo + size} 미만, ${lo + size} 이상 ${lo + 2 * size} 미만, …으로 나뉘어 있어요. 계급의 크기는?`, a: size, wrong: [size * 2, lo, lo + size], why: `계급의 크기는 구간의 폭이에요. $${lo + size}-${lo}=${size}$` };
        if (kind === 'mid') { const c = lo + R.int(0, 3) * size; return { q: `계급 ${c} 이상 ${c + size} 미만의 계급값은?`, a: c + size / 2, wrong: [c, c + size, size / 2], why: `계급값은 양 끝의 평균이에요. $\\dfrac{${c}+${c + size}}{2}=${c + size / 2}$` }; }
        const fr = [R.int(2, 8), R.int(3, 10), R.int(4, 12), R.int(2, 8)];
        const tot = fr.reduce((a, b) => a + b, 0);
        if (kind === 'sum') return { q: `도수분포표에서 도수가 ${fr.join(', ')}일 때 전체 학생 수는?`, a: tot, unit: '명', wrong: [tot - 1, tot + 2, Math.max(...fr)], why: `도수의 총합이 전체 자료의 개수예요. $${fr.join('+')}=${tot}$` };
        const miss = R.int(0, 3);
        return { q: `전체 학생이 ${tot}명인 도수분포표에서 도수가 ${fr.filter((_, i) => i !== miss).join(', ')}명인 세 계급이 있고 나머지 한 계급의 도수는 □명이에요. □에 알맞은 수는?`, a: fr[miss], unit: '명', wrong: [tot, fr[miss] + 1, Math.abs(fr[miss] - 2) || 9], why: `도수의 총합이 ${tot}이므로 □ $=${tot}-(${fr.filter((_, i) => i !== miss).join('+')})=${fr[miss]}$` };
      } },
    ],
  },
  {
    id: 'm1.hist',
    lesson: [
      { id: 'c1', t: '히스토그램', b: T_`도수분포표를 **직사각형**으로 나타낸 그래프예요.

        - 가로: 계급, 세로: 도수
        - 직사각형의 가로 길이는 계급의 크기로 **모두 같아요**
        - 직사각형들을 붙여서 그려요

        ==직사각형의 넓이의 합== = (계급의 크기) $\times$ (도수의 총합)` },
      { id: 'c2', t: '도수분포다각형', b: T_`히스토그램에서 **각 직사각형 윗변의 가운데 점**(=계급값 위의 점)을 선분으로 이은 그래프예요.

        - 양 끝에는 도수가 0인 계급이 하나씩 더 있다고 보고 가로축까지 이어요.
        - 도수분포다각형과 가로축으로 둘러싸인 넓이는 히스토그램의 넓이의 합과 **같아요**.

        여러 자료를 한 번에 **비교**할 때 좋아요.` },
    ],
    gens: [
      { id: 'read', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const start = R.pick([40, 50, 60]); const size = 10;
        const n = R.int(4, 5);
        const vals = Array.from({ length: n }, () => R.int(1, 9));
        const labels = vals.map((_, i) => String(start + i * size));
        const f = barChart({ values: vals, labels, w: 320, h: 170, unit: '(점)', ymax: 10 });
        const k = R.int(0, n - 1);
        const kind = R.pick(['freq', 'total', 'max']);
        if (kind === 'freq') return { q: `히스토그램(가로: 시험 점수 — 각 막대 아래 숫자는 계급의 시작값, 계급의 크기는 10점, 세로: 학생 수)에서 ${start + k * size}점 이상 ${start + (k + 1) * size}점 미만인 학생은 몇 명일까요?`, fig: f, a: vals[k], unit: '명', wrong: [vals[k] + 1, vals[k] - 1 || 8, size], why: `해당 직사각형의 높이를 읽어요. $${vals[k]}$명` };
        if (kind === 'total') return { q: '히스토그램에서 전체 학생 수는? (계급의 크기는 10점, 세로: 학생 수)', fig: f, a: vals.reduce((a, b) => a + b, 0), unit: '명', wrong: [Math.max(...vals), vals.reduce((a, b) => a + b, 0) + 2, n], why: `모든 직사각형의 높이(도수)를 더해요. $${vals.join('+')}=${vals.reduce((a, b) => a + b, 0)}$` };
        const m = vals.indexOf(Math.max(...vals));
        if (vals.filter((v) => v === Math.max(...vals)).length > 1) return { q: '히스토그램에서 직사각형의 가로 길이는 무엇을 나타낼까요?', correct: '계급의 크기', wrong: ['도수', '계급값', '상대도수'], why: '가로 길이 = 계급의 크기, 세로 길이 = 도수예요.' };
        return { q: `도수가 가장 큰 계급은? (각 막대 아래 숫자는 계급의 시작값, 계급의 크기 10점)`, fig: f, correct: `${start + m * size}점 이상 ${start + (m + 1) * size}점 미만`, wrong: [0, 1, 2, 3, 4].filter((i) => i !== m && i < n).slice(0, 3).map((i) => `${start + i * size}점 이상 ${start + (i + 1) * size}점 미만`), why: '가장 높은 직사각형의 계급이에요.' };
      } },
      { id: 'area', lv: [3, 5], card: 'c1', make: (R) => {
        const size = R.pick([5, 10]); const tot = R.int(10, 40);
        return { q: `계급의 크기가 ${size}이고 도수의 총합이 ${tot}인 히스토그램에서 모든 직사각형의 넓이의 합은?`, a: size * tot, wrong: [tot, size + tot, size * tot / 2], why: `(계급의 크기)×(도수의 총합)=$${size}\\times${tot}=${size * tot}$` };
      } },
      { id: 'poly', lv: [2, 4], card: 'c2', make: (R) => {
        const items = [
          ['도수분포다각형을 그릴 때 점을 찍는 위치는?', '각 직사각형 윗변의 가운데 (계급값 위)', ['각 직사각형의 왼쪽 위 꼭짓점', '각 직사각형의 오른쪽 위 꼭짓점', '각 계급의 시작값 위']],
          ['도수분포다각형의 양 끝은 어떻게 이을까요?', '도수가 0인 계급을 하나씩 더 두고 가로축까지 잇는다', ['마지막 점에서 그냥 멈춘다', '위로 올린다', '그리지 않는다']],
          ['두 반의 시험 성적 분포를 한 그래프에서 비교하기 좋은 것은?', '도수분포다각형', ['도수분포표', '줄기와 잎 그림', '표 하나씩']],
        ];
        const it = R.pick(items);
        return { q: it[0], correct: it[1], wrong: it[2], why: '도수분포다각형은 직사각형 윗변의 가운데 점을 이어서 만들고, 양 끝은 도수가 0인 계급까지 이어요.' };
      } },
    ],
  },
  {
    id: 'm1.relfreq',
    lesson: [
      { id: 'c1', t: '상대도수란?', b: T_`전체에서 그 계급이 **차지하는 비율**이에요.

        $$(\text{상대도수})=\dfrac{(\text{그 계급의 도수})}{(\text{도수의 총합})}$$

        - 상대도수의 총합은 항상 $1$
        - 도수 $=$ 상대도수 $\times$ 도수의 총합
        - 백분율로 바꾸려면 $100$을 곱해요 (0.35 → 35%)` },
      { id: 'c2', t: '언제 쓸까?', b: T_`전체 자료의 개수가 **다른** 두 집단을 비교할 때, 도수만 보면 불공평해요. 이때 ==상대도수==로 비교해야 정확해요.

        예) A반(20명) 중 10명, B반(40명) 중 16명이 안경을 썼다면
        A반 $\dfrac{10}{20}=0.5$, B반 $\dfrac{16}{40}=0.4$ → A반의 비율이 더 높아요. (도수는 B가 더 적어도!)` },
    ],
    gens: [
      { id: 'calc', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const tot = R.pick([20, 25, 40, 50]); const f = R.int(2, Math.floor(tot / 2));
        return { q: `전체 도수가 ${tot}이고 어떤 계급의 도수가 ${f}일 때, 이 계급의 상대도수는?`, a: r3(f / tot), fmt: 'dec', wrong: [r3((f + 1) / tot), r3((f + 2) / tot), r3((tot - f) / tot)], why: `(상대도수)=(도수)÷(도수의 총합)=$\\dfrac{${f}}{${tot}}=${r3(f / tot)}$` };
      } },
      { id: 'inv', lv: [2, 4], card: 'c1', make: (R) => {
        const tot = R.pick([20, 25, 40, 50]); const f = R.int(2, Math.floor(tot / 2));
        const rf = r3(f / tot);
        return { q: `도수의 총합이 ${tot}이고 어떤 계급의 상대도수가 ${rf}일 때, 이 계급의 도수는?`, a: f, wrong: [tot - f, f + 2, f - 1 > 0 ? f - 1 : f + 3], why: `(도수)=(상대도수)×(도수의 총합)=$${rf}\\times${tot}=${f}$` };
      } },
      { id: 'sum', lv: [2, 5], card: 'c1', make: (R) => {
        const parts = R.sample([0.1, 0.15, 0.2, 0.25, 0.3, 0.05], 3);
        const known = parts.reduce((a, b) => a + b, 0);
        const miss = r3(1 - known);
        if (miss <= 0) return { q: '상대도수의 총합은?', a: 1, fmt: 'dec', wrong: [0, 100, 10], why: '상대도수의 총합은 항상 1이에요.' };
        return { q: `상대도수가 ${parts.join(', ')}인 세 계급이 있고 나머지 한 계급이 □일 때 전체 계급은 이 네 개뿐이에요. □에 알맞은 수는?`, a: miss, fmt: 'dec', wrong: [r3(known), r3(1 - known + 0.1), 1], why: `상대도수의 총합은 $1$이므로 □ $=1-${r3(known)}=${miss}$` };
      } },
      { id: 'cmp', lv: [3, 5], card: 'c2', make: (R) => {
        const na = R.pick([20, 25, 40]), nb = R.pick([50, 60, 80, 100].filter((v) => v !== na));
        const fa = R.int(Math.ceil(na * 0.2), Math.floor(na * 0.6)), fb = R.int(Math.ceil(nb * 0.2), Math.floor(nb * 0.6));
        const ra = fa / na, rb = fb / nb;
        if (Math.abs(ra - rb) < 0.02) return { q: '전체 자료의 개수가 서로 다른 두 집단을 비교할 때 알맞은 것은?', correct: '상대도수', wrong: ['도수', '계급의 크기', '계급값'], why: '개수가 다른 집단은 비율인 상대도수로 비교해요.' };
        const ans = ra > rb ? 'A반' : 'B반';
        return { q: `A반은 ${na}명 중 ${fa}명, B반은 ${nb}명 중 ${fb}명이 안경을 썼어요. 안경을 쓴 학생의 비율이 더 높은 반은?`, correct: ans, wrong: [ans === 'A반' ? 'B반' : 'A반', '같다'], why: `A반 $\\dfrac{${fa}}{${na}}=${r3(ra)}$, B반 $\\dfrac{${fb}}{${nb}}=${r3(rb)}$\n상대도수가 더 큰 ${ans}[이/가] 비율이 더 높아요.` };
      } },
    ],
  },
];
