// 진행 상황 저장 (브라우저 localStorage)
const KEY = 'mathapp.v1';

const defaults = () => ({
  v: 1,
  created: Date.now(),
  name: '',
  placement: null, // { date, startId, weak:[cid], passed:[cid] }
  concepts: {},    // cid → { lv, hist, attempts, correct, mastered, seen, last }
  review: [],      // { key, cid, snap, box, due, wrong }
  daily: { date: '', solved: 0, correct: 0 },
  goal: 10,
  streak: { count: 0, last: '' },
  totals: { solved: 0, correct: 0 },
});

const hasLS = () => { try { return typeof localStorage !== 'undefined' && !!localStorage; } catch (e) { return false; } };

let state = load();

function load() {
  try {
    if (hasLS()) {
      const raw = localStorage.getItem(KEY);
      if (raw) return { ...defaults(), ...JSON.parse(raw) };
    }
  } catch (e) { /* 손상된 저장값은 무시 */ }
  return defaults();
}

export const get = () => state;
export function save() { try { if (hasLS()) localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 저장 공간 부족 등 */ } }
export function reset() { state = defaults(); save(); }

// ── 날짜 (기기의 현지 시간 기준) ──
let clock = () => new Date();
export const setClock = (fn) => { clock = fn; };
export const dayNum = (d = clock()) => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
export const todayKey = (d = clock()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// ── 백업 코드 ──
export function exportCode() {
  const json = JSON.stringify(state);
  return btoa(unescape(encodeURIComponent(json)));
}
export function importCode(code) {
  const json = decodeURIComponent(escape(atob(code.trim())));
  const obj = JSON.parse(json);
  if (!obj || obj.v !== 1 || typeof obj.concepts !== 'object') throw new Error('bad');
  state = { ...defaults(), ...obj };
  save();
}

export function conceptState(cid) {
  if (!state.concepts[cid]) state.concepts[cid] = { lv: 1, hist: [], attempts: 0, correct: 0, mastered: false, seen: false, last: 0 };
  return state.concepts[cid];
}
