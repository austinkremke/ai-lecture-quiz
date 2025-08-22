"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [quizUrl, setQuizUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) return;
    setStatus("Uploading & processing...");
    setQuizUrl(null);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("title", "Sample Lecture");
    fd.append("difficulty", "medium");
    fd.append("numQuestions", "6");

    const res = await fetch("/api/lectures", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) { setStatus("Error: " + (data.error || "Failed")); return; }

    const pub = await fetch(`/api/quizzes/${data.quizId}/publish`, { method: "POST" });
    const pubData = await pub.json();
    setQuizUrl(pubData.url);
    setStatus("Ready!");
  }

  return (
    <main className="max-w-[720px] mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">AI Lecture → Quiz (Whisper)</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="file" accept="audio/*,video/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <div>
          <button className="rounded bg-black text-white px-4 py-2" disabled={!file}>Upload & Generate</button>
        </div>
      </form>
      {status && <p className="mt-4">{status}</p>}
      {quizUrl && <p className="mt-2">Student link: <a className="text-blue-600 underline" href={quizUrl} target="_blank" rel="noopener noreferrer">{quizUrl}</a></p>}
      <p className="mt-8 text-sm text-gray-600">
        Tip: use a short audio clip while testing. For longer files, consider background jobs.
      </p>
    </main>
  );
}
