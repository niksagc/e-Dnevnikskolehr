-- Schools
create table if not exists schools (
  id uuid default gen_random_uuid() primary key,
  name text not null
);

-- School Years
create table if not exists school_years (
  id uuid default gen_random_uuid() primary key,
  name text not null
);

-- Profiles (extending auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  email text,
  role text default 'student' -- admin, teacher, student, parent
);

-- Subjects
create table if not exists subjects (
  id uuid default gen_random_uuid() primary key,
  name text not null
);

-- Classes
create table if not exists classes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  school_id uuid references schools(id)
);

-- Students
create table if not exists students (
  id uuid default gen_random_uuid() primary key,
  full_name text not null,
  class_id uuid references classes(id)
);

-- Teacher Subjects
create table if not exists teacher_subjects (
  id uuid default gen_random_uuid() primary key,
  teacher_id uuid references profiles(id),
  subject_id uuid references subjects(id)
);

-- Class Subjects
create table if not exists class_subjects (
  id uuid default gen_random_uuid() primary key,
  class_id uuid references classes(id),
  subject_id uuid references subjects(id)
);
