import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

// (main) layout — обёртка для всех страниц с хедером и футером
// Исключение: /auth/* использует свой layout без навигации
export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
