// 확률과 통계: 경우의 수 · 확률 · 통계
import { gcd } from '../js/lib.js';

const T = (s, ...v) => String.raw(s, ...v).split('\n').map((l) => l.trim()).join('\n').trim();
const uniq = (arr, not) => [...new Set(arr.map(String))].filter((x) => x !== String(not));
const fS = (n, d) => { const g = gcd(n, d) || 1; let a = n / g, b = d / g; if (b < 0) { a = -a; b = -b; } return b === 1 ? `${a}` : `\\dfrac{${a}}{${b}}`; };
const fact = (n) => (n <= 1 ? 1 : n * fact(n - 1));
const comb = (n, r) => { if (r < 0 || r > n) return 0; let v = 1; for (let i = 1; i <= r; i++) v = (v * (n - r + i)) / i; return Math.round(v); };
const perm = (n, r) => { let v = 1; for (let i = 0; i < r; i++) v *= n - i; return v; };
const H = (n, r) => comb(n + r - 1, r);
const W = (ans, ...c) => { const s = new Set(); [...c, ans + 1, ans - 1, ans + 2, ans - 2, ans * 2].forEach((v) => { if (v !== ans && Number.isFinite(v) && v > 0 || ans < 0) s.add(v); }); return [...s].slice(0, 4); };
// 분수 보기: 정답 n/d, 대안(알려진 오답) alts(분수 문자열)
const FO = (n, d, ...alts) => {
  const ans = fS(n, d);
  const cand = uniq([...alts, fS(d - n, d), fS(n + 1, d), fS(n, d + 1), fS(n + 2, d + 1), fS(n - 1, d), fS(1, d + 2), fS(n, d + 2)], ans).filter((s) => !/NaN|Infinity/.test(s));
  return { correct: `$${ans}$`, wrong: cand.slice(0, 3).map((s) => `$${s}$`) };
};
const pr = (n) => (n < 0 ? `(${n})` : `${n}`);
const EQ = (n, d) => `\\dfrac{${n}}{${d}}${fS(n, d) === `\\dfrac{${n}}{${d}}` ? '' : `=${fS(n, d)}`}`;
const r4 = (x) => Number(x.toFixed(4));
const r2 = (x) => Number(x.toFixed(2));
const WD = (ans, ...c) => { const s = new Set(); [...c, 1 - ans, 0.3413, 0.4332, 0.4772, 0.4987, 0.1587, 0.0668, 0.5].forEach((v) => { const w = r4(v); if (w !== ans && w > 0 && w < 1) s.add(w); }); return [...s].slice(0, 4); };
const WD2 = (ans, ...c) => { const s = new Set(); [...c, ans + 0.5, ans - 0.5, ans + 1, ans - 1, ans * 2].forEach((v) => { const w = r2(v); if (w !== ans && Number.isFinite(w)) s.add(w); }); return [...s].slice(0, 4); };
const sub = (n, r, k) => `_{${n}}${k}_{${r}}`;
const ZT = '$P(0\\le Z\\le1)=0.3413$, $P(0\\le Z\\le1.5)=0.4332$, $P(0\\le Z\\le2)=0.4772$, $P(0\\le Z\\le3)=0.4987$';
const TAB = { 1: 0.3413, 1.5: 0.4332, 2: 0.4772, 3: 0.4987 };

export default [
  // ───────────── 경우의 수 ─────────────
  {
    id: 'p.rp',
    lesson: [
      { id: 'c1', t: '중복순열', b: T`서로 다른 $n$개에서 ==중복을 허용==하여 $r$개를 뽑아 일렬로 나열하는 경우의 수
        $${'$'}{}_n\text{Π}_r=n^r$$
        예) 숫자 $1,2,3$으로 만드는 네 자리 비밀번호(중복 가능): $3^4=81$가지
        ==각 자리마다 $n$가지 선택== → $n\times n\times\cdots$` },
      { id: 'c2', t: '같은 것이 있는 순열', b: T`$n$개 중 같은 것이 각각 $a,b,c$개 있을 때 일렬로 나열하는 경우의 수
        $$\dfrac{n!}{a!\,b!\,c!}$$
        예) $AABBC$ → $\dfrac{5!}{2!\,2!}=30$
        같은 것끼리 자리를 바꿔도 같은 배열이므로 ==나눠 줘요==.` },
      { id: 'c3', t: '최단 경로', b: T`가로 $a$칸, 세로 $b$칸을 지나 가는 최단 경로 = 오른쪽 $a$번, 위쪽 $b$번을 나열하는 것
        $$\dfrac{(a+b)!}{a!\,b!}={}_{a+b}C_a$$
        중간에 반드시 지나는 점이 있으면 ==구간별로 나눠 곱해요==.` },
    ],
    gens: [
      { id: 'rep', lv: [1, 3], card: 'c1', make: (R) => {
        const k = R.pick(['pw', 'box', 'ox']);
        if (k === 'pw') { const n = R.int(2, 6), r = R.int(2, 4); return { q: `숫자 $1,2,\\dots,${n}$ 중 중복을 허용하여 ${r}자리 비밀번호를 만드는 경우의 수는?`, a: n ** r, wrong: W(n ** r, n * r, r ** n, perm(n, r)), why: `각 자리에 ${n}가지씩 → $${n}^{${r}}=${n ** r}$` }; }
        if (k === 'box') { const n = R.int(2, 5), r = R.int(2, 4); return { q: `서로 다른 공 ${r}개를 서로 다른 상자 ${n}개에 넣는 경우의 수는? (빈 상자도 가능)`, a: n ** r, wrong: W(n ** r, r ** n, n * r), why: `공 하나하나가 ${n}개의 상자 중 하나를 고름 → $${n}^{${r}}=${n ** r}$` }; }
        const r = R.int(3, 8); return { q: `O, X로 답하는 문제 ${r}개에 모두 답하는 경우의 수는?`, a: 2 ** r, wrong: W(2 ** r, r * r, 2 * r), why: `문제마다 2가지 → $2^{${r}}=${2 ** r}$` };
      } },
      { id: 'same', lv: [2, 5], card: 'c2', make: (R) => {
        const words = ['LEVEL', 'APPLE', 'BANANA', 'COOKIE', 'PEPPER', 'ALLEY', 'AABBB', 'AAABBC', 'MAMMA', 'SEOUL', 'BOOKKEEPER'];
        const w = R.pick(words); const cnt = {}; for (const ch of w) cnt[ch] = (cnt[ch] || 0) + 1;
        const reps = Object.values(cnt).filter((v) => v > 1); const ans = fact(w.length) / reps.reduce((x, y) => x * fact(y), 1);
        const den = reps.map((v) => `${v}!`).join('\\,');
        if (ans === fact(w.length)) return { q: `$S,E,O,U,L$ 5개 문자를 모두 일렬로 나열하는 경우의 수는?`, a: 120, wrong: [24, 60, 25], why: '모두 다르므로 $5!=120$' };
        return { q: `${w}의 문자 ${w.length}개를 모두 일렬로 나열하는 경우의 수는?`, a: ans, wrong: W(ans, fact(w.length), fact(w.length) / fact(reps[0])), why: `$\\dfrac{${w.length}!}{${den}}=${ans}$ (같은 문자: ${Object.entries(cnt).filter(([, v]) => v > 1).map(([k, v]) => `${k} ${v}개`).join(', ')})` };
      } },
      { id: 'path', lv: [2, 4], card: 'c3', make: (R) => {
        const a = R.int(2, 5), b = R.int(2, 4); const ans = comb(a + b, a);
        return { q: `가로 ${a}칸, 세로 ${b}칸인 바둑판 모양의 길에서 왼쪽 아래 $A$에서 오른쪽 위 $B$까지 가는 최단 경로의 수는?`, a: ans, wrong: W(ans, a * b, a + b, perm(a + b, 2)), why: `오른쪽 ${a}번, 위쪽 ${b}번을 나열: $\\dfrac{${a + b}!}{${a}!\\,${b}!}=${ans}$` };
      } },
      { id: 'via', lv: [4, 5], card: 'c3', make: (R) => {
        const a1 = R.int(1, 3), b1 = R.int(1, 3), a2 = R.int(1, 3), b2 = R.int(1, 3); const ans = comb(a1 + b1, a1) * comb(a2 + b2, a2);
        return { q: `가로 ${a1 + a2}칸, 세로 ${b1 + b2}칸인 바둑판 모양의 길에서 $A$에서 $B$까지 가는 최단 경로 중, 점 $P$(가로 ${a1}칸, 세로 ${b1}칸 지점)를 지나는 경로의 수는?`, a: ans, wrong: W(ans, comb(a1 + a2 + b1 + b2, a1 + a2), comb(a1 + b1, a1) + comb(a2 + b2, a2)), why: `$A\\to P$: $${comb(a1 + b1, a1)}$가지, $P\\to B$: $${comb(a2 + b2, a2)}$가지 → 곱 $${ans}$` };
      } },
    ],
  },
  {
    id: 'p.rc',
    lesson: [
      { id: 'c1', t: '중복조합', b: T`서로 다른 $n$개에서 ==중복을 허용==하여 순서 없이 $r$개를 뽑는 경우의 수
        $${'$'}{}_n\mathrm{H}_r={}_{n+r-1}C_r$$
        예) 3종류에서 4개를 고르면 ${'$'}{}_3H_4={}_6C_4=15$

        ==칸막이 모형==: 같은 것 $r$개와 칸막이 $n-1$개를 나열한다고 생각!` },
      { id: 'c2', t: '방정식의 해의 개수', b: T`$x_1+x_2+\cdots+x_n=r$을 만족하는
        - ==음이 아닌 정수해==: ${'$'}{}_n\mathrm{H}_r$개
        - ==양의 정수해==: 먼저 각각 1씩 주고 나머지를 분배 → ${'$'}{}_n\mathrm{H}_{r-n}$개

        예) $x+y+z=5$의 음이 아닌 정수해: ${'$'}{}_3H_5={}_7C_5=21$` },
    ],
    gens: [
      { id: 'h', lv: [1, 3], card: 'c1', make: (R) => {
        const n = R.int(2, 5), r = R.int(2, 5); const ans = H(n, r);
        return { q: `$_{${n}}\\mathrm{H}_{${r}}$의 값은?`, a: ans, wrong: W(ans, comb(n, r), perm(n, r), n ** r), why: `$_{${n}}\\mathrm{H}_{${r}}={}_{${n + r - 1}}C_{${r}}=${ans}$` };
      } },
      { id: 'pick', lv: [2, 4], card: 'c1', make: (R) => {
        const n = R.int(3, 5), r = R.int(2, 5); const ans = H(n, r);
        return { q: `서로 다른 ${n}종류의 과일이 충분히 있을 때, 과일 ${r}개를 사는 경우의 수는? (안 사는 종류가 있어도 됨)`, a: ans, wrong: W(ans, comb(n, r), n ** r, perm(n, r)), why: `중복조합: $_{${n}}\\mathrm{H}_{${r}}={}_{${n + r - 1}}C_{${r}}=${ans}$` };
      } },
      { id: 'eq', lv: [3, 5], card: 'c2', make: (R) => {
        const n = R.int(3, 4), r = R.int(3, 7); const pos = R.chance(0.5); const ans = pos ? H(n, r - n) : H(n, r);
        const vars = ['x', 'y', 'z', 'w'].slice(0, n).join('+');
        if (pos && r < n) return { q: `방정식 $x+y+z=${n + 2}$를 만족하는 양의 정수해의 개수는?`, a: H(3, n - 1), wrong: [comb(n + 2, 3), H(3, n + 2)], why: `각각 1씩 먼저 주면 나머지 $${n - 1}$을 분배: $_3\\mathrm{H}_{${n - 1}}=${H(3, n - 1)}$` };
        return { q: `방정식 $${vars}=${r}$를 만족하는 ${pos ? '양의' : '음이 아닌'} 정수해의 개수는?`, a: ans, wrong: W(ans, pos ? H(n, r) : H(n, r - n < 0 ? 0 : r - n), comb(r, n)), why: pos ? `각 변수에 1씩 먼저 주고 남은 $${r - n}$을 분배: $_{${n}}\\mathrm{H}_{${r - n}}=${ans}$` : `$_{${n}}\\mathrm{H}_{${r}}={}_{${n + r - 1}}C_{${r}}=${ans}$` };
      } },
    ],
  },
  {
    id: 'p.bin',
    lesson: [
      { id: 'c1', t: '이항정리', b: T`$$(a+b)^n=\sum_{k=0}^{n}{}_nC_k\,a^{n-k}b^k$$
        - 일반항: ${'$'}{}_nC_k\,a^{n-k}b^k$ ($k=0,1,\dots,n$)
        - $(x+2)^3=x^3+6x^2+12x+8$ (계수: ${'$'}{}_3C_0,{}_3C_1\cdot2,{}_3C_2\cdot2^2,{}_3C_3\cdot2^3$)
        - $x^k$의 계수: 일반항에서 $x$의 지수가 $k$인 항 찾기` },
      { id: 'c2', t: '이항계수의 성질', b: T`- ${'$'}{}_nC_0+{}_nC_1+\cdots+{}_nC_n=2^n$
        - ${'$'}{}_nC_0-{}_nC_1+{}_nC_2-\cdots=0$
        - ${'$'}{}_nC_r={}_nC_{n-r}$ (좌우 대칭)
        - 파스칼의 삼각형: ${'$'}{}_nC_r={}_{n-1}C_{r-1}+{}_{n-1}C_r$` },
    ],
    gens: [
      { id: 'coef', lv: [1, 3], card: 'c1', make: (R) => {
        const n = R.int(3, 6), a = R.nz(-3, 3), k = R.int(1, n - 1); const ans = comb(n, k) * a ** (n - k);
        return { q: `$(x${a > 0 ? '+' : '-'}${Math.abs(a)})^{${n}}$의 전개식에서 $x^{${k}}$의 계수는?`, a: ans, wrong: W(ans, comb(n, k), a ** (n - k), -ans), why: `일반항 $_{${n}}C_{r}x^{${n}-r}(${a})^r$에서 $x^{${k}}$ → $r=${n - k}$: $_{${n}}C_{${n - k}}\\times(${a})^{${n - k}}=${ans}$` };
      } },
      { id: 'coef2', lv: [3, 5], card: 'c1', make: (R) => {
        const n = R.int(3, 5), a = R.int(2, 3), b = R.nz(-2, 2), k = R.int(1, n); const ans = comb(n, k) * a ** k * b ** (n - k);
        return { q: `$(${a}x${b > 0 ? '+' : '-'}${Math.abs(b)})^{${n}}$의 전개식에서 $x^{${k}}$의 계수는?`, a: ans, wrong: W(ans, comb(n, k), comb(n, k) * a ** k, comb(n, k) * b ** (n - k)), why: `$_{${n}}C_{${k}}(${a}x)^{${k}}(${b})^{${n - k}}$ → 계수 $${comb(n, k)}\\times${a ** k}\\times${pr(b ** (n - k))}=${ans}$` };
      } },
      { id: 'sum', lv: [2, 4], card: 'c2', make: (R) => {
        const n = R.int(4, 10);
        return { q: `$_{${n}}C_0+{}_{${n}}C_1+{}_{${n}}C_2+\\cdots+{}_{${n}}C_{${n}}$의 값은?`, a: 2 ** n, wrong: W(2 ** n, n * n, 2 * n, 2 ** n - 1), why: `$(1+1)^{${n}}$을 이항정리로 전개한 것 → $2^{${n}}=${2 ** n}$` };
      } },
      { id: 'sym', lv: [3, 5], card: 'c2', make: (R) => {
        const n = R.int(6, 12), r = R.int(1, Math.floor(n / 2) - 1);
        return { q: `$_{${n}}C_{${r}}={}_{${n}}C_{k}$ ($k\\ne${r}$)일 때 $k$의 값은?`, a: n - r, wrong: W(n - r, r + 1, n - r + 1, n), why: `${'$'}{}_nC_r={}_nC_{n-r}$ → $k=${n}-${r}=${n - r}$` };
      } },
    ],
  },

  // ───────────── 확률 ─────────────
  {
    id: 'p.prob',
    lesson: [
      { id: 'c1', t: '확률의 뜻', b: T`표본공간 $S$의 각 근원사건이 일어날 가능성이 ==같을 때== 사건 $A$의 확률
        $$P(A)=\dfrac{n(A)}{n(S)}$$
        - $0\le P(A)\le1$, $P(S)=1$, $P(\varnothing)=0$
        - ==경우의 수(순열·조합)로 $n(A),n(S)$를 세는 것==이 핵심` },
      { id: 'c2', t: '확률의 덧셈정리와 여사건', b: T`- $P(A\cup B)=P(A)+P(B)-P(A\cap B)$
        - 배반사건($A\cap B=\varnothing$)이면 $P(A\cup B)=P(A)+P(B)$
        - ==여사건== $P(A^c)=1-P(A)$

        "적어도 하나"가 나오는 확률은 ==여사건(하나도 안 나올 확률)==을 쓰면 편해요.` },
    ],
    gens: [
      { id: 'dice', lv: [1, 3], card: 'c1', make: (R) => {
        const k = R.int(2, 12); const cnt = 6 - Math.abs(k - 7);
        return { q: `서로 다른 주사위 2개를 동시에 던질 때, 나온 눈의 합이 $${k}$일 확률은?`, ...FO(cnt, 36, fS(cnt, 12), fS(1, 6)), why: `전체 $36$가지 중 합이 $${k}$인 경우 $${cnt}$가지 → $\\dfrac{${cnt}}{36}=${fS(cnt, 36)}$` };
      } },
      { id: 'balls', lv: [2, 5], card: 'c1', make: (R) => {
        const w = R.int(2, 5), b = R.int(2, 5); const same = comb(w, 2) + comb(b, 2), tot = comb(w + b, 2); const diff = R.chance(0.4);
        const num = diff ? w * b : same;
        return { q: `흰 공 ${w}개, 검은 공 ${b}개가 들어 있는 주머니에서 동시에 2개를 꺼낼 때, ${diff ? '서로 다른 색' : '같은 색'}일 확률은?`, ...FO(num, tot), why: diff ? `$\\dfrac{${w}\\times${b}}{_{${w + b}}C_2}=${EQ(num, tot)}$` : `$\\dfrac{_{${w}}C_2+{}_{${b}}C_2}{_{${w + b}}C_2}=${EQ(same, tot)}$` };
      } },
      { id: 'comp', lv: [2, 5], card: 'c2', make: (R) => {
        const k = R.pick(['coin', 'coin', 'dice']);
        if (k === 'coin') { const n = R.int(2, 6); return { q: `동전 ${n}개를 동시에 던질 때, 적어도 한 개는 앞면이 나올 확률은?`, ...FO(2 ** n - 1, 2 ** n, fS(1, 2 ** n)), why: `여사건(모두 뒷면)의 확률 $\\dfrac1{${2 ** n}}$ → $1-\\dfrac1{${2 ** n}}=${fS(2 ** n - 1, 2 ** n)}$` }; }
        const n = R.int(2, 3); const tot = 6 ** n, no = 5 ** n;
        return { q: `주사위를 ${n}번 던질 때, 적어도 한 번은 6의 눈이 나올 확률은?`, ...FO(tot - no, tot, fS(no, tot)), why: `여사건(한 번도 6이 안 나옴): $\\left(\\dfrac56\\right)^{${n}}=\\dfrac{${no}}{${tot}}$ → $1-\\dfrac{${no}}{${tot}}=${fS(tot - no, tot)}$` };
      } },
      { id: 'add', lv: [2, 4], card: 'c2', make: (R) => {
        const D = R.pick([10, 12, 20]); const pa = R.int(3, D - 5), pb = R.int(3, D - 5), c = R.int(1, Math.min(pa, pb) - 1); const u = pa + pb - c;
        if (u > D || u <= 0) return { q: `$P(A)=\\dfrac12$, $P(B)=\\dfrac13$이고 $A,B$가 배반사건일 때 $P(A\\cup B)$는?`, ...FO(5, 6), why: '배반사건이므로 $\\dfrac12+\\dfrac13=\\dfrac56$' };
        return { q: `$P(A)=${fS(pa, D)}$, $P(B)=${fS(pb, D)}$, $P(A\\cap B)=${fS(c, D)}$일 때 $P(A\\cup B)$는?`, ...FO(u, D, fS(pa + pb, D)), why: `$P(A\\cup B)=P(A)+P(B)-P(A\\cap B)=\\dfrac{${pa}+${pb}-${c}}{${D}}=${fS(u, D)}$` };
      } },
    ],
  },
  {
    id: 'p.cond',
    lesson: [
      { id: 'c1', t: '조건부확률', b: T`사건 $A$가 일어났을 때 사건 $B$가 일어날 확률
        $$P(B\mid A)=\dfrac{P(A\cap B)}{P(A)}\ (P(A)>0)$$
        ==분모가 "조건"으로 줄어든 새 표본공간==이라고 생각하세요.
        예) 여학생 중 안경 쓴 학생의 확률 = (안경 쓴 여학생) ÷ (여학생 전체)` },
      { id: 'c2', t: '확률의 곱셈정리', b: T`$$P(A\cap B)=P(A)\,P(B\mid A)$$
        비복원추출(꺼낸 것을 다시 넣지 않음)에서 "처음에 ~, 다음에 ~일 확률"은 곱해서 구해요.
        예) 흰 3·검 2에서 연달아 흰 2개: $\dfrac35\times\dfrac24=\dfrac3{10}$` },
    ],
    gens: [
      { id: 'def', lv: [1, 3], card: 'c1', make: (R) => {
        const D = R.pick([10, 12, 20]); const pa = R.int(4, D - 2), c = R.int(1, pa - 1);
        return { q: `$P(A)=${fS(pa, D)}$, $P(A\\cap B)=${fS(c, D)}$일 때 $P(B\\mid A)$는?`, ...FO(c, pa, fS(c, D), fS(pa, c)), why: `$P(B\\mid A)=\\dfrac{P(A\\cap B)}{P(A)}=\\dfrac{${c}/${D}}{${pa}/${D}}=${fS(c, pa)}$` };
      } },
      { id: 'table', lv: [2, 5], card: 'c1', make: (R) => {
        const mg = R.int(3, 12), mn = R.int(3, 12), fg = R.int(3, 12), fn = R.int(3, 12); const ask = R.pick(['f', 'g']);
        const tot = mg + mn + fg + fn;
        if (ask === 'f') return { q: `어느 반 학생 ${tot}명 중 남학생은 안경을 쓴 학생 ${mg}명, 안 쓴 학생 ${mn}명이고 여학생은 안경을 쓴 학생 ${fg}명, 안 쓴 학생 ${fn}명이다. 이 중 한 명을 뽑았더니 여학생이었을 때, 그 학생이 안경을 쓰고 있을 확률은?`, ...FO(fg, fg + fn, fS(fg, tot), fS(fg, fg + mg)), why: `여학생 $${fg + fn}$명 중 안경을 쓴 학생 $${fg}$명 → $${EQ(fg, fg + fn)}$` };
        return { q: `어느 반 학생 ${tot}명 중 남학생은 안경을 쓴 학생 ${mg}명, 안 쓴 학생 ${mn}명이고 여학생은 안경을 쓴 학생 ${fg}명, 안 쓴 학생 ${fn}명이다. 이 중 한 명을 뽑았더니 안경을 쓴 학생이었을 때, 그 학생이 여학생일 확률은?`, ...FO(fg, fg + mg, fS(fg, tot), fS(fg, fg + fn)), why: `안경을 쓴 학생 $${fg + mg}$명 중 여학생 $${fg}$명 → $${EQ(fg, fg + mg)}$` };
      } },
      { id: 'draw', lv: [2, 5], card: 'c2', make: (R) => {
        const w = R.int(2, 6), b = R.int(2, 5), n = w + b; const k = R.pick(['both', 'second']);
        if (k === 'both') return { q: `흰 공 ${w}개, 검은 공 ${b}개가 들어 있는 주머니에서 공을 한 개씩 차례로 2개 꺼낼 때 (꺼낸 공은 다시 넣지 않음), 모두 흰 공일 확률은?`, ...FO(w * (w - 1), n * (n - 1), fS(w * w, n * n), fS(w, n)), why: `$\\dfrac{${w}}{${n}}\\times\\dfrac{${w - 1}}{${n - 1}}=${fS(w * (w - 1), n * (n - 1))}$` };
        return { q: `흰 공 ${w}개, 검은 공 ${b}개가 들어 있는 주머니에서 공을 한 개씩 차례로 꺼낸다 (꺼낸 공은 다시 넣지 않음). 첫 번째가 흰 공이었을 때, 두 번째도 흰 공일 확률은?`, ...FO(w - 1, n - 1, fS(w, n), fS(w * (w - 1), n * (n - 1))), why: `첫 번째에 흰 공 하나를 뺐으므로 남은 $${n - 1}$개 중 흰 공 $${w - 1}$개 → $${EQ(w - 1, n - 1)}$` };
      } },
    ],
  },
  {
    id: 'p.ind',
    lesson: [
      { id: 'c1', t: '사건의 독립', b: T`한 사건이 일어나는 것이 다른 사건의 확률에 영향을 주지 않을 때 두 사건은 ==독립==
        $$P(A\cap B)=P(A)P(B)\iff P(B\mid A)=P(B)$$
        ※ 배반(동시에 일어날 수 없음)과 독립은 ==다른 개념==!` },
      { id: 'c2', t: '독립시행의 확률', b: T`같은 시행을 반복할 때 각 시행의 결과가 서로 영향을 주지 않는 시행. 한 번 시행에서 사건 $A$의 확률이 $p$이면 $n$번 중 $A$가 ==정확히 $r$번== 일어날 확률
        $${'$'}{}_nC_r\,p^r(1-p)^{n-r}$$
        예) 동전 4번 중 앞면 2번: ${'$'}{}_4C_2\left(\dfrac12\right)^2\left(\dfrac12\right)^2=\dfrac38$` },
    ],
    gens: [
      { id: 'chk', lv: [1, 3], card: 'c1', make: (R) => {
        const a = R.pick([2, 3, 4]), b = R.pick([2, 3, 5]); const ok = R.chance(0.5); const c = ok ? 1 : R.pick([1, 2]); const num = ok ? 1 : c;
        const prod = a * b; const inter = ok ? `\\dfrac{1}{${prod}}` : `\\dfrac{${num + 1}}{${prod}}`;
        return { q: `$P(A)=\\dfrac1{${a}}$, $P(B)=\\dfrac1{${b}}$, $P(A\\cap B)=${inter}$일 때 두 사건 $A$, $B$는?`, correct: ok ? '서로 독립이다' : '서로 독립이 아니다', wrong: [ok ? '서로 독립이 아니다' : '서로 독립이다'], why: `$P(A)P(B)=\\dfrac1{${prod}}$ ${ok ? '= $P(A\\cap B)$ → 독립' : `≠ $P(A\\cap B)$ → 독립이 아님`}` };
      } },
      { id: 'and', lv: [2, 4], card: 'c1', make: (R) => {
        const pa = R.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [2, 5]]), pb = R.pick([[1, 2], [1, 3], [2, 3], [1, 5], [3, 5], [3, 4]]);
        const n = pa[0] * pb[0], d = pa[1] * pb[1];
        return { q: `서로 독립인 두 사건 $A$, $B$에 대하여 $P(A)=\\dfrac{${pa[0]}}{${pa[1]}}$, $P(B)=\\dfrac{${pb[0]}}{${pb[1]}}$일 때 $P(A\\cap B)$는?`, ...FO(n, d, fS(pa[0] * pb[1] + pb[0] * pa[1], d), fS(pa[0] + pb[0], pa[1] + pb[1])), why: `독립이므로 곱: $\\dfrac{${pa[0]}}{${pa[1]}}\\times\\dfrac{${pb[0]}}{${pb[1]}}=${fS(n, d)}$` };
      } },
      { id: 'coin', lv: [2, 4], card: 'c2', make: (R) => {
        const n = R.int(3, 6), r = R.int(1, n - 1); const num = comb(n, r), d = 2 ** n;
        return { q: `동전을 ${n}번 던질 때, 앞면이 정확히 ${r}번 나올 확률은?`, ...FO(num, d, fS(1, d), fS(r, n)), why: `$_{${n}}C_{${r}}\\left(\\dfrac12\\right)^{${r}}\\left(\\dfrac12\\right)^{${n - r}}=${EQ(num, d)}$` };
      } },
      { id: 'shoot', lv: [3, 5], card: 'c2', make: (R) => {
        const [a, b] = R.pick([[1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5]]); const n = R.int(3, 5), r = R.int(1, n - 1);
        const num = comb(n, r) * a ** r * (b - a) ** (n - r), d = b ** n;
        return { q: `명중률이 $\\dfrac{${a}}{${b}}$인 사수가 ${n}번 사격할 때, 정확히 ${r}번 명중할 확률은?`, ...FO(num, d, fS(a ** r * (b - a) ** (n - r), d), fS(comb(n, r) * a ** r, d)), why: `$_{${n}}C_{${r}}\\left(\\dfrac{${a}}{${b}}\\right)^{${r}}\\left(\\dfrac{${b - a}}{${b}}\\right)^{${n - r}}=${EQ(num, d)}$` };
      } },
    ],
  },

  // ───────────── 통계 ─────────────
  {
    id: 'p.dist',
    lesson: [
      { id: 'c1', t: '이산확률변수와 확률질량함수', b: T`시행 결과에 따라 값이 정해지는 변수 $X$가 ==띄엄띄엄한 값==을 가질 때 ==이산확률변수==.
        - $P(X=x_i)=p_i$ ($i=1,\dots,n$)
        - $p_i\ge0$, ==$p_1+p_2+\cdots+p_n=1$== (모든 확률의 합은 1)

        모르는 값이 있으면 합=1로 구해요.` },
      { id: 'c2', t: '평균·분산·표준편차', b: T`- 평균 $E(X)=\sum x_ip_i$
        - 분산 $V(X)=E(X^2)-\{E(X)\}^2=\sum(x_i-m)^2p_i$
        - 표준편차 $\sigma(X)=\sqrt{V(X)}$` },
      { id: 'c3', t: '$aX+b$의 평균·분산', b: T`- $E(aX+b)=aE(X)+b$
        - $V(aX+b)=a^2V(X)$ (평행이동 $b$는 퍼짐에 영향 없음!)
        - $\sigma(aX+b)=|a|\sigma(X)$` },
    ],
    gens: [
      { id: 'a', lv: [1, 3], card: 'c1', make: (R) => {
        const D = R.pick([6, 8, 10, 12]); const n1 = R.int(1, Math.floor(D / 2) - 1), n2 = R.int(1, D - n1 - 2 > 0 ? D - n1 - 2 : 1); const a = D - n1 - n2;
        if (a <= 0) return { q: `$P(X=1)=\\dfrac14$, $P(X=2)=\\dfrac14$, $P(X=3)=a$일 때 $a$의 값은?`, ...FO(1, 2), why: '확률의 합 $=1$ → $a=1-\\dfrac12=\\dfrac12$' };
        return { q: `이산확률변수 $X$가 $1,2,3$ 값을 갖고 $P(X=1)=${fS(n1, D)}$, $P(X=2)=${fS(n2, D)}$, $P(X=3)=a$일 때 $a$의 값은?`, ...FO(a, D, fS(n1 + n2, D)), why: `확률의 합이 $1$ → $a=1-\\dfrac{${n1}+${n2}}{${D}}=${fS(a, D)}$` };
      } },
      { id: 'k', lv: [2, 4], card: 'c1', make: (R) => {
        const n = R.int(3, 5); const s = (n * (n + 1)) / 2;
        return { q: `$P(X=x)=kx$ ($x=1,2,\\dots,${n}$)일 때 상수 $k$의 값은?`, ...FO(1, s, fS(1, n), fS(2, n * (n + 1) + 2)), why: `합 $k(1+2+\\cdots+${n})=${s}k=1$ → $k=\\dfrac1{${s}}$` };
      } },
      { id: 'mean', lv: [2, 5], card: 'c2', make: (R) => {
        const D = R.pick([4, 6, 8]); const a = R.int(1, D - 2), b = R.int(1, D - a - 1), c = D - a - b; const xs = [0, 1, 2]; const E = b + 2 * c;
        return { q: `$X$가 $0,1,2$ 값을 갖고 $P(X=0)=${fS(a, D)}$, $P(X=1)=${fS(b, D)}$, $P(X=2)=${fS(c, D)}$일 때 $E(X)$는?`, ...FO(E, D, fS(b + c, D), fS(a + b + c, 3)), why: `$E(X)=0\\times\\dfrac{${a}}{${D}}+1\\times\\dfrac{${b}}{${D}}+2\\times\\dfrac{${c}}{${D}}=${EQ(E, D)}$` };
      } },
      { id: 'lin', lv: [2, 4], card: 'c3', make: (R) => {
        const m = R.int(-3, 8), a = R.nz(-4, 5), b = R.int(-5, 6); const ans = a * m + b;
        return { q: `$E(X)=${m}$일 때 $E(${a === 1 ? '' : a === -1 ? '-' : a}X${b >= 0 ? '+' : '-'}${Math.abs(b)})$의 값은?`, a: ans, wrong: W(ans, a * m, m + b, a * (m + b)), why: `$E(aX+b)=aE(X)+b=${a}\\times${m < 0 ? `(${m})` : m}${b >= 0 ? '+' : '-'}${Math.abs(b)}=${ans}$` };
      } },
      { id: 'var', lv: [3, 5], card: 'c2', make: (R) => {
        const m = R.int(1, 5), v = R.int(1, 9); const s = v + m * m;
        return { q: `$E(X)=${m}$, $E(X^2)=${s}$일 때 $V(X)$의 값은?`, a: v, wrong: W(v, s - m, s + m * m, s), why: `$V(X)=E(X^2)-\\{E(X)\\}^2=${s}-${m * m}=${v}$` };
      } },
      { id: 'varlin', lv: [3, 5], card: 'c3', make: (R) => {
        const v = R.int(1, 9), a = R.pick([2, 3, -2, -3, 4]), b = R.int(-5, 6); const ans = a * a * v;
        return { q: `$V(X)=${v}$일 때 $V(${a}X${b >= 0 ? '+' : '-'}${Math.abs(b)})$의 값은?`, a: ans, wrong: W(ans, a * v, a * v + b, ans + b), why: `$V(aX+b)=a^2V(X)=${a * a}\\times${v}=${ans}$ (더하는 상수 $b$는 분산에 영향 없음)` };
      } },
    ],
  },
  {
    id: 'p.binom',
    lesson: [
      { id: 'c1', t: '이항분포', b: T`한 번의 시행에서 성공 확률이 $p$인 독립시행을 $n$번 할 때 성공 횟수 $X$ → ==$X\sim B(n,p)$==
        $$P(X=r)={}_nC_r\,p^r(1-p)^{n-r}\ (r=0,1,\dots,n)$$` },
      { id: 'c2', t: '이항분포의 평균·분산', b: T`$X\sim B(n,p)$, $q=1-p$이면
        - $E(X)=np$
        - $V(X)=npq$
        - $\sigma(X)=\sqrt{npq}$

        예) $B(100,\dfrac12)$: $E=50$, $V=25$, $\sigma=5$` },
    ],
    gens: [
      { id: 'ev', lv: [1, 3], card: 'c2', make: (R) => {
        const [a, b] = R.pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5]]); const n = b * R.int(1, 6); const ans = n * a / b;
        return { q: `확률변수 $X$가 이항분포 $B\\left(${n},\\dfrac{${a}}{${b}}\\right)$을 따를 때 $E(X)$는?`, a: ans, wrong: W(ans, n * (b - a) / b, n), why: `$E(X)=np=${n}\\times\\dfrac{${a}}{${b}}=${ans}$` };
      } },
      { id: 'var', lv: [3, 5], card: 'c2', make: (R) => {
        const opts = [[1, 2, [8, 12, 16, 20, 40]], [1, 3, [9, 18, 27, 36]], [2, 3, [9, 18, 27, 36]], [1, 4, [16, 32, 48]], [3, 4, [16, 32, 48]], [1, 5, [25, 50]], [2, 5, [25, 50]]];
        const [a, b, ns] = R.pick(opts); const n = R.pick(ns); const ans = n * a * (b - a) / (b * b);
        return { q: `확률변수 $X$가 이항분포 $B\\left(${n},\\dfrac{${a}}{${b}}\\right)$을 따를 때 $V(X)$는?`, a: ans, wrong: W(ans, n * a / b, ans * ans, n * a * (b - a) / b), why: `$V(X)=npq=${n}\\times\\dfrac{${a}}{${b}}\\times\\dfrac{${b - a}}{${b}}=${ans}$` };
      } },
      { id: 'sd', lv: [4, 5], card: 'c2', make: (R) => {
        const s = R.int(1, 6); const n = 4 * s * s; const ans = s;
        return { q: `확률변수 $X$가 이항분포 $B\\left(${n},\\dfrac12\\right)$을 따를 때 $\\sigma(X)$는?`, a: ans, wrong: W(ans, n / 2, s * s, n / 4), why: `$V(X)=${n}\\times\\dfrac12\\times\\dfrac12=${s * s}$ → $\\sigma(X)=\\sqrt{${s * s}}=${s}$` };
      } },
      { id: 'prob', lv: [2, 4], card: 'c1', make: (R) => {
        const n = R.int(3, 6), r = R.int(0, n); const num = comb(n, r), d = 2 ** n;
        return { q: `확률변수 $X$가 이항분포 $B\\left(${n},\\dfrac12\\right)$을 따를 때 $P(X=${r})$는?`, ...FO(num, d, fS(1, d), fS(r, n)), why: `$_{${n}}C_{${r}}\\left(\\dfrac12\\right)^{${r}}\\left(\\dfrac12\\right)^{${n - r}}=${EQ(num, d)}$` };
      } },
      { id: 'lin', lv: [3, 5], card: 'c2', make: (R) => {
        const [a, b] = R.pick([[1, 2], [1, 3], [2, 3], [1, 4]]); const n = b * R.int(2, 6); const m = R.nz(-3, 4), k = R.int(-4, 5); const ans = m * n * a / b + k;
        return { q: `$X\\sim B\\left(${n},\\dfrac{${a}}{${b}}\\right)$일 때 $E(${m === 1 ? '' : m === -1 ? '-' : m}X${k >= 0 ? '+' : '-'}${Math.abs(k)})$의 값은?`, a: ans, wrong: W(ans, m * n * a / b, n * a / b + k, ans - 2 * k), why: `$E(X)=np=${n * a / b}$ → $E(aX+b)=${m}\\times${n * a / b}${k >= 0 ? '+' : '-'}${Math.abs(k)}=${ans}$` };
      } },
    ],
  },
  {
    id: 'p.normal',
    lesson: [
      { id: 'c1', t: '정규분포', b: T`연속확률변수 $X$의 확률밀도함수가 종 모양이고 $x=m$에 대해 ==좌우 대칭==인 분포 → $X\sim N(m,\sigma^2)$
        - 곡선과 $x$축 사이의 넓이 $=1$
        - $P(X\le m)=P(X\ge m)=0.5$
        - $m$이 클수록 오른쪽으로 이동, $\sigma$가 클수록 퍼진다` },
      { id: 'c2', t: '표준화와 확률 계산', b: T`$X\sim N(m,\sigma^2)$이면 $Z=\dfrac{X-m}{\sigma}\sim N(0,1)$ (표준정규분포)

        1. $X$의 값을 $Z$로 바꾸기 (표준화)
        2. 표준정규분포표 값으로 계산 (대칭성 이용)

        예) $N(50,10^2)$에서 $P(50\le X\le70)=P(0\le Z\le2)$` },
      { id: 'c3', t: '이항분포의 정규분포 근사', b: T`$n$이 충분히 크면 $B(n,p)$는 ==$N(np,\,npq)$== 로 근사할 수 있어요.
        예) $B(100,\dfrac12)\approx N(50,5^2)$` },
    ],
    gens: [
      { id: 'z', lv: [1, 3], card: 'c2', make: (R) => {
        const m = R.int(40, 80), s = R.pick([2, 4, 5, 10]); const k = R.pick([-2, -1, 1, 2, 3]); const x = m + k * s;
        return { q: `$X\\sim N(${m},${s}^2)$일 때 $P(X\\le${x})=P(Z\\le z)$를 만족하는 $z$의 값은?`, a: k, wrong: W(k, -k, x - m, (x - m) / (s * s)).filter((v) => v !== k && v >= -5), why: `$z=\\dfrac{x-m}{\\sigma}=\\dfrac{${x}-${m}}{${s}}=${k}$` };
      } },
      { id: 'prob', lv: [2, 5], card: 'c2', make: (R) => {
        const m = R.int(40, 80), s = R.pick([2, 4, 5, 10]); const k = R.pick([1, 2, 3, 1.5].filter((kk) => Number.isInteger(kk * s))); const T0 = TAB[k]; const x = m + k * s;
        const kind = R.pick(['mid', 'ge', 'le', 'two']);
        let ans, q, why;
        if (kind === 'mid') { ans = T0; q = `$P(${m}\\le X\\le${x})$`; why = `$P(0\\le Z\\le${k})=${T0}$`; }
        else if (kind === 'ge') { ans = r4(0.5 - T0); q = `$P(X\\ge${x})$`; why = `$P(Z\\ge${k})=0.5-P(0\\le Z\\le${k})=0.5-${T0}=${ans}$`; }
        else if (kind === 'le') { ans = r4(0.5 + T0); q = `$P(X\\le${x})$`; why = `$P(Z\\le${k})=0.5+${T0}=${ans}$`; }
        else { ans = r4(2 * T0); q = `$P(${m - k * s}\\le X\\le${x})$`; why = `대칭: $2\\times P(0\\le Z\\le${k})=2\\times${T0}=${ans}$`; }
        return { q: `$X\\sim N(${m},${s}^2)$일 때 ${q}의 값은? (${ZT})`, a: ans, fmt: 'dec', wrong: WD(ans, T0), why: `표준화: $z=\\dfrac{x-${m}}{${s}}$ → ${why}` };
      } },
      { id: 'half', lv: [1, 3], card: 'c1', make: (R) => {
        const m = R.int(30, 90), s = R.int(2, 12); const g = R.chance(0.5);
        return { q: `$X\\sim N(${m},${s}^2)$일 때 $P(X${g ? '\\ge' : '\\le'}${m})$의 값은?`, a: 0.5, fmt: 'dec', wrong: [0.3413, 0.6827, 0.1587], why: `정규분포는 $x=${m}$에 대해 대칭 → 평균 기준 반반 → $0.5$` };
      } },
      { id: 'approx', lv: [4, 5], card: 'c3', make: (R) => {
        const s = R.pick([3, 4, 5, 6]); const n = 4 * s * s, m = n / 2; const ks = [1, 2, 3].concat(s % 2 === 0 ? [1.5] : []); const k = R.pick(ks); const x = m + k * s; const T0 = TAB[k];
        const ge = R.chance(0.5); const ans = ge ? r4(0.5 - T0) : r4(0.5 + T0);
        return { q: `$X\\sim B\\left(${n},\\dfrac12\\right)$일 때, 정규분포로 근사하여 $P(X${ge ? '\\ge' : '\\le'}${x})$의 값을 구하면? (${ZT})`, a: ans, fmt: 'dec', wrong: WD(ans, T0), why: `$B(${n},\\dfrac12)\\approx N(${m},${s}^2)$ ($np=${m}$, $npq=${s * s}$). $z=\\dfrac{${x}-${m}}{${s}}=${k}$ → $${ge ? `0.5-${T0}` : `0.5+${T0}`}=${ans}$` };
      } },
    ],
  },
  {
    id: 'p.est',
    lesson: [
      { id: 'c1', t: '모집단과 표본평균', b: T`모평균 $m$, 모표준편차 $\sigma$인 모집단에서 크기 $n$인 표본을 뽑을 때 표본평균 $\overline X$는
        - $E(\overline X)=m$
        - $V(\overline X)=\dfrac{\sigma^2}{n}$
        - $\sigma(\overline X)=\dfrac{\sigma}{\sqrt n}$

        ==표본이 클수록 표본평균은 모평균 근처에 모여요.== 모집단이 $N(m,\sigma^2)$이면 $\overline X\sim N\left(m,\dfrac{\sigma^2}{n}\right)$.` },
      { id: 'c2', t: '모평균의 신뢰구간', b: T`표본평균 $\overline x$, 모표준편차 $\sigma$, 표본 크기 $n$일 때
        - 신뢰도 ==95%==: $\overline x-1.96\dfrac{\sigma}{\sqrt n}\le m\le\overline x+1.96\dfrac{\sigma}{\sqrt n}$
        - 신뢰도 ==99%==: $\overline x-2.58\dfrac{\sigma}{\sqrt n}\le m\le\overline x+2.58\dfrac{\sigma}{\sqrt n}$

        - 신뢰구간의 ==길이== $=2k\dfrac{\sigma}{\sqrt n}$ ($k$=1.96 또는 2.58)
        - 신뢰도↑ → 길이 ↑, 표본 크기 $n$↑ → 길이 ↓` },
    ],
    gens: [
      { id: 'sd', lv: [1, 3], card: 'c1', make: (R) => {
        const n = R.pick([4, 9, 16, 25, 36, 49, 64, 100]); const rt = Math.sqrt(n); const s = R.int(1, 6); const sigma = s * rt;
        return { q: `모표준편차가 $${sigma}$인 모집단에서 크기 $${n}$인 표본을 임의추출할 때, 표본평균 $\\overline X$의 표준편차 $\\sigma(\\overline X)$는?`, a: s, wrong: W(s, sigma, sigma / n, s * s), why: `$\\sigma(\\overline X)=\\dfrac{\\sigma}{\\sqrt n}=\\dfrac{${sigma}}{${rt}}=${s}$` };
      } },
      { id: 'var', lv: [2, 4], card: 'c1', make: (R) => {
        const n = R.pick([4, 9, 16, 25, 36]); const rt = Math.sqrt(n); const s = R.int(1, 6); const sigma = s * rt;
        return { q: `모분산이 $${sigma * sigma}$인 모집단에서 크기 $${n}$인 표본을 임의추출할 때, $V(\\overline X)$는?`, a: s * s, wrong: W(s * s, sigma * sigma, s, sigma), why: `$V(\\overline X)=\\dfrac{\\sigma^2}{n}=\\dfrac{${sigma * sigma}}{${n}}=${s * s}$` };
      } },
      { id: 'ci', lv: [3, 5], card: 'c2', make: (R) => {
        const n = R.pick([4, 9, 16, 25, 36, 64, 100]); const rt = Math.sqrt(n); const s = R.int(1, 5); const sigma = s * rt; const xb = R.int(30, 100);
        const hi99 = R.chance(0.3); const k = hi99 ? 2.58 : 1.96; const lower = R.chance(0.5);
        const ans = r2(lower ? xb - k * s : xb + k * s);
        return { q: `모표준편차가 $${sigma}$인 정규분포를 따르는 모집단에서 크기 $${n}$인 표본을 뽑아 구한 표본평균이 $${xb}$일 때, 모평균 $m$에 대한 신뢰도 ${hi99 ? 99 : 95}%의 신뢰구간에서 ${lower ? '하한' : '상한'}은? ($P(|Z|\\le1.96)=0.95$, $P(|Z|\\le2.58)=0.99$)`, a: ans, fmt: 'dec', wrong: WD2(ans, r2(lower ? xb + k * s : xb - k * s), r2(lower ? xb - (hi99 ? 1.96 : 2.58) * s : xb + (hi99 ? 1.96 : 2.58) * s), r2(lower ? xb - k * sigma : xb + k * sigma)), why: `$\\dfrac{\\sigma}{\\sqrt n}=\\dfrac{${sigma}}{${rt}}=${s}$ → $${xb}${lower ? '-' : '+'}${k}\\times${s}=${ans}$` };
      } },
      { id: 'width', lv: [3, 5], card: 'c2', make: (R) => {
        const kk = R.pick([2, 3]); const kind = R.pick(['n', 'cl']);
        if (kind === 'n') { const f = fS(1, kk); return { q: `모표준편차와 신뢰도가 같을 때, 표본의 크기를 ${kk * kk}배로 하면 모평균의 신뢰구간의 길이는 몇 배가 되는가?`, correct: `$${f}$배`, wrong: [`${kk}배`, `${kk * kk}배`, `$${fS(1, kk * kk)}$배`], why: `길이는 $\\dfrac1{\\sqrt n}$에 비례 → $\\sqrt{${kk * kk}}=${kk}$ 이므로 $\\dfrac1{${kk}}$배` }; }
        return { q: '표본의 크기와 표본평균이 같을 때, 신뢰도를 95%에서 99%로 높이면 신뢰구간의 길이는?', correct: '길어진다', wrong: ['짧아진다', '변하지 않는다'], why: '$1.96\\to2.58$로 커지므로 길이 $2k\\dfrac{\\sigma}{\\sqrt n}$이 길어진다 (더 확실히 포함하려면 구간을 넓혀야 함)' };
      } },
    ],
  },
];
