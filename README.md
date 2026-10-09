# Réussite Scolaire RDC — site éducatif statique

Site 100 % HTML / CSS / JavaScript, sans serveur, sans base de données, sans framework.
Il contient 12 articles, un cours de mathématiques, 19 exercices corrigés, des fiches de révision, un calculateur d'équations du second degré, les pages légales et une page 404.

> **Important** : le site n'est PAS monétisé et n'affiche AUCUNE annonce. Les emplacements publicitaires sont masqués et rien de Google n'est chargé tant que vous n'avez pas été approuvé par AdSense **et** complété `assets/js/ads-config.js`. L'approbation, le trafic et les revenus ne sont jamais garantis.

## 1. Contenu du dossier

```
index.html                      Accueil (recherche, ressources récentes)
mathematiques.html              Cours + exercices avec solutions
calculateur-second-degre.html   Calculateur ax² + bx + c = 0
exercices.html                  19 exercices par thème et niveau
fiches-revision.html            Fiches de révision
methodes-examens.html           Méthodes de préparation
articles.html                   Liste des articles
articles/*.html                 12 articles (un fichier par article)
recherche.html                  Résultats de recherche (non indexée)
a-propos.html  contact.html  confidentialite.html
cookies-annonces.html  mentions-legales.html  404.html
assets/css/style.css            Style
assets/js/main.js               Menu, filtre d'exercices, contact
assets/js/calc-core.js          Calcul exact du second degré
assets/js/calculateur.js        Interface du calculateur
assets/js/recherche.js          Recherche locale
assets/js/search-index.js       Index de recherche
assets/js/ads-config.js         À compléter APRÈS approbation AdSense
assets/js/ads.js                Charge AdSense seulement si configuré
assets/img/favicon.svg, logo.svg
robots.txt  sitemap.xml  ads.txt  _headers
```

## 2. À faire AVANT de publier largement (liste de contrôle)

1. **Adresse du site.** Dans les fichiers, l'adresse provisoire est `https://VOTRE-SITE.pages.dev`. Publiez une première fois (partie C), notez l'adresse réelle donnée par Cloudflare, puis remplacez `VOTRE-SITE.pages.dev` partout (balises `canonical`, `og:url`, données structurées, `sitemap.xml`, `robots.txt`), et republiez. Sur téléphone, le plus simple : donnez votre adresse à l'assistant qui vous a fourni ce projet et demandez-lui de regénérer le ZIP avec la bonne adresse.
2. **E-mail de contact.** Dans `contact.html`, remplacez `VOTRE-EMAIL@exemple.com` (attribut `data-email`) par votre vraie adresse. Tant que ce n'est pas fait, le bouton est désactivé : le site ne prétend pas envoyer de messages. Le formulaire ouvre simplement votre application e-mail.
3. **Mentions légales.** Complétez tous les champs `[À COMPLÉTER]` dans `mentions-legales.html`.
4. **Relire** les pages confidentialité et cookies et adaptez-les à votre situation (ce ne sont pas des avis juridiques).
5. **Relire les contenus** avec un enseignant si possible. Les programmes varient : vérifiez la correspondance avec le vôtre.

## 3. Modifier le contenu

- Chaque article est un fichier dans `articles/`. Pour en ajouter un : copiez un article existant, changez le titre, la description (`<meta name="description">`), l'adresse `canonical`, le texte ; puis ajoutez une carte dans `articles.html`, une ligne dans `sitemap.xml` et une entrée dans `assets/js/search-index.js` (même format que les autres).
- Chaque page doit garder un `<title>` et une description uniques.
- Les couleurs se changent au début de `assets/css/style.css` (variables `--bleu`, `--jaune`, `--rouge`).

## 4. Tests réellement effectués (9 octobre 2026)

- 38 tests automatiques du calcul du second degré sous Node.js (négatifs, décimaux, virgule, a = 0, champs vides, valeurs invalides, nombres trop longs, stabilité numérique). Pour les relancer : `node tests/test-calculateur.js` (dossier de tests non inclus dans le ZIP du site).
- Vérification automatique de toutes les pages : tous les liens internes, toutes les ancres, un seul `h1` par page, titres et descriptions uniques, identifiants non dupliqués.
- Ouverture des 26 pages dans un navigateur Chrome sans écran, à la largeur d'un téléphone (360 px), servies par un serveur statique local qui imite les URL propres : aucune erreur JavaScript, aucun débordement horizontal, menu mobile, calculateur (6 scénarios), filtre d'exercices, recherche, page 404, aucun script externe, annonces masquées.

**Non testé** (impossible dans mon environnement) : sur un vrai téléphone Android, dans SPCK Editor, le déploiement réel sur Cloudflare Pages, Google Search Console et AdSense. Si une étape ne se passe pas comme décrit ci-dessous, les écrans de ces services ont peut-être changé : suivez leur documentation officielle.

---

# GUIDE POUR DÉBUTANT ANDROID

Légende : **[gratuit]**, **[facultatif]**, **[payant]**, **[soumis à validation]**.

## A. Importer le ZIP et ouvrir le projet dans SPCK Editor
1. Téléchargez `reussite-scolaire-rdc.zip` sur votre téléphone.
2. Ouvrez l'application **Fichiers** de votre téléphone, appuyez longuement sur le ZIP et choisissez **Extraire** (le mot exact dépend du téléphone). Vous obtenez un dossier avec `index.html` à l'intérieur.
3. Ouvrez **SPCK Editor** [gratuit] et utilisez la fonction pour ouvrir un dossier ou créer un espace de travail pointant vers ce dossier (le libellé varie selon la version). Vous devez voir `index.html`, `assets/`, `articles/`.

## B. Tester sur Android
- Option 1 : dans SPCK Editor, ouvrez `index.html` et utilisez son aperçu (« Preview » ou équivalent).
- Option 2 : dans le navigateur, ouvrez le fichier `index.html` extrait (adresse `file://…`). Les liens du site sont relatifs, ils fonctionnent ainsi.
- Testez : le bouton Menu, le calculateur (essayez `1`, `-5`, `6`), le filtre des exercices, la recherche. La page 404 ne se teste qu'en ligne.

## C. Créer un compte Cloudflare et publier [gratuit]
1. Allez sur https://dash.cloudflare.com et créez un compte gratuit (e-mail + mot de passe, puis confirmez l'e-mail). Ne partagez jamais votre mot de passe.
2. Dans le tableau de bord, ouvrez **Workers & Pages**, puis créez une application **Pages** avec l'option **Direct Upload** (« Drag and drop your files » / glisser-déposer).
3. Donnez un nom au projet : ce nom devient l'adresse gratuite `nom.pages.dev` (choisissez-le avec soin, vous ne pourrez pas toujours le changer).
4. Choisissez le fichier **ZIP** (la documentation Cloudflare indique que ce mode accepte un ZIP ou un dossier). Le ZIP fourni a `index.html` à la racine, c'est nécessaire : un ZIP qui contiendrait un dossier supplémentaire autour de tout le site ne fonctionnerait pas.
5. Si le sélecteur de fichiers ne s'ouvre pas, passez votre navigateur en « version pour ordinateur » (menu du navigateur).
6. Cliquez sur **Deploy**. Notez l'adresse obtenue, puis faites l'étape 1 de la liste de contrôle (remplacer `VOTRE-SITE.pages.dev`) et republiez un nouveau ZIP.
Documentation officielle : https://developers.cloudflare.com/pages/get-started/direct-upload/

## D. Adresse gratuite et domaine personnalisé
- L'adresse `nom.pages.dev` est gratuite [gratuit].
- Un nom de domaine personnalisé (par exemple `monsite.org`) est **payant** [payant, facultatif] : il s'achète chez un registrar (revendeur de domaines), puis se relie dans Cloudflare Pages > votre projet > **Custom domains**. Comparez les prix et vérifiez les moyens de paiement acceptés.
- Pour AdSense, un domaine personnalisé est souvent préférable aux sous-domaines gratuits, qui peuvent poser problème. Vérifiez les conditions actuelles dans le Centre d'aide AdSense.

## E. Google Search Console [gratuit]
1. Ouvrez https://search.google.com/search-console et connectez-vous avec un compte Google.
2. Ajoutez une propriété de type **Préfixe d'URL** avec l'adresse exacte de votre site (`https://nom.pages.dev/`).
3. Choisissez une méthode de validation : la **balise HTML** (collez la ligne `<meta name="google-site-verification" …>` fournie dans le `<head>` de `index.html`) ou le **fichier HTML** (mettez-le à la racine du site). Republiez, puis cliquez sur Valider.
4. Menu **Sitemaps** : saisissez `sitemap.xml` et envoyez.
5. Avec **Inspection de l'URL**, vous pouvez demander l'indexation de la page d'accueil. L'indexation peut prendre de quelques jours à plusieurs semaines et n'est pas garantie.

## F. Développer le trafic organique (sans spam) [gratuit]
- Publiez régulièrement des contenus utiles et originaux, en répondant à de vraies questions d'élèves (par exemple : « comment résoudre… », « méthode pour… »).
- Reliez vos pages entre elles et gardez des titres clairs.
- **Partager sans spam** : parlez de votre site seulement dans les groupes où c'est autorisé, lisez le règlement avant, apportez d'abord de l'aide (réponse utile à une question, puis lien pertinent), n'envoyez pas le même message partout, n'envoyez pas de messages privés non sollicités, ne promettez pas de résultats et n'utilisez pas de faux comptes. Demandez à vos camarades de partager le lien s'ils le trouvent utile, sans les y obliger.
- Ne promettez jamais « première place sur Google » ni un nombre de visiteurs : personne ne peut les garantir.

## G. Demander l'approbation AdSense [soumis à validation]
1. Lisez les règles : https://adsense.google.com puis Centre d'aide > « Règles du programme AdSense ». Points clés : contenu original et utile, pas de contenu copié, pas de clics sur vos propres annonces, pas d'incitation aux clics, pas de trafic acheté.
2. Vérifiez que vous remplissez les conditions du compte (âge minimum, une personne = un compte, site dont vous contrôlez le contenu) dans le Centre d'aide.
3. Avant de demander : site en ligne, pages légales complétées, plusieurs contenus de qualité, navigation propre.
4. Créez le compte AdSense, ajoutez l'adresse du site et suivez la méthode de rattachement demandée (extrait de code, balise ou fichier selon l'écran). Si Google demande d'insérer son code dans `<head>`, ajoutez-le tel quel sur chaque page uniquement quand vous y êtes invité.
5. Demandez l'examen et patientez. Le délai varie. En cas de refus, lisez le motif, améliorez le site et redemandez plus tard.

## H. ads.txt et annonces après approbation uniquement
1. Dans AdSense, repérez votre ligne ads.txt officielle (cherchez « ads.txt » dans le Centre d'aide ou dans l'espace Sites). Elle a la forme `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0` avec **votre** identifiant.
2. Dans SPCK Editor, ouvrez `ads.txt`, supprimez les commentaires inutiles et collez la ligne officielle. Republiez.
3. Ouvrez `assets/js/ads-config.js`. Remplissez `client` (votre `ca-pub-…` réel), créez des unités d'annonces dans AdSense (Annonces > Par unité publicitaire), copiez leurs identifiants dans `slots.article` et `slots.liste`, puis passez `enabled` à `true`.
4. Mettez à jour `cookies-annonces.html` et `confidentialite.html`, et configurez la gestion du consentement proposée par AdSense si vos visiteurs sont concernés (Espace économique européen, Royaume-Uni, Suisse…).
5. Tant que vous n'avez pas de revenu réel, ne dites pas que le site est monétisé.

## I. Suivre les revenus et configurer le paiement réel en RDC
- **Suivi** (dans votre compte AdSense officiel, jamais ailleurs) : **Accueil** (revenus estimés), **Rapports** (impressions, pages vues, RPM, clics), **Paiements** (solde, paiements en attente et effectués, informations de paiement). Les revenus estimés peuvent être ajustés avant le paiement.
- **Modes de paiement** : ils dépendent de votre adresse de paiement et sont listés par Google ici : https://support.google.com/adsense/answer/1714397 . Pour la RDC, regardez la ligne du pays dans cette page et vérifiez dans **Paiements > Informations de paiement > Gérer les modes de paiement** ce qui vous est réellement proposé. Rien n'est garanti pour tous les comptes.
- **Profil de paiement** : nom et adresse exacts, correspondant à vos documents. Google peut demander une **vérification d'identité** et une **vérification d'adresse** (par exemple un code PIN envoyé par courrier une fois un certain revenu atteint) ; la poste peut être lente, patientez avant de demander un nouveau code.
- **Informations fiscales** : Google peut demander des informations fiscales selon votre pays. Renseignez-les dans votre compte, pas par e-mail.
- **Seuils** : un seuil de revenu doit être atteint avant la sélection du mode de paiement et avant tout paiement. Les montants sont indiqués dans votre compte : consultez-les là, car ils peuvent changer. La **devise** de paiement est affichée dans votre compte.
- **Banque** : avant d'ajouter un compte bancaire, demandez à votre banque si elle accepte les virements internationaux entrants, quels frais elle applique et quelles coordonnées exactes fournir (nom du titulaire, IBAN/numéro de compte, code SWIFT/BIC si demandé).
- **Délais** : un paiement n'est jamais immédiat. Il dépend du seuil, de la validation du compte, d'éventuelles retenues et du calendrier de paiement de Google.
- **Sécurité** : ne publiez jamais, et ne donnez à personne (même par message privé), votre mot de passe, votre code PIN, vos documents d'identité ou vos coordonnées bancaires. Aucune personne sérieuse ne vous les demandera pour « débloquer » vos paiements.
- Les règles changent : vérifiez toujours le Centre d'aide officiel https://support.google.com/adsense

## J. Problèmes fréquents sur téléphone
- **La page est blanche en ligne** : vérifiez que `index.html` est à la racine du ZIP et pas dans un sous-dossier.
- **Le style ne s'applique pas** : le dossier `assets` n'a pas été envoyé ou le nom a changé. Respectez les majuscules/minuscules.
- **La modification ne s'affiche pas** : republiez, puis rechargez la page sans cache (menu du navigateur > actualiser).
- **Le fichier ZIP ne se sélectionne pas dans Cloudflare** : passez en version ordinateur ou changez de navigateur.
- **Les liens vers `.html` s'affichent sans `.html` en ligne** : c'est normal avec Cloudflare Pages.
- **Le calculateur ne répond pas** : vérifiez que JavaScript est activé.
- **Le bouton du formulaire de contact est grisé** : vous n'avez pas encore remplacé l'adresse e-mail (étape 2 de la liste de contrôle).
- **Aucune annonce n'apparaît** : c'est voulu tant que `ads-config.js` n'est pas complété, et même après, Google décide de l'affichage.
