# AMIT Mastery — Assessment Core (Frontend)

React + Vite frontend for the Sprint 2 assessment core. Feature-based structure, a swappable
data layer, and English/Arabic with full RTL.

## Run it

```bash
npm install
cp .env.example .env
npm run dev          # http://localhost:5173
```

`npm run build` produces `dist/`. `npm run lint` and `npm run format` enforce the conventions below.

## Architecture

```
src/
├── app/                    routes table, App, provider composition
├── features/               one folder per screen — page + components + hooks
│   ├── overview/
│   ├── questions/
│   ├── review/
│   ├── builder/
│   ├── assembly/
│   ├── attempt/
│   ├── placement/
│   ├── security/
│   └── not-found/
├── shared/
│   ├── api/                config, ApiError, httpClient, httpApi, mock/, facade
│   ├── components/
│   │   ├── layout/         AppShell, Sidebar, Topbar, LanguageSelect, RoleSelect
│   │   └── ui/             one component per file, re-exported from index.js
│   ├── constants/          domain vocabulary, roles and permissions, UI tokens
│   ├── context/            ToastProvider, RoleProvider
│   ├── hooks/              useApi, useMutation, useCountdown
│   └── i18n/               provider, catalogues, language helpers
└── styles/                 tokens, base, layout, components, utilities
```

Three rules keep it navigable:

1. **A feature never imports from another feature.** Anything two features need moves to `shared/`.
2. **Pages compose, they don't fetch.** Each feature owns a hook (`useQuestionBank`, `useReviewQueue`,
   `useBlueprint`, `useFormAssembly`, `useAttempt`) that holds the reads, writes and notifications.
   Pages read that hook and arrange components.
3. **Codes live in `shared/constants`, labels live in `shared/i18n`.** No component invents a status
   string, and no component hard-codes a display label.

## Conventions

- **One component per file**, default export, `PropTypes` on every prop.
- **No inline styles**, with one deliberate exception: the progress bar's computed width.
- **No literal colours outside `styles/tokens.css`** — every value is a named custom property.
- **No magic numbers** — toast duration, timer warning threshold and mock latency are named constants.
- **Directional CSS is logical** (`margin-inline-start`, `inset-inline-end`, `text-align: start`),
  which is what makes the Arabic layout mirror without a second stylesheet.
- ESLint runs `react`, `react-hooks`, `jsx-a11y`, plus complexity and function-length caps.

## Switching from mock data to a real API

Everything runs on an in-memory mock by default. One flag changes that:

```env
VITE_USE_MOCK=false
VITE_API_BASE_URL=https://api.example.com
```

`src/shared/api/index.js` picks between `mock/mockApi.js` and `httpApi.js`. Both export the same
function names with the same arguments and return shapes, so **nothing else in the app changes**.
If the backend runs on another origin in development, uncomment the proxy block in `vite.config.js`.

### Endpoints the backend needs to expose

| Function | Method | Path |
| --- | --- | --- |
| `listQuestions` | GET | `/questions?status=&topic=` |
| `createQuestion` | POST | `/questions` |
| `listReviewQueue` | GET | `/questions/review?status=` |
| `decideReview` | POST | `/questions/:id/review` |
| `getBlueprint` | GET | `/assessments/:id/blueprint` |
| `saveBlueprint` | PUT | `/assessments/:id/blueprint` |
| `getBankReadiness` | GET | `/bank/readiness` |
| `listForms` | GET | `/assessments/:id/forms` |
| `runAssembly` | POST | `/assessments/:id/forms:assemble` |
| `getAttempt` | GET | `/attempts/:id` |
| `saveAnswer` | PUT | `/attempts/:id/answers/:questionId` |
| `submitAttempt` | POST | `/attempts/:id:submit` |
| `getPlacements` | GET | `/placements` |
| `getSecurityOverview` | GET | `/security/overview` |
| `listAudit` | GET | `/security/audit` |

Errors return `{ message, code, details }`. The UI branches on `code` (see `ERROR_CODE` in
`shared/api/ApiError.js`): an assembly failing with `bank_gap` and
`details: { topic, difficulty, missing }` opens the blocked-assembly dialog instead of a toast.

## Data shapes

Two kinds of field, deliberately separated:

- **Content** is bilingual — `{ en: "…", ar: "…" }` — read through `tx()`.
- **Enums** are codes — `status: "in_review"`, `difficulty: "hard"` — translated through `t()`.
  The backend never sends display strings for these.

Shapes are documented as JSDoc typedefs in `shared/api/types.js`.

## Internationalisation

`shared/i18n/` holds `en.json`, `ar.json`, the provider and small helpers (`languages.js`,
`languageStorage.js`, `translationsUtils.js`). Choosing Arabic sets `<html lang="ar" dir="rtl">`,
swaps the body font to IBM Plex Sans Arabic, and mirrors the layout. The choice persists in
`localStorage`, falling back to the browser language.

Add a key to **both** catalogues — `t()` falls back to English and warns in the console when one
is missing.

## Behaviour worth knowing

- **Role gating is real.** The top-bar role drives `useRole().canApprove`; instructor and student
  see approve and reject disabled, and `useReviewQueue` refuses the call before it is sent. The
  server enforces the same rule independently.
- **The attempt timer is display-only.** `useCountdown` ticks in the browser, but every save
  reconciles against `remainingSeconds` from the response — the server owns the timer, item order,
  answers and submit state.
- **Assembly failure names the gap.** Nothing is silently substituted; the dialog reports the exact
  topic, difficulty and shortfall.

## Accessibility

Visible focus throughout, a skip link, focus-trapped modals that close on Escape, `aria-live`
toasts, tables with captions and scoped headers, labelled form controls via `useId`, and
`prefers-reduced-motion` respected. The layout collapses to one column under 760px.
