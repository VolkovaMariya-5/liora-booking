'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function setCityPreference(city: string, country: string) {
  const store = await cookies();
  const oneYear = 60 * 60 * 24 * 365;
  store.set('preferred_city',    city,    { path: '/', maxAge: oneYear });
  store.set('preferred_country', country, { path: '/', maxAge: oneYear });
  // Сбрасываем кэш главной и каталога чтобы перерендерить с новым городом
  revalidatePath('/');
  revalidatePath('/businesses');
}
