import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  console.log("🔍 Classes API GET called");
  
  try {
    const session = await getServerSession();
    console.log("📱 Session:", session ? "Found" : "Not found");
    console.log("📧 User email:", session?.user?.email);
    
    if (!session?.user?.email) {
      console.log("❌ No session or email, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user by email
    console.log("🔍 Looking up user by email:", session.user.email);
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    console.log("👤 User found:", user ? `ID: ${user.id}` : "Not found");

    if (!user) {
      console.log("❌ User not found in database, returning 404");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch user's classes with lecture and quiz counts
    console.log("🔍 Fetching classes for user:", user.id);
    const classes = await prisma.class.findMany({
      where: {
        userId: user.id
      },
      include: {
        lectures: {
          include: {
            quiz: {
              include: {
                submissions: true,
                questions: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    console.log("📚 Classes found:", classes.length);

    // Transform classes with aggregated data
    const classData = classes.map(classItem => {
      const lectures = classItem.lectures;
      const quizzes = lectures.filter(lecture => lecture.quiz);
      const totalSubmissions = lectures.reduce((sum, lecture) => 
        sum + (lecture.quiz?.submissions?.length || 0), 0
      );
      const uniqueStudents = new Set(
        lectures.flatMap(lecture => 
          lecture.quiz?.submissions?.map(s => s.studentLabel) || []
        )
      ).size;

      return {
        id: classItem.id,
        name: classItem.name,
        description: classItem.description,
        subject: classItem.subject,
        semester: classItem.semester,
        year: classItem.year,
        createdAt: classItem.createdAt,
        updatedAt: classItem.updatedAt,
        lectureCount: lectures.length,
        quizCount: quizzes.length,
        submissionCount: totalSubmissions,
        studentCount: uniqueStudents
      };
    });

    console.log("✅ Returning classes data, count:", classData.length);
    return NextResponse.json({ classes: classData });
  } catch (error) {
    console.error("💥 Error fetching classes:", error);
    return NextResponse.json(
      { error: "Failed to fetch classes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  console.log("🔍 Classes API POST called");
  
  try {
    const session = await getServerSession();
    console.log("📱 Session:", session ? "Found" : "Not found");
    
    if (!session?.user?.email) {
      console.log("❌ No session or email, returning 401");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });
    console.log("👤 User found:", user ? `ID: ${user.id}` : "Not found");

    if (!user) {
      console.log("❌ User not found in database, returning 404");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    console.log("📝 Request body:", body);
    const { name, description, subject, semester, year } = body;

    if (!name) {
      console.log("❌ No class name provided, returning 400");
      return NextResponse.json({ error: "Class name is required" }, { status: 400 });
    }

    // Create new class
    console.log("🔍 Creating new class:", { name, description, subject, semester, year });
    const newClass = await prisma.class.create({
      data: {
        name,
        description: description || null,
        subject: subject || null,
        semester: semester || null,
        year: year ? parseInt(year) : null,
        userId: user.id
      }
    });
    console.log("✅ Class created:", newClass.id);

    return NextResponse.json({ 
      success: true, 
      class: newClass 
    });
  } catch (error) {
    console.error("💥 Error creating class:", error);
    return NextResponse.json(
      { error: "Failed to create class" },
      { status: 500 }
    );
  }
}