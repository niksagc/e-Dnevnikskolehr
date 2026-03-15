import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { id } = await params;

  // Dohvaćanje podataka o učeniku
  const { data: student, error: studentError } = await supabase
    .from('students')
    .select('*, class_departments(name)')
    .eq('id', id)
    .single();

  // Dohvaćanje ocjena za učenika
  const { data: grades, error: gradesError } = await supabase
    .from('grades')
    .select('*')
    .eq('student_id', id)
    .order('created_at', { ascending: false });

  if (studentError || gradesError) {
    console.error('Error fetching student data:', studentError || gradesError);
    return <div>Došlo je do pogreške pri dohvaćanju podataka.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{student.first_name} {student.last_name}</h1>
      <p className="text-gray-600 mb-6">Razred: {student.class_departments?.name}</p>

      <h2 className="text-xl font-semibold mb-4">Ocjene</h2>
      {grades && grades.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Predmet</th>
              <th className="py-2 px-4 border-b">Ocjena</th>
              <th className="py-2 px-4 border-b">Bilješka</th>
              <th className="py-2 px-4 border-b">Datum</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((grade) => (
              <tr key={grade.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{grade.subject}</td>
                <td className="py-2 px-4 border-b font-bold">{grade.grade}</td>
                <td className="py-2 px-4 border-b">{grade.note}</td>
                <td className="py-2 px-4 border-b">
                  {new Date(grade.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Nema unesenih ocjena za ovog učenika.</p>
      )}
    </div>
  );
}
