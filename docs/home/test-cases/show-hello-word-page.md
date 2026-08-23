# Test Cases — Show Hello Word page

Risk level: low. Single public read-only page; main risk is contract mismatch between stored greeting, API, and render.

## Scenario: Home page shows stored greeting text
**Given** greeting row exists in PostgreSQL with text `Hello Word`
**When** guest opens home page
**Then** page shows visible text `Hello Word`
Check: render_url

## Scenario: Home page renders centered on plain white background
**Given** backend API returns stored greeting
**When** guest opens home page
**Then** browser displays text centered horizontally and vertically on plain white background
Check: manual

## Scenario: Home page renders black text with no animation
**Given** page is rendered from backend greeting
**When** guest opens home page
**Then** browser displays black text and no animation is shown
Check: manual

## Scenario: Home page stays public with no sign-in
**Given** guest is not signed in
**When** guest opens home page
**Then** page loads without sign-in prompt and still shows stored greeting text
Check: render_url

## Scenario: Backend returns stored greeting on GET /v1/greeting
**Given** greeting row exists in PostgreSQL with text `Hello Word`
**When** client sends `GET /v1/greeting`
**Then** response is `200 OK` with body `{"text":"Hello Word"}` and no extra fields
Check: fetch_url

## Scenario: Missing greeting row returns not_found envelope
**Given** greeting row is missing from PostgreSQL
**When** client sends `GET /v1/greeting`
**Then** response is `404 Not Found` with body `{"error":{"code":"not_found","message":"Greeting not found"}}`
Check: fetch_url

## Scenario: Backend/database failure returns internal_error envelope
**Given** backend API cannot read greeting because PostgreSQL is unavailable or query fails
**When** client sends `GET /v1/greeting`
**Then** response is `500 Internal Server Error` with body `{"error":{"code":"internal_error","message":"Unable to load greeting"}}`
Check: fetch_url

## Scenario: Unsupported method returns method_not_allowed envelope
**Given** endpoint `/v1/greeting` is available
**When** client sends unsupported method to `/v1/greeting`
**Then** response is `405 Method Not Allowed` with body `{"error":{"code":"method_not_allowed","message":"Method not allowed"}}`
Check: fetch_url

## Scenario: Frontend has no fallback greeting text
**Given** API is unavailable or returns error
**When** guest opens home page
**Then** page does not show alternate hardcoded greeting text
Check: manual
