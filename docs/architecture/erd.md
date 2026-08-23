# ERD

Project: `hello-word-8`

## Scope

Database stores one display string read by public home page. No users, auth, audit trail, or editing workflow.

## Tables

### `schema_migrations`

Tracks SQL migrations applied by backend on boot.

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `version` | `text` | no | none | Migration filename, primary key. |
| `applied_at` | `timestamptz` | no | `now()` | Time migration finished. |

Primary key: `version`.

### `greetings`

Stores single greeting shown on home page.

| Column | Type | Null | Default | Notes |
|---|---|---|---|---|
| `id` | `smallint` | no | none | Primary key. Fixed row uses `1`. |
| `text` | `text` | no | none | Display text. Must be non-empty. |
| `created_at` | `timestamptz` | no | `now()` | Creation timestamp. |
| `updated_at` | `timestamptz` | no | `now()` | Last update timestamp. |

Constraints:

- Primary key: `id`.
- `CHECK (id = 1)` enforces one-row product scope.
- `CHECK (length(text) > 0)` prevents blank display.

Seed data:

```sql
INSERT INTO greetings (id, text) VALUES (1, 'Hello Word')
ON CONFLICT (id) DO NOTHING;
```

## Relationships

None. `greetings` has no foreign keys.

## Data access

`GET /v1/greeting` reads:

```sql
SELECT text FROM greetings WHERE id = 1;
```

Missing row maps to `404 not_found` API error. Migration should seed row, so missing row means data corruption or manual deletion.
