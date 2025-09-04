"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft,
  Edit,
  Settings,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  BarChart3,
  Calendar,
  Eye,
  Download,
  Send,
  MoreVertical
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

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  const { data: session } = useSession();
  const quizId = params.id;
  
  // Mock data - in real app, this would be fetched based on quizId
  const [quizData] = useState({
    id: quizId,
    title: "Introduction to Psychology Basics",
    className: "Introduction to Psychology",
    classCode: "PSYC 101",
    status: "complete", // open, complete, draft, closed
    createdDate: "Sep 1, 2025",
    dueDate: "Sep 10, 2025",
    totalQuestions: 5,
    totalStudents: 45,
    submissions: 42,
    avgScore: 85,
    duration: "30 minutes",
    attempts: 1
  });

  const [questions] = useState([
    {
      id: 1,
      question: "What is the primary focus of cognitive psychology?",
      type: "multiple-choice",
      options: [
        "The study of mental processes",
        "The study of behavior only", 
        "The study of physical responses",
        "The study of social interactions"
      ],
      correctAnswer: 0,
      correctResponses: 38,
      incorrectResponses: 4,
      explanation: "Cognitive psychology focuses on mental processes such as perception, memory, thinking, and problem-solving."
    },
    {
      id: 2,
      question: "Who is considered the father of psychoanalysis?",
      type: "multiple-choice",
      options: [
        "Carl Jung",
        "Sigmund Freud",
        "William James",
        "B.F. Skinner"
      ],
      correctAnswer: 1,
      correctResponses: 40,
      incorrectResponses: 2,
      explanation: "Sigmund Freud developed psychoanalysis and is widely considered its founding father."
    },
    {
      id: 3,
      question: "Classical conditioning was first studied by which psychologist?",
      type: "multiple-choice",
      options: [
        "Ivan Pavlov",
        "John Watson",
        "Albert Bandura",
        "Edward Thorndike"
      ],
      correctAnswer: 0,
      correctResponses: 35,
      incorrectResponses: 7,
      explanation: "Ivan Pavlov's experiments with dogs led to the discovery of classical conditioning."
    },
    {
      id: 4,
      question: "The scientific method is important in psychology because it ensures objectivity and reliability.",
      type: "true-false",
      options: ["True", "False"],
      correctAnswer: 0,
      correctResponses: 39,
      incorrectResponses: 3,
      explanation: "The scientific method provides a systematic approach to studying psychological phenomena objectively."
    },
    {
      id: 5,
      question: "What are the main components of the nervous system?",
      type: "short-answer",
      correctAnswer: "Central nervous system (brain and spinal cord) and peripheral nervous system",
      sampleAnswers: [
        "Central and peripheral nervous systems",
        "Brain, spinal cord, and nerves",
        "CNS and PNS"
      ],
      correctResponses: 32,
      incorrectResponses: 10,
      explanation: "The nervous system is divided into the central nervous system (CNS) and peripheral nervous system (PNS)."
    }
  ]);

  const [submissions] = useState([
    { id: 1, studentName: "Emma Johnson", submittedAt: "Sep 8, 2025 2:30 PM", score: 95, status: "completed" },
    { id: 2, studentName: "Michael Chen", submittedAt: "Sep 9, 2025 10:15 AM", score: 88, status: "completed" },
    { id: 3, studentName: "Sarah Williams", submittedAt: "Sep 10, 2025 9:45 AM", score: 76, status: "completed" },
    { id: 4, studentName: "David Rodriguez", submittedAt: "Sep 9, 2025 3:20 PM", score: 92, status: "completed" },
    { id: 5, studentName: "Lisa Thompson", submittedAt: "Sep 10, 2025 11:30 AM", score: 84, status: "completed" }
  ]);

  const [activeTab, setActiveTab] = useState<'questions' | 'submissions' | 'analytics'>('questions');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'complete': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
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

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-neutral-600 hover:text-[#28929f] transition-colors">Dashboard</Link>
              <Link href="/record" className="text-neutral-600 hover:text-[#28929f] transition-colors">Record</Link>
              <Link href="/upload" className="text-neutral-600 hover:text-[#28929f] transition-colors">Upload</Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg hover:bg-neutral-100">
                <Settings className="w-5 h-5 text-neutral-600" />
              </button>
              <div className="w-8 h-8 rounded-full bg-[#28929f] flex items-center justify-center text-white text-sm font-medium">
                {getInitials(session?.user?.name)}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard" className="text-neutral-600 hover:text-[#28929f] transition-colors">
            Dashboard
          </Link>
          <span className="text-neutral-400">/</span>
          <Link href="/classes/1" className="text-neutral-600 hover:text-[#28929f] transition-colors">
            {quizData.className}
          </Link>
          <span className="text-neutral-400">/</span>
          <span className="text-neutral-900">Quiz</span>
        </div>

        {/* Quiz Header */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-neutral-900">{quizData.title}</h1>
                <span className={`px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(quizData.status)}`}>
                  {quizData.status.charAt(0).toUpperCase() + quizData.status.slice(1)}
                </span>
              </div>
              <p className="text-lg text-neutral-600 mb-4">
                {quizData.classCode} • {quizData.className}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-neutral-100">
                <Edit className="w-5 h-5 text-neutral-600" />
              </button>
              <button className="p-2 rounded-lg hover:bg-neutral-100">
                <MoreVertical className="w-5 h-5 text-neutral-600" />
              </button>
            </div>
          </div>

          {/* Quiz Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-lg font-bold text-neutral-900">{quizData.totalQuestions}</div>
              <div className="text-sm text-neutral-600">Questions</div>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-lg font-bold text-neutral-900">{quizData.submissions}/{quizData.totalStudents}</div>
              <div className="text-sm text-neutral-600">Submissions</div>
            </div>
            {quizData.status === 'complete' && (
              <div className="text-center p-3 bg-neutral-50 rounded-lg">
                <div className="text-lg font-bold text-[#28929f]">{quizData.avgScore}%</div>
                <div className="text-sm text-neutral-600">Avg Score</div>
              </div>
            )}
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-lg font-bold text-neutral-900">{quizData.duration}</div>
              <div className="text-sm text-neutral-600">Duration</div>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-lg font-bold text-neutral-900">{quizData.dueDate}</div>
              <div className="text-sm text-neutral-600">Due Date</div>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <div className="text-lg font-bold text-neutral-900">{quizData.attempts}</div>
              <div className="text-sm text-neutral-600">Max Attempts</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-neutral-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('questions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'questions'
                    ? 'border-[#28929f] text-[#28929f]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Questions ({quizData.totalQuestions})
              </button>
              <button
                onClick={() => setActiveTab('submissions')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'submissions'
                    ? 'border-[#28929f] text-[#28929f]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Submissions ({quizData.submissions})
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-[#28929f] text-[#28929f]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Analytics
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'questions' && (
          <div className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="bg-white rounded-xl border border-neutral-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-[#28929f] text-white text-sm font-medium px-2 py-1 rounded">
                        Q{index + 1}
                      </span>
                      <span className="text-sm text-neutral-500 capitalize">
                        {question.type.replace('-', ' ')}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">
                      {question.question}
                    </h3>
                  </div>
                  
                  {quizData.status === 'complete' && (
                    <div className="text-right">
                      <div className="text-sm text-neutral-500">Accuracy</div>
                      <div className="text-lg font-bold text-[#28929f]">
                        {Math.round((question.correctResponses / (question.correctResponses + question.incorrectResponses)) * 100)}%
                      </div>
                    </div>
                  )}
                </div>

                {/* Question Options */}
                {question.type !== 'short-answer' ? (
                  <div className="space-y-2 mb-4">
                    {question.options?.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border ${
                          optionIndex === question.correctAnswer
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-neutral-50 border-neutral-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            optionIndex === question.correctAnswer
                              ? 'bg-green-500 border-green-500'
                              : 'border-neutral-300'
                          }`}>
                            {optionIndex === question.correctAnswer && (
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            )}
                          </div>
                          <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                          <span>{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="font-medium text-green-800 mb-2">Sample Correct Answers:</div>
                      <ul className="space-y-1">
                        {question.sampleAnswers?.map((answer, idx) => (
                          <li key={idx} className="text-green-700">• {answer}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Question Stats */}
                {quizData.status === 'complete' && (
                  <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="text-sm font-medium">{question.correctResponses} correct</span>
                      </div>
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{question.incorrectResponses} incorrect</span>
                      </div>
                    </div>
                    <button className="text-[#28929f] text-sm font-medium hover:underline">
                      View Details
                    </button>
                  </div>
                )}

                {/* Explanation */}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="font-medium text-blue-800 mb-1">Explanation:</div>
                  <p className="text-blue-700 text-sm">{question.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'submissions' && (
          <div className="bg-white rounded-xl border border-neutral-200">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Student Submissions</h2>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 text-neutral-600 border border-neutral-300 rounded-lg hover:bg-neutral-50">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-[#28929f] hover:bg-[#237a85] text-white rounded-lg">
                    <Send className="w-4 h-4" />
                    Send Reminder
                  </button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Submitted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {submissions.map((submission) => (
                    <tr key={submission.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-neutral-900">{submission.studentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                        {submission.submittedAt}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`font-bold ${getScoreColor(submission.score)}`}>
                          {submission.score}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {submission.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-[#28929f] hover:text-[#237a85] font-medium">
                          View Submission
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Missing Submissions */}
            <div className="p-6 border-t border-neutral-200">
              <h3 className="font-medium text-neutral-900 mb-2">
                Missing Submissions ({quizData.totalStudents - quizData.submissions})
              </h3>
              <p className="text-sm text-neutral-600 mb-3">
                {quizData.totalStudents - quizData.submissions} students have not submitted yet
              </p>
              <button className="text-[#28929f] text-sm font-medium hover:underline">
                View Missing Students
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Score Distribution */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">90-100%</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <span className="text-sm font-medium">12 students</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">80-89%</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                    <span className="text-sm font-medium">18 students</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">70-79%</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                    <span className="text-sm font-medium">8 students</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600">Below 70%</span>
                  <div className="flex items-center gap-2">
                    <div className="w-32 bg-neutral-200 rounded-full h-2">
                      <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-sm font-medium">4 students</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Question Performance */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Question Performance</h3>
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="flex justify-between items-center">
                    <span className="text-sm text-neutral-600">Question {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-neutral-200 rounded-full h-2">
                        <div 
                          className="bg-[#28929f] h-2 rounded-full" 
                          style={{ 
                            width: `${Math.round((question.correctResponses / (question.correctResponses + question.incorrectResponses)) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round((question.correctResponses / (question.correctResponses + question.incorrectResponses)) * 100)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Stats */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Key Statistics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Completion Rate</span>
                  <span className="font-medium">{Math.round((quizData.submissions / quizData.totalStudents) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Average Score</span>
                  <span className="font-medium">{quizData.avgScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Highest Score</span>
                  <span className="font-medium">95%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Lowest Score</span>
                  <span className="font-medium">76%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Most Difficult Question</span>
                  <span className="font-medium">Question 3 (83% accuracy)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Easiest Question</span>
                  <span className="font-medium">Question 2 (95% accuracy)</span>
                </div>
              </div>
            </div>

            {/* Time Analytics */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Time Analytics</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Average Time Taken</span>
                  <span className="font-medium">24 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Fastest Completion</span>
                  <span className="font-medium">18 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Slowest Completion</span>
                  <span className="font-medium">29 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Submissions on Time</span>
                  <span className="font-medium">40/42 (95%)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}