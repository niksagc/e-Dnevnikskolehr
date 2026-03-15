'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface School {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchSchools = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('teacher_schools')
        .select('schools(id, name)')
        .eq('teacher_id', user.id);

      if (error) {
        console.error('Error fetching schools:', error);
      } else if (data) {
        const schoolList = data.map((item: any) => item.schools);
        setSchools(schoolList);
        if (schoolList.length === 1) {
          router.push(`/dashboard/schools/${schoolList[0].id}/classes`);
        }
      }
      setLoading(false);
    };

    fetchSchools();
  }, [router]);

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Odaberite školu</h1>
      <div className="grid gap-4">
        {schools.map((school) => (
          <button
            key={school.id}
            onClick={() => router.push(`/dashboard/schools/${school.id}/classes`)}
            className="rounded-lg border p-4 text-left hover:bg-gray-50"
          >
            {school.name}
          </button>
        ))}
      </div>
    </div>
  );
}
