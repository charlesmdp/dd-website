# BIG Digital Downloads

Site marketing et journal de BIG Digital Downloads, prêt pour **Cloudflare Pages + D1**.

**Commencer par [GUIDE_CLOUDFLARE.md](GUIDE_CLOUDFLARE.md)** pour la mise en ligne, la base européenne et la gestion des articles.

## Ce qui est inclus

- Homepage avec menu flottant, hero et animations d’origine, nouvelle section de confiance.
- Fonctionnalités, FAQ, partenaires, pages juridiques et 404.
- 9 comparatifs, 9 pages d’alternatives, logos réels et illustrations.
- 40 articles réécrits et illustrés, aux adresses d’origine, rendus en HTML depuis D1.
- 6 outils gratuits qui fonctionnent dans le navigateur.
- Sitemap, robots, métadonnées, données structurées, Markdown et références pour lecteurs IA.
- Sources documentées pour la comparaison Pendora, avec images officielles intactes.

## Développement local

Prérequis : Node.js 22+, npm 10+, Python 3.11+ avec `venv` et `pip`.

```sh
npm ci
npm run dev
```

Ouvrir `http://localhost:8788`. La commande construit le site, initialise une **base locale** et démarre Pages. Aucun compte Cloudflare n’est nécessaire pour ce test.

```sh
npm run build
npm run check
```

Le build valide les 77 pages et les liens locaux. Les tests démarrent un vrai environnement local Pages/D1 isolé, vérifient les 40 articles, les modifications sans reconstruction, les brouillons, les redirections, le sitemap et les erreurs 404.

## Organisation

| Dossier | Contenu |
|---|---|
| `public/assets/` | Images, logos, polices, styles, outils, animations locales |
| `scripts/` | Génération du site, export Cloudflare, édition d’articles |
| `content/` | Sources initiales, données produit et comparatifs |
| `migrations/` | Schéma D1 et import initial des 40 articles |
| `cloudflare/worker.mjs` | Rendu serveur du journal et des documents dynamiques |
| `dist/` | Résultat prêt pour Pages, généré et non versionné |

Les contenus du journal en ligne viennent de D1. Les migrations initiales sont appliquées une seule fois : une nouvelle livraison du site ne remplace pas les modifications éditoriales de la base. Les fichiers du produit Shopify et les données de ses clients ne passent pas dans cette base.

L’administration passe par Cloudflare D1 Studio ou le script d’édition fourni ; aucun formulaire public n’écrit dans D1.

## Notes éditoriales

Les comparatifs sont publiés par BIG, à partir de sources publiques datées du 22 septembre 2026. Les limites non documentées ne sont pas présentées comme des fonctions absentes. Les éléments de recherche Pendora figurent dans `content/research/`.

Les 40 articles ont été repris, mais ils ne constituent pas un « top 30 Search Console » : aucun accès Search Console n’était disponible. Les politiques juridiques originales sont conservées ; leurs divergences sur les délais de conservation restent à clarifier avec l’équipe avant modification des engagements.

Les logos appartiennent à leurs titulaires. Leur présence dans un comparatif ne signifie pas qu’ils approuvent BIG. Les mentions de marques clientes reprennent les indications du propriétaire du site.
