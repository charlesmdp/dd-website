"""Small, accessible demos for the original homepage, independent of Framer."""
from bs4 import BeautifulSoup


def restore(s, g):
    icon = g['icon']

    def replace(selector, markup):
        node = s.select_one(selector)
        assert node is not None, selector
        node.replace_with(BeautifulSoup(markup, 'html.parser'))

    def visual(selector, markup, cls):
        node = s.select_one(selector)
        assert node is not None, selector
        node.clear()
        node['class'] = node.get('class', []) + ['home-demo-art', cls]
        node.append(BeautifulSoup(markup, 'html.parser'))

    files = '<div class="demo-file"><span class="demo-file-icon">ZIP</span><span><strong>TravelMaster Pro</strong><small>travel-master.zip</small></span><span class="demo-file-check">'+icon('check')+'</span></div><div class="demo-file"><span class="demo-file-icon">PDF</span><span><strong>HealthTracker</strong><small>health-tracker.pdf</small></span><span class="demo-file-check">'+icon('check')+'</span></div>'
    steps = [
        ('Create your digital product', 'This is simply done by uploading files on the app'),
        ('Your digital product is now created', 'This product becomes available 24/7 on your Shopify shop'),
        ('After buying, customers can download it instantly', 'Customers will receive an email allowing them to download their files'),
    ]
    tabs = ''.join(f'<button class="demo-step" role="tab" id="demo-step-{i}" aria-controls="demo-panel-{i}" aria-selected="{str(i == 1).lower()}" tabindex="{0 if i == 1 else -1}" data-step="{i}"><span class="demo-step-title"><span class="demo-step-number">{i}</span><strong>{title}</strong></span><span class="demo-step-description">{description}</span></button>' for i, (title, description) in enumerate(steps, 1))
    replace('#features-1 .framer-TK294', f'''<div class="home-steps-demo">
      <div class="demo-step-tabs" role="tablist" aria-label="How BIG works" aria-orientation="vertical">{tabs}</div>
      <div class="demo-browser"><div class="demo-browser-top"><span class="demo-window-dots" aria-hidden="true"><i></i><i></i><i></i></span><span>your Shopify store</span><small>Demo</small></div>
        <div class="demo-step-panel" id="demo-panel-1" role="tabpanel" aria-labelledby="demo-step-1" tabindex="0"><div class="demo-upload">{icon('files')}<strong>Upload your digital files</strong><span>PDFs, ZIPs, videos, music and more</span></div>{files}<button class="demo-primary" data-next-step="2">Create product {icon('arrow')}</button></div>
        <div class="demo-step-panel" id="demo-panel-2" role="tabpanel" aria-labelledby="demo-step-2" tabindex="0" hidden><div class="demo-success">{icon('check')}<span>Product created</span></div><div class="demo-product-cover">{icon('files')}<span>THE DIGITAL<br>STARTER KIT</span><small>BY YOUR STORE</small></div><div class="demo-product-details"><strong>Your digital collection</strong><span class="demo-live-badge">Live on your store</span></div><p>Two files. One product. Ready for your next customer.</p><button class="demo-primary" data-next-step="3">Preview delivery {icon('arrow')}</button></div>
        <div class="demo-step-panel" id="demo-panel-3" role="tabpanel" aria-labelledby="demo-step-3" tabindex="0" hidden><div class="demo-success">{icon('email')}<span>Delivered automatically</span></div><h3>Hey John 👋🏻</h3><p>Thanks for your purchase! Your files are ready to download.</p>{files}<div class="demo-delivery-note">{icon('download')} Available by email and after checkout</div><button class="demo-primary" data-next-step="1">Replay the demo {icon('arrow')}</button></div>
      </div></div>''')
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

    visual('#testimonials .framer-wf1v01', f'<div class="demo-shield">{icon("shield")}<span>{icon("check")}</span></div><span class="demo-art-caption">Your files. Your controls.</span>', 'demo-protection')
    visual('#testimonials .framer-1csuo99', f'<div class="demo-flow"><span class="demo-flow-node">{icon("files")}</span><i></i><span class="demo-flow-node"><img src="/assets/media/dcf110d0e724d7863a28.webp" width="44" height="44" alt="BIG"></span><i></i><span class="demo-flow-node"><img src="/assets/media/37416046211c6df9381f.png" width="44" height="44" alt="Shopify"></span></div><span class="demo-online"><i></i> Ready, around the clock</span>', 'demo-reliability')
    visual('#testimonials .framer-epzme3', f'<div class="demo-storage"><div>{icon("files")}<strong>A little more room.</strong></div><span>Your digital catalogue</span><div class="demo-storage-bars" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="demo-storage-plans"><span>Starter</span>{icon("arrow")}<span>Pro</span>{icon("arrow")}<span>Growth</span></div></div>', 'demo-capacity')
    visual('#testimonials .framer-jmdeds', '''<div class="demo-speedometer" aria-hidden="true"><svg viewBox="0 0 280 160" fill="none"><path d="M30 140a110 110 0 0 1 220 0" stroke="#e7e8eb" stroke-width="20" stroke-linecap="round"/><path d="M30 140a110 110 0 0 1 193-72" stroke="#ff6320" stroke-width="20" stroke-linecap="round"/><path d="M140 140 208 67" class="demo-speed-needle" stroke="#262626" stroke-width="5" stroke-linecap="round"/><circle cx="140" cy="140" r="11" fill="white" stroke="#dddfe3" stroke-width="5"/></svg></div><strong class="demo-speed-caption">Ready to download.</strong><span class="demo-art-caption">From checkout to your customer.</span>''', 'demo-speed')
    metrics=''.join(f'<div class="demo-metric"><span>{label}</span><strong data-metric="{key}">{value}</strong><small data-metric-change="{key}">{change} <span>vs previous period</span></small></div>' for key,label,value,change in [('downloads','Total downloads','572','+12%'),('revenue','Total revenue','$143,801','+20%'),('orders','Total orders','300','+12%'),('customers','Total customers','250','+8%')])
    replace('#testimonials .framer-1de3alv-container', f'''<article class="home-analytics-card"><div class="demo-analytics"><div class="demo-analytics-heading"><strong>Analytics</strong><label><span class="demo-sr-only">Analytics period</span><select data-analytics-period><option value="all">All time</option><option value="7">7 days</option><option value="30">30 days</option></select></label></div><div class="demo-metrics" aria-live="polite">{metrics}</div><small class="demo-example-label">Example store data</small></div><div class="demo-card-copy"><h3>Understandable Analytics</h3><p>We only display the numbers that really matter.</p></div></article>''')
    # Correct clipped desktop-only layouts and give the remaining cards stable hooks.
    s.select_one('#testimonials .framer-1sfxth3')['class'] += ['home-more-bottom']
    s.select_one('#testimonials .framer-wflqb1')['class'] += ['home-more-top']
    for text in s.select('#testimonials p'):
        if 'Even if someones orders' in text.get_text(): text.string='Even when someone orders at 4am, their digital product is delivered automatically.'
    a=s.select_one('#testimonials .framer-kf1vdj a')
    if a:a['href']='#plans';a.string='Find the storage and bandwidth that fit your next chapter.'
