"""Publish the seller toolbox, its HTML catalogue and the sitewide navigation."""
from html import escape
from studio_catalog import GROUPS, TOOLS
from studio_legacy import register
from studio_fields import FIELDS
from studio_art import build_icons, OBJECTS
from legacy_forms import FORMS
register()
ASSETS='/assets/tool-studio/'
SYMBOL={'files':'files','images':'paint','catalog':'box','launch':'email'}
GUIDES={'/features':'Digital delivery on Shopify','/faq':'BIG merchant questions','/sell-digital-art-on-shopify':'Sell digital art on Shopify','/sell-pdfs-on-shopify':'Sell PDFs on Shopify','/sell-canva-templates-on-shopify':'Sell Canva templates on Shopify','/sell-license-keys-on-shopify':'Sell license keys on Shopify','/sell-software-on-shopify':'Sell software on Shopify','/sell-ebooks-on-shopify':'Sell ebooks on Shopify','/sell-videos-on-shopify':'Sell videos on Shopify','/sell-online-courses-on-shopify':'Sell online courses on Shopify'}
def art(key,cls='',eager=False):
    return f'<img class="ws-art {cls}" src="{ASSETS}{key}.svg" width="144" height="128" alt="" loading="{"eager" if eager else "lazy"}" decoding="async">'
def footer_links():
    groups=[]
    for key,(label,*_) in GROUPS.items():
        links=''.join(f'<a href="/tools/{t["slug"]}">{escape(t["name"])}</a>' for t in TOOLS.values() if t['group']==key)
        groups.append(f'<div><h4>{label}</h4>{links}</div>')
    return '<nav class="footer-tools" aria-label="Free tools for digital sellers"><a class="footer-tools-title" href="/tools">Free tools for digital sellers <span aria-hidden="true">↗</span></a><div class="footer-tools-links">'+''.join(groups)+'</div></nav>'
def card(t):
    return f'<a class="ws-card" href="/tools/{t["slug"]}">{art(t["key"])}<div><h3>{escape(t["name"])}</h3><span>{escape(t["short"])} <span aria-hidden="true">↗</span></span></div></a>'
def signature():
    return f'<span class="ws-sign"><img src="/assets/media/dcf110d0e724d7863a28.webp" width="23" height="23" alt=""><b>BIG</b><i></i> Seller toolbox</span>'
def crumbs(group=None):
    return '<nav class="ws-crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span>›</span>'+('<a href="/tools">Free tools</a><span>›</span><a href="/tools#'+group+'">'+GROUPS[group][0]+'</a>' if group else '<span>Free tools</span>')+'</nav>'
def faq(items,schema):
    markup='<div class="ws-faq-list">'+''.join(f'<details><summary>{escape(q)}<span aria-hidden="true">+</span></summary><p>{escape(a)}</p></details>' for q,a in items)+'</div>'
    data=schema({'@context':'https://schema.org','@type':'FAQPage','mainEntity':[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a in items]})
    return markup,data
def build(g):
    page,icon,schema=g['page'],g['icon'],g['schema']
    assert set(OBJECTS)==set(TOOLS)
    build_icons(g['DIST']/'assets/tool-studio')
    css=f'<link rel="stylesheet" href="{ASSETS}studio.css?v=1"><meta property="og:image" content="{g["BASE"]}{ASSETS}toolbox.webp">'
    script=f'<script type="module" src="{ASSETS}studio.mjs?v=1"></script>'
    tabs=''.join(f'<a href="#{key}">{icon(SYMBOL[key])}{group[0]}</a>' for key,group in GROUPS.items())
    groups=''
    for k,(label,title,about,_) in GROUPS.items():
        tools=[t for t in TOOLS.values() if t['group']==k]
        groups+=f'<section class="ws-category" id="{k}"><div class="ws-category-head"><div><span class="ws-overline">{icon(SYMBOL[k])} {label}</span><h2>{title}</h2></div><p>{about}</p></div><div class="ws-cards">'+''.join(card(t) for t in tools)+'</div></section>'
    hubfaq=[('Do I need a BIG account or Shopify store?', 'No. All 26 tools are free to use without an account. The files and calculations run in your browser.'),('Which tools help me prepare an ebook launch?', 'Extract a chapter as a sample, make a front cover, add page numbers and package the finished files. Then use the pricing calculator and delivery email generator to prepare the listing.'),('How do I deliver the results to paying customers?', 'Download the finished file and attach it to a digital product in your fulfilment app. If you sell on Shopify, BIG can deliver the files or keys when the order is paid.')]
    answers,data=faq(hubfaq,schema)
    hero=f'<div class="ws-hub-hero"><div>{signature()}<h1>Free tools for<br><em>digital sellers.</em></h1><p>Prepare your downloads, price your products and get your Shopify launch ready. Pick a tool and make something you can use today.</p><a class="ws-btn" href="#directory">Explore all {len(TOOLS)} tools {icon("arrow")}</a></div><div class="ws-hub-art"><img src="{ASSETS}toolbox.webp" width="800" height="800" fetchpriority="high" alt="Illustrated orange toolbox filled with a book, a photo, a ruler and a price tag"></div></div>'
    directory=f'<div id="directory" class="ws-directory"><div class="ws-navlinks">{tabs}</div><label class="ws-search"><span class="ws-sr">Find a tool</span><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/></svg><input type="search" placeholder="Find a tool…" aria-label="Find a tool"></label></div><p class="ws-empty" role="status" hidden>No tools match that search. Try “PDF”, “price” or “cover”.</p>'
    body=f'<div class="ws"><div class="ws-wrap">{crumbs()}{hero}{directory}{groups}<section class="ws-faq"><div><span class="ws-overline">Toolbox help</span><h2>Common questions</h2></div>{answers}</section></div></div>'
    page('/tools','Free Tools for Digital Product Sellers on Shopify | BIG','26 free browser tools for Shopify digital sellers. Prepare PDFs and product images, price bundles, generate license keys and create launch assets. No signup.',body,css+script+data,kind='CollectionPage')
    for t in TOOLS.values():
        key,slug,name,group=t['key'],t['slug'],t['name'],t['group']
        path='/tools/'+slug
        extra=css
        hero=f'<header class="ws-tool-head"><div>{signature()}<h1>{escape(name)}</h1><p>{escape(t["about"])}</p></div><div class="ws-tool-emblem {group}">{art(key,eager=True)}</div></header>'
        studio_title=f'<div class="ws-pane-title"><span class="ws-pane-symbol">{icon(SYMBOL[group])}</span><h2>{escape(t["action"])}</h2></div>'
        result_title=f'<div class="ws-pane-title"><span class="ws-pane-symbol">{icon("download")}</span><h2>Your result</h2></div>'
        privacy=f'<small class="ws-local">{icon("shield")} Runs on your device · No account needed</small>'
        placeholder=f'<div class="ws-placeholder">{art(key)}<span>Example result</span><strong>{escape(t["sample"])}</strong><small>{escape(t["result"])}</small></div>'
        if key in FIELDS:
            form=f'<form id="ws-form" data-tool="{key}"><div class="ws-pane-top">{studio_title}<button class="ws-demo" type="button" data-example>Try an example {icon("spark")}</button></div><div class="ws-fields">{FIELDS[key]}</div><p class="ws-status" role="status"></p><button class="ws-btn ws-primary" type="submit">{escape(t["action"])} {icon("arrow")}</button>{privacy}</form>'
            output=f'<aside class="ws-result" tabindex="-1" aria-label="Tool result">{result_title}<div class="ws-output" aria-live="polite">{placeholder}</div><div class="ws-actions" hidden><a class="ws-btn ws-download" download>Download</a><button class="ws-quiet ws-copy" type="button" hidden>Copy</button></div></aside>'
            extra+=script
        else:
            markup,_,_,lib=FORMS[slug]
            form=f'<form class="site-tool ws-legacy" id="tool-form" data-tool="{slug}">{studio_title}{markup}<p class="ws-status" id="tool-status" role="status"></p>{privacy}</form>'
            output=f'<aside class="ws-result ws-original-result" aria-label="Tool result">{result_title}{placeholder}<output id="tool-output" hidden></output><a id="tool-download" class="ws-btn" hidden download>Download</a></aside>'
            extra+=(f'<script defer src="/assets/vendor/{"pdf-lib.min.js" if lib=="pdf" else "qrcode.min.js"}"></script>' if lib else '')+'<script defer src="/assets/tools.js"></script>'
        work=f'<div class="ws-work">{form}{output}</div><noscript><p>Enable JavaScript to run this tool in your browser.</p></noscript>'
        steps=''.join(f'<li>{escape(step)}</li>' for step in t['steps'])
        how=f'<section class="ws-learn"><div><span class="ws-overline">Quick start</span><h2>How to use it</h2><ol>{steps}</ol></div><article class="ws-example"><span class="ws-overline">{icon("spark")} Worked example</span><h3>{escape(t["result"])}</h3><p>{escape(t["example"])}</p></article></section>'
        answers,data=faq(t['faq'],schema)
        question=f'<section class="ws-faq"><div><span class="ws-overline">Tool notes</span><h2>Frequently asked questions</h2><p>{escape(t["insight"])}</p></div>{answers}</section>'
        related=''.join(card(TOOLS[k]) for k in t['related'])
        guide=f'<a class="ws-guide" href="{t["guide"]}">{icon("box")}<span>Shopify guide<strong>{GUIDES[t["guide"]]}</strong></span>{icon("arrow")}</a>'
        related=f'<section class="ws-related"><h2>Keep working</h2><div>{related}{guide}</div></section>'
        body=f'<div class="ws"><div class="ws-wrap">{crumbs(group)}{hero}{work}{how}{question}{related}</div></div>'
        app=schema({'@context':'https://schema.org','@type':'WebApplication','name':name,'url':g['BASE']+path,'description':t['about'],'applicationCategory':'BusinessApplication','operatingSystem':'Web','browserRequirements':'Requires JavaScript','inLanguage':'en','isAccessibleForFree':True,'offers':{'@type':'Offer','price':'0','priceCurrency':'USD'},'provider':{'@type':'Organization','name':'BIG Digital Downloads','url':g['BASE']}})
        page(path,'Free '+name+' | BIG Digital Downloads',t['about'],body,extra+app+data)
        # A form's default values and preview placeholders are not editorial prose.
        sections=[f'# {name}',t['about'],'## How to use it','\n'.join(f'{i}. {s}' for i,s in enumerate(t['steps'],1)),'## Worked example',t['example'],t['insight'],'## Frequently asked questions',*['### '+q+'\n\n'+a for q,a in t['faq']],f'[Open the free tool]({g["BASE"]}{path})']
        (g['DIST']/('tools/'+slug+'.md')).write_text('\n\n'.join(sections)+'\n')
