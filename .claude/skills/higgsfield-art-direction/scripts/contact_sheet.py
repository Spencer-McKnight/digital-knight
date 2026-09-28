#!/usr/bin/env python3
"""Tile renders into one sheet for review.

  contact_sheet.py a.png b.png c.png -o sheet.png --labels
  contact_sheet.py renders/*.png -o sheet.png --zone 0.2,0.1,0.8,0.4
  contact_sheet.py stage-*.png -o drift.png --drift

--zone outlines a text/safe area (fractions x0,y0,x1,y1) on every tile.
--drift adds a row of amplified differences between consecutive images, so
registration drift across stages shows up as bright pixels.
Transparent images sit on a checkerboard so edges and halos are visible.
"""
from __future__ import annotations

import argparse
import math
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageOps

LABEL_H = 22


def checker(size: tuple[int, int], cell: int = 12) -> Image.Image:
    bg = Image.new("RGB", size, (235, 235, 235))
    d = ImageDraw.Draw(bg)
    for y in range(0, size[1], cell):
        for x in range((y // cell % 2) * cell, size[0], cell * 2):
            d.rectangle([x, y, x + cell - 1, y + cell - 1], fill=(200, 200, 200))
    return bg


def tile(img: Image.Image, width: int) -> Image.Image:
    h = round(img.height * width / img.width)
    img = img.resize((width, h), Image.LANCZOS)
    if img.mode in ("RGBA", "LA") or "transparency" in img.info:
        rgba = img.convert("RGBA")
        base = checker(rgba.size)
        base.paste(rgba, mask=rgba.split()[3])
        return base
    return img.convert("RGB")


def drift(a: Image.Image, b: Image.Image, width: int) -> Image.Image:
    a = a.convert("RGB")
    b = b.convert("RGB").resize(a.size, Image.LANCZOS)
    diff = ImageOps.autocontrast(ImageChops.difference(a, b).convert("L"), cutoff=1)
    return tile(diff.convert("RGB"), width)


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("images", nargs="+", type=Path)
    ap.add_argument("-o", "--out", type=Path, required=True)
    ap.add_argument("--cols", type=int, default=0, help="default: up to 4")
    ap.add_argument("--width", type=int, default=480, help="tile width in px")
    ap.add_argument("--labels", action="store_true")
    ap.add_argument("--zone", type=str, help="x0,y0,x1,y1 as fractions")
    ap.add_argument("--drift", action="store_true")
    args = ap.parse_args()

    sources = [Image.open(p) for p in args.images]
    tiles = [(p.name, tile(im, args.width)) for p, im in zip(args.images, sources)]

    if args.zone:
        x0, y0, x1, y1 = (float(v) for v in args.zone.split(","))
        for _, t in tiles:
            d = ImageDraw.Draw(t)
            box = [x0 * t.width, y0 * t.height, x1 * t.width, y1 * t.height]
            d.rectangle(box, outline=(255, 0, 90), width=2)

    if args.drift:
        for i in range(len(sources) - 1):
            name = f"drift {args.images[i].stem} > {args.images[i + 1].stem}"
            tiles.append((name, drift(sources[i], sources[i + 1], args.width)))

    cols = args.cols or min(4, len(tiles))
    rows = math.ceil(len(tiles) / cols)
    cell_h = max(t.height for _, t in tiles) + (LABEL_H if args.labels or args.drift else 0)
    sheet = Image.new("RGB", (cols * args.width + (cols + 1) * 8, rows * cell_h + (rows + 1) * 8), (24, 24, 24))
    d = ImageDraw.Draw(sheet)

    for i, (name, t) in enumerate(tiles):
        x = 8 + (i % cols) * (args.width + 8)
        y = 8 + (i // cols) * (cell_h + 8)
        sheet.paste(t, (x, y))
        if args.labels or args.drift:
            d.text((x + 2, y + t.height + 4), f"{i + 1}. {name}", fill=(230, 230, 230))

    args.out.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(args.out)
    print(f"{args.out} ({len(tiles)} tiles, {cols}x{rows})")


if __name__ == "__main__":
    main()
