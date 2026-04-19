import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileEditForm from './ProfileEditForm';

// Загружаем текущий профиль для заполнения формы
async function fetchProfile(token: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// /profile/edit — форма редактирования профиля (Phase 6)
export default async function ProfileEditPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  const profile = await fetchProfile(session.accessToken as string);
  if (!profile) redirect('/profile');

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-3xl font-semibold mb-6">Редактировать профиль</h1>
      <ProfileEditForm initialData={profile} />
    </div>
  );
}
