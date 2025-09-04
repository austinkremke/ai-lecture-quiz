import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { transcribeBuffer } from "@/lib/stt";
import { summarizeTranscript, generateQuiz } from "@/lib/llm";

export const runtime = "nodejs";

// Supported audio formats for OpenAI Whisper
const SUPPORTED_FORMATS = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm'];
const SUPPORTED_MIME_TYPES = [
  'audio/flac',
  'audio/m4a', 
  'audio/mp3',
  'audio/mpeg',
  'video/mp4',
  'audio/mp4',
  'audio/mpga',
  'audio/oga',
  'audio/ogg',
  'audio/wav',
  'audio/webm'
];

function validateAudioFile(file: File) {
  // Get file extension
  const fileName = file.name.toLowerCase();
  const fileExtension = fileName.split('.').pop();
  
  // Check file extension
  if (!fileExtension || !SUPPORTED_FORMATS.includes(fileExtension)) {
    throw new Error(`Unsupported file format: .${fileExtension}. Supported formats: ${SUPPORTED_FORMATS.join(', ')}`);
  }
  
  // Check MIME type if available
  if (file.type && !SUPPORTED_MIME_TYPES.includes(file.type)) {
    console.warn(`Unexpected MIME type: ${file.type} for file ${fileName}`);
  }
  
  // Check file size (max 25MB for Whisper API)
  const maxSize = 25 * 1024 * 1024; // 25MB
  if (file.size > maxSize) {
    throw new Error(`File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum size: 25MB`);
  }
  
  return true;
}

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const title = (form.get("title") as string | null) ?? "Untitled Lecture";
  const difficulty = ((form.get("difficulty") as string | null) ?? "medium") as "easy"|"medium"|"hard";
  const numQuestions = Number((form.get("numQuestions") as string | null) ?? "8");
  const classId = form.get("classId") as string | null;

  if (!file) return new Response(JSON.stringify({ error: "Missing file" }), { status: 400 });
  if (!classId) return new Response(JSON.stringify({ error: "Missing classId" }), { status: 400 });

  try {
    // Validate file format before processing
    validateAudioFile(file);
  } catch (validationError: any) {
    return new Response(JSON.stringify({ error: validationError.message }), { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const mime = file.type || "audio/webm";

  const lecture = await prisma.lecture.create({ 
    data: { 
      title, 
      status: "transcribing",
      classId 
    } 
  });

  try {
    const transcript = await transcribeBuffer(buf, mime, file.name);
    await prisma.lecture.update({ where: { id: lecture.id }, data: { transcriptJson: transcript, status: "summarizing" } });

    const summaryMd = await summarizeTranscript(transcript.segments);
    await prisma.lecture.update({ where: { id: lecture.id }, data: { summaryMd, status: "quizzing" } });

    const quizJson = await generateQuiz(transcript.segments, difficulty, numQuestions);
    const quiz = await prisma.quiz.create({ data: { lectureId: lecture.id, difficulty, numQuestions, title } });
    await prisma.$transaction(quizJson.questions.map((q: any) => prisma.question.create({
      data: { 
        quizId: quiz.id, 
        prompt: q.prompt, 
        options: q.options, 
        correctIndex: q.correct_index, 
        rationale: q.rationale || null, 
        sources: q.sources || null 
      }
    })));

    await prisma.lecture.update({ where: { id: lecture.id }, data: { status: "ready" } });
    return new Response(JSON.stringify({ ok: true, lectureId: lecture.id, quizId: quiz.id }), { status: 200 });
  } catch (e: any) {
    await prisma.lecture.update({ where: { id: lecture.id }, data: { status: "error" } });
    return new Response(JSON.stringify({ error: e?.message || "processing failed" }), { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const classId = searchParams.get('classId');

    // Get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let whereClause: any = {};
    
    if (classId) {
      // Fetch lectures for specific class
      whereClause = {
        classId,
        class: {
          userId: user.id // Ensure user owns the class
        }
      };
    } else {
      // Fetch all lectures for user's classes
      whereClause = {
        class: {
          userId: user.id
        }
      };
    }

    // Fetch lectures with their associated quizzes
    const lectures = await prisma.lecture.findMany({
      where: whereClause,
      include: {
        class: true,
        quiz: {
          include: {
            questions: true,
            submissions: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform lectures into a format suitable for the dashboard
    const lectureData = lectures.map(lecture => {
      const quiz = lecture.quiz;
      const submissions = quiz?.submissions || [];
      const uniqueStudents = new Set(submissions.map(s => s.studentLabel)).size;
      
      return {
        id: lecture.id,
        title: lecture.title || 'Untitled Lecture',
        status: lecture.status,
        createdAt: lecture.createdAt,
        classId: lecture.classId,
        className: lecture.class.name,
        hasQuiz: !!quiz,
        quizId: quiz?.id,
        isPublished: quiz?.isPublished || false,
        publicSlug: quiz?.publicSlug,
        questionsCount: quiz?.questions?.length || 0,
        submissionsCount: submissions.length,
        uniqueStudentsCount: uniqueStudents,
        difficulty: quiz?.difficulty
      };
    });

    return NextResponse.json({ lectures: lectureData });
  } catch (error) {
    console.error("Error fetching lectures:", error);
    return NextResponse.json(
      { error: "Failed to fetch lectures" },
      { status: 500 }
    );
  }
}
