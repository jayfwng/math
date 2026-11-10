// 문제 생성기 자동 점검:  node tools/test.mjs [content/파일.js ...] [--samples] [--n=200]
// - 모든 생성기를 레벨별로 여러 시드로 돌려 예외, 중복 보기, 깨진 수식, 'NaN/undefined' 등을 찾는다.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { makeProblem, grade } from '../js/engine.js';
import { rich, texErrors } from '../js/tex.js';
import { toFrac, fStr } from '../js/lib.js';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const samples = args.includes('--samples');
const N = Number((args.find((a) => a.startsWith('--n=')) || '--n=150').slice(4));
const only = (args.find((a) => a.startsWith('--only=')) || '').slice(7);
let files = args.filter((a) => !a.startsWith('--'));
if (!files.length) {
  const dir = path.join(here, '..', 'content');
  files = fs.readdirSync(dir).filter((f) => /^(m|h|p|c|g)\d?(-.*)?\.js$/.test(f)).map((f) => path.join(dir, f));
}

let errors = 0, probs = 0, gensN = 0, conceptsN = 0;
const bad = /undefined|NaN|\[object|Infinity|null/;
const groups = new Map();
const err = (where, msg) => {
  errors++;
  const key = `${where.split('/').slice(0, 2).join('/')} :: ${msg.replace(/[:：].*$/, '').slice(0, 30)}`;
  const g = groups.get(key) || { n: 0, ex: `${where}: ${msg}` };
  g.n++; groups.set(key, g);
};

function braceOK(s) {
  let d = 0;
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && (s[i + 1] === '{' || s[i + 1] === '}')) { i++; continue; }
    if (s[i] === '{') d++;
    else if (s[i] === '}') { d--; if (d < 0) return false; }
  }
  return d === 0;
}
function checkText(where, t) {
  if (typeof t !== 'string') { err(where, `문자열이 아님: ${t}`); return; }
  if (bad.test(t)) err(where, `이상한 값 포함: ${t.slice(0, 80)}`);
  if ((t.match(/\$/g) || []).length % 2) err(where, `$ 개수가 홀수: ${t.slice(0, 80)}`);
  const segs = t.match(/\$\$[\s\S]+?\$\$|\$[^$]+?\$/g) || [];
  for (const sgm of segs) if (!braceOK(sgm)) err(where, `중괄호 불일치: ${sgm.slice(0, 80)}`);
  texErrors.length = 0;
  rich(t);
  if (texErrors.length) err(where, `알 수 없는 수식 명령: ${texErrors.join(',')} in ${t.slice(0, 80)}`);
}

for (const f of files) {
  const mod = await import(pathToFileURL(path.resolve(f)).href);
  for (const c of mod.default) {
    if (only && !c.id.includes(only)) continue;
    conceptsN++;
    const ids = new Set(c.lesson.map((l) => l.id));
    if (ids.size !== c.lesson.length) err(c.id, '레슨 카드 id 중복');
    c.lesson.forEach((l) => { checkText(`${c.id}/lesson/${l.id}`, l.b); if (!l.t) err(c.id, `카드 제목 없음 ${l.id}`); });
    for (const g of c.gens) {
      gensN++;
      if (!ids.has(g.card)) err(`${c.id}/${g.id}`, `card '${g.card}'가 lesson에 없음`);
      const solo = { id: c.id, lesson: c.lesson, gens: [g] };
      for (let lv = g.lv[0]; lv <= g.lv[1]; lv++) {
        for (let k = 0; k < N; k++) {
          const seed = (k * 2654435761 + lv * 97) >>> 0;
          const w = `${c.id}/${g.id}/lv${lv}/seed${seed}`;
          let p;
          try { p = makeProblem(solo, seed, lv); } catch (e) { err(w, `예외: ${e.message}`); break; }
          probs++;
          checkText(w + '/q', p.q); checkText(w + '/why', p.why);
          if (!p.why || p.why.length < 8) err(w, 'why(풀이)가 비어 있음');
          if (!ids.has(p.card)) err(w, `p.card '${p.card}' 없음`);
          if (p.kind === 'mc') {
            if (p.choices.length < 2) err(w, '보기가 2개 미만');
            if (new Set(p.choices).size !== p.choices.length) err(w, `보기 중복: ${p.choices.join(' | ')}`);
            if (!(p.ans >= 0 && p.ans < p.choices.length)) err(w, `정답 인덱스 이상: ${p.ans}`);
            p.choices.forEach((x, i) => { checkText(`${w}/choice${i}`, x); if (!String(x).trim()) err(w, '빈 보기'); });
            if (!grade(p, p.ans) || grade(p, (p.ans + 1) % p.choices.length)) err(w, '채점 이상');
          } else if (p.kind === 'num') {
            const e = toFrac(p.expect);
            if (!Number.isFinite(e.n) || !Number.isFinite(e.d)) err(w, '정답 숫자 이상');
            if (!grade(p, fStr(e))) err(w, '숫자 채점 이상');
          } else err(w, `kind 이상: ${p.kind}`);
          if (k === 0 && samples) {
            console.log(`\n[${c.id}/${g.id} Lv${lv}] ${p.kind}${p.fig ? ' +fig' : ''}\nQ: ${p.q}\n${p.kind === 'mc' ? p.choices.map((x, i) => `  ${i === p.ans ? '●' : '○'} ${x}`).join('\n') : `  정답: ${p.shown}`}\n풀이: ${p.why.replace(/\n/g, ' / ')}`);
          }
        }
      }
    }
  }
}
for (const [k, g] of groups) console.log(`✗ ${k} ×${g.n}\n    예) ${g.ex}`);
console.log(`\n개념 ${conceptsN}개 · 생성기 ${gensN}개 · 문제 ${probs}개 점검 → ${errors ? `❌ 오류 ${errors}건` : '✅ 문제 없음'}`);
process.exit(errors ? 1 : 0);
