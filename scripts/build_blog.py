import json,html,re,runpy,math
from bs4 import BeautifulSoup

def build(g):
 original=json.loads((g['CONTENT']/'original-blog.json').read_text());editorial=runpy.run_path(str(g['CONTENT']/'blog-editorial.py'))['ARTICLES'];assert len(original)==len(editorial)==40
 articles=[];page=g['page'];esc=html.escape
 sources={
 3:[('Amazon KDP Select exclusivity','https://kdp.amazon.com/en_US/select')],21:[('Amazon KDP Select exclusivity','https://kdp.amazon.com/en_US/select')],
 10:[('Rockstar Games: GTA VI','https://www.rockstargames.com/VI')],11:[('Rockstar Games: GTA VI','https://www.rockstargames.com/VI')],
 19:[('Canva: products for sale','https://www.canva.com/help/using-canva-to-create-products-for-sale/'),('Canva licensing explained','https://www.canva.com/licensing-explained/')],
 30:[('Canva licensing explained','https://www.canva.com/licensing-explained/')],26:[('Notion: selling on Marketplace','https://www.notion.com/help/selling-on-marketplace')],
 23:[('Adobe: Lightroom presets','https://helpx.adobe.com/lightroom-cc/using/add-sync-mobile-presets.html')],39:[('Google: email sender guidelines','https://support.google.com/a/answer/81126?hl=en')],
 32:[('Shopify: discounts','https://help.shopify.com/en/manual/discounts')],
 17:[('BIG: reducing file sharing',g['DOCS']+'/most-asked-questions/how-to-prevent-the-sharing-of-digital-files')],33:[('BIG: reducing file sharing',g['DOCS']+'/most-asked-questions/how-to-prevent-the-sharing-of-digital-files')],34:[('BIG: PDF stamping and file sharing',g['DOCS']+'/most-asked-questions/how-to-prevent-the-sharing-of-digital-files')]
 }
 compare_ids={1:'shopify-digital-downloads',2:'ldt-digital-downloads',5:'sendowl',6:'sky-pilot',7:'fileflare',8:'shopify-digital-downloads',36:'shopify-digital-downloads',37:'shopify-digital-downloads'}
 competitor_data=json.loads((g['CONTENT']/'competitors.json').read_text())
 for i,old in enumerate(original):
  title,category,lead,sections=editorial[i];slug=old['slug'];path='/blog/'+slug
  sections=list(sections)
  if i not in compare_ids:
   if category in ['Software & licences','Design & templates','Ebooks & PDFs','Music & courses','Delivery']:
    steps=[('Prepare the deliverable','Keep an original backup and publish a clear version. List the formats, compatibility and licence scope before the customer purchases.'),('Connect and test in Shopify','Map the file, link or key to the right product and variant. Use the appropriate standard, custom or scheduled delivery mode. Check a controlled purchase on desktop and mobile.'),('Choose capacity and monitor it','Use catalogue size and expected monthly transfer to choose a plan. Track actual usage and support questions after launch, especially before a promotion.')]
   else:
    steps=[('Define the test','Choose one audience, one outcome and a small complete product. Write down what result would justify another version before spending on a larger launch.'),('Make the offer reviewable','Show a sample and state what is included, what it requires and when it arrives. If taking preorders, make the delay explicit and test the scheduled delivery settings.'),('Review real results','Use purchases, contribution after costs and customer feedback. Revise the offer or stop the experiment if the evidence does not support expanding it.')]
  else:
   steps=[('Write your acceptance checklist','List every required file type, delivery mode, protection option and integration. Separate must-have capabilities from attractive extras.'),('Test your own workload','Use the same product and customer journey across the shortlisted apps. Include your largest realistic file, a mobile download and an existing-order scenario if migrating.'),('Price a normal and peak month','Use stored GB, transferred GB, order count and any provider-specific sales caps. Confirm the current billing screen and migration terms before committing.')]
  setup='<h2 id="action-plan">Your practical action plan</h2><ol>'+''.join(f'<li><strong>{h}.</strong> {t}</li>' for h,t in steps)+'</ol>'
  checklist='<h2 id="before-launch">Before you publish</h2><div class="site-highlight"><ul><li>The product page matches the actual files, access and timing.</li><li>A sample or preview reflects the product customers receive.</li><li>The purchase, email and mobile access route have been tested.</li><li>Compatibility, licence terms and support contact are easy to find.</li><li>Capacity and costs have been checked against the current plan.</li></ul></div>'
  # The old URLs remain stable while obsolete anecdotes and unverified numbers are replaced.
  content='<p class="site-lead">'+lead+'</p>'
  toc=[]
  for n,(h,t) in enumerate(sections):
   anchor='section-'+str(n+1);toc.append((anchor,h));content+=f'<h2 id="{anchor}">{esc(h)}</h2><p>{esc(t)}</p>'
  content+=setup+checklist;toc.extend([('action-plan','Your practical action plan'),('before-launch','Before you publish')])
  if i in compare_ids:
   key=compare_ids[i];d=next(x for x in competitor_data if x['slug']==key)
   content+=f'<h2 id="current-comparison">Keep the comparison current</h2><p>Our permanent <a href="/big-digital-downloads-vs-{key}">BIG vs {esc(d["name"])} comparison</a> shows documented features and monthly usage examples. For a broader shortlist, see the <a href="/best-shopify-digital-download-apps">Shopify digital download app guide</a>.</p><p>Published by BIG Digital Downloads. This is an editorial guide, not an independent benchmark. A feature absent from a listing is treated as not stated, not automatically unavailable.</p>'
   sources.setdefault(i,[]).append((d['name']+' official listing',d['source']))
  else:
   content+='<h2 id="where-big-fits">Where BIG fits</h2><p>BIG connects Shopify products with digital files, links and licence keys. It supports standard, custom and scheduled products. Paid plans include unlimited order counts, with plan-specific storage and bandwidth; API access and outgoing webhooks require Growth or Enterprise.</p><p><a href="/features">Explore the features</a>, <a href="/#plans">check the plans</a> or <a href="/tools">prepare your next launch with the free tools</a>.</p>'
  article_sources=[('Shopify: selling digital products','https://help.shopify.com/en/manual/products/digital-service-product'),('BIG: official Shopify listing',g['APP'])]+sources.get(i,[])
  if i in [1,2,6]:article_sources.extend((d['name']+' official listing',d['source']) for d in competitor_data if d['slug'] in ['filemonk','fileflare','ldt-digital-downloads','easy-digital-products','sendowl'])
  if i==5:article_sources.append(('SendOwl official pricing','https://www.sendowl.com/pricing?hideAnnualPlans=true'))
  content+='<h2 id="sources">Sources & review</h2><p>Updated 22 September 2026 by the BIG Digital Downloads team. Product capabilities and prices can change; check the official source before choosing a subscription. Examples are illustrative, not customer results or income guarantees.</p><ul>'+''.join(f'<li><a href="{esc(u,quote=True)}" rel="noopener">{esc(label)}</a></li>' for label,u in article_sources)+'</ul>';toc.append(('sources','Sources & review'))
  count=len(BeautifulSoup(content,'html.parser').get_text(' ',strip=True).split());mins=max(3,math.ceil(count/220))
  a={'slug':slug,'title':title,'category':category,'description':lead,'content':content,'toc':toc,'minutes':mins,'words':count,'sources':article_sources};articles.append(a)
 def card(a):return f'<a class="site-blog-card" data-search="{esc((a["title"]+" "+a["description"]).lower(),quote=True)}" data-category="{esc(a["category"],quote=True)}" href="/blog/{a["slug"]}"><img src="/assets/editorial/blog--{a["slug"]}.webp" alt="" width="1536" height="1024" loading="lazy" decoding="async"><div class="text"><small>{a["category"]} · {a["minutes"]} min read</small><h3>{esc(a["title"])}</h3><p>{esc(a["description"])}</p><span class="read">Read the guide →</span></div></a>'
 for a in articles:
  path='/blog/'+a['slug'];toc='<aside class="site-toc"><strong>In this guide</strong>'+''.join(f'<a href="#{i}">{esc(t)}</a>' for i,t in a['toc'])+'</aside>'
  body=f'<div class="reading-progress" aria-hidden="true"></div><header class="article-hero"><div class="site-wrap"><div class="site-breadcrumb"><a href="/">Home</a> / <a href="/blog">The BIG journal</a> / {a["category"]}</div><div class="article-heading-grid"><div><span class="site-kicker">{a["category"]}</span><h1>{esc(a["title"])}</h1><div class="article-byline"><img src="/assets/media/3aed8c41fe6de0b62874.png" width="40" height="40" alt=""><div><strong>The BIG team</strong><span>22 Sep 2026 · {a["minutes"]} min read</span></div></div></div><img class="article-cover" src="/assets/editorial/blog--{a["slug"]}.webp" width="1536" height="1024" alt="" fetchpriority="high"></div></div></header><div class="site-wrap article-content-wrap"><div class="site-editorial"><article class="site-prose">{a["content"]}<p class="article-plain"><a href="{path}.md">Read this guide as plain text {g["icon"]("arrow")}</a></p></article>{toc}</div></div>'
  related=[x for x in articles if x['category']==a['category'] and x!=a][:3]
  body+=g['section']('Keep learning','A useful next read.','<div class="site-grid">'+''.join(card(x) for x in related)+'</div>',soft=True)+g['cta']()
  ld={'@context':'https://schema.org','@type':'BlogPosting','headline':a['title'],'description':a['description'],'dateModified':'2026-09-22','author':{'@type':'Organization','name':'BIG Digital Downloads team','url':g['BASE']+'/ai'},'publisher':{'@type':'Organization','name':'BIG Digital Downloads','url':g['BASE']},'mainEntityOfPage':g['BASE']+path,'image':g['BASE']+'/assets/editorial/blog--'+a['slug']+'.webp'}
  page(path,a['title']+' | BIG',a['description'],body,g['schema'](ld))
 categories=sorted(set(a['category'] for a in articles))
 featured=articles[20]
 secondary=[articles[19],articles[34]]
 smallstories=''.join(f'<a class="journal-side-story" href="/blog/{a["slug"]}"><img src="/assets/editorial/blog--{a["slug"]}.webp" width="1536" height="1024" alt=""><div><small>{a["category"]}</small><h3>{esc(a["title"])}</h3><span>{a["minutes"]} min read {g["icon"]("arrow")}</span></div></a>' for a in secondary)
 body=f'<section class="journal-masthead"><div class="site-wrap"><div class="journal-title"><div><span class="site-kicker">Ideas. Insights. Your next big thing.</span><h1>The BIG <em>journal.</em></h1></div><p>Make something great.<br> Build a business around it.</p></div><div class="journal-feature-layout"><a class="journal-feature" href="/blog/{featured["slug"]}"><img src="/assets/editorial/blog--{featured["slug"]}.webp" alt="" width="1536" height="1024" fetchpriority="high"><div><small>The starting point · {featured["minutes"]} min read</small><h2>{esc(featured["title"])}</h2><span>Let’s get you selling {g["icon"]("arrow")}</span></div></a><div class="journal-side-stories">{smallstories}</div></div></div></section>'
 body+=g['section']('40 guides. Plenty of possibilities.','A little knowledge goes a long way.','<div class="site-search"><input id="article-search" type="search" placeholder="Search ebooks, templates, delivery…" aria-label="Search articles"><select id="article-category" aria-label="Filter articles by topic"><option value="">All topics</option>'+''.join(f'<option>{c}</option>' for c in categories)+'</select></div><p id="search-status" class="site-note" aria-live="polite">40 articles</p><div class="site-grid">'+''.join(card(a) for a in articles)+'</div><p id="search-empty" class="site-empty" hidden>No matching guide yet. Try another keyword or topic.</p>',soft=True)
 page('/blog','Shopify Digital Product Guides & Ideas | BIG Journal','Practical guides to selling ebooks, templates, software, music and other digital products on Shopify. Learn delivery, protection, pricing and growth.',body)
 (g['CONTENT']/'blog-manifest.json').write_text(json.dumps([{k:v for k,v in a.items() if k not in ['content','toc']} for a in articles],indent=2))
 print('Rewrote 40 articles;',sum(a['words'] for a in articles),'words total')
