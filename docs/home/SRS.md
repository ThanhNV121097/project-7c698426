# SRS — home

Module: `home`
Last updated: 2025-08-14
Design: [View Design](http://localhost:8080/design/7c698426-2e62-4589-b4b1-fc19dcc93406)
Design system: `design/design-system.md`

## 1. Purpose

`home` module serves public landing page for `hello-word-8`. It proves end-to-end path from PostgreSQL through backend API to frontend render. Without it, project has no visible output and no pipeline proof.

## 2. Actors

| Actor | Who they are | What they may do in this module |
|---|---|---|
| Guest | Any visitor with no sign-in | Open home page and read text |

## 3. Scope

**In scope** — function in this module:

- Show Hello Word page

**Out of scope**

- Admin or member flows — no auth module in this project.
- Editing displayed text — content comes from stored row and is not user-editable.
- Extra sections, controls, or animation — deliberately not built; design shows only one centered line of text.

## 4. Functional requirements

### 4.1 Show Hello Word page

**Requirement HOME-001 — Read stored greeting**

*As a* Guest, *I want to* open home page and see greeting loaded from backend data, *so that* page proves storage, API, and render path work.

Behaviour:

1. Guest opens home page.
2. System requests single greeting value through backend API.
3. System reads greeting from PostgreSQL row.
4. System renders returned text centered on page.

**Acceptance criteria** — each maps one-to-one onto a test case in `docs/home/test-cases/show-hello-word-page.md`. Given/When/Then, no compound conditions: one behaviour per criterion.

| # | Given | When | Then |
|---|---|---|---|
| AC-1 | Greeting row exists with text `Hello Word` | Guest opens home page | Page shows `Hello Word` |
| AC-2 | Backend API returns stored greeting | Guest opens home page | Text is centered horizontally and vertically on plain white background |
| AC-3 | Page is rendered | Guest opens home page | Text is black and no animation is shown |

**Failure, boundary and permission behaviour** — the part most often skipped and most often the source of bugs. Every row needs a defined outcome; "should not happen" is not an outcome.

| Case | Condition | Expected behaviour |
|---|---|---|
| Invalid input | No user input exists for this page | No validation UI appears; page still renders stored text |
| Boundary | Stored text is exact `Hello Word` value | Value renders unchanged, with no trimming or wrapping requirement beyond normal screen fit |
| Not found | Greeting row is missing | Page shows error state instead of blank page |
| Not permitted | Actor is not signed in | Same public page remains accessible; no sign-in required |
| Conflict | Stored greeting changes while page loads | Page uses value returned by API for that request |
| Upstream failure | Backend API or PostgreSQL is unavailable | Page shows error state with no partial text from stale data |

**Data touched** — the fields this function reads and writes, in product terms.

| Field | Type | Required | Rule |
|---|---|---|---|
| Greeting text | text | yes | Single non-empty display string; expected value is `Hello Word` |

## 5. Screens

The design is the source of truth for appearance; this section maps functions onto it so nothing in the design is unaccounted for and nothing specified here is missing from the design.

| Screen | Section in the design | Functions it serves | States that must exist |
|---|---|---|---|
| Home | Approved design preview | HOME-001 | default |

## 6. Non-functional requirements

| Area | Requirement |
|---|---|
| Performance | Home page responds within 1s on a typical connection |
| Accessibility | Text remains readable with contrast of at least 4.5:1 and is reachable without pointer-only interaction |
| Responsive | Layout stays centered at 320px width and up with no horizontal scroll |
| Localisation | Copy is English |
| Privacy | No personal data is stored or displayed |

## 7. Dependencies and assumptions

- **Depends on:** PostgreSQL, for stored greeting text.
- **Depends on:** backend API, for reading greeting row and serving it to frontend.
- **Assumption:** one greeting row exists and contains display text only; if false, page shows error state until data is fixed.

| Open question | Proposed default | Who decides |
|---|---|---|
| Should missing greeting row show explicit error copy or generic error state? | Generic error state | Stakeholder |

## 8. Traceability

| Plan item | Requirement ids | Test cases |
|---|---|---|
| Show Hello Word page | HOME-001 | `test-cases/show-hello-word-page.md` |
