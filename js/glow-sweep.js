// Subtle glow sweep overlay with FPS cap; home page only; respects perf-lite and reduced motion
(function(){
  // Respect reduced motion
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;

  function isPerfLite(){
    return document.body.classList.contains('perf-lite');
  }

  function init(){
    if (isPerfLite()) return; // disabled in perf-lite

    // Create overlay container
    const overlay = document.createElement('div');
    overlay.id = 'glow-sweep-overlay';
    overlay.style.cssText = [
      'position:fixed',
      'top:0','left:0','width:100%','height:100%',
      'pointer-events:none',
      'z-index:1', // below main content z-index 2
      'overflow:hidden',
      'mix-blend-mode: screen',
      'opacity:0.06' // very subtle
    ].join(';');

    // Create moving band
    const band = document.createElement('div');
    band.id = 'glow-sweep-band';
    band.style.cssText = [
      'position:absolute','top:0','left:-20vw',
      'width:20vw','height:100%',
      'background:linear-gradient(90deg, rgba(0,255,65,0) 0%, rgba(0,255,65,0.6) 50%, rgba(0,255,65,0) 100%)',
      'filter: blur(12px)',
      'will-change: transform',
      'transform: translateX(0)'
    ].join(';');

    overlay.appendChild(band);
    document.body.appendChild(overlay);

    // Animation with FPS cap
    let last = 0;
    const fps = 12; // cap at 12fps
    const interval = 1000 / fps;
    let x = -20; // vw
    const speed = 0.5; // vw per frame
    let rafId;

    function tick(ts){
      if (isPerfLite()) { cancelAnimationFrame(rafId); return; }
      if (ts - last < interval) { rafId = requestAnimationFrame(tick); return; }
      last = ts;

      x += speed;
      if (x > 120) x = -20; // loop
      band.style.transform = 'translateX(' + x + 'vw)';
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    // Pause when hidden
    document.addEventListener('visibilitychange', function(){
      if (document.hidden) { cancelAnimationFrame(rafId); }
      else { last = 0; rafId = requestAnimationFrame(tick); }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

