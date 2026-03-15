'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function NewClassPage() {
  const [name, setName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchSchools = async () => {
      const { data } = await supabase.from('schools').select('*');
      if (data) setSchools(data);
    };
    fetchSchools();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('classes').insert({ name, school_id: schoolId });
    if (error) {
      alert('Greška: ' + error.message);
    } else {
      router.push('/dashboard/admin/classes');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dodaj novi razred</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Naziv razreda"
          className="border p-2 w-full"
          required
        />
        <select
          value={schoolId}
          onChange={(e) => setSchoolId(e.target.value)}
          className="border p-2 w-full"
          required
        >
          <option value="">Odaberi školu</option>
          {schools.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Spremi
        </button>
      </form>
    </div>
  );
}
