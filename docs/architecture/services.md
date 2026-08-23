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

Request body: none.

Success response: `200 OK`

```json
{
  "text": "Hello Word"
}
```

Failure responses:

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
