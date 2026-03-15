'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function NewTeacherSubjectPage() {
  const [teacherId, setTeacherId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data: t } = await supabase.from('profiles').select('*').in('role', ['nastavnik', 'razrednik', 'zamjenik_razrednika', 'admin']);
      if (t) setTeachers(t);
      const { data: s } = await supabase.from('subjects').select('*');
      if (s) setSubjects(s);
    };
    fetch();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('teacher_subjects').insert({ teacher_id: teacherId, subject_id: subjectId });
    if (error) {
      alert('Greška: ' + error.message);
    } else {
      router.push('/dashboard/admin/teacher-subjects');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dodijeli predmet nastavniku</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="border p-2 w-full" required>
          <option value="">Odaberi nastavnika</option>
          {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
        </select>
        <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="border p-2 w-full" required>
          <option value="">Odaberi predmet</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Spremi</button>
      </form>
    </div>
  );
}
