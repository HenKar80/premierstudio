/* Premier Studio FL — before/after preset slider
   Usage: <div class="pcmp" data-name="Day One"
             data-before="day-one/before-web.jpg" data-after="day-one/after-web.jpg"></div>
   Load compare.js after the markup. */
(function(){
  var ARROWS='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l-6 6 6 6M15 6l6 6-6 6"/></svg>';

  function build(el, before, after, name, pos){
    el.innerHTML =
      '<img src="'+before+'" alt="'+name+' preset, before" loading="lazy" decoding="async">' +
      '<img class="pcmp-after" src="'+after+'" alt="'+name+' preset, after" loading="lazy" decoding="async">' +
      '<div class="pcmp-line"><div class="pcmp-knob">'+ARROWS+'</div></div>' +
      '<span class="pcmp-tag b">Before</span><span class="pcmp-tag a">After</span>' +
      '<input type="range" min="0" max="100" step="0.5" value="'+pos+'" aria-label="Drag to compare before and after '+name+'">';
    el.style.setProperty('--pos', pos+'%');
    var r = el.querySelector('input');
    r.addEventListener('input', function(){ el.style.setProperty('--pos', r.value+'%'); });
    return r;
  }

  function setRatio(el){
    var i = el.querySelector('img');
    function apply(){ if(i.naturalWidth){ el.style.aspectRatio = i.naturalWidth+' / '+i.naturalHeight; el.dataset.w=i.naturalWidth; el.dataset.h=i.naturalHeight; } }
    if (i.complete) apply(); else i.addEventListener('load', apply);
  }

  document.querySelectorAll('.pcmp[data-before]').forEach(function(el){
    var name = el.dataset.name || 'After';
    build(el, el.dataset.before, el.dataset.after, name, 50);
    setRatio(el);
  });
})();
