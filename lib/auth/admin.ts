/**
 * Admin Utilities
 * Functions to check admin role and protect admin routes
 */

import { getSession } from './session';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

/**
 * Check if current user is an admin
 * Returns admin user info or null
 */
export async function isAdmin(): Promise<AdminUser | null> {
  const session = await getSession();
  
  if (!session) {
    return null;
  }

  const supabase = await createClient();
  
  // Get user profile with role
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('id, email, role')
    .eq('id', session.user.id)
    .single();

  if (error || !profile) {
    return null;
  }

  if (profile.role !== 'admin') {
    return null;
  }

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role as 'admin' | 'user',
  };
}

/**
 * Require admin access - redirects if not admin
 * Use in server components and API routes
 */
export async function requireAdmin(locale: string = 'en'): Promise<AdminUser> {
  const session = await getSession();
  
  // First check if user is logged in
  if (!session) {
    redirect(`/${locale}/firb-calculator?login=true`);
  }

  const supabase = await createClient();
  
  // Get user profile with role
  const { data: profile, error } = await supabase
    .from('user_profiles')
    .select('id, email, role')
    .eq('id', session.user.id)
    .single();

  // If no profile or error, redirect
  if (error || !profile) {
    console.error('Admin check failed - no profile:', error);
    redirect(`/${locale}/dashboard`);
  }

  // Check if admin
  if (profile.role !== 'admin') {
    console.log('Admin check failed - user is not admin. Role:', profile.role);
    redirect(`/${locale}/dashboard`);
  }

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role as 'admin' | 'user',
  };
}

