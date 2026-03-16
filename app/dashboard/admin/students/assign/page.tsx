'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function AssignStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [classId, setClassId] = useState('');
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch unassigned students
      const { data: s } = await supabase.from('students').select('*').is('class_id', null).order('full_name');
      if (s) setStudents(s);
      // Fetch classes
      const { data: c } = await supabase.from('class_departments').select('*').order('name');
      if (c) setClasses(c);
    };
    fetchData();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classId || selectedStudents.length === 0) return;

    const { error } = await supabase
      .from('students')
      .update({ class_id: classId })
      .in('id', selectedStudents);

    if (error) {
      alert('Greška: ' + error.message);
    } else {
      router.push('/dashboard/admin/students');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dodijeli učenike razredu</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="border p-4">
          <h2 className="font-bold mb-2">Odaberi učenike:</h2>
          {students.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={s.id}
                onChange={(e) => {
                  if (e.target.checked) setSelectedStudents([...selectedStudents, s.id]);
                  else setSelectedStudents(selectedStudents.filter(id => id !== s.id));
                }}
              />
              {s.full_name}
            </div>
          ))}
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Spremi</button>
      </form>
    </div>
  );
}
