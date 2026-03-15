import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Provjera je li korisnik admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Plavi header */}
      <header className="bg-[#0f172a] text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold tracking-tight">e-Dnevnik</div>
          <div className="flex items-center gap-6 text-sm">
            <span>{user.email}</span>
            <span className="text-gray-400">škola: Testna škola CARNet Zadar</span>
            <form action="/auth/signout" method="post">
              <button type="submit" className="hover:text-blue-300">Odjava</button>
            </form>
          </div>
        </div>
      </header>

      {/* Tabovi */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto flex">
          <Link href="/dashboard" className="px-6 py-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 border-b-2 border-transparent hover:border-blue-600">Imenik</Link>
          <Link href="/dashboard/grades" className="px-6 py-4 text-gray-600 hover:text-blue-600 hover:bg-gray-50 border-b-2 border-transparent hover:border-blue-600">Pregled rada</Link>
          {isAdmin && (
            <Link href="/dashboard/admin" className="px-6 py-4 text-gray-900 border-b-2 border-blue-600 font-medium">Administracija</Link>
          )}
        </div>
      </nav>

      <main className="container mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
