/* site-chrome.js — header + footer compartilhados do pitchdeck.com.br
 * Injeta o mesmo menu (Nossos Serviços · Hubs · Insights · Vitrine + CTA) e o footer
 * completo em qualquer página. CSS próprio, prefixado "pdc-", pra não conflitar.
 * Uso: <script src="/site-chrome.js" defer></script> antes de </body>.
 * Mega-menus puxam do Airtable (mesmo PAT read-only da home).
 */
(function () {
  if (window.__pdcChromeLoaded) return;
  window.__pdcChromeLoaded = true;

  var WA = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413";
  var WA_FULL = "https://wa.me/552131960982?text=Oi!%20Quero%20a%20an%C3%A1lise%20gratuita%20do%20meu%20pitch%20deck.%20%5BREF%3A%20site-header%5D";
  function svgWA(cls){ return '<svg class="'+cls+'" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="'+WA+'"/></svg>'; }
  function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* ---------- CSS ---------- */
  var css = `
  :root{--pdc-bg:#f5f1ea;--pdc-elev:#fff;--pdc-card:#faf7f1;--pdc-deep:#ede4d4;--pdc-border:#d9d2c4;--pdc-border-strong:#a89e88;--pdc-text:#1a1a1a;--pdc-muted:#5a5550;--pdc-faint:#8a8580;--pdc-accent:#0f4c3a;--pdc-accent-deep:#0a3528;--pdc-accent-soft:rgba(15,76,58,.08);--pdc-accent-border:rgba(15,76,58,.2);--pdc-d:"Fraunces","Times New Roman",serif;--pdc-b:"DM Sans",system-ui,sans-serif;--pdc-m:"IBM Plex Mono","Courier New",monospace;}
  .pdc-header,.pdc-header *,.pdc-mobile,.pdc-mobile *,.pdc-footer,.pdc-footer *{box-sizing:border-box}
  .pdc-header a,.pdc-mobile a,.pdc-footer a{text-decoration:none}
  .pdc-cta,.pdc-cta:visited{color:#fff}
  .pdc-container{max-width:1180px;margin:0 auto;padding:0 24px}
  @media(min-width:768px){.pdc-container{padding:0 48px}}

  .pdc-header{position:sticky;top:0;z-index:50;background:rgba(245,241,234,.85);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--pdc-border);font-family:var(--pdc-b)}
  .pdc-inner{display:flex;align-items:center;justify-content:space-between;padding:16px 0}
  .pdc-brand{display:flex;align-items:baseline;gap:10px}
  .pdc-brand-name{font-family:var(--pdc-d);font-size:25px;font-weight:400;letter-spacing:-.02em;color:var(--pdc-text)}
  .pdc-brand-name em{font-style:italic;color:var(--pdc-accent)}
  .pdc-brand-by{font-family:var(--pdc-m);font-size:11px;color:var(--pdc-faint);letter-spacing:.06em;white-space:nowrap}
  @media(max-width:560px){.pdc-brand-by{display:none}}
  .pdc-nav{display:none;align-items:center;gap:22px}
  @media(min-width:980px){.pdc-nav{display:flex}}
  .pdc-link{font-size:13px;color:var(--pdc-muted);white-space:nowrap}
  .pdc-link:hover{color:var(--pdc-text)}
  .pdc-link.acc{color:var(--pdc-accent);font-weight:500}
  .pdc-sep{width:1px;height:20px;background:var(--pdc-border)}
  .pdc-hubwrap{position:relative}
  .pdc-hub{display:inline-flex;align-items:center;gap:5px}
  .pdc-chev{font-size:9px;transition:transform .2s}
  .pdc-hubwrap:hover .pdc-chev,.pdc-hubwrap:focus-within .pdc-chev{transform:rotate(180deg)}
  .pdc-megamenu{position:absolute;top:calc(100% + 16px);left:0;width:min(560px,calc(100vw - 48px));background:var(--pdc-elev);border:1px solid var(--pdc-border);border-radius:16px;box-shadow:0 24px 60px -20px rgba(15,76,58,.25);padding:22px;opacity:0;visibility:hidden;transform:translateY(-6px);transition:opacity .2s,transform .2s,visibility .2s;z-index:60}
  .pdc-megamenu::before{content:"";position:absolute;top:-18px;left:0;right:0;height:18px}
  .pdc-hubwrap:hover .pdc-megamenu,.pdc-hubwrap:focus-within .pdc-megamenu{opacity:1;visibility:visible;transform:translateY(0)}
  .pdc-mm-eye{font-family:var(--pdc-m);font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--pdc-accent)}
  .pdc-mm-title{font-family:var(--pdc-d);font-size:18px;line-height:1.25;letter-spacing:-.01em;margin:6px 0 16px}
  .pdc-mm-title em{font-style:italic;color:var(--pdc-accent)}
  .pdc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  @media(max-width:900px){.pdc-grid{grid-template-columns:1fr}}
  .pdc-card{display:flex;gap:12px;align-items:flex-start;padding:14px;border:1px solid var(--pdc-border);border-radius:12px;background:var(--pdc-card);transition:border-color .2s,transform .2s}
  .pdc-card.active:hover{border-color:var(--pdc-accent-border);transform:translateY(-2px)}
  .pdc-card.soon{opacity:.72}
  .pdc-mark{width:36px;height:36px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-family:var(--pdc-d);font-weight:600;font-size:20px;color:#fff;flex-shrink:0}
  .pdc-mark.pd{background:var(--pdc-accent)}
  .pdc-mark.fc{background:#3E6FD6}
  .pdc-mark.soon{background:var(--pdc-deep);color:var(--pdc-faint);border:1px dashed var(--pdc-border-strong);font-family:var(--pdc-b);font-weight:500}
  .pdc-cbody{display:flex;flex-direction:column}
  .pdc-cname{font-weight:600;font-size:14px;display:flex;align-items:center;gap:8px;margin-bottom:3px;color:var(--pdc-text)}
  .pdc-cdesc{font-size:12px;color:var(--pdc-muted);line-height:1.45}
  .pdc-pill{font-family:var(--pdc-m);font-size:9px;letter-spacing:.08em;text-transform:uppercase;padding:2px 7px;border-radius:999px;white-space:nowrap}
  .pdc-pill.live{background:var(--pdc-accent-soft);color:var(--pdc-accent);border:1px solid var(--pdc-accent-border)}
  .pdc-pill.soon{background:var(--pdc-deep);color:var(--pdc-faint)}
  .pdc-mm-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:16px;padding-top:14px;border-top:1px solid var(--pdc-border);font-size:13px;color:var(--pdc-muted)}
  .pdc-mm-cta{font-weight:600;color:var(--pdc-accent);white-space:nowrap}
  .pdc-cta{display:inline-flex;align-items:center;gap:8px;padding:10px 18px;background:var(--pdc-accent);color:#fff;border-radius:999px;font-size:13px;font-weight:600;transition:all .25s ease;white-space:nowrap}
  .pdc-cta:hover{background:var(--pdc-accent-deep);transform:translateY(-1px)}
  .pdc-wa-sm{width:15px;height:15px}
  .pdc-ham{display:flex;flex-direction:column;gap:5px;width:26px;height:20px;justify-content:center;background:none;border:none;cursor:pointer;padding:0}
  @media(min-width:980px){.pdc-ham{display:none}}
  .pdc-ham span{display:block;height:2px;width:100%;background:var(--pdc-text);border-radius:2px;transition:transform .25s,opacity .25s}
  .pdc-ham.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
  .pdc-ham.open span:nth-child(2){opacity:0}
  .pdc-ham.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
  .pdc-mobile{position:fixed;inset:0;top:0;background:var(--pdc-bg);z-index:40;display:none;flex-direction:column;gap:6px;padding:90px 28px 28px}
  .pdc-mobile.open{display:flex}
  .pdc-mobile a{font-family:var(--pdc-d);font-size:24px;color:var(--pdc-text);padding:10px 0;border-bottom:1px solid var(--pdc-border)}
  .pdc-mobile a.cta{margin-top:14px;background:var(--pdc-accent);color:#fff;border-radius:999px;font-family:var(--pdc-b);font-size:15px;font-weight:600;text-align:center;border:none;padding:14px}

  .pdc-footer{font-family:var(--pdc-b);padding:48px 0 40px;border-top:1px solid var(--pdc-border);background:var(--pdc-bg);color:var(--pdc-text)}
  .pdc-finner{display:flex;flex-direction:column;gap:20px;align-items:center;text-align:center}
  @media(min-width:768px){.pdc-finner{flex-direction:row;justify-content:space-between;text-align:left}}
  .pdc-fbrand{font-family:var(--pdc-d);font-size:20px;display:flex;align-items:center;flex-wrap:wrap;gap:0}
  .pdc-fbrand em{font-style:italic;color:var(--pdc-accent)}
  .pdc-fby{display:inline-flex;align-items:center;gap:9px;margin-left:14px}
  .pdc-fby .by{color:var(--pdc-faint);font-family:var(--pdc-m);font-size:11px;letter-spacing:.05em}
  .pdc-fby img{height:26px;width:auto;display:block;object-fit:contain}
  .pdc-fmeta{font-family:var(--pdc-m);font-size:12px;color:var(--pdc-faint);letter-spacing:.05em}
  .pdc-fmeta a{color:var(--pdc-muted)}
  .pdc-fmeta a:hover{color:var(--pdc-accent)}
  .pdc-fnav{display:flex;gap:4px;flex-wrap:wrap;align-items:center;justify-content:center;margin-top:20px;padding-top:20px;border-top:1px solid var(--pdc-border)}
  .pdc-fnav a{font-size:12px;color:var(--pdc-faint);padding:4px 8px;border-radius:5px}
  .pdc-fnav a:hover{color:var(--pdc-muted)}
  .pdc-fnav a.rank{color:var(--pdc-accent);font-weight:500}
  .pdc-flegal{margin-top:28px;padding-top:24px;border-top:1px solid var(--pdc-border);display:flex;flex-direction:column;gap:6px;align-items:center;text-align:center}
  @media(min-width:768px){.pdc-flegal{align-items:flex-start;text-align:left}}
  .pdc-fline{font-family:var(--pdc-m);font-size:11px;color:var(--pdc-faint);letter-spacing:.04em;line-height:1.6}
  .pdc-fline strong{color:var(--pdc-muted)}
  .pdc-mm-group{display:block;font-family:var(--pdc-m);font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#0F4C3A;margin-bottom:10px}
  .pdc-grid[data-pdc="ai-agents"]{grid-template-columns:1.15fr 1fr;gap:22px}
  @media(max-width:900px){.pdc-grid[data-pdc="ai-agents"]{grid-template-columns:1fr}}
  .pdc-col-inv{border-left:1px solid var(--pdc-border);padding-left:22px}
  @media(max-width:900px){.pdc-col-inv{border-left:0;padding-left:0;border-top:1px solid var(--pdc-border);padding-top:14px}}
  .pdc-svc-row{display:flex;justify-content:space-between;align-items:baseline;gap:10px;padding:7px 8px;margin:0 -8px;border-radius:8px;text-decoration:none}
  a.pdc-svc-row:hover{background:rgba(15,76,58,.08)}
  .pdc-svc-name{font-size:13.5px;font-weight:600;color:var(--pdc-text,#1a1a1a)}
  .pdc-svc-chip{font-size:10.5px;color:var(--pdc-muted);background:rgba(15,76,58,.07);padding:2px 9px;border-radius:999px;white-space:nowrap}
  .pdc-svc-item{display:block;padding:7px 8px;margin:0 -8px;border-radius:8px;text-decoration:none}
  a.pdc-svc-item:hover{background:rgba(15,76,58,.08)}
  .pdc-svc-desc{display:block;font-size:12px;color:var(--pdc-muted);line-height:1.45;margin-top:2px}
  .pdc-mm-note{display:block;font-size:11.5px;color:#0F4C3A;margin-top:10px}
  .pdc-grid[data-pdc="hubs"]{grid-template-columns:1.15fr 1fr;gap:22px}
  @media(max-width:900px){.pdc-grid[data-pdc="hubs"]{grid-template-columns:1fr}}
  .pdc-macc-t{display:flex;align-items:center;justify-content:space-between;width:100%;background:none;border:0;border-bottom:1px solid var(--pdc-border);font-family:var(--pdc-d);font-size:24px;color:var(--pdc-text);padding:10px 0;cursor:pointer;text-align:left}
  .pdc-macc-chev{font-size:13px;color:var(--pdc-muted);transition:transform .2s}
  .pdc-macc-t[aria-expanded="true"] .pdc-macc-chev{transform:rotate(180deg)}
  .pdc-macc{display:none;padding:6px 0 12px;border-bottom:1px solid var(--pdc-border)}
  .pdc-macc.open{display:block}
  .pdc-mobile .pdc-macc a{font-family:var(--pdc-b);font-size:15px;border-bottom:0;padding:8px 0}
  .pdc-macc .pdc-mm-group{margin:10px 0 4px}
  .pdc-macc .pdc-svc-row{margin:0;padding:8px 0}
  .pdc-mobile .pdc-macc a.pdc-macc-all{display:inline-block;margin-top:8px;font-weight:600;font-size:14px;color:#0F4C3A}
  `;

  /* ---------- HEADER ---------- */
  var headerHTML =
  '<header class="pdc-header"><div class="pdc-container"><div class="pdc-inner">'
  + '<a href="/" class="pdc-brand"><span class="pdc-brand-name"><em>Pitch</em>Deck</span><span class="pdc-brand-by">by Equity Rio</span></a>'
  + '<nav class="pdc-nav" aria-label="Navegação principal">'
    + '<div class="pdc-hubwrap"><a href="/servicos" class="pdc-link pdc-hub">Serviços <span class="pdc-chev" aria-hidden="true">▾</span></a>'
      + '<div class="pdc-megamenu" role="menu">'
        + '<div class="pdc-grid" data-pdc="ai-agents"></div>'
        + '<div class="pdc-mm-foot"><span>Serviços entregues por agentes de IA proprietários — envie o documento, receba o resultado.</span><a class="pdc-mm-cta" href="https://wa.me/552131960982?text=Oi!%20Quero%20saber%20mais%20sobre%20os%20servi%C3%A7os%20do%20PitchDeck.%20%5BREF%3A%20servicos-menu%5D" target="_blank" rel="noopener">Falar com a equipe →</a></div>'
      + '</div></div>'
    + '<div class="pdc-hubwrap"><a href="/b2b" class="pdc-link pdc-hub">B2B <span class="pdc-chev" aria-hidden="true">▾</span></a>'
      + '<div class="pdc-megamenu" role="menu">'
        + '<div class="pdc-grid" data-pdc="hubs"></div>'
        + '<div class="pdc-mm-foot"><span>Tem uma comunidade de founders ou recebe dealflow?</span><a class="pdc-mm-cta" href="https://wa.me/552131960982?text=Oi!%20Tenho%20uma%20comunidade%20de%20founders%20e%20quero%20oferecer%20o%20PitchDeck%20como%20benef%C3%ADcio%20aos%20membros.%20%5BREF%3A%20hubs-parceiro%5D" target="_blank" rel="noopener">Seja um hub parceiro →</a></div>'
      + '</div></div>'
    + '<a href="/insights" class="pdc-link">Insights</a>'
    + '<div class="pdc-sep" aria-hidden="true"></div>'
    + '<a href="/vitrine" class="pdc-link acc">↑ Vitrine</a>'
  + '</nav>'
  + '<a href="'+WA_FULL+'" target="_blank" rel="noopener" class="pdc-cta">'+svgWA('pdc-wa-sm')+' Rodar análise grátis <span aria-hidden="true">→</span></a>'
  + '<button class="pdc-ham" id="pdcHam" aria-label="Abrir menu"><span></span><span></span><span></span></button>'
  + '</div></div></header>'
  + '<div class="pdc-mobile" id="pdcMobile">'
    + '<button class="pdc-macc-t" id="pdcSvcT" aria-expanded="false" aria-controls="pdcSvcP">Serviços <span class="pdc-macc-chev" aria-hidden="true">▾</span></button>'
    + '<div class="pdc-macc" id="pdcSvcP" data-pdc="ai-agents-mobile"><a class="pdc-macc-all" href="/servicos">Ver todos os serviços →</a></div>'
    + '<button class="pdc-macc-t" id="pdcHubT" aria-expanded="false" aria-controls="pdcHubP">B2B <span class="pdc-macc-chev" aria-hidden="true">▾</span></button>'
    + '<div class="pdc-macc" id="pdcHubP" data-pdc="hubs-mobile"><a class="pdc-macc-all" href="/b2b">Conhecer a Plataforma B2B →</a></div>'
    + '<a href="/insights">Insights</a><a href="/vitrine">↑ Vitrine</a>'
    + '<a href="'+WA_FULL+'" target="_blank" rel="noopener" class="cta">Rodar análise grátis →</a>'
  + '</div>';

  /* ---------- FOOTER ---------- */
  var footerHTML =
  '<footer class="pdc-footer"><div class="pdc-container">'
  + '<div class="pdc-finner">'
    + '<div class="pdc-fbrand"><em>Pitch</em>Deck<span class="pdc-fby"><span class="by">by</span><img src="/logos/equityrio-horizontal.png" alt="Equity Rio Investimentos" loading="lazy"></span></div>'
    + '<div class="pdc-fmeta"><a href="mailto:contato@pitchdeck.com.br">contato@pitchdeck.com.br</a> &nbsp;·&nbsp; <a href="https://wa.me/552131960982" target="_blank" rel="noopener">+55 21 3196-0982</a> &nbsp;·&nbsp; Construído no Rio de Janeiro 🇧🇷</div>'
  + '</div>'
  + '<nav class="pdc-fnav" aria-label="Links do rodapé"><a href="/insights">Insights</a><a href="/vitrine" class="rank">↑ Vitrine</a><a href="/termos">Termos de Uso</a><a href="/privacidade">Privacidade</a></nav>'
  + '<div class="pdc-flegal">'
    + '<p class="pdc-fline">Serviço operado por <strong>NVESTOR TECNOLOGIA E INFORMACAO LTDA</strong></p>'
    + '<p class="pdc-fline">CNPJ 34.821.742/0001-08 · Atividade: Tecnologia e Informação</p>'
    + '<p class="pdc-fline">© 2026 PitchDeck. Todos os direitos reservados.</p>'
  + '</div></div></footer>';

  /* ---------- inject ---------- */
  function init(){
    // remove header/footer/nav antigos da subpágina ANTES de injetar o nosso
    document.querySelectorAll('header, footer, nav, .mobile-menu, .navbar').forEach(function(el){ el.remove(); });
    var style = document.createElement('style'); style.id='pdc-style'; style.textContent=css; document.head.appendChild(style);
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // mobile toggle
    var ham=document.getElementById('pdcHam'), mob=document.getElementById('pdcMobile');
    if(ham&&mob){ ham.addEventListener('click',function(){ var o=mob.classList.toggle('open'); ham.classList.toggle('open',o); document.body.style.overflow=o?'hidden':''; });
      mob.addEventListener('click',function(e){ if(e.target.closest('a')){mob.classList.remove('open');ham.classList.remove('open');document.body.style.overflow='';} });
      var st=document.getElementById('pdcSvcT'), sp=document.getElementById('pdcSvcP');
      if(st&&sp) st.addEventListener('click',function(){ var o=sp.classList.toggle('open'); st.setAttribute('aria-expanded',o?'true':'false'); });
      var ht=document.getElementById('pdcHubT'), hp=document.getElementById('pdcHubP');
      if(ht&&hp) ht.addEventListener('click',function(){ var o=hp.classList.toggle('open'); ht.setAttribute('aria-expanded',o?'true':'false'); }); }

    loadMenus();
  }

  /* ---------- Airtable (mega-menus) ---------- */
  function loadMenus(){
    var PAT = ['pat831OZTAzZnxizk','500705ddf6979c001b5607c7bc33642de7f195fa2696fbdb1e16b2b6e1191e42'].join('.');
    var BASE='appTfnY53iCS1DK4F';
    function load(table, cb){
      var url='https://api.airtable.com/v0/'+BASE+'/'+encodeURIComponent(table)+'?pageSize=100&sort%5B0%5D%5Bfield%5D=Ordem&sort%5B0%5D%5Bdirection%5D=asc';
      fetch(url,{headers:{Authorization:'Bearer '+PAT}}).then(function(r){return r.ok?r.json():Promise.reject(r.status);})
        .then(function(d){cb((d.records||[]).map(function(r){return r.fields;}));}).catch(function(){});
    }
    // AI Agents — 2 colunas por Perfil
    var ag=document.querySelector('.pdc-grid[data-pdc="ai-agents"]');
    var agm=document.querySelector('.pdc-macc[data-pdc="ai-agents-mobile"]');
    if(ag||agm) load('AI Agents',function(rows){
      rows=rows.filter(function(f){return f.Status==='No ar'||f.Status==='Em breve';}); if(!rows.length) return;
      function pill(a){return a.Status==='Em breve'?' <span class="pdc-pill soon">Em breve</span>':'';}
      function urlOf(a){return a['URL']||(a.Slug?'/servicos/'+a.Slug:'');}
      function rowE(a){
        var inner='<span class="pdc-svc-name">'+esc(a.Nome)+pill(a)+'</span>'+(a.Segmento?'<span class="pdc-svc-chip">'+esc(a.Segmento)+'</span>':'');
        var u=urlOf(a);
        return u?'<a class="pdc-svc-row" href="'+esc(u)+'" role="menuitem">'+inner+'</a>':'<span class="pdc-svc-row" role="menuitem" aria-disabled="true">'+inner+'</span>';
      }
      function itemI(a){
        var inner='<span class="pdc-svc-name">'+esc(a.Nome)+pill(a)+'</span><span class="pdc-svc-desc">'+esc(a['Descrição curta']||'')+'</span>';
        var u=urlOf(a);
        return u?'<a class="pdc-svc-item" href="'+esc(u)+'" role="menuitem">'+inner+'</a>':'<span class="pdc-svc-item" role="menuitem" aria-disabled="true">'+inner+'</span>';
      }
      var emp=rows.filter(function(f){return f.Perfil!=='Investidores';});
      var inv=rows.filter(function(f){return f.Perfil==='Investidores';});
      if(ag) ag.innerHTML='<div><span class="pdc-mm-group">Para quem empreende</span>'+emp.map(rowE).join('')+'</div>'
        +'<div class="pdc-col-inv"><span class="pdc-mm-group">Para quem investe</span>'+inv.map(itemI).join('')
        +'<span class="pdc-mm-note">Acesso para family offices, private banking e boutiques parceiras</span></div>';
      if(agm) agm.innerHTML='<span class="pdc-mm-group">Para quem empreende</span>'+emp.map(rowE).join('')
        +'<span class="pdc-mm-group">Para quem investe</span>'+inv.map(rowE).join('')
        +'<a class="pdc-macc-all" href="/servicos">Ver todos os serviços →</a>';
    });
    // Hubs — 2 colunas por Categoria
    var hb=document.querySelector('.pdc-grid[data-pdc="hubs"]');
    var hbm=document.querySelector('.pdc-macc[data-pdc="hubs-mobile"]');
    if(hb||hbm) load('Hubs',function(rows){
      rows=rows.filter(function(f){return f.Status==='No ar'||f.Status==='Em breve';}); if(!rows.length) return;
      var CAPITAL={'Rede de anjos':1,'Gestora de VC':1,'CVC (corporate venture)':1,'Gestora de PE & growth':1,'Family office & MFO':1,'Plataforma de crowdfunding':1,'Escritório & private banking':1,'Boutique de M&A':1,'Open innovation & scale-up':1,'Gestoras VC · CVC · PE':1,'Redes de anjos':1,'Open innovation & scale-ups':1};
      function rowH(h){
        var chip=h['Stat destaque']||h['Tipo de Hub']||h.Segmento||'';
        var pill=h.Status==='No ar'?' <span class="pdc-pill live">No ar</span>':' <span class="pdc-pill soon">Em breve</span>';
        var inner='<span class="pdc-svc-name">'+esc(h.Nome)+pill+'</span>'+(chip?'<span class="pdc-svc-chip">'+esc(chip)+'</span>':'');
        var u=h.Status==='No ar'?(h['URL hub']||('https://pitchdeck.com.br/hubs/'+(h.Slug||''))):'';
        return u?'<a class="pdc-svc-row" href="'+esc(u)+'" role="menuitem">'+inner+'</a>':'<span class="pdc-svc-row" role="menuitem" aria-disabled="true">'+inner+'</span>';
      }
      var com=rows.filter(function(f){return !CAPITAL[f['Tipo de Hub']];});
      var cap=rows.filter(function(f){return CAPITAL[f['Tipo de Hub']];});
      if(hb) hb.innerHTML='<div><span class="pdc-mm-group">Ecossistemas, comunidades & aceleração</span>'+com.map(rowH).join('')+'</div>'
        +'<div class="pdc-col-inv"><span class="pdc-mm-group">Capital & corporates</span>'+cap.map(rowH).join('')
        +'<span class="pdc-mm-note">Casas de capital acessam também os serviços buy-side — triagem e dossiê</span></div>';
      if(hbm) hbm.innerHTML='<span class="pdc-mm-group">Ecossistemas, comunidades & aceleração</span>'+com.map(rowH).join('')
        +'<span class="pdc-mm-group">Capital & corporates</span>'+cap.map(rowH).join('')
        +'<a class="pdc-macc-all" href="/b2b">Conhecer a Plataforma B2B →</a>';
    });
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',init); else init();
})();
