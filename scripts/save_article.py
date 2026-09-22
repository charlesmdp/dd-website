"""Create/update an editorial record. Local by default; remote is explicit."""
from pathlib import Path
from bs4 import BeautifulSoup
import argparse, json, re, datetime, subprocess, tempfile

ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser()
parser.add_argument('file',type=Path)
parser.add_argument('--remote',action='store_true')
parser.add_argument('--persist-to',type=Path)
args=parser.parse_args()
if args.remote and args.persist_to: raise SystemExit('A persistence directory is local-only.')
data=json.loads(args.file.read_text())
slug=data['slug']
if not re.fullmatch(r'[a-z0-9().-]{1,180}',slug) or slug.endswith('.md'):
    raise SystemExit('Invalid slug. Preserve existing URLs when updating an article.')
status=data.get('status','draft')
if status not in ['draft','published']: raise SystemExit('Status must be draft or published.')
cover=data['cover_path']
if not re.fullmatch(r'/assets/[a-zA-Z0-9_./-]+',cover) or '..' in cover or not (ROOT/'public'/cover.lstrip('/')).is_file():
    raise SystemExit('cover_path must reference an existing public/assets file.')
date=data.get('updated_at',datetime.date.today().isoformat())
datetime.date.fromisoformat(date)
title=data['title'].strip();description=data['description'].strip()
if not title or not description: raise SystemExit('Title and description are required.')
category=data['category'].strip()
category_slug=re.sub('[^a-z0-9]+','-',category.lower()).strip('-')
if not category_slug: raise SystemExit('Category is required.')
soup=BeautifulSoup(data['body_html'],'html.parser')
allowed={'p','h2','h3','strong','em','a','ul','ol','li','blockquote','code','pre','br','table','thead','tbody','tr','th','td'}
for element in soup.find_all(True):
    if element.name not in allowed: raise SystemExit('Unsupported editorial HTML tag: '+element.name)
    for key in element.attrs:
        if key not in ['href','id','scope']: raise SystemExit('Unsupported HTML attribute: '+key)
    if element.has_attr('href') and not re.match(r'^(https://|/(?!/)|#)',element['href']): raise SystemExit('Unsafe link')
toc=[]
for i,h in enumerate(soup.select('h2,h3')):
    h['id']='section-'+str(i+1);toc.append([h['id'],h.get_text(' ',strip=True)])
body_html=str(soup)
for h in soup.select('h2,h3'):
    h.replace_with('\n'+'#'*int(h.name[1])+' '+h.get_text(' ',strip=True)+'\n')
for a in soup.select('a[href]'):
    href=a['href'];href='https://www.bigdigitaldownload.com'+href if href.startswith('/') else href
    a.replace_with('['+a.get_text(' ',strip=True)+']('+href+')')
for li in soup.select('li'):li.insert(0,'- ')
markdown=soup.get_text('\n',strip=True)
minutes=max(1,round(len(soup.get_text(' ',strip=True).split())/220))
quote=lambda value:"'"+str(value).replace("'","''")+"'"
values=[slug,title,description,category_slug,body_html,markdown,cover,data.get('author','The BIG team'),date,minutes,json.dumps(toc),status,int(data.get('sort_order',100))]
columns='slug,title,description,category_slug,body_html,body_markdown,cover_path,author,updated_at,reading_minutes,toc_json,status,sort_order'
sql=f'INSERT INTO categories(slug,name) VALUES({quote(category_slug)},{quote(category)}) ON CONFLICT(slug) DO UPDATE SET name=excluded.name;\n'
sql+='INSERT INTO posts('+columns+') VALUES('+','.join(map(quote,values))+') ON CONFLICT(slug) DO UPDATE SET '+','.join(c+'=excluded.'+c for c in columns.split(',')[1:])+';\n'
sql+='DELETE FROM post_sources WHERE post_slug='+quote(slug)+';\n'
for i,source in enumerate(data.get('sources',[])):
    if not source['url'].startswith('https://'):raise SystemExit('Sources need HTTPS URLs.')
    sql+='INSERT INTO post_sources VALUES('+','.join(map(quote,[slug,i,source['label'],source['url']]))+');\n'
config='wrangler.production.jsonc' if args.remote else 'wrangler.local.jsonc'
if not (ROOT/config).exists():raise SystemExit('Run npm run db:configure first.')
with tempfile.TemporaryDirectory(prefix='bdd-editorial-') as temporary:
    file=Path(temporary)/'article.sql';file.write_text(sql)
    subprocess.run([str(ROOT/'node_modules/.bin/wrangler'),'d1','execute','DB','--remote' if args.remote else '--local','--config',config,'--file',str(file)]+(['--persist-to',str(args.persist_to)] if args.persist_to else []),cwd=ROOT,check=True)
print(('Remote' if args.remote else 'Local')+' article saved: '+slug+' ('+status+')')
