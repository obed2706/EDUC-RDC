/* Réussite Scolaire RDC — script commun : menu mobile, année, filtre des exercices, contact. */
(function () {
  'use strict';

  // Année du pied de page
  var an = document.getElementById('annee');
  if (an) an.textContent = new Date().getFullYear();

  // Menu mobile
  var btn = document.querySelector('.menu-btn');
  var zone = document.getElementById('menu');
  if (btn && zone) {
    btn.addEventListener('click', function () {
      var open = zone.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && zone.classList.contains('open')) {
        zone.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.focus();
      }
    });
  }

  // Filtre des exercices (page exercices.html)
  var fTheme = document.getElementById('f-theme');
  var fNiveau = document.getElementById('f-niveau');
  if (fTheme && fNiveau) {
    var exos = document.querySelectorAll('.exo');
    var compteur = document.getElementById('compteur');
    var filtrer = function () {
      var n = 0;
      for (var i = 0; i < exos.length; i++) {
        var ok = (fTheme.value === 'tous' || exos[i].getAttribute('data-theme') === fTheme.value) &&
                 (fNiveau.value === 'tous' || exos[i].getAttribute('data-niveau') === fNiveau.value);
        exos[i].hidden = !ok;
        if (ok) n++;
      }
      if (compteur) compteur.textContent = n + (n > 1 ? ' exercices affichés' : ' exercice affiché');
    };
    fTheme.addEventListener('change', filtrer);
    fNiveau.addEventListener('change', filtrer);
    filtrer();
  }

  // Contact : prépare un e-mail dans l'application de messagerie de l'appareil.
  // Rien n'est envoyé par le site lui-même.
  var form = document.getElementById('form-contact');
  if (form) {
    var adresse = form.getAttribute('data-email') || '';
    var valide = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adresse) && adresse.indexOf('VOTRE') === -1;
    var info = document.getElementById('contact-etat');
    if (!valide && info) {
      var bt = document.getElementById('btn-contact'); if (bt) bt.disabled = true;
      info.textContent = 'Le propriétaire du site doit d\'abord renseigner son adresse e-mail (voir README.md, étape « Contact »). Le bouton est désactivé en attendant.';
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!valide) return;
      var sujet = form.elements['sujet'].value.trim() || 'Message depuis Réussite Scolaire RDC';
      var corps = form.elements['message'].value.trim();
      var nom = form.elements['nom'].value.trim();
      if (!corps) { form.elements['message'].focus(); return; }
      var texte = corps + (nom ? '\n\n' + nom : '');
      window.location.href = 'mailto:' + adresse + '?subject=' + encodeURIComponent(sujet) + '&body=' + encodeURIComponent(texte);
    });
  }
})();
