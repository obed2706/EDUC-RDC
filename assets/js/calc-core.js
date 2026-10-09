/*
 * Réussite Scolaire RDC — cœur de calcul de l'équation ax² + bx + c = 0.
 * Les coefficients sont lus comme des décimaux EXACTS (BigInt) : le signe du
 * discriminant n'est donc jamais faussé par les erreurs d'arrondi de JavaScript
 * (exemple : 0,1 x² + 0,2 x + 0,1 = 0 a bien Δ = 0).
 * Ce fichier ne touche pas à la page : il peut être testé avec Node (voir tests/).
 */
(function (root) {
  'use strict';

  var ZERO = BigInt(0), ONE = BigInt(1), TWO = BigInt(2), TEN = BigInt(10), FOUR = BigInt(4);
  var MAX_DIGITS = 15;

  function parseNumber(raw) {
    if (typeof raw !== 'string') return { ok: false, error: 'Entrez un nombre.' };
    var s = raw.trim().replace(/\s+/g, '').replace(/\u2212/g, '-').replace(',', '.');
    if (s === '') return { ok: false, error: 'Entrez un nombre (ce champ est vide).' };
    if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(s)) {
      return { ok: false, error: 'Valeur non valide : utilisez des chiffres, un signe − éventuel et une virgule ou un point.' };
    }
    var neg = s.charAt(0) === '-';
    if (s.charAt(0) === '-' || s.charAt(0) === '+') s = s.slice(1);
    var parts = s.split('.');
    var ip = parts[0] || '0';
    var fp = (parts[1] || '').replace(/0+$/, '');
    var digits = (ip + fp).replace(/^0+(?=\d)/, '');
    if (digits.replace(/^0+/, '').length > MAX_DIGITS) {
      return { ok: false, error: 'Nombre trop long : ' + MAX_DIGITS + ' chiffres au maximum.' };
    }
    var big = BigInt(digits);
    if (neg) big = -big;
    return { ok: true, big: big, scale: fp.length };
  }

  function pow10(k) { return TEN ** BigInt(k); }
  function abs(x) { return x < ZERO ? -x : x; }

  function fmtScaled(big, scale) {
    var neg = big < ZERO;
    var s = abs(big).toString();
    if (scale > 0) {
      while (s.length <= scale) s = '0' + s;
      var ip = s.slice(0, s.length - scale);
      var fp = s.slice(s.length - scale).replace(/0+$/, '');
      s = fp ? ip + '.' + fp : ip;
    }
    return (neg && s !== '0') ? '-' + s : s;
  }

  function isqrt(n) {
    if (n < TWO) return n;
    var x = BigInt(Math.floor(Math.sqrt(Number(n))));
    if (x < ONE) x = ONE;
    for (var i = 0; i < 200; i++) {
      var y = (x + n / x) / TWO;
      if (abs(y - x) <= ONE) { x = y; break; }
      x = y;
    }
    while (x * x > n) x -= ONE;
    while ((x + ONE) * (x + ONE) <= n) x += ONE;
    return x;
  }

  function gcd(a, b) {
    a = abs(a); b = abs(b);
    while (b !== ZERO) { var t = a % b; a = b; b = t; }
    return a;
  }

  // Fraction réduite (dénominateur > 0) sous forme de texte, ou entier.
  function fracText(n, d) {
    if (d < ZERO) { n = -n; d = -d; }
    var g = gcd(n, d);
    if (g > ZERO) { n = n / g; d = d / g; }
    return d === ONE ? n.toString() : n.toString() + '/' + d.toString();
  }

  // Nombre → texte (10 chiffres significatifs, point décimal).
  function fmtNum(x) {
    if (x === 0 || !isFinite(x)) return x === 0 ? '0' : String(x);
    var r = Number(x.toPrecision(10));
    if (r === 0) return '0';
    return String(r);
  }

  function par(s) { return s.charAt(0) === '-' ? '(' + s + ')' : s; }

  function solve(rawA, rawB, rawC) {
    var pa = parseNumber(rawA), pb = parseNumber(rawB), pc = parseNumber(rawC);
    if (!pa.ok || !pb.ok || !pc.ok) {
      return {
        ok: false,
        errors: { a: pa.ok ? '' : pa.error, b: pb.ok ? '' : pb.error, c: pc.ok ? '' : pc.error }
      };
    }
    var s = Math.max(pa.scale, pb.scale, pc.scale);
    var A = pa.big * pow10(s - pa.scale);
    var B = pb.big * pow10(s - pb.scale);
    var C = pc.big * pow10(s - pc.scale);
    var as = fmtScaled(A, s), bs = fmtScaled(B, s), cs = fmtScaled(C, s);
    var out = { ok: true, a: as, b: bs, c: cs, steps: [], roots: [], delta: null };

    // ---- Cas a = 0 : plus une équation du second degré ----
    if (A === ZERO) {
      out.steps.push('Étape 1. Ici a = 0 : le terme en x² disparaît. L\'équation n\'est plus du second degré : elle devient ' + bs + 'x + ' + par(cs) + ' = 0.');
      if (B !== ZERO) {
        var f = fracText(-C, B);
        var x = Number(-C) / Number(B);
        out.kind = 'linear';
        out.roots = [x];
        out.steps.push('Étape 2. On isole x : x = −c / b = −' + par(cs) + ' / ' + par(bs) + '.');
        out.steps.push('Étape 3. x = ' + f + (f.indexOf('/') > -1 ? ' ≈ ' + fmtNum(x) : '') + '.');
        out.conclusion = 'Équation du premier degré : une seule solution, x = ' + f + (f.indexOf('/') > -1 ? ' (≈ ' + fmtNum(x) + ')' : '') + '.';
      } else if (C === ZERO) {
        out.kind = 'identity';
        out.steps.push('Étape 2. Comme b = 0 et c = 0, l\'équation s\'écrit 0 = 0 : elle est vraie quel que soit x.');
        out.conclusion = 'Tout nombre réel est solution (l\'équation est une identité).';
      } else {
        out.kind = 'impossible';
        out.steps.push('Étape 2. Comme a = 0 et b = 0, l\'équation s\'écrit ' + cs + ' = 0, ce qui est faux puisque c ≠ 0.');
        out.conclusion = 'Aucune solution : l\'équation est impossible.';
      }
      return out;
    }

    // ---- Cas général a ≠ 0 ----
    var D = B * B - FOUR * A * C;            // Δ × 10^(2s)
    var Ds = fmtScaled(D, 2 * s);
    out.delta = Ds;
    out.steps.push('Étape 1. On identifie les coefficients : a = ' + as + ', b = ' + bs + ', c = ' + cs + '.');
    out.steps.push('Étape 2. On calcule le discriminant Δ = b² − 4ac = ' + par(bs) + '² − 4 × ' + par(as) + ' × ' + par(cs) + ' = ' + Ds + '.');

    var S = Number(-B) / Number(A);          // somme des racines
    var P = Number(C) / Number(A);           // produit des racines
    var sp = 'Contrôle : la somme des racines vaut −b/a = ' + fmtNum(S) + ' et leur produit vaut c/a = ' + fmtNum(P) + '.';

    if (D < ZERO) {
      out.kind = 'none';
      out.steps.push('Étape 3. Δ < 0 : on ne peut pas extraire la racine carrée d\'un nombre négatif dans l\'ensemble des réels.');
      out.conclusion = 'Aucune solution réelle (Δ = ' + Ds + ' < 0). La parabole ne coupe pas l\'axe des abscisses.';
      return out;
    }

    if (D === ZERO) {
      var x0 = Number(-B) / (2 * Number(A));
      var f0 = fracText(-B, TWO * A);
      out.kind = 'double';
      out.roots = [x0];
      out.steps.push('Étape 3. Δ = 0 : il y a une racine double, donnée par x = −b / (2a) = −' + par(bs) + ' / (2 × ' + par(as) + ').');
      out.steps.push('Étape 4. x = ' + f0 + (f0.indexOf('/') > -1 ? ' ≈ ' + fmtNum(x0) : '') + '.');
      out.steps.push('Forme factorisée : ' + as + '(x − ' + par(fmtNum(x0)) + ')² = 0.');
      out.conclusion = 'Une racine double : x = ' + f0 + (f0.indexOf('/') > -1 ? ' (≈ ' + fmtNum(x0) + ')' : '') + '.';
      return out;
    }

    // Δ > 0 : deux racines réelles distinctes
    var R = isqrt(D);
    var exact = (R * R === D);               // Δ est un carré parfait ?
    var sq = Math.sqrt(Number(D)) / Math.pow(10, s);   // √Δ approché
    var sB = Number(B), sA = Number(A), sC = Number(C), sqS = Math.sqrt(Number(D));
    // Formule stable (évite la perte de précision par soustraction de nombres proches)
    var q = -(sB + (sB < 0 ? -sqS : sqS)) / 2;
    var r1 = q / sA, r2 = sC / q;
    var lo = Math.min(r1, r2), hi = Math.max(r1, r2);
    out.kind = 'two';
    out.roots = [lo, hi];
    out.steps.push('Étape 3. Δ > 0 : il y a deux solutions réelles distinctes, données par x = (−b − √Δ) / (2a) et x = (−b + √Δ) / (2a).');
    if (exact) {
      var rs = fmtScaled(R, s);
      out.steps.push('Étape 4. Δ = ' + Ds + ' est un carré parfait : √Δ = ' + rs + '.');
      var fA = fracText(-B - R, TWO * A), fB = fracText(-B + R, TWO * A);
      var xa = Number(-B - R) / Number(TWO * A), xb = Number(-B + R) / Number(TWO * A);
      var p1 = { f: fA, x: xa }, p2 = { f: fB, x: xb };
      if (p1.x > p2.x) { var tmp = p1; p1 = p2; p2 = tmp; }
      var sh = function (p) { return p.f + (p.f.indexOf('/') > -1 ? ' ≈ ' + fmtNum(p.x) : ''); };
      out.steps.push('Étape 5. On calcule (−' + par(bs) + ' − ' + rs + ') / (2 × ' + par(as) + ') et (−' + par(bs) + ' + ' + rs + ') / (2 × ' + par(as) + '). Rangées par ordre croissant, les solutions sont ' + sh(p1) + ' et ' + sh(p2) + '.');
      out.conclusion = 'Deux solutions réelles : x₁ = ' + sh(p1) + ' et x₂ = ' + sh(p2) + '.';
    } else {
      out.steps.push('Étape 4. Δ n\'est pas un carré parfait : √Δ ≈ ' + fmtNum(sq) + '.');
      out.steps.push('Étape 5. On calcule (−' + par(bs) + ' − ' + fmtNum(sq) + ') / (2 × ' + par(as) + ') et (−' + par(bs) + ' + ' + fmtNum(sq) + ') / (2 × ' + par(as) + '). Rangées par ordre croissant, les solutions sont ≈ ' + fmtNum(lo) + ' et ≈ ' + fmtNum(hi) + ' (valeurs approchées, 10 chiffres significatifs).');
      out.conclusion = 'Deux solutions réelles (valeurs approchées) : x₁ ≈ ' + fmtNum(lo) + ' et x₂ ≈ ' + fmtNum(hi) + '.';
    }
    out.steps.push('Forme factorisée : ' + as + '(x − ' + par(fmtNum(lo)) + ')(x − ' + par(fmtNum(hi)) + ') = 0.');
    out.steps.push(sp);
    return out;
  }

  var api = { solve: solve, parseNumber: parseNumber, fmtNum: fmtNum };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.RSRDC_CALC = api;
})(typeof window !== 'undefined' ? window : this);
