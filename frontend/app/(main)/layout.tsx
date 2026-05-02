import { cookies } from 'next/headers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CitySelector } from '@/components/layout/CitySelector';

export const DEFAULT_CITY    = 'Усть-Каменогорск';
export const DEFAULT_COUNTRY = 'KZ';

// (main) layout — обёртка для всех страниц с хедером и футером
export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  const city    = store.get('preferred_city')?.value    ?? DEFAULT_CITY;
  const country = store.get('preferred_country')?.value ?? DEFAULT_COUNTRY;

  return (
    <>
      <Header citySelector={<CitySelector city={city} country={country} />} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
