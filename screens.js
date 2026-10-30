// AiMesh Diagnostic flow screens, in flow order.
// code: page number shown in the demo bar, <flow>_<seq> (e.g. 1_010).
//   1_xxx main flow · 2_xxx Testing History · 3_xxx Advanced Test · 4_xxx result page, version B (tabs)
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
  const WEAK_BELOW = 50; // Mbps download; below this a link is drawn orange
  const HOP_MS = 2600;   // how long each hop's test runs

  // Devices for Advanced Test (Select Server / Select Client)
  const SERVERS = [
    { name: 'ZenWiFi BT8(Home)', ip: '192.168.52.4' },
    { name: 'ZenWiFi BT10(Kitchen)', ip: '192.168.52.12' },
    { name: 'ZenWiFi B10(Bedroom)', ip: '192.168.34.16' },
    { name: 'ZenWiFi BT10(Office)', ip: '192.168.11.45' },
    { name: 'ZenWiFi BT10(Garage)', ip: '192.168.36.1' },
    { name: 'RT-AX3000', ip: '192.168.22.26' },
  ];
  const CLIENTS = [
    { name: 'ZenWiFi BT10(Kitchen)', ip: '192.168.52.12' },
    { name: 'ZenWiFi B10(Bedroom)', ip: '192.168.34.16' },
    { name: 'GT-AX11000(2F)', ip: '192.168.34.20' },
    { name: 'ZenWiFi BT10(Office)', ip: '192.168.11.45' },
    { name: 'iPhone 16', ip: '192.168.36.1' },
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
    view: HISTORY[0],   // record shown on the result page
    picked: null,       // record the ••• menu was opened on
    server: 0,
    client: 4,
    duration: '30s',
    protocol: 'UDP',
    tab: 'suggest',     // version B result tab
  };

  const fmt = v => (v >= 100 || v % 1 ? v.toFixed(1) : String(v));
  const isWeak = h => h.down < WEAK_BELOW;
  const wait = ms => new Promise(r => setTimeout(r, ms));
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
  function topology(done, tapTo) {
    let html = `${nodeEl(NODES[0])}<div class="node-label">${NODES[0].name}</div>`;
    HOPS.forEach((h, i) => {
      const n = NODES[i + 1];
      const linkCls = done ? (isWeak(h) ? ' weak' : ' good') : '';
      html += `
        <div class="link-seg${linkCls}" data-link><span class="dots"><i></i><i></i><i></i><i></i><i></i></span></div>
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
  const rememberHop = el => onTap(el, '[data-card]', c => { STATE.hop = +c.dataset.hop; });

  function countUp(el, to, ms = 900) {
    const t0 = performance.now();
    (function step(now) {
      if (!el.isConnected) return;
      const p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      el.textContent = p < 1 ? (to * e).toFixed(1) : fmt(to);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }
  const countAll = el => el.querySelectorAll('[data-count]').forEach(b => countUp(b, +b.dataset.count));

  function speeds(r, counting) {
    const v = x => counting ? `<b data-count="${x}">0</b>` : `<b>${fmt(x)}</b>`;
    return `
      <div class="speeds">
        <span class="sp down">${ICON.down}${v(r.down)}<small>Mbps</small></span>
        <span class="sp up">${ICON.up}${v(r.up)}<small>Mbps</small></span>
      </div>`;
  }

  // Node Status + (when weak) the Wi-Fi tip, which opens Suggestions
  function resultItems(r) {
    return `
      <div class="items">
        <div class="item"><div><h3>Node Status</h3><p>All nodes are online and stable with no detected drops.</p></div>${ICON.ok}</div>
        ${r.weak ? `<button class="item item-tap" data-go="suggestions" style="animation-delay:.12s"><div><h3>Wifi signal weak</h3><p>Your phone is connected to a farther node.<br>Consider moving closer for optimal speed.</p></div>${ICON.warn}</button>` : ''}
      </div>`;
  }

  // Detail rows per protocol, as in the UDP / TCP frames; 'ALL' is the version B page
  function hopRows(proto) {
    const h = HOPS[STATE.hop];
    const rows = [['Download Speed', `${Math.round(h.down)} Mbps`], ['Upload Speed', `${Math.round(h.up)} Mbps`], ['Protocol', proto === 'ALL' ? 'UDP' : proto]];
    if (proto !== 'UDP') rows.push(['Deviation', h.tcp.deviation], ['Latency', h.tcp.latency], ['Retransmission', h.tcp.retrans]);
    if (proto === 'UDP') rows.push(['Retransmission', h.udp.retrans]);
    if (proto !== 'TCP') rows.push(['Pack Lost', h.udp.loss], ['Jitter', h.udp.jitter]);
    return `<ul class="kv">${rows.map(([k, v]) => `<li>${k}<b>${v}</b></li>`).join('')}</ul>`;
  }

  function hopScreen(proto, title) {
    return () => {
      const a = NODES[STATE.hop], b = NODES[STATE.hop + 1];
      return `
        ${navbar(title, backBtn, `<button class="navbar-btn navbar-btn-blue" data-toast="Info – 尚未加入" aria-label="說明">${ICON.info}</button>`)}
        <div class="body">
          <div class="hop-head">
            <div class="hop-end"><div class="big-node">${ICON[a.icon]}</div>${a.place}</div>
            <div class="hop-line ${proto === 'UDP' ? 'udp' : 'tcp'}"></div>
            <div class="hop-end"><div class="big-node">${ICON[b.icon]}</div>${b.place}</div>
          </div>
          ${hopRows(proto)}
          ${proto === 'ALL' ? '' : '<p class="note">*Note:<br>Results show Mesh connectivity, not actual internet speed. Performance is subject to hardware, distance, and environmental interference.</p>'}
        </div>
        <div class="actions">
          <button class="btn-primary" data-go="feedback">Report Issue</button>
        </div>`;
    };
  }

  // The home page itself, shared by 1_020 and its tip sheet 1_021
  function homeContent() {
    return `
      ${navbar('AiMesh Diagnostic', backBtn, `<button class="navbar-btn navbar-btn-sub" data-go="home-tip" aria-label="說明">${ICON.info}</button>${historyBtn}`)}
      <div class="body home-body">
        <img class="illustration" src="assets/illustration.png" alt="手持手機在家中各處測試網路訊號" width="309" height="222">
        <p class="intro">Test real-time connection quality to diagnose and optimize your network experience.</p>
      </div>
      <div class="actions">
        <button class="btn-primary" data-go="testing">Start</button>
        <button class="text-link" data-go="advanced">Advanced Test</button>
      </div>`;
  }

  function historyCards() {
    const to = window.AIMESH_decision('layout') === 'b' ? 'result-b-suggest' : 'result';
    return HISTORY.map(r => `
      <div class="h-card" data-go="${to}" data-rec="${r.id}">
        <button class="h-more" data-go="history-actions" data-rec="${r.id}" aria-label="更多">${ICON.more}</button>
        <div class="h-top">
          <div><div class="h-at">${r.at}</div><div class="h-note">${esc(r.note)}</div></div>
          <span class="h-grade ${r.grade === 'Good' ? 'good' : 'notice'}">${r.grade}</span>
        </div>
        <div class="pair">${r.router} <span class="arrows">↔</span> Phone</div>
        ${speeds(r, false)}
      </div>`).join('');
  }
  const historyList = () => `
    ${navbar('Testing History', backBtn)}
    <div class="body"><div class="h-list">${historyCards()}</div></div>`;
  const pickRecord = el => onTap(el, '[data-rec]', n => {
    const r = HISTORY.find(x => x.id === +n.dataset.rec);
    if (n.classList.contains('h-more')) STATE.picked = r;
    else STATE.view = r;
  });

  // Version B result header: grade, date, speeds and an outlined Test Again
  function resultB(tab) {
    const r = STATE.view;
    return `
      ${navbar('AiMesh Diagnostic', backBtn, historyBtn)}
      <div class="body">
        <div class="summary summary-b">
          <div class="summary-b-top"><span class="grade ${r.grade === 'Good' ? '' : 'notice'}">${r.grade}</span><span class="stamp">${r.at}</span></div>
          <div class="grade-desc">Your network is healthy and performing well.</div>
          <div class="pair">${r.router} <span class="arrows">↔</span> Phone</div>
          ${speeds(r, true)}
          <button class="btn-outline" data-go="testing">Test Again</button>
        </div>
        <div class="tabs">
          <button class="${tab === 'suggest' ? 'on' : ''}" data-go="result-b-suggest">Suggestions</button>
          <button class="${tab === 'detail' ? 'on' : ''}" data-go="result-b-detail">Detail Result</button>
        </div>
        ${tab === 'suggest' ? resultItems(r) : `<div class="tab-panel">${topology(true, 'data-go="hop-b"')}</div>`}
      </div>`;
  }

  function deviceList(list, key) {
    return `
      <div class="body">
        <div class="group sel-list">
          ${list.map((d, i) => `
            <button class="sel-row" data-go="back" data-pick="${i}">
              <span><span class="sel-name">${d.name}</span><span class="sel-ip">${d.ip}</span></span>
              ${STATE[key] === i ? `<span class="sel-check">${ICON.check}</span>` : ''}
            </button>`).join('')}
        </div>
      </div>`;
  }
  const pickDevice = key => el => onTap(el, '[data-pick]', n => { STATE[key] = +n.dataset.pick; });

  window.AIMESH_SCREENS = [
    // ── 1 主流程 ──
    {
      id: 'diagnostics',
      theme: 'white',
      code: '1_010',
      name: 'Diagnostics 選單',
      description: 'Settings › Diagnostics 選單：選 AiMesh Diagnostic 進入這個功能',
      figmaNode: '548:464',
      render: () => `
        ${navbar('Diagnostics', `<button class="navbar-btn navbar-btn-round" data-toast="Settings 頁不在這次範圍" aria-label="返回">${ICON.back}</button>`)}
        <div class="body">
          <div class="menu">
            <button class="menu-row" data-toast="Network Diagnostic 是另一個專案">Network Diagnostic${ICON.rowChevron}</button>
            <button class="menu-row" data-go="home">AiMesh Diagnostic${ICON.rowChevron}</button>
            <button class="menu-row" data-toast="Traffic Statistics 尚未加入">Traffic Statistics${ICON.rowChevron}</button>
          </div>
        </div>`,
    },
    {
      id: 'home',
      back: 'diagnostics',
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
      id: 'testing',
      back: 'home',
      code: '1_030',
      name: '測試中',
      description: '測試中：由路由器往手機一段一段測速，正在測的那段節點會轉圈、連線有流動的點，測完自動進入結果頁',
      figmaNode: '294:412',
      render: () => `
        ${navbar('AiMesh Diagnostic', '', '<button class="navbar-text" data-go="home" data-label="Cancel">Cancel</button>')}
        <div class="body">${topology(false)}</div>`,
      mount: el => {
        let alive = true;
        const nodes = el.querySelectorAll('[data-node]');
        const links = el.querySelectorAll('[data-link]');
        const cards = el.querySelectorAll('[data-card]');
        (async () => {
          await wait(450);
          for (let i = 0; i < HOPS.length && alive; i++) {
            const h = HOPS[i], card = cards[i];
            const dv = card.querySelector('.down .val'), uv = card.querySelector('.up .val');
            nodes[i].classList.add('pulse'); nodes[i + 1].classList.add('pulse');
            links[i].classList.add('active');
            card.classList.add('running');
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Count up with a little jitter, like a live throughput reading
            const t0 = performance.now();
            await new Promise(done => {
              (function step(now) {
                if (!alive) return done();
                const p = Math.min(1, (now - t0) / HOP_MS);
                const ease = 1 - Math.pow(1 - p, 3);
                const noise = p < 1 ? (Math.random() - .5) * 0.12 * (1 - p) : 0;
                dv.textContent = fmt(+(h.down * (ease + noise)).toFixed(h.down % 1 ? 1 : 0));
                uv.textContent = fmt(+(h.up * Math.max(0, ease - .08 + noise)).toFixed(h.up % 1 ? 1 : 0));
                if (p < 1) requestAnimationFrame(step);
                else { dv.textContent = fmt(h.down); uv.textContent = fmt(h.up); done(); }
              })(t0);
            });
            if (!alive) return;

            nodes[i].classList.remove('pulse');
            if (i === HOPS.length - 1) nodes[i + 1].classList.remove('pulse');
            links[i].classList.remove('active');
            links[i].classList.add(isWeak(h) ? 'weak' : 'good');
            card.classList.remove('running'); card.classList.add('done');
            await wait(350);
          }
          await wait(500);
          if (!alive) return;

          // Save the run to Testing History, then show it
          const rec = { id: Date.now(), at: stamp(new Date()), note: 'Home', router: NODES[0].name, down: HOPS[0].down, up: HOPS[0].up, grade: 'Good', weak: HOPS.some(isWeak) };
          HISTORY.unshift(rec);
          STATE.view = rec;
          // Auto-advance: replace so Back from the result goes home, not into a re-run
          const layout = window.AIMESH_decision('layout');
          if (layout) location.replace(layout === 'b' ? '#result-b-suggest' : '#result');
          else window.AIMESH_decide('layout');
        })();
        return () => { alive = false; };
      },
    },
    {
      id: 'result',
      back: 'home',
      theme: 'gray',
      code: '1_040',
      name: '測試結果',
      description: '測試結果：整體評等、BT8 ↔ Phone 速度，以及節點狀態與訊號建議（點 Wifi signal weak 看建議）',
      figmaNode: '145:2382',
      render: () => {
        const r = STATE.view;
        return `
          ${navbar('AiMesh Diagnostic', backBtn, historyBtn)}
          <div class="body">
            <div class="summary">
              <div class="grade ${r.grade === 'Good' ? '' : 'notice'}">${r.grade}</div>
              <div class="grade-desc">Your network is healthy and performing well.</div>
              <div class="pair">${r.router} <span class="arrows">↔</span> Phone</div>
              ${speeds(r, true)}
              <div class="stamp">${r.at}</div>
            </div>
            ${resultItems(r)}
          </div>
          <div class="actions">
            <button class="btn-primary" data-go="detail">Detail Result</button>
            <button class="text-link" data-go="testing">Test Again</button>
          </div>`;
      },
      mount: countAll,
    },
    {
      id: 'detail',
      back: 'result',
      code: '1_050',
      name: 'Detail Result 拓撲',
      description: 'Detail Result：每一段連線的上下行速度，綠色是良好、橘色是偏慢，點卡片看那一段的詳細數據',
      figmaNode: '294:409',
      render: () => `
        ${navbar('AiMesh Diagnostic', backBtn, '<button class="navbar-text" data-go="result" data-label="Cancel">Cancel</button>')}
        <div class="body">${topology(true, 'data-decide="protocol"')}</div>`,
      mount: rememberHop,
    },
    {
      id: 'hop-udp',
      back: 'detail',
      code: '1_060',
      name: '單段詳細結果 UDP',
      description: '單段詳細結果（UDP）：下載、上傳、重傳率、掉包率、Jitter',
      figmaNode: '146:2936',
      render: hopScreen('UDP', 'Detail Result'),
    },
    {
      id: 'hop-tcp',
      back: 'detail',
      code: '1_070',
      name: '單段詳細結果 TCP',
      description: '單段詳細結果（TCP）：下載、上傳、Deviation、Latency、重傳率',
      figmaNode: '146:2852',
      render: hopScreen('TCP', 'Detail Result'),
    },
    {
      id: 'suggestions',
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
          <div class="group">
            <div class="adv-row"><b>Duration</b><span class="seg" data-seg="duration">${['30s', '60s', '120s'].map(v => `<button class="${STATE.duration === v ? 'on' : ''}" data-v="${v}">${v}</button>`).join('')}</span></div>
            <div class="adv-row"><b>Protocol</b><span class="seg" data-seg="protocol">${['UDP', 'TCP'].map(v => `<button class="${STATE.protocol === v ? 'on' : ''}" data-v="${v}">${v}</button>`).join('')}</span></div>
          </div>
        </div>
        <div class="actions">
          <button class="btn-primary" data-go="testing">Start</button>
        </div>`,
      mount: el => onTap(el, '.seg button', n => {
        STATE[n.parentElement.dataset.seg] = n.dataset.v;
        n.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('on', b === n));
      }),
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

    // ── 4 結果頁 B 版（Suggestions / Detail Result 分頁）──
    {
      id: 'result-b-suggest',
      back: 'home',
      theme: 'gray',
      code: '4_010',
      name: '測試結果 B 版：Suggestions',
      description: '測試結果 B 版：Test Again 移到上方卡片，下面分 Suggestions / Detail Result 兩個分頁（目前在 Suggestions）',
      figmaNode: '568:322',
      render: () => resultB('suggest'),
      mount: countAll,
    },
    {
      id: 'result-b-detail',
      back: 'home',
      theme: 'gray',
      code: '4_020',
      name: '測試結果 B 版：Detail Result',
      description: '測試結果 B 版：Detail Result 分頁，直接在結果頁看每一段的速度，點卡片看詳細數據',
      figmaNode: '568:448',
      render: () => resultB('detail'),
      mount: el => { countAll(el); rememberHop(el); },
    },
    {
      id: 'hop-b',
      back: 'result-b-detail',
      code: '4_030',
      name: '單段詳細結果 B 版',
      description: '單段詳細結果 B 版：UDP 與 TCP 的數據放在同一頁',
      figmaNode: '568:1430',
      render: hopScreen('ALL', 'AiMesh Diagnostic'),
    },
  ];

  window.AIMESH_DECISIONS = {
    layout: {
      index: 0,
      label: '結果頁',
      title: '結果頁要看哪一版？',
      options: [
        // replace, not push: Back from the result should go home, not re-run the test
        { label: 'A 版 · Detail Result 是另一頁（1_040）', short: 'A 版', value: 'a', action: () => location.replace('#result') },
        { label: 'B 版 · Suggestions / Detail Result 分頁（4_010）', short: 'B 版', value: 'b', action: () => location.replace('#result-b-suggest') },
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
