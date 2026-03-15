import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function StudentsPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Dohvaćanje učenika za razrede koje nastavnik vodi
  const { data: students, error } = await supabase
    .from('students')
    .select(`
      *,
      class_departments (
        name
      )
    `)
    .order('last_name');

  if (error) {
    console.error('Error fetching students:', error);
    return <div>Došlo je do pogreške pri dohvaćanju učenika.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Imenik učenika</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Prezime</th>
            <th className="py-2 px-4 border-b">Ime</th>
            <th className="py-2 px-4 border-b">Razred</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{student.last_name}</td>
              <td className="py-2 px-4 border-b">{student.first_name}</td>
              <td className="py-2 px-4 border-b">{student.class_departments?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
