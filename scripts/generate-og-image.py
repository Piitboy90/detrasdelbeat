#!/usr/bin/env python3
"""
Genera public/og-image.png: la imagen que se ve al compartir un enlace de
BeatStory en WhatsApp, X, Telegram, LinkedIn, etc.

Uso:
    python scripts/generate-og-image.py

Requiere Pillow (pip install Pillow). No instala nada mas.

La imagen es provisional y funcional. Para sustituirla por un diseno propio
basta con dejar un PNG de 1200x630 en public/og-image.png; este script no es
necesario para que la web funcione.
"""

from __future__ import annotations

import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

# --- Especificacion de Open Graph ---------------------------------------
# 1200x630 es la relacion 1.91:1 que piden Facebook, X y LinkedIn.
WIDTH, HEIGHT = 1200, 630

# --- Colores de marca (tailwind.config.js + src/index.css) --------------
NAVY_DEEP = (5, 10, 22)       # #050A16  --gradient-dark-navy
NAVY_MID = (11, 30, 58)       # #0B1E3A  --gradient-light-navy
NAVY_BASE = (15, 23, 42)      # #0F172A  sound.dark
ORANGE = (255, 140, 66)       # #FF8C42  sound.orange
TEXT_PRIMARY = (241, 245, 249)  # #F1F5F9
TEXT_SECONDARY = (203, 213, 225)  # #CBD5E1

TITLE = "BeatStory"
SUBTITLE = "Tu historia convertida en canción."

MARGIN = 90

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "public" / "og-image.png"

# Segoe UI en Windows, con alternativas para Linux/macOS por si el script se
# ejecuta en otro sitio (por ejemplo en un CI).
FONT_CANDIDATES_BOLD = [
    "C:/Windows/Fonts/segoeuib.ttf",
    "C:/Windows/Fonts/arialbd.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
]
FONT_CANDIDATES_REGULAR = [
    "C:/Windows/Fonts/segoeui.ttf",
    "C:/Windows/Fonts/arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/System/Library/Fonts/Supplemental/Arial.ttf",
]


def load_font(candidates: list[str], size: int) -> ImageFont.FreeTypeFont:
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size)
    raise SystemExit(
        "No se encontro ninguna tipografia utilizable. Rutas probadas:\n  "
        + "\n  ".join(candidates)
    )


def diagonal_gradient() -> Image.Image:
    """Degradado diagonal navy. Truco: una imagen 2x2 con los cuatro colores
    de esquina, ampliada con interpolacion bicubica."""
    seed = Image.new("RGB", (2, 2))
    seed.putpixel((0, 0), NAVY_MID)    # esquina superior izquierda, la mas clara
    seed.putpixel((1, 0), NAVY_BASE)
    seed.putpixel((0, 1), NAVY_BASE)
    seed.putpixel((1, 1), NAVY_DEEP)   # esquina inferior derecha, la mas oscura
    return seed.resize((WIDTH, HEIGHT), Image.Resampling.BICUBIC)


def add_orange_glow(base: Image.Image) -> None:
    """Halo naranja difuminado arriba a la derecha. Es el mismo recurso visual
    que usa el reproductor de la app (blur + opacidad baja)."""
    glow = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse(
        [WIDTH - 300, -300, WIDTH + 220, 220],
        fill=(*ORANGE, 78),
    )
    glow = glow.filter(ImageFilter.GaussianBlur(125))
    base.alpha_composite(glow)


def draw_waveform(draw: ImageDraw.ImageDraw, top: int, height: int) -> None:
    """Onda de audio decorativa: barras verticales redondeadas en naranja.

    Las alturas salen de una combinacion de senos, no de numeros aleatorios,
    para que regenerar la imagen de siempre el mismo resultado.
    """
    bar_w, gap = 7, 11
    step = bar_w + gap
    count = (WIDTH - MARGIN * 2) // step
    mid = top + height // 2

    for i in range(count):
        wave = (
            math.sin(i * 0.34) * 0.55
            + math.sin(i * 0.11 + 1.2) * 0.30
            + math.sin(i * 0.72) * 0.15
        )
        bar_h = max(6, int((0.30 + abs(wave) * 0.70) * height))
        x = MARGIN + i * step

        # Las barras se van apagando hacia la derecha para que el bloque de
        # texto de la izquierda siga siendo lo primero que se lee.
        alpha = int(235 - (i / max(count - 1, 1)) * 170)
        draw.rounded_rectangle(
            [x, mid - bar_h // 2, x + bar_w, mid + bar_h // 2],
            radius=bar_w // 2,
            fill=(*ORANGE, alpha),
        )


def build() -> Image.Image:
    canvas = diagonal_gradient().convert("RGBA")
    add_orange_glow(canvas)

    layer = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)

    font_title = load_font(FONT_CANDIDATES_BOLD, 132)
    font_subtitle = load_font(FONT_CANDIDATES_REGULAR, 44)

    # Regla naranja corta, como firma de marca sobre el titulo.
    rule_y = 168
    draw.rounded_rectangle(
        [MARGIN, rule_y, MARGIN + 96, rule_y + 8], radius=4, fill=(*ORANGE, 255)
    )

    draw.text((MARGIN, rule_y + 44), TITLE, font=font_title, fill=(*TEXT_PRIMARY, 255))
    draw.text(
        (MARGIN, rule_y + 212), SUBTITLE, font=font_subtitle, fill=(*TEXT_SECONDARY, 255)
    )

    draw_waveform(draw, top=470, height=110)

    canvas.alpha_composite(layer)
    return canvas.convert("RGB")


def main() -> int:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    build().save(OUTPUT, "PNG", optimize=True)

    size_kb = OUTPUT.stat().st_size / 1024
    with Image.open(OUTPUT) as check:
        dims = check.size

    print(f"OK  {OUTPUT.relative_to(ROOT)}  {dims[0]}x{dims[1]}  {size_kb:.0f} KB")

    if dims != (WIDTH, HEIGHT):
        print(f"ERROR: se esperaba {WIDTH}x{HEIGHT}", file=sys.stderr)
        return 1
    if size_kb >= 300:
        print("ERROR: supera los 300 KB", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
