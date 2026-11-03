(function () {
  'use strict';

  // Add hotel objects here: { name, type, area, description, image, url }
  var HOTELS = [
    { name: '9Queens Hotel', type: 'Ξενοδοχείο' },
    { name: 'Hotel 40 Πλατάνια', type: 'Ξενοδοχείο' },
    { name: 'Hotel Άδωνης', type: 'Ξενοδοχείο' },
    { name: 'Hotel Αιδηψός', type: 'Ξενοδοχείο' },
    { name: 'Hotel Ακταίον', type: 'Ξενοδοχείο' },
    { name: 'Hotel Ανεμώνη', type: 'Ξενοδοχείο' }
  ];

  var CONTACT_EMAIL = 'VisitEdipsos@Gmail.com';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  // Header
  var header = document.querySelector('.site-header');
  var menu = document.getElementById('menu');
  var toggle = document.getElementById('menuToggle');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  toggle.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Scroll reveal
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (n) { io.observe(n); });
  } else {
    items.forEach(function (n) { n.classList.add('in'); });
  }

  // Hotels directory
  var grid = document.getElementById('hotelGrid');
  if (grid) {
    HOTELS.forEach(function (h) {
      var card = el('article', 'hotel' + (h.image ? '' : ' no-img'));
      if (h.image) {
        var img = el('img');
        img.src = h.image;
        img.alt = h.name;
        img.loading = 'lazy';
        card.appendChild(img);
      }
      var body = el('div', 'hotel-body');
      body.appendChild(el('span', 'tag', h.type || 'Ξενοδοχείο'));
      body.appendChild(el('h3', null, h.name));
      if (h.area) body.appendChild(el('p', null, h.area));
      if (h.description) body.appendChild(el('p', null, h.description));
      if (h.url) {
        var a = el('a', 'link-arrow', 'Περισσότερα');
        a.href = h.url;
        a.target = '_blank';
        a.rel = 'noopener';
        body.appendChild(a);
      }
      card.appendChild(body);
      grid.appendChild(card);
    });
  }

  // Lightbox
  var lb = document.getElementById('lightbox');
  if (lb) {
    var lbImg = document.getElementById('lbImg');
    var closeLb = function () { lb.hidden = true; lbImg.removeAttribute('src'); };
    document.querySelectorAll('[data-full]').forEach(function (b) {
      b.addEventListener('click', function () {
        lbImg.src = b.dataset.full;
        lbImg.alt = b.querySelector('img').alt;
        lb.hidden = false;
      });
    });
    lb.addEventListener('click', closeLb);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
  }

  // Contact form opens the visitor's mail client
  var form = document.getElementById('contactForm');
  if (form) {
    var note = document.getElementById('formNote');
    var topic = new URLSearchParams(window.location.search).get('topic');
    if (topic === 'listing' && form.elements.subject) form.elements.subject.value = 'Καταχώρηση επιχείρησης';
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        note.textContent = 'Συμπληρώστε όλα τα υποχρεωτικά πεδία με έγκυρα στοιχεία.';
        return;
      }
      var d = new FormData(form);
      var subject = (d.get('subject') || 'Επικοινωνία από το site') + ' - ' + d.get('name');
      var body = d.get('message') + '\n\n' + d.get('name') + '\n' + d.get('email') + (d.get('phone') ? '\n' + d.get('phone') : '');
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      note.textContent = 'Άνοιγμα της εφαρμογής email σας...';
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
