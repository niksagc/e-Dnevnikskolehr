import Link from 'next/link';

export default function AdminPage() {
  const adminLinks = [
    { name: 'Škole', href: '/dashboard/admin/schools' },
    { name: 'Školske godine', href: '/dashboard/admin/school-years' },
    { name: 'Korisnici', href: '/dashboard/admin/users' },
    { name: 'Administracija predmeta', href: '/dashboard/admin/subjects' },
    { name: 'Dodijeli nastavnicima predmete', href: '/dashboard/admin/teacher-subjects' },
    { name: 'Razredni odjeli i grupe', href: '/dashboard/admin/classes' },
    { name: 'Dodijeli predmete razredu', href: '/dashboard/admin/class-subjects' },
    { name: 'Administracija učenika', href: '/dashboard/admin/students' },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <h1 className="p-6 text-xl font-semibold border-b">Administracija</h1>
      {adminLinks.map((link) => (
        <Link
          key={link.name}
          href={link.href}
          className="flex justify-between items-center p-4 border-b hover:bg-gray-50"
        >
          {link.name}
          <span className="text-blue-600">Otvori →</span>
        </Link>
      ))}
    </div>
  );
}
