// LaTeX 일부 문법 → MathML 변환기 (외부 라이브러리 없이 오프라인으로 동작)
// 지원: \frac \sqrt \overline \vec \text \binom ^ _ \sum \lim \int \begin{cases} 그리스 문자, 기호들

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;' };
export const esc = (s) => String(s).replace(/[&<>]/g, (c) => ESC[c]);

const GREEK = {
  pi: 'π', theta: 'θ', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', lambda: 'λ', mu: 'μ',
  sigma: 'σ', omega: 'ω', phi: 'φ', Delta: 'Δ', Sigma: 'Σ', Omega: 'Ω',
};
const OPS = {
  times: '×', div: '÷', cdot: '·', pm: '±', mp: '∓', le: '≤', leq: '≤', ge: '≥', geq: '≥',
  ne: '≠', neq: '≠', approx: '≈', equiv: '≡', cong: '≅', sim: '∽', to: '→', rightarrow: '→',
  Rightarrow: '⇒', Leftrightarrow: '⇔', in: '∈', notin: '∉', subset: '⊂', cup: '∪', cap: '∩',
  therefore: '∴', because: '∵', angle: '∠', triangle: '△', parallel: '∥', perp: '⊥', circ: '∘',
  ldots: '…', cdots: '⋯', dots: '…', backsim: '∽', square: '□', bullet: '•', degree: '°', mid: '∣', setminus: '∖',
};
const FUNCS = new Set(['sin', 'cos', 'tan', 'log', 'ln', 'max', 'min', 'exp']);
const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힣]/;

export const texErrors = [];

function conv(s) {
  let i = 0;
  const ws = () => { while (i < s.length && /\s/.test(s[i])) i++; };

  function seq(stop) {
    let out = '';
    while (i < s.length && s[i] !== stop) {
      ws();
      if (i >= s.length || s[i] === stop) break;
      out += scripted();
    }
    return out;
  }

  function group() {
    ws();
    if (s[i] === '{') { i++; const r = seq('}'); i++; return `<mrow>${r}</mrow>`; }
    return atom().ml;
  }

  function scriptArg() {
    ws();
    if (s[i] === '{') { i++; const r = seq('}'); i++; return `<mrow>${r}</mrow>`; }
    if (s[i] === '\\' || /[A-Za-z0-9]/.test(s[i] || '')) {
      // 숫자는 한 자리만(LaTeX와 동일), 문자도 한 글자
      if (/[0-9]/.test(s[i])) { const d = s[i++]; return `<mn>${d}</mn>`; }
      return atom().ml;
    }
    return atom().ml;
  }

  function scripted() {
    const b = atom();
    let sub = null, sup = null;
    for (;;) {
      ws();
      if (s[i] === '^') { i++; sup = scriptArg(); }
      else if (s[i] === '_') { i++; sub = scriptArg(); }
      else break;
    }
    if (sub === null && sup === null) return b.ml;
    if (b.limits) {
      if (sub !== null && sup !== null) return `<munderover>${b.ml}${sub}${sup}</munderover>`;
      if (sub !== null) return `<munder>${b.ml}${sub}</munder>`;
      return `<mover>${b.ml}${sup}</mover>`;
    }
    if (sub !== null && sup !== null) return `<msubsup>${b.ml}${sub}${sup}</msubsup>`;
    if (sub !== null) return `<msub>${b.ml}${sub}</msub>`;
    return `<msup>${b.ml}${sup}</msup>`;
  }

  function atom() {
    ws();
    const c = s[i];
    if (c === '{') { i++; const r = seq('}'); i++; return { ml: `<mrow>${r}</mrow>` }; }
    if (c === '\\') return command();
    if (/[0-9]/.test(c) || (c === '.' && /[0-9]/.test(s[i + 1] || ''))) {
      let j = i, dot = false;
      while (j < s.length && (/[0-9]/.test(s[j]) || (s[j] === '.' && !dot && /[0-9]/.test(s[j + 1] || '')))) {
        if (s[j] === '.') dot = true;
        j++;
      }
      const n = s.slice(i, j); i = j;
      return { ml: `<mn>${n}</mn>` };
    }
    if (/[A-Za-z]/.test(c)) { i++; return { ml: `<mi>${c}</mi>` }; }
    if (HANGUL.test(c)) {
      let j = i;
      while (j < s.length && HANGUL.test(s[j])) j++;
      const t = s.slice(i, j); i = j;
      return { ml: `<mtext>${esc(t)}</mtext>` };
    }
    i++;
    if (c === '-') return { ml: '<mo>−</mo>' };
    if (c === '*') return { ml: '<mo>×</mo>' };
    if (c === "'") return { ml: '<mo>′</mo>' };
    return { ml: `<mo>${esc(c)}</mo>` };
  }

  function command() {
    i++; // backslash
    const c0 = s[i];
    if (c0 === undefined) return { ml: '' };
    if (c0 === ',' || c0 === ';' || c0 === ':' || c0 === '!' || c0 === ' ') {
      i++;
      const w = { ',': '.17em', ';': '.28em', ':': '.22em', ' ': '.25em' }[c0];
      return { ml: c0 === '!' ? '' : `<mspace width="${w}"></mspace>` };
    }
    if (c0 === '{' || c0 === '}') { i++; return { ml: `<mo>${c0}</mo>` }; }
    if (c0 === '|') { i++; return { ml: '<mo>‖</mo>' }; }
    if (c0 === '%') { i++; return { ml: '<mo>%</mo>' }; }
    let j = i;
    while (j < s.length && /[A-Za-z]/.test(s[j])) j++;
    const name = s.slice(i, j);
    i = j;
    switch (name) {
      case 'frac': case 'dfrac': { const a = group(); const b = group(); return { ml: `<mfrac>${a}${b}</mfrac>` }; }
      case 'binom': { const a = group(); const b = group(); return { ml: `<mrow><mo>(</mo><mfrac linethickness="0">${a}${b}</mfrac><mo>)</mo></mrow>` }; }
      case 'sqrt': {
        ws();
        if (s[i] === '[') {
          i++; const k = seq(']'); i++;
          const x = group();
          return { ml: `<mroot>${x}<mrow>${k}</mrow></mroot>` };
        }
        return { ml: `<msqrt>${group()}</msqrt>` };
      }
      case 'overline': return { ml: `<mover accent="true">${group()}<mo>‾</mo></mover>` };
      case 'overrightarrow': return { ml: `<mover accent="true">${group()}<mo>→</mo></mover>` };
      case 'overleftrightarrow': return { ml: `<mover accent="true">${group()}<mo>↔</mo></mover>` };
      case 'vec': return { ml: `<mover accent="true">${group()}<mo>→</mo></mover>` };
      case 'hat': return { ml: `<mover accent="true">${group()}<mo>^</mo></mover>` };
      case 'text': case 'mathrm': {
        ws();
        if (s[i] !== '{') return { ml: '' };
        let depth = 1, k = i + 1;
        while (k < s.length && depth) { if (s[k] === '{') depth++; else if (s[k] === '}') depth--; k++; }
        const t = s.slice(i + 1, k - 1); i = k;
        return { ml: `<mtext>${esc(t)}</mtext>` };
      }
      case 'left': case 'right': { if (s[i] === '.') i++; return { ml: '' }; }
      case 'quad': return { ml: '<mspace width="1em"></mspace>' };
      case 'qquad': return { ml: '<mspace width="2em"></mspace>' };
      case 'sum': return { ml: '<mo>∑</mo>', limits: true };
      case 'lim': return { ml: '<mi mathvariant="normal">lim</mi>', limits: true };
      case 'int': return { ml: '<mo>∫</mo>' };
      case 'infty': return { ml: '<mn>∞</mn>' };
      case 'emptyset': return { ml: '<mi>∅</mi>' };
      case 'begin': {
        ws();
        let k = s.indexOf('}', i);
        const env = s.slice(i + 1, k);
        i = k + 1;
        const endTag = `\\end{${env}}`;
        const e = s.indexOf(endTag, i);
        const body = s.slice(i, e < 0 ? s.length : e);
        i = e < 0 ? s.length : e + endTag.length;
        const rows = body.split('\\\\').filter((r) => r.trim() !== '');
        const trs = rows.map((r) => `<mtr>${r.split('&').map((cell) => `<mtd><mrow>${conv(cell)}</mrow></mtd>`).join('')}</mtr>`).join('');
        if (env === 'cases') return { ml: `<mrow><mo>{</mo><mtable columnalign="left">${trs}</mtable></mrow>` };
        return { ml: `<mtable>${trs}</mtable>` };
      }
      default:
    }
    if (GREEK[name]) return { ml: `<mi>${GREEK[name]}</mi>` };
    if (OPS[name]) return { ml: `<mo>${OPS[name]}</mo>` };
    if (FUNCS.has(name)) return { ml: `<mi mathvariant="normal">${name}</mi>` };
    texErrors.push(name);
    return { ml: `<mtext>\\${esc(name)}</mtext>` };
  }

  return seq(undefined);
}

export function texToMathML(src, display = false) {
  return `<math display="${display ? 'block' : 'inline'}"><mrow>${conv(src)}</mrow></math>`;
}

// 본문 텍스트 안의 $...$ (인라인) / $$...$$ (블록) 수식과 **굵게**, ==강조==, 줄바꿈을 HTML로 바꾼다.
function textPart(t) {
  let h = esc(t);
  h = h.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  h = h.replace(/==(.+?)==/g, '<mark>$1</mark>');
  h = h.replace(/\n{2,}/g, '<div class="sp"></div>').replace(/\n/g, '<br>');
  return h;
}

// ── 한국어 조사 자동 선택: 수식 바로 뒤의 [을/를] [은/는] [이/가] [과/와] [으로/로] [이에요/예요] ──
function readingInfo(tex) {
  let s = tex.replace(/\s+$/, '');
  if (/\^\{[^{}]*\}$/.test(s) || /\^[0-9a-zA-Z]$/.test(s)) return { b: true, r: false }; // "…제곱"
  if (/(\^\\circ|\\circ|°)$/.test(s)) return { b: false, r: false };                      // "…도"
  let m = s.match(/\\frac\{([^{}]*)\}\{[^{}]*\}$/);
  if (m) return readingInfo(m[1]);
  m = s.match(/\\sqrt\{([^{}]*)\}$/);
  if (m) return readingInfo(m[1]);
  m = s.match(/\\text\{([^{}]*)\}$/);
  if (m) s = m[1];
  if (s.endsWith(')') && s.length > 1) return readingInfo(s.slice(0, -1));
  const ch = s.slice(-1);
  if (/[0-9]/.test(ch)) return { b: '013678'.includes(ch), r: '178'.includes(ch) };
  if (/[A-Za-z]/.test(ch)) return { b: 'lmnrLMNR'.includes(ch), r: 'lrLR'.includes(ch) };
  if (/[\uAC00-\uD7A3]/.test(ch)) { const t = (ch.charCodeAt(0) - 0xac00) % 28; return { b: t !== 0, r: t === 8 }; }
  return { b: false, r: false };
}
const JOSA = {
  '을/를': (i) => (i.b ? '을' : '를'), '은/는': (i) => (i.b ? '은' : '는'), '이/가': (i) => (i.b ? '이' : '가'),
  '과/와': (i) => (i.b ? '과' : '와'), '으로/로': (i) => (i.b && !i.r ? '으로' : '로'), '이에요/예요': (i) => (i.b ? '이에요' : '예요'), '이라서/라서': (i) => (i.b ? '이라서' : '라서'), '이므로/므로': (i) => (i.b ? '이므로' : '므로'),
};
export function josaFor(tex, pair) { const f = JOSA[pair]; return f ? f(readingInfo(tex)) : pair; }

export function rich(text) {
  const src = String(text ?? '');
  const re = /\$\$([\s\S]+?)\$\$|\$([^$]+?)\$/g;
  let out = '', last = 0, m;
  while ((m = re.exec(src))) {
    out += textPart(src.slice(last, m.index));
    const body = (m[1] !== undefined ? m[1] : m[2]).trim();
    out += texToMathML(body, m[1] !== undefined);
    last = m.index + m[0].length;
    const jm = src.slice(last).match(/^\[(을\/를|은\/는|이\/가|과\/와|으로\/로|이에요\/예요|이라서\/라서|이므로\/므로)\]/);
    if (jm) { out += esc(josaFor(body, jm[1])); last += jm[0].length; }
  }
  out += textPart(src.slice(last));
  return out;
}
