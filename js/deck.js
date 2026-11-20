// 연구 주제 발표 (쉬운 버전) — 슬라이드 넘기기
(function () {
  const stage = document.getElementById('stage');
  const slides = Array.from(stage.querySelectorAll('.slide'));
  const counter = document.getElementById('counter');
  const notes = document.getElementById('notes');
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
    const aside = slides[current].querySelector('aside');
    notes.textContent = aside ? aside.textContent.trim() : '(노트 없음)';
    if (location.hash !== '#' + (current + 1)) history.replaceState(null, '', '#' + (current + 1));
  }

  function fromHash() {
    const n = parseInt(location.hash.slice(1), 10);
    return Number.isFinite(n) ? n - 1 : 0;
  }

  function toggleNotes() { notes.hidden = !notes.hidden; }
  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(() => {});
    else document.exitFullscreen();
  }

  document.getElementById('prev').addEventListener('click', () => show(current - 1));
  document.getElementById('next').addEventListener('click', () => show(current + 1));
  document.getElementById('notesBtn').addEventListener('click', toggleNotes);
  document.getElementById('fsBtn').addEventListener('click', toggleFullscreen);

  document.addEventListener('keydown', (e) => {
    if (e.target.closest && e.target.closest('button') && (e.key === ' ' || e.key === 'Enter')) return;
    switch (e.key) {
      case 'ArrowRight': case 'PageDown': case ' ': show(current + 1); e.preventDefault(); break;
      case 'ArrowLeft': case 'PageUp': show(current - 1); e.preventDefault(); break;
      case 'Home': show(0); break;
      case 'End': show(slides.length - 1); break;
      case 'n': case 'N': toggleNotes(); break;
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
