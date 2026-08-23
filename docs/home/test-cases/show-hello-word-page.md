# Test Cases — Show Hello Word page

Risk level: low. Single public read-only page, but contract and failure states matter because pipeline proof depends on exact render and API shape.

## Automated coverage

**Scenario**: AC-1 stored greeting shows on home page
**Given** PostgreSQL has greeting row with text `Hello Word`, and backend API returns that stored value
**When** guest opens home page
**Then** page shows exact text `Hello Word`
**Check**: render_url
**Traces to**: HOME-001 AC-1

**Scenario**: AC-2 text is centered on white background
**Given** backend API returns stored greeting
**When** guest opens home page
**Then** page displays greeting centered horizontally and vertically on plain white background
**Check**: render_url
**Traces to**: HOME-001 AC-2

**Scenario**: AC-3 text is black and no animation shown
**Given** page is rendered and backend API returns stored greeting
**When** guest opens home page
**Then** visible greeting text is black and no animation appears
**Check**: manual
**Traces to**: HOME-001 AC-3

**Scenario**: Missing greeting row shows error state, not blank page
**Given** greeting row is missing in PostgreSQL and backend API returns `404 Not Found` with error code `not_found`
**When** guest opens home page
**Then** page shows error state and no greeting text from stale data or blank screen
**Check**: render_url
**Traces to**: HOME-001 failure behavior: Not found / Upstream failure

**Scenario**: Public page stays accessible without sign-in
**Given** guest is not signed in
**When** guest opens home page
**Then** page renders normally and does not show sign-in UI
**Check**: render_url
**Traces to**: HOME-001 failure behavior: Not permitted

**Scenario**: Stored greeting value renders unchanged
**Given** PostgreSQL greeting row text is exact `Hello Word` and backend API returns that value
**When** guest opens home page
**Then** page shows `Hello Word` with no trimming or replacement
**Check**: fetch_url
**Traces to**: HOME-001 failure behavior: Boundary

## Backend contract coverage

**Scenario**: GET /v1/greeting success shape
**Given** greeting row exists in PostgreSQL
**When** client calls `GET /v1/greeting`
**Then** response is `200 OK` with JSON body `{ "text": "Hello Word" }`
**Check**: fetch_url
**Traces to**: services.md /v1/greeting success response

**Scenario**: GET /v1/greeting missing row error envelope
**Given** greeting row is missing
**When** client calls `GET /v1/greeting`
**Then** response is `404 Not Found` with JSON body `{ "error": { "code": "not_found", "message": "Greeting not found" } }`
**Check**: fetch_url
**Traces to**: services.md /v1/greeting 404

**Scenario**: GET /v1/greeting upstream failure envelope
**Given** PostgreSQL or backend lookup fails
**When** client calls `GET /v1/greeting`
**Then** response is `500 Internal Server Error` with JSON body `{ "error": { "code": "internal_error", "message": "Unable to load greeting" } }`
**Check**: fetch_url
**Traces to**: services.md /v1/greeting 500

**Scenario**: GET /v1/greeting rejects unsupported method
**Given** endpoint exists
**When** client sends unsupported method to `/v1/greeting`
**Then** response is `405 Method Not Allowed` with JSON body `{ "error": { "code": "method_not_allowed", "message": "Method not allowed" } }`
**Check**: fetch_url
**Traces to**: services.md /v1/greeting 405

**Scenario**: Frontend uses configured API URL only
**Given** `NEXT_PUBLIC_API_URL` is set
**When** home page loads
**Then** frontend calls `${NEXT_PUBLIC_API_URL}/v1/greeting` and uses returned text, with no hardcoded fallback greeting
**Check**: manual
**Traces to**: services.md Frontend integration
