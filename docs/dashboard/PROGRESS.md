# Dashboard progress

Phase: secure dashboard authentication. Date: 2026-10-18 (Asia/Dhaka). Baseline commit: fd8d42d.
No deployment, destructive migrations, business-table duplication or changes to public website endpoints.

## Completed

- **Authentication Architecture Selected:** Same-origin Next.js BFF server boundary communicating with Django session-based endpoints under `/api/v1/dashboard/auth/`.
- **Cookie & Session Management:** Next.js manages `sessionid` as `HttpOnly`, `SameSite=Lax`, `Path=/`, and `Secure` in production. `csrftoken` is handled on mutations and verified by Django's `CsrfViewMiddleware` and `SessionAuthentication`.
- **Django Management Endpoints (`apps.dashboard_api`):**
  - `POST /api/v1/dashboard/auth/login/`: Validates active staff credentials, throttles brute force attempts per IP, emits generic error messages to prevent user enumeration, returns user object and CSRF token.
  - `POST /api/v1/dashboard/auth/logout/`: Flushes the active session in Django.
  - `GET /api/v1/dashboard/auth/me/`: Returns user ID, username, email, staff/superuser flags, and complete model permissions (`app_label.action_model`).
  - `GET /api/v1/dashboard/access/`: Active staff probe failing closed on anonymous or unauthenticated calls.
- **Server-Side Permissions & Guards:**
  - `IsActiveStaff` permission enforces active and staff status on every request.
  - `DashboardModelPermission` enforces explicit permissions (`view_<model>`, `add_<model>`, `change_<model>`, `delete_<model>`), including GET/OPTIONS/HEAD checks.
- **SSR Next.js Application:**
  - SSR `/login` route with accessible React 19 `useActionState` form, input validation, and safe redirect validation.
  - SSR `/workspace` protected route requiring authenticated staff and displaying user role/permissions, with server-action logout.
  - Root `/` reflects live authentication state.
  - Topbar badge in `Shell` indicates authenticated staff status.

## Verification

| Check | Result / limits |
|---|---|
| Next production build | Passed: `next build && node scripts/prepare-standalone.mjs` (prerendered `/robots.txt` + dynamic `/`, `/_not-found`, `/login`, `/workspace`). |
| Next Typecheck | Passed: `next typegen && tsc --noEmit` with zero errors. |
| Next ESLint | Passed with `--max-warnings=0`. |
| Next Unit & Transport Tests | Passed: 7 scenarios pass (missing credentials rejection, bad config validation, HTTP error normalization, envelope validation, timeout distinction, open-redirect prevention, model permission checks). |
| Django Boundary & Auth Tests | Passed: 9 tests in `apps.dashboard_api.tests.DashboardAuthIntegrationTests` (anonymous 403 rejection, active staff login, inactive staff rejection, non-staff rejection, bad password rejection, me endpoint permissions, CSRF logout, 404 for unknown modules, preservation of public URLs). |
| Public Preservation | Verified: all existing public endpoints and serializers remain untouched. |

## Known gaps and decisions

- Business module CRUD (inventory listings, filters, edits, media uploads) remains planned for future phases.
- Two-factor authentication (2FA) is not currently part of the base Django configuration.
- Rate limiting uses an in-memory sliding window per IP; in a multi-instance production cluster, Redis-backed cache throttling would be used.

## Next phase

1. Implement a narrow read-only slice for `apps.inventory` (Inventory, Brand, CarModel) with active-staff permission checks, server pagination, URL search/filter parameters, and error envelopes.
2. Build management serializers exposing raw editable values and preserving model save/form invariants.
3. Add mutation workflows (add/change/delete) with parent-child transaction validation and image upload handling.
