"use client";

import { useState } from "react";
import { TimetableDraft } from "@/lib/types";

export function DraftTabs({
  drafts,
  activeDraftId,
  onSwitchDraft,
  onCreateDraft,
  onDuplicateDraft,
  onRenameDraft,
  onDeleteDraft,
}: {
  drafts: TimetableDraft[];
  activeDraftId: string;
  onSwitchDraft: (id: string) => void;
  onCreateDraft: () => void;
  onDuplicateDraft: (id: string) => void;
  onRenameDraft: (id: string, name: string) => void;
  onDeleteDraft: (id: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const startEditing = (draft: TimetableDraft) => {
    setEditingId(draft.id);
    setDraftName(draft.name);
  };

  const commitEditing = () => {
    if (editingId && draftName.trim()) {
      onRenameDraft(editingId, draftName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {drafts.map((draft) => {
        const isActive = draft.id === activeDraftId;
        return (
          <div
            key={draft.id}
            className={`group flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm cursor-pointer ${
              isActive
                ? "border-[var(--brand)] bg-[var(--brand-light)] text-[var(--brand)] font-medium"
                : "border-stone-200 text-stone-500 hover:border-stone-300"
            }`}
            onClick={() => onSwitchDraft(draft.id)}
          >
            {editingId === draft.id ? (
              <input
                autoFocus
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                onBlur={commitEditing}
                onKeyDown={(e) => e.key === "Enter" && commitEditing()}
                onClick={(e) => e.stopPropagation()}
                className="bg-white border border-stone-300 rounded px-1 text-xs w-24"
              />
            ) : (
              <span
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  startEditing(draft);
                }}
              >
                {draft.name}
              </span>
            )}
            <span className="text-[10px] text-stone-400">
              {draft.courses.length}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicateDraft(draft.id);
              }}
              className="hidden group-hover:inline text-xs opacity-60 hover:opacity-100"
              title="Duplicate draft"
            >
              ⧉
            </button>
            {drafts.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDraft(draft.id);
                }}
                className="hidden group-hover:inline text-xs opacity-60 hover:opacity-100"
                title="Delete draft"
              >
                ×
              </button>
            )}
          </div>
        );
      })}
      <button
        onClick={onCreateDraft}
        className="text-sm px-3 py-1.5 rounded-full border border-dashed border-stone-300 text-stone-500 hover:border-stone-400"
      >
        + New draft
      </button>
    </div>
  );
}
