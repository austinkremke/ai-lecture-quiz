"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { 
  ArrowLeft, 
  Upload as UploadIcon, 
  Settings,
  LogOut,
  User,
  ChevronDown,
  GraduationCap,
  Loader2,
  AlertCircle
} from "lucide-react";

// Utility function to get user initials
function getInitials(name: string | null | undefined): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map(part => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface ClassData {
  id: string;
  name: string;
  description?: string;
  subject?: string;
  semester?: string;
  year?: number;
}

export default function UploadPage() {
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [numQuestions, setNumQuestions] = useState(8);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ quizId: string; url?: string } | null>(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      const response = await fetch('/api/classes');
      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes);
        // Auto-select first class if available
        if (data.classes.length > 0) {
          setSelectedClassId(data.classes[0].id);
        }
      } else {
        console.error('Failed to fetch classes');
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
    } finally {
      setLoadingClasses(false);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  async function handleUpload() {
    if (!file || !selectedClassId) return;
    
    console.log("🔍 Starting upload with classId:", selectedClassId);
    setUploading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("title", title || "Untitled Lecture");
    form.append("difficulty", difficulty);
    form.append("numQuestions", numQuestions.toString());
    form.append("classId", selectedClassId); // Add the classId

    try {
      const res = await fetch("/api/lectures", {
        method: "POST",
        body: form,
      });
      
      const data = await res.json();
      console.log("📡 Upload response:", data);
      
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
      console.error("💥 Upload error:", error);
      alert(`Upload failed: ${error}`);
    } finally {
      setUploading(false);
    }
  }

  if (result) {
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200">
          {/* ...existing header code... */}
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                   className="inline-block bg-[#28929f] text-white px-4 py-2 rounded hover:bg-[#237a85]">
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/lecture-logo.png"
                alt="Resona Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold tracking-tight text-lg">Resona</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-neutral-600 hover:text-[#28929f] transition-colors">Dashboard</Link>
              <Link href="/record" className="text-neutral-600 hover:text-[#28929f] transition-colors">Record</Link>
              <Link href="/upload" className="text-[#28929f] font-medium">Upload</Link>
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-neutral-100">
                <Settings className="w-5 h-5 text-neutral-600" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#28929f] flex items-center justify-center text-white text-sm font-medium">
                    {getInitials(session?.user?.name)}
                  </div>
                  <ChevronDown className="w-4 h-4 text-neutral-600" />
                </button>

                {isUserMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 py-1 z-20">
                      <div className="px-4 py-3 border-b border-neutral-200">
                        <p className="text-sm font-medium text-neutral-900">
                          {session?.user?.name || 'User'}
                        </p>
                        <p className="text-sm text-neutral-600">
                          {session?.user?.email}
                        </p>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Dashboard
                      </Link>
                      
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-neutral-600 hover:text-[#28929f] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">Upload Lecture File</h1>
        <p className="text-neutral-600 mb-8">Upload an audio or video file to generate an interactive quiz</p>
        
        <div className="bg-white rounded-xl border border-neutral-200 p-8">
          <div className="space-y-6">
            {/* Class Selection */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Select Class *
              </label>
              {loadingClasses ? (
                <div className="flex items-center gap-2 text-neutral-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading classes...
                </div>
              ) : classes.length === 0 ? (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="text-sm text-yellow-800">No classes found.</p>
                    <Link href="/classes/add" className="text-sm text-yellow-700 hover:text-yellow-900 underline">
                      Create a class first
                    </Link>
                  </div>
                </div>
              ) : (
                <select
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
                  required
                >
                  <option value="">Choose a class...</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} {cls.subject && `(${cls.subject})`}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Lecture Title */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Lecture Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter lecture title"
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Audio/Video File *
              </label>
              <input
                type="file"
                accept="audio/*,video/*,.flac,.m4a,.mp3,.mp4,.mpeg,.mpga,.oga,.ogg,.wav,.webm"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
              />
              <p className="text-sm text-neutral-500 mt-1">
                Supported formats: MP3, WAV, M4A, MP4, FLAC, OGG, WebM (max 25MB)
              </p>
            </div>

            {/* Quiz Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Number of Questions
                </label>
                <input
                  type="number"
                  min="3"
                  max="20"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(parseInt(e.target.value) || 8)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
                />
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || !selectedClassId || uploading || classes.length === 0}
              className="w-full bg-[#28929f] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#237a85] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <UploadIcon className="w-5 h-5" />
                  Generate Quiz
                </>
              )}
            </button>

            {uploading && (
              <div className="text-center text-sm text-neutral-600 space-y-1">
                <p>This may take a few minutes...</p>
                <p>Processing: Transcription → Summary → Quiz Generation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}