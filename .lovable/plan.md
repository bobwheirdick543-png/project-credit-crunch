# Complete Soul Life build

## Goal
Finish Soul Life as a cohesive, publish-ready progressive web app with secure accounts, profile photos, protected game pages, working notifications, and cinematic image treatments without visible seams.

## Build
- Replace the homepage backdrop with the two supplied cinematic scenes, correctly oriented, edge-to-edge, color-matched, and softly blended between zones.
- Apply the same readable cinematic backdrop treatment to signup, verification, profile setup, welcome, login, password recovery, and password reset.
- Enable Lovable Cloud authentication and storage; add email/password and Google sign-in, account confirmation, recovery, sign-out, profile records, and avatar uploads.
- Validate signup, login, recovery, OTP/profile fields, and uploads in the browser and on protected data boundaries.
- Build the protected dashboard shell, navigation drawer, account menu, balances, quick actions, notification bell/panel, and standalone notifications page.
- Build all requested game pages and their tab/action flows: map, wallet, market, social, gangs, arena, pets, cards, rankings, profile, settings, and admin access.
- Add installable app metadata and icons. Offline behavior will use the guarded PWA setup so previews remain safe.
- Add unique metadata to every page and retain the existing light/dark theme.

## Technical details
- Store profiles, game state, and notifications in Lovable Cloud with user-scoped access rules; keep roles in a separate protected table.
- Store profile images in a dedicated avatar bucket with file type and size limits.
- Put signed-in screens behind the managed authenticated layout; every protected read/write also verifies the session.
- Use shared page-shell, navigation, tab, card, and form components to keep all pages consistent and reduce error risk.
- Use the supplied image files through the project asset service; use CSS cover positioning and mobile-safe scrolling rather than editing away image content.
- Add manifest/icons plus a guarded generated service worker for offline support.

## Verification
- Check account creation, confirmation state, sign-in, password recovery/reset, sign-out, avatar upload, protected redirects, notifications, navigation, and representative page actions.
- Check desktop and phone layouts, light/dark readability, image blending, install metadata, runtime console, and final build status.
