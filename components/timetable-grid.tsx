"use client";

import {
  DAYS,
  DAYS_WITH_SATURDAY,
  GRID_END_MIN,
  GRID_START_MIN,
  ScheduledCourse,
} from "@/lib/types";
import { formatSlotRange, parseTimeToMinutes } from "@/lib/utils";

const PX_PER_MIN = 1.1;
const HOUR_MARKS = [9, 11, 13, 15, 17, 19, 21];

export function TimetableGrid({
  courses,
  onRemoveCourse,
  clashIds,
}: {
  courses: ScheduledCourse[];
  onRemoveCourse: (id: string) => void;
  clashIds: Set<string>;
}) {
  const showSaturday = courses.some((c) => c.hasSaturday);
  const days = showSaturday ? DAYS_WITH_SATURDAY : DAYS;
  const gridHeight = (GRID_END_MIN - GRID_START_MIN) * PX_PER_MIN;

  return (
    <div className="card p-4">
      <div className="flex justify-between items-baseline mb-3">
        <h2 className="text-lg font-semibold text-ink">Your timetable</h2>
        <p className="text-xs text-stone-400">
          {courses.length} course{courses.length === 1 ? "" : "s"} scheduled
        </p>
      </div>

      <div className="overflow-x-auto">
        <div
          className="grid min-w-[640px]"
          style={{ gridTemplateColumns: `56px repeat(${days.length}, 1fr)` }}
        >
          {/* Header row */}
          <div />
          {days.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-stone-500 pb-2 border-b border-stone-200"
            >
              {day}
            </div>
          ))}

          {/* Hour labels column */}
          <div className="relative" style={{ height: gridHeight }}>
            {HOUR_MARKS.map((h) => (
              <div
                key={h}
                className="absolute -translate-y-1/2 text-[10px] text-stone-400 pr-1 text-right w-full"
                style={{ top: (h * 60 - GRID_START_MIN) * PX_PER_MIN }}
              >
                {h > 12 ? h - 12 : h}
                {h >= 12 ? "pm" : "am"}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((day) => (
            <div
              key={day}
              className="relative border-l border-stone-100"
              style={{ height: gridHeight }}
            >
              {HOUR_MARKS.map((h) => (
                <div
                  key={h}
                  className="absolute w-full border-t border-stone-100"
                  style={{ top: (h * 60 - GRID_START_MIN) * PX_PER_MIN }}
                />
              ))}

              {courses.flatMap((course) =>
                course.timeSlots
                  .filter((slot) => slot.day === day)
                  .map((slot, idx) => {
                    const startMin = parseTimeToMinutes(slot.start);
                    const endMin = parseTimeToMinutes(slot.end);
                    const top = (startMin - GRID_START_MIN) * PX_PER_MIN;
                    const height = (endMin - startMin) * PX_PER_MIN;
                    const isClashing = clashIds.has(course.id);

                    return (
                      <div
                        key={`${course.id}-${day}-${idx}`}
                        className="absolute left-0.5 right-0.5 rounded-md p-1.5 text-white text-[11px] leading-tight overflow-hidden shadow-sm"
                        style={{
                          top,
                          height: Math.max(height, 28),
                          backgroundColor: course.color,
                          outline: isClashing ? "2px solid #d92d20" : "none",
                          outlineOffset: "1px",
                        }}
                        title={`${course.name} (${formatSlotRange(slot)})`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="font-semibold">{course.code}</span>
                          <button
                            onClick={() => onRemoveCourse(course.id)}
                            className="opacity-70 hover:opacity-100 leading-none"
                            aria-label={`Remove ${course.code}`}
                          >
                            ×
                          </button>
                        </div>
                        <div className="opacity-90">{formatSlotRange(slot)}</div>
                      </div>
                    );
                  })
              )}
            </div>
          ))}
        </div>
      </div>

      {courses.length === 0 && (
        <p className="text-sm text-stone-400 text-center py-10">
          Nothing scheduled yet — add courses from the catalog.
        </p>
      )}
    </div>
  );
}
