import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from '@/components/ui/sonner';
import './globals.css';

// Cormorant Garamond — брендовый шрифт для заголовков и логотипа Liora
const cormorant = Cormorant_Garamond({
  variable: '--font-heading',
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
});

// Inter — основной UI шрифт для текста, форм, кнопок
const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'Liora — онлайн-запись в салоны',
  description: 'Запишитесь к мастеру в несколько кликов. Барбершопы, салоны красоты, nail-студии.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* SessionProvider делает хук useSession() доступным во всех Client Components */}
        <SessionProvider>
          {children}
          {/* Toaster — глобальный компонент для toast-уведомлений через sonner */}
          <Toaster position="top-right" richColors />
        </SessionProvider>
      </body>
    </html>
  );
}
