'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function TeacherSubjectsAdminPage() {
  const [data, setData] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: ts, error } = await supabase
        .from('teacher_subjects')
        .select('*, profiles(full_name), subjects(name)');
      if (ts) setData(ts);
    };
    fetchData();
  }, [supabase]);

  const remove = async (id: string) => {
    await supabase.from('teacher_subjects').delete().eq('id', id);
    setData(data.filter(item => item.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dodijeli nastavnicima predmete</h1>
        <Link 
          href="/dashboard/admin/teacher-subjects/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Dodaj dodjelu
        </Link>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Nastavnik</th>
            <th className="border p-2">Predmet</th>
            <th className="border p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {data.map((ts) => (
            <tr key={ts.id}>
              <td className="border p-2">{ts.profiles?.full_name}</td>
              <td className="border p-2">{ts.subjects?.name}</td>
              <td className="border p-2">
                <button onClick={() => remove(ts.id)} className="text-red-600 hover:underline">Ukloni</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
