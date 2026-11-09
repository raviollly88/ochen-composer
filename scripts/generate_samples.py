import os
import sys
import json
import fitz

sys.path.append(os.getcwd())

# Ensure output directory exists
samples_dir = 'ochen-composer/public/samples'
os.makedirs(samples_dir, exist_ok=True)

with open('parsed_user_svgs.json', 'r', encoding='utf-8') as f:
    library = json.load(f)

from test_composer_engine import compose_scene

PALETTES = {
    'purple': {
        'bgPrimary': '#d6cdf4',
        'bgDark': '#7764d6',
        'accentYellow': '#f9ebaf',
        'accentCoral': '#f9a3aa',
        'accentPale': '#ffe2e1'
    },
    'peach': {
        'bgPrimary': '#fdd6b8',
        'bgDark': '#d17431',
        'accentYellow': '#f9ebaf',
        'accentCoral': '#80dada',
        'accentPale': '#bdebeb'
    },
    'mint': {
        'bgPrimary': '#bdeaea',
        'bgDark': '#59bdbd',
        'accentYellow': '#ffd3f1',
        'accentCoral': '#6d7bfb',
        'accentPale': '#b6c6fd'
    }
}

def adapt_color(fill, pal, is_bg):
    if not fill or fill == 'none': return fill
    f = fill.lower()
    if f in ['#181816', '#181817', '#000000', '#ffffff', 'white']:
        if is_bg and f in ['#181816', '#181817', '#000000']:
            return pal['bgDark']
        return fill
    if is_bg:
        return pal['bgPrimary']
    if f in ['#d7cdf5', '#d6cdf4', '#fdd6b8', '#bdeaea']:
        return pal['bgPrimary']
    if f in ['#7864d7', '#7764d6', '#d17431', '#59bdbd']:
        return pal['bgDark']
    if f in ['#f9ecb0', '#f9ebaf', '#fce4a6']:
        return pal['accentYellow']
    if f in ['#f9a3aa', '#f48c8c']:
        return pal['accentCoral']
    if f in ['#ffe3e1', '#ffe2e1', '#ffd4f2']:
        return pal['accentPale']
    return fill

def generate_sample(hero, bg, accent, format_wh, pal_id, svg_filename, png_filename):
    W, H = format_wh
    items, scale = compose_scene(hero, bg, accent, format_wh, pal_id)
    pal = PALETTES[pal_id]
    cx = W / 2
    cy = H / 2
    strokeColor = pal['bgDark']
    
    lineSpan = min(360, W * 0.38)
    ellipseRx = min(90, W * 0.12)
    ellipseRy = ellipseRx * 0.46
    
    lines = [
        f'<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
        f'  <defs>',
        f'    <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">',
        f'      <feDropShadow dx="0" dy="14" stdDeviation="18" flood-color="#000000" flood-opacity="0.10"/>',
        f'    </filter>',
        f'  </defs>',
        f'  <rect width="{W}" height="{H}" rx="24" fill="{pal["bgPrimary"]}"/>',
        f'  <!-- Studio Ochen Decorative Scratches & Accents -->',
        f'  <g id="background-decor">',
        f'    <line x1="{cx - lineSpan}" y1="{cy + lineSpan * 0.22}" x2="{cx - lineSpan * 0.15}" y2="{cy - lineSpan * 0.28}" stroke="{strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>',
        f'    <line x1="{cx - lineSpan * 0.70}" y1="{cy - lineSpan * 0.45}" x2="{cx - lineSpan * 0.40}" y2="{cy - lineSpan * 0.62}" stroke="{strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.38"/>',
        f'    <line x1="{cx + lineSpan * 0.35}" y1="{cy + lineSpan * 0.45}" x2="{cx + lineSpan * 0.55}" y2="{cy + lineSpan * 0.33}" stroke="{strokeColor}" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>',
        f'    <ellipse cx="{cx - 120}" cy="{cy - 50}" rx="{ellipseRx}" ry="{ellipseRy}" fill="{strokeColor}" opacity="0.12"/>',
        f'    <!-- Signature Studio Corner Pills -->',
        f'    <g transform="translate(65, {H - 65})">',
        f'      <ellipse cx="20" cy="22" rx="28" ry="14" fill="{strokeColor}" opacity="0.65"/>',
        f'      <ellipse cx="44" cy="10" rx="28" ry="14" fill="#ffffff" opacity="0.95"/>',
        f'    </g>',
        f'  </g>',
        f'  <g id="composition-layer" filter="url(#card-shadow)">'
    ]
    
    items.sort(key=lambda it: it['zIndex'])
    
    for it in items:
        asset = library[it['type']]
        w = asset['w']
        h = asset['h']
        ox = w / 2
        oy = h / 2
        is_bg = (it['state'] == 'bg')
        
        lines.append(f'    <g transform="translate({it["x"]:.1f}, {it["y"]:.1f}) rotate({it["rot"]}) scale({it["scale"]:.4f}) translate(-{ox}, -{oy})">')
        for p in asset['paths']:
            f_color = adapt_color(p['fill'], pal, is_bg)
            eo = ' fill-rule="evenodd"' if p.get('eo') else ''
            op = f' fill-opacity="{p["op"]}"' if p.get('op') else ''
            lines.append(f'      <path d="{p["d"]}" fill="{f_color}"{eo}{op}/>')
        lines.append('    </g>')
        
    lines.append('  </g>')
    lines.append('</svg>')
    
    svg_content = '\n'.join(lines)
    svg_path = os.path.join(samples_dir, svg_filename)
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"Written: {svg_filename}")
    
    # Render PNG
    doc = fitz.open(stream=svg_content.encode('utf-8'), filetype='svg')
    page = doc[0]
    pix = page.get_pixmap(dpi=150)
    png_path = os.path.join(samples_dir, png_filename)
    pix.save(png_path)
    print(f"Rendered: {png_filename} ({pix.width}x{pix.height})")

# Sample 1: Журналистика и образование (16:9 Banner)
generate_sample(
    hero='notebook',
    bg='lamp',
    accent='pen',
    format_wh=(1920, 1080),
    pal_id='purple',
    svg_filename='sample-1-education-16x9.svg',
    png_filename='sample-1.png'
)

# Sample 2: Личные финансы и бюджет (1:1 Square)
generate_sample(
    hero='wallet',
    bg='lamp',
    accent='coin',
    format_wh=(1000, 1000),
    pal_id='peach',
    svg_filename='sample-2-finances-1x1.svg',
    png_filename='sample-2.png'
)

# Sample 3: Музыка и релакс (9:16 Vertical Stories)
generate_sample(
    hero='headphones',
    bg='flowers',
    accent='puzzle',
    format_wh=(1080, 1920),
    pal_id='mint',
    svg_filename='sample-3-startup-9x16.svg',
    png_filename='sample-3.png'
)

print("All sample SVGs and PNGs successfully regenerated with authentic user SVGs!")
