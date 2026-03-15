import { createClient } from '@/utils/supabase/server';

export default async function ClassSubjectsAdminPage() {
  const supabase = await createClient();
  const { data: classSubjects, error } = await supabase
    .from('class_subjects')
    .select('*, classes(name), subjects(name)');

  if (error) return <div>Greška pri učitavanju: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dodijeli predmete razredu</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Razred</th>
            <th className="border p-2">Predmet</th>
            <th className="border p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {classSubjects.map((cs) => (
            <tr key={cs.id}>
              <td className="border p-2">{cs.classes?.name}</td>
              <td className="border p-2">{cs.subjects?.name}</td>
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
