/* Premier Studio FL — before/after preset slider
   Usage: <div class="pcmp" data-name="Day One"
             data-before="day-one/before-web.jpg" data-after="day-one/after-web.jpg"
             data-before-full="day-one/before.jpg" data-after-full="day-one/after.jpg"></div>
   <script src="compare.js"></script> */
(function(){
  var ARROWS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6"/></svg>';
  var EXPAND='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';

  function build(el, before, after, name, pos){
    el.innerHTML =
      '<img src="'+before+'" alt="'+name+' preset, before">' +
      '<img class="pcmp-after" src="'+after+'" alt="'+name+' preset, after">' +
      '<div class="pcmp-line"><div class="pcmp-knob">'+ARROWS+'</div></div>' +
      '<span class="pcmp-tag b">Before</span><span class="pcmp-tag a">'+name+'</span>' +
      '<input type="range" min="0" max="100" step="0.5" value="'+pos+'" aria-label="Drag to compare before and after '+name+'">';
    el.style.setProperty('--pos', pos+'%');
    var r = el.querySelector('input');
    r.addEventListener('input', function(){ el.style.setProperty('--pos', r.value+'%'); });
    return r;
  }

  function setRatio(el, src){
    var i = new Image();
    i.onload = function(){ el.style.aspectRatio = i.naturalWidth+' / '+i.naturalHeight; el.dataset.w=i.naturalWidth; el.dataset.h=i.naturalHeight; };
    i.src = src;
  }

  function openFull(src){
    var name = src.dataset.name || 'After';
    var pos = src.querySelector('input').value;
    var ov = document.createElement('div');
    ov.className = 'pcmp-overlay';
    ov.setAttribute('role','dialog'); ov.setAttribute('aria-label', name+' full screen comparison');
    ov.innerHTML = '<button class="pcmp-close" aria-label="Close full screen">&times;</button><span class="pcmp-loading">Loading full resolution…</span>';
    var box = document.createElement('div'); box.className='pcmp';
    ov.appendChild(box); document.body.appendChild(ov);
    document.body.style.overflow='hidden';

    var bF = src.dataset.beforeFull || src.dataset.before, aF = src.dataset.afterFull || src.dataset.after;
    // size box to the photo's shape inside the screen
    function fit(){
      var w = +src.dataset.w || 4, h = +src.dataset.h || 5, vw = ov.clientWidth, vh = ov.clientHeight;
      var s = Math.min(vw/w, vh/h); box.style.width = (w*s)+'px'; box.style.height = (h*s)+'px';
    }
    fit(); window.addEventListener('resize', fit);
    var loaded = 0, pre = [bF, aF].map(function(u){ var i=new Image(); i.onload=i.onerror=function(){ if(++loaded===2){ var l=ov.querySelector('.pcmp-loading'); l&&l.remove(); build(box,bF,aF,name,pos).focus(); } }; i.src=u; return i; });

    function close(){
      window.removeEventListener('resize', fit); document.removeEventListener('keydown', key);
      if (document.fullscreenElement) document.exitFullscreen().catch(function(){});
      document.body.style.overflow=''; ov.remove(); src.querySelector('.pcmp-fs').focus();
    }
    function key(e){ if(e.key==='Escape') close(); }
    document.addEventListener('keydown', key);
    ov.querySelector('.pcmp-close').addEventListener('click', close);
    document.addEventListener('fullscreenchange', function f(){ if(!document.fullscreenElement && document.body.contains(ov)){ document.removeEventListener('fullscreenchange', f); close(); } });
    if (ov.requestFullscreen) ov.requestFullscreen().then(fit).catch(function(){});
  }

  document.querySelectorAll('.pcmp[data-before]').forEach(function(el){
    var name = el.dataset.name || 'After';
    build(el, el.dataset.before, el.dataset.after, name, 50);
    setRatio(el, el.dataset.before);
    var b = document.createElement('button');
    b.className='pcmp-fs'; b.type='button'; b.innerHTML=EXPAND; b.setAttribute('aria-label','View '+name+' full screen at full resolution');
    b.addEventListener('click', function(){ openFull(el); });
    el.appendChild(b);
  });
})();
