import { createClient } from '@/utils/supabase/server';

export default async function SubjectsAdminPage() {
  const supabase = await createClient();
  const { data: subjects, error } = await supabase.from('subjects').select('*');

  if (error) return <div>Greška pri učitavanju predmeta: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administracija predmeta</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Naziv</th>
            <th className="border p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {subjects.map((subject) => (
            <tr key={subject.id}>
              <td className="border p-2">{subject.name}</td>
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
