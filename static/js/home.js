// Subtitle rotation — smooth crossfade
(function () {
  const roles = [
    'Security Engineer',
    'Penetration Tester',
    'Cloud Security',
    'Open Source Builder'
  ];
  let current = 0;
  const el = document.getElementById('subtitle-role');
  if (!el) return;

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  setInterval(function () {
    el.classList.add('fade-out');
    setTimeout(function () {
      current = (current + 1) % roles.length;
      el.textContent = roles[current];
      el.classList.remove('fade-out');
      el.classList.add('fade-in');
    }, 400);
  }, 3000);
})();

// Animated counters using IntersectionObserver
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    counters.forEach(function (counter) {
      counter.textContent = counter.getAttribute('data-count');
    });
    return;
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const duration = 1500;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      el.textContent = Math.round(eased * target);
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(function (counter) {
    counter.textContent = '0';
    observer.observe(counter);
  });
})();

// AOS initialization
(function () {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
      easing: 'ease-out-cubic'
    });
  }
})();
