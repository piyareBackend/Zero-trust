# Zero Trust production platform

## Website
- Static tool pages remain generated from the existing catalog; the build fails if the 1009 modern tools or category counts drift.
- Responsive navigation exposes the full category set through the Tools menu and mobile hamburger.
- Local-first tools stay browser-side where technically possible.
- Phase-2/network-dependent tools default to server-verified Pro access. The owner can explicitly override an entitlement in the control room.
- The browser runtime performs a backend entitlement preflight before mounting a protected tool. The Worker repeats authorization for the entitlement API; client flags are never trusted as payment proof.

## Accounts
- Email signup requires first/last name, email, password confirmation, country, timezone, Terms and Privacy acceptance; marketing consent is optional.
- Google OAuth uses a server-side client secret, short-lived one-time state records, verified Google email identity, and an HttpOnly session cookie.
- Profile data is stored separately from credentials. Password hashes and OAuth identities are never exposed to the browser.
- Account profile changes require the session CSRF token.

## Owner control room
- Owner role is stored in D1 and checked server-side on every owner route.
- User plan/status changes, service entitlements, settings and announcements are audit logged.
- The owner cannot be downgraded through the normal user mutation route.
- Bootstrap credentials are environment secrets and never committed.

## Payments and store billing
The repository intentionally does not fake a live payment confirmation. The billing boundary is:
1. Web checkout provider creates/updates a subscription on the server.
2. Provider webhook is authenticated and updates a server subscription record.
3. D1 entitlement is derived from the verified subscription state.
4. Native Android purchases are verified server-side with Google Play purchase data before Pro is granted.
5. Native iOS purchases are verified server-side with Apple transaction data before Pro is granted.
6. Revoke, refund, expiry and account cancellation remove or suspend the entitlement.
7. The app never receives a secret provider key and never decides Pro status locally.

Store signing and production payment credentials must remain outside Git and be supplied as deployment secrets.

## Mobile
Capacitor packages the existing responsive web application rather than duplicating the tool engines. Android phones/tablets and iOS devices therefore use the same catalog, UI behavior, account API and entitlement model. Native store billing remains a separate native adapter while the backend stays the single entitlement authority.
