"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { Mic, Square, Upload, ArrowLeft, Loader2, FileAudio } from "lucide-react";

export default function RecordPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'record' | 'upload'>('record');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
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
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setAudioBlob(null); // Clear any existing recording
      setDuration(0);
    }
  };

  const handleUpload = async () => {
    const fileToUpload = audioBlob || uploadedFile;
    if (!fileToUpload) return;
    
    setUploading(true);
    const formData = new FormData();
    
    if (audioBlob) {
      formData.append('file', audioBlob, 'recording.webm');
      formData.append('title', `Recorded Lecture - ${new Date().toLocaleDateString()}`);
    } else if (uploadedFile) {
      formData.append('file', uploadedFile);
      formData.append('title', uploadedFile.name.replace(/\.[^/.]+$/, ""));
    }
    
    formData.append('difficulty', 'medium');
    formData.append('numQuestions', '8');

    try {
      const response = await fetch('/api/lectures', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        window.location.href = `/upload?success=true&quizId=${data.quizId}`;
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-neutral-600 hover:text-[#28929f] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </Link>
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
                    disabled={uploading}
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
                  
                  <button
                    onClick={() => {
                      setAudioBlob(null);
                      setUploadedFile(null);
                      setDuration(0);
                    }}
                    className="w-full py-3 px-6 rounded-xl border border-neutral-300 bg-white hover:border-neutral-400 text-neutral-700 font-medium transition-colors"
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