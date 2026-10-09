/*
 * CONFIGURATION DES ANNONCES GOOGLE ADSENSE
 * -----------------------------------------
 * Tant que "enabled" vaut false, AUCUNE annonce n'est chargée et AUCUN
 * emplacement publicitaire n'est affiché. Ne changez ces valeurs qu'après
 * l'approbation de votre site par Google AdSense (voir README.md, partie H).
 *
 *  - client : votre identifiant éditeur, de la forme "ca-pub-0000000000000000"
 *             (à copier depuis votre compte AdSense : ne l'inventez jamais).
 *  - slots  : un identifiant d'unité publicitaire (suite de chiffres) par
 *             emplacement, créé dans AdSense > Annonces > Par unité publicitaire.
 */
window.RSRDC_ADS = {
  enabled: false,
  client: "",
  slots: {
    article: "",
    liste: ""
  }
};
