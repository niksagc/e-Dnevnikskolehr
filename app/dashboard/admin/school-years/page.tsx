import { createClient } from '@/utils/supabase/server';

export default async function SchoolYearsAdminPage() {
  const supabase = await createClient();
  const { data: schoolYears, error } = await supabase.from('school_years').select('*');

  if (error) return <div>Greška pri učitavanju školskih godina: {error.message}</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Administracija školskih godina</h1>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Naziv</th>
            <th className="border p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {schoolYears.map((year) => (
            <tr key={year.id}>
              <td className="border p-2">{year.name}</td>
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
