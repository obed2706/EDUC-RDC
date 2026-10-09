/* Interface du calculateur ax² + bx + c = 0 (le calcul est dans calc-core.js). */
(function () {
  'use strict';
  var form = document.getElementById('calc-form');
  var out = document.getElementById('resultat');
  if (!form || !out || !window.RSRDC_CALC) return;
  var ids = ['a', 'b', 'c'];

  function fr(t) { return String(t).replace(/(\d)\.(\d)/g, '$1,$2').replace(/-(?=\d)/g, '−'); }

  function setErr(id, msg) {
    var inp = document.getElementById('in-' + id), e = document.getElementById('err-' + id);
    inp.setAttribute('aria-invalid', msg ? 'true' : 'false');
    e.textContent = msg || '';
  }

  function afficher(r) {
    out.textContent = '';
    var h = document.createElement('h2'); h.textContent = 'Résolution étape par étape'; out.appendChild(h);
    var intro = document.createElement('p');
    intro.className = 'ital';
    intro.textContent = fr(r.a) + ' x² + (' + fr(r.b) + ') x + (' + fr(r.c) + ') = 0';
    out.appendChild(intro);
    var ol = document.createElement('ol');
    r.steps.forEach(function (s) { var li = document.createElement('li'); li.textContent = fr(s.replace(/^Étape \d+\.\s*/, '')); ol.appendChild(li); });
    out.appendChild(ol);
    var c = document.createElement('p'); c.className = 'conclusion'; c.textContent = fr(r.conclusion); out.appendChild(c);
    out.setAttribute('tabindex', '-1');
    out.focus({ preventScroll: false });
  }

  function calculer() {
    var vals = ids.map(function (i) { return document.getElementById('in-' + i).value; });
    var r = window.RSRDC_CALC.solve(vals[0], vals[1], vals[2]);
    if (!r.ok) {
      ids.forEach(function (i) { setErr(i, r.errors[i]); });
      out.textContent = '';
      var first = ids.filter(function (i) { return r.errors[i]; })[0];
      if (first) document.getElementById('in-' + first).focus();
      return;
    }
    ids.forEach(function (i) { setErr(i, ''); });
    afficher(r);
  }

  form.addEventListener('submit', function (e) { e.preventDefault(); calculer(); });
  document.getElementById('calc-reset').addEventListener('click', function () {
    form.reset(); ids.forEach(function (i) { setErr(i, ''); }); out.textContent = '';
    document.getElementById('in-a').focus();
  });
  Array.prototype.forEach.call(document.querySelectorAll('[data-exemple]'), function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-exemple').split(';');
      ids.forEach(function (i, k) { document.getElementById('in-' + i).value = v[k]; });
      calculer();
    });
  });
})();
