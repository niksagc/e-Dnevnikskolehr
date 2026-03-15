import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export default async function NewGradePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Dohvaćanje učenika za padajući izbornik
  const { data: students } = await supabase
    .from('students')
    .select('id, first_name, last_name')
    .order('last_name');

  async function addGrade(formData: FormData) {
    'use server';
    const supabase = await createClient();
    
    const student_id = formData.get('student_id');
    const subject = formData.get('subject');
    const grade = formData.get('grade');
    const note = formData.get('note');

    const { error } = await supabase.from('grades').insert([
      { student_id, subject, grade: Number(grade), note }
    ]);

    if (error) {
      console.error('Error inserting grade:', error);
      return;
    }

    revalidatePath('/dashboard/students');
    redirect('/dashboard/students');
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Unos nove ocjene</h1>
      <form action={addGrade} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Učenik</label>
          <select name="student_id" required className="w-full border p-2 rounded">
            {students?.map((s) => (
              <option key={s.id} value={s.id}>
                {s.last_name} {s.first_name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Predmet</label>
          <input name="subject" required className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Ocjena</label>
          <select name="grade" required className="w-full border p-2 rounded">
            {[1, 2, 3, 4, 5].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Bilješka (opcionalno)</label>
          <textarea name="note" className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Spremi ocjenu
        </button>
      </form>
    </div>
  );
}
