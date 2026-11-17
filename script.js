(function () {
  var views = document.querySelectorAll('.view');
  var links = document.querySelectorAll('.menu a');
  var menu = document.getElementById('menu');
  var burger = document.getElementById('burger');
  var titles = { home: 'Home', services: 'Services', work: 'Work', about: 'About', contact: 'Contact' };

  function setMenu(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }

  // Hash router: shows one section at a time, no page reload
  function route() {
    var id = (location.hash || '#home').slice(1);
    if (!titles[id]) id = 'home';
    views.forEach(function (v) { v.classList.toggle('active', v.id === id); });
    links.forEach(function (a) {
      var on = a.getAttribute('href') === '#' + id;
      a.classList.toggle('active', on);
      if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
    document.title = titles[id] + ' | My Web Studio';
    setMenu(false);
    window.scrollTo(0, 0);
  }
  burger.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.navbar')) setMenu(false);
  });
  window.addEventListener('hashchange', route);
  route();

  // Demo contact form (nothing is sent anywhere)
  var msg = document.getElementById('formMsg');
  document.getElementById('contactForm').addEventListener('submit', function (e) {
    e.preventDefault();
    var n = document.getElementById('name').value.trim();
    var m = document.getElementById('email').value.trim();
    var t = document.getElementById('message').value.trim();
    if (!n || !/^\S+@\S+\.\S+$/.test(m) || !t) {
      msg.style.color = '#dc2626';
      msg.textContent = 'Enter your name, a valid email and a message.';
      return;
    }
    msg.style.color = '';
    msg.textContent = 'Thanks, ' + n + '. Your message is ready to send (demo only).';
    e.target.reset();
  });

  document.getElementById('year').textContent = new Date().getFullYear();
})();

// 3D features: draggable cube, swipeable ring carousel, card tilt
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var scene = document.getElementById('scene'), cube = document.getElementById('cube'), home = document.getElementById('home');
  var rx = -22, ry = 30, drag = false, lx = 0, ly = 0;
  function paint() { cube.style.transform = 'rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)'; }
  function end() { drag = false; scene.style.cursor = ''; }
  scene.addEventListener('pointerdown', function (e) {
    drag = true; lx = e.clientX; ly = e.clientY; scene.style.cursor = 'grabbing';
    try { scene.setPointerCapture(e.pointerId); } catch (x) {}
  });
  scene.addEventListener('pointermove', function (e) {
    if (!drag) return;
    ry += (e.clientX - lx) * 0.6;
    rx = Math.max(-80, Math.min(80, rx - (e.clientY - ly) * 0.6));
    lx = e.clientX; ly = e.clientY; paint();
  });
  scene.addEventListener('pointerup', end);
  scene.addEventListener('pointercancel', end);
  (function spin() {
    if (!drag && !reduce && home.classList.contains('active')) { ry += 0.3; paint(); }
    requestAnimationFrame(spin);
  })();

  var ring = document.getElementById('ring'), wrap = document.getElementById('ringWrap');
  var n = ring.children.length, idx = 0, sx = null;
  function go(d) { idx += d; ring.style.setProperty('--rot', (-idx * 360 / n) + 'deg'); }
  document.getElementById('prev').addEventListener('click', function () { go(-1); });
  document.getElementById('next').addEventListener('click', function () { go(1); });
  wrap.addEventListener('pointerdown', function (e) { sx = e.clientX; });
  wrap.addEventListener('pointerup', function (e) {
    if (sx !== null && Math.abs(e.clientX - sx) > 40) go(e.clientX < sx ? 1 : -1);
    sx = null;
  });

  document.querySelectorAll('.bento .card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse' || reduce) return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = 'perspective(700px) rotateX(' + (-py * 10) + 'deg) rotateY(' + (px * 10) + 'deg) translateZ(8px)';
    });
    card.addEventListener('pointerleave', function () { card.style.transform = ''; });
  });
})();