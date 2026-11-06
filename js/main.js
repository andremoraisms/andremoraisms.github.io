(function(){
  var $ = function(s,r){return (r||document).querySelector(s)}, $$ = function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
  var state = window.SITE_DATA;
  var filter='all';
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = matchMedia('(pointer: fine)').matches;
  var G = window.gsap, ST = window.ScrollTrigger, FL = window.Flip, lenis = null, rotCall = null, mqTween = null;
  if(G){ try{ G.registerPlugin.apply(G,[ST,FL].filter(Boolean)); }catch(e){} }
  var anim = !!G && !reduce;

  var STATUS={live:['live','No ar'],beta:['beta','Beta'],dev:['dev','Em desenvolvimento'],proto:['proto','Protótipo'],pause:['pause','Pausado']};
  var CATS=[['all','Tudo'],['ia','Com IA'],['web','Web'],['outro','Outros']];
  var MONTHS=['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
  function safeUrl(u){u=String(u||'').trim();if(!u)return'';if(!/^https?:\/\//i.test(u))u='https://'+u;try{var x=new URL(u);return /^https?:$/.test(x.protocol)?x.href:''}catch(e){return''}}
  function host(u){try{return new URL(u).host.replace(/^www\./,'')}catch(e){return u}}
  function initials(n){return String(n||'?').trim().split(/\s+/).slice(0,2).map(function(w){return w[0]}).join('').toUpperCase()}
  function fmtDate(iso){if(!iso)return'';var d=new Date(iso);return d.getDate()+' '+MONTHS[d.getMonth()]+' '+d.getFullYear()}
  function words(){return String(state.profile.rotating||'').split(',').map(function(s){return s.trim()}).filter(Boolean)}
  function stacks(){var seen={},out=[];state.projects.forEach(function(p){String(p.stack||'').split(',').forEach(function(s){s=s.trim();if(s&&!seen[s.toLowerCase()]){seen[s.toLowerCase()]=1;out.push(s)}})});return out}
  var ARW='<svg class="arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"><path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  /* ================= página ================= */
  function renderPage(){
    var p=state.profile, w=words(), st=stacks();
    var aiCount=state.projects.filter(function(x){return x.ai}).length;
    var nameHtml=String(p.name||'').trim().split(/\s+/).map(function(word){
      return '<span class="w">'+Array.from(word).map(function(c){return '<span class="ch">'+esc(c)+'</span>'}).join('')+'</span>';
    }).join(' ');
    var links=state.links.filter(function(l){return safeUrl(l.url)}).map(function(l){var u=safeUrl(l.url);
      return '<li><a class="mag" href="'+esc(u)+'" target="_blank" rel="noopener">'+esc(l.label)+' <small>'+esc(host(u))+'</small>'+ARW+'</a></li>'}).join('');
    var ava=p.avatar?'<img class="ava" src="'+esc(p.avatar)+'" alt="Foto de '+esc(p.name)+'">':'<div class="ava" aria-hidden="true">'+esc(initials(p.name))+'</div>';
    var mq=st.length?st:['React','TypeScript','Firebase','IA'];
    var mqHtml=''; for(var k=0;k<2;k++){ mq.forEach(function(s){mqHtml+='<span class="mq-item"'+(k?' aria-hidden="true"':'')+'>'+esc(s)+'</span>'}) }
    if(mq.length<6){ mqHtml+=mqHtml; }
    var bioHtml=String(p.bio||'').split(/(\s+)/).map(function(t){return /^\s+$/.test(t)?t:'<span class="bw">'+esc(t)+'</span>'}).join('');

    var cards=state.projects.map(function(x,i){
      var s=STATUS[x.status]||STATUS.proto,u=safeUrl(x.url),r=safeUrl(x.repo);
      var match=filter==='all'||(filter==='ia'?x.ai:x.category===filter);
      var stk=String(x.stack||'').split(',').map(function(s){return s.trim()}).filter(Boolean).map(function(s){return '<span>'+esc(s)+'</span>'}).join('');
      var cover=x.image?'<img src="'+esc(x.image)+'" alt="" loading="lazy">':'<div class="gen" style="--c:var('+(i%2?'--accent-2':'--accent')+')"><span>'+esc(initials(x.title))+'</span></div>';
      return '<article class="card'+(x.featured?' feat':'')+(match?'':' is-out')+'" data-flip-id="'+esc(x.id)+'"><div class="card-in tilt">'
        +'<div class="cover">'+cover+'</div>'
        +'<div class="card-body"><div class="card-top"><span class="pill '+s[0]+'">'+s[1]+'</span><span>'+esc(x.year)+'</span></div>'
        +(x.ai?'<span class="ai-tag">✦ Feito com IA</span>':'')
        +'<h3>'+esc(x.title)+'</h3><p>'+esc(x.desc)+'</p>'
        +(stk?'<div class="stack">'+stk+'</div>':'')
        +((u||r)?'<div class="card-links">'+(u?'<a href="'+esc(u)+'" target="_blank" rel="noopener">Abrir projeto '+ARW+'</a>':'')+(r?'<a href="'+esc(r)+'" target="_blank" rel="noopener">Código '+ARW+'</a>':'')+'</div>':'')
        +'</div><span class="spot"></span></div></article>';
    }).join('');
    var anyVisible=state.projects.some(function(x){return filter==='all'||(filter==='ia'?x.ai:x.category===filter)});
    var ctaU=safeUrl(p.ctaUrl);

    $('#app').innerHTML=
      '<div class="progress" id="progress"></div>'+(fine&&anim?'<div class="cursor" id="cursor"></div>':'')
      +'<nav class="nav"><div class="in"><a class="logo" href="#top" data-go="top"><i></i>'+esc(initials(p.name))+'</a>'
      +'<div class="nav-links"><a href="#sobre" data-go="sobre">Sobre</a><a href="#projetos" data-go="projetos">Projetos</a><a href="#contato" data-go="contato">Contato</a></div>'
      +(p.status?'<span class="avail"><span class="pulse"></span>'+esc(p.status)+'</span>':'')+'</div></nav>'
      +'<header class="hero" id="top"><span class="blob a"></span><span class="blob b"></span><div class="in hero-grid">'
        +'<div class="hero-text"><p class="eyebrow h-in">Portfólio · '+new Date().getFullYear()+'</p>'
        +'<h1 class="name" aria-label="'+esc(p.name)+'">'+nameHtml+'</h1>'
        +(p.role?'<p class="role h-in">'+esc(p.role)+'</p>':'')
        +(w.length?'<p class="rotator h-in">Eu construo <span class="rot"><span class="rot-word" id="rot">'+esc(w[0])+'</span></span></p>':'')
        +'<div class="cta h-in"><a class="btn-main mag" href="#projetos" data-go="projetos">Ver projetos '+ARW+'</a><a class="btn-ghost mag" href="#contato" data-go="contato">Falar comigo</a></div>'
        +(links?'<ul class="hero-links h-in">'+links+'</ul>':'')+'</div>'
        +'<aside class="idcard" aria-label="Resumo"><div class="id-in tilt"><div class="id-top"><span>Dev · Front-end</span><span>'+esc(p.location)+'</span></div>'
        +'<div class="ava-wrap"><span class="ring" id="ring"></span>'+ava+'</div>'
        +'<p class="id-name">'+esc(p.name)+'</p><p class="id-loc">'+esc(p.status||'')+'</p>'
        +'<div class="stats"><div class="stat"><b data-count="'+state.projects.length+'">'+state.projects.length+'</b><span>Projetos</span></div>'
        +'<div class="stat"><b data-count="'+aiCount+'">'+aiCount+'</b><span>Com IA</span></div>'
        +'<div class="stat"><b data-count="'+st.length+'">'+st.length+'</b><span>Tecnologias</span></div></div>'
        +'<span class="shine"></span></div></aside>'
      +'</div></header>'
      +'<div class="marquee" aria-label="Tecnologias"><div class="mq-track" id="mq">'+mqHtml+'</div></div>'
      +(p.bio?'<section class="sec" id="sobre"><div class="in"><p class="kicker">Sobre</p><p class="bio" id="bio">'+bioHtml+'</p></div></section>':'')
      +'<section class="sec" id="projetos" style="padding-top:0"><div class="in"><div class="sec-head"><div><p class="kicker">Trabalho selecionado</p><h2 class="reveal">Projetos e invenções</h2></div>'
        +'<div class="filters" role="group" aria-label="Filtrar projetos"><span class="chip-bg" id="chip-bg"></span>'+CATS.map(function(c){return '<button class="chip" data-f="'+c[0]+'" aria-pressed="'+(filter===c[0])+'">'+c[1]+'</button>'}).join('')+'</div></div>'
        +'<div class="grid" id="grid">'+cards+'</div>'
        +'<div class="empty" id="empty"'+(anyVisible?' hidden':'')+'>Nenhum projeto nesta categoria ainda.</div>'
      +'</div></section>'
      +'<section class="sec contact" id="contato"><div class="in"><p class="kicker" style="justify-content:center">Contato</p>'
        +'<h2 class="reveal">Tem uma ideia? <em>Vamos construir.</em></h2>'
        +(p.email?'<div class="mail"><span>'+esc(p.email)+'</span><button id="copy-mail">Copiar</button></div>':'')
        +(ctaU?'<div class="cta"><a class="btn-main mag" href="'+esc(ctaU)+'" target="_blank" rel="noopener">'+esc(p.ctaLabel||'Falar comigo')+' '+ARW+'</a></div>':'')
      +'</div></section>'
      +'<footer><div class="in"><div class="foot-name" id="foot-name" aria-hidden="true">'+esc(p.name)+'</div><div class="foot-meta"><span>© '+new Date().getFullYear()+' '+esc(p.name)+'</span><span>'+(state.updatedAt?'Atualizado em '+fmtDate(state.updatedAt):'')+'</span></div></div></footer>';
    placeChipBg(false);
  }

  function placeChipBg(){
    var bg=$('#chip-bg'), on=$('.chip[aria-pressed="true"]'); if(!bg||!on) return;
    bg.style.width=on.offsetWidth+'px'; bg.style.transform='translateX('+(on.offsetLeft-5)+'px)';
  }

  /* ================= animações ================= */
  function killFx(){
    if(ST) ST.getAll().forEach(function(t){t.kill()});
    if(rotCall){rotCall.kill();rotCall=null}
    if(mqTween){mqTween.kill();mqTween=null}
  }

  function initFx(first){
    if(!anim){ return; }
    killFx();
    var tl=G.timeline({defaults:{ease:'expo.out'}});
    if(first){
      tl.from('.nav',{y:-30,opacity:0,duration:1})
        .from('.name .ch',{yPercent:115,rotate:6,duration:1.3,stagger:.035},'-=.7')
        .from('.h-in',{y:24,opacity:0,duration:1,stagger:.09},'-=1')
        .from('.id-in',{y:60,opacity:0,rotateX:-18,rotateY:12,duration:1.4},'-=1.1')
        .from('.blob',{scale:.4,opacity:0,duration:2},0);
      $$('[data-count]').forEach(function(el){var o={v:0},n=+el.dataset.count;
        tl.to(o,{v:n,duration:1.6,ease:'power2.out',onUpdate:function(){el.textContent=Math.round(o.v)}},.6)});
    }
    G.to('#ring',{rotate:360,duration:8,repeat:-1,ease:'none'});
    G.to('.blob.a',{x:-60,y:40,duration:9,repeat:-1,yoyo:true,ease:'sine.inOut'});
    G.to('.blob.b',{x:70,y:-30,duration:11,repeat:-1,yoyo:true,ease:'sine.inOut'});

    // palavra rotativa
    var w=words(), idx=0, rot=$('#rot');
    if(rot&&w.length>1){
      var next=function(){
        idx=(idx+1)%w.length;
        G.timeline().to(rot,{yPercent:-110,opacity:0,duration:.45,ease:'power3.in'})
          .add(function(){rot.textContent=w[idx]}).fromTo(rot,{yPercent:110,opacity:0},{yPercent:0,opacity:1,duration:.6,ease:'expo.out'});
        rotCall=G.delayedCall(2.6,next);
      };
      rotCall=G.delayedCall(2.8,next);
    }

    // marquee com velocidade reagindo à rolagem
    if($('#mq')){
      mqTween=G.to('#mq',{xPercent:-50,duration:28,ease:'none',repeat:-1});
      if(ST) ST.create({start:0,end:'max',onUpdate:function(s){
        var v=Math.min(Math.abs(s.getVelocity())/400,5);
        G.to(mqTween,{timeScale:(s.direction<0?-1:1)*(1+v),duration:.3,overwrite:true});
        G.to(mqTween,{timeScale:s.direction<0?-1:1,duration:1.2,delay:.3});
      }});
    }

    if(ST){
      G.to('#progress',{scaleX:1,ease:'none',scrollTrigger:{start:0,end:'max',scrub:.3}});
      G.to('.hero .blob',{yPercent:40,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
      G.to('.hero-text',{yPercent:-12,opacity:.35,ease:'none',scrollTrigger:{trigger:'.hero',start:'center top',end:'bottom top',scrub:true}});
      var bw=$$('#bio .bw');
      if(bw.length) G.fromTo(bw,{opacity:.28},{opacity:1,stagger:.06,ease:'none',scrollTrigger:{trigger:'#bio',start:'top 80%',end:'bottom 45%',scrub:true}});
      $$('.reveal').forEach(function(h){G.from(h,{y:50,opacity:.15,duration:1.2,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 88%',once:true}})});
      var cards=$$('.card:not(.is-out)');
      G.set(cards,{y:70,opacity:.15});
      ST.batch(cards,{start:'top 92%',once:true,onEnter:function(b){G.to(b,{y:0,opacity:1,duration:1.1,stagger:.12,ease:'expo.out'})}});
      G.fromTo('#foot-name',{xPercent:8},{xPercent:-6,ease:'none',scrollTrigger:{trigger:'footer',start:'top bottom',end:'bottom bottom',scrub:true}});
      G.from('#contato h2',{scale:.92,ease:'none',scrollTrigger:{trigger:'#contato',start:'top bottom',end:'center center',scrub:true}});
      ST.refresh();
    }
    if(fine) bindPointerFx();
  }

  function bindPointerFx(){
    $$('.tilt').forEach(function(el){
      var rx=G.quickTo(el,'rotationX',{duration:.6,ease:'power3'}), ry=G.quickTo(el,'rotationY',{duration:.6,ease:'power3'});
      var max=el.classList.contains('id-in')?10:5;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
        rx((.5-y)*max); ry((x-.5)*max); el.style.setProperty('--mx',x*100+'%'); el.style.setProperty('--my',y*100+'%');});
      el.addEventListener('pointerleave',function(){rx(0);ry(0)});
    });
    $$('.mag').forEach(function(el){
      var mx=G.quickTo(el,'x',{duration:.5,ease:'elastic.out(1,.4)'}), my=G.quickTo(el,'y',{duration:.5,ease:'elastic.out(1,.4)'});
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();mx((e.clientX-r.left-r.width/2)*.3);my((e.clientY-r.top-r.height/2)*.4)});
      el.addEventListener('pointerleave',function(){mx(0);my(0)});
    });
    var fn=$('#foot-name');
    if(fn){
      fn.addEventListener('pointermove',function(e){var r=fn.getBoundingClientRect();fn.style.setProperty('--mx',e.clientX-r.left+'px');fn.style.setProperty('--my',e.clientY-r.top+'px')});
      fn.addEventListener('pointerleave',function(){fn.style.removeProperty('--mx');fn.style.removeProperty('--my')});
    }
  }

  /* cursor + rolagem suave + fundo: configurados uma vez */
  var cx=null, cy=null, cursorHover=false;
  function setupGlobal(){
    if(!anim) return;
    if(window.Lenis){
      try{
        lenis=new window.Lenis({lerp:.09,smoothWheel:true});
        if(ST) lenis.on('scroll',ST.update);
        G.ticker.add(function(t){lenis.raf(t*1000)}); G.ticker.lagSmoothing(0);
      }catch(e){lenis=null}
    }
    if(fine){
      document.addEventListener('pointermove',function(e){
        var c=$('#cursor'); if(!c) return;
        if(!cx){cx=G.quickTo(c,'x',{duration:.35,ease:'power3'});cy=G.quickTo(c,'y',{duration:.35,ease:'power3'});G.set(c,{opacity:1})}
        cx(e.clientX); cy(e.clientY);
        var h=!!e.target.closest('a,button,.tilt');
        if(h!==cursorHover){cursorHover=h;G.to(c,{scale:h?1.8:1,duration:.3})}
      });
    }
  }

  function initCanvas(){
    var c=$('#bg'); if(!c||!c.getContext) return; var ctx=c.getContext('2d');
    var W,H,nodes=[],mouse={x:-9999,y:-9999},col={a:'245,181,68',f:'238,240,245'},frame=0;
    function rgb(v){v=v.trim();if(v[0]==='#'&&v.length===7){return parseInt(v.slice(1,3),16)+','+parseInt(v.slice(3,5),16)+','+parseInt(v.slice(5,7),16)}return null}
    function readCol(){var cs=getComputedStyle(document.documentElement);col.a=rgb(cs.getPropertyValue('--accent'))||col.a;col.f=rgb(cs.getPropertyValue('--fg'))||col.f}
    function size(){var d=Math.min(window.devicePixelRatio||1,2);W=innerWidth;H=innerHeight;c.width=W*d;c.height=H*d;c.style.width=W+'px';c.style.height=H+'px';ctx.setTransform(d,0,0,d,0,0);
      var n=Math.round(Math.min(85,W*H/15000));nodes=[];for(var i=0;i<n;i++)nodes.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.35,vy:(Math.random()-.5)*.35,r:Math.random()*1.4+.6})}
    function draw(){
      if(frame++%90===0) readCol();
      ctx.clearRect(0,0,W,H);
      for(var i=0;i<nodes.length;i++){var n=nodes[i];
        if(!reduce){n.x+=n.vx;n.y+=n.vy;if(n.x<0||n.x>W)n.vx*=-1;if(n.y<0||n.y>H)n.vy*=-1;
          var dx=mouse.x-n.x,dy=mouse.y-n.y,dd=dx*dx+dy*dy;if(dd<26000){n.x+=dx*.004;n.y+=dy*.004}}
        for(var j=i+1;j<nodes.length;j++){var m=nodes[j],ex=n.x-m.x,ey=n.y-m.y,d2=ex*ex+ey*ey;
          if(d2<15000){ctx.strokeStyle='rgba('+col.f+','+(0.11*(1-d2/15000))+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);ctx.stroke()}}
        var md=(mouse.x-n.x)*(mouse.x-n.x)+(mouse.y-n.y)*(mouse.y-n.y);
        if(md<30000){ctx.strokeStyle='rgba('+col.a+','+(0.45*(1-md/30000))+')';ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke()}
        ctx.fillStyle=md<30000?'rgba('+col.a+',.9)':'rgba('+col.f+',.35)';ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,6.283);ctx.fill();
      }
      if(!reduce&&!document.hidden) requestAnimationFrame(draw);
    }
    readCol(); size(); draw();
    addEventListener('resize',function(){size(); if(reduce) draw()});
    document.addEventListener('visibilitychange',function(){if(!document.hidden&&!reduce)requestAnimationFrame(draw)});
    if(fine) addEventListener('pointermove',function(e){mouse.x=e.clientX;mouse.y=e.clientY});
  }

  /* ================= interações da página ================= */
  function applyFilter(f){
    if(f===filter) return; filter=f;
    $$('.chip').forEach(function(b){b.setAttribute('aria-pressed',String(b.dataset.f===f))}); placeChipBg();
    var cards=$$('.card'), stateFlip=(anim&&FL)?FL.getState(cards):null;
    var any=false;
    state.projects.forEach(function(x){var el=$('.card[data-flip-id="'+CSS.escape(x.id)+'"]');if(!el)return;
      var m=f==='all'||(f==='ia'?x.ai:x.category===f); el.classList.toggle('is-out',!m); if(m)any=true;});
    $('#empty').hidden=any;
    if(stateFlip){
      FL.from(stateFlip,{duration:.7,ease:'power3.inOut',absolute:true,scale:true,
        onEnter:function(els){return G.fromTo(els,{opacity:0,scale:.85},{opacity:1,scale:1,y:0,duration:.6,ease:'expo.out'})},
        onLeave:function(els){return G.to(els,{opacity:0,scale:.85,duration:.4})},
        onComplete:function(){ST&&ST.refresh()}});
    }
  }

  $('#app').addEventListener('click',function(e){
    var f=e.target.closest('[data-f]'); if(f){applyFilter(f.dataset.f);return;}
    var go=e.target.closest('[data-go]'); if(go){e.preventDefault();var t=document.getElementById(go.dataset.go);if(!t)return;
      if(lenis) lenis.scrollTo(t,{offset:go.dataset.go==='top'?0:-70,duration:1.4}); else t.scrollIntoView({behavior:reduce?'auto':'smooth'}); return;}
    if(e.target.id==='copy-mail'){var b=e.target,txt=state.profile.email;
      var ok=function(){b.textContent='Copiado';setTimeout(function(){b.textContent='Copiar'},1600)};
      try{navigator.clipboard.writeText(txt).then(ok,function(){selMail()})}catch(err){selMail()}}
  });
  function selMail(){var s=$('.mail span');if(!s)return;var r=document.createRange();r.selectNodeContents(s);var sel=getSelection();sel.removeAllRanges();sel.addRange(r)}
  addEventListener('resize',function(){placeChipBg()});

  /* ================= início ================= */
  renderPage();
  setupGlobal();
  initCanvas();
  var started=false;
  function start(){if(started)return;started=true;initFx(true)}
  if(document.fonts&&document.fonts.ready){Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,800)})]).then(start)}else start();

})();
