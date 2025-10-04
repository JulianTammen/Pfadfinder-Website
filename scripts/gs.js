// Slider mit Autoplay & Swipe (ohne Hover-Pause, Pfeile optional/ausgeblendet)
(function () {
  const init = () => {
    const sliders = document.querySelectorAll('.gs-slider');
    if (!sliders.length) return;

    sliders.forEach((root) => {
      const track = root.querySelector('.gs-slides');
      const slides = Array.from(root.querySelectorAll('.gs-slide'));
      if (!track || slides.length === 0) return;

      let index = 0;
      // Autoplay-Intervall (mind. 1s, sonst aus)
      const autoplayMsRaw = parseInt(root.dataset.autoplay || '0', 10);
      const autoplayMs = isNaN(autoplayMsRaw) ? 0 : Math.max(autoplayMsRaw, 1000);

      const apply = () => {
        track.style.transform = `translateX(-${index * 100}%)`;
      };
      const next = () => {
        index = (index + 1) % slides.length;
        apply();
      };
      const prev = () => {
        index = (index - 1 + slides.length) % slides.length;
        apply();
      };

      // Pfeile sind optional; falls im DOM vorhanden, funktionieren sie weiterhin
      const btnPrev = root.querySelector('.gs-nav.prev');
      const btnNext = root.querySelector('.gs-nav.next');
      btnPrev && btnPrev.addEventListener('click', prev);
      btnNext && btnNext.addEventListener('click', next);

      // Autoplay startet sofort und pausiert NICHT bei Hover
      let timer = null;
      if (autoplayMs) {
        timer = setInterval(next, autoplayMs);
      }

      // Swipe/Drag – pausiert während der Geste, danach weiter
      let startX = 0, deltaX = 0, dragging = false;

      const stopAutoplay = () => { if (timer) { clearInterval(timer); timer = null; } };
      const startAutoplay = () => { if (autoplayMs && !timer) timer = setInterval(next, autoplayMs); };

      const onStart = (x) => { dragging = true; startX = x; deltaX = 0; stopAutoplay(); };
      const onMove  = (x) => {
        if (!dragging) return;
        deltaX = x - startX;
        track.style.transform =
          `translateX(${-(index * 100) + (deltaX / root.clientWidth) * 100}%)`;
      };
      const onEnd   = () => {
        if (!dragging) return;
        dragging = false;
        const threshold = root.clientWidth * 0.15;
        if (deltaX > threshold) prev();
        else if (deltaX < -threshold) next();
        else apply();
        startAutoplay();
      };

      // Touch
      root.addEventListener('touchstart', (e) => onStart(e.touches[0].clientX), { passive: true });
      root.addEventListener('touchmove',  (e) => onMove(e.touches[0].clientX),  { passive: true });
      root.addEventListener('touchend', onEnd);

      // Pointer (Maus)
      root.addEventListener('pointerdown', (e) => { root.setPointerCapture(e.pointerId); onStart(e.clientX); });
      root.addEventListener('pointermove', (e) => onMove(e.clientX));
      root.addEventListener('pointerup', onEnd);
      root.addEventListener('pointercancel', onEnd);

      apply(); // initiale Position
    });
  };

  // Robust gegen fehlendes/defer
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
