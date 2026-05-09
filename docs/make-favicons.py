# Run this to generate per-app SVG favicons
# Or just use emoji favicons inline in each app's index.html

apps = [
    ("KOPPAWORD",  "📝", "#0066ff"),
    ("KOPPAEXCEL", "📊", "#00bb44"),
    ("KOPPAPDF",   "📑", "#ff3355"),
    ("KOPPAPOINT", "🎨", "#8b2fff"),
    ("KOPPABI",    "📈", "#ff8800"),
    ("KOPPAMEET",  "🎥", "#00d4ff"),
    ("KOPPAMAIL",  "📧", "#ffcc00"),
    ("KOPPANOTES", "📒", "#ff66aa"),
    ("KOPPABOARD", "📋", "#00ff88"),
    ("KOPPAWALL",  "🖼️",  "#aa66ff"),
    ("KOPPADRIVE", "💾", "#66aaff"),
    ("KOPPATEAM",  "🏠", "#00d4ff"),
]

template = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#0d0d1a"/>
  <rect x="1" y="1" width="62" height="62" rx="11" fill="none" stroke="{color}" stroke-width="1.5" opacity="0.6"/>
  <text x="32" y="46" text-anchor="middle" font-size="36">{emoji}</text>
</svg>"""

for name, emoji, color in apps:
    svg = template.format(emoji=emoji, color=color)
    print(f"favicon for {name}: use emoji {emoji} on {color} background")
    # Write to each app's docs/ folder if needed
