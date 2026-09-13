# Outdoor Athlete v1

A mobile-first Progressive Web App (PWA) that digitizes the Outdoor Athlete Longevity 12-week training plan.

## Included in v1
- Today screen with current week/phase and next workout
- Strength A/B/C workout logging
- Previous load reference
- Energy, soreness, ride-tomorrow and joint-sensitivity check-in
- 12-week progression selector
- Exercise library and joint-durability library
- Workout history
- Local/offline storage
- JSON backup and restore
- Installable home-screen web app once hosted over HTTPS

## Important data note
V1 stores workout data in the browser on the device. Clearing site/browser data can erase it. Use Settings → Export backup periodically.

## Fastest deployment options
### Option A — GitHub Pages
1. Create a GitHub repository (for example `outdoor-athlete`).
2. Upload the files from this folder to the repository root.
3. Open Repository Settings → Pages.
4. Under Build and deployment, choose Deploy from a branch, branch `main`, folder `/ (root)`.
5. GitHub will provide an HTTPS URL.
6. Open that URL in Chrome on iPhone → Share → Add to Home Screen.

### Option B — Netlify Drop
1. Go to Netlify Drop in a desktop browser.
2. Drag this entire folder into the upload area.
3. Netlify will give you an HTTPS URL.
4. Open that URL in Chrome on iPhone → Share → Add to Home Screen.

## Local desktop preview
A service worker requires HTTP/HTTPS, not just double-clicking index.html. From this folder, run:

`python -m http.server 8000`

Then open http://localhost:8000.

## v1.1 update
- Warm-up items are tappable and open technique references.
- Workout exercise names are tappable and open technique references.
- Exercise library items are tappable.
- Saved workouts in History can now be opened to review sets, reps, loads, notes, RPE and energy.
- Exercise references include a quick YouTube demo search link.
