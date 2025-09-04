"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { 
  Plus, 
  Users, 
  BookOpen, 
  Calendar, 
  BarChart3, 
  Settings,
  ChevronRight,
  GraduationCap,
  Clock,
  CheckCircle2,
  LogOut,
  User,
  ChevronDown,
  FileText,
  AlertCircle,
  Loader2
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
  createdAt: string;
  updatedAt: string;
  lectureCount: number;
  quizCount: number;
  submissionCount: number;
  studentCount: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPlan] = useState({
    name: "Pro Plan",
    quizzesUsed: 23,
    quizzesLimit: 100,
    studentsLimit: 500,
    renewsOn: "October 15, 2024"
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/classes');
      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes);
        setError(null);
      } else {
        throw new Error('Failed to fetch classes');
      }
    } catch (err) {
      console.error('Error fetching classes:', err);
      setError('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatSemester = (semester?: string, year?: number) => {
    if (semester && year) {
      return `${semester} ${year}`;
    }
    if (semester) return semester;
    if (year) return year.toString();
    return null;
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
              <Link href="/dashboard" className="text-[#28929f] font-medium">Dashboard</Link>
              <Link href="/record" className="text-neutral-600 hover:text-[#28929f] transition-colors">Record</Link>
              <Link href="/upload" className="text-neutral-600 hover:text-[#28929f] transition-colors">Upload</Link>
            </nav>

            {/* User Menu */}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
            Welcome back{session?.user?.name ? `, ${session.user.name}` : ''}
          </h1>
          <p className="text-neutral-600">
            Manage your classes, lectures, and quizzes from your dashboard.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Link 
            href="/classes/add"
            className="group p-6 bg-white rounded-xl border border-neutral-200 hover:border-[#28929f] transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#28929f]/10 group-hover:bg-[#28929f]/20 transition-colors">
                <GraduationCap className="w-5 h-5 text-[#28929f]" />
              </div>
              <h3 className="font-semibold">New Class</h3>
            </div>
            <p className="text-sm text-neutral-600">Create a new class to organize your lectures and quizzes</p>
          </Link>

          <Link 
            href="/record"
            className="group p-6 bg-white rounded-xl border border-neutral-200 hover:border-[#28929f] transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#28929f]/10 group-hover:bg-[#28929f]/20 transition-colors">
                <BookOpen className="w-5 h-5 text-[#28929f]" />
              </div>
              <h3 className="font-semibold">Record Lecture</h3>
            </div>
            <p className="text-sm text-neutral-600">Record or upload a new lecture to generate quizzes</p>
          </Link>

          <button 
            onClick={fetchClasses}
            className="group p-6 bg-white rounded-xl border border-neutral-200 hover:border-[#28929f] transition-colors"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-[#28929f]/10 group-hover:bg-[#28929f]/20 transition-colors">
                <BarChart3 className="w-5 h-5 text-[#28929f]" />
              </div>
              <h3 className="font-semibold">Refresh Data</h3>
            </div>
            <p className="text-sm text-neutral-600">Reload your latest classes and lectures</p>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Current Plan</h2>
                <button className="text-[#28929f] text-sm font-medium hover:underline">
                  Upgrade
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-[#28929f]">{currentPlan.name}</h3>
                  <p className="text-sm text-neutral-600">Renews on {currentPlan.renewsOn}</p>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Quizzes Used</span>
                    <span>{classes.reduce((sum, c) => sum + c.quizCount, 0)}/{currentPlan.quizzesLimit}</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div 
                      className="bg-[#28929f] h-2 rounded-full"
                      style={{ width: `${(classes.reduce((sum, c) => sum + c.quizCount, 0) / currentPlan.quizzesLimit) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Up to {currentPlan.studentsLimit} students
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Unlimited lectures
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Advanced analytics
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Classes List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Your Classes</h2>
                  <Link 
                    href="/classes/add"
                    className="flex items-center gap-2 px-4 py-2 bg-[#28929f] hover:bg-[#237a85] text-white rounded-lg transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    New Class
                  </Link>
                </div>
              </div>

              {/* Loading State */}
              {loading && (
                <div className="p-12 text-center">
                  <Loader2 className="w-8 h-8 text-[#28929f] mx-auto mb-4 animate-spin" />
                  <p className="text-neutral-600">Loading your classes...</p>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="p-12 text-center">
                  <AlertCircle className="w-12 h-12 text-red-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">Failed to load classes</h3>
                  <p className="text-neutral-600 mb-4">{error}</p>
                  <button 
                    onClick={fetchClasses}
                    className="px-4 py-2 bg-[#28929f] hover:bg-[#237a85] text-white rounded-lg transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Empty State */}
              {!loading && !error && classes.length === 0 && (
                <div className="p-12 text-center">
                  <GraduationCap className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No classes yet</h3>
                  <p className="text-neutral-600 mb-4">Create a class to start recording lectures and creating quizzes for your students.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link 
                      href="/classes/add"
                      className="px-4 py-2 bg-[#28929f] hover:bg-[#237a85] text-white rounded-lg transition-colors"
                    >
                      Create Class
                    </Link>
                  </div>
                </div>
              )}

              {/* Classes List */}
              {!loading && !error && classes.length > 0 && (
                <div className="divide-y divide-neutral-100">
                  {classes.map((classItem) => (
                    <div key={classItem.id} className="p-6 hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-[#28929f] rounded-lg flex items-center justify-center text-white font-medium">
                            <GraduationCap className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-medium text-neutral-900">{classItem.name}</h3>
                              {classItem.subject && (
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  {classItem.subject}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-neutral-600">
                              <span>Created {formatDate(classItem.createdAt)}</span>
                              {formatSemester(classItem.semester, classItem.year) && (
                                <span>{formatSemester(classItem.semester, classItem.year)}</span>
                              )}
                            </div>
                            {classItem.description && (
                              <p className="text-sm text-neutral-600 mt-1">{classItem.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm text-neutral-600">
                              <FileText className="w-4 h-4" />
                              {classItem.lectureCount}
                            </div>
                            <p className="text-xs text-neutral-500">lectures</p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm text-neutral-600">
                              <BookOpen className="w-4 h-4" />
                              {classItem.quizCount}
                            </div>
                            <p className="text-xs text-neutral-500">quizzes</p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm text-neutral-600">
                              <Users className="w-4 h-4" />
                              {classItem.studentCount}
                            </div>
                            <p className="text-xs text-neutral-500">students</p>
                          </div>

                          <div className="text-center">
                            <div className="flex items-center gap-1 text-sm text-neutral-600">
                              <BarChart3 className="w-4 h-4" />
                              {classItem.submissionCount}
                            </div>
                            <p className="text-xs text-neutral-500">submissions</p>
                          </div>

                          <Link
                            href={`/classes/${classItem.id}`}
                            className="flex items-center gap-2 px-3 py-1 text-sm bg-[#28929f] hover:bg-[#237a85] text-white rounded-lg transition-colors"
                          >
                            View Class
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}