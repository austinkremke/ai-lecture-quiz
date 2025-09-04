"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { 
  Mic, 
  Square, 
  Upload, 
  ArrowLeft, 
  Loader2, 
  FileAudio, 
  Settings,
  CheckCircle2,
  ExternalLink,
  LogOut,
  User,
  ChevronDown,
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

export default function RecordPage() {
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const [selectedClassId, setSelectedClassId] = useState<string>("");
  
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'record' | 'upload'>('record');
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [numQuestions, setNumQuestions] = useState(8);
  const [result, setResult] = useState<{ quizId: string; url?: string } | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      // Start duration timer
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setAudioBlob(null); // Clear any existing recording
      setDuration(0);
    }
  }

  const handleUpload = async () => {
    const fileToUpload = audioBlob || uploadedFile;
    if (!fileToUpload || !selectedClassId) return;
    
    console.log("🔍 Starting upload with classId:", selectedClassId);
    setUploading(true);
    const formData = new FormData();
    
    if (audioBlob) {
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('title', title || `Recorded Lecture - ${new Date().toLocaleDateString()}`);
    } else if (uploadedFile) {
      formData.append('file', uploadedFile);
      formData.append('title', title || uploadedFile.name.replace(/\.[^/.]+$/, ""));
    }
    
    formData.append('difficulty', difficulty);
    formData.append('numQuestions', numQuestions.toString());
    formData.append('classId', selectedClassId); // Add the classId

    try {
      const response = await fetch('/api/lectures', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log("📡 Upload response:", data);
      
      if (response.ok) {
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
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('💥 Upload error:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Success page
  if (result) {
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
                <Link href="/upload" className="text-neutral-600 hover:text-[#28929f] transition-colors">Upload</Link>
              </nav>

              <div className="flex items-center gap-3">
                <button className="p-2 rounded-lg hover:bg-neutral-100">
                  <Settings className="w-5 h-5 text-neutral-600" />
                </button>
                
                {/* User Dropdown */}
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
                      {/* Backdrop */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      
                      {/* Dropdown Menu */}
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

        {/* Success Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
              Quiz Generated Successfully!
            </h1>
            <p className="text-neutral-600">
              Your lecture has been processed and your quiz is ready to share.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
              {result.url ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-green-600 mb-4">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Your quiz has been published and is ready to share</span>
                  </div>
                  
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <p className="font-medium text-neutral-900 mb-2">Quiz URL:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={result.url}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-neutral-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => navigator.clipboard.writeText(result.url!)}
                        className="px-3 py-2 bg-[#28929f] hover:bg-[#237a85] text-white rounded-lg text-sm transition-colors"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-orange-600 mb-4">Quiz created but not yet published</p>
                  <p className="text-sm text-neutral-600">Quiz ID: {result.quizId}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {result.url && (
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#28929f] hover:bg-[#237a85] text-white rounded-lg font-medium transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Take Quiz
                </a>
              )}
              <button
                onClick={() => {
                  setResult(null);
                  setAudioBlob(null);
                  setUploadedFile(null);
                  setTitle("");
                  setDuration(0);
                }}
                className="px-6 py-3 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 rounded-lg font-medium transition-colors"
              >
                Create Another Quiz
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 rounded-lg font-medium transition-colors text-center"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
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
              <Link href="/record" className="text-[#28929f] font-medium">Record</Link>
              <Link href="/upload" className="text-neutral-600 hover:text-[#28929f] transition-colors">Upload</Link>
            </nav>

            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-neutral-100">
                <Settings className="w-5 h-5 text-neutral-600" />
              </button>
              
              {/* User Dropdown */}
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
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    
                    {/* Dropdown Menu */}
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Add Your Lecture
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Record a new lecture or upload an existing audio file. We'll automatically generate transcripts and quizzes from your content.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex bg-neutral-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('record')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'record'
                  ? 'bg-white text-[#28929f] shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              <Mic className="w-4 h-4 inline mr-2" />
              Record Live
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
                activeTab === 'upload'
                  ? 'bg-white text-[#28929f] shadow-sm'
                  : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload File
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-8">
            
            {/* Class Selection */}
            <div className="mb-6">
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

            {/* Quiz Settings */}
            <div className="mb-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Lecture Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={activeTab === 'record' ? "Enter lecture title (optional)" : "Enter lecture title"}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as "easy" | "medium" | "hard")}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f]"
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
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f]"
                  />
                </div>
              </div>
            </div>

            {/* Content for Record Tab */}
            {activeTab === 'record' && (
              <>
                {/* Recording Status */}
                <div className="text-center mb-8">
                  {isRecording && (
                    <div className="flex items-center justify-center gap-2 text-red-600 mb-4">
                      <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                      <span className="font-medium">Recording...</span>
                    </div>
                  )}
                  
                  {/* Duration Display */}
                  <div className="text-4xl font-mono font-bold text-neutral-800 mb-2">
                    {formatTime(duration)}
                  </div>
                  
                  {audioBlob && !isRecording && (
                    <div className="text-green-600 font-medium">
                      Recording complete! Duration: {formatTime(duration)}
                    </div>
                  )}
                </div>

                {/* Main Record Button */}
                <div className="flex justify-center mb-8">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      disabled={uploading}
                      className="w-32 h-32 rounded-full bg-[#28929f] hover:bg-[#237a85] text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 disabled:opacity-50"
                    >
                      <Mic className="w-12 h-12" />
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="w-32 h-32 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg transition-all hover:scale-105"
                    >
                      <Square className="w-12 h-12" />
                    </button>
                  )}
                </div>

                {/* Audio Preview */}
                {audioBlob && !isRecording && (
                  <div className="mb-6 p-4 bg-neutral-50 rounded-xl">
                    <h3 className="font-medium mb-2">Preview Recording:</h3>
                    <audio 
                      controls 
                      src={URL.createObjectURL(audioBlob)}
                      className="w-full"
                    />
                  </div>
                )}
              </>
            )}

            {/* Content for Upload Tab */}
            {activeTab === 'upload' && (
              <>
                {/* File Upload Area */}
                <div className="text-center mb-8">
                  <div className="border-2 border-dashed border-neutral-300 rounded-xl p-12 hover:border-[#28929f] transition-colors">
                    <FileAudio className="w-16 h-16 mx-auto text-neutral-400 mb-4" />
                    <h3 className="text-lg font-medium mb-2">Upload Audio File</h3>
                    <p className="text-neutral-600 mb-4">
                      Choose an audio or video file from your device
                    </p>
                    <input
                      type="file"
                      id="file-upload"
                      accept="audio/*,video/*,.flac,.m4a,.mp3,.mp4,.mpeg,.mpga,.oga,.ogg,.wav,.webm"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#28929f] hover:bg-[#237a85] text-white font-medium cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Choose File
                    </label>
                  </div>
                  
                  {uploadedFile && (
                    <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center gap-2 text-green-700">
                        <FileAudio className="w-5 h-5" />
                        <span className="font-medium">{uploadedFile.name}</span>
                        <span className="text-sm text-green-600">
                          ({(uploadedFile.size / (1024 * 1024)).toFixed(1)} MB)
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center text-sm text-neutral-500 mb-6">
                  Supported formats: MP3, WAV, M4A, MP4, FLAC, OGG, WebM (max 25MB)
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              {(audioBlob || uploadedFile) && !isRecording && (
                <>
                  <button
                    onClick={handleUpload}
                    disabled={uploading || !selectedClassId || classes.length === 0}
                    className="w-full py-4 px-6 rounded-xl bg-[#28929f] hover:bg-[#237a85] text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-5 h-5" />
                        Generate Quiz from {activeTab === 'record' ? 'Recording' : 'File'}
                      </>
                    )}
                  </button>
                  
                  {uploading && (
                    <div className="text-center text-sm text-neutral-600 space-y-1">
                      <p>This may take a few minutes...</p>
                      <p>Processing: Transcription → Summary → Quiz Generation</p>
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setAudioBlob(null);
                      setUploadedFile(null);
                      setDuration(0);
                    }}
                    disabled={uploading}
                    className="w-full py-3 px-6 rounded-xl border border-neutral-300 bg-white hover:border-neutral-400 text-neutral-700 font-medium transition-colors disabled:opacity-50"
                  >
                    {activeTab === 'record' ? 'Record Again' : 'Choose Different File'}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-2">
              {activeTab === 'record' ? 'Recording Tips:' : 'Upload Tips:'}
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              {activeTab === 'record' ? (
                <>
                  <li>• Speak clearly and at a normal pace</li>
                  <li>• Try to minimize background noise</li>
                  <li>• Position yourself close to your microphone</li>
                  <li>• Pause briefly between major topics for better transcription</li>
                </>
              ) : (
                <>
                  <li>• Use high-quality audio files for best transcription results</li>
                  <li>• Files with clear speech and minimal background noise work best</li>
                  <li>• Supported formats: MP3, WAV, M4A, MP4, FLAC, OGG, WebM</li>
                  <li>• Maximum file size: 25MB</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}