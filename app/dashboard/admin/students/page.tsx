import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function StudentsAdminPage() {
  const supabase = await createClient();
  const { data: students, error } = await supabase.from('students').select('*');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Administracija učenika</h1>
        <div className="flex gap-2">
          <Link 
            href="/dashboard/admin/students/assign" 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Dodijeli učenike razredu
          </Link>
          <Link 
            href="/dashboard/admin/students/class-view" 
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Pregled po razredima
          </Link>
          <Link 
            href="/dashboard/admin/students/new" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            + Dodaj novog učenika
          </Link>
        </div>
      </div>

      {error ? (
        <div className="bg-red-100 p-4 rounded text-red-700">
          Greška: {error.message}
        </div>
      ) : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border p-2">Ime</th>
              <th className="border p-2">Razred</th>
              <th className="border p-2">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {students?.map((student) => (
              <tr key={student.id}>
                <td className="border p-2">{student.full_name}</td>
                <td className="border p-2">{student.class_id}</td>
                <td className="border p-2">
                  <Link href={`/dashboard/admin/students/${student.id}/edit`} className="text-blue-600 hover:underline">
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
