# Show Hello Word page

## User story
As a Guest, I want to open home page and see greeting loaded from backend data, so that page proves storage, API, and render path work.

## In scope
- Public home page for `hello-word-8`.
- Read single greeting value from backend API.
- Render stored text `Hello Word` centered horizontally and vertically on plain white background.
- Show black text with no animation.
- Use existing design system and architecture constraints.

## Out of scope
- Editing greeting text.
- Authentication or sign-in.
- Extra sections, controls, navigation, or animation.
- Multiple greetings or alternate content.
- Any admin or member flow.

## UI scope
- One screen only: Home.
- Uses approved design preview for single centered line of text.
- States covered: default only.
- No loading, empty, or interactive states in UI scope for this story.

## Acceptance criteria
1. Given greeting row exists with text `Hello Word`, when Guest opens home page, then page shows `Hello Word`.
2. Given backend API returns stored greeting, when Guest opens home page, then text is centered horizontally and vertically on plain white background.
3. Given page is rendered, when Guest opens home page, then text is black and no animation is shown.
4. Given greeting row is missing or backend API or PostgreSQL is unavailable, when Guest opens home page, then page shows error state instead of blank page or stale text.

## Dependencies
- PostgreSQL with one greeting row containing `Hello Word`.
- Backend API that reads greeting row and serves it to frontend.
- Approved design system and architecture overview for layout and styling constraints.
