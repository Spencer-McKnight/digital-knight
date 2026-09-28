#!/usr/bin/env python3
"""Clean cut-outs for floating elements.

  matte.py pair --white on-white.png --black on-black.png -o out.webp --trim
      Difference matte. Recovers true partial alpha (soft edges, glass, smoke)
      from the same object rendered on pure white and pure black.

  matte.py key in.png -o out.webp --color '#00FF00' [--tolerance 40 --soft 40]
      Removes a flat backdrop colour, with spill suppression.

  matte.py clean in.png -o out.webp --trim
      Tidies native or remover alpha: snaps near-opaque pixels to 255 and
      erodes the 1px grey halo some models leave.

Common: --trim crops to visible pixels, --pad N keeps a margin (default 16).
Output format follows the extension (.png, .webp, .avif).
"""
from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


def load(path: Path) -> np.ndarray:
    return np.asarray(Image.open(path).convert("RGB"), dtype=np.float32) / 255.0


def pair(white: Path, black: Path) -> Image.Image:
    w, b = load(white), load(black)
    if w.shape != b.shape:
        raise SystemExit(f"size mismatch: {w.shape} vs {b.shape}")
    # Over white: W = aC + (1 - a). Over black: B = aC. So a = 1 - (W - B).
    alpha = np.clip(1.0 - (w - b).mean(axis=2), 0.0, 1.0)
    safe = np.where(alpha > 1e-3, alpha, 1.0)[..., None]
    color = np.clip(b / safe, 0.0, 1.0)
    return to_image(color, alpha)


def key(src: Path, hex_color: str, tolerance: float, soft: float) -> Image.Image:
    rgb = load(src)
    target = np.array([int(hex_color.lstrip("#")[i : i + 2], 16) for i in (0, 2, 4)], dtype=np.float32) / 255.0
    dist = np.linalg.norm(rgb - target, axis=2) * 255.0 / np.sqrt(3)
    alpha = np.clip((dist - tolerance) / max(soft, 1e-3), 0.0, 1.0)
    # Pull the key's dominant channel down to the others where it spills.
    ch = int(np.argmax(target))
    others = [c for c in range(3) if c != ch]
    cap = rgb[..., others].max(axis=2)
    rgb[..., ch] = np.minimum(rgb[..., ch], np.maximum(cap, rgb[..., ch] * alpha))
    return to_image(rgb, alpha)


def clean(src: Path, snap: int) -> Image.Image:
    img = Image.open(src).convert("RGBA")
    r, g, b, a = img.split()
    a = a.point(lambda v: 255 if v >= snap else v)
    a = a.filter(ImageFilter.MinFilter(3))
    return Image.merge("RGBA", (r, g, b, a))


def to_image(rgb: np.ndarray, alpha: np.ndarray) -> Image.Image:
    data = np.dstack([rgb, alpha]) * 255.0
    return Image.fromarray(np.round(data).astype(np.uint8))


def trim(img: Image.Image, pad: int) -> Image.Image:
    box = img.split()[3].point(lambda v: 255 if v > 8 else 0).getbbox()
    if not box:
        return img
    x0, y0, x1, y1 = box
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="mode", required=True)

    p = sub.add_parser("pair")
    p.add_argument("--white", type=Path, required=True)
    p.add_argument("--black", type=Path, required=True)

    k = sub.add_parser("key")
    k.add_argument("src", type=Path)
    k.add_argument("--color", default="#00FF00")
    k.add_argument("--tolerance", type=float, default=40)
    k.add_argument("--soft", type=float, default=40)

    c = sub.add_parser("clean")
    c.add_argument("src", type=Path)
    c.add_argument("--snap", type=int, default=250)

    for s in (p, k, c):
        s.add_argument("-o", "--out", type=Path, required=True)
        s.add_argument("--trim", action="store_true")
        s.add_argument("--pad", type=int, default=16)

    args = ap.parse_args()
    if args.mode == "pair":
        out = pair(args.white, args.black)
    elif args.mode == "key":
        out = key(args.src, args.color, args.tolerance, args.soft)
    else:
        out = clean(args.src, args.snap)

    if args.trim:
        out = trim(out, args.pad)

    args.out.parent.mkdir(parents=True, exist_ok=True)
    opts = {"lossless": False, "quality": 90} if args.out.suffix.lower() == ".webp" else {}
    out.save(args.out, **opts)
    print(f"{args.out} {out.width}x{out.height}")


if __name__ == "__main__":
    main()
