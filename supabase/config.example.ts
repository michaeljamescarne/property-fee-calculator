/**
 * Supabase Configuration Example
 * 
 * To use this:
 * 1. Copy this file to lib/supabase.ts
 * 2. Create .env.local with your Supabase credentials
 * 3. Install: npm install @supabase/supabase-js
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client (use in components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (use in API routes with service role key)
export function createServerSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY not set');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

