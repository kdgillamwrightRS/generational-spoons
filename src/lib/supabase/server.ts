import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client (uses service role or anon key server-side)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

// Create typed Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
