"use client";
import { useState } from "react";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [numQuestions, setNumQuestions] = useState(8);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ quizId: string; url?: string } | null>(null);

  async function handleUpload() {
    if (!file) return;
    
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("title", title || "Untitled Lecture");
    form.append("difficulty", difficulty);
    form.append("numQuestions", numQuestions.toString());

    try {
      const res = await fetch("/api/lectures", {
        method: "POST",
        body: form,
      });
      
      const data = await res.json();
      
      if (res.ok) {
        // Publish the quiz
        const publishRes = await fetch(`/api/quizzes/${data.quizId}/publish`, {
          method: "POST",
        });
        
        if (publishRes.ok) {
          const publishData = await publishRes.json();
          setResult({ quizId: data.quizId, url: publishData.url });
        } else {
          setResult({ quizId: data.quizId });
        }
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`Upload failed: ${error}`);
    } finally {
      setUploading(false);
    }
  }

  if (result) {
    return (
      <div className="max-w-[760px] mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Quiz Generated Successfully!</h1>
        {result.url ? (
          <div className="space-y-4">
            <p className="text-green-600">Your quiz has been published and is ready to share.</p>
            <div className="p-4 bg-gray-50 rounded">
              <p className="font-medium mb-2">Quiz URL:</p>
              <a href={result.url} target="_blank" rel="noopener noreferrer" 
                 className="text-blue-600 hover:underline break-all">
                {result.url}
              </a>
            </div>
            <div className="space-x-4">
              <a href={result.url} target="_blank" rel="noopener noreferrer"
                 className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Take Quiz
              </a>
              <button onClick={() => window.location.reload()} 
                      className="inline-block bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
                Create Another Quiz
              </button>
            </div>
          </div>
        ) : (
          <p className="text-orange-600">Quiz created but not yet published. Quiz ID: {result.quizId}</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-[760px] mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Generate Quiz from Lecture</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Lecture Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter lecture title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Audio File
          </label>
          <input
            type="file"
            accept="audio/*,video/*,.flac,.m4a,.mp3,.mp4,.mpeg,.mpga,.oga,.ogg,.wav,.webm"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-sm text-gray-500 mt-1">
            Supported formats: MP3, WAV, M4A, MP4, FLAC, OGG, WebM (max 25MB)
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Number of Questions
            </label>
            <input
              type="number"
              min="3"
              max="20"
              value={numQuestions}
              onChange={(e) => setNumQuestions(parseInt(e.target.value) || 8)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? "Processing..." : "Generate Quiz"}
        </button>

        {uploading && (
          <div className="text-center text-sm text-gray-600">
            <p>This may take a few minutes...</p>
            <p>Processing: Transcription → Summary → Quiz Generation</p>
          </div>
        )}
      </div>
    </div>
  );
}