import { createClient } from '@/utils/supabase/server';

export default async function TeacherSubjectsAdminPage() {
  const supabase = await createClient();
  const { data: teacherSubjects, error } = await supabase
    .from('teacher_subjects')
    .select('*, profiles(full_name), subjects(name)');

  if (error) return <div>Greška pri učitavanju: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dodijeli nastavnicima predmete</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Nastavnik</th>
            <th className="border p-2">Predmet</th>
            <th className="border p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {teacherSubjects.map((ts) => (
            <tr key={ts.id}>
              <td className="border p-2">{ts.profiles?.full_name}</td>
              <td className="border p-2">{ts.subjects?.name}</td>
              <td className="border p-2">
                <button className="text-red-600">Ukloni</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
