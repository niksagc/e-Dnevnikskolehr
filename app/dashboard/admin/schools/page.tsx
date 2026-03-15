import { createClient } from '@/utils/supabase/server';

export default async function SchoolsAdminPage() {
  const supabase = await createClient();
  const { data: schools, error } = await supabase.from('schools').select('*');

  if (error) return <div>Greška pri učitavanju škola: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administracija škola</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Naziv</th>
            <th className="border p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr key={school.id}>
              <td className="border p-2">{school.name}</td>
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
