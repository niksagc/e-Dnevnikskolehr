'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function ClassViewPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classId, setClassId] = useState('');
  const supabase = createClient();

  useEffect(() => {
    const fetchClasses = async () => {
      const { data } = await supabase.from('class_departments').select('*').order('name');
      if (data) setClasses(data);
    };
    fetchClasses();
  }, [supabase]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (!classId) {
        setStudents([]);
        return;
      }
      const { data } = await supabase
        .from('students')
        .select('*')
        .eq('class_id', classId)
        .order('full_name');
      if (data) setStudents(data);
    };
    fetchStudents();
  }, [classId, supabase]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Pregled učenika po razredu</h1>
      <select
        value={classId}
        onChange={(e) => setClassId(e.target.value)}
        className="border p-2 w-full mb-4"
      >
        <option value="">Odaberi razred</option>
        {classes.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>
      
      {classId && (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="border p-2">Redni broj</th>
              <th className="border p-2">Ime i prezime</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={student.id}>
                <td className="border p-2">{index + 1}.</td>
                <td className="border p-2">{student.full_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
