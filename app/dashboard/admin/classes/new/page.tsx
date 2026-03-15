'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function NewClassPage() {
  const [name, setName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [razrednikId, setRazrednikId] = useState('');
  const [zamjenikId, setZamjenikId] = useState('');
  const [godina, setGodina] = useState('');
  const [schools, setSchools] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      const { data: s } = await supabase.from('schools').select('*');
      if (s) setSchools(s);
      const { data: t } = await supabase.from('profiles').select('*').eq('role', 'teacher');
      if (t) setTeachers(t);
    };
    fetchData();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Assuming the columns exist, if not, this will fail.
    const { error } = await supabase.from('classes').insert({ 
      name, 
      school_id: schoolId,
      razrednik_id: razrednikId,
      zamjenik_razrednika_id: zamjenikId,
      godina: godina
    });
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
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Naziv razreda" className="border p-2 w-full" required />
        <select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} className="border p-2 w-full" required>
          <option value="">Odaberi školu</option>
          {schools.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={razrednikId} onChange={(e) => setRazrednikId(e.target.value)} className="border p-2 w-full" required>
          <option value="">Odaberi razrednika</option>
          {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
        </select>
        <select value={zamjenikId} onChange={(e) => setZamjenikId(e.target.value)} className="border p-2 w-full" required>
          <option value="">Odaberi zamjenika razrednika</option>
          {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
        </select>
        <select value={godina} onChange={(e) => setGodina(e.target.value)} className="border p-2 w-full" required>
          <option value="">Odaberi godinu</option>
          <option value="1">1. razred srednje škole</option>
          <option value="2">2. razred srednje škole</option>
          <option value="3">3. razred srednje škole</option>
          <option value="4">4. razred srednje škole</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Spremi</button>
      </form>
    </div>
  );
}
