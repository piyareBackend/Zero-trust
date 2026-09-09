# Paid engine boundary

Paid tool engines must remain outside the free-tool bundles.

Rules:
- Never import paid engines from `engines/free/*`.
- Paid engines are requested only after entitlement verification.
- User files remain in the browser; the licensing service receives entitlement/auth data only.
- Production paid bundles should be built separately, minified, and source maps disabled.
- Encryption/obfuscation is defense-in-depth, not a claim that browser-delivered code is impossible to inspect.

This directory intentionally contains no paid processing implementation yet.