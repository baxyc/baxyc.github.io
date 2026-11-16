/* Shared behaviour for all landing demos */
(function () {
  var root = document.documentElement;

  // Scroll progress bar
  var bar = document.querySelector('.progress');
  function onScroll() {
    var h = root.scrollHeight - root.clientHeight;
    if (bar) bar.style.width = (h > 0 ? (root.scrollTop / h) * 100 : 0) + '%';
    var nav = document.querySelector('.nav');
    if (nav) nav.classList.toggle('is-stuck', root.scrollTop > 8);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav
  var nav = document.querySelector('.nav');
  var burger = document.querySelector('.burger');
  if (burger && nav) {
    burger.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('.nav__links a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  // Reduced motion
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll
  var revs = document.querySelectorAll('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    revs.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revs.forEach(function (el) { io.observe(el); });
  }

  // Animated counters
  function runCount(el) {
    var target = parseFloat(el.getAttribute('data-count')) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var dur = 1400, start = null;
    if (reduce) { el.textContent = target + suffix; return; }
    function tick(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) { counters.forEach(runCount); }
    else {
      var co = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  // Forms -> success state
  document.querySelectorAll('form.form').forEach(function (f) {
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      f.classList.add('sent');
    });
  });

  // Year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
