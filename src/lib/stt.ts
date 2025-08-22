import OpenAI from "openai";

export type Transcript = { segments: { t0: number; t1: number; text: string }[] };

function getOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }
  return new OpenAI({ apiKey });
}

/**
 * Transcribe an audio buffer using OpenAI Whisper API.
 * Returns segments with start/end (seconds) and text.
 * We request `verbose_json` so we can map segment timestamps.
 */
export async function transcribeBuffer(buf: Buffer, mime: string = "audio/webm", fileName?: string): Promise<Transcript> {
  const client = getOpenAIClient();
  
  // Convert Buffer to Uint8Array for File constructor compatibility
  const uint8Array = new Uint8Array(buf);
  
  // Determine file extension for proper naming
  let fileExtension = "webm";
  if (fileName) {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext) fileExtension = ext;
  } else if (mime.includes("wav")) {
    fileExtension = "wav";
  } else if (mime.includes("mp3")) {
    fileExtension = "mp3";
  } else if (mime.includes("mp4")) {
    fileExtension = "mp4";
  } else if (mime.includes("ogg")) {
    fileExtension = "ogg";
  }
  
  const file = new File([uint8Array], `audio.${fileExtension}`, { type: mime });

  try {
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
  } catch (error: any) {
    // Provide more helpful error messages
    if (error.message?.includes('Invalid file format')) {
      throw new Error(`Invalid audio file format. Please upload one of these supported formats: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm`);
    }
    throw error;
  }
}
