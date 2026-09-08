# SG Induction Challenge — Semester Planner

A standalone clone of the SG Semester Planner, built for the induction
challenge. No auth, no database, no external services — everything runs
client-side and drafts are saved to the browser's `localStorage`. It's a
plain Next.js app, so it deploys to Vercel with zero configuration.

## Running locally

```bash
npm install
npm run dev
```

Visit http://localhost:3000.

## Deploying to Vercel

1. Push this folder to a GitHub repo (a private one, so applicants can't
   read the source and spot the bugs directly — unless you *want* that,
   for the documentation/testing tracks; see notes below).
2. Go to vercel.com → **New Project** → import that repo.
3. Leave every setting on default (framework auto-detects as Next.js).
   No environment variables are needed.
4. Deploy. That's it — no database, no OAuth keys, nothing else to wire up.

## What's real vs. simplified

- The 24 courses in `data/courses.json` are real Ashoka course listings
  pulled from `next-platform`'s `timetable-planner.json`, run through the
  same parsing logic the real API route uses. Two entries were edited on
  purpose to create edge cases (see `ANSWER_KEY.md`, organizer-only).
- Drafts, add/remove, clash detection, and colors are all reimplemented
  from scratch (not copy-pasted from `next-platform`), since the original
  page depends on auth, Strapi, and Google Calendar OAuth that this
  exercise doesn't need.
- No PNG export, no calendar sync, no guided tour — trimmed to keep the
  surface area focused on the planner mechanics themselves.

## Source visibility for applicants

Decide up front whether applicants get the GitHub repo (source-visible —
good for the Documentation track, since they can read code) or only the
deployed URL (black-box — better for Testing, since they have to find
bugs by using the app, not `grep`-ing for them). `ANSWER_KEY.md` should
never go in the repo you hand out — keep it out of the applicant-facing
copy however you split this.

## Files in this handoff

- `ANSWER_KEY.md` — organizer-only list of the six intentional bugs and
  where they live in the code.
- `EMAIL_DRAFT.md` — draft email to send applicants with the challenge.
- `DOCS_TEMPLATE.md` — the template to hand documentation-track
  applicants for their submission.
