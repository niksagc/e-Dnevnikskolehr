import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function ClassDashboardPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { id } = params;

  // Dohvaćanje podataka o razredu
  const { data: classData, error: classError } = await supabase
    .from('class_departments')
    .select('*')
    .eq('id', id)
    .single();

  // Dohvaćanje učenika u tom razredu
  const { data: students, error: studentsError } = await supabase
    .from('students')
    .select('*')
    .eq('class_id', id)
    .order('last_name');

  if (classError || studentsError) {
    console.error('Error fetching class data:', classError || studentsError);
    return <div>Došlo je do pogreške pri dohvaćanju podataka o razredu.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Razred: {classData.name}</h1>
      
      <h2 className="text-xl font-semibold mb-2">Učenici u razredu</h2>
      <ul className="list-disc pl-5">
        {students.map((student) => (
          <li key={student.id}>
            {student.last_name} {student.first_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
