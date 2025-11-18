import { createClient } from '@supabase/supabase-js';
// get the environment variables stored in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// throw an error if the keys are missing
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Did you set them in .env.local?');
}

// create the single, reusable client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
