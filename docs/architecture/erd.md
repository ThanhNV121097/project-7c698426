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

## Story extension: Show Hello Word page

No new entities or columns are needed for this story. Existing `greetings` row supplies the frontend mock's successful `text` value.

Reviewed mock module: `code/frontend/lib/mock/show-hello-word-page.ts` on `feature/show-hello-word-page-ui`.

Mock data contract relevant to storage:

- Success value: `text: string`, example `Hello Word`.
- Error states use codes `not_found` and `internal_error`; no extra database fields needed.
- Mock-only `loading` state is client behaviour, not persisted data.

## Migration plan

Forward:

1. Create `schema_migrations` if missing.
2. Create `greetings` with columns and constraints listed above.
3. Seed fixed row `id = 1`, `text = 'Hello Word'` with `ON CONFLICT (id) DO NOTHING`.

Backward:

1. Drop `greetings`.
2. Remove this migration version from `schema_migrations` if migration runner requires explicit rollback tracking.

Safety on populated tables:

- Safe for empty database.
- Safe for populated `greetings` table because seed uses `ON CONFLICT (id) DO NOTHING` and does not overwrite existing text.
- Backward drop is destructive if user-modified greeting data ever exists; current product has no editing workflow, so only seeded display text is expected.
