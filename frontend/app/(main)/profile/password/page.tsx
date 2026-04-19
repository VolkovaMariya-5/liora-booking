import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PasswordForm from './PasswordForm';

// /profile/password — форма смены пароля (Phase 6)
export default async function PasswordPage() {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-heading text-3xl font-semibold mb-6">Сменить пароль</h1>
      <PasswordForm />
    </div>
  );
}
