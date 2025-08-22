# AI Lecture → Quiz (Whisper Edition)

This starter uses **OpenAI Whisper** for transcription (via `whisper-1`), **GPT (Responses API)** for summaries and quiz generation, and hosts quizzes **natively** at `/q/:slug`.

## Stack
- Next.js (App Router)
- Prisma + Postgres
- OpenAI Whisper (`whisper-1`) for STT (response_format: verbose_json for segments)
- OpenAI GPT (gpt-4o) for summary + quiz (JSON schema)

## Quick Start
1) Install deps
```bash
pnpm i  # or npm i / yarn
```
2) Env
```bash
cp .env.example .env
# set OPENAI_API_KEY, DATABASE_URL, NEXT_PUBLIC_BASE_URL
```
3) DB
```bash
pnpm prisma:migrate
```
4) Dev
```bash
pnpm dev
```

Open http://localhost:3000, upload an audio file (`.webm` from browser mic is fine). The server will:
- transcribe with Whisper,
- summarize with GPT,
- generate an MCQ quiz,
- publish a public slug (student link).

## Notes
- `src/lib/stt.ts` wraps Whisper and maps `segments` (start/end/text) for downstream prompts.
- If you prefer the newest STT, you can swap Whisper for **gpt-4o-transcribe** with minimal changes in `stt.ts`.
- For long lectures, move processing to a background job (BullMQ/Upstash).

## ENV
- `OPENAI_API_KEY` — used for both Whisper & GPT calls.
- `DATABASE_URL` — Postgres URL.
- `NEXT_PUBLIC_BASE_URL` — e.g., http://localhost:3000

## Next steps
- Instructor dashboard, timers, option shuffling, CSV export, LMS push.
