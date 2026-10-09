/* Chargement d'AdSense : uniquement si ads-config.js est complété avec de vrais identifiants. */
(function () {
  'use strict';
  var cfg = window.RSRDC_ADS;
  if (!cfg || cfg.enabled !== true) return;
  if (!/^ca-pub-\d{16}$/.test(cfg.client || '')) return;      // identifiant invalide : on ne charge rien
  var slots = document.querySelectorAll('.ad-slot[data-ad-name]');
  var used = [];
  for (var i = 0; i < slots.length; i++) {
    var id = (cfg.slots || {})[slots[i].getAttribute('data-ad-name')];
    if (/^\d{6,}$/.test(id || '')) used.push([slots[i], id]);
  }
  if (!used.length) return;
  var s = document.createElement('script');
  s.async = true;
  s.crossOrigin = 'anonymous';
  s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(cfg.client);
  document.head.appendChild(s);
  window.adsbygoogle = window.adsbygoogle || [];
  used.forEach(function (u) {
    var ins = document.createElement('ins');
    ins.className = 'adsbygoogle';
    ins.style.display = 'block';
    ins.setAttribute('data-ad-client', cfg.client);
    ins.setAttribute('data-ad-slot', u[1]);
    ins.setAttribute('data-ad-format', 'auto');
    ins.setAttribute('data-full-width-responsive', 'true');
    u[0].appendChild(ins);
    u[0].hidden = false;
    try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) { /* ignoré */ }
  });
})();
