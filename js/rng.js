// 시드 기반 난수: 같은 시드면 항상 같은 문제가 만들어진다.
export function rng(seed) {
  let a = seed >>> 0;
  const next = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const R = {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
    nz: (lo, hi) => { let v; do { v = lo + Math.floor(next() * (hi - lo + 1)); } while (v === 0); return v; },
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    chance: (p) => next() < p,
    shuffle: (arr) => {
      const b = arr.slice();
      for (let i = b.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1));
        [b[i], b[j]] = [b[j], b[i]];
      }
      return b;
    },
    sample: (arr, n) => R.shuffle(arr).slice(0, n),
  };
  return R;
}

export const newSeed = () => (Math.random() * 4294967296) >>> 0;
