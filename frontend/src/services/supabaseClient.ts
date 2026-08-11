import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bdauvjpncnzchdpxrmoc.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_KP8jgM8qWLHDaJj5EnoxeQ_VRqOsSye';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
