"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CourseSelection } from "@/components/course-selection";
import { TimetableGrid } from "@/components/timetable-grid";
import { DraftTabs } from "@/components/draft-tabs";
import { COURSES } from "@/lib/courses";
import { Course, ScheduledCourse, TimetableDraft } from "@/lib/types";
import { findConflict, newId, nextCourseColor, totalCredits } from "@/lib/utils";

const STORAGE_KEY = "sg-induction-drafts";

function emptyDraft(name: string): TimetableDraft {
  const now = new Date().toISOString();
  return { id: newId(), name, courses: [], createdAt: now, updatedAt: now };
}

export default function Home() {
  const [drafts, setDrafts] = useState<TimetableDraft[]>([]);
  const [activeDraftId, setActiveDraftId] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);
  const messageTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as TimetableDraft[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setDrafts(parsed);
          setActiveDraftId(parsed[0].id);
          return;
        }
      }
    } catch {
      // ignore corrupt storage
    }
    const first = emptyDraft("Draft 1");
    setDrafts([first]);
    setActiveDraftId(first.id);
  }, []);

  // Persist on change
  useEffect(() => {
    if (drafts.length === 0) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
  }, [drafts]);

  const activeDraft = drafts.find((d) => d.id === activeDraftId) ?? drafts[0];

  const flash = (text: string) => {
    setMessage(text);
    if (messageTimeout.current) clearTimeout(messageTimeout.current);
    messageTimeout.current = setTimeout(() => setMessage(null), 3000);
  };

  const handleAddCourse = (course: Course) => {
    if (!activeDraft) return;
    if (activeDraft.courses.some((c) => c.id === course.id)) {
      flash(`${course.code} is already on this draft.`);
      return;
    }

    const conflict = findConflict(course.timeSlots, activeDraft.courses);
    if (conflict.clash) {
      flash(`${course.code} clashes with ${conflict.with?.code}.`);
      return;
    }

    const scheduled: ScheduledCourse = {
      ...course,
      color: nextCourseColor(activeDraft.courses),
    };

    setDrafts((prev) =>
      prev.map((d) =>
        d.id === activeDraft.id
          ? {
              ...d,
              courses: [...d.courses, scheduled],
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
    flash(`Added ${course.code}.`);
  };

  const handleRemoveCourse = (courseId: string) => {
    if (!activeDraft) return;
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === activeDraft.id
          ? {
              ...d,
              courses: d.courses.filter((c) => c.id !== courseId),
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
  };

  const handleCreateDraft = () => {
    const draft = emptyDraft(`Draft ${drafts.length + 1}`);
    setDrafts((prev) => [...prev, draft]);
    setActiveDraftId(draft.id);
  };

  const handleDuplicateDraft = (id: string) => {
    const source = drafts.find((d) => d.id === id);
    if (!source) return;
    const copy: TimetableDraft = {
      ...source,
      id: source.id,
      name: `${source.name} copy`,
      updatedAt: new Date().toISOString(),
    };
    setDrafts((prev) => [...prev, copy]);
    setActiveDraftId(copy.id);
  };

  const handleRenameDraft = (id: string, name: string) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, name } : d))
    );
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => {
      const next = prev.filter((d) => d.id !== id);
      if (next.length === 0) {
        const fresh = emptyDraft("Draft 1");
        setActiveDraftId(fresh.id);
        return [fresh];
      }
      if (id === activeDraftId) setActiveDraftId(next[0].id);
      return next;
    });
  };

  const clashIds = useMemo(() => {
    if (!activeDraft) return new Set<string>();
    const ids = new Set<string>();
    const list = activeDraft.courses;
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const result = findConflict(list[i].timeSlots, [list[j]]);
        if (result.clash) {
          ids.add(list[i].id);
          ids.add(list[j].id);
        }
      }
    }
    return ids;
  }, [activeDraft]);

  const credits = activeDraft ? totalCredits(activeDraft.courses) : 0;

  if (!activeDraft) {
    return <div className="p-10 text-center text-stone-400">Loading…</div>;
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--brand)]">
          SG Induction Challenge
        </p>
        <h1 className="text-2xl font-semibold text-ink">Semester Planner</h1>
        <p className="text-stone-500 text-sm max-w-2xl">
          This is a working build of the semester planner. Explore it, break
          it, figure out what it's for. When you're ready to submit your
          work, head to the{" "}
          <Link href="/submit" className="underline text-[var(--brand)]">
            submission page
          </Link>
          .
        </p>
      </header>

      {message && (
        <div className="text-sm bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-3 py-2">
          {message}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <DraftTabs
          drafts={drafts}
          activeDraftId={activeDraft.id}
          onSwitchDraft={setActiveDraftId}
          onCreateDraft={handleCreateDraft}
          onDuplicateDraft={handleDuplicateDraft}
          onRenameDraft={handleRenameDraft}
          onDeleteDraft={handleDeleteDraft}
        />
        <p className="text-sm text-stone-500">
          Total credits: <span className="font-medium text-ink">{credits}</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <TimetableGrid
          courses={activeDraft.courses}
          onRemoveCourse={handleRemoveCourse}
          clashIds={clashIds}
        />
        <CourseSelection courses={COURSES} onAddCourse={handleAddCourse} />
      </div>
    </main>
  );
}
