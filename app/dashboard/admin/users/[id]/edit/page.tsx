'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function EditUserPage() {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;
  const supabase = createClient();

  useEffect(() => {
    async function fetchUser() {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user:', error);
      } else if (data) {
        setFullName(data.full_name);
        setRole(data.role);
      }
      setLoading(false);
    }
    fetchUser();
  }, [userId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, role: role })
      .eq('id', userId);

    if (error) {
      alert('Greška pri ažuriranju: ' + error.message);
    } else {
      router.push('/dashboard/admin/users');
    }
  };

  if (loading) return <div className="p-6">Učitavanje...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Uredi korisnika</h1>
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
          value={role} 
          onChange={(e) => setRole(e.target.value)} 
          className="border p-2 w-full" 
          required
        >
          <option value="admin">Admin</option>
          <option value="nastavnik">Nastavnik</option>
          <option value="učenik">Učenik</option>
          <option value="roditelj">Roditelj</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Spremi promjene</button>
      </form>
    </div>
  );
}
