from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit,unquote
import json,re,gzip,sys
root=Path(__file__).resolve().parents[1];dist=root/'dist';issues=[];cache={}
for p in dist.rglob('*.html'):
 s=BeautifulSoup(p.read_text(),'html.parser');cache[p]=s
 assert s.select_one('meta[name=description]'),p
 assert s.select_one('link[rel=canonical]'),p
 for ld in s.select('script[type="application/ld+json"]'):json.loads(ld.string)
 if len(s.select('h1'))!=1:issues.append((str(p),'H1 count'))
 for e in s.select('img[src],script[src],link[href],a[href]'):
  u=e.get('src') or e.get('href');parts=urlsplit(u)
  if not u.startswith('/') or u.startswith('//'):continue
  path=unquote(parts.path);target=dist/path.lstrip('/')
  if target.is_dir():target=target/'index.html'
  if not target.exists():issues.append((p.relative_to(dist).as_posix(),u))
  if e.name=='img' and not e.has_attr('alt'):issues.append((str(p),'missing alt'))
 if p!=dist/'index.html' and len(s.select('a[href="https://x.com/charlesmdp"]'))!=1:issues.append((str(p),'X count'))
# Validate all old public page paths are retained or deliberately redirected.
import xml.etree.ElementTree as ET
original=root/'content/original-sitemap.xml'
for loc in ET.parse(original).getroot().iter():
 if not loc.tag.endswith('loc'):continue
 path=urlsplit(loc.text).path
 if path=='/llms-txt':continue
 target=dist/path.strip('/')/'index.html' if path!='/' else dist/'index.html'
 if not target.exists():issues.append(('old route missing',path))
# Validate references to same-page and cross-page anchors.
for p,s in cache.items():
 for a in s.select('a[href]'):
  u=a['href'];parts=urlsplit(u)
  if not parts.fragment or parts.scheme or not (u.startswith('/') or u.startswith('#')):continue
  target=p if not parts.path else dist/unquote(parts.path).lstrip('/')
  if target.is_dir():target=target/'index.html'
  if target in cache and not cache[target].find(id=parts.fragment):issues.append((p.relative_to(dist).as_posix(),'missing anchor '+u))
assert len(list((dist/'assets/editorial').glob('*.webp')))==60
assert len(json.loads((root/'content/blog-manifest.json').read_text()))==40
manifest=json.loads((root/'content/page-manifest.json').read_text());assert len(manifest)==106
assert len([x for x in manifest if x.startswith('/big-digital-downloads-vs-')])==9
assert len([x for x in manifest if x.endswith('-alternatives')])==9
assert len([x for x in manifest if x.startswith('/tools/')])==26
assert len([x for x in manifest if x.startswith('/sell-')])==9
tool_paths={path for path in manifest if path.startswith('/tools/')}
for p,s in cache.items():
 footer=s.select_one('footer .footer-tools-links')
 assert footer and {a['href'] for a in footer.select('a[href]')}==tool_paths, (p,'tool footer')
for path in tool_paths:
 s=cache[dist/path.strip('/')/'index.html']
 faq=json.loads(next(ld.string for ld in s.select('script[type="application/ld+json"]') if json.loads(ld.string).get('@type')=='FAQPage'))
 visible=[(d.summary.get_text(' ',strip=True).removesuffix(' +'),d.p.get_text(strip=True)) for d in s.select('.ws-faq-list details')]
 assert len(visible)>=3 and visible==[(q['name'],q['acceptedAnswer']['text']) for q in faq['mainEntity']],path
 assert s.select_one('form') and len(s.select('.ws-learn ol li'))==3 and s.select_one('.ws-example p'),path
assert (dist/'index.html').stat().st_size<700000
assert not cache[dist/'index.html'].select('#pricing,#faq')
if issues:
 print(json.dumps(issues[:40],indent=2));print('issues',len(issues));sys.exit(1)
print('Validated 106 indexable pages, 40 preserved blog routes, 9 comparisons, 9 alternatives, 26 tools, 60 images. Local links, image refs, schemas and anchors pass.')
sizes={p.relative_to(dist).as_posix():len(gzip.compress(p.read_bytes())) for p in [dist/'features/index.html',dist/'blog/index.html',dist/'index.html',dist/'assets/site.css',dist/'assets/site.js']}
print('Gzip sizes in bytes:',sizes)
