'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function NewClassSubjectPage() {
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [substituteId, setSubstituteId] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data: c } = await supabase.from('classes').select('*');
      if (c) setClasses(c);
      const { data: s } = await supabase.from('subjects').select('*');
      if (s) setSubjects(s);
      const { data: t } = await supabase.from('profiles').select('*').eq('role', 'nastavnik');
      if (t) setTeachers(t);
    };
    fetch();
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Inserting:', { 
      class_id: classId || null, 
      subject_id: subjectId || null,
      teacher_id: teacherId || null,
      substitute_teacher_id: substituteId || null
    });
    const { error } = await supabase.from('class_subjects').insert({ 
      class_id: classId || null, 
      subject_id: subjectId || null,
      teacher_id: teacherId || null,
      substitute_teacher_id: substituteId || null
    });
    if (error) {
      alert('Greška: ' + error.message);
    } else {
      router.push('/dashboard/admin/class-subjects');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dodijeli predmet razredu</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="border p-2 w-full" required>
          <option value="">Odaberi razred</option>
          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={subjectId} onChange={(e) => setSubjectId(e.target.value)} className="border p-2 w-full" required>
          <option value="">Odaberi predmet</option>
          {subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={teacherId} onChange={(e) => setTeacherId(e.target.value)} className="border p-2 w-full" required>
          <option value="">Odaberi nastavnika</option>
          {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
        </select>
        <select value={substituteId} onChange={(e) => setSubstituteId(e.target.value)} className="border p-2 w-full">
          <option value="">Odaberi zamjenu (opcionalno)</option>
          {teachers.map((t) => <option key={t.id} value={t.id}>{t.full_name}</option>)}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Spremi</button>
      </form>
    </div>
  );
}
