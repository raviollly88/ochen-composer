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
    "16:9": {"width": 1200, "height": 675},
    "1:1": {"width": 1000, "height": 1000},
    "9:16": {"width": 675, "height": 1200},
    "4:3": {"width": 1000, "height": 750}
}

def auto_fit_scene(items, W, H, margin=50):
    min_x, min_y, max_x, max_y = 1e9, 1e9, -1e9, -1e9
    for it in items:
        asset_id = f"{it['objectType']}-{it['size']}-{it['state']}"
        asset = asset_map[asset_id]
        w = asset["w"] * it["scale"]
        h = asset["h"] * it["scale"]
        min_x = min(min_x, it["x"] - w / 2)
        min_y = min(min_y, it["y"] - h / 2)
        max_x = max(max_x, it["x"] + w / 2)
        max_y = max(max_y, it["y"] + h / 2)

    total_w = max_x - min_x
    total_h = max_y - min_y
    max_w = W - 2 * margin
    max_h = H - 2 * margin

    scale_factor = min(1.0, max_w / total_w if total_w > max_w else 1.0, max_h / total_h if total_h > max_h else 1.0)
    comp_cx = (min_x + max_x) / 2
    comp_cy = (min_y + max_y) / 2
    target_cx = W / 2
    target_cy = H / 2

    fitted = []
    for it in items:
        new_scale = it["scale"] * scale_factor
        new_x = target_cx + (it["x"] - comp_cx) * scale_factor
        new_y = target_cy + (it["y"] - comp_cy) * scale_factor
        fitted.append({**it, "x": new_x, "y": new_y, "scale": new_scale})

    return fitted

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

    fitted_items = auto_fit_scene(items, W, H, margin=50)
    sorted_items = sorted(fitted_items, key=lambda x: x.get("zIndex", 10))

    line_span = min(360, W * 0.40)
    ellipse_rx = min(90, W * 0.12)
    ellipse_ry = ellipse_rx * 0.46

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
            f'    <line x1="{cx - line_span}" y1="{cy + line_span * 0.22}" x2="{cx - line_span * 0.15}" y2="{cy - line_span * 0.28}" stroke="{stroke_color}" stroke-width="1.5" stroke-linecap="round" opacity="0.45"/>',
            f'    <line x1="{cx - line_span * 0.70}" y1="{cy - line_span * 0.45}" x2="{cx - line_span * 0.40}" y2="{cy - line_span * 0.62}" stroke="{stroke_color}" stroke-width="1.5" stroke-linecap="round" opacity="0.38"/>',
            f'    <line x1="{cx + line_span * 0.35}" y1="{cy + line_span * 0.45}" x2="{cx + line_span * 0.55}" y2="{cy + line_span * 0.33}" stroke="{stroke_color}" stroke-width="1.5" stroke-linecap="round" opacity="0.35"/>',
            f'    <ellipse cx="{cx - 120}" cy="{cy - 50}" rx="{ellipse_rx}" ry="{ellipse_ry}" fill="{stroke_color}" opacity="0.12"/>',
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
        lines.append(f'    <g transform="translate({round(item["x"], 1)}, {round(item["y"], 1)}) rotate({item.get("rotation", 0)}) scale({round(item["scale"], 3)}) translate(-{ox}, -{oy})">')

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
# Studio Layout: Lamp (S bg) in background, Notebook (S main) in center, Phone (S main) resting on page, Pen in front
sample1 = [
    {"objectType": "lamp", "size": "S", "state": "bg", "x": 340, "y": 270, "scale": 0.90, "zIndex": 5},
    {"objectType": "notebook", "size": "S", "state": "main", "x": 680, "y": 410, "scale": 0.95, "zIndex": 15},
    {"objectType": "phone", "size": "S", "state": "main", "x": 810, "y": 380, "scale": 0.85, "zIndex": 25},
    {"objectType": "pen", "size": "S", "state": "main", "x": 640, "y": 550, "scale": 0.95, "zIndex": 30}
]

# 2. Composition 2: 1:1 Square - "Личные финансы и бюджет" (Warm Peach)
# Studio Layout: Folder (S bg) in background, Wallet (L main) in foreground, Gold coin (S main) in front
sample2 = [
    {"objectType": "folder", "size": "S", "state": "bg", "x": 380, "y": 360, "scale": 0.95, "zIndex": 5},
    {"objectType": "wallet", "size": "L", "state": "main", "x": 560, "y": 550, "scale": 0.95, "zIndex": 20},
    {"objectType": "coin", "size": "S", "state": "main", "x": 440, "y": 700, "scale": 1.0, "zIndex": 30}
]

# 3. Composition 3: 9:16 Stories - "Музыка и технологии" (Fresh Mint)
# Studio Layout: Flowers (S bg) in background depth, Headphones (L main) in center foreground, Puzzle (S main) at bottom
sample3 = [
    {"objectType": "flowers", "size": "S", "state": "bg", "x": 338, "y": 380, "scale": 0.90, "zIndex": 5},
    {"objectType": "headphones", "size": "L", "state": "main", "x": 338, "y": 650, "scale": 0.85, "zIndex": 20},
    {"objectType": "puzzle", "size": "S", "state": "main", "x": 300, "y": 860, "scale": 0.95, "zIndex": 25}
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
