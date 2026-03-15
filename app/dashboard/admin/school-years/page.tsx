import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function SchoolYearsAdminPage() {
  const supabase = await createClient();
  const { data: schoolYears, error } = await supabase.from('school_years').select('*');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administracija školskih godina</h1>
        <Link 
          href="/dashboard/admin/school-years/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Dodaj novu godinu
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
              <th className="border p-2">Naziv</th>
              <th className="border p-2">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {schoolYears?.map((sy) => (
              <tr key={sy.id}>
                <td className="border p-2">{sy.name}</td>
                <td className="border p-2">
                  <Link href={`/dashboard/admin/school-years/${sy.id}/edit`} className="text-blue-600 hover:underline">
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
