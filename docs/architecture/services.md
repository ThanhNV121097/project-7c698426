# Services

Project: `hello-word-8`

## Conventions

- Paths use `/v1/...` and never include `/api` prefix.
- JSON fields use lower camelCase.
- All errors use shared envelope.
- Public read-only API. No auth required.

## Shared error envelope

```json
{
  "error": {
    "code": "string",
    "message": "string"
  }
}
```

Error codes:

| Code | HTTP status | Meaning |
|---|---:|---|
| `not_found` | 404 | Required greeting row missing. |
| `internal_error` | 500 | Database or unexpected server failure. |
| `method_not_allowed` | 405 | HTTP method not supported for path. |

Messages are safe for public display and do not include database details.

## Endpoints

### `GET /healthz`

Health check for runtime and compose.

Request body: none.

Success response: `200 OK`

```json
{
  "status": "ok"
}
```

Health returns 200 only after migrations succeeded and `SELECT 1` against PostgreSQL succeeds.

Failure response: `503 Service Unavailable`

```json
{
  "error": {
    "code": "internal_error",
    "message": "Service unavailable"
  }
}
```

### `GET /v1/greeting`

Returns stored greeting for home page.

Auth: none.

Request body: none.

Success response: `200 OK`

```json
{
  "text": "Hello Word"
}
```

Frontend API adapter may map this success response into reviewed UI mock union `{ "status": "ok", "text": "Hello Word" }`. Backend does not include `status` on success because service convention returns resource JSON directly.

Failure responses use shared error envelope. Frontend API adapter may map these into reviewed UI mock union `{ "status": "error", "error": { ... } }`.

`404 Not Found`

```json
{
  "error": {
    "code": "not_found",
    "message": "Greeting not found"
  }
}
```

`500 Internal Server Error`

```json
{
  "error": {
    "code": "internal_error",
    "message": "Unable to load greeting"
  }
}
```

`405 Method Not Allowed`

```json
{
  "error": {
    "code": "method_not_allowed",
    "message": "Method not allowed"
  }
}
```

## Frontend integration

Frontend reads `NEXT_PUBLIC_API_URL` and calls `${NEXT_PUBLIC_API_URL}/v1/greeting`. No fallback greeting text is allowed in frontend because SRS requires database-backed text.

Reviewed mock module: `code/frontend/lib/mock/show-hello-word-page.ts` on `feature/show-hello-word-page-ui`.

Mock contract alignment:

- Mock success: `{ status: "ok", text: string }`.
- API success: `{ text: string }`.
- Difference is intentional: `status` is a frontend adapter discriminant, not service payload, and existing service convention returns resource JSON directly.
- Mock error codes `not_found` and `internal_error` match API error codes.
- Mock `loading` code is client-only and has no backend status.
- Mock `empty` state maps to API `404 not_found`.

## Story extension: Show Hello Word page

No new endpoints are needed beyond `GET /v1/greeting` and `GET /healthz` defined above.

`GET /v1/greeting` satisfies HOME-001:

- Reads fixed row `greetings.id = 1`.
- Returns stored `text` unchanged.
- Requires no auth.
- Returns `not_found` when row is missing.
- Returns `internal_error` when PostgreSQL read fails.
- Returns `method_not_allowed` for unsupported methods on the same path.

No pagination applies because endpoint returns one resource.
