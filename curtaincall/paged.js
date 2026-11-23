// ?print=1 로 열면 같은 원고를 1120×752 쪽으로 나눠 PDF와 쪽 보기 화면에 쓴다.
// 쪽 구성은 고정이고, 쪽마다 내용이 넘치면 축소해 맞춘다.
(function(){
  if (!/[?&]print=1\b/.test(location.search)) return;
  const W = 1120, H = 752, PAD_X = 56, PAD_TOP = 40, FOOT = 46;
  const $ = s => document.getElementById(s), q = (s, r = document) => r.querySelector(s), qa = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  root.dataset.theme = "light";
  root.classList.add("paged");
  // 인쇄할 때 Chrome은 1120px 쪽을 840px 폭으로 보고 반응형 규칙을 다시 적용한다.
  // 화면 폭 조건 규칙을 데스크톱(1200px) 기준으로 고정해 쪽 보기와 PDF가 같은 배치를 쓰게 한다.
  const DESK = 1200;
  const widthOk = t => (t.match(/\((?:max|min)-width:\s*\d+px\)/g) || []).every(c => { const n = +c.match(/\d+/)[0]; return c.includes("max") ? DESK <= n : DESK >= n; });
  const freeze = list => { for (let i = list.cssRules.length - 1; i >= 0; i--) { const r = list.cssRules[i]; if (r.cssRules && !(r instanceof CSSMediaRule)) freeze(r); if (!(r instanceof CSSMediaRule) || !/width/.test(r.conditionText)) continue; const keep = widthOk(r.conditionText) ? [...r.cssRules].map(x => x.cssText) : []; list.deleteRule(i); keep.reverse().forEach(t => list.insertRule(t, i)); } };
  [...document.styleSheets].forEach(s => { try { freeze(s); } catch (e) {} });
  const v = q(".hero video"); if (v) { v.pause(); v.removeAttribute("src"); v.load(); v.remove(); }

  // 일정 패널은 둘째 날을 펼친 상태로 고정한다.
  const dayBtn = qa("#days button")[1]; if (dayBtn) dayBtn.click();
  qa("#cview details").forEach(d => d.open = true);

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
.pg .bs-bar .post{transform:none}
.pg .case-t{margin-bottom:18px}
.pg .ba{grid-template-columns:1fr 1fr;cursor:default}
.pg .ba-poster{opacity:1!important}
.pg .compare-tools{display:none}
.pg .cf .bs{grid-template-columns:1fr}
.pg .connection-scenes{margin-top:12px}
.pg .cf{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.4fr);column-gap:34px;border-left:0;padding-left:0;margin-top:8px;align-items:start}
.pg .case-results{display:block;margin-top:28px}
.pg .case-results .bs{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}
.pg .case-results .cf-s{margin-bottom:22px}
.pg .cf-s{grid-column:1;padding-bottom:18px}
.pg .cf-s::before{display:none}
.pg .cf-design{grid-column:2;grid-row:1}
.pg .cf-l{grid-column:1;grid-row:1}
.pg .cf-design details{display:none}
.pg .pf-pg{margin-top:12px;max-width:none}
.pg .pf-pg>p{max-width:52em;margin:0 0 12px;font-size:16px;line-height:1.65}
.pg .pf-pg .pf{max-width:none;margin:0 0 16px}
.pg .pf-pg .pf-st{grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.pg .pf-pg .pf-st>li+li::before{content:"→";left:-6px;top:9px;font-size:13px}
.pg .cf-design .pf{padding:14px;gap:8px}
.pg .cf-design .pf-rows>li{padding:0 0 12px 34px}
.pg .cf-design .pf-rows>li:last-child{padding-bottom:0}
.pg .cf-design .pf-step{margin-bottom:6px;font-size:12px;min-height:22px}
.pg .cf-design .pf-step b{font-size:13px}
.pg .cf-design .pf-step i{width:22px;height:22px;font-size:12px}
.pg .cf-design .pf-rows>li::before{left:10px;top:26px}
.pg .cf-design .pf-rows>li::after{left:5px}
.pg .cf-design .pf-shots{gap:8px}
.pg .cf-design .pf-shots,.pg .cf-design .pf-shots.n2,.pg .cf-design .pf-shots.n1{grid-template-columns:repeat(3,minmax(0,1fr))}
.pg .cf-design .pf figcaption{font-size:11.5px;margin-top:4px}
.pg .beat{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.4fr);column-gap:34px;align-items:start}
.pg .beat-h{grid-column:1/-1}
.pg .beat .cf-s{grid-column:1}
.pg .beat .cf-design{grid-column:2;grid-row:2/span 2}
.pg .beat-1{display:block}
.pg .beat-1 .cf-s{padding-bottom:16px}
.pg .beat-1 .cf-s p{max-width:none}
.pg .beat-results .bs{grid-template-columns:repeat(3,minmax(0,1fr))}
.pg .beat-results{margin-top:24px}
.pg .beat-results p{max-width:48em}
.pg .beat-2 p{font-size:16px;line-height:1.65}
.pg .beat-2 .df{padding:14px}
.pg .beat-2 .pov{gap:8px}
.pg .beat-2 .st5{gap:4px}
.pg .beat-2 .st5 li{padding:8px 6px}
.pg .beat-bridge{margin:0 0 14px}
.pg .cf-emo .emo{font-size:26px}
.pg .oth-h{margin:36px 0 12px}
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
/* 3쪽 공연·대기실·탈출 카드: 같은 폭과 같은 사진 높이, 사진은 자르지 않고 담는다. */
.pg .loop{grid-template-columns:repeat(3,minmax(0,1fr))!important}
.pg .loop .lp-m{aspect-ratio:16/9!important}
.pg .loop .lp-m img{object-fit:contain!important}
.pg .test-grid .test-shot button{height:220px;display:flex;align-items:center;justify-content:center;background:#fff}
.pg .test-grid .test-shot img{width:auto!important;max-width:100%;max-height:100%;height:auto}
/* AI 탭 진행 표시 */
.pg .ai-top{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #302F52}
.pg .ai-top .kicker{margin:0}
.pg .tabbar{list-style:none;margin:0;padding:0;display:flex;gap:6px}
.pg .tabbar li{display:flex;align-items:center;gap:6px;padding:4px 11px 4px 5px;border-radius:999px;font-size:12px;font-weight:700;color:#8F8EB5;background:#26254A;white-space:nowrap}
.pg .tabbar li i{font-style:normal;font-size:10.5px;padding:1px 6px;border-radius:999px;background:#35345C;color:#C9C8E6}
.pg .tabbar li.on{background:var(--spot);color:#1B1A33}
.pg .tabbar li.on i{background:#1B1A33;color:#fff}
.pg .tab-first>.tp-k{margin-bottom:22px}
.pg .tab-first>.tp-k b{font-size:28px;line-height:1.3}
.pg .tab-no{font-family:"Hahmlet",serif;font-weight:800;font-size:28px;line-height:1.3;color:#5B5A86;margin-right:4px}
/* 사례 단계 쪽: 위쪽 제목·단계 표시, 아래 본문 */
.pg .step-top{display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:26px;padding-bottom:14px;border-bottom:1px solid var(--line)}
.pg .step-tt .case-k{margin:0 0 8px}
.pg .step-tt .beat-h{margin:0}
.pg .step-case{font-family:"Hahmlet",serif;font-weight:700;font-size:22px;line-height:1.35;margin:0;max-width:30em;white-space:normal}
.pg .step-case br{display:none}
.pg .steps{list-style:none;margin:0;padding:0;display:flex;align-items:center;gap:22px;flex:none}
.pg .steps li{position:relative;display:flex;align-items:center;gap:7px;padding:5px 14px 5px 6px;border-radius:999px;font-size:14px;font-weight:700;color:var(--muted);background:color-mix(in srgb,var(--muted) 12%,transparent)}
.pg .steps li+li::before{content:"→";position:absolute;left:-17px;color:var(--muted);font-weight:400}
.pg .steps li i{font-style:normal;width:21px;height:21px;border-radius:50%;display:grid;place-items:center;font-size:11.5px;background:var(--card);color:var(--muted)}
.pg .steps li.on{background:var(--accent);color:#fff}
.pg .steps li.on i{background:#fff;color:var(--accent)}
.pg .step-b{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:44px;align-items:start}
.pg .step-b>:only-child,.pg .step-b>.beat-bridge{grid-column:1/-1}
.pg .step-b .cf-s{padding:0}
.pg .step-b .cf-s::before{display:none}
.pg .sp .cf-emo{margin-bottom:30px}
.pg .sp .emo{font-size:30px;line-height:1.45}
.pg .sp .sp-text p:not(.emo){font-size:19px;line-height:1.85;max-width:40em}
.pg .sp-fig figure{margin:0}
.pg .sp-fig img{width:100%}
.pg .sd{grid-template-columns:minmax(0,.7fr) minmax(0,1.5fr);gap:40px}
.pg .sd-text p{font-size:17px;line-height:1.85;max-width:none}
.pg .sd-text p+p{margin-top:14px}
.pg .sd-text .prob-fig{margin:18px 0 0;max-width:none}
.pg .sd-fig>*{margin:0;max-width:none}
.pg .sd-fig>*+*{margin-top:18px}
.pg .sr{display:block}
.pg .sr .cf-s+.cf-s{margin-top:28px}
.pg .sr p{font-size:19px;line-height:1.85;max-width:44em}
.pg .sr p+p{margin-top:14px}
.pg .sr .bs{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:16px;margin-top:30px;max-width:none}
.pg .sr .bs-i{padding:20px 22px 22px}
.pg .sr.sr-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:44px;align-items:start}
.pg .sr-two .bs{grid-template-columns:1fr!important;gap:10px;margin-top:22px}
.pg .sr-two .bs-i{padding:12px 18px 14px;gap:4px}
.pg .ba-one{display:block;margin:0}
.pg .ba-one figure{margin:0}
.pg .sd-fig>.pf-flow{max-width:520px}
.pg .sr-two .prob-fig{margin:0;max-width:none}
.pg .sp .sp-text,.pg .sr-text{padding-top:4px}
/* 사례 상세 쪽 공통 형식 */
.pg .cf-design>.prob-fig{max-width:400px}
.pg .cf-l .prob-fig{max-width:360px}
.pg .cf-design>.df{max-width:760px}
.pg .cf+.cf{margin-top:26px}
.pg .beat-h+.cf{margin-top:14px}
.pg .cf-l>.cf-s{padding-bottom:20px}
.pg .cf-l .cf-beat-result p,.pg .cf-l .cf-s p{max-width:none}
.pg .cf-l .bs{grid-template-columns:1fr!important;gap:8px;margin-top:12px}
.pg .cf-l .bs-i{padding:10px 16px 12px;gap:4px}
.pg .cf-design>figure{margin-top:14px}
.pg .cf-design>p+p{margin-top:10px}
.pg .pf-st{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:12px 18px}
.pg .pf-st>li::before{display:none}
.pg .pf-st>li+li::before{content:"→";display:block;position:absolute;left:-9px;top:6px;transform:translateX(-50%);color:var(--muted);font-size:13px}
/* PDF 전용 묶음 배치: 한 흐름의 문제·설계·결과를 같은 쪽에 둔다. */
.pg .ph-merge{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:28px;align-items:start}
.pg .ph-merge .ph{margin:0}
.pg .ph-merge .ph-l>.ph+.ph{margin-top:22px}
.pg .fig-res{display:grid;grid-template-columns:minmax(0,1.75fr) minmax(0,1fr);gap:26px;align-items:start}
.pg .fig-res>figure{margin:0}
.pg .fig-res>figure{grid-column:1;grid-row:1}
.pg .fig-res .cf-beat-result{padding:0;grid-column:2;grid-row:1}
.pg .fig-res .cf-beat-result p{max-width:none}
.pg .fig-res .bs{grid-template-columns:1fr!important;gap:8px;margin-top:12px}
.pg .fig-res .bs-i{padding:10px 16px 12px;gap:4px}
.pg .cf-l .case-res{margin-top:22px}
.pg .cf-l .case-res .cf-s{padding-bottom:0}
.pg .pf-pg+.case-results{margin-top:20px}
.pg .test-log{margin:10px 0 0}
.pg .test-shot.test-one{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:36px;align-items:center;max-width:none;margin:0}
.pg .test-one img{aspect-ratio:auto!important;object-fit:contain!important;height:auto;max-height:none!important}
.pg .test-one figcaption{font-size:16px}
.pg .test-one figcaption b{font-size:20px;margin-bottom:10px}
.pg .test-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px 30px;margin-top:4px}
.pg .test-grid .test-shot{gap:8px}
.pg .test-grid figcaption{font-size:13.5px;line-height:1.6}
.pg .test-grid figcaption b{font-size:15px;margin-bottom:2px}
.pg .test-grid+.test-reading,.pg .test-grid+*+.test-reading{margin:18px 0 0;padding:14px 0 0;border-bottom:0}
.pg .test-reading h3{margin-bottom:8px}
.pg .test-reading p{line-height:1.7}
`;
  document.head.appendChild(style);

  const pages = [];
  const page = (nodes, cls = "") => pages.push({ nodes: [].concat(nodes).filter(Boolean), cls });
  const clone = n => { if (!n) return null; let c = n.cloneNode(true); if (c.tagName === "ARTICLE") { const d = document.createElement("div"); d.className = c.className; d.innerHTML = c.innerHTML; c = d; } qa("video", c).forEach(v => { if (q(".ba-poster", v.parentElement) || q(":scope > img", v.parentElement) || !v.getAttribute("poster")) { v.remove(); return; } const i = document.createElement("img"); i.src = v.getAttribute("poster"); i.alt = ""; v.replaceWith(i); }); qa("article", c).forEach(x => { const d = document.createElement("div"); d.className = x.className; d.innerHTML = x.innerHTML; x.replaceWith(d); }); qa("img", c).forEach(i => i.loading = "eager"); return c; };
  const wrap = (tag, cls, kids) => { const d = document.createElement(tag); if (cls) d.className = cls; kids.filter(Boolean).forEach(k => d.appendChild(k)); return d; };
  const kick = (text) => { const p = document.createElement("p"); p.className = "kicker"; p.textContent = text; return p; };

  // 1 표지
  const hero = q(".hero .w");
  pages.push({ cover: true, nodes: [clone(q("h1", hero)), clone($("tagline")), clone($("facts"))] });
  // 2 게임 개요와 기획 의도
  const about = q("#about .w");
  page([clone(q(".kicker", about)), clone(q("h2", about)), clone($("summary")), clone(q(".intent", about))]);
  // 3 공연과 일정
  page([kick(q(".kicker", about) ? q(".kicker", about).textContent : "게임 개요"), clone($("loop")), clone(q("#about .scale:not(.intent .scale)")) || kick("전체 일정"), clone($("daywrap")), clone($("dayNote")), clone($("dayFoot"))]);
  // 4 AI 활용 개요
  const aiW = q("#ai .w");
  page([clone(q(".kicker", aiW)), clone($("aiHead")), clone($("aiLead")), clone($("tablist"))], "ai");
  // 탭마다 배경, 구현, 결과를 쪽에 나눈다. 쪽 수가 내용 길이에 따라 흔들리지 않도록 구조로만 정한다.
  // 도식이 있는 단계는 이미 도식이 있는 쪽에 합치지 않고, 규칙 전후 흐름도(.sh)는 쪽을 혼자 쓴다.
  const HEAVY = ".rf,.tk,.ly,.sh,.cap,.sf", BOX = ".ev,.voices,blockquote";
  const tabNames = qa("#tview .tp-in").map(t => (q(".tp-k b", t) || {}).textContent || "");
  // AI 활용 쪽 상단: 탭 네 개 중 지금 탭을 강조해 탭이 넘어가는 지점을 보이게 한다.
  const tabTop = ti => {
    const bar = document.createElement("ol"); bar.className = "tabbar";
    tabNames.forEach((t, k) => { const li = document.createElement("li"); li.innerHTML = `<i>${String(k + 1).padStart(2, "0")}</i>${t}`; if (k === ti) li.className = "on"; bar.appendChild(li); });
    return wrap("div", "ai-top", [kick("AI 활용"), bar]);
  };
  qa("#tview .tp-in").forEach((tin, ti) => {
    const head = q(".tp-k", tin), groups = [];
    // 탭의 첫 쪽은 탭 번호와 이름을 크게 보여 준다.
    let firstPage = true;
    const stWrap = kids => {
      const d = wrap("div", "st" + (firstPage ? " tab-first" : ""), kids);
      if (firstPage) { const n = document.createElement("span"); n.className = "tab-no"; n.textContent = String(ti + 1).padStart(2, "0"); const k = q(".tp-k", d); if (k) k.prepend(n); }
      firstPage = false; return d;
    };
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
      const heavy = x => x.matches(HEAVY) || !!q(HEAVY, x), box = x => x.matches(BOX);
      const kids = [...c.children].filter(x => x !== h), hasHeavy = kids.some(heavy);
      // 도식이 있으면 도식을, 없으면 근거 상자·인용을 오른쪽에 둔다. 모든 단계가 '글 왼쪽 / 시각 자료 오른쪽' 형식을 따른다.
      kids.forEach(x => (hasHeavy ? heavy(x) : box(x)) ? R.appendChild(x) : L.appendChild(x));
      if (!R.children.length || !L.children.length) { [...L.children, ...R.children].forEach(x => c.appendChild(x)); return c; }
      c.classList.add("two"); c.appendChild(wrap("div", "ph-cols", [L, R])); return c;
    };
    // 도식 없는 짧은 배경 단계 뒤에 흐름도 단계가 오면, 배경과 구현 글을 왼쪽·흐름도를 오른쪽에 두어 한 쪽에 싣는다.
    const light = g => g.w <= 1.5 && !g.list.some(ph => q(HEAVY, ph));
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i], n = groups[i + 1];
      if (n && n.solo && n.list.length === 1 && light(g)) {
        const c = clone(n.list[0]), h = q(".ph-h", c), R = wrap("div", "ph-r", []);
        [...c.children].filter(x => x !== h && (x.matches(HEAVY) || q(HEAVY, x))).forEach(x => R.appendChild(x));
        const L = wrap("div", "ph-l", [...g.list.map(clone), c]);
        page([tabTop(ti), stWrap([clone(head), wrap("div", "ph-merge", [L, R])])], "ai");
        i++;
        continue;
      }
      page([tabTop(ti), stWrap([clone(head), ...g.list.map(split)])], "ai");
    }
  });
  // 기획 가치관과 시스템: 비교 장면 쪽과 설명 쪽을 분리하고 수치는 해당 문맥에만 둔다.
  const sws = qa("#systems > .w");
  // 핵심 재미와 핵심 플레이 루프, 루프가 끊긴 세 곳
  page([...sws[0].children].map(clone));
  qa("#cview .cp").forEach(cs => {
    const w = q(".cp-in", cs);
    const comparison = clone(q(".ba", w));
    comparison.removeAttribute("role"); comparison.removeAttribute("tabindex"); comparison.removeAttribute("aria-describedby"); comparison.removeAttribute("aria-pressed");
    page([clone(q(".case-k", w)), clone(q(".case-t", w)), comparison, clone(q(".comparison-note", w))]);
    // 사례 상세는 문제 → 설계 → 결과를 각각 한 쪽(설계는 도식마다 한 쪽)에 넓게 싣는다.
    // 쪽 위에는 사례·흐름 제목과 단계 표시를 두어 지금 어느 단계를 읽는지 알 수 있게 한다.
    const ck = () => clone(q(".case-k", w));
    const stepBar = act => {
      const d = document.createElement("ol"); d.className = "steps";
      ["문제", "설계", "결과"].forEach((t, k) => { const li = document.createElement("li"); li.innerHTML = `<i>${k + 1}</i>${t}`; li.className = k === act ? "on" : k < act ? "done" : ""; d.appendChild(li); });
      return d;
    };
    const stepPage = (title, act, cls, body) => page([wrap("div", "step-top", [wrap("div", "step-tt", [ck(), title]), stepBar(act)]), wrap("div", "step-b " + cls, body.filter(Boolean))]);
    const caseTitle = () => { const t = clone(q(".case-t", w)); t.className = "step-case"; return t; };
    const emo = q(".cf-emo", w);
    const probBody = (emoN, probN, before) => {
      const p = clone(probN), figs = qa("figure", p); figs.forEach(f => f.remove());
      const side = figs.length ? figs : before ? [before] : [];
      return [wrap("div", "sp-text", [emoN ? clone(emoN) : null, p].filter(Boolean)), side.length ? wrap("div", "sp-fig", side) : null];
    };
    const resBody = (nodes, after) => after ? [wrap("div", "sr-text", nodes.filter(Boolean)), wrap("div", "sp-fig", [after])] : nodes;
    // 문제 쪽에는 Before, 결과 쪽에는 After 장면을 근거로 붙인다(글만 있는 쪽이 비지 않게).
    const scene = sel => { const f = q(".ba " + sel, w); return f ? wrap("div", "ba ba-one", [clone(f)]) : null; };
    const isFig = n => n.matches(".df, .connection-scenes");
    const designBody = (tagN, nodes) => {
      const L = nodes.filter(n => !isFig(n)), R = nodes.filter(isFig);
      return [wrap("div", "sd-text", [tagN, ...L].filter(Boolean)), R.length ? wrap("div", "sd-fig", R) : null];
    };
    if (q(".cf-beats", w)) {
      const beats = qa(".beat", w);
      beats.forEach((b, i) => {
        const title = () => clone(q(".beat-h", b));
        const design = clone(q(".cf-design", b)), tag = q(".cf-tag", design);
        tag.remove();
        stepPage(title(), 0, "sp", [i ? clone(q(".beat-bridge", w)) : null, ...probBody(i ? null : emo, q(".cf-s:not(.cf-design):not(.cf-beat-result)", b), i ? null : scene(".ba-b"))]);
        // 설계에 딸린 구현 사진(.prob-fig)이 있으면 '구현 결과' 쪽의 근거로 옮기고, 없으면 사례의 After 장면을 쓴다.
        const shot = q(":scope > .prob-fig", design);
        if (shot) shot.remove();
        stepPage(title(), 1, "sd", designBody(tag, [...design.children]));
        const res = [clone(q(".cf-beat-result", b)), i === beats.length - 1 ? clone(q(".cf-next", w)) : null];
        const evidence = shot || (i ? null : scene(".ba-a"));
        stepPage(title(), 2, evidence ? "sr sr-two" : "sr", evidence ? resBody(res, evidence) : res);
      });
      return;
    }
    const sections = [...q(".cf", w).children];
    const design = q(".cf-design", w), tag = q(".cf-tag", design);
    const prob = sections.find(e => e.matches(".cf-s") && !e.matches(".cf-emo,.cf-design"));
    stepPage(caseTitle(), 0, "sp", probBody(emo, prob, scene(".ba-b")));
    const kids = [...design.children].filter(e => e.tagName !== "DETAILS" && e !== tag);
    // 문단별 도식이 있으면 문단과 그 도식을 한 쪽씩 싣는다.
    const chunks = [[]];
    if (q(".pf", design)) {
      kids.forEach(e => { chunks[chunks.length - 1].push(e); if (e.classList.contains("pf")) chunks.push([]); });
      const tail = chunks.pop();
      if (tail.length) chunks[chunks.length - 1].push(...tail);
    } else chunks[0].push(...kids);
    chunks.forEach((c, k) => stepPage(caseTitle(), 1, "sd", designBody(k ? null : clone(tag), c.map(clone))));
    stepPage(caseTitle(), 2, "sr sr-two", resBody(sections.slice(sections.indexOf(design) + 1).map(clone), scene(".ba-a")));
  });
  page([kick("시스템 기획"), ...[...sws[sws.length - 1].children].map(clone)]);
  // 동선 로그는 한 쪽, 설문 화면은 두 장씩 분리하고 기획 판단을 이어 싣는다.
  const testW = q("#tests .w"), shots = qa("#testEvidence .test-shot", testW);
  // 제목과 동선 로그를 한 쪽(맵은 자르지 않고 전체), 설문 네 장과 해석을 다음 한 쪽에 싣는다.
  const log = clone($("testLog")), logShot = log && q(".test-shot", log);
  if (logShot) logShot.classList.add("test-one");
  page([kick("테스트 결과를 통한 피드백"), clone($("testHead")), log]);
  page([kick("테스트 결과를 통한 피드백"), wrap("div", "test-grid", shots.map(clone)), clone(q(".test-source", testW)), clone($("testReading"))]);
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
    if (!q(HEAVY, R)) return;
    const evs = [...L.children, ...R.children].filter(x => x.matches(".ev") && !q(HEAVY, x));
    evs.forEach(x => x.remove());
    evs.forEach(x => (L.offsetHeight <= R.offsetHeight ? L : R).appendChild(x));
  });

  // 쪽마다 높이와 너비가 넘치면 축소한다.
  // PDF에서는 사진을 자르지 않는다. 고정 비율 상자에 cover로 잘리던 이미지는 원본 비율로 펼친다.
  const uncrop = () => qa(".pg:not(.cover) img", holder).forEach(img => {
    if (!img.naturalWidth || img.dataset.uncropped) return;
    const cs = getComputedStyle(img), r = img.getBoundingClientRect();
    if (cs.objectFit !== "cover" || !r.width || !r.height) return;
    const nr = img.naturalWidth / img.naturalHeight;
    if (Math.abs(nr / (r.width / r.height) - 1) < 0.03) return;
    img.dataset.uncropped = "1";
    img.style.objectFit = "contain";
    const ratio = `${img.naturalWidth} / ${img.naturalHeight}`;
    if (cs.position === "absolute") { const p = img.parentElement; p.style.aspectRatio = ratio; p.style.height = "auto"; p.style.minHeight = "0"; p.style.paddingTop = "0"; }
    else { img.style.aspectRatio = ratio; img.style.height = "auto"; }
  });
  // 넘치는 쪽은 축소하되, 축소한 만큼 내용 폭을 넓혀 오른쪽이 비지 않게 한다. 들어가는 가장 큰 배율을 찾는다.
  const fit = () => { uncrop(); qa(".pg:not(.cover)", holder).forEach(a => {
    const box = q(".pg-in", a), z = q(".pg-z", a);
    const availH = (box.clientHeight || (H - PAD_TOP - FOOT - 8)) - 6, availW = W - PAD_X * 2;
    const fits = (k, wd) => {
      z.style.zoom = k; z.style.width = wd + "px";
      const zr = z.getBoundingClientRect(), all = qa("*", z).map(e => e.getBoundingClientRect()).filter(r => r.height > 0);
      const h = Math.max(zr.height, ...all.map(r => r.bottom - zr.top)), w = Math.max(zr.width, ...all.map(r => r.right - zr.left));
      return h <= availH && w <= availW + 1;
    };
    if (fits(1, availW)) return;
    const best = wide => { let lo = 0.4, hi = 1; for (let n = 0; n < 9; n++) { const m = (lo + hi) / 2; if (fits(m, wide ? availW / m : availW)) lo = m; else hi = m; } return Math.floor(lo * 1000) / 1000; };
    const kw = best(true), kn = best(false), k = Math.max(kw, kn);
    // 고정 폭이 더 크게 들어가면 그 배율을 유지하면서 넓힐 수 있는 만큼만 넓힌다.
    let lo = availW, hi = availW / k;
    if (kw >= kn) lo = hi; else for (let n = 0; n < 8; n++) { const m = (lo + hi) / 2; if (fits(k, m)) lo = m; else hi = m; }
    fits(k, Math.floor(lo));
  }); };
  fit();
  document.fonts && document.fonts.ready.then(fit);
  addEventListener("load", () => { fit(); setTimeout(fit, 300); });
})();
