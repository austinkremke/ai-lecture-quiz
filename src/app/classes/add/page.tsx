"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { 
  ArrowLeft, 
  Save, 
  Users, 
  Calendar, 
  MapPin, 
  BookOpen, 
  Clock, 
  Plus 
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

export default function AddClassPage() {
  const { data: session } = useSession();
  
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    semester: "Fall 2025",
    meetingDays: [] as string[],
    startTime: "",
    endTime: "",
    room: "",
    maxStudents: "",
    color: "bg-blue-500"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const colorOptions = [
    { value: "bg-blue-500", label: "Blue", class: "bg-blue-500" },
    { value: "bg-green-500", label: "Green", class: "bg-green-500" },
    { value: "bg-purple-500", label: "Purple", class: "bg-purple-500" },
    { value: "bg-red-500", label: "Red", class: "bg-red-500" },
    { value: "bg-yellow-500", label: "Yellow", class: "bg-yellow-500" },
    { value: "bg-indigo-500", label: "Indigo", class: "bg-indigo-500" },
    { value: "bg-pink-500", label: "Pink", class: "bg-pink-500" },
    { value: "bg-teal-500", label: "Teal", class: "bg-teal-500" }
  ];

  const dayOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      meetingDays: prev.meetingDays.includes(day)
        ? prev.meetingDays.filter(d => d !== day)
        : [...prev.meetingDays, day]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    try {
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to dashboard or new class page
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
              <div className="w-8 h-8 rounded-full bg-[#28929f] flex items-center justify-center text-white text-sm font-medium">
                {getInitials(session?.user?.name)}
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

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
            Create New Class
          </h1>
          <p className="text-neutral-600">
            Set up a new class to organize your lectures, quizzes, and students.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#28929f]" />
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Class Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., Introduction to Psychology"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
                />
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-neutral-700 mb-2">
                  Course Code *
                </label>
                <input
                  type="text"
                  id="code"
                  name="code"
                  required
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., PSYC 101"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the course content and objectives..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
                />
              </div>

              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-neutral-700 mb-2">
                  Semester *
                </label>
                <select
                  id="semester"
                  name="semester"
                  required
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
                >
                  <option value="Fall 2025">Fall 2025</option>
                  <option value="Spring 2026">Spring 2026</option>
                  <option value="Summer 2025">Summer 2025</option>
                </select>
              </div>

              <div>
                <label htmlFor="maxStudents" className="block text-sm font-medium text-neutral-700 mb-2">
                  Max Students
                </label>
                <input
                  type="number"
                  id="maxStudents"
                  name="maxStudents"
                  value={formData.maxStudents}
                  onChange={handleInputChange}
                  placeholder="e.g., 50"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Schedule Information */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#28929f]" />
              Schedule & Location
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Meeting Days
                </label>
                <div className="flex flex-wrap gap-2">
                  {dayOptions.map(day => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayToggle(day)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        formData.meetingDays.includes(day)
                          ? 'bg-[#28929f] text-white border-[#28929f]'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-[#28929f]'
                      }`}
                    >
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-neutral-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-neutral-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="room" className="block text-sm font-medium text-neutral-700 mb-2">
                    Room/Location
                  </label>
                  <input
                    type="text"
                    id="room"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    placeholder="e.g., Psychology Building 101"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-[#28929f] focus:border-[#28929f] outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <div className={`w-5 h-5 ${formData.color} rounded`}></div>
              Appearance
            </h2>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Class Color
              </label>
              <div className="flex flex-wrap gap-3">
                {colorOptions.map(color => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`w-12 h-12 ${color.class} rounded-lg border-2 transition-all hover:scale-105 ${
                      formData.color === color.value 
                        ? 'border-neutral-900 ring-2 ring-neutral-200' 
                        : 'border-neutral-300'
                    }`}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <div className="border border-neutral-200 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${formData.color} rounded-lg flex items-center justify-center text-white font-medium`}>
                  {formData.code ? formData.code.split(' ')[0] : 'XX'}
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">
                    {formData.name || 'Class Name'}
                  </h3>
                  <p className="text-sm text-neutral-600">
                    {formData.code || 'Course Code'} • {formData.semester}
                  </p>
                  {formData.meetingDays.length > 0 && formData.startTime && (
                    <p className="text-sm text-neutral-500">
                      {formData.meetingDays.join(', ')} {formData.startTime}
                      {formData.endTime && ` - ${formData.endTime}`}
                      {formData.room && ` • ${formData.room}`}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !formData.name || !formData.code}
              className="px-6 py-3 bg-[#28929f] hover:bg-[#237a85] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Create Class
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}