import runpy,html
from bs4 import BeautifulSoup

def enrich(i,content,g):
 e=html.escape; extra=runpy.run_path(str(g['CONTENT']/'blog-enrichment.py'))['EXTRAS']; data=runpy.run_path(str(g['CONTENT']/'selling-guides.py'))['GUIDES']; by={x['key']:x for x in data}
 mapping={3:'ebooks',4:'pdfs',15:'license-keys',18:'digital-art',19:'canva-templates',20:'ebooks',21:'ebooks',22:'license-keys',23:'digital-art',24:'music',25:'music',26:'canva-templates',27:'online-courses',28:'pdfs',30:'canva-templates',31:'software',33:'pdfs',34:'pdfs',38:'pdfs'}
 d=by.get(mapping.get(i)); art=d['art'] if d else 'delivery-studio'; alt='Illustration of '+(d['name']+' prepared for delivery' if d else 'a purchase flowing from a digital store to a delivery email')
 illustration=f'<figure class="article-figure"><img src="/assets/editorial/v4/{art}.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="{e(alt)}"><figcaption>{e(d["detail"]) if d else "A successful digital purchase connects the offer, payment, delivery and first use."} Concept illustration.</figcaption></figure>'
 s=BeautifulSoup(content,'html.parser'); target=s.find(id='section-2')
 if i in extra: illustration=illustration.replace('/assets/editorial/v4/'+art+'.webp','/assets/editorial/blog--'+__import__('json').loads((g['CONTENT']/'original-blog.json').read_text())[i]['slug']+'.webp')
 target.insert_before(BeautifulSoup(illustration,'html.parser'))
 # Deeper practical chapters before the existing checklist; retain source URL and subject.
 anchor=s.find(id='action-plan')
 additions=''.join(f'<h2 id="practical-{n+1}">{e(h)}</h2><p>{e(t)}</p>' for n,(h,t) in enumerate(extra.get(i,[])))
 if d:
  additions+=f'<h2 id="worked-example">A concrete product example</h2><div class="article-example"><span class="site-kicker">Illustrative product · {e(d["name"])}</span><h3>{e(d["example"])}</h3><p>{e(d["detail"])}</p><ul>'+''.join(f'<li><code>{e(f)}</code></li>' for f in d['files'])+f'</ul><p><a href="/sell-{d["key"]}-on-shopify">Explore selling {e(d["name"])} with BIG →</a></p></div>'
 else:
  additions+='<h2 id="worked-example">Make the decision visible</h2><div class="article-flow" aria-label="Four steps from an offer to a useful product"><div><b>01</b><strong>The offer</strong><span>What exactly is included?</span></div><div><b>02</b><strong>The purchase</strong><span>What does the buyer pay?</span></div><div><b>03</b><strong>The delivery</strong><span>When and how does it arrive?</span></div><div><b>04</b><strong>The first use</strong><span>Can the buyer get started?</span></div></div>'
 anchor.insert_before(BeautifulSoup(additions,'html.parser'))
 toc=[(h['id'],h.get_text(' ',strip=True)) for h in s.select('h2[id]')]
 return str(s),toc,('/assets/editorial/v4/'+art+'.webp') if i in extra else None
