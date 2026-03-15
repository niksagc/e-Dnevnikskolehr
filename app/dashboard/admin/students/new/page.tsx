'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function NewStudentPage() {
  const [fullName, setFullName] = useState('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase.from('classes').select('*');
      if (data) setClasses(data);
    };
    fetchClasses();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('students').insert({ full_name: fullName, class_id: classId });
    if (error) {
      alert('Greška: ' + error.message);
    } else {
      router.push('/dashboard/admin/students');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dodaj novog učenika</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Ime i prezime"
          className="border p-2 w-full"
          required
        />
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Odaberi razred</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Spremi
        </button>
      </form>
    </div>
  );
}
