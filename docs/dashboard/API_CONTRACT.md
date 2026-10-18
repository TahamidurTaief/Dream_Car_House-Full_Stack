# Dashboard API contract

## Implemented management authentication endpoints

Base: `/api/v1/dashboard/` on the existing Django origin. Uses SessionAuthentication with CSRF enforcement on state-changing methods, JSONRenderer (never public DefaultRenderer), and emits strict privacy and indexing headers:

```http
Cache-Control: private, no-store, must-revalidate
X-Robots-Tag: noindex, nofollow, noarchive
```

### 1. `POST /api/v1/dashboard/auth/login/`
Authenticates credentials against Django's active staff user accounts. Enforces in-memory rate limiting / IP throttling. Returns generic "Invalid credentials." errors to prevent user enumeration.

- **Request Body:**
  ```json
  {
    "username": "staff_member",
    "password": "secret_password"
  }
  ```
- **Success Response (200 OK):**
  - Sets HttpOnly, Secure (in production), SameSite=Lax `sessionid` and `csrftoken` cookies.
  - Body:
    ```json
    {
      "success": true,
      "data": {
        "user": {
          "id": 1,
          "username": "staff_member",
          "email": "staff@begautos.com",
          "is_staff": true,
          "is_superuser": false,
          "permissions": ["inventory.view_inventory"]
        },
        "csrf_token": "..."
      }
    }
    ```
- **Error Responses (403 Forbidden / 429 Too Many Requests):**
  ```json
  {"success": false, "error": {"code": "INVALID_CREDENTIALS", "message": "Invalid credentials."}}
  ```
  ```json
  {"success": false, "error": {"code": "THROTTLED", "message": "Too many login attempts. Please try again later."}}
  ```

### 2. `POST /api/v1/dashboard/auth/logout/`
Flushes the active Django session and clears session cookies.
- **Request Headers:**
  - `Cookie: sessionid=...`
  - `X-CSRFToken: ...`
- **Response (200 OK):**
  ```json
  {"success": true, "data": {"message": "Logged out successfully."}}
  ```

### 3. `GET /api/v1/dashboard/auth/me/`
Returns current authenticated active staff user details, superuser flag, and complete model permissions (`app_label.action_model`).
- **Request Headers:**
  - `Cookie: sessionid=...`
- **Success Response (200 OK):**
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": 1,
        "username": "staff_member",
        "email": "staff@begautos.com",
        "is_staff": true,
        "is_superuser": false,
        "permissions": ["inventory.view_inventory"]
      }
    }
  }
  ```
- **Unauthenticated Response (401 Unauthorized / 403 Forbidden):**
  ```json
  {"success": false, "error": {"code": "UNAUTHENTICATED", "message": "Authentication required."}}
  ```

### 4. `GET /api/v1/dashboard/access/`
Active staff probe endpoint. Verifies valid session and active staff status.
- **Response (200 OK):**
  ```json
  {"success": true, "data": {"authenticated": true, "user_id": 1, "username": "staff_member"}}
  ```
- **Anonymous Response (403 Forbidden):**
  ```json
  {"success": false, "error": {"code": "FORBIDDEN", "message": "You do not have permission to perform this action."}}
  ```

---

## Server-only BFF client

`lib/server/api.ts` and `lib/server/auth.ts` provide server-only authenticated request wrappers:
- `getDashboardAccess()`: Reads `sessionid` and `csrftoken` from Next.js cookie store, verifies against `auth/me/`, and decodes user profile and permissions.
- `getManagementAccess()`: Reusable gate for protected Server Components. Fails closed with typed error before querying business services.
- `hasPermission(user, permission)`: Model permission helper validating e.g. `inventory.view_inventory` with superuser bypass.
- `validateSafeRedirect(target, fallback)`: Prevents Open Redirect attacks by validating relative paths and rejecting scheme-relative/protocol paths.

Cookies are maintained as:
- `sessionid`: HttpOnly, Secure in production, SameSite=Lax, Path=/
- `csrftoken`: Secure in production, SameSite=Lax, Path=/

Credentials, tokens, and backend secrets are never placed in `localStorage`, public cookies, or `NEXT_PUBLIC_*` variables.

---

## Existing public contracts: unchanged

`apis.renderers.DefaultRenderer`, public pagination, inventory filters/details, contact form endpoints, and sitemaps remain untouched and isolated from the dashboard API namespace.
