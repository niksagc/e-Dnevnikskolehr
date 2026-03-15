'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function ClassSubjectsAdminPage() {
  const [data, setData] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: cs, error } = await supabase
        .from('class_subjects')
        .select('*, classes(name), subjects(name), teachers:profiles!teacher_id(full_name), substitutes:profiles!substitute_teacher_id(full_name)');
      if (cs) setData(cs);
    };
    fetchData();
  }, [supabase]);

  const remove = async (id: string) => {
    await supabase.from('class_subjects').delete().eq('id', id);
    setData(data.filter(item => item.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dodijeli predmete razredu</h1>
        <Link 
          href="/dashboard/admin/class-subjects/new" 
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Dodaj dodjelu
        </Link>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr>
            <th className="border p-2">Razred</th>
            <th className="border p-2">Predmet</th>
            <th className="border p-2">Nastavnik</th>
            <th className="border p-2">Zamjena</th>
            <th className="border p-2">Akcije</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cs) => (
            <tr key={cs.id}>
              <td className="border p-2">{cs.classes?.name}</td>
              <td className="border p-2">{cs.subjects?.name}</td>
              <td className="border p-2">{cs.teachers?.full_name}</td>
              <td className="border p-2">{cs.substitutes?.full_name || '-'}</td>
              <td className="border p-2">
                <button onClick={() => remove(cs.id)} className="text-red-600 hover:underline">Ukloni</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
