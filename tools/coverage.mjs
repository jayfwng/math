// 개념 지도(MAP) 대비 구현 현황 점검 → COVERAGE.md 생성
//   node tools/coverage.mjs
import fs from 'node:fs';
import { GRADES, CONCEPTS, IMPL, available } from '../content/index.js';

const lines = [];
let total = 0, ok = 0, gensTotal = 0;
const problems = [];
lines.push('# 커버리지 점검표', '', '개념 지도(`content/map.js`)에 있는 모든 개념이 설명+문제 생성기를 갖고 있는지 자동 점검한 결과예요.', '');
lines.push('| 영역 | 단원 | 개념 | 구현 | 문제 유형 |', '|---|---|---|---|---|');
for (const g of GRADES) {
  for (const u of g.units) {
    const cs = u.concepts;
    const done = cs.filter(available);
    const gens = done.reduce((s, c) => s + c.impl.gens.length, 0);
    total += cs.length; ok += done.length; gensTotal += gens;
    lines.push(`| ${g.name} | ${u.title} | ${cs.map((c) => c.title).join(' · ')} | ${done.length}/${cs.length} | ${gens}개 |`);
    cs.filter((c) => !available(c)).forEach((c) => problems.push(`- 미구현: ${c.id} (${c.title})`));
  }
}
const mapIds = new Set(CONCEPTS.map((c) => c.id));
Object.keys(IMPL).filter((id) => !mapIds.has(id)).forEach((id) => problems.push(`- 지도에 없는 구현: ${id}`));
for (const c of CONCEPTS.filter(available)) {
  const lessonIds = new Set(c.impl.lesson.map((l) => l.id));
  for (const g of c.impl.gens) if (!lessonIds.has(g.card)) problems.push(`- 설명 카드 없음: ${c.id}/${g.id} → ${g.card}`);
  const lv = new Set(); c.impl.gens.forEach((g) => { for (let k = g.lv[0]; k <= g.lv[1]; k++) lv.add(k); });
  for (let k = 1; k <= 5; k++) if (!lv.has(k)) problems.push(`- 난이도 공백(가까운 난이도 문제로 대체됨): ${c.id} Lv${k}`);
}
lines.push('', `**총 ${total}개 개념 중 ${ok}개 구현 · 문제 유형 ${gensTotal}개**`, '');
lines.push(problems.length ? '## 참고 사항\n' + problems.join('\n') : '문제 없음 ✅ (모든 개념에 설명·문제가 있고 Lv1~5가 모두 채워져 있어요)');
fs.writeFileSync(new URL('../COVERAGE.md', import.meta.url), lines.join('\n') + '\n');
console.log(`개념 ${ok}/${total} · 문제 유형 ${gensTotal}개 · ${problems.length ? `참고 ${problems.length}건` : '이상 없음'}`);
problems.slice(0, 30).forEach((p) => console.log(p));
