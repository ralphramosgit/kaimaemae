import { Sparkles } from "lucide-react";

/** Generated, model-grounded narrative for the selected beach. */
export function BeachSummary({ summary }: { summary: string }) {
  return (
    <div className="rounded-2xl bg-sage-50 p-3.5 ring-1 ring-sage-200">
      <div className="mb-1.5 flex items-center gap-1.5">
        <Sparkles className="h-4 w-4 text-sage-600" />
        <span className="text-[11px] font-bold uppercase tracking-wide text-sage-600">
          AI summary
        </span>
      </div>
      <p className="text-sm leading-relaxed text-ocean-700">{summary}</p>
    </div>
  );
}
