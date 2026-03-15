import { createClient } from '@/utils/supabase/server';

export default async function UsersAdminPage() {
  const supabase = await createClient();
  const { data: users, error } = await supabase.from('profiles').select('*');

  if (error) return <div>Greška pri učitavanju korisnika: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administracija korisnika</h1>
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
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.full_name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">{user.role}</td>
              <td className="border p-2">
                <button className="text-blue-600">Uredi</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
