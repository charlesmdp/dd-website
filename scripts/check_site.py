from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit
import re,json

root=Path(__file__).resolve().parents[1]/'dist'
text=(root/'index.html').read_text()
assert '<html lang="en">' in text
assert 'rel="canonical" href="https://www.bigdigitaldownload.com/"' in text
assert 'data:framer/asset-reference' not in text
expected=['hero','features','features-1','key-features','how-to-download','use-cases','testimonials','reviews','pricing','faq','faqs']
for section in expected: assert f'id="{section}"' in text,section
for raw in re.findall(r'<script type="application/ld\+json">(.*?)</script>',text,re.S):
    schema=json.loads(raw)
    assert schema['@context']=='https://schema.org'

class Links(HTMLParser):
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        for key in ('src','href'):
            u=a.get(key,'')
            if u.startswith('/assets/'):
                assert (root/urlsplit(u).path.lstrip('/')).is_file(),u
        if tag=='a':
            u=a.get('href','')
            assert not u.startswith('./') or u=='./',u
            if u.startswith('#'): assert f'id="{u[1:]}"' in text,u
Links().feed(text)
modules=list((root/'assets/runtime').glob('*.mjs'))
for p in modules:
    s=p.read_text()
    for spec in re.findall(r'(?:from\s*|import\s*|import\()[\"\'`]([^\"\'`]+\.mjs)[\"\'`]',s):
        if spec.startswith('./'): assert (p.parent/spec).is_file(),(p.name,spec)
    assert 'data:framer/asset-reference' not in s,p.name
print(json.dumps({'status':'passed','sections':len(expected),'runtime_modules':len(modules),'local_assets':sum(p.is_file() for p in (root/'assets').rglob('*')),'structured_data':'valid JSON','canonical':'https://www.bigdigitaldownload.com/'}))
