'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function NewUserPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('nastavnik');
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fullName, email, password, role })
    });

    const data = await response.json();

    if (data.error) {
      alert('Greška: ' + data.error);
    } else {
      router.push('/dashboard/admin/users');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Stvori novog korisnika</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ime i prezime" className="border p-2 w-full" required />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" className="border p-2 w-full" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Lozinka" className="border p-2 w-full" required />
        <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 w-full" required>
          <option value="admin">Admin</option>
          <option value="nastavnik">Nastavnik</option>
          <option value="učenik">Učenik</option>
          <option value="roditelj">Roditelj</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Stvori korisnika</button>
      </form>
    </div>
  );
}
