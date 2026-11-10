// 화면과 사용자 동작
import * as S from './store.js';
import * as E from './engine.js';
import { rich, esc } from './tex.js';
import { newSeed } from './rng.js';
import { GRADES, CONCEPTS, byId, available, ANCHORS } from '../content/index.js';

const $app = document.getElementById('app');
const $tabs = document.getElementById('tabs');
const st = () => S.get();
const LV = ['', '기초', '쉬움', '보통', '응용', '도전'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

let route = { name: 'home' };
let SES = null; // 진행 중인 문제 풀이(연습·복습·진단)

// ───────────── 길찾기 ─────────────
function go(name, params = {}) {
  route = { name, ...params };
  history.pushState({ route }, '');
  render(true);
}
function swap(name, params = {}) { // 현재 기록을 대체 (결과 화면 등)
  route = { name, ...params };
  history.replaceState({ route }, '');
  render(true);
}
window.addEventListener('popstate', (e) => {
  let r = e.state && e.state.route;
  if (r && ['practice', 'result'].includes(r.name) && !SES) r = null;
  route = r || { name: 'home' };
  render(true);
});

// ───────────── 도우미 ─────────────
const unitOf = (c) => `${c.gradeName} · ${c.unitTitle}`;
const cs = (id) => st().concepts[id];
function nextConcept() {
  const s0 = st().placement && st().placement.startId && byId[st().placement.startId] ? byId[st().placement.startId].idx : 0;
  const order = [...CONCEPTS.slice(s0), ...CONCEPTS.slice(0, s0)];
  return order.find((c) => available(c) && !['ok', 'master'].includes(E.status(cs(c.id)))) || null;
}
const lvBars = (c) => {
  const x = cs(c.id); if (!x || (!x.seen && !x.attempts)) return '';
  const lv = x.mastered ? 5 : x.lv;
  return `<span class="lvs ${x.mastered ? 'm' : ''}" title="Lv ${lv}">${[1, 2, 3, 4, 5].map((i) => `<i class="${i <= lv ? 'on' : ''}"></i>`).join('')}</span>`;
};
const statusText = (c) => ({ new: '아직 시작 전', learning: `연습 중 · Lv ${cs(c.id)?.lv}`, ok: '이해했어요 ✓', master: '마스터 ★' }[E.status(cs(c.id))]);
const cardOf = (p) => { const c = byId[p.cid]; return c && c.impl ? c.impl.lesson.find((l) => l.id === p.card) : null; };

// ───────────── 화면 ─────────────
function viewHome() {
  const s = st(), day = E.todayDone(), goal = s.goal || 10;
  const pct = Math.min(100, Math.round((day.solved * 100) / goal));
  const due = E.dueCount(), next = nextConcept(), streak = E.currentStreak();
  const done = CONCEPTS.filter((c) => available(c) && ['ok', 'master'].includes(E.status(cs(c.id)))).length;
  const total = CONCEPTS.filter(available).length;
  let h = `<div class="hd"><div><div class="hello">${s.name ? esc(s.name) + '님, ' : ''}오늘도 조금만 해봐요</div><h1>다시, 수학</h1></div><div class="streak" title="연속 학습일">🔥${streak}<small>일</small></div></div>`;
  h += `<div class="card"><div class="row"><b>오늘의 목표</b><span class="sub">${day.solved} / ${goal}문제</span></div><div class="bar ${day.solved >= goal ? 'ok' : ''}" style="margin-top:10px"><i style="width:${pct}%"></i></div>${day.solved >= goal ? '<p class="ok-txt" style="margin:10px 0 0">오늘 목표 달성! 🎉 더 풀어도 좋아요.</p>' : ''}</div>`;
  if (!s.placement) {
    h += `<div class="card"><span class="chip">처음이라면</span><h2 style="margin-top:8px">실력 확인부터 해볼까요?</h2><p class="sub">쉬운 문제부터 풀면서 어디서부터 시작하면 좋을지 찾아요. 틀려도 괜찮아요. 모르면 "모르겠어요"를 눌러도 돼요.</p><div class="stack"><button class="btn primary" data-act="diag-intro">실력 확인하기 (5분 안팎)</button><button class="link" data-act="skip-diag" style="width:100%">건너뛰고 처음부터 시작할래요</button></div></div>`;
  }
  if (next) {
    const seen = cs(next.id) && cs(next.id).seen;
    h += `<div class="card"><div class="eyebrow">${esc(unitOf(next))}</div><h2>${esc(next.title)}</h2><p class="sub" style="margin-top:0">${statusText(next)} ${lvBars(next)}</p><div class="stack"><button class="btn primary" data-act="${seen ? 'practice' : 'lesson'}" data-id="${next.id}">${seen ? '이어서 문제 풀기' : '개념 보고 시작하기'}</button>${seen ? `<button class="btn" data-act="lesson" data-id="${next.id}">개념 설명 다시 보기</button>` : ''}</div></div>`;
  } else {
    h += `<div class="card center"><h2>준비된 개념을 모두 이해했어요 👏</h2><p class="sub">새 단원이 계속 추가될 거예요. 그동안은 복습으로 실력을 굳혀요.</p></div>`;
  }
  h += `<div class="card"><div class="row"><div><b>오답 복습</b><div class="sub">${due ? `오늘 다시 풀 문제 ${due}개` : '오늘 복습할 문제가 없어요'}</div></div>${due ? `<button class="btn sm primary" data-act="review-start">${due}개 풀기</button>` : '<span class="chip ok">완료 ✓</span>'}</div></div>`;
  h += `<div class="stats"><div class="stat"><b>${done}<small style="font-size:14px;color:var(--sub)">/${total}</small></b><span>이해한 개념</span></div><div class="stat"><b>${s.totals.solved}</b><span>푼 문제</span></div><div class="stat"><b>${s.totals.solved ? Math.round((s.totals.correct * 100) / s.totals.solved) : 0}%</b><span>정답률</span></div></div>`;
  if (!s.hintDismissed && /iPhone|iPad|iPod/.test(navigator.userAgent) && !navigator.standalone) {
    h += `<div class="note" style="margin-top:14px">📲 <b>앱처럼 쓰려면</b> Safari 아래의 공유 버튼(□↑)을 누르고 <b>"홈 화면에 추가"</b>를 선택하세요. <button class="link" data-act="hint-off">닫기</button></div>`;
  }
  return h;
}

function viewMap() {
  let h = `<div class="hd"><div><div class="hello">전체 과정</div><h1>학습</h1></div></div><p class="sub">중1부터 고3까지 순서대로 이어져 있어요. 어디든 눌러서 시작할 수 있어요.</p>`;
  const nx = nextConcept();
  for (const g of GRADES) {
    const av = g.units.flatMap((u) => u.concepts).filter(available);
    const ok = av.filter((c) => ['ok', 'master'].includes(E.status(cs(c.id)))).length;
    const open = nx ? nx.gradeId === g.id : g.id === GRADES[0].id;
    h += `<details class="grade" ${open ? 'open' : ''}><summary><span>${esc(g.name)}</span><span class="chip ${av.length ? '' : 'gray'}">${av.length ? `${ok}/${av.length} 이해` : '준비 중'}</span></summary>`;
    for (const u of g.units) {
      h += `<div class="unit"><h4>${esc(u.title)}</h4>`;
      for (const c of u.concepts) {
        const on = available(c);
        h += `<button class="crow ${on ? '' : 'off'}" ${on ? `data-act="concept" data-id="${c.id}"` : 'disabled'}><span class="dot ${on ? E.status(cs(c.id)) : ''}"></span><span class="t">${esc(c.title)}</span>${on ? lvBars(c) : '<span class="chip gray">준비 중</span>'}</button>`;
      }
      h += '</div>';
    }
    h += '</details>';
  }
  return h;
}

function viewConcept() {
  const c = byId[route.id];
  const x = cs(c.id);
  const pre = c.pre.map((id) => byId[id]).filter((p) => p && available(p) && !['ok', 'master'].includes(E.status(cs(p.id))))[0];
  const lv = x ? x.lv : 1;
  let h = `${backBtn()}<div class="eyebrow">${esc(unitOf(c))}</div><h1 style="font-size:24px">${esc(c.title)}</h1><p class="sub">${statusText(c)} ${lvBars(c)}</p>`;
  h += `<div class="card stack"><button class="btn ${x && x.seen ? '' : 'primary'}" data-act="lesson" data-id="${c.id}">📘 개념 설명 보기</button><button class="btn ${x && x.seen ? 'primary' : ''}" data-act="practice" data-id="${c.id}">✏️ 문제 풀기 <span class="sub" style="color:inherit;opacity:.8">· Lv ${lv} ${LV[lv]}</span></button></div>`;
  if (pre) h += `<div class="note">앞 단계가 흔들린다면 먼저 이 개념부터 복습해 보세요 → <button class="link" data-act="concept" data-id="${pre.id}">${esc(pre.title)}</button></div>`;
  return h;
}

const backBtn = () => `<div class="top"><button class="x" data-act="back" aria-label="뒤로">←</button></div>`;

function viewLesson() {
  const c = byId[route.id], L = c.impl.lesson, i = route.i || 0, card = L[i];
  let h = `<div class="top"><button class="x" data-act="back" aria-label="닫기">✕</button><div class="bar"><i style="width:${((i + 1) * 100) / L.length}%"></i></div><span class="chip gray">${i + 1}/${L.length}</span></div>`;
  h += `<div class="lesson"><div class="eyebrow">${esc(c.title)}</div><div class="card"><h2>${esc(card.t)}</h2><div>${rich(card.b)}</div></div></div>`;
  h += `<div class="dock"><div class="btns">${i > 0 ? '<button class="btn" data-act="lprev">이전</button>' : ''}${i < L.length - 1 ? '<button class="btn primary" data-act="lnext">다음</button>' : `<button class="btn primary" data-act="lend" data-id="${c.id}">문제 풀러 가기 →</button>`}</div></div>`;
  return h;
}

function viewQuestion() {
  const ses = SES, q = ses.q, p = q.p;
  const cstate = ses.mode === 'practice' ? S.conceptState(ses.cid) : null;
  const label = ses.mode === 'practice' ? `Lv ${cstate.lv}` : ses.mode === 'review' ? '복습' : '진단';
  let h = `<div class="top"><button class="x" data-act="quit" aria-label="그만하기">✕</button><div class="bar"><i style="width:${Math.round((ses.n * 100) / ses.total)}%"></i></div><span class="chip">${label}</span></div>`;
  if (ses.toast && !q.done) { h += `<div class="toast">${ses.toast}</div>`; }
  h += `<div class="card qcard"><div class="qtext">${rich(p.q)}</div>${p.fig || ''}</div>`;
  if (p.kind === 'mc') {
    h += '<div class="choices">' + p.choices.map((c, i) => {
      let cls = '';
      if (q.done) cls = i === p.ans ? 'ok' : (i === q.chosen ? 'bad' : 'dim');
      return `<button class="choice ${cls}" data-act="pick" data-i="${i}" ${q.done ? 'disabled' : ''}><span class="n">${i + 1}</span><span class="t">${rich(c)}</span></button>`;
    }).join('') + '</div>';
  } else {
    const suf = (p.suf ? rich(`$${p.suf}$`) : '') + (p.unit ? `<span style="font-size:18px;font-weight:600">${esc(p.unit)}</span>` : '');
    h += `<div class="numdisp ${q.done ? (q.ok ? 'ok' : 'bad') : ''}">${q.input ? esc(q.input) : '<span class="ph">답을 입력하세요</span>'}${suf}</div>`;
    if (!q.done) {
      const K = (k, t = k, cls = '') => `<button class="${cls}" data-act="key" data-k="${k}">${t}</button>`;
      h += `<div class="pad">${K('7')}${K('8')}${K('9')}${K('del', '⌫')}${K('4')}${K('5')}${K('6')}${K('-', '−')}${K('1')}${K('2')}${K('3')}${K('/', '/')}${K('0')}${K('.', '.')}<span></span>${K('go', '확인', 'go')}</div>`;
      h += `<div class="sub center" style="margin-top:8px">분수는 3/4 처럼, 음수는 − 를 먼저 눌러요</div>`;
    }
  }
  if (!q.done) h += `<button class="skip" data-act="skip">모르겠어요</button>`;
  else if (ses.mode !== 'diag') {
    const card = !q.ok ? cardOf(p) : null;
    h += `<div class="fb ${q.ok ? 'ok' : 'bad'}"><h3>${q.ok ? pick(['정답이에요! 👍', '맞았어요! ✅', '정확해요! 👏']) : (q.skipped ? '괜찮아요, 같이 볼게요 🙂' : '아쉬워요, 같이 짚어봐요')}</h3><div class="ans">정답: ${rich(p.kind === 'mc' ? p.choices[p.ans] : p.shown)}</div>`;
    h += q.ok ? `<details><summary>풀이 보기</summary><div class="why">${rich(p.why)}</div></details>` : `<div class="why">${rich(p.why)}</div>`;
    if (card) h += `<div class="concept"><h4>📘 이 문제의 개념 · ${esc(card.t)}</h4><div class="body">${rich(card.b)}</div></div>`;
    if (!q.ok && ses.mode !== 'review') h += `<p class="sub" style="margin:10px 0 0">이 문제는 내일 다시 나와요. (오답 복습)</p>`;
    h += '</div>';
    if (q.res && q.res.struggle) {
      const pre = byId[ses.cid] && byId[ses.cid].pre.map((id) => byId[id]).find((x) => x && available(x));
      if (pre && ses.mode === 'practice') h += `<div class="banner">조금 어렵게 느껴지죠? 괜찮아요. 앞 단계인 <b>${esc(pre.title)}</b>부터 한 번 더 다지고 오면 훨씬 수월해요.<div class="btns" style="margin-top:10px"><button class="btn sm" data-act="concept" data-id="${pre.id}" data-leave="1">앞 단계로</button><button class="btn sm ghost" data-act="noop">계속 풀래요</button></div></div>`;
    }
    h += `<div class="dock"><button class="btn primary" data-act="next">${ses.n >= ses.total && ses.mode !== 'review' ? '결과 보기' : '다음 문제'}</button></div>`;
  }
  return h;
}

function viewResult() {
  const ses = SES;
  if (ses.mode === 'diag') return viewDiagResult();
  const n = ses.results.length, ok = ses.results.filter((r) => r.ok).length;
  const pct = n ? Math.round((ok * 100) / n) : 0;
  let h = `<div class="center" style="padding-top:24px"><div style="font-size:54px">${pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div><div class="big">${ok} / ${n}</div><p class="sub">${ses.mode === 'review' ? '복습을 마쳤어요' : '이번 연습 결과'} · 정답률 ${pct}%</p></div>`;
  if (ses.mode === 'practice') {
    const c = byId[ses.cid], x = S.conceptState(ses.cid);
    const understood = E.isUnderstood(x);
    h += `<div class="card center"><div class="eyebrow">${esc(c.title)}</div><div style="margin:6px 0">${lvBars(c)} <b>Lv ${x.mastered ? 5 : x.lv}</b>${ses.lvStart !== x.lv ? ` <span class="chip ${x.lv > ses.lvStart ? 'ok' : 'warn'}">${ses.lvStart} → ${x.lv}</span>` : ''}</div><p class="sub" style="margin:0">${x.mastered ? '이 개념을 마스터했어요! ★' : understood ? '이 개념을 이해했어요 ✓ 다음으로 넘어가도 좋아요.' : '4~5문제 중 4개를 맞히면 레벨이 올라가요.'}</p></div>`;
    const wrong = n - ok;
    if (wrong) h += `<div class="note">틀린 문제 ${wrong}개는 내일 복습에 들어가요. 그때 한 번 더 풀면 오래 기억에 남아요.</div>`;
    const nx = nextConcept();
    h += `<div class="stack" style="margin-top:14px">${understood && nx && nx.id !== c.id ? `<button class="btn primary" data-act="${cs(nx.id) && cs(nx.id).seen ? 'practice' : 'lesson'}" data-id="${nx.id}" data-leave="1">다음 개념: ${esc(nx.title)}</button><button class="btn" data-act="practice" data-id="${c.id}" data-leave="1">이 개념 한 번 더</button>` : `<button class="btn primary" data-act="practice" data-id="${c.id}" data-leave="1">한 번 더 풀기</button>`}<button class="btn ghost" data-act="lesson" data-id="${c.id}" data-leave="1">개념 설명 다시 보기</button><button class="btn ghost" data-act="home">홈으로</button></div>`;
  } else {
    h += `<div class="note">맞힌 문제는 다음 복습 간격이 길어지고, 틀린 문제는 내일 다시 나와요.</div><div class="stack" style="margin-top:14px"><button class="btn primary" data-act="home">홈으로</button></div>`;
  }
  return h;
}

function viewDiagIntro() {
  const n = ANCHORS.length;
  return `${backBtn()}<h1 style="font-size:26px">실력 확인</h1><div class="card"><p>대표 개념 <b>${n}개</b>를 골라 개념마다 2문제씩, 모두 <b>${n * 2}문제</b>를 풀어요.</p><ul><li>점수를 매기는 시험이 아니에요.</li><li>모르면 <b>"모르겠어요"</b>를 눌러도 돼요.</li><li>끝나면 어디서부터 시작하면 좋을지 알려줘요.</li></ul><p class="sub">틀린 문제는 오답 복습에 자동으로 들어가요.</p></div><button class="btn primary" data-act="diag-start">시작하기</button>`;
}

function viewDiagResult() {
  const p = st().placement;
  const t = (ids) => ids.map((id) => `<li>${esc(byId[id].title)}</li>`).join('');
  const start = p.startId ? byId[p.startId] : null;
  return `<div class="center" style="padding-top:20px"><div style="font-size:54px">🧭</div><h1 style="font-size:26px">진단 끝!</h1></div>${p.weak.length ? `<div class="card"><h3 style="margin-top:0">조금 더 다지면 좋은 개념</h3><ul>${t(p.weak)}</ul></div>` : ''}${p.passed.length ? `<div class="card"><h3 style="margin-top:0">이미 잘하는 개념 👏</h3><ul>${t(p.passed)}</ul></div>` : ''}<div class="card center"><div class="eyebrow">추천 시작 지점</div><h2>${start ? esc(unitOf(start)) : '처음부터'}</h2><p class="sub" style="margin:0">${start ? '여기서부터 차근차근 시작해요.' : '막힘이 없어요! 가장 앞 개념부터 빠르게 올라가요.'}</p></div><button class="btn primary" data-act="home">시작하기</button>`;
}

function viewReview() {
  const s = st(), due = E.dueCount();
  const items = s.review.slice().sort((a, b) => a.due - b.due).slice(0, 40);
  let h = `<div class="hd"><div><div class="hello">틀린 문제를 다시</div><h1>복습</h1></div></div>`;
  h += `<div class="card"><div class="row"><div><b>오늘 복습할 문제</b><div class="sub">틀린 문제는 1일 → 2일 → 4일 … 간격으로 다시 나와요</div></div><span class="chip ${due ? 'warn' : 'ok'}">${due}개</span></div><div style="margin-top:12px"><button class="btn primary" data-act="review-start" ${due ? '' : 'disabled'}>${due ? '복습 시작하기' : '오늘은 복습 끝!'}</button></div></div>`;
  h += `<div class="stats"><div class="stat"><b>${s.review.length}</b><span>오답노트</span></div><div class="stat"><b>${s.review.filter((r) => r.box >= 3).length}</b><span>거의 외움</span></div><div class="stat"><b>${s.review.filter((r) => r.due > S.dayNum()).length}</b><span>대기 중</span></div></div>`;
  h += `<h3>오답노트</h3>`;
  if (!items.length) h += `<p class="sub">아직 틀린 문제가 없어요. 문제를 풀다가 틀리면 여기에 모여요.</p>`;
  for (const it of items) {
    const p = it.snap;
    h += `<details class="card" style="padding:12px 14px"><summary style="cursor:pointer"><span class="chip gray">${esc(byId[it.cid] ? byId[it.cid].title : '')}</span> <span class="sub">${it.due <= S.dayNum() ? '오늘 복습' : `${it.due - S.dayNum()}일 뒤`}</span><div style="margin-top:6px">${rich(p.q)}</div>${p.fig || ''}</summary><div style="margin-top:8px"><b>정답:</b> ${rich(p.kind === 'mc' ? p.choices[p.ans] : p.shown)}<div class="why" style="margin-top:6px">${rich(p.why)}</div></div></details>`;
  }
  return h;
}

function viewMe() {
  const s = st();
  const done = CONCEPTS.filter((c) => available(c) && ['ok', 'master'].includes(E.status(cs(c.id)))).length;
  const mast = CONCEPTS.filter((c) => available(c) && E.status(cs(c.id)) === 'master').length;
  return `<div class="hd"><div><div class="hello">나의 기록</div><h1>기록 · 설정</h1></div></div>
  <div class="stats"><div class="stat"><b>${E.currentStreak()}일</b><span>연속 학습</span></div><div class="stat"><b>${done}</b><span>이해한 개념</span></div><div class="stat"><b>${mast}</b><span>마스터</span></div></div>
  <div class="card"><b>하루 목표 문제 수</b><div class="seg" style="margin-top:10px">${[5, 10, 20, 30].map((n) => `<button class="${(s.goal || 10) === n ? 'on' : ''}" data-act="goal" data-n="${n}">${n}</button>`).join('')}</div></div>
  <div class="card"><b>이름 (선택)</b><div style="margin-top:10px"><input class="txt" id="nm" value="${esc(s.name || '')}" placeholder="불러줄 이름" maxlength="12"></div><div style="margin-top:10px"><button class="btn sm" data-act="name">저장</button></div></div>
  <div class="card"><b>기록 백업</b><p class="sub">휴대폰을 바꾸거나 앱을 지웠다가 다시 설치할 때 쓰는 코드예요.</p><div class="btns"><button class="btn sm" data-act="export">코드 복사</button><button class="btn sm" data-act="import">코드 불러오기</button></div></div>
  <div class="card"><b>처음부터 다시</b><p class="sub">진행 기록을 모두 지워요.</p><button class="btn sm ghost" data-act="reset">기록 지우기</button></div>
  <p class="sub center">다시, 수학 · 개념 ${CONCEPTS.filter(available).length}개 · 전체 지도 ${CONCEPTS.length}개</p>`;
}

// ───────────── 그리기 ─────────────
function render(scrollTop) {
  const r = route.name;
  const session = ['practice', 'result', 'lesson', 'diag-intro'].includes(r);
  let h = '';
  try {
    if (r === 'home') h = viewHome();
    else if (r === 'map') h = viewMap();
    else if (r === 'concept') h = viewConcept();
    else if (r === 'lesson') h = viewLesson();
    else if (r === 'practice') h = SES ? (SES.finished ? viewResult() : viewQuestion()) : viewHome();
    else if (r === 'result') h = SES ? viewResult() : viewHome();
    else if (r === 'review') h = viewReview();
    else if (r === 'me') h = viewMe();
    else if (r === 'diag-intro') h = viewDiagIntro();
    else h = viewHome();
  } catch (e) {
    console.error(e);
    h = `<div class="card"><h2>앗, 화면을 그리다 문제가 생겼어요</h2><p class="sub">${esc(e.message)}</p><button class="btn" data-act="home">홈으로</button></div>`;
  }
  $app.innerHTML = h;
  $app.classList.toggle('nobar', session);
  $tabs.classList.toggle('hidden', session);
  const due = E.dueCount();
  const tab = (name, ic, t, extra = '') => `<button class="${(route.name === name || (name === 'map' && route.name === 'concept')) ? 'on' : ''}" data-act="tab" data-t="${name}"><span class="ic">${ic}</span>${t}${extra}</button>`;
  $tabs.innerHTML = tab('home', '🏠', '홈') + tab('map', '🗺️', '학습') + tab('review', '🔁', '복습', due ? `<span class="badge">${due}</span>` : '') + tab('me', '📊', '기록');
  if (scrollTop) window.scrollTo(0, 0);
}

// ───────────── 문제 풀이 흐름 ─────────────
function newSession(mode, extra = {}) {
  SES = { mode, n: 0, total: 8, correct: 0, results: [], q: null, finished: false, toast: '', ...extra };
}
function makeQ() {
  const ses = SES;
  if (ses.mode === 'practice') {
    const c = byId[ses.cid];
    const lv = S.conceptState(ses.cid).lv;
    ses.q = { p: E.makeProblem(c.impl, newSeed(), lv), input: '', done: false };
  } else if (ses.mode === 'diag') {
    const it = ses.queue[ses.n];
    ses.q = { p: E.makeProblem(byId[it.cid].impl, it.seed, it.lv), input: '', done: false };
  } else {
    const it = ses.queue[ses.n];
    let p = it.snap;
    const c = byId[it.cid];
    if (it.box >= 2 && c && c.impl && !it.retry) { try { p = E.makeProblem(c.impl, newSeed(), it.snap.lv || 2); } catch (e) { p = it.snap; } } else p = E.reshuffle(p, newSeed());
    ses.q = { p, input: '', done: false, item: it.retry ? null : it };
  }
}
function startPractice(cid) {
  const c = byId[cid];
  if (!available(c)) return;
  newSession('practice', { cid, total: 8, lvStart: S.conceptState(cid).lv });
  makeQ();
  go('practice');
}
function startReview() {
  const items = E.dueItems(10);
  if (!items.length) return;
  newSession('review', { queue: items.map((i) => ({ ...i })), total: items.length });
  makeQ();
  go('practice');
}
function startDiag() {
  if (!ANCHORS.length) { st().placement = { date: S.todayKey(), startId: null, weak: [], passed: [] }; S.save(); return go('home'); }
  const queue = E.buildDiag(ANCHORS);
  newSession('diag', { queue, total: queue.length });
  makeQ();
  go('practice');
}
function answer(input, skipped = false) {
  const ses = SES, q = ses.q;
  if (!q || q.done) return;
  const ok = !skipped && E.grade(q.p, input);
  q.done = true; q.ok = ok; q.chosen = input; q.skipped = skipped;
  const before = ses.mode === 'practice' ? S.conceptState(ses.cid).lv : 0;
  q.res = E.record(q.p, ok, ses.mode, q.item || null);
  ses.n++; if (ok) ses.correct++;
  ses.results.push({ cid: q.p.cid, ok, lv: q.p.lv });
  ses.toast = '';
  if (ses.mode === 'practice' && q.res.change) {
    const after = S.conceptState(ses.cid);
    if (q.res.change === 1) ses.toast = `레벨 업! Lv ${before} → Lv ${after.lv} 🎉`;
    else if (q.res.change === 2) ses.toast = '이 개념을 마스터했어요! ★';
    else if (q.res.change === -1) ses.toast = `조금 쉬운 단계로 내려갈게요 (Lv ${after.lv})`;
  }
  if (ses.mode === 'review' && !ok && q.item) { ses.queue.push({ ...q.item, retry: true }); ses.total = ses.queue.length; }
  render();
  if (ses.mode === 'diag') setTimeout(() => { if (SES === ses && ses.q === q) next(); }, 500);
}
function next() {
  const ses = SES;
  if (!ses || !ses.q || !ses.q.done) return;
  if (ses.n >= ses.total) return finish();
  makeQ();
  render(true);
}
function finish() {
  const ses = SES;
  ses.finished = true;
  if (ses.mode === 'diag') finishDiag();
  swap('result');
}
function finishDiag() {
  const by = {};
  SES.results.forEach((r) => { (by[r.cid] = by[r.cid] || []).push(r.ok); });
  const weak = [], passed = [];
  for (const c of ANCHORS) if (by[c.id]) (by[c.id].every(Boolean) ? passed : weak).push(c.id);
  let startId = null;
  if (weak.length) {
    const f = byId[weak[0]];
    const unit = GRADES.flatMap((g) => g.units).find((u) => u.id === f.unitId);
    startId = (unit.concepts.find(available) || f).id;
  }
  st().placement = { date: S.todayKey(), startId, weak, passed };
  passed.forEach((id) => { const x = S.conceptState(id); x.seen = true; x.lv = Math.max(x.lv, 3); });
  S.save();
}
function submitNum() {
  const q = SES.q;
  if (!q || q.done) return;
  if (!q.input) return;
  answer(q.input);
}

// ───────────── 이벤트 ─────────────
const ACT = {
  noop() { },
  tab(d) { stack0(); route = { name: d.t }; history.pushState({ route }, ''); render(true); },
  home() { SES = null; route = { name: 'home' }; history.pushState({ route }, ''); render(true); },
  back() { history.back(); },
  open(d) { go('concept', { id: d.id }); },
  concept(d) { if (d.leave) { SES = null; swap('concept', { id: d.id }); } else go('concept', { id: d.id }); },
  lesson(d) { if (d.leave) { SES = null; swap('lesson', { id: d.id, i: 0 }); } else go('lesson', { id: d.id, i: 0 }); },
  lprev() { route.i = Math.max(0, (route.i || 0) - 1); history.replaceState({ route }, ''); render(true); },
  lnext() { route.i = (route.i || 0) + 1; history.replaceState({ route }, ''); render(true); },
  lend(d) { S.conceptState(d.id).seen = true; S.save(); SES = null; startPracticeSwap(d.id); },
  practice(d) { if (d.leave) { SES = null; startPracticeSwap(d.id); } else startPractice(d.id); },
  pick(d) { answer(Number(d.i)); },
  key(d) {
    const q = SES && SES.q; if (!q || q.done) return;
    const k = d.k;
    if (k === 'del') q.input = q.input.slice(0, -1);
    else if (k === 'go') return submitNum();
    else {
      if (q.input.length >= 10) return;
      if (k === '-' && q.input.length) return;
      if (k === '/' && (!q.input || q.input === '-' || q.input.includes('/') || q.input.includes('.'))) return;
      if (k === '.' && (q.input.includes('.') || q.input.includes('/'))) return;
      q.input += k;
    }
    render();
  },
  skip() { answer(null, true); },
  next() { next(); },
  quit() { if (SES && SES.n > 0 && !confirm('그만할까요? 푼 문제는 저장돼요.')) return; SES = null; history.back(); },
  'review-start': startReview,
  'diag-intro'() { go('diag-intro'); },
  'diag-start': startDiag,
  'skip-diag'() { st().placement = { date: S.todayKey(), startId: null, weak: [], passed: [] }; S.save(); render(); },
  'hint-off'() { st().hintDismissed = true; S.save(); render(); },
  goal(d) { st().goal = Number(d.n); S.save(); render(); },
  name() { const v = document.getElementById('nm').value.trim(); st().name = v; S.save(); render(); },
  async export() {
    const code = S.exportCode();
    try { await navigator.clipboard.writeText(code); alert('백업 코드를 복사했어요. 메모 앱 같은 곳에 붙여 넣어 보관하세요.'); }
    catch (e) { prompt('아래 코드를 복사해 보관하세요.', code); }
  },
  import() {
    const code = prompt('백업 코드를 붙여 넣으세요.');
    if (!code) return;
    try { S.importCode(code); alert('불러왔어요!'); render(); } catch (e) { alert('코드가 올바르지 않아요.'); }
  },
  reset() { if (confirm('정말 모든 기록을 지울까요? 되돌릴 수 없어요.')) { S.reset(); route = { name: 'home' }; render(true); } },
};
function stack0() { /* 탭 이동은 기록을 쌓되 세션은 정리 */ SES = null; }
function startPracticeSwap(cid) {
  const c = byId[cid];
  newSession('practice', { cid, total: 8, lvStart: S.conceptState(cid).lv });
  makeQ();
  swap('practice');
}

document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-act]');
  if (!el || el.disabled) return;
  const fn = ACT[el.dataset.act];
  if (fn) fn(el.dataset, el, e);
});
document.addEventListener('keydown', (e) => {
  if (!SES || route.name !== 'practice' || SES.finished || !SES.q || e.metaKey || e.ctrlKey) return;
  const q = SES.q, p = q.p;
  if (q.done) { if (e.key === 'Enter' && SES.mode !== 'diag') next(); return; }
  if (p.kind === 'mc') { const n = Number(e.key); if (n >= 1 && n <= p.choices.length) answer(n - 1); return; }
  if (/^[0-9./-]$/.test(e.key)) ACT.key({ k: e.key });
  else if (e.key === 'Backspace') ACT.key({ k: 'del' });
  else if (e.key === 'Enter') submitNum();
});

// ───────────── 시작 ─────────────
history.replaceState({ route }, '');
render(true);
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => { });
}
window.__app = { S, E, go, get SES() { return SES; }, render };
