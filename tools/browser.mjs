// 헤드리스 크롬으로 앱을 실제로 열어 보는 도구 (개발용)
//   node tools/browser.mjs  → 시나리오는 tools/scenario.mjs 에서 export default async (b) => {...}
import { spawn } from 'node:child_process';
import fs from 'node:fs';

export async function launch({ width = 390, height = 844, port = 9333 } = {}) {
  const dir = fs.mkdtempSync('/tmp/chr-');
  const proc = spawn('/usr/bin/google-chrome', [
    '--headless=new', '--no-sandbox', '--disable-gpu', `--remote-debugging-port=${port}`, `--user-data-dir=${dir}`,
    `--window-size=${width},${height}`, '--hide-scrollbars', 'about:blank',
  ], { stdio: 'ignore' });
  let targets;
  for (let i = 0; i < 60; i++) {
    try { targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (targets.find((t) => t.type === 'page')) break; } catch (e) { /* 대기 */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => { ws.onopen = r; });
  let id = 0; const pending = new Map(); const logs = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); }
    else if (d.method === 'Runtime.exceptionThrown') logs.push('EXC: ' + (d.params.exceptionDetails.exception?.description || d.params.exceptionDetails.text));
    else if (d.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(d.params.type)) logs.push(d.params.type.toUpperCase() + ': ' + d.params.args.map((a) => a.value ?? a.description).join(' '));
    else if (d.method === 'Log.entryAdded' && d.params.entry.level === 'error') logs.push('LOG: ' + d.params.entry.text + ' ' + (d.params.entry.url || ''));
  };
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile: true });
  const b = {
    logs,
    async nav(url) { await send('Page.navigate', { url }); await new Promise((r) => setTimeout(r, 1200)); },
    async eval(expr) {
      const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
      if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'eval error');
      return r.result.result.value;
    },
    async click(sel) { const ok = await b.eval(`(()=>{const e=document.querySelector(${JSON.stringify(sel)});if(!e)return false;e.click();return true})()`); if (!ok) throw new Error('없음: ' + sel); await b.wait(150); },
    async clickText(txt) { const ok = await b.eval(`(()=>{const e=[...document.querySelectorAll('button')].find(x=>x.textContent.includes(${JSON.stringify(txt)}));if(!e)return false;e.click();return true})()`); if (!ok) throw new Error('버튼 없음: ' + txt); await b.wait(150); },
    async wait(ms) { await new Promise((r) => setTimeout(r, ms)); },
    async shot(path, full = false) {
      let clip;
      if (full) {
        const h = await b.eval('document.documentElement.scrollHeight');
        clip = { x: 0, y: 0, width: width, height: h, scale: 1 };
      }
      const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: full, ...(clip ? { clip } : {}) });
      fs.writeFileSync(path, Buffer.from(r.result.data, 'base64'));
    },
    async close() { try { ws.close(); } catch (e) { /* */ } proc.kill(); },
  };
  return b;
}
