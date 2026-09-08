# Answer key — DO NOT include in the applicant-facing repo

Six intentional bugs, each nuanced enough that you have to actually use
(or read) the app to catch it — none of them crash the page outright.

## 1. Noon mislabeled as midnight — `lib/utils.ts` → `formatTime()`
`hour > 12 ? "pm" : "am"` should be `hour >= 12`. A class starting at
12:00 (24-hour) shows as "12:00am" instead of "12:00pm". Triggered by
**IR-2048-1 (War and Strategy)**, which has a Friday 12:00–13:30 slot
added specifically for this.

## 2. Back-to-back classes falsely flagged as clashing — `lib/utils.ts` → `slotsOverlap()`
Uses `startA <= endB && startB <= endA` instead of strict `<`. Two
classes that are genuinely back-to-back (one ends exactly when the next
starts) get flagged as a conflict. Triggered by trying to add both
**IR-2048-1** (Fri 12:00–13:30) and **PHI-3645-1** (which has an added
Fri 13:30–15:00 slot) to the same draft — the app will refuse to let you
add the second one, even though there's no real overlap.

## 3. Credit total goes to NaN — `lib/utils.ts` → `totalCredits()`
`sum + (c.credits as number)` doesn't guard against `undefined`.
**CS-2102-1 (Programming Lab)** has no credits field in the data (edited
on purpose). Adding it to a draft makes the "Total credits" figure in
the header show `NaN`.

## 4. Search only matches from the start of the string — `components/course-selection.tsx`
Uses `.startsWith(q)` instead of `.includes(q)` for both name and code.
Searching "chemistry" won't find "Industrial Chemistry"; searching
"science" won't find "Introduction to Computer Science". Only courses
whose name or code literally begins with the query show up.

## 5. Colors can repeat after removing a course — `lib/utils.ts` → `nextCourseColor()`
Picks the color by `currentlyScheduled.length % COURSE_COLORS.length`,
which only looks at the *count*, not which colors are actually in use.
Add three courses (colors 0, 1, 2), remove the second, add a new one —
the new course gets color index 2 again, which can collide with a
still-scheduled course's color depending on the sequence.

## 6. Duplicating a draft reuses the same ID — `app/page.tsx` → `handleDuplicateDraft()`
The duplicate is created with `id: source.id` instead of a fresh
`newId()`. Both the original and the "copy" end up in the drafts array
sharing one ID. In practice: the second tab is basically inert — since
`drafts.find(d => d.id === activeDraftId)` always resolves to the first
match, clicking the "copy" tab still shows (and edits) the original
draft's data, not an independent copy.

---

Good submissions (any track) should describe the bug's actual behavior
and how to reproduce it — a screenshot or two, not just "search is
broken." The Research track shouldn't need to find these at all; that
track's task is closer to "what's this app for," using the planner
itself, the course list, and the general shape of the UI as evidence.
