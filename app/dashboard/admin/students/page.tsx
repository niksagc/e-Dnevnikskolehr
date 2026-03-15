import { createClient } from '@/utils/supabase/server';

export default async function StudentsAdminPage() {
  const supabase = await createClient();
  const { data: students, error } = await supabase.from('students').select('*, classes(name)');

  if (error) return <div>Greška pri učitavanju učenika: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administracija učenika</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Ime</th>
            <th className="border p-2">Razred</th>
            <th className="border p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id}>
              <td className="border p-2">{student.full_name}</td>
              <td className="border p-2">{student.classes?.name}</td>
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
