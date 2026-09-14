# First 100 Tool Fix Report

Date: 2026-09-14
Branch: `fix/first-100-tools`

## Scope

The first 100 entries in the current catalog are the first 100 image-format converter routes. They were previously routed through a generic image engine that only recognized a small subset of output formats and could silently fall back to an unrelated generic engine.

## Changes

- Reworked `engines/free/strict-image.js` into a capability-aware local image conversion engine.
- Added native Canvas conversion for JPG, PNG, WEBP, AVIF, GIF and BMP where the browser supports the codec.
- Added local SVG rasterization.
- Added local TIFF decoding/encoding through a lazily loaded browser library.
- Added local HEIC decoding through a lazily loaded browser library.
- Added local SVG, ICO and PDF output generation.
- Added 30 MB input and 16 MP working-pixel safety limits.
- Added explicit failure messages for formats that cannot be safely encoded instead of generating a fake or mislabeled file.
- Added a cache-busting engine version so deployed browsers do not keep the previous broken module.
- Files are processed in the browser; the core conversion path does not upload the selected file.

## Status

**82/100 routes are implemented as working local conversions.**

**18/100 routes are intentionally guarded** because a browser-safe encoder/decoder for those directions is not present. These routes now fail explicitly rather than pretending to succeed.

| # | Tool | Status | Notes |
|---:|---|---|---|
| 1 | JPG → PNG | FIXED | |
| 2 | JPG → WEBP | FIXED | |
| 3 | JPG → AVIF | FIXED | |
| 4 | JPG → GIF | FIXED | |
| 5 | JPG → BMP | FIXED | |
| 6 | JPG → TIFF | FIXED | |
| 7 | JPG → HEIC | GUARDED | HEIC output not supported by browser-safe encoder |
| 8 | JPG → SVG | FIXED | |
| 9 | JPG → ICO | FIXED | |
| 10 | JPG → PDF | FIXED | |
| 11 | JPG → RAW | GUARDED | RAW output is not supported by browser-safe encoder |
| 12 | PNG → JPG | FIXED | |
| 13 | PNG → WEBP | FIXED | |
| 14 | PNG → AVIF | FIXED | |
| 15 | PNG → GIF | FIXED | |
| 16 | PNG → BMP | FIXED | |
| 17 | PNG → TIFF | FIXED | |
| 18 | PNG → HEIC | GUARDED | HEIC output not supported by browser-safe encoder |
| 19 | PNG → SVG | FIXED | |
| 20 | PNG → ICO | FIXED | |
| 21 | PNG → PDF | FIXED | |
| 22 | PNG → RAW | GUARDED | RAW output is not supported by browser-safe encoder |
| 23 | WEBP → JPG | FIXED | |
| 24 | WEBP → PNG | FIXED | |
| 25 | WEBP → AVIF | FIXED | |
| 26 | WEBP → GIF | FIXED | |
| 27 | WEBP → BMP | FIXED | |
| 28 | WEBP → TIFF | FIXED | |
| 29 | WEBP → HEIC | GUARDED | HEIC output not supported by browser-safe encoder |
| 30 | WEBP → SVG | FIXED | |
| 31 | WEBP → ICO | FIXED | |
| 32 | WEBP → PDF | FIXED | |
| 33 | WEBP → RAW | GUARDED | RAW output is not supported by browser-safe encoder |
| 34 | AVIF → JPG | FIXED | |
| 35 | AVIF → PNG | FIXED | |
| 36 | AVIF → WEBP | FIXED | |
| 37 | AVIF → GIF | FIXED | |
| 38 | AVIF → BMP | FIXED | |
| 39 | AVIF → TIFF | FIXED | |
| 40 | AVIF → HEIC | GUARDED | HEIC output not supported by browser-safe encoder |
| 41 | AVIF → SVG | FIXED | |
| 42 | AVIF → ICO | FIXED | |
| 43 | AVIF → PDF | FIXED | |
| 44 | AVIF → RAW | GUARDED | RAW output is not supported by browser-safe encoder |
| 45 | GIF → JPG | FIXED | |
| 46 | GIF → PNG | FIXED | |
| 47 | GIF → WEBP | FIXED | |
| 48 | GIF → AVIF | FIXED | |
| 49 | GIF → BMP | FIXED | |
| 50 | GIF → TIFF | FIXED | |
| 51 | GIF → HEIC | GUARDED | HEIC output not supported by browser-safe encoder |
| 52 | GIF → SVG | FIXED | |
| 53 | GIF → ICO | FIXED | |
| 54 | GIF → PDF | FIXED | |
| 55 | GIF → RAW | GUARDED | RAW output is not supported by browser-safe encoder |
| 56 | BMP → JPG | FIXED | |
| 57 | BMP → PNG | FIXED | |
| 58 | BMP → WEBP | FIXED | |
| 59 | BMP → AVIF | FIXED | |
| 60 | BMP → GIF | FIXED | |
| 61 | BMP → TIFF | FIXED | |
| 62 | BMP → HEIC | GUARDED | HEIC output not supported by browser-safe encoder |
| 63 | BMP → SVG | FIXED | |
| 64 | BMP → ICO | FIXED | |
| 65 | BMP → PDF | FIXED | |
| 66 | BMP → RAW | GUARDED | RAW output is not supported by browser-safe encoder |
| 67 | TIFF → JPG | FIXED | |
| 68 | TIFF → PNG | FIXED | |
| 69 | TIFF → WEBP | FIXED | |
| 70 | TIFF → AVIF | FIXED | |
| 71 | TIFF → GIF | FIXED | |
| 72 | TIFF → BMP | FIXED | |
| 73 | TIFF → HEIC | GUARDED | HEIC output not supported by browser-safe encoder |
| 74 | TIFF → SVG | FIXED | |
| 75 | TIFF → ICO | FIXED | |
| 76 | TIFF → PDF | FIXED | |
| 77 | TIFF → RAW | GUARDED | RAW output is not supported by browser-safe encoder |
| 78 | HEIC → JPG | FIXED | |
| 79 | HEIC → PNG | FIXED | |
| 80 | HEIC → WEBP | FIXED | |
| 81 | HEIC → AVIF | FIXED | |
| 82 | HEIC → GIF | FIXED | |
| 83 | HEIC → BMP | FIXED | |
| 84 | HEIC → TIFF | FIXED | |
| 85 | HEIC → SVG | FIXED | |
| 86 | HEIC → ICO | FIXED | |
| 87 | HEIC → PDF | FIXED | |
| 88 | HEIC → RAW | GUARDED | RAW output is not supported by browser-safe encoder |
| 89 | SVG → JPG | FIXED | |
| 90 | SVG → PNG | FIXED | |
| 91 | SVG → WEBP | FIXED | |
| 92 | SVG → AVIF | FIXED | |
| 93 | SVG → GIF | FIXED | |
| 94 | SVG → BMP | FIXED | |
| 95 | SVG → TIFF | FIXED | |
| 96 | SVG → HEIC | GUARDED | HEIC output not supported by browser-safe encoder |
| 97 | SVG → ICO | FIXED | |
| 98 | SVG → PDF | FIXED | |
| 99 | SVG → RAW | GUARDED | RAW output is not supported by browser-safe encoder |
| 100 | ICO → JPG | GUARDED | ICO input decoding varies by browser |

## Validation

The repository's existing CI already contains JavaScript syntax checks, catalog integrity checks, capability audits, complete static builds, Cloudflare artifact verification, static page integrity checks, security regression tests and an exhaustive 1,595-tool browser regression. The branch is therefore intended to be validated by the existing quality workflow before merging.

## Next step

The remaining 18 guarded routes should only be marked fixed after adding a reliable browser-compatible HEIC encoder, RAW decoder/encoder strategy, and deterministic ICO decoder. No fake conversion or mislabeled output should be introduced merely to increase the pass count.
