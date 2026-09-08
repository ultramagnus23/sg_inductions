"use client";

import { useMemo, useState } from "react";
import { Course } from "@/lib/types";
import { formatSlotRange } from "@/lib/utils";

export function CourseSelection({
  courses,
  onAddCourse,
}: {
  courses: Course[];
  onAddCourse: (course: Course) => void;
}) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.name.toLowerCase().startsWith(q) ||
        c.code.toLowerCase().startsWith(q)
    );
  }, [courses, query]);

  return (
    <div className="card p-4 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink">Course catalog</h2>
        <p className="text-sm text-stone-500">
          Search and add courses to build your semester.
        </p>
      </div>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by course name or code…"
        className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand)]"
      />

      <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="text-sm text-stone-400 py-6 text-center">
            No courses match “{query}”.
          </p>
        )}
        {filtered.map((course) => (
          <div
            key={course.id}
            className="border border-stone-200 rounded-lg p-3 hover:border-[var(--brand)] transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  {course.code} · {course.department}
                </p>
                <p className="font-medium text-ink leading-snug">
                  {course.name}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  {course.professor} · {course.location}
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  {course.timeSlots.map((s) => `${s.day} ${formatSlotRange(s)}`).join(" · ")}
                </p>
              </div>
              <button
                onClick={() => onAddCourse(course)}
                className="shrink-0 text-sm px-3 py-1.5 rounded-md bg-[var(--brand)] text-white hover:opacity-90"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
