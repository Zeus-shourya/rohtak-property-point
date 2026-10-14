/* ==========================================================================
   Rohtak Property Point — site behaviour. Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.RPP || {};
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var wa = function (text) { return CFG.waLink ? CFG.waLink(text) : '#'; };

  /* singular for the card tag, plural for the filter button */
  var CAT_LABEL  = { plots: 'Plot', houses: 'House', other: 'Property', floors: 'Independent Floor', kothis: 'Kothi', commercial: 'Commercial', rent: 'Rental' };
  var CAT_FILTER = { plots: 'Plots', houses: 'Houses', other: 'Other', floors: 'Floors', kothis: 'Kothis', commercial: 'Commercial', rent: 'Rent' };
  var CAT_ORDER  = ['plots', 'houses', 'floors', 'kothis', 'commercial', 'rent', 'other'];

  /* ---- 1. Contact links ------------------------------------------------- */
  function wireContact() {
    $$('[data-wa]').forEach(function (a) {
      a.href = wa(CFG.whatsappText);
      a.target = '_blank';
      a.rel = 'noopener';
    });
    /* links that open WhatsApp with their own opening line */
    $$('[data-wa-text]').forEach(function (a) {
      a.href = wa(a.getAttribute('data-wa-text'));
      a.target = '_blank';
      a.rel = 'noopener';
    });
    $$('.js-phone-href').forEach(function (a) { if (CFG.phoneHref) a.href = 'tel:' + CFG.phoneHref; });
    $$('.js-phone-text').forEach(function (a) {
      if (!CFG.phoneDisplay) return;
      /* the header button shows the short local form to save width */
      a.textContent = a.closest('.header__cta') ? CFG.phoneDisplay.replace(/^\+91\s*/, '') : CFG.phoneDisplay;
    });
    if (CFG.googleProfile) $$('[data-google]').forEach(function (a) { a.href = CFG.googleProfile; });
    if (CFG.instagram) $$('[data-ig]').forEach(function (a) { a.href = CFG.instagram; });
    var dir = $('#directionsLink');
    if (dir && CFG.directions) dir.href = CFG.directions;
  }

  /* ---- 2. Header state -------------------------------------------------- */
  function wireHeader() {
    var header = $('#header');
    if (!header) return;
    var hero = $('.hero');
    var heroH = hero ? hero.offsetHeight : 0;
    var ticking = false;

    function update() {
      ticking = false;
      var y = window.scrollY || window.pageYOffset;
      header.classList.toggle('is-stuck', y > 40);
      if (hero) header.classList.toggle('header--over', y <= 40 && y <= heroH - 120);
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () {
      heroH = hero ? hero.offsetHeight : 0;
      update();
    }, { passive: true });
  }

  /* ---- 3. Mobile drawer ------------------------------------------------- */
  function wireDrawer() {
    var burger = $('#burger'), drawer = $('#drawer');
    if (!burger || !drawer) return;

    function close() {
      drawer.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Open menu');
      document.body.classList.remove('is-locked');
    }
    burger.addEventListener('click', function () {
      var open = drawer.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('is-locked', open);
    });
    $$('a', drawer).forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && drawer.classList.contains('is-open')) close(); });
  }

  /* ---- 4. Scroll reveal -------------------------------------------------
     Content starts at opacity 0, so this must be failure-proof: anything
     already on screen is shown synchronously, the observer handles the
     normal case, and a scroll sweep plus a hard timeout catch the rest
     (embedded webviews and preview panes can throttle observers).
     ---------------------------------------------------------------------- */
  var revealIO = null;
  function show(el) { el.classList.add('is-in'); }

  function wireReveal(root) {
    var els = $$('[data-reveal]:not(.is-in)', root);
    if (!els.length) return;

    if (reduced || !('IntersectionObserver' in window)) { els.forEach(show); return; }

    if (!revealIO) {
      revealIO = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { show(en.target); revealIO.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    }

    var pending = [];
    els.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) show(el);
      else { revealIO.observe(el); pending.push(el); }
    });

    var last = 0;
    function sweep() {
      pending = pending.filter(function (el) {
        if (el.classList.contains('is-in')) return false;
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.15 && r.bottom > -120) { show(el); return false; }
        return true;
      });
      if (!pending.length) window.removeEventListener('scroll', onScroll);
    }
    function onScroll() {
      var now = Date.now();
      if (now - last < 150) return;
      last = now;
      sweep();
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', sweep, { passive: true });
    setTimeout(function () { pending.forEach(show); pending = []; }, 3000);
  }

  /* ---- 5. Active nav link ---------------------------------------------- */
  function wireSpy() {
    var links = $$('.nav__link[href^="#"]');
    if (!links.length || !('IntersectionObserver' in window)) return;
    var map = {};
    links.forEach(function (l) {
      var sec = document.getElementById(l.getAttribute('href').slice(1));
      if (sec) map[sec.id] = l;
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        if (map[en.target.id]) map[en.target.id].classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function (id) { io.observe(document.getElementById(id)); });
  }

  /* ---- 6. Hero parallax ------------------------------------------------- */
  function wireParallax() {
    if (reduced) return;
    var layers = $$('[data-par]');
    if (!layers.length) return;
    var raf = null;
    function tick() {
      var y = window.scrollY || window.pageYOffset;
      layers.forEach(function (l) {
        var k = parseFloat(l.getAttribute('data-par')) || 0;
        l.setAttribute('transform', 'translate(0 ' + (y * k).toFixed(2) + ')');
      });
      raf = null;
    }
    window.addEventListener('scroll', function () {
      if (raf === null && window.scrollY < window.innerHeight * 1.4) raf = requestAnimationFrame(tick);
    }, { passive: true });
  }

  /* ---- 7. Ticker + idle animations ------------------------------------- */
  function wireTicker() {
    var t = $('#ticker');
    if (t) t.innerHTML += t.innerHTML;

    if (reduced || !('IntersectionObserver' in window)) return;
    var targets = [$('.ticker'), $('.seal')].filter(Boolean);
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.target.classList.toggle('is-idle', !en.isIntersecting); });
    }, { rootMargin: '120px 0px' });
    targets.forEach(function (el) { el.classList.add('is-idle'); io.observe(el); });
  }

  /* ---- 8. Quick finder -------------------------------------------------- */
  function wireFinder() {
    var form = $('#finder');
    if (!form) return;
    var action = $('#fd-action'), type = $('#fd-type'), area = $('#fd-area');
    var budgetWrap = $('#fd-budget-wrap'), article = $('#fd-article');

    function isOwner() { return action.value === 'sell' || action.value === 'rent out'; }
    /* "an" by sound, not spelling: an independent floor, an agricultural plot, an SCO */
    function articleFor(t) { return /^(?:[aeiou]|sco\b)/i.test(t) ? 'an' : 'a'; }

    function sync() {
      /* owners selling or renting out aren't shopping on a budget */
      budgetWrap.hidden = isOwner();
      area.placeholder = isOwner() ? 'which sector?' : 'any sector';
      article.textContent = articleFor(type.value);
    }
    action.addEventListener('change', sync);
    type.addEventListener('change', sync);
    sync();

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = {};
      new FormData(form).forEach(function (v, k) { d[k] = String(v).trim(); });
      var owner = isOwner();
      var msg = 'Hello Rohtak Property Point — I want to ' + d.action + ' ' + articleFor(d.type) + ' ' + d.type
        + ' in ' + (d.area || (owner ? 'Rohtak' : 'any sector of Rohtak'))
        + (!owner && d.budget && d.budget !== 'open' ? ', budget ' + d.budget : '')
        + (owner ? '. Please call me back to discuss.' : '. Please share what you have.');
      window.open(wa(msg), '_blank', 'noopener');
    });
  }

  /* ---- 9. Listings: render, filter, detail ----------------------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function statusClass(s) {
    s = (s || '').toLowerCase();
    if (s === 'sold' || s === 'rented') return ' lcard__status--done';
    if (s.indexOf('rent') > -1) return ' lcard__status--rent';
    return '';
  }
  function enquiryText(l) {
    return 'Hello Rohtak Property Point — I saw this on your website and I\'m interested:\n\n'
      + l.title + '\n' + l.location + (l.size ? '\n' + l.size : '') + '\n\nIs it still available?';
  }

  function wireListings() {
    var grid = $('#listingGrid');
    if (!grid) return;
    var items = CFG.listings || [];          /* newest first */
    var PAGE = 24;
    var state = { cat: 'all', sector: 'all', sort: 'new', shown: PAGE };
    var PIN = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s-7-6.6-7-12a7 7 0 0 1 14 0c0 5.4-7 12-7 12Zm0-9.5A2.5 2.5 0 1 0 12 7.5a2.5 2.5 0 0 0 0 5Z"/></svg>';

    var bar = $('#filters'), sectorSel = $('#sectorFilter'), sortSel = $('#sortFilter');
    var moreBtn = $('#listingMore'), countEl = $('#listingCount'), empty = $('#listingEmpty');

    /* ---- controls built from the data ---- */
    var counts = {}, sectors = {};
    items.forEach(function (l) {
      counts[l.cat] = (counts[l.cat] || 0) + 1;
      if (l.sector) sectors[l.sector] = (sectors[l.sector] || 0) + 1;
    });
    var cats = Object.keys(counts).sort(function (a, b) {
      var ia = CAT_ORDER.indexOf(a), ib = CAT_ORDER.indexOf(b);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });
    if (bar) {
      var btns = [{ key: 'all', label: 'All', n: items.length }].concat(cats.map(function (c) {
        return { key: c, label: CAT_FILTER[c] || c, n: counts[c] };
      }));
      bar.innerHTML = cats.length < 2 ? '' : btns.map(function (b, i) {
        return '<button class="filter' + (i === 0 ? ' is-active' : '') + '" data-filter="' + esc(b.key) + '" aria-pressed="' + (i === 0) + '">'
          + esc(b.label) + ' <span class="filter__n">' + b.n + '</span></button>';
      }).join('');
    }
    if (sectorSel) {
      var names = Object.keys(sectors).sort(function (a, b) {
        var na = parseFloat(a.replace(/\D+/g, '')), nb = parseFloat(b.replace(/\D+/g, ''));
        if (isNaN(na) || isNaN(nb)) return a < b ? -1 : 1;
        return na - nb || (a < b ? -1 : 1);
      });
      sectorSel.innerHTML = '<option value="all">All areas (' + items.length + ')</option>'
        + names.map(function (n) { return '<option value="' + esc(n) + '">' + esc(n) + ' (' + sectors[n] + ')</option>'; }).join('');
      sectorSel.parentNode.hidden = names.length < 2;
    }

    /* ---- filtering ---- */
    function filtered() {
      var out = [];
      items.forEach(function (l, i) {
        if (state.cat !== 'all' && l.cat !== state.cat) return;
        if (state.sector !== 'all' && l.sector !== state.sector) return;
        out.push({ l: l, i: i });
      });
      if (state.sort === 'low' || state.sort === 'high') {
        var dir = state.sort === 'low' ? 1 : -1;
        out.sort(function (a, b) {
          var pa = a.l.p, pb = b.l.p;
          if (pa == null && pb == null) return a.i - b.i;
          if (pa == null) return 1;          /* unknown prices always last */
          if (pb == null) return -1;
          return (pa - pb) * dir || a.i - b.i;
        });
      }
      return out;
    }

    function card(o) {
      var l = o.l, i = o.i;
      /* the poster carries its own "for sale" banner, so only flag a change of state */
      var badge = (l.status && l.status !== 'For Sale')
        ? '<span class="lcard__status' + statusClass(l.status) + '">' + esc(l.status) + '</span>' : '';
      return ''
        + '<article class="lcard">'
        +   '<button class="lcard__media' + (l.fit === 'contain' ? ' lcard__media--contain' : '') + '" type="button" data-open="' + i + '" aria-label="View details: ' + esc(l.title) + ', ' + esc(l.location) + '">'
        +     '<img src="' + esc(l.thumb || l.img) + '" alt="" loading="lazy" decoding="async" width="480" height="480">'
        +     badge
        +   '</button>'
        +   '<div class="lcard__body">'
        +     '<span class="lcard__tag">' + esc(CAT_LABEL[l.cat] || l.cat) + '</span>'
        +     '<h3 class="lcard__title">' + esc(l.title) + '</h3>'
        +     '<p class="lcard__loc">' + PIN + esc(l.location) + '</p>'
        +     '<p class="lcard__facts"><span>' + esc(l.size) + '</span><span>' + esc(l.price) + '</span></p>'
        +     '<div class="lcard__actions">'
        +       '<button class="btn btn--line btn--sm" type="button" data-open="' + i + '">Details</button>'
        +       '<a class="btn btn--sm" href="' + esc(wa(enquiryText(l))) + '" target="_blank" rel="noopener">Enquire</a>'
        +     '</div>'
        +   '</div>'
        + '</article>';
    }

    var drawn = 0, current = [];
    function render(append) {
      if (!append) { current = filtered(); drawn = 0; grid.innerHTML = ''; }
      var upto = Math.min(state.shown, current.length);
      grid.insertAdjacentHTML('beforeend', current.slice(drawn, upto).map(card).join(''));
      drawn = upto;
      if (countEl) countEl.textContent = current.length + (current.length === 1 ? ' property' : ' properties');
      if (moreBtn) {
        var left = current.length - drawn;
        moreBtn.hidden = left <= 0;
        moreBtn.firstChild.textContent = 'Show ' + Math.min(left, PAGE) + ' more ';
        moreBtn.setAttribute('aria-label', 'Show more properties, ' + left + ' remaining');
      }
      if (empty) empty.hidden = current.length > 0;
    }

    function reset() { state.shown = PAGE; render(false); }

    var filters = $$('.filter');
    filters.forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.cat = btn.getAttribute('data-filter');
        filters.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle('is-active', on);
          b.setAttribute('aria-pressed', String(on));
        });
        reset();
      });
    });
    if (sectorSel) sectorSel.addEventListener('change', function () { state.sector = sectorSel.value; reset(); });
    if (sortSel) sortSel.addEventListener('change', function () { state.sort = sortSel.value; reset(); });
    if (moreBtn) moreBtn.addEventListener('click', function () { state.shown += PAGE; render(true); });

    render(false);

    /* ---- detail modal ---- */
    var modal = $('#modal');
    if (!modal) return;
    var last = null;

    function open(i, trigger) {
      var l = items[i];
      if (!l) return;
      last = trigger;
      $('#modalImg').src = l.img;
      $('#modalImg').alt = l.title + ' — ' + l.location;
      var st = $('#modalStatus');
      st.textContent = l.status;
      st.className = 'modal__status' + statusClass(l.status).replace('lcard', 'modal');
      $('#modalTitle').textContent = l.title;
      $('#modalLoc').textContent = l.location;
      $('#modalSize').textContent = l.size || '—';
      $('#modalPrice').textContent = l.price || 'Price on request';
      $('#modalFeat').innerHTML = (l.features || []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('');
      $('#modalWa').href = wa(enquiryText(l));
      var ig = $('#modalIg');
      if (ig) {
        ig.hidden = !l.ig;
        if (l.ig) ig.href = 'https://www.instagram.com/p/' + l.ig + '/';
      }
      modal.hidden = false;
      document.body.classList.add('is-locked');
      $('#modalClose').focus();
    }
    function close() {
      modal.hidden = true;
      document.body.classList.remove('is-locked');
      if (last) last.focus();
    }

    grid.addEventListener('click', function (e) {
      var t = e.target.closest('[data-open]');
      if (t) open(+t.getAttribute('data-open'), t);
    });
    $('#modalClose').addEventListener('click', close);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;
      if (e.key === 'Escape') close();
      /* keep Tab inside the dialog */
      if (e.key === 'Tab') {
        var f = $$('a[href], button', modal);
        var first = f[0], lastEl = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
      }
    });
  }

  /* ---- 10. Count-up numbers -------------------------------------------- */
  function wireCounters() {
    var nums = $$('[data-count]');
    if (!nums.length) return;

    function fmt(n, dec) { return dec ? n.toFixed(dec) : Math.round(n).toLocaleString('en-IN'); }
    function run(el) {
      var target = parseFloat(el.getAttribute('data-count')) || 0;
      var dec = parseInt(el.getAttribute('data-decimals'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (reduced) { el.textContent = fmt(target, dec) + suffix; return; }
      var dur = 1400, t0 = null;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var p = Math.min((ts - t0) / dur, 1);
        el.textContent = fmt(target * (1 - Math.pow(1 - p, 3)), dec) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---- 11. Enquiry form ------------------------------------------------- */
  function wireForm() {
    var form = $('#enquiryForm');
    if (!form) return;
    var ok = $('#enquiryOk');

    function setErr(field, bad) { if (field) field.classList.toggle('is-invalid', bad); }

    function validate() {
      var valid = true;
      $$('.field', form).forEach(function (field) {
        var input = $('input, select, textarea', field);
        if (!input || !input.required) return;
        var v = (input.value || '').trim();
        var bad = !v;
        if (!bad && input.type === 'tel') bad = v.replace(/\D/g, '').length < 10;
        setErr(field, bad);
        if (bad) valid = false;
      });
      return valid;
    }

    $$('input, select, textarea', form).forEach(function (i) {
      i.addEventListener('input',  function () { setErr(i.closest('.field'), false); });
      i.addEventListener('change', function () { setErr(i.closest('.field'), false); });
    });

    function compose(d) {
      return 'New enquiry — Rohtak Property Point website\n\n'
        + 'Name: '   + (d.name || '-') + '\n'
        + 'Phone: '  + (d.phone || '-') + '\n'
        + 'Wants to: ' + (d.want || '-') + '\n'
        + 'Property: ' + (d.type || 'Any') + '\n'
        + 'Area: '   + (d.area || '-') + '\n'
        + 'Message: ' + (d.message || '-');
    }
    function done(msg) {
      if (!ok) return;
      ok.textContent = msg;
      ok.classList.add('is-shown');
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) {
        var first = $('.field.is-invalid input, .field.is-invalid select', form);
        if (first) first.focus();
        return;
      }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });

      if (CFG.formEndpoint) {
        fetch(CFG.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error('bad status');
          done('Thank you — we have your details and will call you back shortly.');
          form.reset();
        }).catch(function () {
          done('We could not submit the form just now. Opening WhatsApp instead…');
          setTimeout(function () { window.open(wa(compose(data)), '_blank', 'noopener'); }, 900);
        });
      } else {
        /* no backend configured — hand the enquiry to WhatsApp, fully filled in */
        done('Opening WhatsApp with your enquiry…');
        window.open(wa(compose(data)), '_blank', 'noopener');
        form.reset();
      }
    });
  }

  /* ---- 12. Misc --------------------------------------------------------- */
  function wireMisc() {
    var yr = $('#yr');
    if (yr) yr.textContent = new Date().getFullYear();

    /* offset in-page anchors for the fixed header */
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href^="#"]');
      if (!a) return;
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.getElementById(id.slice(1));
      if (!t) return;
      e.preventDefault();
      var h = $('.header');
      var y = t.getBoundingClientRect().top + window.scrollY - (h ? h.offsetHeight : 0) + 1;
      window.scrollTo({ top: Math.max(0, y), behavior: reduced ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  }

  /* ---- boot ------------------------------------------------------------- */
  function init() {
    wireContact();
    wireListings();      /* before reveal, so the rendered cards animate in too */
    wireHeader();
    wireDrawer();
    wireReveal();
    wireSpy();
    wireParallax();
    wireTicker();
    wireFinder();
    wireCounters();
    wireForm();
    wireMisc();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
