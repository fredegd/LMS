# LMS Snippets

Demo: https://lms-nine-phi.vercel.app/

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- NextAuth (credentials provider)
- Hygraph (GraphQL content source)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=replace-with-a-long-random-secret

# Credentials login used by NextAuth
LOCAL_USER_EMAIL=admin@example.com
LOCAL_USER_PASSWORD=replace-with-a-strong-password

# Hygraph project id (new preferred variable)
NEXT_PUBLIC_HYGRAPH_PROJECT_ID=your_hygraph_project_id

# Backward-compatible fallback supported by the codebase
NEXT_PUBLIC_HYGRAPH_API_URL_HIGH_PERFORMANCE=your_hygraph_project_id

# Optional: only needed if your Hygraph API requires auth
HYGRAPH_API_TOKEN=your_optional_hygraph_token

```

3. Run:

```bash
npm run dev
```

## Auth

- Clerk has been removed.
- Authentication now uses `next-auth` with credentials.
- Protected routes are handled in `proxy.ts`.
- Public routes:
  - `/`
  - `/browse`
  - `/item-display/:id`
  - `/sign-in`
  - `/sign-up`

## Hygraph Content Model (Reviewed)

The UI currently expects this model:

### `SnippetCollection`
- `id: ID`
- `title: String`
- `description: String`
- `level: String`
- `tags: [String]`
- `banner: Asset`
- `chapterSection: [Chapter]` (union field filtered to `Chapter`)

### `Chapter`
- `id: ID`
- `title: String`
- `chapterDescription: String` (markdown)
- `chapterSnippet: String` (markdown/code block)
- `banner: Asset`

### `Asset`
- `url: String`

## Content Insertion / Consumption Flow (Reviewed)

Content is read from Hygraph in `app/_services/index.jsx`:

1. `getList()` fetches `snippetCollections` for browse cards.
2. `getItemById(id)` fetches one `snippetCollection` + chapters.
3. Raw GraphQL responses are normalized before returning to UI components:
   - Arrays default to `[]`
   - Optional fields default safely (`""`, `null`)
   - Missing banners no longer break rendering

## Notes

- GraphQL queries now use variables (no string interpolation for IDs).
- Hygraph fetch errors fail safely and return empty states.
- UI pages now handle loading, empty, and error states explicitly.
- For local credentials, `.env` raw values are used first, so passwords with `$` are supported.
