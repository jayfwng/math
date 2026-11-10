// 지도(MAP)와 실제 콘텐츠(개념 설명 + 문제 생성기)를 연결한다.
import { MAP } from './map.js';
import m1a from './m1-a.js';
import m1b from './m1-b.js';
import m1c from './m1-c.js';
import m1d from './m1-d.js';
import m2a from './m2-a.js';
import m2b from './m2-b.js';
import m3a from './m3-a.js';
import m3b from './m3-b.js';
import h3 from './h3.js';
import h2 from './h2.js';
import h1b from './h1-b.js';
import h1a from './h1-a.js';

const IMPL_LIST = [...m1a, ...m1b, ...m1c, ...m1d, ...m2a, ...m2b, ...m3a, ...m3b, ...h1a, ...h1b, ...h2, ...h3];

export const IMPL = {};
for (const c of IMPL_LIST) IMPL[c.id] = c;

export const GRADES = [];
export const CONCEPTS = []; // 지도 순서대로 평탄화
export const byId = {};

let prev = null;
for (const g of MAP) {
  const grade = { id: g.id, name: g.name, units: [] };
  for (const u of g.units) {
    const unit = { id: u.id, title: u.title, gradeId: g.id, gradeName: g.name, concepts: [] };
    u.concepts.forEach((t, k) => {
      const [id, title, pre] = t;
      const c = {
        id, title, unitId: u.id, unitTitle: u.title, gradeId: g.id, gradeName: g.name,
        pre: pre || (prev ? [prev.id] : []),
        impl: IMPL[id] || null,
        idx: CONCEPTS.length,
      };
      unit.concepts.push(c);
      CONCEPTS.push(c);
      byId[id] = c;
      prev = c;
    });
    grade.units.push(unit);
  }
  GRADES.push(grade);
}

export const available = (c) => !!(c && c.impl && c.impl.lesson && c.impl.gens && c.impl.gens.length);
export const ANCHORS = CONCEPTS.filter((c) => c.impl && c.impl.anchor);
