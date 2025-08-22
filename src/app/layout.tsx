import "./globals.css";
export const metadata = { title: "AI Lecture → Quiz (Whisper)", description: "Record → Summarize → Quiz → Share link" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
