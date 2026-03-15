'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams } from 'next/navigation';

interface ClassDepartment {
  id: string;
  name: string;
  role: string;
}

export default function ClassSelectionPage() {
  const { schoolId } = useParams();
  const [classes, setClasses] = useState<ClassDepartment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClasses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('class_departments')
        .select(`
          id,
          name,
          teacher_class_roles!inner(role, teacher_id)
        `)
        .eq('school_id', schoolId)
        .eq('teacher_class_roles.teacher_id', user.id);

      if (error) {
        console.error('Error fetching classes:', error);
      } else if (data) {
        const classList = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          role: item.teacher_class_roles[0].role,
        }));
        setClasses(classList);
      }
      setLoading(false);
    };

    fetchClasses();
  }, [schoolId]);

  if (loading) return <div>Učitavanje...</div>;

  return (
    <div className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Odaberite razred</h1>
      <div className="grid gap-4">
        {classes.map((cls) => (
          <div
            key={cls.id}
            className={`rounded-lg border p-4 ${
              cls.role === 'razrednik' ? 'bg-green-100' : 
              cls.role === 'zamjenik_razrednika' ? 'bg-orange-100' : 'bg-white'
            }`}
          >
            <h2 className="text-lg font-semibold">{cls.name}</h2>
            <p className="text-sm text-gray-600">Uloga: {cls.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
