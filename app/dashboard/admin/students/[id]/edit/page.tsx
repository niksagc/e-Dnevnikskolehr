'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function EditStudentPage() {
  const [fullName, setFullName] = useState('');
  const [classId, setClassId] = useState('');
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data: classesData } = await supabase.from('classes').select('*');
      if (classesData) setClasses(classesData);

      const { data, error } = await supabase.from('students').select('*').eq('id', id).single();
      if (error) {
        alert('Greška: ' + error.message);
      } else {
        setFullName(data.full_name);
        setClassId(data.class_id);
        setLoading(false);
      }
    };
    fetch();
  }, [id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('students').update({ full_name: fullName, class_id: classId }).eq('id', id);
    if (error) {
      alert('Greška: ' + error.message);
    } else {
      router.push('/dashboard/admin/students');
    }
  };

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Uredi učenika</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <select
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          className="border p-2 w-full"
          required
        >
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Spremi promjene
        </button>
      </form>
    </div>
  );
}
