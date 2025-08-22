import OpenAI from "openai";

export type Transcript = { segments: { t0: number; t1: number; text: string }[] };

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Transcribe an audio buffer using OpenAI Whisper API.
 * Returns segments with start/end (seconds) and text.
 * We request `verbose_json` so we can map segment timestamps.
 */
export async function transcribeBuffer(buf: Buffer, mime: string = "audio/webm"): Promise<Transcript> {
  // Convert Buffer to Uint8Array for File constructor compatibility
  const uint8Array = new Uint8Array(buf);
  const file = new File([uint8Array], `audio.${mime.includes("wav") ? "wav" : "webm"}`, { type: mime });

  const tr = await client.audio.transcriptions.create({
    file,
    model: "whisper-1",
    response_format: "verbose_json"
  }) as any;

  // Map Whisper segments -> our format
  const segments = (tr.segments ?? []).map((s: any) => ({
    t0: Number(s.start ?? 0),
    t1: Number(s.end ?? 0),
    text: String(s.text ?? "").trim()
  }));

  // Fallback: if no segments, return one block
  if (!segments.length && tr.text) {
    return { segments: [{ t0: 0, t1: Number(tr.duration ?? 0) || 0, text: String(tr.text).trim() }] };
  }
  return { segments };
}
