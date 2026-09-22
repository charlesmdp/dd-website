"""Package the existing design and import the 40 articles into D1 once."""
from pathlib import Path
from bs4 import BeautifulSoup
import json, re, runpy, hashlib

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
CONTENT = ROOT / 'content'
g = runpy.run_path(str(ROOT / 'scripts/build_site.py'))
manifest = json.loads((CONTENT / 'blog-manifest.json').read_text())
pages = json.loads((CONTENT / 'page-manifest.json').read_text())

def sql(value):
    return "'" + str(value).replace("'", "''") + "'"

def category_slug(name):
    return re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-')

def markdown_body(body):
    plain = BeautifulSoup(str(body), 'html.parser')
    for h in plain.select('h1,h2,h3'):
        h.replace_with('\n'+'#'*int(h.name[1])+' '+h.get_text(' ',strip=True)+'\n')
    for a in plain.select('a[href]'):
        url=a['href']; url=g['BASE']+url if url.startswith('/') else url
        a.replace_with('['+a.get_text(' ',strip=True)+']('+url+')')
    for li in plain.select('li'): li.insert(0,'- ')
    return plain.get_text('\n',strip=True)

# A numbered migration is immutable after deployment. Rebuilds never overwrite it.
seed = ROOT / 'migrations/0002_seed_articles.sql'
if not seed.exists():
    statements = ['-- Initial editorial library: imported once; later builds do not overwrite D1 edits.']
    for name in sorted(set(a['category'] for a in manifest)):
        statements.append(f'INSERT INTO categories(slug,name) VALUES ({sql(category_slug(name))},{sql(name)});')
    for index, article in enumerate(manifest):
        slug = article['slug']
        soup = BeautifulSoup((DIST / 'blog' / slug / 'index.html').read_text(), 'html.parser')
        body = soup.select_one('article.site-prose')
        body.select_one('.article-plain').decompose()
        # Sources are normalised in their own table and rendered from there.
        source_heading = body.find(id='sources')
        if source_heading:
            for node in list(source_heading.next_siblings): node.extract()
            source_heading.decompose()
        toc = [(a['href'][1:], a.get_text(' ', strip=True)) for a in soup.select('.site-toc a') if a['href'] != '#sources']
        columns = 'slug,title,description,category_slug,body_html,body_markdown,cover_path,author,updated_at,reading_minutes,toc_json,status,sort_order'
        values = [slug,article['title'],article['description'],category_slug(article['category']),body.decode_contents(),markdown_body(body),'/assets/editorial/blog--'+slug+'.webp','The BIG team','2026-09-22',article['minutes'],json.dumps(toc),'published',index]
        statements.append('INSERT INTO posts('+columns+') VALUES ('+','.join(sql(v) for v in values)+');')
        for position,(label,url) in enumerate(article['sources']):
            statements.append('INSERT INTO post_sources(post_slug,position,label,url) VALUES ('+','.join(sql(v) for v in [slug,position,label,url])+');')
    seed.write_text('\n'.join(statements)+'\n')

short_ai = (DIST / 'llms.txt').read_text().split('## Pages')[0]
static_pages = {p: data for p,data in pages.items() if not p.startswith('/blog/')}
static_files={}
internal=DIST/'_html'; internal.mkdir(exist_ok=True)
for path in pages:
    original=DIST/('index.html' if path=='/' else path.strip('/')+'/index.html')
    filename=hashlib.sha256(path.encode()).hexdigest()[:16]+'.data'
    (internal/filename).write_bytes(original.read_bytes())
    static_files[path]='/_html/'+filename
config = {
    'base': g['BASE'], 'version': g['ASSET_VERSION'], 'header': g['header'](),
    'footer': g['footer'](), 'cta': g['cta'](), 'pages': static_pages, 'staticFiles':static_files,
    'shortAI': short_ai,
    'fullStaticText': '\n\n'.join((DIST/(p.strip('/')+'.md')).read_text() for p in static_pages if p not in ['/','/blog'] and (DIST/(p.strip('/')+'.md')).exists()),
}
worker = 'const CONFIG = '+json.dumps(config,ensure_ascii=False)+';\n'+(ROOT/'cloudflare/worker.mjs').read_text()
(DIST/'_worker.js').write_text(worker)
(DIST/'_routes.json').write_text(json.dumps({'version':1,'include':['/*'],'exclude':['/assets/*']},indent=2)+'\n')
print('Prepared Cloudflare Pages worker and D1 migrations for 40 articles.')
