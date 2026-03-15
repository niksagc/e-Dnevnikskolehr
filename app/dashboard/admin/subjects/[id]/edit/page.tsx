'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function EditSubjectPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase.from('subjects').select('*').eq('id', id).single();
      if (error) {
        alert('Greška: ' + error.message);
      } else {
        setName(data.name);
        setLoading(false);
      }
    };
    fetch();
  }, [id, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('subjects').update({ name }).eq('id', id);
    if (error) {
      alert('Greška: ' + error.message);
    } else {
      router.push('/dashboard/admin/subjects');
    }
  };

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Uredi predmet</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Spremi promjene
        </button>
      </form>
    </div>
  );
}
