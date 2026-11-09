import json
import os
import pymupdf

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_FILE = os.path.join(ROOT, "src", "data", "objects.json")
OUT_DIR = os.path.join(ROOT, "public", "samples")

with open(DATA_FILE, "r", encoding="utf-8") as f:
    raw_objects = json.load(f)

asset_map = {obj["id"]: obj for obj in raw_objects}

PALETTES = {
    "purple": {
        "id": "purple",
        "name": "Purple Mist",
        "bgPrimary": "#d7cdf5",
        "bgDark": "#7864d7"
    },
    "peach": {
        "id": "peach",
        "name": "Warm Peach",
        "bgPrimary": "#fdd7b9",
        "bgDark": "#d27532"
    },
    "mint": {
        "id": "mint",
        "name": "Fresh Mint",
        "bgPrimary": "#beebeb",
        "bgDark": "#5abebe"
    }
}

FORMATS = {
    "16:9": {"width": 960, "height": 540},
    "1:1": {"width": 720, "height": 720},
    "9:16": {"width": 540, "height": 960},
    "4:3": {"width": 800, "height": 600}
}

def adapt_color(fill, palette, is_monochrome):
    if not fill:
        return fill
    f = fill.lower()
    if f in ("#181817", "#000000", "#ffffff"):
        return fill
    if is_monochrome:
        if f in ("#d7cdf5", "#fdd7b9", "#beebeb", "#aa9bf0", "#fac896", "#80dada"):
            return palette["bgPrimary"]
        return palette["bgDark"]
    if f in ("#d7cdf5", "#fdd7b9", "#beebeb"):
        return palette["bgPrimary"]
    if f in ("#7864d7", "#d27532", "#5abebe"):
        return palette["bgDark"]
    return fill

def build_svg(items, format_key, palette_key, show_decor=True):
    cfg = FORMATS[format_key]
    pal = PALETTES[palette_key]
    W = cfg["width"]
    H = cfg["height"]
    cx = W / 2
    cy = H / 2
    stroke_color = pal["bgDark"]

    sorted_items = sorted(items, key=lambda x: x.get("zIndex", 10))

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">',
        '  <defs>',
        '    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">',
        '      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.10"/>',
        '    </filter>',
        '  </defs>',
        f'  <rect width="{W}" height="{H}" rx="20" fill="{pal["bgPrimary"]}"/>'
    ]

    if show_decor:
        lines.extend([
            '  <!-- Studio Ochen Background Decorative Scratches & Accents -->',
            '  <g id="background-decor">',
            f'    <line x1="{cx - 380}" y1="{cy + 80}" x2="{cx - 60}" y2="{cy - 105}" stroke="{stroke_color}" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>',
            f'    <line x1="{cx - 260}" y1="{cy - 160}" x2="{cx - 150}" y2="{cy - 223}" stroke="{stroke_color}" stroke-width="1.5" stroke-linecap="round" opacity="0.38"/>',
            f'    <line x1="{cx + 120}" y1="{cy + 170}" x2="{cx + 200}" y2="{cy + 124}" stroke="{stroke_color}" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>',
            f'    <ellipse cx="{cx - 140}" cy="{cy - 40}" rx="90" ry="42" fill="{stroke_color}" opacity="0.12"/>',
            '    <!-- Signature Corner Pills -->',
            f'    <g transform="translate(75, {H - 65})">',
            f'      <ellipse cx="20" cy="22" rx="28" ry="14" fill="{stroke_color}" opacity="0.65"/>',
            '      <ellipse cx="44" cy="10" rx="28" ry="14" fill="#ffffff" opacity="0.95"/>',
            '    </g>',
            '  </g>'
        ])

    lines.append('  <g id="composition" filter="url(#shadow)">')

    for item in sorted_items:
        asset_id = f"{item['objectType']}-{item['size']}-{item['state']}"
        asset = asset_map.get(asset_id)
        if not asset:
            print(f"Warning: asset {asset_id} not found!")
            continue

        ox = asset["w"] / 2
        oy = asset["h"] / 2

        lines.append(f"    <!-- {item['objectType']} ({item['state']}) -->")
        lines.append(f'    <g transform="translate({item["x"]}, {item["y"]}) rotate({item.get("rotation", 0)}) scale({item["scale"]}) translate(-{ox}, -{oy})">')

        is_mono = item["state"] == "bg"
        for p in asset["paths"]:
            fill = adapt_color(p.get("fill"), pal, is_mono)
            eo = ' fill-rule="evenodd"' if p.get("eo") else ''
            op = f' fill-opacity="{p["op"]}"' if p.get("op") and p["op"] < 1 else ''
            lines.append(f'      <path d="{p["d"]}" fill="{fill}"{eo}{op}/>')
        lines.append('    </g>')

    lines.extend([
        '  </g>',
        '</svg>'
    ])

    return '\n'.join(lines)


# 1. Composition 1: 16:9 Banner - "Конспекты и лекции" (Purple Mist)
# Authentic Studio Layout: Lamp in background, Open Notebook in center, Smartphone resting on right page, Pen in front
sample1 = [
    {"objectType": "lamp", "size": "L", "state": "bg", "x": 250, "y": 200, "scale": 0.30, "zIndex": 5},
    {"objectType": "notebook", "size": "L", "state": "main", "x": 510, "y": 320, "scale": 0.36, "zIndex": 15},
    {"objectType": "phone", "size": "L", "state": "main", "x": 640, "y": 270, "scale": 0.26, "zIndex": 25},
    {"objectType": "pen", "size": "S", "state": "main", "x": 480, "y": 420, "scale": 0.38, "zIndex": 30}
]

# 2. Composition 2: 1:1 Square - "Личные финансы и бюджет" (Warm Peach)
# Authentic Studio Layout: Folder in background, Wallet in foreground, Gold coin accent
sample2 = [
    {"objectType": "folder", "size": "L", "state": "bg", "x": 270, "y": 290, "scale": 0.32, "zIndex": 5},
    {"objectType": "wallet", "size": "L", "state": "main", "x": 390, "y": 410, "scale": 0.40, "zIndex": 20},
    {"objectType": "coin", "size": "S", "state": "main", "x": 290, "y": 510, "scale": 0.42, "zIndex": 30}
]

# 3. Composition 3: 9:16 Stories - "Музыка и технологии" (Fresh Mint)
# Authentic Studio Layout: Flowers/Vase in background, Headphones hero in center, Puzzle accent
sample3 = [
    {"objectType": "flowers", "size": "L", "state": "bg", "x": 270, "y": 340, "scale": 0.32, "zIndex": 5},
    {"objectType": "headphones", "size": "L", "state": "main", "x": 270, "y": 550, "scale": 0.42, "zIndex": 20},
    {"objectType": "puzzle", "size": "L", "state": "main", "x": 240, "y": 710, "scale": 0.34, "zIndex": 25}
]

tasks = [
    ("sample-1-education-16x9.svg", "sample-1.png", sample1, "16:9", "purple"),
    ("sample-2-finances-1x1.svg", "sample-2.png", sample2, "1:1", "peach"),
    ("sample-3-startup-9x16.svg", "sample-3.png", sample3, "9:16", "mint")
]

for svg_name, png_name, items, fmt, pal in tasks:
    svg_content = build_svg(items, fmt, pal, show_decor=True)
    svg_path = os.path.join(OUT_DIR, svg_name)
    with open(svg_path, "w", encoding="utf-8") as f:
        f.write(svg_content)
    print(f"Written: {svg_name}")

    # Render PNG with pymupdf
    doc = pymupdf.open("svg", svg_content.encode("utf-8"))
    page = doc[0]
    pix = page.get_pixmap(dpi=150)
    png_path = os.path.join(OUT_DIR, png_name)
    pix.save(png_path)
    print(f"Rendered: {png_name} ({pix.width}x{pix.height})")

print("All sample SVGs and PNGs successfully created!")
