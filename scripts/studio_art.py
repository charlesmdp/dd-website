"""Small, purpose-drawn objects for the seller toolbox. Files are emitted at build time."""
from html import escape

PALETTES = {
    'violet': ('#55467e', '#9885d8', '#cec1fa', '#eee8ff'),
    'mint': ('#285e52', '#59bda0', '#a8e6ca', '#e2f7e8'),
    'blue': ('#36578b', '#639fe3', '#a9d5fa', '#e4f2ff'),
    'orange': ('#844c3d', '#f08362', '#ffbf95', '#fff0d9'),
    'pink': ('#854968', '#dd83a4', '#ffc1d4', '#ffe9ed'),
    'ochre': ('#825d31', '#e6aa4f', '#ffda8f', '#fff3cf'),
}
# Palette variables within each drawing: ink, shade, mid, light, paper, accent.
def path(d, fill="none", extra=""):
    return f'<path d="{d}" fill="{fill}" {extra}/>'
def rect(x,y,w,h,r,fill):
    return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}"/>'
def circle(x,y,r,fill):
    return f'<circle cx="{x}" cy="{y}" r="{r}" fill="{fill}"/>'
def label(x,y,s,size=20,color="var(--i)"):
    return f'<text x="{x}" y="{y}" fill="{color}" stroke="none" text-anchor="middle" font-family="Arial,sans-serif" font-size="{size}" font-weight="800">{escape(s)}</text>'
def group(mark,angle=-8):
    return f'<g transform="rotate({angle} 72 70)">{mark}</g>'
i,s,m,l,p,a='var(--i)','var(--s)','var(--m)','var(--l)','#fffdf6','#ffb96e'
def sheet(x=34,y=17,w=74,h=88):
    return path(f'M{x+7} {y}h{w-24}l17 17v{h-23}q0 6-6 6h-{w-12}q-6 0-6-6V{y+7}q0-7 7-7Z',l)+path(f'M{x+w-17} {y}v17h17',m)
def photo():
    return rect(22,26,94,73,9,p)+rect(29,33,80,49,5,m)+circle(88,46,6,'#fff2ac')+path('m31 77 21-24 16 16 13-13 26 24H31Z',s)
def tag():
    return path('M21 53 62 18l48 4 7 43-48 42q-4 4-9 0L21 65q-5-6 0-12Z',m)+circle(96,38,5,p)+path('M96 38q15-24 28-13')
def box():
    return path('m18 42 47-18 52 17v51l-50 20-49-20Z',m)+path('m18 42 49 18 50-19M67 60v52')+path('m41 33 49 18v18l-11 4V55L30 38Z',l)
def bars():
    return rect(27,70,15,26,3,m)+rect(52,55,15,41,3,s)+rect(77,39,15,57,3,l)
def link(x=0,y=0):
    return f'<g transform="translate({x} {y})">'+path('m39 63-8 8a17 17 0 0 0 24 24l18-18a17 17 0 0 0 0-24',m)+path('m82 71 13-13a17 17 0 0 0-24-24L55 49a17 17 0 0 0 0 24',l)+path('m50 79 27-27',extra='stroke-width="6"')+'</g>'

OBJECTS={
 'extract':('violet',group(sheet(21,24,67,78)+sheet(37,18,69,82)+path('M50 51h30m-30 10h20','none'))+group(circle(83,95,8,a)+circle(99,101,8,a)+path('m89 90 22-24m-18 28 8-31',extra='stroke-width="4"'),8)),
 'number':('blue',group(sheet()+rect(42,50,55,29,5,m)+label(69,72,'03',23)+path('M49 89h38'))),
 'zip':('ochre',group(path('M16 43q0-7 8-7h25l8 9h46q7 0 7 7v43H16Z',s)+path('M16 51h103l-8 49H20Z',m)+path('M67 53v24',extra='stroke-dasharray="2 4" stroke-width="7"')+rect(60,76,15,15,5,l))),
 'hash':('mint',group(path('M68 17q20 13 44 16v28q0 27-44 49Q24 92 24 61V33q24-3 44-16Z',m)+path('M68 28q16 9 32 11v19q0 22-32 40',l)+label(67,82,'#',44))),
 'download':('orange',group(rect(59,12,18,12,4,s)+circle(68,67,39,m)+circle(68,67,30,l)+path('M68 40v6m0 42v6M41 66h6m42 0h6M68 67l13-18',extra='stroke-width="4"')+circle(68,67,4,s)+path('m96 32 8-8',extra='stroke-width="6"'))),
 'watermark':('pink',group(photo(),-8)+group(rect(72,84,47,12,4,s)+path('M81 83q0-10 10-14c4-2-3-9-1-15 2-10 18-10 21 0 1 5-6 13-3 15q8 4 9 14Z',m),10)),
 'webp':('mint',group(photo())+group(rect(64,78,60,24,7,l)+label(94,95,'WEBP',14),7)),
 'resize':('blue',group(photo())+path('M14 56V22h34m79 51v34H94',extra='stroke-width="6"')+path('m98 24 21-9-6 21Z',a)),
 'cover':('violet',group(path('M36 21h68v81l-9 5H31q-6 0-6-7V30q0-9 11-9Z',s)+rect(32,18,67,81,4,m)+path('M41 21v76')+path('M51 76q0-29 19-29t20 29Z',l)+circle(75,45,8,a)+path('M52 32h33M33 101h61'))),
 'dpi':('ochre',group(rect(21,19,62,78,5,l)+path('M32 32h39v53H32Z',m)+path('m35 75 14-24 16 22',s),-6)+group(path('M47 88 116 42l12 19-69 45Z',a)+path('m62 79 5 7m7-15 4 6m8-14 6 8m7-16 4 5'),3)),
 'price':('mint',group(tag(),4)+label(68,80,'$',39)),
 'breakeven':('blue',group(path('M65 24h9v70h20l9 9H38l8-9h19Z',m)+path('m28 44 78-11',extra='stroke-width="6"')+path('m30 46-13 30h27Zm73-9L90 65h26Z')+path('M16 76h29q-4 19-15 18T16 76Zm73-11h28q-4 18-14 18T89 65Z',a),-3)),
 'bundle':('orange',group(box())+path('m45 33 19-13 19 6 7 14-17 5Z',l)),
 'license':('ochre',group(path('M24 47a23 23 0 1 1 45 6l48 18v14l-12 5-4-9-10 4-5-11-28-10A23 23 0 0 1 24 47Z',m)+circle(42,43,6,p)+path('m68 59 34 13'))),
 'sku':('pink',group(tag(),-7)+group(path('M43 59h42m-43 6h43m-43 7h37',extra='stroke-width="3"')+path('M45 62h32m-29 13h22',extra='stroke-width="2"'),-7)),
 'snippet':('blue',group(rect(15,25,109,74,9,l)+path('M17 44h105')+circle(25,35,2,s)+circle(33,35,2,m)+path('M28 57h40m-40 9h48m-48 9h31',extra='stroke-width="4"'))+circle(99,82,14,m)+path('m109 93 13 13',extra='stroke-width="7"')),
 'utm':('violet',group(link(3,1))),
 'email':('orange',group(rect(17,35,105,62,7,m)+path('m20 40 48 35 50-37',l)+path('m20 92 30-27m68 27L90 66'))+circle(111,34,12,a)+path('m104 34 5 5 9-10')),
 'canva':('mint',group(sheet()+path('M47 43h32m-32 9h28')+rect(45,67,48,16,7,s))+group(path('m85 77 27 15-12 2-4 13Z',a),6)),
 'faq':('violet',group(path('M61 47h43q11 0 11 11v21q0 9-8 9h-3l1 14-17-14H63q-10 0-10-9V57q0-10 8-10Z',m),8)+group(path('M24 27h56q10 0 10 11v28q0 10-11 10H54L37 91V76H25q-10 0-10-11V39q0-12 9-12Z',l))+label(52,65,'?',32)),
 'pdfmark':('pink',group(sheet()+path('M46 49h36m-37 11h32')+rect(40,72,61,17,3,m)+label(70,84,'PROOF',11))),
 'merge':('blue',group(sheet(18,34,60,66),-12)+group(sheet(54,22,59,69)+path('M65 46h22m-22 10h29'),9)+path('m48 100 19 3 2-13',extra='stroke-width="4"')),
 'bandwidth':('mint',group(path('M29 77q-17-2-14-17t21-16q6-24 27-22t27 18q29-3 33 17t-17 20Z',l)+path('M48 63v40m-11-12 11 12 10-12m18 10V64m-11 10 11-10 10 10',extra='stroke-width="6"'))),
 'qr':('violet',group(rect(25,21,81,81,9,l)+rect(37,33,19,19,2,m)+rect(75,33,19,19,2,m)+rect(37,69,19,19,2,m)+path('M70 66h12v12h12v10H72m-7-31v5H49',extra='stroke-width="5"'))),
 'numeric':('ochre',group(rect(17,39,110,47,8,m)+circle(26,63,3,p)+path('M34 42v39',extra='stroke-dasharray="3 5"')+label(77,71,'012',30))),
 'revenue':('mint',group(rect(18,19,99,86,8,l)+bars()+path('M29 37 47 36l18-10'))),
}
def build_icons(directory):
    directory.mkdir(parents=True,exist_ok=True)
    for key,(palette,art) in OBJECTS.items():
        ink,shade,mid,light=PALETTES[palette]
        svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 144 128" width="144" height="128" style="--i:{ink};--s:{shade};--m:{mid};--l:{light}"><ellipse cx="73" cy="113" rx="43" ry="5" fill="{ink}" opacity=".09"/><g stroke="{ink}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">{art}</g></svg>'''
        (directory/(key+'.svg')).write_text(svg)
