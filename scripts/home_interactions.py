"""Preserve original artwork and attach progressively loaded interactive islands."""
from bs4 import BeautifulSoup


def restore(s, g):
    heading = s.select_one('#features-1 [data-framer-name="Get Started in 3 Easy Steps"] p')
    if heading: heading.name = 'h2'

    # Existing colour swatches retain their exact artwork and layout.
    for selector, name, color in [('.framer-gqngx7','Purple','#7047eb'),('.framer-1stbmmd','Orange','#ff6320'),('.framer-14vcabt','Blue','#176bff'),('.framer-8xa8r4','Rose','#d51b4d')]:
        n = s.select_one('#use-cases .framer-yoe64n '+selector)
        n['role']='button'; n['tabindex']='0'; n['aria-label']=name+' brand colour'; n['aria-pressed']=str(name=='Orange').lower(); n['data-brand-color']=color
    color_demo = s.select_one('#use-cases .framer-jqpJE')
    color_demo['data-brand-demo']=''; color_demo['style']=color_demo.get('style','')+';--demo-brand:#ff6320'
    # Select both download buttons by their visible label, avoiding variant-specific hashes.
    for p in color_demo.find_all('p', string=lambda t:t and t.strip()=='Download'):
        p.parent.parent['data-brand-target']=''
    logo = color_demo.select_one('.framer-1fvoohx-container')
    logo['data-logo-preview']=''
    for i, selector in enumerate(['.framer-1yvkfzs','.framer-10h1zru','.framer-2n2pbc','.framer-t7x1v1']):
        n=s.select_one('#use-cases '+selector)
        n['role']='button';n['tabindex']='0';n['data-demo-logo']=str(i);n['aria-label']='Preview logo '+str(i+1);n['aria-pressed']='false'
    for i, (selector, lang) in enumerate([('.framer-1ig8ng5','en'),('.framer-1m7urt7','zh'),('.framer-p7mh0s','fr')]):
        n=s.select_one('#use-cases '+selector)
        n['role']='button';n['tabindex']='0';n['data-demo-language']=lang;n['aria-pressed']=str(lang=='en').lower()
    # The apparent text-editing affordance is an actual toggle in this demonstration.
    n=s.select_one('#use-cases .framer-wl1cev'); n['role']='button';n['tabindex']='0';n['data-demo-copy']='';n['aria-label']='Preview another email message';n['aria-pressed']='false'
    n=s.select_one('#use-cases .framer-1w31oh4');n['role']='button';n['tabindex']='0';n['data-cycle-language']='';n['aria-label']='Preview the next email language'
    n=s.select_one('#use-cases .framer-ss8y8x button');n['data-demo-sender']='';n['aria-pressed']='false'
    sender=s.select_one('#use-cases .framer-5wkoo9');sender['data-sender-demo']=''

    # Mount only the exact original interactive components. The surrounding page
    # remains server-rendered, with one H1 and the updated SEO/content.
    islands = [
        ('#features-1 .framer-1vtkyp8-container', 'Steps'),
        ('#key-features .framer-1pmtd7b-container', 'GalleryDown'),
        ('#key-features .framer-dibd3a-container', 'GalleryUp'),
        ('#testimonials .framer-mgvf45-container', 'Shield'),
        ('#testimonials .framer-x2v5r-container', 'Dots'),
        ('#testimonials .framer-10aoprl-container', 'Person'),
        ('#testimonials .framer-4jlv5x-container', 'Border'),
        ('#testimonials .framer-tdjcco-container', 'Storage'),
        ('#testimonials .framer-e9bg2q-container', 'Speed'),
        ('#testimonials .framer-580hdq-container', 'Counter'),
        ('#testimonials .framer-1de3alv-container', 'Analytics'),
    ]
    sender=s.select_one('#use-cases .framer-5wkoo9')
    host=s.new_tag('div');host['style']='display:block;width:100%';host['data-original-island']='Sender'
    sender.wrap(host)
    for selector, component in islands:
        node=s.select_one(selector)
        assert node is not None, selector
        node['data-original-island']=component
    for gallery in s.select('#key-features ul'):
        gallery.parent['style']=gallery.parent.get('style','').replace('opacity:0;', 'opacity:1;')
    # Correct clipped desktop-only layouts and give the remaining cards stable hooks.
    s.select_one('#testimonials .framer-1sfxth3')['class'] += ['home-more-bottom']
    s.select_one('#testimonials .framer-wflqb1')['class'] += ['home-more-top']
    for text in s.select('#testimonials p'):
        if 'Even if someones orders' in text.get_text(): text.string='Even when someone orders at 4am, their digital product is delivered automatically.'
    a=s.select_one('#testimonials .framer-kf1vdj a')
    if a:a['href']='#plans';a.string='Find the storage and bandwidth that fit your next chapter.'
