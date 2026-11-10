// 학습 엔진: 문제 만들기, 채점, 난이도 조절, 오답 복습(간격 반복), 진단
import { rng, newSeed } from './rng.js';
import { toFrac, fr, feq, fTex, parseNum } from './lib.js';
import * as S from './store.js';

export const LV_MAX = 5;
export const INTERVALS = [1, 2, 4, 8, 16, 32]; // 복습 간격(일)

// ── 숫자 표시 ──
function fmtTex(f, fmt, suf = '') {
  if (suf) {
    if (f.n === 0) return '0';
    if (f.d === 1 && Math.abs(f.n) === 1) return `${f.n < 0 ? '-' : ''}${suf}`;
    return `${fTex(f)}${suf}`;
  }
  if (fmt === 'dec') {
    let d = f.d;
    while (d % 2 === 0) d /= 2;
    while (d % 5 === 0) d /= 5;
    if (d === 1) return String(Math.round((f.n / f.d) * 1e6) / 1e6);
  }
  return fTex(f);
}

// 숫자 정답의 그럴듯한 오답 보기
function numDistractors(R, f, extra = [], fmt) {
  const cands = [];
  const seen = new Set([`${f.n}/${f.d}`]);
  const add = (x) => {
    if (!x || !Number.isFinite(x.n) || !Number.isFinite(x.d) || x.d === 0) return;
    const y = fr(x.n, x.d);
    const k = `${y.n}/${y.d}`;
    if (seen.has(k)) return;
    seen.add(k);
    cands.push(y);
  };
  const first = [];
  for (const e of extra) { const y = toFrac(e); const k = `${y.n}/${y.d}`; if (!seen.has(k)) { seen.add(k); first.push(y); } }
  const keep = cands;
  const noNeg = f.n >= 0;
  if (f.d === 1) {
    const a = f.n;
    [1, -1, 2, -2, 3, 10, -10].forEach((k) => add({ n: a + k, d: 1 }));
    add({ n: -a, d: 1 }); add({ n: a * 2, d: 1 });
    if (a % 2 === 0) add({ n: a / 2, d: 1 });
  } else {
    const { n, d } = f;
    add({ n: -n, d }); add({ n: d, d: n }); add({ n: n + 1, d }); add({ n: n - 1, d });
    add({ n, d: d + 1 }); add({ n, d: d - 1 }); add({ n: n + d, d }); add({ n: n * 2, d });
  }
  const near = R.shuffle(noNeg ? keep.filter((y) => y.n >= 0) : keep);
  const out = [...R.shuffle(first), ...near].slice(0, 3);
  let k = 3;
  while (out.length < 3) { // 최후의 수단
    const y = fr(f.n * 3 + k, f.d * 3);
    const kk = `${y.n}/${y.d}`;
    if (!seen.has(kk)) { seen.add(kk); out.push(y); }
    k++;
  }
  return out;
}

// raw(생성기 결과) → 화면에 쓸 문제 객체
export function finalize(raw, R, lv) {
  const base = { q: raw.q, fig: raw.fig || '', why: raw.why || '', card: raw.card, unit: raw.unit || '', hint: raw.hint || '' };
  if (raw.a !== undefined) {
    const f = toFrac(raw.a);
    const useInput = raw.input === false ? false : lv >= (raw.inputLv ?? 4);
    const suf = raw.suf || '';
    const shown = `$${fmtTex(f, raw.fmt, suf)}$${raw.unit ? (raw.unit === '°' ? '' : ' ') + raw.unit : ''}`;
    if (useInput) return { ...base, kind: 'num', expect: f, shown, suf };
    const wrongs = numDistractors(R, f, raw.wrong || [], raw.fmt);
    let opts = [f, ...wrongs];
    opts = raw.sortNum ? opts.sort((x, y) => x.n * y.d - y.n * x.d) : R.shuffle(opts);
    return {
      ...base, kind: 'mc', shown,
      choices: opts.map((v) => `$${fmtTex(v, raw.fmt, suf)}$${raw.unit ? (raw.unit === '°' ? '' : ' ') + raw.unit : ''}`),
      ans: opts.indexOf(f),
    };
  }
  const wrap = (s) => (raw.m ? `$${s}$` : s);
  const wrongs = [...new Set(raw.wrong)].filter((w) => w !== raw.correct);
  let opts = raw.all ? raw.all.slice() : [raw.correct, ...wrongs.slice(0, raw.max ? raw.max - 1 : 3)];
  if (raw.sortNum) opts.sort((x, y) => Number(x) - Number(y));
  else if (!raw.all && !raw.order) opts = R.shuffle(opts);
  return { ...base, kind: 'mc', shown: wrap(raw.correct), choices: opts.map(wrap), ans: opts.indexOf(raw.correct) };
}

export function pickGen(concept, lv, R) {
  const ok = concept.gens.filter((g) => lv >= g.lv[0] && lv <= g.lv[1]);
  return R.pick(ok.length ? ok : concept.gens);
}

export function makeProblem(concept, seed, lv) {
  let lastErr;
  for (let t = 0; t < 6; t++) {
    try {
      const R = rng((seed + t * 7919) >>> 0);
      const g = pickGen(concept, lv, R);
      const raw = g.make(R, lv);
      const p = finalize(raw, R, lv);
      p.card = raw.card ?? g.card ?? concept.lesson[0].id;
      p.cid = concept.id; p.seed = seed; p.lv = lv; p.gid = g.id;
      return p;
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}

// 복습 때 보기 위치를 바꿔서 위치로 외우지 못하게 한다.
export function reshuffle(p, seed) {
  if (p.kind !== 'mc' || p.noShuffle) return p;
  const R = rng(seed);
  const idx = R.shuffle(p.choices.map((_, i) => i));
  return { ...p, choices: idx.map((i) => p.choices[i]), ans: idx.indexOf(p.ans) };
}

export function grade(p, input) {
  if (p.kind === 'mc') return input === p.ans;
  const v = parseNum(input);
  return !!v && feq(v, toFrac(p.expect));
}

// ── 난이도 조절 ──
// 현재 레벨에서 최근 5문제 중 4개 이상 정답 → 레벨 업, 연속 3번 오답 → 레벨 다운
export function applyAnswer(cs, ok) {
  cs.attempts++;
  if (ok) cs.correct++;
  cs.hist.push(ok ? 1 : 0);
  if (cs.hist.length > 5) cs.hist.shift();
  cs.last = Date.now();
  const n = cs.hist.length;
  const c = cs.hist.reduce((a, b) => a + b, 0);
  const out = { change: 0, struggle: false };
  if (n >= 4 && c >= 4) {
    if (cs.lv < LV_MAX) { cs.lv++; out.change = 1; } else if (!cs.mastered) { cs.mastered = true; out.change = 2; }
    cs.hist = [];
  } else if (n >= 3 && cs.hist.slice(-3).every((x) => x === 0)) {
    out.struggle = true;
    if (cs.lv > 1) { cs.lv--; out.change = -1; }
    cs.hist = [];
  }
  return out;
}

export const isUnderstood = (cs) => !!cs && (cs.mastered || cs.lv >= 4);
export function status(cs) {
  if (!cs || (!cs.seen && cs.attempts === 0)) return 'new';
  if (cs.mastered) return 'master';
  if (cs.lv >= 4) return 'ok';
  return 'learning';
}

// ── 하루 기록/연속 학습 ──
export function touchDay() {
  const st = S.get();
  const today = S.todayKey();
  if (st.daily.date !== today) st.daily = { date: today, solved: 0, correct: 0 };
  if (st.streak.last !== today) {
    const y = new Date(S.dayNum() * 86400000 + 12 * 3600000 - 86400000);
    const yKey = `${y.getUTCFullYear()}-${String(y.getUTCMonth() + 1).padStart(2, '0')}-${String(y.getUTCDate()).padStart(2, '0')}`;
    st.streak.count = st.streak.last === yKey ? st.streak.count + 1 : 1;
    st.streak.last = today;
  }
}
export function currentStreak() {
  const st = S.get();
  const today = S.todayKey();
  const y = new Date(S.dayNum() * 86400000 + 12 * 3600000 - 86400000);
  const yKey = `${y.getUTCFullYear()}-${String(y.getUTCMonth() + 1).padStart(2, '0')}-${String(y.getUTCDate()).padStart(2, '0')}`;
  return st.streak.last === today || st.streak.last === yKey ? st.streak.count : 0;
}
export function todayDone() {
  const st = S.get();
  return st.daily.date === S.todayKey() ? st.daily : { solved: 0, correct: 0 };
}

// 문제 한 개를 푼 결과를 모두 기록한다. (practice: 개념 연습, review: 복습, diag: 진단)
export function record(p, ok, mode, reviewItem) {
  const st = S.get();
  touchDay();
  st.daily.solved++; if (ok) st.daily.correct++;
  st.totals.solved++; if (ok) st.totals.correct++;
  let res = { change: 0, struggle: false };
  if (mode !== 'review') {
    const cs = S.conceptState(p.cid);
    cs.seen = true;
    if (mode === 'practice') res = applyAnswer(cs, ok);
  }
  if (mode === 'review' && reviewItem) reviewDone(reviewItem, ok);
  else if (!ok) addWrong(p);
  S.save();
  return res;
}

// ── 오답 복습 큐 ──
export const probKey = (p) => `${p.cid}:${p.seed}:${p.lv}:${p.gid}`;
export function addWrong(p) {
  const st = S.get();
  const key = probKey(p);
  const due = S.dayNum() + INTERVALS[0];
  const ex = st.review.find((r) => r.key === key);
  if (ex) { ex.box = 0; ex.due = due; ex.wrong = (ex.wrong || 0) + 1; return; }
  const snap = { ...p };
  st.review.push({ key, cid: p.cid, snap, box: 0, due, wrong: 1, added: S.dayNum() });
}
export function reviewDone(item, ok) {
  const st = S.get();
  const it = st.review.find((r) => r.key === item.key);
  if (!it) return;
  if (ok) {
    it.box += 1;
    if (it.box >= INTERVALS.length) { st.review = st.review.filter((r) => r !== it); return; }
    it.due = S.dayNum() + INTERVALS[it.box];
  } else {
    it.box = 0; it.due = S.dayNum() + INTERVALS[0]; it.wrong = (it.wrong || 0) + 1;
  }
}
export function dueItems(limit = 999) {
  const st = S.get();
  const t = S.dayNum();
  return st.review.filter((r) => r.due <= t).sort((a, b) => a.due - b.due || a.box - b.box).slice(0, limit);
}
export const dueCount = () => dueItems().length;

// ── 진단(실력 확인) ──
export function buildDiag(anchors) {
  const items = [];
  for (const c of anchors) {
    for (let k = 0; k < 2; k++) items.push({ cid: c.id, lv: 2, seed: newSeed() });
  }
  return items;
}
