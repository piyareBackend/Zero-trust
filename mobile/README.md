# Zero Trust mobile

The Android and iOS shells are generated from the existing `dist/` web application with Capacitor. The same backend/API is used for account and entitlement synchronization. Set the `ZT_APP_SERVER_URL` Actions secret to the production web origin before store builds so native shells use the production API.

Android output includes a debug APK and an unsigned release AAB for verification. Store signing must use the owner's private signing credentials and is intentionally not committed to the repository.

iOS CI verifies an unsigned simulator build. App Store distribution requires the owner's Apple signing certificates/profiles and App Store Connect credentials.
