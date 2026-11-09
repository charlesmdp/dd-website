"""Semantic, server-rendered inputs for each workspace."""
from html import escape
def e(s): return escape(str(s),quote=True)
def field(key,title,control,hint='',wide=False):
    note=f'<small id="hint-{key}">{e(hint)}</small>' if hint else ''
    return f'<div class="ws-field {"ws-wide" if wide else ""}"><label for="f-{key}">{e(title)}</label>{control}{note}</div>'
def text(key,title,value='',maxlen=140,kind='text',wide=True,optional=False,hint=''):
    return field(key,title,f'<input id="f-{key}" name="{key}" type="{kind}" maxlength="{maxlen}" value="{e(value)}" {"" if optional else "required"} autocomplete="off" '+(f'aria-describedby="hint-{key}"' if hint else '')+'>',hint,wide)
def num(key,title,value,low=0,high=10000000,step='any'):
    return field(key,title,f'<input id="f-{key}" name="{key}" type="number" min="{low}" max="{high}" step="{step}" required value="{value}">')
def area(key,title,value,maxlen=1500,rows=3,hint=''):
    return field(key,title,f'<textarea id="f-{key}" name="{key}" maxlength="{maxlen}" rows="{rows}" required '+(f'aria-describedby="hint-{key}"' if hint else '')+f'>{e(value)}</textarea>',hint,True)
def choose(key,title,opts):
    return field(key,title,f'<select id="f-{key}" name="{key}">'+''.join(f'<option value="{e(k)}">{e(v)}</option>' for k,v in opts)+'</select>')
def chips(key,title,opts):
    return f'<fieldset class="ws-wide ws-field"><legend>{e(title)}</legend><div class="ws-options">'+''.join(f'<label><input type="radio" name="{key}" value="{e(k)}" {"checked" if n==0 else ""}><span>{e(v)}</span></label>' for n,(k,v) in enumerate(opts))+'</div></fieldset>'
def slider(key,title,value,low=1):
    return field(key,title,f'<div class="ws-slider"><input type="range" id="f-{key}" name="{key}" min="{low}" max="100" value="{value}"><output for="f-{key}">{value}%</output></div>',wide=True)
def upload(title,accept,hint,multiple=False):
    return f'''<div class="ws-field ws-wide"><span class="ws-label">{title}</span><label class="ws-upload"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 8V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8Z"/><path d="m9 14 3-3 3 3m-3-3v6"/></svg><b>Choose {"files" if multiple else "a file"} <span>or drop {"them" if multiple else "it"} here</span></b><small>{hint}</small><input type="file" name="file" aria-label="{title}" accept="{accept}" {"multiple" if multiple else ""}></label><output class="ws-selection" aria-live="polite"></output></div>'''
pdf=upload('Source PDF','.pdf,application/pdf','Unlocked PDF · Up to 50 MiB')
picture=upload('Source artwork','.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp','JPEG, PNG or WebP · Up to 24 MiB / 24 MP')
copy='https://example.com/products/field-notes'
def faqrows():
    return '<div class="ws-wide ws-qa-list"></div><button type="button" class="ws-quiet ws-wide" data-add-faq>＋ Add another question</button>'
FIELDS={
 'extract':pdf+text('pages','Pages to extract','1, 3-4',250,hint='Use page positions, separated by commas. Ranges keep their order.'),
 'number':pdf+num('start','Start numbering at',7,1,999999,1)+choose('position','Footer position',[('center','Centre'),('left','Left'),('right','Right')])+chips('style','Number format',[('number','7'),('page','Page 7'),('dash','– 7 –')]),
 'zip':upload('Bundle contents','*/*','Any file type · 40 files / 64 MiB total',True)+text('name','Archive name','creator-kit',100),
 'hash':upload('File to verify','*/*','Any file type · Up to 100 MiB')+text('expected','Expected SHA-256 (optional)','',64,optional=True,hint='Paste the publisher’s 64-character fingerprint to compare.'),
 'download':num('size','File size',1,.000001)+choose('unit','File size unit',[('GB','GB · gigabytes'),('MB','MB · megabytes'),('KB','KB · kilobytes')])+num('speed','Connection speed (Mbps)',50,.001)+slider('efficiency','Usable connection speed',100),
 'watermark':picture+text('mark','Watermark text','Studio proof',80)+choose('position','Placement',[('bottom','Bottom right'),('center','Centre'),('top','Top left')])+choose('ink','Text colour',[('light','Chalk white'),('dark','Ink black')])+slider('opacity','Watermark opacity',45),
 'webp':picture+slider('quality','Encoding quality',80,0),
 'resize':picture+num('width','Width (px)',1200,64,4096,1)+num('height','Height (px)',1200,64,4096,1)+chips('fit','Fit the artwork',[('contain','Fit · white padding'),('cover','Fill · centre crop')]),
 'cover':text('title','Book title','Field Notes',110)+text('subtitle','Subtitle (optional)','A workbook for curious minds',130,optional=True)+text('author','Author or studio','North House',65)+chips('design','Art direction',[('grove','Greenhouse'),('orbit','Night orbit'),('tide','Clay & tide')]),
 'dpi':num('width','Artwork width (px)',3600,1,100000,1)+num('height','Artwork height (px)',5400,1,100000,1)+num('ppi','Print density (PPI)',300,1,2400),
 'price':num('cost','Cost per sale ($)',6.5)+num('flat','Fixed fee per sale ($)',.3)+num('fee','Payment fee (%)',3,0,100)+num('margin','Target margin (%)',60,0,100),
 'breakeven':num('budget','Creation budget ($)',900)+num('price','Selling price ($)',20,.01)+num('cost','Cost per order ($)',2)+num('flat','Fixed fee per order ($)',0)+num('fee','Payment fee (%)',0,0,100),
 'bundle':area('items','Products and individual prices','Workbook | 24\nPrintables | 18\nBonus exercises | 18',3500,4,'One item per line. Enter its name, a vertical bar and the price in USD.')+num('price','Bundle selling price ($)',45),
 'license':text('prefix','Product prefix (optional)','STUDIO',16,optional=True)+num('count','Keys to generate',100,1,1000,1)+num('groups','Groups per key',3,2,6,1)+num('length','Characters per group',4,3,8,1),
 'sku':text('base','Product code','NOTES',24)+area('editions','Editions','Standard\nDeluxe',800,2,'One edition per line.')+area('formats','Formats','PDF\nEPUB\nZIP',800,3,'One format per line.'),
 'snippet':text('url','Public product URL',copy,2048,'url')+text('title','Search title','Field Notes — Printable Workbook',160)+area('description','Meta description','Explore 24 guided prompts with Field Notes, a printable PDF workbook for your next creative project.',480),
 'utm':text('url','Destination URL',copy+'?variant=blue#details',2048,'url')+text('source','Campaign source','newsletter',100,wide=False)+text('medium','Campaign medium','email',100,wide=False)+text('campaign','Campaign name','field-notes',120)+text('content','Content (optional)','',100,wide=False,optional=True)+text('term','Term (optional)','',100,wide=False,optional=True),
 'email':text('store','Shop name','North House',90,wide=False)+text('product','Product name','Field Notes',110,wide=False)+text('url','Example download URL','https://example.com/download/field-notes',2048,'url')+text('support','Support email','help@example.com',254,'email')+area('instructions','Opening instructions','Open the PDF in your favourite reader. When printing, choose Actual size.',700),
 'canva':text('title','Template pack title','Your Studio Templates',90)+text('store','Shop name','North House',65)+text('url','Canva share URL','https://www.canva.com/templates/',2048,'url',hint='Use your tested customer template link. The example opens Canva’s public template directory.')+area('instructions','Buyer instructions','Open the button below and make your own copy. Keep this PDF handy so you can find the templates again.',420),
 'faq':faqrows(),
}
