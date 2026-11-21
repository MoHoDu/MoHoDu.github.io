// ?print=1 로 열면 같은 원고를 1120×752 쪽으로 나눠 PDF와 쪽 보기 화면에 쓴다.
// 쪽 구성은 고정이고, 쪽마다 내용이 넘치면 축소해 맞춘다.
(function(){
  if (!/[?&]print=1\b/.test(location.search)) return;
  const W = 1120, H = 752, PAD_X = 56, PAD_TOP = 40, FOOT = 46;
  const $ = s => document.getElementById(s), q = (s, r = document) => r.querySelector(s), qa = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  root.dataset.theme = "light";
  root.classList.add("paged");
  const v = q(".hero video"); if (v) { v.pause(); v.removeAttribute("src"); v.load(); v.remove(); }

  // 일정 패널은 둘째 날을 펼친 상태로 고정한다.
  const dayBtn = qa("#days button")[1]; if (dayBtn) dayBtn.click();
  qa("#car details").forEach(d => d.open = true);

  const style = document.createElement("style");
  style.textContent = `
@page{size:${W}px ${H}px;margin:0}
html.paged,html.paged body{background:#fff;margin:0}
html.paged *,html.paged *::before,html.paged *::after{transition:none!important;animation:none!important}
.pg{position:relative;width:${W}px;height:${H}px;overflow:hidden;background:var(--bg);color:var(--ink);break-after:page;page-break-after:always}
.pg.ai{background:var(--deep);color:var(--on-deep)}
.pg-in{position:absolute;left:${PAD_X}px;right:${PAD_X}px;top:${PAD_TOP}px;height:${H - PAD_TOP - FOOT - 8}px;overflow:visible}
.pg-z{width:${W - PAD_X * 2}px}
.pg>footer{all:unset;box-sizing:border-box;position:absolute;left:${PAD_X}px;right:${PAD_X}px;bottom:14px;height:24px;display:flex;justify-content:space-between;align-items:center;font-size:12px;color:var(--muted);border-top:1px solid var(--line);padding-top:6px}
.pg.ai>footer{color:#A9A8C8;border-color:#302F52}
.pg footer a{color:inherit}
.pg .w{max-width:none;padding:0;margin:0}
.pg h2{margin-top:0}
.pg .kicker{margin-bottom:8px}
.pg .tl-wrap,.pg .tk-path,.pg .car{overflow:visible!important}
.pg .st{opacity:1!important;display:block;min-height:0;padding:0;border:0}
.pg .tablist{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:24px}
.pg .tablist button{opacity:1;background:#26254A;border-color:#3A3962}
.pg .tablist .tbar{display:none}
.pg .ph-cols{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:28px;align-items:start}
.pg .ph-l>:first-child,.pg .ph-r>:first-child{margin-top:0}
.pg .tp-k{margin-bottom:12px}
.pg .tl-wrap{overflow:visible}
.pg .tl{grid-auto-flow:row;grid-template-columns:repeat(4,minmax(0,1fr));grid-auto-columns:auto;min-width:0;row-gap:46px}
.pg .tl::before{display:none}
.pg .layer{opacity:1!important;transform:none!important}
.pg .hint{display:none}
.pg .lp-play{display:none}
.pg .car-h>div h2{margin-bottom:22px!important}
.pg .sh-tag{white-space:nowrap}
.pg .sys{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}
.pg .sys .sc{height:auto}
.pg.cover{background:#000;color:#fff}
.pg.cover{background:#000 url(media/coop-fire.jpg) center/cover no-repeat}
.pg.cover .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(12,11,30,.5),rgba(12,11,30,.2) 35%,rgba(12,11,30,.9))}
.pg.cover .pg-in{top:auto;bottom:${FOOT + 26}px;height:auto}
.pg.cover h1{font-family:"Hahmlet",serif;font-weight:800;font-size:104px;line-height:.98;margin:0;letter-spacing:-.03em}
.pg.cover p.t{font-family:"Hahmlet",serif;font-weight:300;font-size:30px;line-height:1.4;margin:14px 0 20px}
.pg.cover dl{display:flex;flex-wrap:wrap;gap:8px 28px;margin:0;font-size:14px}
.pg.cover dl div{display:flex;gap:8px}.pg.cover dt{opacity:.7}.pg.cover dd{margin:0;font-weight:500}
.pg.cover>footer{color:#ddd;border-color:rgba(255,255,255,.25)}
`;
  document.head.appendChild(style);

  const pages = [];
  const page = (nodes, cls = "") => pages.push({ nodes: [].concat(nodes).filter(Boolean), cls });
  const clone = n => { if (!n) return null; let c = n.cloneNode(true); if (c.tagName === "ARTICLE") { const d = document.createElement("div"); d.className = c.className; d.innerHTML = c.innerHTML; c = d; } qa("video", c).forEach(v => { if (!v.getAttribute("poster")) { v.remove(); return; } const i = document.createElement("img"); i.src = v.getAttribute("poster"); i.alt = ""; v.replaceWith(i); }); qa("article", c).forEach(x => { const d = document.createElement("div"); d.className = x.className; d.innerHTML = x.innerHTML; x.replaceWith(d); }); return c; };
  const wrap = (tag, cls, kids) => { const d = document.createElement(tag); if (cls) d.className = cls; kids.filter(Boolean).forEach(k => d.appendChild(k)); return d; };
  const kick = (text) => { const p = document.createElement("p"); p.className = "kicker"; p.textContent = text; return p; };

  // 1 표지
  const hero = q(".hero .w");
  pages.push({ cover: true, nodes: [clone(q("h1", hero)), clone($("tagline")), clone($("facts"))] });
  // 2 게임 개요와 기획 의도
  const about = q("#about .w");
  page([clone(q(".kicker", about)), clone(q("h2", about)), clone($("summary")), clone(q(".intent", about))]);
  // 3 공연과 일정
  page([clone($("loop")), clone(q("#about .scale:not(.intent .scale)")) || kick("전체 일정"), clone($("daywrap")), clone($("dayNote")), clone($("dayFoot"))]);
  // 4 AI 활용 개요
  const aiW = q("#ai .w");
  page([clone(q(".kicker", aiW)), clone($("aiHead")), clone($("aiLead")), clone($("tablist"))], "ai");
  // 탭마다 배경, 구현, 결과를 쪽에 나눈다. 쪽 수가 내용 길이에 따라 흔들리지 않도록 구조로만 정한다.
  // 도식이 있는 단계는 이미 도식이 있는 쪽에 합치지 않고, 규칙 전후 흐름도(.sh)는 쪽을 혼자 쓴다.
  const HEAVY = ".rf,.tk,.ly,.sh,.cap,.sf";
  qa("#tview .tp-in").forEach(tin => {
    const head = q(".tp-k", tin), groups = [];
    let cur = null;
    // 분량 점수: 단계 0.5, 도식 하나 2, 근거 상자 하나 1. 한 쪽에 4.5까지 담는다.
    const weight = ph => 0.5 + qa(HEAVY, ph).length * 2 + qa(".ev", ph).filter(e => !q(HEAVY, e)).length;
    qa(".ph", tin).forEach(ph => {
      const w = weight(ph), solo = !!q(".sh", ph);
      if (!cur || solo || cur.solo || cur.w + w > 4.5) { cur = { list: [], w: 0, solo: false }; groups.push(cur); }
      cur.list.push(ph); cur.w += w; cur.solo = cur.solo || solo;
    });
    // 쪽 안에서는 단계마다 글을 왼쪽, 도식과 근거 상자를 오른쪽에 둔다.
    const split = ph => {
      const c = clone(ph), h = q(".ph-h", c), L = wrap("div", "ph-l", []), R = wrap("div", "ph-r", []);
      [...c.children].filter(x => x !== h).forEach(x => (x.matches(HEAVY) || q(HEAVY, x) ? R : L).appendChild(x));
      if (!R.children.length) { [...L.children].forEach(x => c.appendChild(x)); return c; }
      c.classList.add("two"); c.appendChild(wrap("div", "ph-cols", [L, R])); return c;
    };
    groups.forEach(g => page([kick("AI 활용"), wrap("div", "st", [clone(head), ...g.list.map(split)])], "ai"));
  });
  // 14–16 플레이테스트
  const t = q("#tests .w"), tk = [...t.children];
  const h3s = qa("h3", t).filter(h => h.parentElement === t);
  const idx = el => tk.indexOf(el);
  page(tk.slice(0, idx(h3s[0])).map(clone));
  page([kick("플레이테스트"), ...tk.slice(idx(h3s[0]), idx(h3s[1])).map(clone)]);
  page([kick("플레이테스트"), ...tk.slice(idx(h3s[1])).map(clone)]);
  // 17 기획 가치관
  page([...q("#values .w").children].map(clone));
  // 시스템: 쪽마다 두 개
  const cards = qa("#car .sc");
  for (let i = 0; i < cards.length; i += 2) page([i === 0 ? clone(q("#systems .car-h > div")) : kick("시스템 기획"), wrap("div", "sys", cards.slice(i, i + 2).map(clone))]);
  // 마지막 담당 범위
  page([...q("#scope .w").children].map(clone));

  const total = pages.length;
  const holder = document.createElement("div");
  holder.className = "pages";
  pages.forEach((p, i) => {
    const a = document.createElement("article");
    a.className = "pg" + (p.cls ? " " + p.cls : "") + (p.cover ? " cover" : "");
    if (p.cover) {
      a.appendChild(wrap("div", "shade", []));
    }
    const z = wrap("div", "pg-z", p.nodes);
    qa("[id]", z).forEach(e => e.removeAttribute("id"));
    a.appendChild(wrap("div", "pg-in", [z]));
    const f = document.createElement("footer");
    f.innerHTML = `<span>CURTAINCALL · 모호성 게임 기획 포트폴리오</span><a href="https://mohodu.github.io/curtaincall/">mohodu.github.io/curtaincall</a><b>${String(i + 1).padStart(2, "0")} / ${total}</b>`;
    a.appendChild(f);
    holder.appendChild(a);
  });
  qa("body > nav, body > header, body > main, body > footer").forEach(n => { n.style.display = "none"; qa("article", n).forEach(x => { const d = document.createElement("div"); d.className = x.className; while (x.firstChild) d.appendChild(x.firstChild); x.replaceWith(d); }); });
  document.body.appendChild(holder);
  // 두 열로 나눈 단계는 근거 상자를 더 짧은 열 아래에 붙여 높이를 맞춘다. 쪽 수는 바뀌지 않는다.
  qa(".ph.two", holder).forEach(ph => {
    const L = q(".ph-l", ph), R = q(".ph-r", ph);
    const evs = [...L.children, ...R.children].filter(x => x.matches(".ev") && !q(HEAVY, x));
    evs.forEach(x => x.remove());
    evs.forEach(x => (L.offsetHeight <= R.offsetHeight ? L : R).appendChild(x));
  });

  // 쪽마다 높이와 너비가 넘치면 축소한다.
  const fit = () => qa(".pg:not(.cover)", holder).forEach(a => {
    const box = q(".pg-in", a), z = q(".pg-z", a);
    z.style.zoom = 1;
    const availH = box.clientHeight || (H - PAD_TOP - FOOT - 8), availW = W - PAD_X * 2;
    for (let n = 0; n < 6; n++) {
      const zr = z.getBoundingClientRect(), all = qa("*", z).map(e => e.getBoundingClientRect()).filter(r => r.height > 0);
      const h = Math.max(zr.height, ...all.map(r => r.bottom - zr.top)), w = Math.max(zr.width, ...all.map(r => r.right - zr.left));
      const k = Math.min((availH - 6) / h, availW / w);
      if (k >= 1) break;
      z.style.zoom = Math.floor((parseFloat(z.style.zoom) || 1) * k * 1000) / 1000;
    }
  });
  fit();
  document.fonts && document.fonts.ready.then(fit);
  addEventListener("load", () => { fit(); setTimeout(fit, 300); });
})();
