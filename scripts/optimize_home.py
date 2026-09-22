"""Keep the original art/layout, deliver one static tree instead of hydrating a second site."""
from bs4 import BeautifulSoup, Comment
import re, hashlib

def optimize(s, g):
    dist=g['DIST']; root=s.select_one('[data-framer-root]')
    # These sections were replaced, not merely visually collapsed.
    for selector in ['#pricing','#faq','.framer-9DWcw']:
        for node in s.select(selector): node.decompose()
    for node in list(root.find_all(recursive=False)):
        if not node.get('id'): node.decompose()
    final=s.select_one('#faqs')
    for node in list(final.find_all(recursive=False)):
        if 'framer-1oqn4ss' not in node.get('class',[]): node.decompose()
    # Keep the desktop component tree. Responsive CSS adapts this same content.
    for node in list(s.select('.hidden-1mmbk9o')):
        if node.parent: node.decompose()
    for node in s.select('[class]'):
        node['class']=[c for c in node['class'] if not c.startswith('hidden-')]
    # The remaining shared hero title is the sole H1, at every viewport.
    for node in s.select('h1')[1:]: node.name='p'
    for node in s.select('[data-framer-appear-id]'):
        node['style']=re.sub(r'opacity\s*:\s*0\.001\s*;?', 'opacity:1;', node.get('style',''))
        node['style']=re.sub(r'transform:[^;]+;?', '', node.get('style',''))
    # Framer hydration reinstated removed FAQ, prices and breakpoint copies.
    for node in list(s.select('script')):
        if node.get('type')=='application/ld+json' or '/assets/site.js' in node.get('src',''): continue
        node.decompose()
    for node in s.select('link[rel="modulepreload"],link[rel="preload"][as="script"]'): node.decompose()
    styles=[]
    for node in list(s.select('style')):
        styles.append(node.get_text()); node.decompose()
    (dist/'assets/home-original.css').write_text('\n'.join(styles))
    css=s.new_tag('link',rel='stylesheet',href='/assets/home-original.css?v=4')
    first=s.head.find('link',rel='stylesheet')
    if first: first.insert_before(css)
    else: s.head.append(css)
    # Cache the original detailed vector artwork separately from the document.
    templates=s.select_one('#svg-templates')
    if templates:
        (dist/'assets/home-icons.svg').write_text('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'+templates.decode_contents()+'</svg>')
        templates.decompose()
        for node in s.select('use'):
            for attr in ['href','xlink:href']:
                val=node.get(attr,'')
                if val.startswith('#svg'): node[attr]='/assets/home-icons.svg'+val
    for comment in s.find_all(string=lambda text:isinstance(text,Comment)): comment.extract()
    for img in s.select('img'):
        img['decoding']='async'
        if not img.find_parent(id='hero') and not img.find_parent('header'): img['loading']='lazy'
    # Drop hydration-only metadata, retain CSS hooks and semantic attributes.
    for node in s.find_all(True):
        for attr in list(node.attrs):
            if attr.startswith('data-framer-') and attr not in ['data-framer-root','data-framer-component-type','data-framer-name','data-framer-appear-id']: del node[attr]
    review=g['product']['reviews']
    for text in list(s.find_all(string=True)):
        if '800+ Reviews' in text:
            text.replace_with(text.replace('800+ Reviews',f"{review['rating']}/5 from {review['count']} Shopify reviews"))
        elif 'Read hundreds of reviews from Shopify merchants' in text:
            text.replace_with(text.replace('Read hundreds of reviews from Shopify merchants',f"Rated {review['rating']}/5 from {review['count']} Shopify reviews"))
    badge=s.find(string=lambda text:text and f"{review['count']} Shopify reviews" in text)
    if badge and not badge.find_parent('a'):
        a=s.new_tag('a',href=review['url']);a['class']='hero-review-link';badge.wrap(a)
    for node in s.select('#hero .framer-1tf2xmu-container,#hero .framer-g449wg-container,#hero .framer-1ag8jke-container,#hero .framer-1b2i6fq-container'):
        node['class']=node.get('class',[])+['hero-floating-card']
    # One responsive headline replaces the original nested tablet/mobile branches.
    heading=s.select_one('#hero h1')
    if heading: heading['class']=heading.get('class',[])+['home-main-title']
    v=hashlib.sha256((dist/'assets/home-static.css').read_bytes()+(dist/'assets/home-static.js').read_bytes()).hexdigest()[:10]
    s.head.append(s.new_tag('link',rel='stylesheet',href='/assets/home-static.css?v='+v))
    s.body.append(s.new_tag('script',src='/assets/home-static.js?v='+v,defer=True))
    return s
