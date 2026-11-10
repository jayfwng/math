// 중1 ③ 기본 도형 · 작도와 합동
import { paren } from '../js/lib.js';
import { svgRaw, fig } from '../js/fig.js';

const { L, T, C } = fig;
const T_ = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();

// ── 그림 도우미 ──
// 직육면체: 앞면 A B C D(좌상, 우상, 우하, 좌하), 뒷면 E F G H
const CUBE = { A: [30, 60], B: [120, 60], C: [120, 140], D: [30, 140], E: [70, 28], F: [160, 28], G: [160, 108], H: [70, 108] };
const EDGES = ['AB', 'BC', 'CD', 'DA', 'EF', 'FG', 'GH', 'HE', 'AE', 'BF', 'CG', 'DH'];
const DIR = { AB: 'x', CD: 'x', EF: 'x', GH: 'x', BC: 'y', DA: 'y', FG: 'y', HE: 'y', AE: 'z', BF: 'z', CG: 'z', DH: 'z' };
const FACES = { ABCD: 'ABCD', EFGH: 'EFGH', ABFE: 'ABFE', DCGH: 'DCGH', ADHE: 'ADHE', BCGF: 'BCGF' };
function cubeFig(extra = '') {
  let s = '';
  const hid = new Set(['EH', 'HE', 'GH', 'HG', 'DH', 'HD']);
  for (const e of EDGES) {
    const a = CUBE[e[0]], b = CUBE[e[1]];
    const hidden = hid.has(e);
    s += `<line class="${hidden ? 'f-line f-dash' : 'f-line'}" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"${hidden ? ' stroke-dasharray="4 3"' : ''}/>`;
  }
  const off = { A: [-10, -4], B: [10, 4], C: [10, 8], D: [-10, 8], E: [-8, -9], F: [10, -8], G: [10, 8], H: [-10, 6] };
  for (const k of Object.keys(CUBE)) s += T(CUBE[k][0] + off[k][0], CUBE[k][1] + off[k][1], k, 'f-name');
  return svgRaw(190, 170, s + extra);
}
const share = (e1, e2) => e1[0] === e2[0] || e1[0] === e2[1] || e1[1] === e2[0] || e1[1] === e2[1];
const rel = (e1, e2) => (e1 === e2 ? 'same' : share(e1, e2) ? 'meet' : DIR[e1] === DIR[e2] ? 'para' : 'skew');
const fmtE = (e) => `$\\overline{${e}}$`;
const normE = (e) => (EDGES.includes(e) ? e : e[1] + e[0]);

// 직선 두 개가 한 점에서 만나는 그림. 각도 라벨 4개 (오른쪽 → 반시계)
function crossFig(theta, labels) {
  const cx = 110, cy = 80, R = 66;
  const rad = (d) => (d * Math.PI) / 180;
  let s = '';
  for (const a of [0, theta]) {
    s += L(cx - R * Math.cos(rad(a)), cy + R * Math.sin(rad(a)), cx + R * Math.cos(rad(a)), cy - R * Math.sin(rad(a)));
  }
  const mid = [theta / 2, theta + (180 - theta) / 2, 180 + theta / 2, 180 + theta + (180 - theta) / 2];
  mid.forEach((m, i) => { if (labels[i]) s += T(cx + 36 * Math.cos(rad(m)), cy - 36 * Math.sin(rad(m)), labels[i], 'f-ang'); });
  return svgRaw(220, 160, s);
}

// 평행선 l, m 과 한 직선(기울기 양수)이 만나는 그림. labels: {'0-UR': 'x', ...}
const QPOS = { UR: [1, -1], UL: [-1, -1], LL: [-1, 1], LR: [1, 1] };
const OPP = { UR: 'LL', LL: 'UR', UL: 'LR', LR: 'UL' };
function parFig(labels, theta = 60) {
  const y1 = 55, y2 = 120, rad = (d) => (d * Math.PI) / 180;
  const dx = (y2 - y1) / Math.tan(rad(theta));
  const x1 = 140, x2 = x1 - dx; // 아래 교점이 더 왼쪽
  let s = L(20, y1, 260, y1) + L(20, y2, 260, y2);
  s += L(x2 - 0.3 * dx, y2 + 0.3 * (y2 - y1), x1 + 0.3 * dx, y1 - 0.3 * (y2 - y1));
  s += T(268, y1, 'l', 'f-name') + T(268, y2, 'm', 'f-name');
  for (const [k, lab] of Object.entries(labels)) {
    const [i, q] = k.split('-'); const [sx, sy] = QPOS[q];
    const px = i === '0' ? x1 : x2, py = i === '0' ? y1 : y2;
    s += T(px + sx * 26, py + sy * 13, lab, 'f-ang');
  }
  return svgRaw(290, 175, s);
}
const qMeasure = (q, th) => (q === 'UR' || q === 'LL' ? th : 180 - th);

export default [
  {
    id: 'm1.geobasic',
    lesson: [
      { id: 'c1', t: '점, 선, 면 · 교점과 교선', b: T_`도형의 기본은 **점·선·면**이에요. 선은 점이 움직인 자리, 면은 선이 움직인 자리예요.

        - ==교점==: 선과 선, 또는 선과 면이 만나는 **점** (입체도형에서 꼭짓점)
        - ==교선==: 면과 면이 만나는 **선** (입체도형에서 모서리)

        직육면체는 교점(꼭짓점) $8$개, 교선(모서리) $12$개예요.` },
      { id: 'c2', t: '직선 · 반직선 · 선분', b: T_`- ==직선== $\overleftrightarrow{AB}$: 양쪽으로 끝없이 뻗는 선. $\overleftrightarrow{AB}=\overleftrightarrow{BA}$
        - ==반직선== $\overrightarrow{AB}$: A에서 시작해 B 방향으로 끝없이. $\overrightarrow{AB}\ne\overrightarrow{BA}$ (시작점이 달라요!)
        - ==선분== $\overline{AB}$: A와 B 사이의 곧은 선. $\overline{AB}=\overline{BA}$

        한 점을 지나는 직선은 무수히 많지만, **서로 다른 두 점**을 지나는 직선은 하나뿐이에요.` },
      { id: 'c3', t: '두 점 사이의 거리와 중점', b: T_`두 점 A, B를 잇는 **선분 AB의 길이**가 두 점 사이의 거리예요.

        선분 AB의 한가운데 점 M을 ==중점==이라 해요.
        $\overline{AM}=\overline{MB}=\dfrac12\overline{AB}$

        예) $\overline{AB}=12$이면 $\overline{AM}=6$` },
    ],
    gens: [
      { id: 'count', lv: [1, 2], card: 'c1', make: (R) => {
        const sh = R.pick([['정육면체', 8, 12], ['직육면체', 8, 12], ['삼각기둥', 6, 9], ['사각뿔', 5, 8], ['삼각뿔', 4, 6], ['오각기둥', 10, 15]]);
        const asked = R.pick(['교점', '교선']);
        return { q: `${sh[0]}에서 ${asked === '교점' ? '교점(꼭짓점)' : '교선(모서리)'}의 개수는?`, a: asked === '교점' ? sh[1] : sh[2], unit: '개', why: `${asked === '교점' ? '꼭짓점이 교점' : '모서리가 교선'}이에요. ${sh[0]}의 꼭짓점은 ${sh[1]}개, 모서리는 ${sh[2]}개예요.` };
      } },
      { id: 'same', lv: [1, 3], card: 'c2', make: (R) => {
        const forms = [
          ['$\\overleftrightarrow{AB}=\\overleftrightarrow{BA}$', '직선은 방향이 없어서 같아요.'],
          ['$\\overline{AB}=\\overline{BA}$', '선분은 양 끝점이 같아서 같아요.'],
        ];
        const ok = R.pick(forms);
        return { q: '다음 중 옳은 것은?', correct: ok[0], wrong: ['$\\overrightarrow{AB}=\\overrightarrow{BA}$', '$\\overrightarrow{AB}=\\overline{AB}$', '$\\overleftrightarrow{AB}=\\overline{AB}$'], why: `${ok[1]}\n반직선은 시작점과 방향이 다르면 다른 도형이고, 직선·반직선·선분도 서로 다른 도형이에요.` };
      } },
      { id: 'mid', lv: [2, 5], card: 'c3', make: (R, lv) => {
        const half = R.int(2, 9) * (lv >= 4 ? 2 : 1);
        const ab = half * 2;
        if (lv <= 3) {
          return { q: `점 M이 $\\overline{AB}$의 중점이에요. $\\overline{AB}=${ab}$cm일 때 $\\overline{AM}$의 길이는?`, a: half, unit: 'cm', wrong: [ab, ab + half, half + 2], why: `중점이므로 $\\overline{AM}=\\frac12\\overline{AB}=${half}$cm` };
        }
        const q4 = half / 2; // AN
        return { q: `점 M이 $\\overline{AB}$의 중점, 점 N이 $\\overline{AM}$의 중점이에요. $\\overline{AB}=${ab}$cm일 때 $\\overline{NB}$의 길이는?`, a: ab - q4, unit: 'cm', wrong: [half, q4, ab - half], why: `$\\overline{AM}=${half}$, $\\overline{AN}=${q4}$[이므로/므로]\n$\\overline{NB}=${ab}-${q4}=${ab - q4}$` };
      } },
      { id: 'lines', lv: [3, 5], card: 'c2', make: (R, lv) => {
        const n = R.int(3, 7);
        if (lv <= 4) return { q: `어느 세 점도 한 직선 위에 있지 않은 점 ${n}개가 있어요. 이 중 두 점을 지나는 서로 다른 직선은 모두 몇 개일까요?`, a: (n * (n - 1)) / 2, unit: '개', wrong: [n * (n - 1), n, n * n], why: `점 하나에서 나머지 ${n - 1}개로 직선을 그으면 ${n}×${n - 1}개인데, 같은 직선이 두 번씩 세어져요.\n$\\dfrac{${n}\\times${n - 1}}{2}=${(n * (n - 1)) / 2}$` };
        return { q: `어느 세 점도 한 직선 위에 있지 않은 점 ${n}개가 있어요. 이 중 두 점을 골라 만들 수 있는 서로 다른 **반직선**은 모두 몇 개일까요?`, a: n * (n - 1), unit: '개', wrong: [(n * (n - 1)) / 2, n, n * n], why: `반직선은 $\\overrightarrow{AB}$와 $\\overrightarrow{BA}$가 서로 달라서 직선의 2배예요.\n$${n}\\times${n - 1}=${n * (n - 1)}$` };
      } },
    ],
  },
  {
    id: 'm1.angle',
    lesson: [
      { id: 'c1', t: '각의 종류', b: T_`- ==예각==: $0^\circ$보다 크고 $90^\circ$보다 작은 각
        - ==직각==: $90^\circ$
        - ==둔각==: $90^\circ$보다 크고 $180^\circ$보다 작은 각
        - ==평각==: $180^\circ$ (일직선)

        한 직선 위에 있는 각의 합은 평각 $180^\circ$예요.
        ==보각==: 합이 $180^\circ$인 두 각 / ==여각==: 합이 $90^\circ$인 두 각` },
      { id: 'c2', t: '맞꼭지각', b: T_`두 직선이 한 점에서 만날 때 생기는 마주 보는 각을 ==맞꼭지각==이라고 해요.

        ==맞꼭지각의 크기는 서로 같아요.==
        $\angle a=\angle c,\quad \angle b=\angle d$

        이웃한 두 각은 합이 $180^\circ$예요. $\angle a+\angle b=180^\circ$` },
      { id: 'c3', t: '수직과 수선', b: T_`두 직선이 만나서 이루는 각이 직각($90^\circ$)이면 서로 ==수직==이라 하고, $AB\perp CD$로 써요.

        - ==수선==: 직선 위에 수직으로 만나는 직선
        - ==수선의 발==: 수선과 직선이 만나는 점
        - ==점과 직선 사이의 거리==: 점에서 직선에 내린 수선의 발까지의 길이 (가장 짧은 거리!)
        - ==수직이등분선==: 선분의 중점을 지나면서 수직인 직선` },
    ],
    gens: [
      { id: 'kind', lv: [1, 2], card: 'c1', make: (R) => {
        const t = R.pick(['예각', '직각', '둔각', '평각']);
        const val = { 예각: R.int(10, 85), 직각: 90, 둔각: R.int(95, 175), 평각: 180 }[t];
        return { q: `$${val}^\\circ$인 각은 어떤 각일까요?`, correct: t, wrong: ['예각', '직각', '둔각', '평각'].filter((x) => x !== t), why: `$0^\\circ$<예각<$90^\\circ$, 직각=$90^\\circ$, $90^\\circ$<둔각<$180^\\circ$, 평각=$180^\\circ$` };
      } },
      { id: 'supp', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.int(15, 80);
        if (R.chance(0.5)) return { q: `$${a}^\\circ$의 **여각**의 크기는?`, a: 90 - a, unit: '°', wrong: [180 - a, 90 + a, a], why: `여각은 합이 $90^\\circ$인 각이에요. $90-${a}=${90 - a}$` };
        return { q: `$${a}^\\circ$의 **보각**의 크기는?`, a: 180 - a, unit: '°', wrong: [90 - a, 90 + a, 360 - a], why: `보각은 합이 $180^\\circ$인 각이에요. $180-${a}=${180 - a}$` };
      } },
      { id: 'flat', lv: [2, 4], card: 'c1', make: (R) => {
        const a = R.int(20, 60), b = R.int(20, 60), x = 180 - a - b;
        const cx = 110, cy = 110, R0 = 80, rad = (d) => (d * Math.PI) / 180;
        let s = L(20, cy, 200, cy);
        const angs = [0, a, a + b, 180];
        for (const d of [a, a + b]) s += L(cx, cy, cx + R0 * Math.cos(rad(180 - d)), cy - R0 * Math.sin(rad(180 - d)));
        const labs = [`${a}°`, `${b}°`, 'x'];
        const edges = [0, a, a + b, 180];
        labs.forEach((t, i) => { const m = (edges[i] + edges[i + 1]) / 2; s += T(cx + 40 * Math.cos(rad(180 - m)), cy - 40 * Math.sin(rad(180 - m)), t, 'f-ang'); });
        return { q: '그림에서 $\\angle x$의 크기는?', fig: svgRaw(220, 130, s), a: x, unit: '°', wrong: [a + b, 90 - a - b > 0 ? 90 - a - b : 100, 360 - a - b], why: `한 직선 위의 각의 합은 $180^\\circ$예요.\n$${a}+${b}+x=180$ → $x=${x}$` };
      } },
      { id: 'vert', lv: [2, 5], card: 'c2', make: (R, lv) => {
        const theta = R.int(30, 75) * 1;
        if (lv <= 3) return { q: '두 직선이 만날 때, 그림에서 $\\angle x$의 크기는?', fig: crossFig(theta, [`${theta}°`, '', 'x', '']), a: theta, unit: '°', wrong: [180 - theta, 90 - theta, 90], why: `$x$와 $${theta}^\\circ$[은/는] 맞꼭지각이라 크기가 같아요. $x=${theta}$` };
        const x = R.int(5, 20), k = R.int(2, 4), c1 = R.int(5, 25), d = R.int(1, 3);
        const e = c1 - d * x;
        return { q: `두 직선이 만날 때 맞꼭지각이 $(${k}x+${c1})^\\circ$, $(${k + d}x${e >= 0 ? '+' : '-'}${Math.abs(e)})^\\circ$예요. $x$의 값은?`, a: x, wrong: [x + 5, x + 7, k * x + c1], why: `맞꼭지각은 같으므로\n$${k}x+${c1}=${k + d}x${e >= 0 ? '+' : '-'}${Math.abs(e)}$\n$${d}x=${c1 - e}$ → $x=${x}$` };
      } },
      { id: 'perp', lv: [2, 4], card: 'c3', make: (R) => {
        const items = [
          ['점 A에서 직선 $l$에 내린 수선의 발을 H라 할 때, 점 A와 직선 $l$ 사이의 거리는?', '$\\overline{AH}$의 길이', ['점 A에서 $l$ 위의 임의의 점까지의 거리', '$\\overline{AH}$의 길이의 절반', '$l$ 위의 두 점 사이의 거리'], '점과 직선 사이의 거리는 수선의 발까지의 길이예요. 이 길이가 가장 짧아요.'],
          ['선분 AB의 중점을 지나고 AB에 수직인 직선을 무엇이라 할까요?', '수직이등분선', ['수선의 발', '각의 이등분선', '평행선'], '"수직"으로 만나면서 "이등분(반으로)" 하는 선이에요.'],
          ['한 점에서 직선에 그을 수 있는 수선의 개수는?', '1개', ['무수히 많다', '2개', '0개'], '직선 밖의 한 점에서 그 직선에 내린 수선은 단 하나예요.'],
        ];
        const it = R.pick(items);
        return { q: it[0], correct: it[1], wrong: it[2], why: it[3] };
      } },
    ],
  },
  {
    id: 'm1.position',
    lesson: [
      { id: 'c1', t: '평면에서 두 직선', b: T_`한 평면에서 두 직선은
        - 한 점에서 **만난다**
        - **평행하다** ($l\parallel m$, 만나지 않음)
        - **일치한다**

        세 가지 중 하나예요. 평행한 두 직선은 어디까지 늘려도 만나지 않아요.` },
      { id: 'c2', t: '공간에서 두 직선 — 꼬인 위치', b: T_`공간에서 두 직선의 위치 관계는 4가지예요.
        1. 한 점에서 만난다
        2. 평행하다
        3. 일치한다
        4. ==꼬인 위치== — **만나지도 않고 평행하지도 않아요.** (한 평면 위에 있지 않아요)

        직육면체의 한 모서리를 기준으로 보면
        - 만나는 모서리 $4$개
        - 평행한 모서리 $3$개
        - 꼬인 위치의 모서리 $4$개` },
      { id: 'c3', t: '직선과 평면, 평면과 평면', b: T_`**직선과 평면**: 한 점에서 만난다 / 평행하다 / 직선이 평면에 포함된다

        **평면과 평면**: 한 직선에서 만난다 / 평행하다 / 일치한다

        직육면체의 한 면을 기준으로
        - 평행한 면 $1$개, 수직인 면 $4$개
        - 평행한 모서리 $4$개 (맞은편 면의 모서리), 수직인 모서리 $4$개` },
    ],
    gens: [
      { id: 'plane', lv: [1, 2], card: 'c1', make: (R) => {
        return { q: '한 평면에서 두 직선의 위치 관계가 **될 수 없는** 것은?', correct: '꼬인 위치', wrong: ['한 점에서 만난다', '평행하다', '일치한다'], why: '꼬인 위치는 한 평면 위에 있지 않은 두 직선에서만 가능해요. 한 평면 안에서는 만나거나 평행하거나 일치해요.' };
      } },
      { id: 'cnt', lv: [1, 4], card: 'c2', make: (R, lv) => {
        const e = R.pick(EDGES);
        const rn = { meet: '한 점에서 만나는', para: '평행한', skew: '꼬인 위치에 있는' };
        const k = R.pick(['meet', 'para', 'skew']);
        const n = EDGES.filter((x) => rel(e, x) === k).length;
        return { q: `직육면체에서 모서리 ${fmtE(e)}와 ${rn[k]} 모서리는 모두 몇 개일까요?`, fig: cubeFig(), a: n, unit: '개', why: `한 모서리에 대해 만나는 것 4개, 평행한 것 3개, 꼬인 위치 4개예요.\n(12−자기 자신 1−만나는 4−평행 3=꼬인 4)` };
      } },
      { id: 'which', lv: [2, 5], card: 'c2', make: (R, lv) => {
        const e = R.pick(EDGES);
        const ask = lv >= 4 ? 'skew' : R.pick(['skew', 'para', 'meet']);
        const names = { skew: '꼬인 위치에 있는', para: '평행한', meet: '한 점에서 만나는' };
        const pool = (k) => EDGES.filter((x) => rel(e, x) === k);
        const ans = R.pick(pool(ask));
        const others = EDGES.filter((x) => rel(e, x) !== ask && x !== e);
        const wrong = R.sample(others, 3);
        return { q: `직육면체에서 모서리 ${fmtE(e)}와 ${names[ask]} 모서리는?`, fig: cubeFig(), correct: fmtE(ans), wrong: wrong.map(fmtE), why: `${fmtE(e)}와 ${fmtE(ans)}[은/는] ${ask === 'skew' ? '만나지도 평행하지도 않아요. 꼬인 위치예요.' : ask === 'para' ? '방향이 같고 만나지 않아요.' : '한 꼭짓점을 공유해요.'}` };
      } },
      { id: 'face', lv: [3, 5], card: 'c3', make: (R) => {
        const f = R.pick(['ABCD', 'EFGH', 'ABFE', 'DCGH', 'ADHE', 'BCGF']);
        const fv = new Set(f.split(''));
        const edgesIn = (e) => fv.has(e[0]) && fv.has(e[1]);
        const parallelEdges = EDGES.filter((e) => !fv.has(e[0]) && !fv.has(e[1]));
        const perp = EDGES.filter((e) => !edgesIn(e) && (fv.has(e[0]) || fv.has(e[1])));
        const k = R.pick(['para', 'perp']);
        return { q: `직육면체에서 면 ${f}와 ${k === 'para' ? '평행한 모서리' : '수직인 모서리'}는 모두 몇 개일까요?`, fig: cubeFig(), a: k === 'para' ? parallelEdges.length : perp.length, unit: '개', why: k === 'para' ? '맞은편 면 위에 있는 모서리 4개가 평행해요.' : '면에 수직으로 서 있는 모서리 4개가 수직이에요.' };
      } },
    ],
  },
  {
    id: 'm1.parallel',
    lesson: [
      { id: 'c1', t: '동위각과 엇각', b: T_`두 직선 $l, m$이 다른 한 직선과 만날 때
        - ==동위각==: 같은 쪽(위치가 같은) 두 각
        - ==엇각==: 엇갈린 위치(안쪽, 서로 반대쪽)의 두 각

        ==$l\parallel m$이면 동위각의 크기가 같고, 엇각의 크기도 같아요.==

        반대로, 동위각이나 엇각의 크기가 같으면 두 직선은 평행해요.` },
      { id: 'c2', t: '같은 쪽 안쪽의 각 (동측내각)', b: T_`평행선 사이 같은 쪽에 있는 안쪽 두 각은 **합이 $180^\circ$**예요.

        동위각 = 같다 ✅
        엇각 = 같다 ✅
        같은 쪽 안쪽 각 = 합이 $180^\circ$

        모르겠으면 맞꼭지각이나 평각($180^\circ$)을 이용해 한 번 바꿔서 생각하세요.` },
      { id: 'c3', t: '꺾인 선 문제 (보조선)', b: T_`평행한 두 직선 사이에 꺾인 점이 있으면, 꺾인 점을 지나고 평행선에 **평행한 보조선**을 그어요.

        그러면 엇각이 생기고
        $\angle x=\angle a+\angle b$ (꺾인 각 = 양쪽 엇각의 합)` },
    ],
    gens: [
      { id: 'angle', lv: [1, 3], card: 'c1', make: (R, lv) => {
        const th = R.pick([40, 50, 55, 60, 65, 70, 75, 80]);
        const qs = ['UR', 'UL', 'LL', 'LR'];
        const kind = R.pick(lv === 1 ? ['corr', 'alt'] : ['corr', 'alt', 'co']);
        let a1, a2, name;
        if (kind === 'corr') { const q = R.pick(qs); a1 = ['0', q]; a2 = ['1', q]; name = '동위각'; }
        else if (kind === 'alt') { const q = R.pick(['LL', 'LR']); a1 = ['0', q]; a2 = ['1', OPP[q]]; name = '엇각'; }
        else { const q = R.pick(['LL', 'LR']); a1 = ['0', q]; a2 = ['1', q === 'LL' ? 'UL' : 'UR']; name = '같은 쪽 안쪽의 각'; }
        const v1 = qMeasure(a1[1], th), v2 = qMeasure(a2[1], th);
        const labels = { [`${a1[0]}-${a1[1]}`]: `${v1}°`, [`${a2[0]}-${a2[1]}`]: 'x' };
        return { q: `$l\\parallel m$일 때, $\\angle x$와 $${v1}^\\circ$인 각은 ${name}이에요. $\\angle x$의 크기는?`, fig: parFig(labels, th), a: v2, unit: '°', wrong: [180 - v2, v2 === 90 ? 80 : 90 - (v2 % 90), v1 === v2 ? v2 + 10 : v1], why: v1 === v2 ? `${name}[은/는] 평행선에서 크기가 같아요. $x=${v2}$` : `같은 쪽 안쪽의 각은 합이 $180^\\circ$예요. $x=180-${v1}=${v2}$` };
      } },
      { id: 'unknown', lv: [3, 5], card: 'c2', make: (R) => {
        const x = R.int(8, 20), k = R.int(2, 4), c = R.int(5, 30);
        const same = R.chance(0.5);
        const v = k * x + c;
        const other = same ? v : 180 - v;
        const dd = other - x;
        const t2 = dd === 0 ? 'x' : `x${dd >= 0 ? '+' : '-'}${Math.abs(dd)}`;
        return { q: `$l\\parallel m$일 때 ${same ? '엇각' : '같은 쪽 안쪽의 각'}이 $(${k}x+${c})^\\circ$, $(${t2})^\\circ$예요. $x$의 값은?`, a: x, wrong: [x + 3, x - 2, v], why: same ? `엇각은 같으므로 $${k}x+${c}=${t2}$ → $${k - 1}x=${dd - c}$ → $x=${x}$` : `합이 $180^\\circ$이므로 $(${k}x+${c})+(${t2})=180$\n$${k + 1}x=${180 - c - dd}$ → $x=${x}$` };
      } },
      { id: 'bent', lv: [3, 5], card: 'c3', make: (R) => {
        const a = R.int(35, 70), b = R.int(35, 70);
        const rad = (d) => (d * Math.PI) / 180;
        const y1 = 40, y2 = 135, px = 170, py = 88;
        const ux = px - (py - y1) / Math.tan(rad(a)), lx = px - (y2 - py) / Math.tan(rad(b));
        let s = L(10, y1, 240, y1) + L(10, y2, 240, y2) + L(ux, y1, px, py) + L(px, py, lx, y2);
        s += T(250, y1, 'l', 'f-name') + T(250, y2, 'm', 'f-name') + T(px + 12, py, 'P', 'f-name');
        s += T(ux + 30, y1 + 12, `${a}°`, 'f-ang') + T(lx + 30, y2 - 12, `${b}°`, 'f-ang') + T(px - 20, py, 'x', 'f-ang');
        return { q: '$l\\parallel m$일 때 $\\angle x$의 크기는?', fig: svgRaw(270, 170, s), a: a + b, unit: '°', wrong: [180 - a - b, Math.abs(a - b), 360 - a - b], why: `P를 지나 $l$에 평행한 보조선을 그으면 엇각이 생겨요.\n$x=${a}+${b}=${a + b}$` };
      } },
    ],
  },

  // ───────────── 작도와 합동 ─────────────
  {
    id: 'm1.construct',
    lesson: [
      { id: 'c1', t: '작도란?', b: T_`==작도==는 **눈금 없는 자**와 **컴퍼스**만으로 도형을 그리는 거예요.

        - 눈금 없는 자: 두 점을 잇는 **직선을 긋는 것**만 가능 (길이를 재는 건 안 돼요)
        - 컴퍼스: **원을 그리거나 같은 길이를 옮길 때** 사용

        그래서 각도기로 각을 재거나, 자의 눈금으로 길이를 재는 건 작도가 아니에요.` },
      { id: 'c2', t: '삼각형 결정 조건', b: T_`삼각형이 **하나로 정해지는** 경우는 3가지예요.

        1. **세 변**의 길이가 주어질 때
        2. **두 변**의 길이와 그 **끼인각**이 주어질 때
        3. **한 변**의 길이와 그 **양 끝 각**이 주어질 때

        ⚠️ 두 변과 끼인각이 **아닌** 각(예: 두 변과 한 변의 대각)만 주면 삼각형이 둘 이상 나올 수 있어요. 또 세 각만 주면 모양은 같아도 크기가 달라서 정해지지 않아요.` },
      { id: 'c3', t: '삼각형이 만들어지는 조건', b: T_`세 변의 길이가 $a,\ b,\ c$일 때 (가장 긴 변이 $c$)

        ==$c<a+b$== 이어야 삼각형을 만들 수 있어요.

        - $3,\ 4,\ 5$: $5<3+4$ ✅
        - $2,\ 3,\ 6$: $6<2+3$이 아니라서 ❌

        가장 긴 변이 나머지 두 변의 합보다 **작아야** 해요. (같아도 안 돼요, 일직선이 돼요)` },
    ],
    gens: [
      { id: 'tool', lv: [1, 2], card: 'c1', make: (R) => {
        const qs = [
          ['다음 중 작도에서 컴퍼스의 용도로 알맞은 것은?', '선분의 길이를 옮긴다', ['두 점을 잇는 직선을 긋는다', '각도를 잰다', '선분의 길이를 눈금으로 잰다']],
          ['다음 중 눈금 없는 자의 용도는?', '두 점을 지나는 직선을 긋는다', ['선분의 길이를 옮긴다', '원을 그린다', '각의 크기를 잰다']],
          ['다음 중 작도로 할 수 **없는** 것은?', '각도기를 이용해 $35^\\circ$를 그리는 것', ['주어진 선분과 길이가 같은 선분 그리기', '주어진 각과 크기가 같은 각 그리기', '선분의 수직이등분선 그리기']],
        ];
        const q = R.pick(qs);
        return { q: q[0], correct: q[1], wrong: q[2], why: '작도는 눈금 없는 자(직선 긋기)와 컴퍼스(원 그리기, 길이 옮기기)만 써요.' };
      } },
      { id: 'decide', lv: [2, 4], card: 'c2', make: (R) => {
        const ok = R.pick(['세 변의 길이', '두 변의 길이와 그 끼인각의 크기', '한 변의 길이와 그 양 끝 각의 크기']);
        const bad = ['세 각의 크기', '두 변의 길이와 끼인각이 아닌 한 각의 크기', '한 변의 길이와 그 변이 아닌 한 각의 크기'];
        return { q: '다음 중 삼각형 ABC가 하나로 정해지는 조건은?', correct: ok, wrong: bad, why: '삼각형은 (세 변) / (두 변+끼인각) / (한 변+양 끝 각) 중 하나가 주어지면 하나로 정해져요.' };
      } },
      { id: 'exist', lv: [3, 5], card: 'c3', make: (R, lv) => {
        const a = R.int(2, 9), b = R.int(2, 9);
        const ok = [a, b, R.int(Math.abs(a - b) + 1, a + b - 1)];
        const mx = Math.max(a, b);
        const bad1 = [a, b, a + b];
        const bad2 = [a, b, Math.abs(a - b)].filter((v) => v > 0);
        const bad3 = [Math.min(a, b), Math.max(a, b), a + b + R.int(1, 4)];
        const fm = (t) => `$${t.join(',\\ ')}$`;
        if (lv <= 3) {
          const opts = [bad1, bad3, [R.int(1, 3), R.int(1, 3), R.int(7, 12)]].filter((t) => t.length === 3);
          return { q: '다음 중 삼각형의 세 변의 길이가 될 수 **있는** 것은?', correct: fm(ok), wrong: opts.map(fm), why: `가장 긴 변이 나머지 두 변의 합보다 작아야 해요. $${ok.slice().sort((x, y) => x - y).join(',\\ ')}$에서 $${Math.max(...ok)}<${ok.reduce((p, c) => p + c, 0) - Math.max(...ok)}$ ✅` };
        }
        const cnt = a + b - Math.abs(a - b) - 1;
        return { q: `삼각형의 두 변의 길이가 $${a}$, $${b}$일 때, 나머지 한 변의 길이가 될 수 있는 **자연수**는 모두 몇 개일까요?`, a: cnt, unit: '개', wrong: [cnt + 1, cnt - 1 || 3, a + b], why: `나머지 변 $x$는 $|${a}-${b}|<x<${a}+${b}$ → $${Math.abs(a - b)}<x<${a + b}$\n자연수는 ${Math.abs(a - b) + 1}부터 ${a + b - 1}까지 $${cnt}$개예요.` };
      } },
    ],
  },
  {
    id: 'm1.congruent',
    lesson: [
      { id: 'c1', t: '합동이란?', b: T_`모양과 크기가 **똑같아서 완전히 포개지는** 두 도형을 ==합동==이라 하고, $\triangle ABC\equiv\triangle DEF$로 써요.

        - ==대응변==의 길이가 같아요.
        - ==대응각==의 크기가 같아요.

        ⚠️ 이름은 **대응하는 꼭짓점 순서**대로 써요. $\triangle ABC\equiv\triangle DEF$면 A↔D, B↔E, C↔F.` },
      { id: 'c2', t: '삼각형의 합동 조건', b: T_`다음 중 하나가 같으면 두 삼각형은 합동이에요.

        - ==SSS==: 대응하는 **세 변**의 길이가 같다
        - ==SAS==: 대응하는 **두 변**의 길이와 그 **끼인각**의 크기가 같다
        - ==ASA==: 대응하는 **한 변**의 길이와 그 **양 끝 각**의 크기가 같다

        ⚠️ "두 변과 끼인각이 아닌 각"(SSA)은 합동 조건이 아니에요. 세 각만 같은 것(AAA)도 아니에요!` },
    ],
    gens: [
      { id: 'corr', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.int(3, 12), b = R.int(3, 12), c = R.int(Math.abs(a - b) + 1, a + b - 1);
        const A = R.int(30, 80), B = R.int(30, 80);
        const nm = R.pick([['A', 'B', 'C', 'D', 'E', 'F'], ['P', 'Q', 'R', 'X', 'Y', 'Z']]);
        const kind = R.pick(['side', 'angle']);
        if (kind === 'side') {
          return { q: `$\\triangle ${nm[0]}${nm[1]}${nm[2]}\\equiv\\triangle ${nm[3]}${nm[4]}${nm[5]}$이고 $\\overline{${nm[0]}${nm[1]}}=${a}$cm, $\\overline{${nm[1]}${nm[2]}}=${b}$cm, $\\overline{${nm[2]}${nm[0]}}=${c}$cm일 때, $\\overline{${nm[4]}${nm[5]}}$의 길이는?`, a: b, unit: 'cm', wrong: [a, c, a + b], why: `$\\overline{${nm[4]}${nm[5]}}$의 대응변은 $\\overline{${nm[1]}${nm[2]}}$이에요. ${nm[4]}↔${nm[1]}, ${nm[5]}↔${nm[2]}\n따라서 $${b}$cm` };
        }
        return { q: `$\\triangle ${nm[0]}${nm[1]}${nm[2]}\\equiv\\triangle ${nm[3]}${nm[4]}${nm[5]}$이고 $\\angle ${nm[0]}=${A}^\\circ$, $\\angle ${nm[1]}=${B}^\\circ$일 때, $\\angle ${nm[5]}$의 크기는?`, a: 180 - A - B, unit: '°', wrong: [A, B, 180 - A], why: `$\\angle ${nm[2]}=180-${A}-${B}=${180 - A - B}^\\circ$이고, ${nm[5]}[은/는] ${nm[2]}의 대응각이라 크기가 같아요.` };
      } },
      { id: 'cond', lv: [2, 5], card: 'c2', make: (R, lv) => {
        const cases = [
          ['$\\overline{AB}=\\overline{DE}$, $\\overline{BC}=\\overline{EF}$, $\\overline{CA}=\\overline{FD}$', 'SSS 합동'],
          ['$\\overline{AB}=\\overline{DE}$, $\\overline{BC}=\\overline{EF}$, $\\angle B=\\angle E$', 'SAS 합동'],
          ['$\\overline{BC}=\\overline{EF}$, $\\angle B=\\angle E$, $\\angle C=\\angle F$', 'ASA 합동'],
        ];
        const c = R.pick(cases);
        const kinds = ['SSS 합동', 'SAS 합동', 'ASA 합동', '합동이라 할 수 없다'];
        if (lv >= 4 && R.chance(0.5)) {
          const bad = R.pick([
            ['$\\angle A=\\angle D$, $\\angle B=\\angle E$, $\\angle C=\\angle F$', '세 각이 같아도 크기는 다를 수 있어요(AAA는 합동 조건이 아니에요).'],
            ['$\\overline{AB}=\\overline{DE}$, $\\overline{BC}=\\overline{EF}$, $\\angle A=\\angle D$', '$\\angle A$는 두 변 $\\overline{AB}$, $\\overline{BC}$의 **끼인각이 아니에요**. (SSA는 합동 조건이 아니에요)'],
          ]);
          return { q: `$\\triangle ABC$와 $\\triangle DEF$에서 ${bad[0]}일 때, 두 삼각형은?`, correct: '합동이라 할 수 없다', wrong: kinds.slice(0, 3), why: bad[1] };
        }
        return { q: `$\\triangle ABC$와 $\\triangle DEF$에서 ${c[0]}일 때, 두 삼각형의 합동 조건은?`, correct: c[1], wrong: kinds.filter((k) => k !== c[1]), why: c[1] === 'SSS 합동' ? '세 변이 각각 같아요.' : c[1] === 'SAS 합동' ? '두 변과 **그 끼인각**($\\angle B$)이 같아요.' : '한 변 $\\overline{BC}$와 그 **양 끝 각** $\\angle B$, $\\angle C$가 같아요.' };
      } },
      { id: 'add', lv: [3, 5], card: 'c2', make: (R) => {
        const ask = R.pick([
          ['$\\overline{AB}=\\overline{DE}$, $\\overline{BC}=\\overline{EF}$일 때, SAS 합동이 되려면 추가로 필요한 조건은?', '$\\angle B=\\angle E$', ['$\\angle A=\\angle D$', '$\\angle C=\\angle F$', '$\\overline{AC}=\\overline{DE}$'], '두 변 $\\overline{AB},\\ \\overline{BC}$의 **끼인각**은 $\\angle B$예요.'],
          ['$\\angle B=\\angle E$, $\\angle C=\\angle F$일 때, ASA 합동이 되려면 추가로 필요한 조건은?', '$\\overline{BC}=\\overline{EF}$', ['$\\overline{AB}=\\overline{DE}$', '$\\overline{AC}=\\overline{DF}$', '$\\angle A=\\angle D$'], '$\\angle B$와 $\\angle C$를 양 끝 각으로 갖는 변은 $\\overline{BC}$예요.'],
          ['$\\overline{AB}=\\overline{DE}$, $\\overline{BC}=\\overline{EF}$일 때, SSS 합동이 되려면 추가로 필요한 조건은?', '$\\overline{CA}=\\overline{FD}$', ['$\\angle B=\\angle E$', '$\\angle A=\\angle D$', '$\\overline{AB}=\\overline{EF}$'], '세 변이 모두 같아야 해요. 남은 한 변은 $\\overline{CA}$와 $\\overline{FD}$예요.'],
        ]);
        const it = ask;
        return { q: `$\\triangle ABC$와 $\\triangle DEF$에서 ${it[0]}`, correct: it[1], wrong: it[2], why: it[3] };
      } },
    ],
  },
];
