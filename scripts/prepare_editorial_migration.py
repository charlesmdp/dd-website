"""Explicit content release. Do not run as part of routine builds or overwrite applied SQL."""
from pathlib import Path
from bs4 import BeautifulSoup
import json,re
ROOT=Path(__file__).resolve().parents[1]
out=ROOT/'migrations/0003_editorial_refresh.sql'
if out.exists(): raise SystemExit('Migration already exists. Create a new numbered migration for the next release.')
quote=lambda v:"'"+str(v).replace("'","''")+"'"
def markdown(body):
 s=BeautifulSoup(str(body),'html.parser')
 for h in s.select('h2,h3'): h.replace_with('\n'+'#'*int(h.name[1])+' '+h.get_text(' ',strip=True)+'\n')
 for a in s.select('a[href]'):
  u=a['href'];u='https://www.bigdigitaldownload.com'+u if u.startswith('/') else u
  a.replace_with('['+a.get_text(' ',strip=True)+']('+u+')')
 for li in s.select('li'):li.insert(0,'- ')
 return s.get_text('\n',strip=True)
statements=['-- Reviewed editorial update: preserve all 40 slugs and publication states.']
for a in json.loads((ROOT/'content/blog-manifest.json').read_text()):
 s=BeautifulSoup((ROOT/'dist/blog'/a['slug']/'index.html').read_text(),'html.parser')
 body=s.select_one('article.site-prose');toc=[(x['href'][1:],x.get_text(' ',strip=True)) for x in body.select('.article-toc a') if x['href']!='#sources']
 for n in body.select('.article-plain,.article-toc'):n.decompose()
 source=body.find(id='sources')
 for n in list(source.next_siblings):n.extract()
 source.decompose()
 values={'title':a['title'],'description':a['description'],'body_html':body.decode_contents(),'body_markdown':markdown(body),'cover_path':a['cover_path'],'reading_minutes':a['minutes'],'toc_json':json.dumps(toc),'updated_at':'2026-09-22'}
 statements.append('UPDATE posts SET '+','.join(k+'='+quote(v) for k,v in values.items())+' WHERE slug='+quote(a['slug'])+';')
 statements.append('DELETE FROM post_sources WHERE post_slug='+quote(a['slug'])+';')
 for n,(label,url) in enumerate(a['sources']):statements.append('INSERT INTO post_sources(post_slug,position,label,url) VALUES('+','.join(quote(v) for v in [a['slug'],n,label,url])+');')
out.write_text('\n'.join(statements)+'\n')
print('Prepared immutable editorial migration for 40 preserved URLs.')
