import { prisma } from "@/lib/db";

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    console.log(`[SUBMISSION] Starting submission for slug: ${params.slug}`);
    
    // Parse request body with error handling
    let requestBody;
    try {
      requestBody = await req.json();
      console.log(`[SUBMISSION] Request body:`, JSON.stringify(requestBody, null, 2));
    } catch (error) {
      console.error(`[SUBMISSION] Failed to parse JSON:`, error);
      return new Response(JSON.stringify({ error: "Invalid JSON in request body" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { choices, studentLabel, answers } = requestBody;
    
    // Handle both 'choices' and 'answers' for backward compatibility
    const submissionChoices = choices || answers;
    console.log(`[SUBMISSION] Extracted choices:`, submissionChoices, `studentLabel:`, studentLabel);

    // Validate slug and find quiz
    console.log(`[SUBMISSION] Looking for quiz with slug: ${params.slug}`);
    const quiz = await prisma.quiz.findFirst({ 
      where: { publicSlug: params.slug, isPublished: true } 
    });
    
    if (!quiz) {
      console.error(`[SUBMISSION] Quiz not found for slug: ${params.slug}`);
      return new Response(JSON.stringify({ error: "Quiz not found" }), { 
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`[SUBMISSION] Found quiz:`, { id: quiz.id, title: quiz.title });

    // Get questions
    const questions = await prisma.question.findMany({ 
      where: { quizId: quiz.id }, 
      orderBy: { id: "asc" } 
    });
    
    console.log(`[SUBMISSION] Found ${questions.length} questions`);

    // Validate choices array
    console.log(`[SUBMISSION] Validating choices array...`);
    console.log(`[SUBMISSION] choices type:`, typeof submissionChoices, `isArray:`, Array.isArray(submissionChoices));
    console.log(`[SUBMISSION] choices length:`, submissionChoices?.length, `questions length:`, questions.length);

    if (!Array.isArray(submissionChoices)) {
      console.error(`[SUBMISSION] choices is not an array:`, typeof submissionChoices);
      return new Response(JSON.stringify({ 
        error: "Invalid choices format - must be an array",
        received: typeof submissionChoices,
        choices: submissionChoices
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (submissionChoices.length !== questions.length) {
      console.error(`[SUBMISSION] choices length mismatch. Expected: ${questions.length}, got: ${submissionChoices.length}`);
      return new Response(JSON.stringify({ 
        error: "Choices length mismatch",
        expected: questions.length,
        received: submissionChoices.length,
        choices: submissionChoices
      }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validate each choice
    for (let i = 0; i < submissionChoices.length; i++) {
      const choice = submissionChoices[i];
      console.log(`[SUBMISSION] Choice ${i}:`, choice, `type:`, typeof choice);
      
      if (typeof choice !== 'number' || choice < 0 || choice > 3) {
        console.error(`[SUBMISSION] Invalid choice at index ${i}:`, choice);
        return new Response(JSON.stringify({ 
          error: `Invalid choice at index ${i}`,
          choice: choice,
          expected: "number between 0 and 3"
        }), { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    // Create submission
    console.log(`[SUBMISSION] Creating submission...`);
    let correct = 0;
    const submission = await prisma.submission.create({ 
      data: { 
        quizId: quiz.id, 
        studentLabel: studentLabel ?? null 
      } 
    });
    
    console.log(`[SUBMISSION] Created submission with ID: ${submission.id}`);

    // Process answers with detailed debugging
    console.log(`[SUBMISSION] Processing answers with detailed comparison...`);
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const chosen = submissionChoices[i];
      const isCorrect = chosen === q.correctIndex;
      if (isCorrect) correct++;
      
      // Enhanced logging for debugging
      console.log(`[SUBMISSION] Question ${i+1}:`);
      console.log(`  - Question ID: ${q.id}`);
      console.log(`  - Prompt: ${q.prompt}`);
      console.log(`  - Options: ${JSON.stringify(q.options)}`);
      console.log(`  - Your choice index: ${chosen}`);
      console.log(`  - Your choice text: ${Array.isArray(q.options) ? q.options[chosen] : 'Invalid options format'}`);
      console.log(`  - Correct index: ${q.correctIndex}`);
      console.log(`  - Correct answer text: ${Array.isArray(q.options) ? q.options[q.correctIndex] : 'Invalid options format'}`);
      console.log(`  - Is correct: ${isCorrect}`);
      console.log(`  - Running total: ${correct}/${i+1}`);
      
      await prisma.answer.create({ 
        data: { 
          submissionId: submission.id, 
          questionId: q.id, 
          chosenIndex: chosen, 
          isCorrect 
        } 
      });
    }

    // Update submission as completed
    await prisma.submission.update({ 
      where: { id: submission.id }, 
      data: { submittedAt: new Date() } 
    });

    console.log(`[SUBMISSION] Successfully completed submission. Score: ${correct}/${questions.length}`);

    return new Response(JSON.stringify({ 
      score: correct, 
      total: questions.length 
    }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error(`[SUBMISSION] Unexpected error:`, error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      details: error instanceof Error ? error.message : String(error)
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
