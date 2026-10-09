/* Recherche locale dans l'index généré (search-index.js). Aucune donnée n'est envoyée nulle part. */
(function () {
  'use strict';
  var out = document.getElementById('resultats');
  var qEl = document.getElementById('q-page');
  if (!out) return;
  var index = window.RSRDC_INDEX || [];

  function norm(s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  var params = new URLSearchParams(window.location.search);
  var q = (params.get('q') || '').trim();
  if (qEl) qEl.value = q;
  var headerQ = document.getElementById('q');
  if (headerQ) headerQ.value = q;

  if (!q) { out.textContent = 'Tapez un mot (par exemple « discriminant » ou « pourcentage ») dans la barre de recherche.'; return; }
  var mots = norm(q).split(/\s+/).filter(Boolean);
  var res = [];
  index.forEach(function (it) {
    var titre = norm(it.t), texte = norm(it.d + ' ' + it.k);
    var score = 0, tous = true;
    mots.forEach(function (m) {
      var s = (titre.indexOf(m) > -1 ? 3 : 0) + (texte.indexOf(m) > -1 ? 1 : 0);
      if (!s) tous = false;
      score += s;
    });
    if (tous && score) res.push({ it: it, score: score });
  });
  res.sort(function (a, b) { return b.score - a.score; });
  out.textContent = '';
  var p = document.createElement('p');
  p.textContent = res.length + (res.length > 1 ? ' résultats' : ' résultat') + ' pour « ' + q + ' »';
  out.appendChild(p);
  if (!res.length) {
    var h = document.createElement('p');
    h.textContent = 'Aucun résultat. Essayez un mot plus court ou consultez la liste des articles.';
    out.appendChild(h);
    return;
  }
  var ul = document.createElement('ul');
  res.forEach(function (r) {
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = r.it.u;
    a.textContent = r.it.t;
    var d = document.createElement('span');
    d.className = 'meta';
    d.textContent = ' — ' + r.it.d;
    li.appendChild(a); li.appendChild(d); ul.appendChild(li);
  });
  out.appendChild(ul);
})();
