// src/lib/supabase.js
// Replace VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── HELPER: generate 6-char join code ───────────────────────────────────────
export function generateJoinCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

// ─── HELPER: generate UUID ───────────────────────────────────────────────────
export function generateId() {
  return crypto.randomUUID();
}
