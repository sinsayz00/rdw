// 연구 주제 발표 (쉬운 버전) — 슬라이드 넘기기
(function () {
  const stage = document.getElementById('stage');
  const slides = Array.from(stage.querySelectorAll('.slide'));
  const counter = document.getElementById('counter');
  let current = 0;

  // 창 크기에 맞춰 1920×1080 무대 축소·확대
  function fit() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = 'scale(' + s + ')';
  }

  function show(i) {
    current = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach((el, n) => el.classList.toggle('active', n === current));
    counter.textContent = (current + 1) + ' / ' + slides.length;
    if (location.hash !== '#' + (current + 1)) history.replaceState(null, '', '#' + (current + 1));
  }

  function fromHash() {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isFinite(n) ? n - 1 : 0;
  }

  // 전체 화면: 브라우저마다 다른 이름(webkit)까지 처리
  const root = document.documentElement;
  const canFullscreen = !!(root.requestFullscreen || root.webkitRequestFullscreen);
  function isFullscreen() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }
  function toggleFullscreen() {
    if (!canFullscreen) return;
    if (!isFullscreen()) {
      const req = root.requestFullscreen || root.webkitRequestFullscreen;
      const r = req.call(root);
      if (r && r.catch) r.catch(() => {});
    } else {
      const exit = document.exitFullscreen || document.webkitExitFullscreen;
      if (exit) exit.call(document);
    }
  }
  document.addEventListener('fullscreenchange', fit);
  document.addEventListener('webkitfullscreenchange', fit);

  // 버튼을 누른 뒤 포커스를 바로 풀어서, Space 키가 버튼을 다시 누르지 않게 함
  function onClick(id, fn) {
    document.getElementById(id).addEventListener('click', (e) => { fn(); e.currentTarget.blur(); });
  }
  onClick('prev', () => show(current - 1));
  onClick('next', () => show(current + 1));
  onClick('fsBtn', toggleFullscreen);
  if (!canFullscreen) document.getElementById('fsBtn').hidden = true;

  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': show(current + 1); e.preventDefault(); break;
      case 'ArrowLeft': case 'PageUp': show(current - 1); e.preventDefault(); break;
      case 'Home': show(0); break;
      case 'End': show(slides.length - 1); break;
      case 'f': case 'F': toggleFullscreen(); break;
    }
  });

  // 휴대폰·태블릿: 좌우로 밀어서 넘기기
  let x0 = null;
  document.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    x0 = null;
  });

  window.addEventListener('resize', fit);
  window.addEventListener('hashchange', () => show(fromHash()));
  fit();
  show(fromHash());
})();
