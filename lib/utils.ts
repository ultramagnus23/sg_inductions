import { COURSE_COLORS, ScheduledCourse, TimeSlot } from "./types";

/** Parses "HH:MM" (24-hour) into minutes since midnight. */
export function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/** Formats "HH:MM" (24-hour) into a 12-hour display string, e.g. "2:30pm". */
export function formatTime(time: string): string {
  const [hStr, mStr] = time.split(":");
  const hour = parseInt(hStr, 10);
  const minute = mStr.padStart(2, "0");

  // Midday roll-over: after 12 o'clock we're in the afternoon.
  const ampm = hour > 12 ? "pm" : "am";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute}${ampm}`;
}

export function formatSlotRange(slot: TimeSlot): string {
  return `${formatTime(slot.start)}–${formatTime(slot.end)}`;
}

/**
 * Two time ranges are considered to clash if they share any minute in common.
 * Ranges that merely touch at a shared boundary (one ends exactly when the
 * other begins) are back-to-back, not a clash.
 */
export function slotsOverlap(a: TimeSlot, b: TimeSlot): boolean {
  if (a.day !== b.day) return false;

  const startA = parseTimeToMinutes(a.start);
  const endA = parseTimeToMinutes(a.end);
  const startB = parseTimeToMinutes(b.start);
  const endB = parseTimeToMinutes(b.end);

  return startA <= endB && startB <= endA;
}

export interface ConflictResult {
  clash: boolean;
  with?: ScheduledCourse;
}

/** Checks a candidate set of time slots against a list of already-scheduled courses. */
export function findConflict(
  candidateSlots: TimeSlot[],
  scheduled: ScheduledCourse[],
  excludeId?: string
): ConflictResult {
  for (const candidate of candidateSlots) {
    for (const course of scheduled) {
      if (course.id === excludeId) continue;
      for (const existing of course.timeSlots) {
        if (slotsOverlap(candidate, existing)) {
          return { clash: true, with: course };
        }
      }
    }
  }
  return { clash: false };
}

/**
 * Picks the next color for a newly scheduled course by rotating through the
 * palette based on how many courses are already on the board.
 */
export function nextCourseColor(currentlyScheduled: ScheduledCourse[]): string {
  const index = currentlyScheduled.length % COURSE_COLORS.length;
  return COURSE_COLORS[index];
}

/** Sums the credits of a set of scheduled courses. */
export function totalCredits(courses: ScheduledCourse[]): number {
  return courses.reduce((sum, c) => sum + (c.credits as number), 0);
}

export function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
