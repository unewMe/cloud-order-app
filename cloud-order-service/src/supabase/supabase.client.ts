// src/supabase/supabase.client.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Brakuje zmiennych środowiskowych SUPABASE_URL lub SUPABASE_ANON_KEY w pliku .env');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  { db: { schema: 'order_service' } },
);
