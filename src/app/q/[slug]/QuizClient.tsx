"use client";
import { useState } from "react";

export default function QuizClient({ slug, questions }: { slug: string; questions: any[] }) {
  const [choices, setChoices] = useState<number[]>(Array(questions.length).fill(-1));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{score:number;total:number}|null>(null);

  async function submit() {
    setSubmitting(true);
    const res = await fetch(`/api/submissions/${slug}/submit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ choices })
    });
    const data = await res.json();
    setResult(data);
    setSubmitting(false);
  }

  if (result) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-2">Score: {result.score}/{result.total}</h2>
        <p className="text-gray-700">Thanks for completing the quiz.</p>
      </div>
    );
  }

  return (
    <div>
      {questions.map((q, i) => (
        <div key={q.id} className="mb-6">
          <p className="font-medium">{i+1}. {q.prompt}</p>
          <ul className="mt-2 space-y-2">
            {q.options.map((opt: string, j: number) => (
              <li key={j}>
                <label className="flex items-center gap-2">
                  <input type="radio" name={`q${i}`} checked={choices[i]===j}
                    onChange={()=>setChoices(prev=>{const c=[...prev]; c[i]=j; return c;})}/>
                  <span>{opt}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <button className="rounded bg-black text-white px-4 py-2 disabled:opacity-60"
        onClick={submit}
        disabled={submitting || choices.some(c=>c===-1)}>
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}
