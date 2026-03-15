'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface School {
  id: string;
  name: string;
}

export default function DashboardPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const fetchSchools = async () => {
      console.log('Dashboard: Fetching user...');
      const { data: { user } } = await supabase.auth.getUser();
      console.log('Dashboard: User:', user);
      if (!user) {
        console.log('Dashboard: No user, redirecting to /login');
        router.push('/login');
        return;
      }

      console.log('Dashboard: Fetching schools for user:', user.id);
      const { data, error } = await supabase
        .from('teacher_schools')
        .select('schools(id, name)')
        .eq('teacher_id', user.id);

      if (error) {
        console.error('Dashboard: Error fetching schools:', error);
      } else if (data) {
        console.log('Dashboard: Schools data:', data);
        const schoolList = data.map((item: any) => item.schools);
        setSchools(schoolList);
        if (schoolList.length === 1) {
          console.log('Dashboard: Redirecting to single school classes');
          router.push(`/dashboard/schools/${schoolList[0].id}/classes`);
        }
      }
      setLoading(false);
    };

    fetchSchools();
  }, [router, supabase]);

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
