"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft,
  Plus, 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Settings,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Eye
} from "lucide-react";

interface ClassPageProps {
  params: {
    id: string;
  };
}

export default function ClassPage({ params }: ClassPageProps) {
  const classId = params.id;
  
  // Mock data - in real app, this would be fetched based on classId
  const [classData] = useState({
    id: classId,
    name: "Introduction to Psychology",
    code: "PSYC 101",
    description: "An introductory course covering fundamental concepts in psychology including cognition, behavior, and research methods.",
    students: 45,
    semester: "Fall 2025",
    meetingTime: "MWF 10:00 AM - 10:50 AM",
    room: "Psychology Building 101"
  });

  const [students] = useState([
    { id: 1, name: "Emma Johnson", email: "emma.johnson@university.edu", quizzesCompleted: 8, avgScore: 87 },
    { id: 2, name: "Michael Chen", email: "m.chen@university.edu", quizzesCompleted: 7, avgScore: 92 },
    { id: 3, name: "Sarah Williams", email: "sarah.w@university.edu", quizzesCompleted: 8, avgScore: 79 },
    { id: 4, name: "David Rodriguez", email: "d.rodriguez@university.edu", quizzesCompleted: 6, avgScore: 84 },
    { id: 5, name: "Lisa Thompson", email: "lisa.thompson@university.edu", quizzesCompleted: 8, avgScore: 91 }
  ]);

  const [quizzes] = useState([
    {
      id: 1,
      title: "Introduction to Psychology Basics",
      status: "active",
      submissions: 42,
      totalStudents: 45,
      avgScore: 85,
      dueDate: "Sep 10, 2025",
      createdDate: "Sep 1, 2025"
    },
    {
      id: 2,
      title: "Memory and Cognition",
      status: "active",
      submissions: 38,
      totalStudents: 45,
      avgScore: 78,
      dueDate: "Sep 15, 2025",
      createdDate: "Sep 5, 2025"
    },
    {
      id: 3,
      title: "Research Methods Overview",
      status: "draft",
      submissions: 0,
      totalStudents: 45,
      avgScore: 0,
      dueDate: "Sep 20, 2025",
      createdDate: "Sep 8, 2025"
    }
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'quizzes'>('overview');

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                JD
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-neutral-600 hover:text-[#28929f] transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Class Header */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">{classData.name}</h1>
              <p className="text-lg text-neutral-600 mb-4">{classData.code} • {classData.semester}</p>
              <p className="text-neutral-600 max-w-2xl">{classData.description}</p>
              
              <div className="flex items-center gap-6 mt-4 text-sm text-neutral-600">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {classData.students} students
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {classData.meetingTime}
                </div>
                <div>{classData.room}</div>
              </div>
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
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-neutral-200">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-[#28929f] text-[#28929f]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'students'
                    ? 'border-[#28929f] text-[#28929f]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Students ({students.length})
              </button>
              <button
                onClick={() => setActiveTab('quizzes')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'quizzes'
                    ? 'border-[#28929f] text-[#28929f]'
                    : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                }`}
              >
                Quizzes ({quizzes.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Stats */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold">Total Students</h3>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">{classData.students}</p>
                  <p className="text-sm text-neutral-600">Enrolled this semester</p>
                </div>

                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-green-100">
                      <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <h3 className="font-semibold">Active Quizzes</h3>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">{quizzes.filter(q => q.status === 'active').length}</p>
                  <p className="text-sm text-neutral-600">Currently available</p>
                </div>

                <div className="bg-white rounded-xl border border-neutral-200 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <h3 className="font-semibold">Avg Score</h3>
                  </div>
                  <p className="text-2xl font-bold text-neutral-900">82%</p>
                  <p className="text-sm text-neutral-600">Across all quizzes</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Quiz "Memory and Cognition" completed by Emma Johnson</p>
                      <p className="text-sm text-neutral-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">New quiz "Research Methods Overview" created</p>
                      <p className="text-sm text-neutral-600">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                    <Users className="w-5 h-5 text-purple-500" />
                    <div>
                      <p className="font-medium">3 new students added to class</p>
                      <p className="text-sm text-neutral-600">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-neutral-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link 
                    href="/record"
                    className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:border-[#28929f] transition-colors"
                  >
                    <BookOpen className="w-5 h-5 text-[#28929f]" />
                    <span className="font-medium">Create New Quiz</span>
                  </Link>
                  <button className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:border-[#28929f] transition-colors w-full">
                    <Users className="w-5 h-5 text-[#28929f]" />
                    <span className="font-medium">Add Students</span>
                  </button>
                  <button className="flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:border-[#28929f] transition-colors w-full">
                    <Send className="w-5 h-5 text-[#28929f]" />
                    <span className="font-medium">Send Announcement</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'students' && (
          <div className="bg-white rounded-xl border border-neutral-200">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Students</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#28929f] hover:bg-[#237a85] text-white rounded-lg transition-colors">
                  <Plus className="w-4 h-4" />
                  Add Student
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Quizzes Completed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Avg Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-neutral-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-neutral-900">{student.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                        {student.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                        {student.quizzesCompleted}/{quizzes.filter(q => q.status === 'active').length}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.avgScore >= 90 ? 'bg-green-100 text-green-800' :
                          student.avgScore >= 80 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {student.avgScore}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-[#28929f] hover:text-[#237a85] font-medium">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="bg-white rounded-xl border border-neutral-200">
            <div className="p-6 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Quizzes</h2>
                <Link 
                  href="/record"
                  className="flex items-center gap-2 px-4 py-2 bg-[#28929f] hover:bg-[#237a85] text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create Quiz
                </Link>
              </div>
            </div>

            <div className="divide-y divide-neutral-100">
              {quizzes.map((quiz) => (
                <div key={quiz.id} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Link href={`/quizzes/${quiz.id}`} className="font-medium text-neutral-900 hover:text-[#28929f] transition-colors">
                          {quiz.title}
                        </Link>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          quiz.status === 'active' ? 'bg-green-100 text-green-800' :
                          quiz.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {quiz.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-neutral-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {quiz.submissions}/{quiz.totalStudents} submitted
                        </div>
                        {quiz.status === 'active' && (
                          <div className="flex items-center gap-1">
                            <BarChart3 className="w-4 h-4" />
                            {quiz.avgScore}% avg score
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Due {quiz.dueDate}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link href={`/quizzes/${quiz.id}`} className="p-2 rounded-lg hover:bg-neutral-100">
                        <Eye className="w-4 h-4 text-neutral-600" />
                      </Link>
                      <button className="p-2 rounded-lg hover:bg-neutral-100">
                        <Edit className="w-4 h-4 text-neutral-600" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-neutral-100">
                        <MoreVertical className="w-4 h-4 text-neutral-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}