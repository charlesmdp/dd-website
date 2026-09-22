import runpy,html,json

def build(g):
 data=runpy.run_path(str(g['CONTENT']/'selling-guides.py'))['GUIDES']; articles=json.loads((g['CONTENT']/'original-blog.json').read_text()); e=html.escape
 for d in data:
  path='/sell-'+d['key']+'-on-shopify'; asset='/assets/editorial/v4/'+d['art']+'.webp'
  review=g['product']['reviews']
  body=f'<section class="selling-hero"><div class="site-wrap"><div class="site-breadcrumb"><a href="/">Home</a> / Sell {d["name"]} on Shopify</div><div class="selling-hero-grid"><div><span class="site-kicker">Sell {d["name"]} on Shopify</span><h1>Sell <em>{d["name"]}</em><br>on Shopify.</h1><p class="site-lead">{e(d["lead"])}</p><div class="site-actions">{g["button"]()}{g["button"]("See the customer journey","#delivery-demo","secondary")}</div><a class="selling-rating" href="{review["url"]}"><span>★★★★★</span> {review["rating"]}/5 from {review["count"]} Shopify reviews</a></div><img src="{asset}" width="1536" height="1024" alt="Illustration of {d["name"]} prepared for digital delivery" fetchpriority="high"></div></div></section>'
  files=''.join(f'<li>{g["icon"]("files")}<span>{e(f)}</span>{g["icon"]("check")}</li>' for f in d['files'])
  steps=''.join(f'<li><span>0{i+1}</span><p>{e(s)}</p></li>' for i,s in enumerate(d['journey']))
  demo=f'<div class="delivery-demo"><div class="demo-files"><span class="site-kicker">Illustrative delivery preview</span><h3>{e(d["example"])}</h3><p>{e(d["detail"])}</p><ul>{files}</ul><span class="demo-ready">{g["icon"]("check")} Your purchase, ready to open</span></div><div><span class="site-kicker">From checkout to first use</span><ol class="delivery-steps">{steps}</ol><p class="site-note">Example product and journey. Set up and test your own product before launch.</p></div></div>'
  body+=g['section']('The customer experience','A purchase should feel this simple.',demo,id='delivery-demo')
  body+=g['section']('Built around your product','The right tools, in the right place.',g['cards'](d['features']),soft=True)
  body+=g['section']('A little clarity before you launch','What to check first.',f'<div class="selling-check"><div>{g["icon"]("shield")}<h3>Promise exactly what you deliver.</h3><p>List the included files, required software, licence and delivery time. Test a complete purchase on desktop and mobile.</p></div><div>{g["icon"]("chart")}<h3>Choose capacity, not guesswork.</h3><p>BIG Starter is $9.99/month with 15 GB storage and 50 GB monthly bandwidth. Pro is $19.99 with 50 GB storage and 500 GB bandwidth. Paid plans have unlimited order counts; capacity limits still apply.</p><a href="/#plans">Compare all BIG plans →</a></div></div>')
  # Real general merchant review; no invented claim that the merchant uses this specific product format.
  merchant='Aubrey | Collaborative Endeavor Music' if d['key']=='music' else 'Digital Kim Designs'
  summary='Aubrey highlighted straightforward setup, responsive support and the value of the storage and unlimited product/order allowances.' if d['key']=='music' else 'Digital Kim Designs highlighted easy setup, reliable delivery, larger-file handling and a professional experience for customers buying educational resources.'
  review_date='6 June 2026' if d['key']=='music' else '18 June 2026'
  body+=g['section']('A merchant’s perspective','Confidence comes from the everyday details.',f'<div class="merchant-note"><span class="review-stars">★★★★★</span><p>{summary}</p><strong>{merchant}</strong><small>Shopify review · {review_date} · Summary, not a direct quote</small><a href="{review["url"]}">Read merchant reviews on Shopify →</a></div>',soft=True)
  body+=g['section']('Before your first sale','Questions about selling '+d['name']+'.',g['faq_html'](d['faqs']))
  guide=articles[d['guide']]['slug']
  body+=g['section']('Go a little deeper','Make your next step a good one.',f'<div class="selling-next"><a href="/blog/{guide}">{g["icon"]("files")} Read the practical guide {g["icon"]("arrow")}</a><a href="/features">{g["icon"]("spark")} Explore every BIG feature {g["icon"]("arrow")}</a><a href="/compare">{g["icon"]("chart")} Compare delivery apps {g["icon"]("arrow")}</a></div><p class="site-note">Product facts reviewed 22 September 2026. Sources: <a href="{g["APP"]}">BIG on Shopify</a>, <a href="{g["DOCS"]}">BIG documentation</a> and <a href="https://help.shopify.com/en/manual/products/digital-service-product">Shopify digital products guidance</a>.</p>')+g['cta']()
  extra=g['schema']({'@context':'https://schema.org','@type':'FAQPage','mainEntity':[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a in d['faqs']]})
  g['page'](path,'Sell '+d['name'].title()+' on Shopify | BIG Digital Downloads',d['lead'],body,extra)
 return data
