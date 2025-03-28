
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://wgvwsvdsivckgssyszsy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndndndzdmRzaXZja2dzc3lzenN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNDgzNjAsImV4cCI6MjA1ODYyNDM2MH0.3ylZqOm9PV8Oq3UYPex1Pv-osVPUKXTeow-iG0pxBAc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    detectSessionInUrl: true,
    flowType: 'pkce',
  }
});
