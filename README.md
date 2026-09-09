# Zero Trust

Privacy-first, local-first browser utilities. The core architecture requires no application database and no mandatory backend.

## MVP

The first ten product tools are implemented as crawlable pages:

1. PDF Merger
2. PDF Compressor
3. PDF to JPG
4. JPG to PDF
5. PDF Splitter
6. Image Compressor
7. Image Resizer
8. Image Cropper
9. QR Code Generator
10. QR Code Scanner

Additional foundation tools already wired into the shared engine include Password Generator, JSON Formatter, Base64, Hash Generator, UUID Generator, Text Encryption, File Encryption and Metadata Removal.

## Principles

- Process sensitive inputs locally whenever possible.
- No account or database for core tools.
- Heavy processing dependencies are loaded only when needed.
- PWA shell and offline caching for same-origin assets.
- Crawlable tool URLs with unique metadata.
- Tool discovery through normal links and a generated sitemap.
- Responsive, accessible and ad-ready layout.

## Deployment

The repository is static and can be deployed to GitHub Pages or another static host. The included GitHub Actions workflow publishes the repository as a Pages artifact when Pages is enabled for the repository.

## Important security limitation

Some MVP PDF/QR dependencies are loaded on demand from public CDNs. The user's selected data is processed in the browser, but the tool may require a network connection to fetch the processing library on first use. For a stricter offline/privacy guarantee, those dependencies should later be vendored and pinned into the repository.

## SEO

The architecture includes semantic HTML, per-tool titles/descriptions/canonicals, clean URLs, internal links, sitemap.xml, robots.txt and structured data where appropriate. Ranking cannot be guaranteed; the product should focus on satisfying search intent with genuinely useful pages rather than keyword stuffing or scaled low-value content.
