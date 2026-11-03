// AiMesh Diagnostic flow screens, in flow order.
// code: page number shown in the demo bar, <flow>_<seq> (e.g. 1_010).
//   1_xxx main flow · 2_xxx Testing History · 3_xxx Advanced Test
// description: plain-language line shown in the demo bar's page list.
// render(): the screen's HTML. Elements with data-go="<screen id>" navigate;
// screens not added yet show a toast. Layout is in pt on the 390 × 844 canvas.
(function () {
  const ICON = {
    back: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 4l-8 8 8 8"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5L5 19"/></svg>',
    closeCircle: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M8.5 8.5l7 7M15.5 8.5l-7 7"/></svg>',
    clear: '<svg viewBox="0 0 20 20" width="18" height="18"><circle cx="10" cy="10" r="8" fill="none" stroke="#666" stroke-width="1.6"/><path d="M7.2 7.2l5.6 5.6M12.8 7.2l-5.6 5.6" stroke="#666" stroke-width="1.6" stroke-linecap="round"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M12 10.5v6.5M10.2 17h3.6M10.4 10.5H12"/><circle cx="12" cy="7.3" r=".6" fill="currentColor"/></svg>',
    history: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8h5M2 13h6M2 19h18"/><circle cx="15.5" cy="8" r="6"/><path d="M15.5 5v3.2l2 1.4"/></svg>',
    chevron: '<svg class="chev" viewBox="0 0 24 24"><path d="m9 5 7 7-7 7"/></svg>',
    rowChevron: '<svg class="row-chev" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg>',
    more: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="10"/><circle cx="7.5" cy="12" r=".9" fill="currentColor"/><circle cx="12" cy="12" r=".9" fill="currentColor"/><circle cx="16.5" cy="12" r=".9" fill="currentColor"/></svg>',
    list: '<svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><circle cx="32" cy="32" r="30"/><path d="M26 23h20M26 32h20M26 41h20"/><circle cx="19" cy="23" r="1.6" fill="currentColor"/><circle cx="19" cy="32" r="1.6" fill="currentColor"/><circle cx="19" cy="41" r="1.6" fill="currentColor"/></svg>',
    down: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.6"/><path d="M10 5.5v9M6.3 10.8 10 14.5l3.7-3.7"/></svg>',
    up: '<svg viewBox="0 0 20 20"><circle cx="10" cy="10" r="8.6"/><path d="M10 14.5v-9M6.3 9.2 10 5.5l3.7 3.7"/></svg>',
    ok: '<svg class="st ok" viewBox="0 0 34 34"><circle cx="17" cy="17" r="15"/><path d="m10.5 17.5 4.5 4.5 8.5-9"/></svg>',
    warn: '<svg class="st warn" viewBox="0 0 34 34"><circle cx="17" cy="17" r="15"/><path d="M17 9.5v10"/><circle cx="17" cy="24.5" r=".8" fill="currentColor"/></svg>',
    floorplan: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3.5" y="4.5" width="17" height="15" rx="1"/><path d="M3.5 11h8V4.5M11.5 14.5v5M15 11h5.5"/></svg>',
    cart: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 4h2.6l2.3 10.5h10.3l2.1-7.5H6.2"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/><path d="M11 9.5h5M13.5 7v5"/></svg>',
    place: '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M12 3 2.5 11h2.7v9.5h13.6V11h2.7L12 3Zm-2.5 10h5v7.5h-5V13Z"/></svg>',
    // Node icons
    home: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2.5 11h2.7v9.5h13.6V11h2.7L12 3Zm0 7.2c1.6 0 3 .6 4.1 1.6l-1 1a4.4 4.4 0 0 0-6.2 0l-1-1c1.1-1 2.5-1.6 4.1-1.6Zm0 2.8c.8 0 1.5.3 2 .8l-2 2-2-2c.5-.5 1.2-.8 2-.8Z"/></svg>',
    kitchen: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 2h1.3v6H7.6V2h1.3v6h1.3V2h1.3v6.6a3 3 0 0 1-2.6 3V22H7v-10.4a3 3 0 0 1-2.6-3V2H5Zm12.5 0C19.4 2 21 4.6 21 8.3c0 2.6-1 4-2.4 4.4V22h-2.2V2h1.1Z"/></svg>',
    bedroom: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5h16a1 1 0 0 1 1 1v5.2a2 2 0 0 1 1 1.8V19h-2v-2H4v2H2v-6a2 2 0 0 1 1-1.8V6a1 1 0 0 1 1-1Zm2 3v3h5V9a1 1 0 0 0-1-1H6Zm8 0a1 1 0 0 0-1 1v2h5V8h-4ZM4 13v2h16v-2H4Z"/></svg>',
    phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10.5 18.5h3" stroke-linecap="round"/></svg>',
  };

  // Mock topology: ZenWiFi BT8 (router) → BT10 → B10 → Phone
  const NODES = [
    { name: 'ZenWiFi BT8', place: 'Home', icon: 'home' },
    { name: 'ZenWiFi BT10', place: 'Kitchen', icon: 'kitchen' },
    { name: 'ZenWiFi B10', place: 'Bedroom', icon: 'bedroom' },
    { name: 'Phone', place: 'Phone', icon: 'phone', end: true },
  ];
  const HOPS = [
    { down: 143.2, up: 82.1, udp: { retrans: '0.12%', loss: '0%', jitter: '0.1ms' }, tcp: { deviation: '1 ms', latency: '4 ms', retrans: '0.12%' } },
    { down: 32, up: 18, udp: { retrans: '0.45%', loss: '0%', jitter: '0.2ms' }, tcp: { deviation: '2 ms', latency: '12 ms', retrans: '0.45%' } },
    { down: 24, up: 16, udp: { retrans: '0.82%', loss: '0.1%', jitter: '0.5ms' }, tcp: { deviation: '4 ms', latency: '18 ms', retrans: '0.82%' } },
  ];
  // 1_031: B10 (Bedroom) can't be tested, so BT10 → Phone is measured directly (not via B10)
  const SKIPPED = NODES[2];
  // Two untestable nodes (BT10 and B10): only BT8 → Phone is measured
  const SKIPPED_2 = [NODES[1], NODES[2]];
  const SKIP2_PATH = { nodes: [NODES[0], NODES[3]], hops: [{ down: 62.5, up: 30.4, udp: { retrans: '0.61%', loss: '0%', jitter: '0.3ms' }, tcp: { deviation: '3 ms', latency: '14 ms', retrans: '0.61%' } }] };
  const SKIP_PATH = { nodes: [NODES[0], NODES[1], NODES[3]], hops: [HOPS[0], { down: 86.4, up: 41.2, udp: { retrans: '0.38%', loss: '0%', jitter: '0.2ms' }, tcp: { deviation: '2 ms', latency: '9 ms', retrans: '0.38%' } }] };
  const FULL_PATH = { nodes: NODES, hops: HOPS };
  // 1_035: BT10 (Kitchen) only supports router ↔ router (case B), so the whole quick test runs TCP only
  const TCP_ONLY = NODES[1];
  const TCP_PATH = { ...FULL_PATH, tcpOnly: TCP_ONLY }; // single-hop pages read tcpOnly to explain
  // 1_036: the CAP is case B (TCP only, can't test with a phone) and the phone is connected to the CAP:
  // the REs are tested in order (TCP), and the phone folds off the line when reached
  const CAP_PHONE = { name: 'Phone', place: `連在 ${NODES[0].name}`, icon: 'phone' };
  const CAPB_PATH = { nodes: NODES.slice(0, 3), hops: HOPS.slice(0, 2), tcpOnly: NODES[0] };
  const WEAK_BELOW = 50; // Mbps download; below this a link is drawn orange
  const HOP_MS = 6000;   // how long each hop's test runs (shortened for demos; pause / next skip ahead)

  // Devices for Advanced Test (Select Server / Select Client)
  // fw: false = firmware doesn't support the test (case A)
  // noPhone = case B: router ↔ router only, TCP only, can't be tested against a phone, no custom options
  // phone = the phone
  const SERVERS = [
    { name: 'ZenWiFi BT8(Home)', ip: '192.168.52.4' },
    { name: 'ZenWiFi BT10(Kitchen)', ip: '192.168.52.12' },
    { name: 'ZenWiFi B10(Bedroom)', ip: '192.168.34.16', fw: false },
    { name: 'ZenWiFi BT10(Office)', ip: '192.168.11.45' },
    { name: 'ZenWiFi BT10(Garage)', ip: '192.168.36.1', noPhone: true },
    { name: 'RT-AX3000', ip: '192.168.22.26', noPhone: true },
  ];
  const CLIENTS = [
    { name: 'ZenWiFi BT10(Kitchen)', ip: '192.168.52.12' },
    { name: 'ZenWiFi B10(Bedroom)', ip: '192.168.34.16', fw: false },
    { name: 'GT-AX11000(2F)', ip: '192.168.34.20' },
    { name: 'ZenWiFi BT10(Office)', ip: '192.168.11.45' },
    { name: 'iPhone 16', ip: '192.168.36.1', phone: true },
    { name: 'ZenWiFi BT10(Garage)', ip: '192.168.36.1', noPhone: true }, // case B on the Client side too, for a one-step demo
  ];
  const LOCATIONS = ['Home', 'Living Room', 'Bedroom', 'Kitchen', 'Study', 'Third Floor', 'Attic', 'Balcony', 'Yard', 'Garage', 'Office'];

  const pad = n => String(n).padStart(2, '0');
  const stamp = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} .  ${pad(d.getHours())}:${pad(d.getMinutes())}`;

  // Testing History records (newest first); a finished test adds one on top
  const HISTORY = [
    { id: 3, at: '2025-12-15 .  14:32', note: 'Home', router: 'ZenWiFi BT8', down: 143.2, up: 82.1, grade: 'Good', weak: true },
    { id: 2, at: '2025-12-15 .  14:12', note: 'Home', router: 'ZenWiFi BD5', down: 98.3, up: 65.7, grade: 'Notice', weak: true },
    { id: 1, at: '2025-12-15 .  14:32', note: 'Home', router: 'ZenWiFi BT8', down: 108.9, up: 52.3, grade: 'Good', weak: false },
  ];

  const STATE = {
    hop: 0,
    path: FULL_PATH,    // nodes/hops the single-hop pages read from
    view: HISTORY[0],   // record shown on the result page
    fromHistory: false, // result page opened from a Testing History card: a past record, no Test Again
    picked: null,       // record the ••• menu was opened on
    server: 0,
    client: 4,
    duration: '30s',
    protocol: 'UDP',
  };

  const fmt = v => (v >= 100 || v % 1 ? v.toFixed(1) : String(v));
  const isWeak = h => h.down < WEAK_BELOW;
  // Test clock that can be paused (1_030 demo pause): time stops while paused
  const CLOCK = { pausedAt: null, pausedTotal: 0 };
  const clock = () => (CLOCK.pausedAt ?? performance.now()) - CLOCK.pausedTotal;
  const setPaused = on => {
    if (on && CLOCK.pausedAt === null) CLOCK.pausedAt = performance.now();
    if (!on && CLOCK.pausedAt !== null) { CLOCK.pausedTotal += performance.now() - CLOCK.pausedAt; CLOCK.pausedAt = null; }
  };
  const resetClock = () => { CLOCK.pausedAt = null; CLOCK.pausedTotal = 0; };
  // Demo-only controls on every testing page: pause / resume to stop on any hop for discussion,
  // and next to skip the rest of the test and jump to the page it would go to (skip(): save + go).
  // Returns { done: hide the controls once the test ends, cleanup: run on leaving the page }.
  const PAUSE_BTN = '<span class="demo-ctrl"><button data-pause>pause</button><button data-skip>next</button></span>';
  function mountPause(el, skip) {
    resetClock();
    const btn = el.querySelector('[data-pause]');
    onTap(el, '[data-pause]', () => {
      const on = CLOCK.pausedAt === null;
      setPaused(on);
      el.classList.toggle('paused', on);
      btn.textContent = on ? 'resume' : 'pause';
    });
    onTap(el, '[data-skip]', skip);
    return { done: () => el.querySelector('.demo-ctrl')?.remove(), cleanup: () => { resetClock(); el.classList.remove('paused'); } };
  }
  const wait = ms => new Promise(r => {
    const end = clock() + ms;
    (function check() { if (clock() >= end) r(); else setTimeout(check, 30); })();
  });
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const toast = msg => window.AIMESH_toast(msg);

  function navbar(title, left, right) {
    return `
      <header class="navbar">
        <span class="navbar-side">${left || ''}</span>
        <h1 class="navbar-title">${title}</h1>
        <span class="navbar-side navbar-right">${right || ''}</span>
      </header>`;
  }
  const backBtn = '<button class="navbar-btn" data-go="back" aria-label="返回">' + ICON.back + '</button>';
  const historyBtn = '<button class="navbar-btn navbar-btn-sub" data-decide="history" aria-label="Testing History">' + ICON.history + '</button>';

  // Run a handler before the shared click handler (which navigates / opens decisions)
  // (listeners on the elements themselves fire before the one on the screen container)
  function onTap(el, selector, fn) {
    el.querySelectorAll(selector).forEach(n => n.addEventListener('click', () => fn(n)));
  }

  function nodeEl(n) {
    return `<div class="node" data-node><span class="ring"></span><span class="face">${ICON[n.icon]}</span></div>`;
  }

  // Vertical topology: node, then for each hop a link, a speed card and the next node.
  // done: finished results (cards tappable); tapTo: where a card goes (decision or page)
  // path: nodes/hops to draw; beside: { hop index: html shown next to that hop's link }
  function topology(done, tapTo, path = FULL_PATH, beside = {}) {
    const { nodes, hops } = path;
    let html = `${nodeEl(nodes[0])}<div class="node-label">${nodes[0].name}</div>`;
    hops.forEach((h, i) => {
      const n = nodes[i + 1];
      const linkCls = (done ? (isWeak(h) ? ' weak' : ' good') : '') + (beside[i] ? ' has-branch' : '') + (path.long ? ' long' : '');
      html += `
        <div class="link-seg${linkCls}" data-link><span class="dots">${'<i></i>'.repeat(20)}</span>${beside[i] || ''}</div>
        <div class="card${done ? ' clickable done' : ''}" data-card data-hop="${i}"${done ? ` ${tapTo}` : ''}>
          <div class="col down"><div class="lbl">Download</div><div class="val">${done ? fmt(h.down) : '---'}</div><div class="unit">Mbps</div></div>
          <div class="divider"></div>
          <div class="col up"><div class="lbl">Upload</div><div class="val">${done ? fmt(h.up) : '---'}</div><div class="unit">Mbps</div></div>
          ${done ? ICON.chevron : ''}
          ${nodeEl(n)}
        </div>
        <div class="node-label${n.end ? ' end' : ''}">${n.name}</div>`;
    });
    return `<div class="topology">${html}</div>`;
  }
  // Gray dashed node off the main line: its firmware/model can't be tested, so it's not on the measured path
  // explain: the whole branch is a button that opens the not-tested sheet; its badge turns into a blue "i 不支援" button.
  // The badge says 不支援 (the reason), not 未測試, which reads like "not tested yet" while testing.
  const skippedBranch = (n, explain) => {
    const tag = explain ? 'button' : 'div';
    return `
    <${tag} class="skip-branch"${explain ? ` data-explain aria-label="${n.name} 不支援，查看說明"` : ''}>
      <span class="skip-line"></span>
      <div class="node skipped"><span class="face">${ICON[n.icon]}</span></div>
      <div class="skip-text"><b>${n.name}</b><small>${n.place}</small>${explain
        ? '<span class="skip-badge skip-badge-btn"><span class="skip-i">i</span>不支援</span>'
        : '<span class="skip-badge">不支援</span>'}</div>
    </${tag}>`;
  };
  // Several skipped nodes beside the same link: stacked
  const skippedGroup = (list, explain) => list.length === 1 ? skippedBranch(list[0], explain)
    : `<div class="skip-group">${list.map(n => skippedBranch(n, explain)).join('')}</div>`;

  const andList = a => a.length < 2 ? a.join('') : `${a.slice(0, -1).join('、')} 和 ${a[a.length - 1]}`;
  // Result page row (framed, first in the list) for the skipped node(s)
  const skippedItem = (list, to) => `<button class="item item-tap item-skip" data-go="${to}"><span class="skip-i">i</span><div><h3>${list.length} 台節點不支援此測試</h3><p>${andList(list.map(n => `${n.name}（${n.place}）`))} 的韌體不支援，已改由最近一台支援的節點量測。</p><span class="item-more">查看詳情</span></div>${ICON.rowChevron}</button>`;
  // 1_023 / 1_024: CAP is case A, so the test can't start. Advanced Test is suggested only when at least two REs support it
  const capBlockSheet = withAdv => `
        ${homeContent()}
        <div class="overlay" data-go="back"></div>
        <div class="sheet skip-sheet block-sheet">
          <button class="sheet-close" data-go="back" aria-label="關閉">${ICON.closeCircle}</button>
          <div class="block-hero"><span class="face">${ICON[NODES[0].icon]}</span><span class="skip-i">i</span></div>
          <h2>無法開始測試</h2>
          <p class="block-msg">測試會從主路由器開始，一路測到手機。主路由器 <b>${NODES[0].name}</b> 目前的韌體版本不支援此測試，所以${withAdv ? '即使其他節點支援，' : ''}整條連線都無法測試。</p>
          ${skippedRows([{ ...NODES[0], place: `主路由器 · ${NODES[0].place}` }], '不支援')}
          ${withAdv ? `<div class="hop-skip sheet-callout"><span class="skip-i">i</span><span>想測試節點之間的連線，可以改用 <b>Advanced Test</b>，自行選擇兩台支援的節點對測。</span></div>
          <button class="btn-primary skip-sheet-btn" data-go="advanced" data-label="改用 Advanced Test">改用 Advanced Test</button>
          <button class="text-link skip-sheet-link" data-go="back">確定</button>` : `<button class="btn-primary skip-sheet-btn" data-go="back" data-label="確定">確定</button>`}
        </div>`;

  // 1_043: a case-B node in the topology → the whole quick test ran TCP only; suggest a firmware update (FAQ)
  const tcpOnlyItem = n => `<button class="item item-tap item-skip" data-toast="FAQ – 尚未加入"><span class="skip-i">i</span><div><h3>本次僅以 TCP 測試</h3><p>${n.name}（${n.place}）的韌體版本僅支援 TCP，因此本次全部以 TCP 測試。</p><span class="item-more">查看 FAQ</span></div>${ICON.rowChevron}</button>`;
  // Gray node rows, for listing several untestable nodes in a sheet
  const skippedRows = (list, badge) => `<ul class="skip-list">${list.map(n => `
    <li><div class="node skipped"><span class="face">${ICON[n.icon]}</span></div><span><b>${n.name}</b><small>${n.place}</small></span>${badge ? `<span class="skip-badge">${badge}</span>` : ''}</li>`).join('')}</ul>`;

  // Test one hop: from/to nodes spin, the link drips, the card counts up. live() false stops it.
  async function testHop({ from, to, link, card, h, last }, live, ms = HOP_MS) {
    const dv = card.querySelector('.down .val'), uv = card.querySelector('.up .val');
    from.classList.add('pulse'); to.classList.add('pulse');
    link.classList.add('active');
    card.classList.add('running');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Count up with a little jitter, like a live throughput reading
    const t0 = clock();
    await new Promise(done => {
      (function step() {
        if (!live()) return done();
        if (CLOCK.pausedAt !== null) return requestAnimationFrame(step); // frozen while paused
        const p = Math.min(1, (clock() - t0) / ms);
        const ease = 1 - Math.pow(1 - p, 3);
        const noise = p < 1 ? (Math.random() - .5) * 0.12 * (1 - p) : 0;
        dv.textContent = fmt(+(h.down * (ease + noise)).toFixed(h.down % 1 ? 1 : 0));
        uv.textContent = fmt(+(h.up * Math.max(0, ease - .08 + noise)).toFixed(h.up % 1 ? 1 : 0));
        if (p < 1) requestAnimationFrame(step);
        else { dv.textContent = fmt(h.down); uv.textContent = fmt(h.up); done(); }
      })();
    });
    if (!live()) return;

    from.classList.remove('pulse');
    if (last) to.classList.remove('pulse');
    link.classList.remove('active');
    link.classList.add(isWeak(h) ? 'weak' : 'good');
    card.classList.remove('running'); card.classList.add('done');
    await wait(100);
  }

  // Auto-advance in place: back from the next page skips the finished test.
  // stack: keep the test in history instead, so back from the next page returns to it
  const advance = (from, id, stack) => setTimeout(() => {
    if (location.hash !== `#${from}`) return;
    const st = history.state;
    if (stack) {
      location.hash = id;
      history.replaceState({ aimesh: (st?.aimesh || 0) + 1 }, '');
      return;
    }
    location.replace(`#${id}`);
    history.replaceState(st, '');
  }, 300);

  // Run the test hop by hop on a rendered topology; returns a cleanup that stops it
  // ms: how long each hop runs
  function runTest(el, hops, onDone, ms) {
    let alive = true;
    const live = () => alive;
    const nodes = el.querySelectorAll('[data-node]');
    const links = el.querySelectorAll('[data-link]');
    const cards = el.querySelectorAll('[data-card]');
    (async () => {
      await wait(100);
      for (let i = 0; i < hops.length && alive; i++) {
        await testHop({ from: nodes[i], to: nodes[i + 1], link: links[i], card: cards[i], h: hops[i], last: i === hops.length - 1 }, live, ms);
      }
      await wait(100);
      if (alive) onDone();
    })();
    return () => { alive = false; };
  }


  // Shrink an element away (height, margins, border, opacity), for the node that drops out of the line
  function collapse(n, ms) {
    n.style.height = `${n.offsetHeight}px`;
    n.style.overflow = 'hidden';
    void n.offsetHeight;
    n.style.transition = `height ${ms}ms, margin ${ms}ms, border-width ${ms}ms, opacity ${ms * .6}ms`;
    Object.assign(n.style, { height: '0px', marginTop: '0px', marginBottom: '0px', borderWidth: '0px', opacity: '0' });
  }

  // 1_034: the same unsupported nodes, drawn another way — start with every node in line (what the user
  // knows of their mesh); each unsupported node grays out when reached, leaves the line and fades in as a
  // gray branch beside the link it's skipped over; the remaining hops are tested as usual.
  // skips: indexes into NODES that can't be tested; hops: the hops actually measured; ms: per hop
  function runInLine(el, skips, hops, onDone, ms) {
    let alive = true;
    const live = () => alive;
    const nodes = el.querySelectorAll('[data-node]');
    const links = el.querySelectorAll('[data-link]');
    const cards = el.querySelectorAll('[data-card]');
    const branches = el.querySelectorAll('.skip-branch');
    links.forEach(l => l.classList.remove('has-branch')); // normal height until a node drops out
    (async () => {
      await wait(100);
      let from = 0, link = links[0], shown = 0, measured = 0;
      for (let j = 1; j < nodes.length && alive; j++) {
        const card = cards[j - 1];
        if (!skips.includes(j)) {
          await testHop({ from: nodes[from], to: nodes[j], link, card, h: hops[measured++], last: j === nodes.length - 1 }, live, ms);
          from = j; link = links[j];
          continue;
        }
        // Reach the node: it can't be tested, so it grays out
        nodes[from].classList.add('pulse'); nodes[j].classList.add('pulse');
        link.classList.add('active');
        card.classList.add('running');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await wait(700);
        if (!alive) return;
        nodes[from].classList.remove('pulse'); nodes[j].classList.remove('pulse');
        link.classList.remove('active');
        card.classList.remove('running'); card.classList.add('unsupported');
        await wait(450);
        if (!alive) return;

        // It leaves the line; its branch fades in beside the link that now skips over it
        [card, card.nextElementSibling, links[j]].forEach(n => collapse(n, 450));
        branches[shown++].classList.add('shown');
        link.classList.add('has-branch');
        if (shown > 1) link.classList.add('has-two');
        await wait(550);
      }
      await wait(100);
      if (alive) onDone();
    })();
    return () => { alive = false; };
  }

  // 1_036: test the router hops as usual, then the phone (last) can't be tested with the CAP: it grays out,
  // its card folds away and it fades in as a gray branch off B10 (the last link becomes a dashed stub)
  function runCapB(el, onDone) {
    let alive = true;
    const live = () => alive;
    const nodes = el.querySelectorAll('[data-node]');
    const links = el.querySelectorAll('[data-link]');
    const cards = el.querySelectorAll('[data-card]');
    const last = links.length - 1;
    links[last].classList.remove('has-branch');
    (async () => {
      await wait(100);
      for (let i = 0; i < last && alive; i++) {
        await testHop({ from: nodes[i], to: nodes[i + 1], link: links[i], card: cards[i], h: HOPS[i], last: i === last - 1 }, live);
      }
      if (!alive) return;
      nodes[last].classList.add('pulse'); nodes[last + 1].classList.add('pulse');
      links[last].classList.add('active'); cards[last].classList.add('running');
      cards[last].scrollIntoView({ behavior: 'smooth', block: 'center' });
      await wait(700);
      if (!alive) return;
      nodes[last].classList.remove('pulse'); nodes[last + 1].classList.remove('pulse');
      links[last].classList.remove('active');
      cards[last].classList.remove('running'); cards[last].classList.add('unsupported');
      await wait(450);
      if (!alive) return;
      [cards[last], cards[last].nextElementSibling].forEach(n => collapse(n, 450));
      links[last].classList.add('stub', 'has-branch');
      el.querySelector('.skip-branch').classList.add('shown');
      await wait(650);
      if (alive) onDone();
    })();
    return () => { alive = false; };
  }
  // The phone's sheet: the reason is the CAP, not the phone
  const capPhoneSheet = () => `
    <div class="overlay" data-sheet hidden></div>
    <div class="sheet skip-sheet" data-sheet hidden>
      <button class="sheet-close" data-close-sheet aria-label="關閉">${ICON.closeCircle}</button>
      <h2>手機無法加入此測試</h2>
      <p>路由器 ${NODES[0].name}（${NODES[0].place}）目前的韌體版本不支援與手機進行測試，因此本次只測試路由器之間的連線（TCP）。</p>
    </div>`;
  // Detail Result: the measured router hops, plus the phone as a gray branch on a dashed stub after the last RE
  const capBTopology = () => topology(true, 'data-go="hop-tcp"', CAPB_PATH)
    .replace(/<\/div>$/, `<div class="link-seg stub has-branch">${skippedBranch(CAP_PHONE, true)}</div></div>`);

  // Demo-only dots under the testing page: switch scenario in place (replace, so Back isn't stacked)
  // Each group: [screen id, label]
  // Problem-scenario result pages (1_041–1_043) are hidden for now: those tests go straight to Detail Result
  const RESULT_IDS = [['result', '全部支援']];
  const scenarioDots = (group, current) => group.length < 2 ? '' : `
    <div class="demo-dots">${group.map(([id, label]) =>
      `<button class="${id === current ? 'on' : ''}" data-scenario="${id}" title="${label}" aria-label="${label}"></button>`).join('')}</div>`;
  const mountDots = el => onTap(el, '[data-scenario]', b => location.replace(`#${b.dataset.scenario}`));

  // No 檢查韌體更新 button: a newer firmware may not exist for these models
  const skipSheet = list => `
    <div class="overlay" data-sheet hidden></div>
    <div class="sheet skip-sheet" data-sheet hidden>
      <button class="sheet-close" data-close-sheet aria-label="關閉">${ICON.closeCircle}</button>
      ${list.length === 1 ? `
      <h2>${list[0].name}（${list[0].place}）不支援此測試</h2>
      <p>這台節點的韌體不支援這項測試，已改由最近一台支援的節點量測。</p>` : `
      <h2>${list.length} 台節點不支援此測試</h2>
      ${skippedRows(list)}
      <p>這些節點的韌體不支援這項測試，已改由最近一台支援的節點量測。</p>`}
    </div>`;
  // onClose: called after the sheet is closed. Returns whether the sheet is open now.
  function mountSheet(el, onClose) {
    const show = on => el.querySelectorAll('[data-sheet]').forEach(n => { n.hidden = !on; });
    onTap(el, '[data-explain]', () => show(true));
    onTap(el, '[data-close-sheet], .overlay[data-sheet]', () => { show(false); if (onClose) onClose(); });
    const sheet = el.querySelector('[data-sheet]');
    return () => !!sheet && !sheet.hidden;
  }

  // Save a finished run to Testing History; the result page shows it
  function saveRun(hops) {
    const rec = { id: Date.now(), at: stamp(new Date()), note: 'Home', router: NODES[0].name, down: hops[0].down, up: hops[0].up, grade: 'Good', weak: hops.some(isWeak) };
    HISTORY.unshift(rec);
    STATE.view = rec;
    STATE.fromHistory = false;
  }

  // Remember which hop (and on which path) was tapped, for the single-hop pages
  const rememberHop = path => el => onTap(el, '[data-card]', c => { STATE.hop = +c.dataset.hop; STATE.path = path; });

  function speeds(r) {
    const v = x => `<b>${fmt(x)}</b>`;
    return `
      <div class="speeds">
        <span class="sp down">${ICON.down}${v(r.down)}<small>Mbps</small></span>
        <span class="sp up">${ICON.up}${v(r.up)}<small>Mbps</small></span>
      </div>`;
  }

  // Node Status + (when weak) the Wi-Fi tip, which opens Suggestions
  function resultItems(r, extra = '') {
    return `
      <div class="items">
        ${extra}
        <div class="item"><div><h3>Node Status</h3><p>All nodes are online and stable with no detected drops.</p></div>${ICON.ok}</div>
        ${r.weak ? `<button class="item item-tap" data-go="suggestions" style="animation-delay:.12s"><div><h3>Wifi signal weak</h3><p>Your phone is connected to a farther node.<br>Consider moving closer for optimal speed.</p></div>${ICON.warn}</button>` : ''}
      </div>`;
  }

  // Detail rows per protocol, as in the UDP / TCP frames
  function hopRows(proto) {
    const h = STATE.path.hops[STATE.hop];
    const rows = [['Download Speed', `${Math.round(h.down)} Mbps`], ['Upload Speed', `${Math.round(h.up)} Mbps`], ['Protocol', proto]];
    if (proto === 'UDP') rows.push(['Retransmission', h.udp.retrans], ['Pack Lost', h.udp.loss], ['Jitter', h.udp.jitter]);
    else rows.push(['Deviation', h.tcp.deviation], ['Latency', h.tcp.latency], ['Retransmission', h.tcp.retrans]);
    return `<ul class="kv">${rows.map(([k, v]) => `<li>${k}<b>${v}</b></li>`).join('')}</ul>`;
  }

  function hopScreen(proto) {
    return () => {
      const a = STATE.path.nodes[STATE.hop], b = STATE.path.nodes[STATE.hop + 1];
      // Nodes this hop goes past (unsupported): the test paired a with b instead. Shown only on such hops.
      const passed = NODES.includes(a) && NODES.includes(b) ? NODES.slice(NODES.indexOf(a) + 1, NODES.indexOf(b)) : [];
      return `
        ${navbar('Detail Result', backBtn, `<button class="navbar-btn navbar-btn-blue" data-toast="Info – 尚未加入" aria-label="說明">${ICON.info}</button>`)}
        <div class="body">
          <div class="hop-head">
            <div class="hop-end"><div class="big-node">${ICON[a.icon]}</div>${a.place}</div>
            <div class="hop-line ${isWeak(STATE.path.hops[STATE.hop]) ? 'weak' : 'good'}"></div>
            <div class="hop-end"><div class="big-node">${ICON[b.icon]}</div>${b.place}</div>
          </div>
          ${passed.length ? `<p class="hop-skip"><span class="skip-i">i</span><span>${passed.map(n => n.name).join('、')} 的韌體不支援，已自動改由再上一層的 ${a.name}（${a.place}）與 ${b.name} 對測。</span></p>` : ''}
          ${STATE.path.tcpOnly ? `<div class="hop-skip"><span class="skip-i">i</span><span><b>本次僅以 TCP 測試</b><br>${STATE.path.tcpOnly.name}（${STATE.path.tcpOnly.place}）的韌體版本僅支援 TCP，因此本次全部以 TCP 測試。<br><button class="inline-link" data-toast="FAQ – 尚未加入">查看 FAQ</button></span></div>` : ''}
          ${hopRows(proto)}
          <p class="note">*Note:<br>Results show Mesh connectivity, not actual internet speed. Performance is subject to hardware, distance, and environmental interference.</p>
        </div>
        <div class="actions">
          <button class="btn-primary" data-go="feedback">Report Issue</button>
        </div>`;
    };
  }

  // 1_031 / 1_033: unsupported nodes are known before the test, so they're drawn off the line from the start.
  // The gray branches can be tapped mid-test to open the not-tested sheet (no bar: the branches already do it).
  // When done it goes on to the result page like 1_030, but waits while the sheet is open, until it's closed.
  const skipTesting = (id, path, beside, list) => `
    ${navbar('AiMesh Diagnostic', backBtn, '<button class="navbar-text" data-go="home" data-label="Cancel">Cancel</button>')}
    <div class="body">${topology(false, '', path, beside)}</div>
    ${PAUSE_BTN}
    ${skipSheet(list)}`;
  // run(el, onDone): runs the test (default: hop by hop along path)
  const mountSkipTesting = (id, path, next, run = (el, done) => runTest(el, path.hops, done)) => el => {
    let finished = false;
    mountDots(el);
    const pause = mountPause(el, () => { saveRun(path.hops); advance(id, next, true); });
    const sheetOpen = mountSheet(el, () => { if (finished) advance(id, next, true); });
    const stop = run(el, () => {
      pause.done();
      saveRun(path.hops);
      finished = true;
      if (!sheetOpen()) advance(id, next, true);
    });
    return () => { stop(); pause.cleanup(); };
  };

  // Result page, shared by 1_040 and 1_041 (a node not tested)
  function resultPage({ id, again, detail, extra = '' }) {
    const r = STATE.view;
    return `
      ${navbar('AiMesh Diagnostic', backBtn, historyBtn)}
      <div class="body">
        <div class="summary">
          <div class="grade ${r.grade === 'Good' ? '' : 'notice'}">${r.grade}</div>
          <div class="grade-desc">Your network is healthy and performing well.</div>
          <div class="pair">${r.router} <span class="arrows">↔</span> Phone</div>
          ${speeds(r)}
          <div class="stamp">${r.at}</div>
        </div>
        ${resultItems(r, extra)}
      </div>
      <div class="actions">
        <button class="btn-primary" data-go="${detail}">Detail Result</button>
        ${STATE.fromHistory ? '' : `<button class="text-link" data-go="${again}">Test Again</button>`}
      </div>
      ${STATE.fromHistory ? '' : scenarioDots(RESULT_IDS, id)}`;
  }

  // The home page itself, shared by 1_020 and its tip sheet 1_021
  function homeContent() {
    return `
      ${navbar('AiMesh Diagnostic', `<button class="navbar-btn" data-toast="Diagnostics 選單不在這次範圍" aria-label="返回">${ICON.back}</button>`, `<button class="navbar-btn navbar-btn-sub" data-go="home-tip" aria-label="說明">${ICON.info}</button>${historyBtn}`)}
      <div class="body home-body">
        <img class="illustration" src="assets/illustration.png" alt="手持手機在家中各處測試網路訊號" width="309" height="222">
        <p class="intro">Test real-time connection quality to diagnose and optimize your network experience.</p>
      </div>
      <div class="actions">
        <button class="btn-primary" data-decide="nodes">Start</button>
        <button class="text-link" data-go="advanced">Advanced Test</button>
      </div>`;
  }

  function historyCards() {
    return HISTORY.map(r => `
      <div class="h-card" data-go="detail" data-rec="${r.id}">
        <button class="h-more" data-go="history-actions" data-rec="${r.id}" aria-label="更多">${ICON.more}</button>
        <div class="h-top">
          <div><div class="h-at">${r.at}</div><div class="h-note">${esc(r.note)}</div></div>
          <span class="h-grade ${r.grade === 'Good' ? 'good' : 'notice'}">${r.grade}</span>
        </div>
        <div class="pair">${r.router} <span class="arrows">↔</span> Phone</div>
        ${speeds(r)}
      </div>`).join('');
  }
  const historyList = () => `
    ${navbar('Testing History', backBtn)}
    <div class="body"><div class="h-list">${historyCards()}</div></div>`;
  const pickRecord = el => onTap(el, '[data-rec]', n => {
    const r = HISTORY.find(x => x.id === +n.dataset.rec);
    if (n.classList.contains('h-more')) STATE.picked = r;
    else { STATE.view = r; STATE.fromHistory = true; }
  });

  // Why a device can't be picked in Advanced Test ('' = it can). All cases live in the same lists:
  //  firmware doesn't support the test → grayed on both sides
  //  some routers' firmware can't be tested against any phone (the router is the problem, not the phone)
  //  → whichever side is picked first grays out the other's match
  function unavailable(d, key) {
    if (d.fw === false) return '韌體不支援此測試';
    // The same device can't be both ends of the test
    if (key === 'client' && d.name === SERVERS[STATE.server].name) return '已選為 Server';
    if (key === 'server' && d.name === CLIENTS[STATE.client].name) return '已選為 Client';
    if (key === 'client' && d.phone && SERVERS[STATE.server].noPhone) return '目前的 Server 無法與行動裝置對測';
    if (key === 'server' && d.noPhone && CLIENTS[STATE.client].phone) return '無法與行動裝置對測';
    return '';
  }
  // Demo-only: each device's firmware case next to its IP, so testers know what to pick
  const caseTag = d => `<span class="case-tag">${d.phone ? '手機' : d.fw === false ? 'A｜不支援測試' : d.noPhone ? 'B｜僅 router↔router・TCP' : 'C｜完整功能'}</span>`;
  // Unavailable rows are grayed out, can't be picked, and say why on their own second line
  function deviceList(list, key) {
    const why = list.map(d => unavailable(d, key));
    // Pickable nodes first, then a pickable phone, then the grayed ones (each group keeps its list order)
    const rank = i => why[i] ? 2 : list[i].phone ? 1 : 0;
    const order = list.map((_, i) => i).sort((x, y) => rank(x) - rank(y));
    return `
      <div class="body">
        <div class="group sel-list">
          ${order.map(i => [list[i], i]).map(([d, i]) => why[i] ? `
            <div class="sel-row off" aria-disabled="true">
              <span><span class="sel-name">${d.name}</span><span class="sel-why"><span class="skip-i">i</span>${why[i]}${caseTag(d)}</span></span>
            </div>` : `
            <button class="sel-row" data-go="back" data-pick="${i}">
              <span><span class="sel-name">${d.name}</span><span class="sel-ip">${d.ip}${caseTag(d)}</span></span>
              ${STATE[key] === i ? `<span class="sel-check">${ICON.check}</span>` : ''}
            </button>`).join('')}
        </div>
      </div>`;
  }
  const pickDevice = key => el => onTap(el, '[data-pick]', n => { STATE[key] = +n.dataset.pick; });

  // Advanced Test options. If the chosen pair includes a case-B device, it runs basic TCP only:
  // Duration and UDP are grayed out (TCP shown on) and a note says why. The user's own picks are kept for later.
  const advB = () => [SERVERS[STATE.server], CLIENTS[STATE.client]].filter(d => d.noPhone);
  const advProtocol = () => advB().length ? 'TCP' : STATE.protocol;
  // Advanced Test runs one hop between the two chosen endpoints ("ZenWiFi BT8(Home)" → name + place)
  const advNode = d => {
    const [, name = d.name, place = d.name] = d.name.match(/^(.*?)\((.*)\)$/) || [];
    const icon = d.phone ? 'phone' : { Kitchen: 'kitchen', Bedroom: 'bedroom' }[place] || 'home';
    return d.phone ? { name: d.name, place: 'Phone', icon, end: true } : { name, place, icon };
  };
  const ADV_HOP = { down: 118.4, up: 64.2, udp: { retrans: '0.21%', loss: '0%', jitter: '0.2ms' }, tcp: { deviation: '2 ms', latency: '6 ms', retrans: '0.21%' } };
  // long: only two endpoints, so the link between them is drawn longer
  const advPath = () => ({ nodes: [advNode(SERVERS[STATE.server]), advNode(CLIENTS[STATE.client])], hops: [ADV_HOP], long: true });

  function advOptions() {
    const b = advB();
    const seg = (key, values, on, locked) => `<span class="seg${locked ? ' locked' : ''}" data-seg="${key}">${values.map(v =>
      `<button class="${on === v ? 'on' : ''}" data-v="${v}"${locked && on !== v ? ' disabled' : ''}${locked ? ' aria-disabled="true"' : ''}>${v}</button>`).join('')}</span>`;
    return `
      <div class="group">
        <div class="adv-row${b.length ? ' off' : ''}"><b>Duration</b>${seg('duration', ['30s', '60s', '120s'], b.length ? '30s' : STATE.duration, b.length)}</div>
        <div class="adv-row"><b>Protocol</b>${seg('protocol', ['UDP', 'TCP'], b.length ? 'TCP' : STATE.protocol, b.length)}</div>
      </div>
      ${b.length ? '<ul class="sel-note"><li>目前組合只能使用 TCP，無法調整測試時間。</li></ul>' : ''}`;
  }

  window.AIMESH_SCREENS = [
    // ── 1 主流程 ──
    {
      id: 'home',
      code: '1_020',
      name: 'AiMesh Diagnostic 首頁',
      description: 'AiMesh Diagnostic 首頁：說明這個功能，按 Start 開始測試；右上 ⓘ 看使用提示、時鐘圖示看歷史紀錄',
      figmaNode: '250:507',
      render: homeContent,
    },
    {
      id: 'home-tip',
      back: 'home',
      code: '1_021',
      name: '使用提示',
      description: '使用提示（首頁 ⓘ）：拿著手機到不同位置按 Start 找出死角；要測特定一段用 Advanced Test',
      figmaNode: '352:2421',
      render: () => `
        ${homeContent()}
        <div class="overlay" data-go="back"></div>
        <div class="sheet">
          <button class="sheet-close" data-go="back" aria-label="關閉">${ICON.closeCircle}</button>
          <h2>Scan on the go to find dead zones.</h2>
          <p>Bring your phone to different locations and tap '<button class="inline-link" data-go="testing">Start</button>' to analyze the signal quality in that area.</p>
          <p>To diagnose a specific segment, use '<button class="inline-link" data-go="advanced">Advanced Test</button>' below</p>
        </div>`,
    },
    {
      id: 'home-unsupported',
      hidden: true, // hidden for now: all REs unsupported is just the two-unsupported case (1_034), no warning first
      back: 'home',
      code: '1_022',
      name: 'RE 全部不支援（先提示）',
      description: 'RE 全部不支援：按 Start 時偵測到所有 RE 的韌體都不支援，先跳出面板列出 RE；CAP 正常，所以仍可開始測試 CAP ↔ 手機（進 1_034）',
      render: () => `
        ${homeContent()}
        <div class="overlay" data-go="back"></div>
        <div class="sheet skip-sheet">
          <button class="sheet-close" data-go="back" aria-label="關閉">${ICON.closeCircle}</button>
          <h2>其他節點不支援此測試</h2>
          <p>以下節點的韌體版本不支援此測試：</p>
          ${skippedRows(SKIPPED_2, '不支援')}
          <div class="hop-skip sheet-callout"><span class="skip-i">i</span><span>本次只會測試 <b>${NODES[0].name}</b> 與<b>手機</b>之間的連線。</span></div>
          <button class="btn-primary skip-sheet-btn" data-go="testing-skip2-inline" data-label="開始測試">開始測試</button>
          <button class="text-link skip-sheet-link" data-go="back">取消</button>
        </div>`,
    },
    {
      id: 'home-cap-unsupported',
      back: 'home',
      code: '1_023',
      name: 'CAP 不支援（無法開始）',
      description: 'CAP 不支援（case A）：測試從 CAP 開始，CAP 不能測就沒有上一層可改接，按 Start 直接跳出面板，說明是主路由器韌體導致整條無法測，建議改用 Advanced Test 讓節點間對測',
      render: () => capBlockSheet(true),
    },
    {
      id: 'home-cap-unsupported-noadv',
      back: 'home',
      code: '1_024',
      name: 'CAP 不支援（無法開始，RE 不足兩台支援）',
      description: 'CAP 不支援，且支援測試的 RE 不到兩台：Advanced Test 也無法對測，所以面板只說明主路由器韌體不支援，不推薦 Advanced，只有確定',
      render: () => capBlockSheet(false),
    },
    {
      id: 'testing',
      back: 'home',
      code: '1_030',
      name: '測試中',
      description: '測試中：由路由器往手機一段一段測速，正在測的那段節點會轉圈、連線有流動的點，右下 pause 可暫停討論，測完直接進入結果頁',
      figmaNode: '294:412',
      render: () => `
        ${navbar('AiMesh Diagnostic', backBtn, '<button class="navbar-text" data-go="home" data-label="Cancel">Cancel</button>')}
        <div class="body">${topology(false)}</div>
        ${PAUSE_BTN}`,
      mount: el => {
        mountDots(el);
        const pause = mountPause(el, () => { saveRun(HOPS); advance('testing', 'detail', true); });
        const stop = runTest(el, HOPS, () => { pause.done(); saveRun(HOPS); advance('testing', 'detail', true); });
        return () => { stop(); pause.cleanup(); };
      },
    },
    {
      id: 'testing-skip',
      back: 'home',
      code: '1_031',
      name: '測試中（一台不支援）',
      description: '測試中（有一台不支援）：一開始照使用者認知的 4 台排好，測到 B10 時變灰、退出主線，變成 BT10 → Phone 旁的灰色分支，接著測 BT10 → Phone；點灰色分支可看原因，測試不中斷；測完自動進 Detail，面板開著時等關掉再跳',
      render: () => skipTesting('testing-skip', FULL_PATH, { 1: skippedBranch(SKIPPED, true) }, [SKIPPED]).replace('<div class="body">', '<div class="body skip-inline">'),
      mount: mountSkipTesting('testing-skip', SKIP_PATH, 'detail-skip',
        (el, done) => runInLine(el, [2], SKIP_PATH.hops, done)),
    },
    {
      id: 'testing-skip2',
      hidden: true, // hidden for now: two unsupported nodes use the animated version (1_034)
      back: 'home',
      code: '1_033',
      name: '測試中（兩台不支援）',
      description: '測試中（兩台不支援）：開始前就知道 BT10、B10 不支援，只測 BT8 → Phone；兩台灰色分支疊在那段連線旁，點分支同 1_031',
      render: () => skipTesting('testing-skip2', SKIP2_PATH, { 0: skippedGroup(SKIPPED_2, true) }, SKIPPED_2),
      mount: mountSkipTesting('testing-skip2', SKIP2_PATH, 'detail-skip2'),
    },
    {
      id: 'testing-skip2-inline',
      back: 'home',
      code: '1_034',
      name: '測試中（兩台不支援：測到時才退出）',
      description: '測試中（兩台不支援，討論用畫法）：一開始照使用者認知的 4 台排好，測到 BT10、B10 時依序變灰、退出主線，疊成 BT8 → Phone 旁的兩個灰色分支，最後測 BT8 → Phone',
      render: () => skipTesting('testing-skip2-inline', FULL_PATH, { 0: skippedGroup(SKIPPED_2, true) }, SKIPPED_2).replace('<div class="body">', '<div class="body skip-inline">'),
      mount: mountSkipTesting('testing-skip2-inline', SKIP2_PATH, 'detail-skip2',
        (el, done) => runInLine(el, [1, 2], SKIP2_PATH.hops, done)),
    },
    {
      id: 'testing-tcp',
      back: 'home',
      code: '1_035',
      name: '測試中（有一台僅支援 TCP）',
      description: '測試中（有一台 B）：BT10 只支援 router ↔ router，照常參與測試、畫在主線上，但整次 Quick test 只跑 TCP',
      render: () => `
        ${navbar('AiMesh Diagnostic', backBtn, '<button class="navbar-text" data-go="home" data-label="Cancel">Cancel</button>')}
        <div class="body">${topology(false, '', FULL_PATH)}</div>
        ${PAUSE_BTN}`,
      mount: mountSkipTesting('testing-tcp', FULL_PATH, 'detail-tcp'),
    },
    {
      id: 'testing-cap-b',
      back: 'home',
      code: '1_036',
      name: '測試中（CAP 為 TCP，不支援手機）',
      description: '測試中（CAP 是 B、手機連在 CAP）：照 BT8 → BT10 → B10 → Phone 排，路由器之間照常測（TCP）；輪到手機時，手機變灰、退出主線，成為 B10 旁的灰色分支',
      render: () => `
        ${navbar('AiMesh Diagnostic', backBtn, '<button class="navbar-text" data-go="home" data-label="Cancel">Cancel</button>')}
        <div class="body skip-inline">${topology(false, '', FULL_PATH, { 2: skippedBranch(CAP_PHONE, true) })}</div>
        ${PAUSE_BTN}
        ${capPhoneSheet()}`,
      mount: mountSkipTesting('testing-cap-b', CAPB_PATH, 'detail-cap-b', runCapB),
    },
    {
      id: 'result',
      hidden: true, // hidden for now: the test and Testing History go straight to Detail Result
      back: 'home',
      theme: 'gray',
      code: '1_040',
      name: '測試結果',
      description: '測試結果：整體評等、BT8 ↔ Phone 速度，以及節點狀態與訊號建議（點 Wifi signal weak 看建議）',
      figmaNode: '145:2382',
      render: () => resultPage({ id: 'result', again: 'testing', detail: 'detail' }),
      mount: mountDots,
    },
    {
      id: 'detail',
      back: 'testing',
      code: '1_050',
      name: 'Detail Result 拓撲',
      description: 'Detail Result：每一段連線的上下行速度，綠色是良好、橘色是偏慢，點卡片看那一段的詳細數據',
      figmaNode: '294:409',
      render: () => `
        ${navbar('AiMesh Diagnostic', backBtn, '<button class="navbar-text" data-go="home" data-label="Done">Done</button>')}
        <div class="body">${topology(true, 'data-decide="protocol"')}</div>
        `,
      mount: el => { mountDots(el); rememberHop(FULL_PATH)(el); },
    },
    {
      id: 'result-skip',
      hidden: true, // hidden for now: the test goes straight to Detail Result
      back: 'home',
      theme: 'gray',
      code: '1_041',
      name: '測試結果（有一台不支援）',
      description: '測試結果（有一台不支援）：評等照有測到的段落算；最上面藍框「1 台節點不支援此測試」，點了進 Detail Result',
      render: () => resultPage({ id: 'result-skip', again: 'testing-skip', detail: 'detail-skip', extra: skippedItem([SKIPPED], 'detail-skip') }),
      mount: mountDots,
    },
    {
      id: 'detail-skip',
      back: 'testing-skip',
      code: '1_051',
      name: 'Detail Result 拓撲（有一台不支援）',
      description: 'Detail Result（有一台不支援）：主線 BT8 → BT10 → Phone，B10 灰色分支；點分支（ⓘ 不支援）看原因',
      render: () => `
        ${navbar('AiMesh Diagnostic', backBtn, '<button class="navbar-text" data-go="home" data-label="Done">Done</button>')}
        <div class="body">${topology(true, 'data-decide="protocol"', SKIP_PATH, { 1: skippedBranch(SKIPPED, true) })}</div>
        
        ${skipSheet([SKIPPED])}`,
      mount: el => { mountDots(el); rememberHop(SKIP_PATH)(el); mountSheet(el); },
    },
    {
      id: 'result-skip2',
      hidden: true, // hidden for now: the test goes straight to Detail Result
      back: 'home',
      theme: 'gray',
      code: '1_042',
      name: '測試結果（兩台不支援）',
      description: '測試結果（兩台不支援）：評等照有測到的段落算；最上面藍框「2 台節點不支援此測試」列出兩台，點了進 Detail Result',
      render: () => resultPage({ id: 'result-skip2', again: 'testing-skip2-inline', detail: 'detail-skip2', extra: skippedItem(SKIPPED_2, 'detail-skip2') }),
      mount: mountDots,
    },
    {
      id: 'detail-skip2',
      back: 'testing-skip2-inline',
      code: '1_052',
      name: 'Detail Result 拓撲（兩台不支援）',
      description: 'Detail Result（兩台不支援）：主線 BT8 → Phone，BT10、B10 兩個灰色分支疊在旁邊；點分支（ⓘ 不支援）看兩台清單與原因',
      render: () => `
        ${navbar('AiMesh Diagnostic', backBtn, '<button class="navbar-text" data-go="home" data-label="Done">Done</button>')}
        <div class="body">${topology(true, 'data-decide="protocol"', SKIP2_PATH, { 0: skippedGroup(SKIPPED_2, true) })}</div>
        
        ${skipSheet(SKIPPED_2)}`,
      mount: el => { mountDots(el); rememberHop(SKIP2_PATH)(el); mountSheet(el); },
    },
    {
      id: 'result-tcp',
      hidden: true, // hidden for now: the test goes straight to Detail Result
      back: 'home',
      theme: 'gray',
      code: '1_043',
      name: '測試結果（有一台僅支援 TCP）',
      description: '測試結果（有一台 B）：最上面藍框「本次僅以 TCP 測試」說明哪台韌體較舊、建議更新，點了看 FAQ',
      render: () => resultPage({ id: 'result-tcp', again: 'testing-tcp', detail: 'detail-tcp', extra: tcpOnlyItem(TCP_ONLY) }),
      mount: mountDots,
    },
    {
      id: 'detail-tcp',
      back: 'testing-tcp',
      code: '1_053',
      name: 'Detail Result 拓撲（有一台僅支援 TCP）',
      description: 'Detail Result（有一台 B）：拓撲照常，只跑了 TCP，所以點卡片直接進 TCP 單段頁（不問 UDP / TCP）；每段的單段頁都有「本次僅以 TCP 測試」說明與 FAQ',
      render: () => `
        ${navbar('AiMesh Diagnostic', backBtn, '<button class="navbar-text" data-go="home" data-label="Done">Done</button>')}
        <div class="body">${topology(true, 'data-go="hop-tcp"', TCP_PATH)}</div>
        `,
      mount: el => { mountDots(el); rememberHop(TCP_PATH)(el); },
    },
    {
      id: 'detail-cap-b',
      back: 'testing-cap-b',
      code: '1_054',
      name: 'Detail Result 拓撲（CAP 為 TCP，不支援手機）',
      description: 'Detail Result（CAP 是 B、手機連在 CAP）：BT8 → BT10 → B10（只跑 TCP），手機是 B10 後面虛線旁的灰色分支，點了看原因；點卡片直接進 TCP 單段頁',
      render: () => `
        ${navbar('AiMesh Diagnostic', backBtn, '<button class="navbar-text" data-go="home" data-label="Done">Done</button>')}
        <div class="body">${capBTopology()}</div>
        
        ${capPhoneSheet()}`,
      mount: el => { mountDots(el); rememberHop(CAPB_PATH)(el); mountSheet(el); },
    },
    {
      id: 'hop-udp',
      back: 'detail',
      code: '1_060',
      name: '單段詳細結果 UDP',
      description: '單段詳細結果（UDP）：下載、上傳、重傳率、掉包率、Jitter',
      figmaNode: '146:2936',
      render: hopScreen('UDP'),
    },
    {
      id: 'hop-tcp',
      back: 'detail',
      code: '1_070',
      name: '單段詳細結果 TCP',
      description: '單段詳細結果（TCP）：下載、上傳、Deviation、Latency、重傳率',
      figmaNode: '146:2852',
      render: hopScreen('TCP'),
    },
    {
      id: 'suggestions',
      hidden: true, // hidden with 1_040: only the result page links here
      back: 'result',
      theme: 'gray',
      code: '1_080',
      name: 'Suggestions',
      description: 'Suggestions（點結果頁的 Wifi signal weak）：推薦工具與常見問題排除',
      figmaNode: '252:1859',
      render: () => `
        ${navbar('Suggestions', backBtn)}
        <div class="body">
          <div class="sec-title">Recommended</div>
          <button class="sug-card" data-toast="Floor Plan Assistant 尚未加入"><span class="sug-icon yellow">${ICON.floorplan}</span><span><b>Floor Plan Assistant</b><small>Simulate coverage on web to find perfect node placement.</small></span>${ICON.rowChevron}</button>
          <button class="sug-card" data-toast="Add More Nodes 尚未加入"><span class="sug-icon blue">${ICON.cart}</span><span><b>Add More Nodes</b><small>Eliminate dead zones with AiMesh nodes for whole-home Wi-Fi.</small></span>${ICON.rowChevron}</button>
          <div class="sec-title">Troubleshooting &amp; Optimization (FAQ)</div>
          <div class="group faq">
            <button class="faq-row" data-toast="Restart Router &amp; Modem 尚未加入"><span><b>Restart Router &amp; Modem</b><small>Power cycle your devices to refresh connection and clear temporary issues.</small></span>${ICON.rowChevron}</button>
            <button class="faq-row" data-toast="Adjust Wireless Channels 尚未加入"><span><b>Adjust Wireless Channels</b><small>Change channels to avoid interference from other networks for better stability.</small></span>${ICON.rowChevron}</button>
            <button class="faq-row" data-toast="Update Firmware 尚未加入"><span><b>Update Firmware</b><small>Ensure your router has the latest performance and security improvements.</small></span>${ICON.rowChevron}</button>
          </div>
        </div>`,
    },
    {
      id: 'feedback',
      back: 'detail',
      tabbar: false,
      code: '1_090',
      name: 'Feedback',
      description: 'Feedback（Report Issue）：填寫問題類型與描述後送出',
      figmaNode: '352:2565',
      render: () => `
        ${navbar('Feedback', `<button class="navbar-btn navbar-btn-round navbar-btn-blue" data-go="back" aria-label="關閉">${ICON.close}</button>`, '<button class="navbar-pill" data-send>Send</button>')}
        <div class="body form">
          <label class="f-label">Your Region</label>
          <div class="f-field"><input value="taiwan" aria-label="Your Region"><button class="f-clear" data-clear aria-label="清除">${ICON.clear}</button></div>
          <label class="f-label">Your e-mail Address (Required)</label>
          <div class="f-field"><input type="email" value="asus1234@example.com" aria-label="E-mail"><button class="f-clear" data-clear aria-label="清除">${ICON.clear}</button></div>
          <label class="f-label">Feedback problem type</label>
          <div class="f-field f-select"><select aria-label="Feedback problem type"><option>Connection/Speed Problem</option><option>Wi-Fi Coverage</option><option>AiMesh Node Offline</option><option>Other</option></select>${ICON.rowChevron}</div>
          <label class="f-label">Feedback problem description</label>
          <div class="f-field f-select"><select aria-label="Feedback problem description"><option>Please select</option><option>Speed is slower than expected</option><option>Connection drops frequently</option><option>Some rooms have no signal</option></select>${ICON.rowChevron}</div>
          <label class="f-label">Comments / Suggestions</label>
          <div class="f-area"><textarea maxlength="2000" placeholder="Type here" aria-label="Comments"></textarea><span class="f-count">0/2000</span></div>
          <button class="f-attach" data-toast="Attach Image(s) 尚未加入">Attach Image(s)${ICON.rowChevron}</button>
        </div>`,
      mount: el => {
        const ta = el.querySelector('textarea'), count = el.querySelector('.f-count');
        ta.addEventListener('input', () => { count.textContent = `${ta.value.length}/2000`; });
        onTap(el, '[data-clear]', n => { n.previousElementSibling.value = ''; n.previousElementSibling.focus(); });
        onTap(el, '[data-send]', () => {
          if (!el.querySelector('input[type=email]').value.trim()) return toast('請填寫 e-mail');
          toast('已送出，謝謝你的回饋');
          setTimeout(() => history.back(), 900);
        });
      },
    },

    // ── 2 Testing History ──
    {
      id: 'history-empty',
      back: 'home',
      theme: 'gray',
      code: '2_010',
      name: 'Testing History 沒有資料',
      description: 'Testing History（沒有資料）：還沒有任何測試紀錄',
      figmaNode: '567:277',
      render: () => `
        ${navbar('Testing History', backBtn)}
        <div class="body empty"><span class="empty-icon">${ICON.list}</span><p>No data in table</p></div>`,
    },
    {
      id: 'history',
      back: 'home',
      theme: 'gray',
      code: '2_020',
      name: 'Testing History',
      description: 'Testing History：每次測試的時間、位置備註、評等與速度；點卡片看結果，點 ••• 編輯備註或刪除',
      figmaNode: '146:3631',
      render: () => HISTORY.length ? historyList() : `
        ${navbar('Testing History', backBtn)}
        <div class="body empty"><span class="empty-icon">${ICON.list}</span><p>No data in table</p></div>`,
      mount: pickRecord,
    },
    {
      id: 'history-actions',
      back: 'history',
      theme: 'gray',
      code: '2_030',
      name: '紀錄操作選單',
      description: '紀錄操作選單（點 •••）：Edit a note 或 Delete',
      figmaNode: '562:500',
      render: () => `
        ${historyList()}
        <div class="overlay" data-go="history"></div>
        <div class="action-sheet">
          <div class="as-group">
            <button data-go="history-note">Edit a note</button>
            <button data-go="history-delete">Delete</button>
          </div>
          <button class="as-cancel" data-go="history">Cancel</button>
        </div>`,
    },
    {
      id: 'history-note',
      back: 'history',
      theme: 'white',
      code: '2_040',
      name: '編輯備註（位置）',
      description: '編輯備註：選一個位置，或直接輸入，按 Apply 存回這筆紀錄',
      figmaNode: '562:728',
      render: () => `
        ${navbar('Location', `<button class="navbar-btn navbar-btn-round navbar-btn-blue" data-go="history" aria-label="返回">${ICON.back}</button>`)}
        <div class="body">
          <div class="menu loc-list">
            ${LOCATIONS.map(l => `<button class="menu-row loc-row" data-loc="${l}"><span class="loc-icon">${ICON.place}</span>${l}</button>`).join('')}
          </div>
        </div>
        <div class="overlay overlay-light"></div>
        <div class="alert alert-input">
          <div class="alert-title">Change device location</div>
          <input class="alert-field" maxlength="24" placeholder="Enter a short note" aria-label="備註">
          <div class="alert-btns">
            <button class="alert-pill" data-go="history">Cancel</button>
            <button class="alert-pill" data-apply>Apply</button>
          </div>
        </div>`,
      mount: el => {
        const r = STATE.picked || HISTORY[0];
        const field = el.querySelector('.alert-field');
        field.value = r.note;
        setTimeout(() => { field.focus(); field.select(); }, 50);
        onTap(el, '[data-loc]', n => { field.value = n.dataset.loc; field.focus(); });
        onTap(el, '[data-apply]', () => {
          r.note = field.value.trim() || r.note;
          location.replace('#history');
        });
      },
    },
    {
      id: 'history-delete',
      back: 'history',
      theme: 'gray',
      code: '2_050',
      name: '刪除紀錄確認',
      description: '刪除紀錄確認：按 OK 刪掉這筆紀錄，回到 Testing History（全部刪完就變成沒有資料）',
      figmaNode: '562:730',
      render: () => `
        ${historyList()}
        <div class="overlay overlay-light"></div>
        <div class="alert">
          <div class="alert-title">Notice</div>
          <div class="alert-msg">Are you sure you want to delete this test record?</div>
          <div class="alert-actions">
            <button data-go="history">Cancel</button>
            <button data-delete>OK</button>
          </div>
        </div>`,
      mount: el => onTap(el, '[data-delete]', () => {
        const i = HISTORY.indexOf(STATE.picked);
        if (i >= 0) HISTORY.splice(i, 1);
        location.replace(HISTORY.length ? '#history' : '#history-empty');
      }),
    },

    // ── 3 Advanced Test ──
    {
      id: 'advanced',
      back: 'home',
      theme: 'gray',
      code: '3_010',
      name: 'Advanced Test',
      description: 'Advanced Test：指定 Server、Client、測試時間與通訊協定，測特定兩台裝置之間的連線',
      figmaNode: '146:3061',
      render: () => `
        ${navbar('Advanced', backBtn)}
        <div class="body">
          <p class="adv-desc">Run performance test between specific devices to isolate and troubleshoot network bottlenecks.</p>
          <div class="group">
            <button class="adv-row" data-go="select-server"><b>Server</b><span>${SERVERS[STATE.server].name}</span>${ICON.rowChevron}</button>
            <button class="adv-row" data-go="select-client"><b>Client</b><span>${CLIENTS[STATE.client].name}</span>${ICON.rowChevron}</button>
          </div>
          ${advOptions()}
        </div>
        <div class="actions">
          <button class="btn-primary" data-go="advanced-testing">Start</button>
        </div>`,
      mount: el => onTap(el, '.seg button:not([disabled])', n => {
        STATE[n.parentElement.dataset.seg] = n.dataset.v;
        n.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === n));
      }),
    },
    {
      id: 'advanced-testing',
      back: 'advanced',
      code: '3_040',
      name: 'Advanced Test 測試中',
      description: 'Advanced Test 測試中：只有選的兩個端點（Server ↔ Client），連線拉長，測一段；測完進 Advanced 結果頁',
      render: () => `
        ${navbar('Advanced', backBtn, '<button class="navbar-text" data-go="advanced" data-label="Cancel">Cancel</button>')}
        <div class="body">${topology(false, '', advPath())}</div>
        ${PAUSE_BTN}`,
      mount: el => {
        const path = advPath();
        const finish = () => { STATE.path = path; STATE.hop = 0; advance('advanced-testing', 'advanced-result'); };
        const pause = mountPause(el, finish);
        const stop = runTest(el, path.hops, () => { pause.done(); finish(); });
        return () => { stop(); pause.cleanup(); };
      },
    },
    {
      id: 'advanced-result',
      back: 'advanced',
      code: '3_050',
      name: 'Advanced Test 結果',
      description: 'Advanced Test 結果：兩個端點與這段的下載／上傳（連線依速度變色），點卡片看單段詳細結果（依選的 Protocol，有 B 時固定 TCP）',
      render: () => `
        ${navbar('Detail Result', backBtn, '<button class="navbar-text" data-go="advanced" data-label="Done">Done</button>')}
        <div class="body">${topology(true, `data-go="${advProtocol() === 'TCP' ? 'hop-tcp' : 'hop-udp'}"`, STATE.path.long ? STATE.path : advPath())}</div>
        <div class="actions">
          <button class="text-link" data-go="advanced-testing">Test Again</button>
        </div>`,
      mount: el => onTap(el, '[data-card]', () => { STATE.path = STATE.path.long ? STATE.path : advPath(); STATE.hop = 0; }),
    },
    {
      id: 'select-server',
      back: 'advanced',
      theme: 'gray',
      code: '3_020',
      name: 'Select Server',
      description: 'Select Server：選擇要當測試端點的路由器或節點',
      figmaNode: '146:3207',
      render: () => navbar('Select Server', backBtn) + deviceList(SERVERS, 'server'),
      mount: pickDevice('server'),
    },
    {
      id: 'select-client',
      back: 'advanced',
      theme: 'gray',
      code: '3_030',
      name: 'Select Client',
      description: 'Select Client：選擇另一端的節點或手機',
      figmaNode: '146:3334',
      render: () => navbar('Select Client', backBtn) + deviceList(CLIENTS, 'client'),
      mount: pickDevice('client'),
    },

  ];

  window.AIMESH_DECISIONS = {
    nodes: {
      index: 0,
      label: 'Nodes',
      title: '這次測試的節點狀態？',
      options: [
        { label: '全部支援', short: '全部支援', value: 'all', to: 'testing' },
        { label: '一台不支援', short: '一台不支援', value: 'skip', to: 'testing-skip' },
        { label: '兩台不支援（RE 全部不支援）', short: '兩台不支援', value: 'skip2-inline', to: 'testing-skip2-inline' },
        { label: '有一台僅支援 TCP（B）', short: '一台僅 TCP', value: 'tcp', to: 'testing-tcp' },
        { label: 'CAP 為 TCP，不支援手機', short: 'CAP 為 TCP', value: 'cap-b', to: 'testing-cap-b' },
        { label: 'CAP 不支援（無法開始）', short: 'CAP 不支援', value: 'cap-a', to: 'home-cap-unsupported' },
        { label: 'CAP 不支援，RE 不足兩台支援（無 Advanced）', short: 'CAP 不支援・無 Adv', value: 'cap-a-noadv', to: 'home-cap-unsupported-noadv' },
      ],
    },
    protocol: {
      index: 1,
      label: 'Protocol',
      title: '這次測試用哪個通訊協定？',
      options: [
        { label: 'UDP', value: 'udp', to: 'hop-udp' },
        { label: 'TCP', value: 'tcp', to: 'hop-tcp' },
      ],
    },
    history: {
      index: 2,
      label: 'History',
      title: 'Testing History 有沒有資料？',
      options: [
        { label: '有資料', short: '有資料', value: 'yes', to: 'history' },
        { label: '沒有資料', short: '沒有資料', value: 'no', to: 'history-empty' },
      ],
    },
  };
})();
