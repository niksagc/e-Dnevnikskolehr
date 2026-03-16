import { createClient } from '@/utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function POST() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Greška pri odjavi:', error);
    // Možda ovdje dodati neku obavijest o grešci
  }

  revalidatePath('/', 'layout');
  redirect('/login');
}
