import { createClient } from '@/utils/supabase/server';

export default async function ClassesAdminPage() {
  const supabase = await createClient();
  const { data: classes, error } = await supabase.from('classes').select('*, schools(name)');

  if (error) return <div>Greška pri učitavanju razreda: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administracija razreda</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Naziv</th>
            <th className="border p-2">Škola</th>
            <th className="border p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((c) => (
            <tr key={c.id}>
              <td className="border p-2">{c.name}</td>
              <td className="border p-2">{c.schools?.name}</td>
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
