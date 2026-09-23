"""Expose the saved Framer artwork as independent islands, never hydrate the page."""
from pathlib import Path

SOURCE = 'F8seZ6PVDoZKivybH0SBFkU8IJgjuoeu7tT3Cu7VCco.Lx00ypVX.mjs'

def expression(source, marker):
    start = source.index(marker)
    depth = 0
    quote = None
    escaped = False
    for pos in range(start, len(source)):
        char = source[pos]
        if quote:
            if escaped: escaped = False
            elif char == '\\': escaped = True
            elif char == quote: quote = None
        elif char in "'\"`": quote = char
        elif char == '(': depth += 1
        elif char == ')':
            depth -= 1
            if depth == 0: return source[start:pos + 1]
    raise ValueError('Unbalanced original component: ' + marker)

def build(dist):
    folder = dist / 'assets/runtime-v3'
    source = (folder / SOURCE).read_text()
    exports = '\nexport {wc as Steps,ia as Branding,To as Languages,fo as Shield,as as Speed,dl as Counter,qo as Person,to as Border,Cr as Dots,ii as Analytics};\n'
    for name, marker in [
        ('Storage', 'y(yr,{densityOptions:'),
        ('GalleryDown', 'h(Bn,{alignment:`center`,direction:`bottom`'),
        ('GalleryUp', 'h(Bn,{alignment:`center`,direction:`top`'),
        ('Sender', 'y(`div`,{className:`framer-5wkoo9`'),
    ]:
        # These page-authored expressions only use layout context for image loading
        # and breakpoint overrides. Their components keep all original behaviour.
        exports += f'export function {name}(){{const b="default",l={{}},Gd=value=>value;return {expression(source, marker)};}}\n'
    (folder / 'original-components.mjs').write_text(source + exports)
