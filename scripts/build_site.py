from pathlib import Path
from bs4 import BeautifulSoup
import json,re,html,shutil,math,datetime,hashlib
ROOT=Path(__file__).resolve().parents[1]; DIST=ROOT/'dist'; CONTENT=ROOT/'content'; RESEARCH=CONTENT/'legal'
BASE='https://www.bigdigitaldownload.com'; APP='https://apps.shopify.com/digital-download-products'; DOCS='https://penida.gitbook.io/big-digital-download'; DATE='2026-09-22'
esc=lambda x:html.escape(str(x),quote=True)
DIST.mkdir(exist_ok=True)
if __name__ == '__main__': shutil.copytree(ROOT/'public',DIST,dirs_exist_ok=True)
ASSET_VERSION=hashlib.sha256((DIST/'assets/design.css').read_bytes()+(DIST/'assets/site.css').read_bytes()+(DIST/'assets/site.js').read_bytes()).hexdigest()[:10]
product=json.loads((CONTENT/'product.json').read_text());PAGES={}
NAMES={'sky-pilot':'Sky Pilot','filemonk':'Filemonk','fileflare':'Fileflare','easy-digital-products':'Easy Digital Products','shopify-digital-downloads':'Shopify Digital Products','sendowl':'SendOwl','pdf-pendora':'PDF Pendora','fetchapp':'FetchApp','ldt-digital-downloads':'LDT Digital Downloads'}
def button(text='Start free on Shopify',href=APP,style=''):
 return f'<a class="site-button {style}" href="{esc(href)}">{text} <span aria-hidden="true">↗</span></a>'
def brand():return '<a class="site-brand" href="/" aria-label="BIG Digital Downloads home"><img src="/assets/media/3aed8c41fe6de0b62874.png" width="42" height="42" alt=""><span><strong>BIG</strong><small>Digital Downloads</small></span></a>'
def header():
 return f'<a class="site-skip" href="#content">Skip to content</a><header class="site-header original-header"><a class="header-mark" href="/" aria-label="BIG Digital Downloads home"><img src="/assets/media/dcf110d0e724d7863a28.webp" width="28" height="28" alt="BIG"></a><span class="header-divider" aria-hidden="true"></span><button class="site-menu" aria-controls="site-nav" aria-expanded="false" aria-label="Toggle menu">{icon("menu")}</button><nav id="site-nav" class="site-nav" aria-label="Main navigation"><a href="/#key-features">Features</a><a href="/#reviews">Reviews</a><a href="/#plans">Pricing</a><a href="/#questions">FAQ</a><a href="/partners">Partner</a><a href="/blog">Blog</a><a href="https://bubbleaffiliate.com/">Affiliate</a></nav><a class="header-cta" href="{APP}">Get Started for free</a></header>'

ICONS={
'menu':'<path d="M4 6h16M4 12h16M4 18h16"/>',
'download':'<path d="M12 3v12m-5-5 5 5 5-5M5 16v4h14v-4"/>',
'spark':'<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4Z"/>',
'shield':'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8.5 11.5 2.5 2.5 4.5-4.5"/>',
'calendar':'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4m10-4v4M3 11h18m-13 5h3"/>',
'key':'<circle cx="8" cy="8" r="5"/><path d="m12 12 9 9m-5-5 3-3m-6 0 3-3"/>',
'email':'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m3 7 9 6 9-6"/>',
'box':'<path d="m3 7 9-4 9 4v10l-9 4-9-4Z M3 7l9 4 9-4m-9 4v10M7.5 5l9 4"/>',
'code':'<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
'globe':'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
'card':'<rect x="2" y="5" width="20" height="14" rx="3"/><path d="M2 10h20m-15 5h3"/>',
'help':'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .7-1.5 1-1.5 2m0 3h.01"/>',
'arrow':'<path d="M5 12h14m-6-6 6 6-6 6"/>',
'check':'<path d="m5 12 4 4L19 6"/>',
'plus':'<path d="M12 5v14M5 12h14"/>',
'files':'<path d="M8 3h8l4 4v13H8Z M16 3v5h4M4 7v14"/>',
'chart':'<path d="M4 3v17h17M8 15l4-5 4 3 5-7"/>',
'paint':'<path d="m15 3 6 6-9 9-6-6Z M4 14c-2 2 1 4-2 7 5 0 7-3 6-5"/>'}
def icon(name='spark',cls=''):
 return '<svg class="ui-icon '+cls+'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICONS.get(name,ICONS['spark'])+'</svg>'
def footer():
 comparisons=''.join(f'<a href="/big-digital-downloads-vs-{k}">BIG vs {v}</a>' for k,v in NAMES.items())
 return f'''<footer class="site-footer"><div class="site-wrap"><div class="footer-intro"><div><span class="site-kicker">Small files. Big possibilities.</span><h2>Make it digital.<br>Make it <em>BIG.</em></h2></div><a class="footer-shopify" href="{APP}">{icon('box')}<span>Find your next chapter<br><strong>on the Shopify App Store {icon('arrow')}</strong></span></a></div><div class="site-footer-top"><div>{brand()}<p>Built for the things you create.<br>And the business you’re building.</p><a class="footer-social" href="https://x.com/charlesmdp" rel="me noopener">X <span>@charlesmdp</span>{icon('arrow')}</a></div><div><h3>Explore BIG</h3><a href="/features">Features</a><a href="/#plans">Pricing</a><a href="/faq">Questions & answers</a><a href="{DOCS}">Help centre</a><a href="/partners">Partners & affiliates</a></div><div><h3>Made for you</h3><a href="/blog">The BIG journal</a><a href="/tools">Free tools</a><a href="/compare">Compare apps</a><a href="/alternatives">Find an alternative</a><a href="/best-shopify-digital-download-apps">App buying guide</a></div><div><h3>The fine print</h3><a href="/terms-and-conditions">Terms & conditions</a><a href="/privacy-policy">Privacy policy</a><a href="/gdpr">GDPR & your data</a><a href="/ai">Product facts</a><a href="/llms.txt">For AI readers</a></div></div><div class="footer-compare-label">Made for whatever you create.</div><div class="site-footer-compare" aria-label="Sell digital products on Shopify"><a href="/sell-ebooks-on-shopify">Sell ebooks</a><a href="/sell-canva-templates-on-shopify">Sell Canva templates</a><a href="/sell-license-keys-on-shopify">Sell license keys</a><a href="/sell-software-on-shopify">Sell software</a><a href="/sell-music-on-shopify">Sell music</a><a href="/sell-videos-on-shopify">Sell videos</a><a href="/sell-digital-art-on-shopify">Sell digital art</a><a href="/sell-pdfs-on-shopify">Sell PDFs</a><a href="/sell-online-courses-on-shopify">Sell courses</a></div><div class="footer-compare-label">A little comparison goes a long way.</div><div class="site-footer-compare" aria-label="App comparisons">{comparisons}</div><div class="footer-wordmark" aria-hidden="true"><span>BIG</span><div>DIGITAL<br>DOWNLOADS{icon('arrow')}</div></div><div class="site-footer-bottom"><span>© 2026 Penida SAS</span><span>Made in France · 14 rue Charles V, Paris</span></div></div></footer><div class="eu-banner"><div class="site-wrap"><span class="eu-flag" aria-hidden="true">🇪🇺</span><p><strong>Made in the European Union.</strong> Built in France, with care for your data.</p><a href="/privacy-policy">Our privacy commitment {icon('arrow')}</a></div></div>'''
def cta():return f'<section class="site-section" id="final-cta"><div class="site-wrap"><div class="site-cta"><span class="shopify-pill">{icon("spark")} Built for Shopify</span><h2>Start selling Digital<br>Products on Shopify</h2><p>Your next idea deserves a great delivery.<br>Start free. Grow at your own pace.</p>{button("Get Started for free",style="secondary")}</div></div></section>'
def support_section():
 return f'''<section class="site-section live-support" id="live-support"><div class="site-wrap"><div class="support-panel"><div><span class="support-status"><i></i> Real people. Here 24/7.</span><h2>Your next question.<br><em>Our next conversation.</em></h2><p>Late-night launch? First digital product? A file that needs a second look? Our live chat team is available 24 hours a day, 7 days a week.</p><a class="site-button" href="{APP}">Open BIG in Shopify {icon('arrow')}</a><span class="support-how">Open the app, then tap the chat bubble.</span></div><div class="support-conversation" aria-label="Illustration of a support conversation"><span class="support-chat-top">{icon('help')} The BIG support team <small>24/7 live chat</small></span><div class="chat-customer">A little help with my first ebook?</div><div class="chat-team">Of course. Let’s get your first download ready.</div><div class="chat-typing" aria-hidden="true"><i></i><i></i><i></i></div><small class="chat-example">Illustrative conversation</small></div></div></div></section>'''
def schema(data):return '<script type="application/ld+json">'+json.dumps(data,ensure_ascii=False).replace('</','<\\/')+'</script>'
def page(path,title,description,body,extra='',kind='WebPage',noindex=False):
 description=description if len(description)<=170 else (description.split('. ')[0]+'.')
 canonical=BASE+path;obj={'@context':'https://schema.org','@type':kind,'name':title,'description':description,'url':canonical,'publisher':{'@type':'Organization','name':'Penida SAS','url':BASE}}
 ld=schema(obj)
 if path!='/':ld+=schema({'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Home','item':BASE+'/'},{'@type':'ListItem','position':2,'name':title,'item':canonical}]})
 out=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{esc(title)}</title><meta name="description" content="{esc(description)}"><link rel="canonical" href="{esc(canonical)}"><meta name="robots" content="{'noindex,follow' if noindex else 'index,follow,max-image-preview:large'}"><meta property="og:type" content="website"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{esc(canonical)}"><meta name="twitter:card" content="summary"><link rel="icon" href="/assets/media/3aed8c41fe6de0b62874.png"><link rel="stylesheet" href="/assets/site.css?v={ASSET_VERSION}"><link rel="stylesheet" href="/assets/design.css?v={ASSET_VERSION}"><link rel="preload" href="/assets/media/adbcb664c8982395afde.woff2" as="font" type="font/woff2" crossorigin>{ld}{extra}</head><body>{header()}<main id="content">{body}</main>{footer()}<script defer src="/assets/site.js?v={ASSET_VERSION}"></script></body></html>'''
 target=DIST/('404.html' if path=='/404' else path.strip('/')+'/index.html');target.parent.mkdir(parents=True,exist_ok=True);target.write_text(out)
 if not noindex:PAGES[path]={'title':title,'description':description}
 md_soup=BeautifulSoup(body,'html.parser')
 for h in md_soup.select('h1,h2,h3'):
  h.replace_with('\n'+'#'*int(h.name[1])+' '+h.get_text(' ',strip=True)+'\n')
 for a in md_soup.select('a[href]'):
  href=a['href'];href=BASE+href if href.startswith('/') else href
  a.replace_with('['+a.get_text(' ',strip=True)+']('+href+')')
 for li in md_soup.select('li'):li.insert(0,'- ')
 text=md_soup.get_text('\n',strip=True)
 md=DIST/(path.strip('/')+'.md');md.parent.mkdir(parents=True,exist_ok=True);md.write_text(f'# {title}\n\nSource: {canonical}\n\n{description}\n\n{text}\n')
def hero(kicker,title,description,image=None,actions=True):
 copy=f'<div><span class="site-kicker">{kicker}</span><h1>{title}</h1><p class="site-lead">{description}</p>'+('<div class="site-actions">'+button()+button('See plans & pricing','/#plans','secondary')+'</div>' if actions else '')+'</div>'
 return f'<section class="site-hero"><div class="site-wrap"><div class="site-breadcrumb"><a href="/">Home</a> / {kicker}</div><div class="{"split" if image else "site-center"}">{copy}'+(f'<img src="/assets/editorial/{image}.webp" width="1536" height="1024" alt="" fetchpriority="high">' if image else '')+'</div></div></section>'
def section(kicker,title,inner,description='',soft=False,id=''):
 return f'<section class="site-section {"soft" if soft else ""}"'+(f' id="{id}"' if id else '')+f'><div class="site-wrap"><span class="site-kicker">{kicker}</span><h2>{title}</h2>'+ (f'<p class="site-lead">{description}</p>' if description else '')+inner+'</div></section>'
def cards(items):
 names=['spark','box','code','key','files','globe']
 return '<div class="site-grid">'+''.join(f'<article class="site-card"><span class="feature-icon">{icon(names[i%len(names)])}</span><h3>{a}</h3><p class="site-muted">{b}</p></article>' for i,(a,b) in enumerate(items))+'</div>'
def faq_html(items=None):
 def faq_icon(q):
  q=q.lower()
  for words,name in [(['cost','plan','free','price'],'card'),(['safe','protect','stamp','watermark','piracy'],'shield'),(['key','licen'],'key'),(['schedul','release'],'calendar'),(['custom','personal'],'paint'),(['email'],'email'),(['language'],'globe'),(['api','webhook'],'code'),(['import','migrat'],'files'),(['download','deliver'],'download')]:
   if any(w in q for w in words):return name
  return 'help'
 return '<div class="site-faq">'+''.join(f'<details><summary><span class="faq-symbol">{icon(faq_icon(q))}</span><span>{esc(q)}</span><span class="faq-toggle">{icon("plus")}</span></summary><p>{esc(a)}</p></details>' for q,a in (items or product['faq']))+'</div>'
def price_html():
 out='<div class="site-price-grid">'
 for p in product['plans']:
  out+=f'<article class="site-card site-price {"featured" if p["name"]=="Growth" else ""}"><span class="site-kicker">{p["name"]}</span><h3>{p["tag"]}</h3><div class="amount">${p["price"]:.2f}</div><small>USD / month</small><ul class="site-checks"><li>{p["storage"]} storage</li><li>{p["bandwidth"]} bandwidth</li><li>Unlimited products & orders</li><li>Unlimited downloads & licence keys</li><li>PDF stamping & download limits</li><li>Custom sender email</li><li>Order imports & exports</li><li>Multilingual support</li>'+('<li>REST API & outgoing webhooks</li>' if p['api'] else '')+f'</ul>{button("Choose "+p["name"])}</article>'
 return out+'</div><p class="site-note">Also available: a free plan with 250 MB storage and 50 orders. Paid plans have no order-count cap; storage and bandwidth limits still apply. Starter and Pro do not include the API or outgoing webhooks. Prices in USD, before applicable taxes. Confirm your subscription on the Shopify billing screen.</p>'
def native_home():
 s=BeautifulSoup((CONTENT/'home-original.html').read_text(),'html.parser')
 s.body['class']=['home-updated'];s.head.append(BeautifulSoup(f'<link rel="stylesheet" href="/assets/site.css?v={ASSET_VERSION}"><link rel="stylesheet" href="/assets/design.css?v={ASSET_VERSION}">','html.parser'))
 s.body.insert(0,BeautifulSoup(header().replace('href="#content"','href="#hero"'),'html.parser'))
 from design_sections import brand_section,go_section,mode_section,operations_section
 brandbar=brand_section(globals())
 go=go_section(globals())
 modes=mode_section(globals())
 operations=operations_section(globals())
 plans=section('Simple, transparent plans','Room to start.<br>Space to grow.',price_html(),id='plans')
 from design_sections import trust_section
 trust=trust_section(globals())
 faq='<section class="site-section" id="questions"><div class="site-wrap faq-layout"><div class="faq-intro"><span class="site-kicker">A little clarity</span><h2>Your questions,<br>answered.</h2><p>Everything you need to feel ready, from your first file to your next big launch.</p><a class="text-link" href="'+DOCS+'">Visit the help centre '+icon('arrow')+'</a></div>'+faq_html()+'</div></section>'
 from design_sections import journal_section
 learn=journal_section(globals())
 for block in [brandbar,go,modes,operations,plans,trust,faq,learn,support_section(),footer(),f'<script defer src="/assets/site.js?v={ASSET_VERSION}"></script>']:
  s.body.append(BeautifulSoup(block,'html.parser'))
 for a in s.select('a[href]'):
  href=a.get('href','');href=href.replace(BASE,'');href=href.replace('./','/',1) if href.startswith('./') else href
  href=href.replace('#pricing','#plans').replace('#faq','#questions');a['href']=href
 for ld in s.select('script[type="application/ld+json"]'):
  try:
   obj=json.loads(ld.string or 'null')
   if 'FAQPage' in str(obj) or obj.get('@type') in ['SoftwareApplication','Organization','WebSite']:ld.decompose()
  except:pass
 title=s.select_one('title');title.string='Shopify Digital Downloads App | BIG Digital Downloads'
 d=s.select_one('meta[name=description]');d['content']='Sell digital products on Shopify with BIG: ebooks, PDFs, templates, software and licence keys. Automatic delivery, PDF stamping and a free plan.'
 s.select_one('#hero')['aria-label']='Sell digital products on Shopify'
 for tag in s.select('meta[property="og:title"],meta[name="twitter:title"]'):tag['content']=title.string
 for tag in s.select('meta[property="og:description"],meta[name="twitter:description"]'):tag['content']=d['content']
 s.head.append(BeautifulSoup(schema({'@context':'https://schema.org','@type':'Organization','@id':BASE+'/#organization','name':'Penida SAS','url':BASE,'address':{'@type':'PostalAddress','addressCountry':'FR','addressLocality':'Paris'},'sameAs':[APP,'https://x.com/charlesmdp']}),'html.parser'))
 s.head.append(BeautifulSoup(schema({'@context':'https://schema.org','@type':'SoftwareApplication','name':'BIG Digital Downloads','applicationCategory':'BusinessApplication','operatingSystem':'Shopify','url':BASE,'description':d['content'],'offers':{'@type':'Offer','price':'0','priceCurrency':'USD','url':APP},'publisher':{'@type':'Organization','name':'Penida SAS','url':BASE}}),'html.parser'))
 from optimize_home import optimize
 s=optimize(s,globals())
 out=str(s).replace('Used by 15,000+ People','Built for Shopify').replace('https://big-digital-downloads-home.charlesmdp.chatgpt.site/assets/',BASE+'/assets/').replace('🇪🇺  Made in France &amp; Estonia by working a lot and drinking a few beers. Or the opposite? 🍺','Built in France. Designed to protect your digital business.')
 (DIST/'index.html').write_text(out)
 PAGES['/']={'title':title.string,'description':d['content']}
def features_page():
 body=hero('All features','Everything your digital<br>business needs to deliver.','From a single PDF to a full catalogue of files, keys and custom creations. Meet the Shopify app built around what you sell.','features-digital-commerce')
 from design_sections import mode_section
 body+=mode_section(globals())
 body+=section('02 / Your content, connected','Sell the things you create.',cards([('Ebooks & PDFs','Books, workbooks, guides and resources. Add PDF stamping on paid plans to discourage unauthorised sharing.'),('Templates & design assets','Deliver files or access links for Canva, Notion, Photoshop, Lightroom presets and stock graphics.'),('Music, videos & courses','Sell audio, video lessons and supporting files. A digital delivery app is not a substitute for an LMS with progress tracking.'),('Software & licence keys','Connect a downloadable installer and licence inventory. Export keys and orders; validate activations in your software.'),('Bundles & variants','Offer collections of files or different editions of a product. Check the exact variant-to-file mapping with a test order.'),('Digital + physical','Add digital content to a store that also sells physical goods. Make the contents of each purchase clear before checkout.')]),soft=True)
 body+=section('03 / A better customer experience','Make delivery feel like your brand.',cards([('Branded downloads','Customise the colours and messaging of the download experience to match your store.'),('Your sender email','Paid plans include a custom sender address. Configure it in the app and test inbox delivery.'),('Multiple languages','Translate the customer-facing experience and delivery messages for the people who buy from you.'),('Email + order access','Let customers retrieve their files from the delivery email and the Shopify post-purchase experience.'),('Resend delivery emails','Help a customer recover access without handling the file as an email attachment.'),('Large files & automatic ZIPs','Keep related files together and make multi-file purchases easier to retrieve. Check the plan’s storage and transfer capacity.')]))
 body+=section('04 / Protect & operate','Control access.<br>Keep your business portable.',cards([('PDF stamping','Personalise an unprotected PDF with buyer information. This discourages sharing; it is not unbreakable DRM.'),('Download limits','Limit the number of downloads while leaving enough attempts for legitimate customers.'),('Past-order imports','Bring order history into BIG and verify previous buyers can retrieve the correct files.'),('Orders & keys export','Export your orders and licence keys. Keep a copy before migration or major catalogue changes.'),('REST API','Connect your tools to BIG on Growth and Enterprise. Starter and Pro do not include API access.'),('Outgoing webhooks','Notify your other systems when relevant events occur. Available on Growth and Enterprise.')]),soft=True)
 body+=section('A plan for every stage','Pick your capacity.',price_html())+section('Need a detail?','Questions about the features.',faq_html(product['faq'][3:10]))+cta()
 page('/features','Shopify Digital Product App Features | BIG Digital Downloads','Explore BIG features: instant, custom and scheduled digital delivery, licence keys, PDF stamping, branding, imports, API and webhooks.',body)

def legal_pages():
 for name,path,title in [('terms','/terms-and-conditions','Terms & conditions'),('privacy','/privacy-policy','Privacy policy'),('gdpr','/gdpr','GDPR & your data')]:
  s=BeautifulSoup((RESEARCH/(name+'.html')).read_text(),'html.parser');h=s.select_one('h1');container=list(h.parents)[4].find_all(recursive=False)[1]
  for node in container.select('script,style'):node.decompose()
  entity=next((x for x in container.find_all('p') if x.get_text(strip=True)=='Entity'),None)
  if entity:
   oldtable=list(entity.parents)[3]
   rows=[]
   for row in oldtable.find_all(recursive=False):
    cells=[]
    for cell in row.find_all(recursive=False):
     cells.append(cell.decode_contents())
    if cells:rows.append(cells)
   tablehtml='<div class="site-table-wrap"><table><thead><tr>'+''.join('<th>'+x+'</th>' for x in rows[0])+'</tr></thead><tbody>'+''.join('<tr>'+''.join('<td>'+x+'</td>' for x in row)+'</tr>' for row in rows[1:])+'</tbody></table></div>'
   oldtable.replace_with(BeautifulSoup(tablehtml,'html.parser'))
  for node in container.find_all(True):
   attrs={}
   if node.name=='a':attrs={'href':node.get('href','#').replace('./','/').replace(BASE,'')}
   node.attrs=attrs
  # Preserve the existing policy wording; presentation changes are not new legal commitments.
  text=str(container);text=text.replace('data-framer', 'data-original')
  cleaned=BeautifulSoup(text,'html.parser')
  for div in list(cleaned.select('div,span')):div.unwrap()
  headings=[]
  for p in cleaned.find_all('p'):
   txt=p.get_text(' ',strip=True)
   if txt in ['Services Overview','Fair Use Policy on Bandwidth','Payments and Billing','Intellectual Property','Termination','Limitation of Liability','Third-Party Services','Amendments to the Terms','Governing Law','Introduction','Personal Identification Data','Shopify Store Information','Technical Data','How We Use Your Information','Data Retention and Deletion','Security','Your Rights: GDPR and CCPA Compliance','Changes to This Privacy Policy','Contact Us','Introduction to GDPR',"PENIDA SAS' Commitment to GDPR",'Data Collection & Processing','Data Retention','Data Deletion','Third-Party Processors','Privacy Policy and Further Information'] or (txt and len(txt)<95 and p.find('strong') and p.get_text(strip=True)==p.find('strong').get_text(strip=True)):
    p.name='h2'
  for i,h in enumerate(cleaned.select('h2,h3')):h['id']='policy-'+str(i);headings.append((h['id'],h.get_text(' ',strip=True)))
  toc='<aside class="site-toc"><strong>In this document</strong>'+''.join(f'<a href="#{i}">{esc(t)}</a>' for i,t in headings)+'<a href="mailto:penidastudio@gmail.com">Contact the privacy team</a></aside>'
  body=hero('Legal & privacy',title,'Clear information about using BIG Digital Downloads and the personal data involved.',actions=False)
  body+=f'<section class="site-section"><div class="site-wrap site-editorial"><article class="site-prose">{cleaned}</article>{toc}</div></section>'
  page(path,title+' | BIG Digital Downloads','Read the '+title.lower()+' for BIG Digital Downloads, operated by Penida SAS in France.',body)

def simple_pages():
 page('/faq','Shopify Digital Downloads FAQ | BIG','Answers about selling digital products on Shopify: delivery, PDF stamping, licences, pricing, migration, custom orders and scheduled releases.',hero('Help centre','Good questions.<br>Straight answers.','Everything to know before your first download — and as your digital business grows.',actions=False)+section('Frequently asked questions','Let’s clear things up.',faq_html())+cta())
 page('/404','File not found. Adventure found. | BIG','This page wandered off. Find your way back to BIG Digital Downloads.',f'<div class="site-wrap site-404"><div><div class="giant" aria-hidden="true">404</div><h1>This file went<br>off the grid.</h1><p class="site-lead">Even digital products need a little adventure. This page has wandered somewhere we can’t deliver.</p><div class="site-actions">{button("Take me home","/")}{button("Explore the journal","/blog","secondary")}</div><p class="site-note">Your downloads are probably exactly where you left them. Check your purchase email or contact the store you bought from.</p></div><img src="/assets/editorial/404-lost-file.webp" width="1536" height="1024" alt="A little orange folder exploring a mysterious portal"></div>',noindex=True)
 page('/partners','Partner with BIG Digital Downloads','Build a digital commerce business with BIG. Resources for Shopify agencies, experts and affiliate partners.',hero('Partners','Better digital stores.<br>Built together.','Helping Shopify agencies, creators and store builders deliver digital products with confidence.',actions=False)+section('Work with BIG','A useful addition to your toolkit.',cards([('Shopify agencies','Set up product delivery and branded downloads for your clients. Use our feature guide to scope requirements before choosing a plan.'),('Affiliate partners','Visit the affiliate programme for its current terms, eligibility and commission information.'),('Migration projects','Prepare files, product mappings and past-order exports. Test existing customers’ access before switching delivery apps.')])+f'<div class="site-actions">{button("View the affiliate programme","https://bubbleaffiliate.com/")}{button("Read the documentation",DOCS,"secondary")}</div>'))

if __name__=='__main__':
 native_home();features_page();legal_pages();simple_pages()
 # Additional collections are built by their dedicated modules.
 import build_tools,build_comparisons,build_blog
 build_tools.build(globals());build_comparisons.build(globals());build_blog.build(globals())
 import build_selling
 build_selling.build(globals())
 links='\n'.join(f'- [{x["title"]}]({BASE+p})' for p,x in PAGES.items())
 ai=f'''# BIG Digital Downloads\n\n> Shopify app by Penida SAS, built in France, for selling and delivering digital products.\n\n## Product facts\n\nSupports files, access links, licence keys, PDF stamping, custom products and scheduled delivery. Paid plans include unlimited order counts, with plan-specific storage and bandwidth. API and outgoing webhooks are available on Growth and Enterprise.\n\n## Pricing\n\nFree: 250 MB and 50 orders. Starter: $9.99/month, 15 GB storage, 50 GB bandwidth. Pro: $19.99/month, 50 GB storage, 500 GB bandwidth. Growth: $49.99/month, 1 TB storage and bandwidth. Enterprise: $99.99/month, unlimited storage and 1 TB bandwidth plus $0.023 per extra GB. Prices USD. Confirm the Shopify subscription screen.\n\n## Sources\n\n- [Official Shopify listing]({APP})\n- [Documentation]({DOCS})\n- [Privacy]({BASE}/privacy-policy)\n- [GDPR]({BASE}/gdpr)\n\n## Important limits\n\nPDF stamping does not eliminate piracy. Course file delivery does not imply a full LMS. No claim of EU-only hosting is made. Comparisons are published by BIG and reflect public sources reviewed on {DATE}.\n\n## Pages\n\n{links}\n'''
 (DIST/'llms.txt').write_text(ai);(DIST/'llms-full.txt').write_text(ai+'\n\n'+ '\n\n'.join(p.read_text() for p in DIST.rglob('*.md')))
 page('/ai','BIG Digital Downloads: Product Facts & Sources','A factual guide to BIG Digital Downloads: features, pricing, limitations, sources and machine-readable documentation.',hero('Product facts','The facts, in one place.','A concise reference to BIG Digital Downloads, with original sources and readable documentation.',actions=False)+section('BIG Digital Downloads','Built for Shopify digital commerce.',f'<div class="site-prose"><p>BIG Digital Downloads is a Shopify app by Penida SAS, built in France. It delivers digital files, access links and licence keys. It supports standard, custom and scheduled digital products.</p><h2>Pricing and capabilities</h2><p>Paid plans start at $9.99 per month. Unlimited paid-plan orders do not mean unlimited bandwidth. API access and outgoing webhooks require Growth or Enterprise.</p><h2>Documentation</h2><ul><li><a href="/llms.txt">Short machine-readable reference</a></li><li><a href="/llms-full.txt">Full text library</a></li><li><a href="/features">All features</a></li><li><a href="{APP}">Official Shopify listing</a></li><li><a href="{DOCS}">Product documentation</a></li></ul><p>Comparisons are written by BIG, based on public sources reviewed on 22 September 2026. They are editorial comparisons, not independent product tests. The company does not claim EU-only hosting here.</p></div>'))
 (DIST/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>{esc(BASE+p)}</loc></url>' for p in sorted(PAGES))+'</urlset>')
 (DIST/'index.md').write_text('# BIG Digital Downloads\n\nA Shopify app for selling and delivering digital files, access links and licence keys. Built in France by Penida SAS.\n\n- [Features]('+BASE+'/features)\n- [Pricing]('+BASE+'/#plans)\n- [FAQ]('+BASE+'/faq)\n- [Documentation]('+DOCS+')\n')
 (DIST/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+BASE+'/sitemap.xml\n')
 (DIST/'_redirects').write_text('/llms-txt /llms.txt 301\n')
 (DIST/'_headers').write_text('/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n/assets/*\n  Cache-Control: public, max-age=86400\n/assets/media/*\n  Cache-Control: public, max-age=31536000, immutable\n/*.md\n  Content-Type: text/markdown; charset=utf-8\n  X-Robots-Tag: noindex, follow\n/llms.txt\n  Content-Type: text/plain; charset=utf-8\n  X-Robots-Tag: noindex, follow\n/llms-full.txt\n  Content-Type: text/plain; charset=utf-8\n  X-Robots-Tag: noindex, follow\n/404.html\n  X-Robots-Tag: noindex, follow\n')
 (CONTENT/'page-manifest.json').write_text(json.dumps(PAGES,indent=2))
 print('Built',len(PAGES),'indexable pages')
