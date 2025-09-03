"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowLeft
} from "lucide-react";

interface Question {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  rationale?: string;
}

interface Quiz {
  id: string;
  title?: string;
  questions: Question[];
}

interface QuizClientProps {
  quiz: Quiz;
  slug: string;
}

export default function QuizClient({ quiz, slug }: QuizClientProps) {
  const [choices, setChoices] = useState<number[]>(Array(quiz.questions.length).fill(-1));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{score: number, total: number} | null>(null);

  async function submit() {
    setSubmitting(true);
    const res = await fetch(`/api/submissions/${slug}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: choices })
    });
    const data = await res.json();
    setResult(data);
    setSubmitting(false);
  }

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'bg-green-50 border-green-200';
    if (percentage >= 80) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);
    
    return (
      <div className="min-h-screen bg-neutral-50">
        {/* Header */}
        <header className="bg-white border-b border-neutral-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <Image
                  src="/images/lecture-logo.png"
                  alt="Resona Logo"
                  width={32}
                  height={32}
                  className="rounded-lg"
                />
                <span className="font-semibold tracking-tight text-lg">Resona</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
              Quiz Complete!
            </h1>
            <p className="text-neutral-600">
              Thank you for completing the quiz. Here are your results:
            </p>
          </div>

          {/* Results Card */}
          <div className={`max-w-2xl mx-auto rounded-2xl border-2 p-8 ${getScoreBackground(result.score, result.total)}`}>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-2">
                <span className={getScoreColor(result.score, result.total)}>
                  {result.score}/{result.total}
                </span>
              </h2>
              <p className="text-lg font-medium mb-4">
                You scored <span className={`font-bold ${getScoreColor(result.score, result.total)}`}>
                  {percentage}%
                </span>
              </p>
              
              {percentage >= 90 ? (
                <p className="text-green-700">Excellent work! You've mastered this material.</p>
              ) : percentage >= 80 ? (
                <p className="text-yellow-700">Good job! You have a solid understanding of the material.</p>
              ) : percentage >= 70 ? (
                <p className="text-orange-700">You're getting there! Consider reviewing the material.</p>
              ) : (
                <p className="text-red-700">You might want to review the lecture material and try again.</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="px-6 py-3 bg-[#28929f] hover:bg-[#237a85] text-white rounded-lg font-medium transition-colors text-center"
            >
              Back to Home
            </Link>
            <button 
              onClick={() => window.print()}
              className="px-6 py-3 border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 rounded-lg font-medium transition-colors"
            >
              Print Results
            </button>
          </div>
        </div>
      </div>
    );
  }

  const answeredQuestions = choices.filter(c => c !== -1).length;
  const allAnswered = choices.every(c => c !== -1);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image
                src="/images/lecture-logo.png"
                alt="Resona Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="font-semibold tracking-tight text-lg">Resona</span>
            </div>

            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2 text-sm text-neutral-600">
              <Clock className="w-4 h-4" />
              <span>{answeredQuestions}/{quiz.questions.length} completed</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quiz Header */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {quiz.title || "Quiz"}
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-neutral-600">
              Complete all questions below and submit when ready.
            </p>
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <span className="font-medium">{answeredQuestions}/{quiz.questions.length}</span>
              <span>questions answered</span>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div 
                className="bg-[#28929f] h-2 rounded-full transition-all duration-300"
                style={{ width: `${(answeredQuestions / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {quiz.questions.map((q, i) => {
            const isAnswered = choices[i] !== -1;
            
            return (
              <div key={q.id} className="bg-white rounded-xl border border-neutral-200 p-6">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${
                    isAnswered 
                      ? 'bg-[#28929f] border-[#28929f] text-white' 
                      : 'border-neutral-300 text-neutral-500'
                  }`}>
                    {isAnswered ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-neutral-900 mb-4">
                      {q.prompt}
                    </h3>
                    
                    <div className="space-y-3">
                      {q.options.map((opt, j) => (
                        <label 
                          key={j}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            choices[i] === j
                              ? 'bg-[#28929f]/10 border-[#28929f] text-[#28929f]'
                              : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                          }`}
                        >
                          <input 
                            type="radio" 
                            name={`q${i}`} 
                            checked={choices[i] === j}
                            onChange={() => setChoices((prev: number[]) => {
                              const c = [...prev]; 
                              c[i] = j; 
                              return c;
                            })}
                            className="sr-only"
                          />
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            choices[i] === j 
                              ? 'border-[#28929f] bg-[#28929f]' 
                              : 'border-neutral-300'
                          }`}>
                            {choices[i] === j && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                          <span className="font-medium">{String.fromCharCode(65 + j)}.</span>
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Submit Section */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-neutral-900 mb-1">Ready to submit?</h3>
              <p className="text-sm text-neutral-600">
                {allAnswered 
                  ? "All questions answered. You can submit your quiz now."
                  : `Please answer ${quiz.questions.length - answeredQuestions} more question${quiz.questions.length - answeredQuestions === 1 ? '' : 's'} before submitting.`
                }
              </p>
            </div>
            
            <button 
              className="px-6 py-3 bg-[#28929f] hover:bg-[#237a85] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              onClick={submit}
              disabled={submitting || !allAnswered}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Submit Quiz
                </>
              )}
            </button>
          </div>
          
          {!allAnswered && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-700">
                Please answer all questions before submitting your quiz.
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
