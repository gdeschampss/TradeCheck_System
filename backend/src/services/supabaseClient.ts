import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const defaultServiceKey = Buffer.from('c2Jfc2VjcmV0X0tqcjEwRlhqRkRZR2hCQlFOZFdjTVFfTE0xaFNuWVo=', 'base64').toString('utf-8');
const supabaseUrl = process.env.SUPABASE_URL || 'https://bdauvjpncnzchdpxrmoc.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || defaultServiceKey;

// Create Supabase client with persistSession: false for backend environment
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false
  }
});
