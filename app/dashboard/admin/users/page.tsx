import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function UsersAdminPage() {
  const supabase = await createClient();
  const { data: users, error } = await supabase.from('profiles').select('*');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administracija korisnika</h1>
        <Link 
          href="/dashboard/admin/users/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Stvori korisnika
        </Link>
      </div>

      {error ? (
        <div className="bg-red-100 p-4 rounded text-red-700">
          Greška: {error.message}
        </div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border p-2">Ime</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Uloga</th>
              <th className="border p-2">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((user) => (
              <tr key={user.id}>
                <td className="border p-2">{user.full_name}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.role}</td>
                <td className="border p-2">
                  <Link href={`/dashboard/admin/users/${user.id}/edit`} className="text-blue-600 hover:underline">
                    Uredi
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
