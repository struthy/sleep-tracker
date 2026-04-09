# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Build for production
npm run deploy       # Build + push to gh-pages branch (deploys to GitHub Pages)
npm run lint         # ESLint
```

## Architecture

**React + Vite SPA** deployed to GitHub Pages. All data lives in Firebase (Firestore + Google Auth). No backend.

### Routing

Uses `HashRouter` (not `BrowserRouter`) — required because GitHub Pages cannot serve path-based routes. All routes are prefixed with `#`.

```
/#/login      → LoginPage (public)
/#/log        → SleepLogger (default after login)
/#/dashboard  → Dashboard
/#/history    → HistoryView
```

### Data Flow

1. `AuthContext` (`src/context/AuthContext.jsx`) — global auth state + `familyId`. Every authenticated component reads this.
2. All Firestore writes go through `src/services/sleepService.js`. Data is scoped to `families/{familyId}/sleepEntries`.
3. `useDashboardStats` does a one-time fetch; `useSleepEntries` uses `onSnapshot` for real-time updates on the History view.

### Firestore Data Model

```
families/{familyId}
  .members[]           # uids of both parents (family sharing)
  sleepEntries/{id}
    type: "nap" | "night"
    startTime, endTime: Timestamp
    durationMinutes: number   # always store this — avoids recalc in queries
    logMethod: "timer" | "manual"
    mood: "great" | "okay" | "rough" | null
    notes: string | null
    createdBy: uid
users/{uid}
  familyId: string    # FK to families
```

### Key Files

| File | Purpose |
|------|---------|
| `src/services/sleepService.js` | All Firestore CRUD — start here for data changes |
| `src/services/claudeService.js` | Direct browser call to Anthropic API. Requires `anthropic-dangerous-direct-browser-access: true` header |
| `src/hooks/useActiveTimer.js` | Timer state persisted to `localStorage` under key `sleepTracker_activeTimers` |
| `src/utils/sleepCalculations.js` | All stats and chart data transforms — feeds both dashboard and AI prompt |
| `src/utils/dateHelpers.js` | `formatDuration`, `formatTime`, `formatDate`, `combineDateAndTime` |

### Family Sharing

- Parent A signs in → new `families/{uid}` doc created, their `uid` stored as `familyId`
- Parent B signs in → clicks "Join a family account" → enters Parent A's `familyId` → `joinFamily()` in `src/services/auth.js` appends their uid to `members[]`
- Both parents read/write the same `sleepEntries` subcollection

### AI Insights

`claudeService.js` calls `api.anthropic.com/v1/messages` directly from the browser using `claude-haiku-4-5-20251001`. The API key is in `VITE_ANTHROPIC_API_KEY`. For a personal app this is acceptable — set usage limits in the Anthropic console as a safeguard.

## Environment Setup

Copy `.env.example` to `.env.local` and fill in values from:
- Firebase Console → Project settings → Your apps → Web app config
- Anthropic Console → API keys

## Deployment

1. Replace `YOUR_GITHUB_USERNAME` in `package.json` `homepage` field
2. Push source code to `main` branch of a GitHub repo named `sleep-tracker`
3. `npm run deploy` — builds and pushes `dist/` to the `gh-pages` branch
4. GitHub repo Settings → Pages → Source: `gh-pages` branch
5. Firebase Console → Authentication → Settings → Authorized domains → add `<username>.github.io`

## Firebase Security Rules

Deploy these rules in the Firebase Console (Firestore → Rules):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /families/{familyId} {
      allow read: if request.auth.uid in resource.data.members;
      allow create: if request.auth.uid in request.resource.data.members;
      allow update: if request.auth.uid in resource.data.members;
      match /sleepEntries/{entryId} {
        allow read, list: if request.auth.uid in
          get(/databases/$(database)/documents/families/$(familyId)).data.members;
        allow create, update, delete: if request.auth.uid in
          get(/databases/$(database)/documents/families/$(familyId)).data.members;
      }
    }
  }
}
```
