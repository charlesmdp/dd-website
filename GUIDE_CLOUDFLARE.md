# Mettre BIG en ligne avec Cloudflare Pages et D1

Le dépôt contient le site complet et les 40 articles. Il reste à créer les ressources dans **ton compte Cloudflare**, à relier la base à Pages et à connecter ton domaine après vérification.

## 1. Récupérer et tester le site

Installer Node.js 22 et Python 3.11 ou plus si nécessaire, puis :

```sh
git clone https://github.com/charlesmdp/dd-website.git
cd dd-website
npm ci
npm run dev
```

Ouvrir `http://localhost:8788`. Cette prévisualisation utilise uniquement une base locale. Arrêter avec Ctrl+C.

## 2. Créer D1 dans l’Union européenne

Dans Cloudflare, ouvrir **Storage & databases → D1 SQL Database → Create database**.

- Nom : `big-digital-downloads-content`.
- Dans **Data location**, choisir **Specify jurisdiction → European Union**.
- Copier le **Database ID** obtenu.

La juridiction se choisit à la création. Elle concerne l’exécution et le stockage de **cette base de contenu** ; elle ne garantit pas que tout le site, le CDN, les journaux ou les données de l’app Shopify restent dans l’UE. C’est pour cela que la bannière du site dit que BIG est créé dans l’UE et porte attention aux données, sans promettre un hébergement intégralement européen. [Documentation Cloudflare sur la localisation D1](https://developers.cloudflare.com/d1/configuration/data-location/).

Alternative en ligne de commande, après connexion :

```sh
npx wrangler login
npx wrangler d1 create big-digital-downloads-content --jurisdiction=eu
```

## 3. Importer les 40 articles

Depuis le dossier du dépôt :

```sh
npx wrangler login
npm run db:configure -- REMPLACER_PAR_LE_DATABASE_ID
npm run db:remote
```

La première commande ouvre la connexion Cloudflare. La deuxième crée `wrangler.production.jsonc`, un fichier local ignoré par Git. La troisième applique les deux migrations : structure de la base puis import des 40 articles, catégories et sources. Relancer cette commande n’importe pas les articles une seconde fois.

**Ne pas modifier les migrations déjà appliquées.** Les mises à jour d’articles se font ensuite avec le script ci-dessous ou D1 Studio. Une évolution du schéma se fait dans une nouvelle migration numérotée. [Documentation sur les migrations](https://developers.cloudflare.com/d1/reference/migrations/).

## 4. Relier GitHub à Cloudflare Pages

Dans **Workers & Pages**, créer un projet **Pages** avec l’intégration Git, puis sélectionner `charlesmdp/dd-website`.

| Réglage | Valeur |
|---|---|
| Branche de production | `main` |
| Framework preset | `None` |
| Root directory | Racine du dépôt, laisser vide |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Variable de build `NODE_VERSION` | `22.22.3` |
| Variable de build `PYTHON_VERSION` | `3.13.3` |
| Date de compatibilité des Functions | `2026-09-22` |

Le build installe sa dépendance Python dans un environnement isolé, génère le site et le Worker Pages. Cloudflare installe les dépendances npm à partir du dépôt. Aucun secret Cloudflare ne doit être placé dans les variables de build pour cette intégration Git. [Intégration GitHub](https://developers.cloudflare.com/pages/configuration/git-integration/github-integration/) · [Environnement de build](https://developers.cloudflare.com/pages/configuration/build-image/).

Dans le projet Pages : **Settings → Bindings → Add → D1 database**.

- Nom de la variable : **`DB`**, exactement en majuscules.
- Base : **`big-digital-downloads-content`**.
- Environnement : **Production**.
- Enregistrer, puis relancer le déploiement.

Pour Preview, utiliser une seconde base de test si tu souhaites tester D1 sur les branches. Sans binding, la version statique initiale reste consultable ; `/api/health` signale alors `not_bound`. Avec un binding cassé ou une base sans tables, le journal répond en erreur temporaire 503, sans masquer le problème avec des articles périmés. [Bindings Pages](https://developers.cloudflare.com/pages/functions/bindings/).

La configuration Pages est gérée dans le tableau de bord. Ne renomme pas `wrangler.production.jsonc` en `wrangler.jsonc` : ce fichier sert aux opérations D1, pas à remplacer les réglages Pages.

## 5. Vérifier avant de connecter le domaine

Sur l’adresse `*.pages.dev` créée par Cloudflare :

1. Ouvrir `/api/health` : attendre `ok: true`, `database: ready` et `publishedArticles: 40`.
2. Ouvrir `/blog`, un article, puis son équivalent avec `.md` à la fin de l’adresse.
3. Vérifier la homepage, le menu mobile, un comparatif, la page de filigrane PDF et une adresse inexistante.
4. Ouvrir `/sitemap.xml` : les articles publiés doivent y figurer.
5. Vérifier que les nouvelles modifications D1 apparaissent sans reconstruire le site.

Les domaines de prévisualisation portent automatiquement `X-Robots-Tag: noindex, follow`. La référence canonique du site reste **`https://www.bigdigitaldownload.com`**.

Lorsque cette version est validée, ajouter **`www.bigdigitaldownload.com`** dans **Pages → Custom domains**, puis suivre les instructions DNS affichées par Cloudflare. Configurer la redirection de `bigdigitaldownload.com` vers `www.bigdigitaldownload.com` si nécessaire. Le site existant reste en place tant que tu n’as pas changé le raccordement du domaine. [Domaines personnalisés Pages](https://developers.cloudflare.com/pages/configuration/custom-domains/).

Enfin, connecter Google Search Console au domaine et envoyer `https://www.bigdigitaldownload.com/sitemap.xml`. Les URL d’articles existantes ont été conservées ; les futurs changements de slug demandent une redirection.

## Écrire ou modifier un article

D1 contient les tables `posts`, `categories`, `post_sources` et `redirects`. Les images restent dans `public/assets/` pour profiter de la distribution des fichiers statiques.

La méthode recommandée est le script d’édition : il met à jour ensemble le HTML, le Markdown, le sommaire, la durée de lecture et les sources.

1. Copier `content/article-example.json` dans un nouveau fichier JSON.
2. Remplir le titre, la description, la catégorie, le contenu `body_html` et les sources.
3. Conserver le même `slug` pour modifier un article existant.
4. Choisir `draft` ou `published`. Une image nouvelle doit être ajoutée sous `public/assets/` et livrée via GitHub avant de publier son article.

Tester dans la base locale :

```sh
npm run content:save -- content/mon-article.json
npm run preview
```

Enregistrer dans la base Cloudflare configurée :

```sh
npm run content:save -- content/mon-article.json --remote
```

Un brouillon n’apparaît ni dans le journal ni dans le sitemap ni dans les documents IA ; son adresse retourne 404. Le script accepte des paragraphes, titres, listes, liens HTTPS, tableaux et mise en forme courante. Le site n’expose aucune route d’édition publique. Les personnes autorisées à modifier D1 doivent être des membres de confiance de ton équipe.

Il est aussi possible de modifier une ligne dans **D1 Studio**. Pour une modification du contenu, il faut alors synchroniser `body_html`, `body_markdown` et `toc_json` ; le script évite cet oubli. Les changements de titre, description ou statut sont immédiats.

Pour une ancienne adresse de blog, ajouter une ligne dans `redirects`, avec `source_path`, `target_path` et `status_code: 301`. Préserver une cible interne au site et éviter les boucles.

## Sauvegarde et maintenance

Avant une modification importante :

```sh
npx wrangler d1 export DB --remote --config wrangler.production.jsonc --output content-backup.sql
```

Conserver cette sauvegarde hors du dépôt public. Les mises à jour GitHub déploient le code et les images ; elles ne remettent pas la base à zéro. Les nouvelles migrations D1 sont appliquées explicitement avec `npm run db:remote`.

Le journal utilise un rendu HTML côté serveur, avec métadonnées et données structurées. Les images utilisent le chargement différé lorsque pertinent. Les assets échappent au Worker ; les pages du journal et leur sitemap sont servis à partir de D1. Les capacités originales de la homepage et leurs animations sont conservées, ce qui garde un code plus volumineux qu’une réécriture complète.

## Ce qui reste à confirmer côté entreprise

- Le délai réel de conservation après désinstallation : les textes juridiques d’origine contiennent des délais divergents. Leur mise en page a été refaite, sans inventer de nouvel engagement.
- Search Console : les 40 articles ont été repris, mais aucune sélection par trafic réel n’a pu être faite sans cette connexion.
- Pendora : les sources publiques ne prouvent ni des limites d’upload « minuscules », ni une copie, ni un futur passage payant. Le site présente les limites non publiées, les captures authentiques et le témoignage daté relatif à Pumper avec son contexte.
