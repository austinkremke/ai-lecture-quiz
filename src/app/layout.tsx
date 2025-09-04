import { Barlow } from 'next/font/google'
import "./globals.css";
import { AuthProvider } from './providers';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-barlow',
})

export const metadata = { title: "AI Lecture → Quiz (Whisper)", description: "Record → Summarize → Quiz → Share link" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={barlow.variable}>
      <body className={barlow.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
