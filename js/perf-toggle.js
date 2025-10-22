(function(){
  // Create floating toggle button
  const btn = document.createElement('button');
  btn.className = 'perf-toggle';
  btn.type = 'button';
  btn.textContent = '[ PERF: ON ]';
  document.addEventListener('DOMContentLoaded', init);

  function init(){
    document.body.appendChild(btn);
    // Restore state
    const saved = localStorage.getItem('perf-lite');
    if (saved === '1') enableLite();
  }

  function enableLite(){
    document.body.classList.add('perf-lite');
    localStorage.setItem('perf-lite','1');
    btn.textContent = '[ PERF: LITE ]';
  }
  function disableLite(){
    document.body.classList.remove('perf-lite');
    localStorage.setItem('perf-lite','0');
    btn.textContent = '[ PERF: ON ]';
  }

  btn.addEventListener('click', () => {
    if (document.body.classList.contains('perf-lite')){
      disableLite();
    } else {
      enableLite();
    }
  });
})();

