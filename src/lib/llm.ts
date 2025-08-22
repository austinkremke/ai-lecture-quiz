import OpenAI from "openai";
import { z } from "zod";

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }
  return new OpenAI({ apiKey });
}

export async function summarizeTranscript(segments: any[]): Promise<string> {
  const client = getOpenAIClient();
  const res = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: "You are a concise academic summarizer." },
      { role: "user", content: "Summarize this lecture into Markdown with headings: Topics, Key Takeaways, Key Terms.\n\n" + JSON.stringify({ segments }) }
    ]
  });
  return res.choices[0]?.message?.content ?? "";
}

const QuizSchema = z.object({
  questions: z.array(z.object({
    type: z.literal("mcq").default("mcq"),
    prompt: z.string().min(8),
    options: z.array(z.string()).length(4),
    correct_index: z.number().int().min(0).max(3),
    rationale: z.string().optional(),
    sources: z.array(z.object({ t0: z.number(), t1: z.number(), quote: z.string().max(180) })).optional()
  })).min(3)
});

export type QuizJSON = z.infer<typeof QuizSchema>;

export async function generateQuiz(segments: any[], difficulty: "easy"|"medium"|"hard", n: number): Promise<QuizJSON> {
  const client = getOpenAIClient();
  
  const DIFF2BLOOM: Record<string,string[]> = {
    easy: ["Remember","Understand"],
    medium: ["Apply","Analyze"],
    hard: ["Analyze","Evaluate"]
  };

  const jsonSchema = {
    name: "QuizJSON",
    schema: {
      type: "object",
      properties: {
        questions: {
          type: "array", 
          minItems: n, 
          maxItems: n,
          items: {
            type: "object",
            properties: {
              type: { 
                type: "string",
                const: "mcq" 
              },
              prompt: { type: "string" },
              options: { 
                type: "array", 
                items: { type: "string" }, 
                minItems: 4, 
                maxItems: 4 
              },
              correct_index: { 
                type: "integer", 
                minimum: 0, 
                maximum: 3 
              }
            },
            required: ["type", "prompt", "options", "correct_index"],
            additionalProperties: false
          }
        }
      },
      required: ["questions"],
      additionalProperties: false
    },
    strict: true
  };

  const res = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: `Generate ${n} MCQs from the transcript. Target Bloom levels: ${DIFF2BLOOM[difficulty].join(", ")}. Only use lecture content. Output JSON only.` },
      { role: "user", content: JSON.stringify({ segments }) }
    ],
    response_format: { type: "json_schema", json_schema: jsonSchema as any }
  });

  const json = JSON.parse(res.choices[0]?.message?.content ?? "{}");
  return QuizSchema.parse(json);
}
