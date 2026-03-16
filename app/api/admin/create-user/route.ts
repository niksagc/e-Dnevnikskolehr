import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { fullName, email, password, role } = await request.json();

  // Create service role client
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // 1. Create auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role }
  });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }

  // 2. Create profile record
  if (authData.user) {
    const { error: profileError } = await supabaseAdmin.from('profiles').insert({
      id: authData.user.id,
      full_name: fullName,
      email,
      role
    });

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 400 });
    }

    // 3. If role is 'učenik', create student record
    if (role === 'učenik') {
      await supabaseAdmin.from('students').insert({
        id: authData.user.id,
        full_name: fullName
      });
    }
  }

  return NextResponse.json({ success: true });
}
