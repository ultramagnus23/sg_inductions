import Link from "next/link";

// TODO(organizer): replace with your real Google Form link.
// The form should collect: full name, email, track choice
// (Research / Documentation / Testing), and a document upload
// (PDF) or a Drive link to the document. See DOCS_TEMPLATE.md
// and EMAIL_DRAFT.md in the repo root for the rest of the flow.
const GOOGLE_FORM_URL = "https://sg.ashoka.edu.in/platform/forms/714bf453-8c30-493a-8104-bd58dccc581f";

const TRACKS = [
  {
    name: "Research",
    prompt:
      "Explore the planner and work out what it's actually for, who it's built for, and what problem it solves. Submit a short PDF making that case.",
  },
  {
    name: "Documentation",
    prompt:
      "Document the platform as if handing it to a new user or a new developer: what it does, how the pieces fit together, and anything you found unclear or inconsistent along the way.",
  },
  {
    name: "Testing",
    prompt:
      "Use the planner as a real user would. Record every bug you run into, exactly how you triggered it, and what you'd expect to happen instead.",
  },
];

export default function SubmitPage() {
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <Link href="/" className="text-sm text-stone-500 underline">
          ← Back to the planner
        </Link>
      </div>

      <header className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-[var(--brand)]">
          SG Induction Challenge
        </p>
        <h1 className="text-2xl font-semibold text-ink">Submit your work</h1>
        <p className="text-stone-500 text-sm">
          Pick the track that matches how you spent your time with the
          planner, then submit through the form below.
        </p>
      </header>

      <div className="space-y-3">
        {TRACKS.map((track) => (
          <div key={track.name} className="card p-4">
            <p className="font-medium text-ink">{track.name}</p>
            <p className="text-sm text-stone-500 mt-1">{track.prompt}</p>
          </div>
        ))}
      </div>

      <div className="card p-5 space-y-3">
        <p className="font-medium text-ink">Submission form</p>
        <p className="text-sm text-stone-500">
          The form asks for your name, which track you're submitting for,
          and your document (PDF, or a link to one). One submission per
          person.
        </p>
        <a
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-block text-sm px-4 py-2 rounded-md bg-[var(--brand)] text-white hover:opacity-90"
        >
          Open the submission form ↗
        </a>
      </div>
    </main>
  );
}
