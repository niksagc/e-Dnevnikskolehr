import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function ClassesAdminPage() {
  const supabase = await createClient();
  const { data: classes, error } = await supabase.from('classes').select(`
    *, 
    razrednik:profiles!classes_razrednik_id_fkey(full_name),
    zamjenik:profiles!classes_zamjenik_razrednika_id_fkey(full_name)
  `);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administracija razreda</h1>
        <Link 
          href="/dashboard/admin/classes/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Dodaj novi razred
        </Link>
      </div>

      {error ? (
        <div className="bg-red-100 p-4 rounded text-red-700">
          Greška: {error.message}
        </div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border p-2">Ime razreda</th>
              <th className="border p-2">Razrednik, Zamjenik razrednika</th>
              <th className="border p-2">Godina</th>
              <th className="border p-2">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {classes?.map((c) => (
              <tr key={c.id}>
                <td className="border p-2">{c.name}</td>
                <td className="border p-2">
                  {c.razrednik?.full_name || 'Nije dodijeljen'}, {c.zamjenik?.full_name || 'Nije dodijeljen'}
                </td>
                <td className="border p-2">{c.godina}. razred srednje škole</td>
                <td className="border p-2">
                  <Link href={`/dashboard/admin/classes/${c.id}/edit`} className="text-blue-600 hover:underline">
                    Uredi
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
