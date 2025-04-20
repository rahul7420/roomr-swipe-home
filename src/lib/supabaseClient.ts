
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Using explicit URL and key to avoid any environment variable issues
const SUPABASE_URL = "https://nkwhitfyzfhnscwnzuvf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rd2hpdGZ5emZobnNjd256dXZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNTkzMTMsImV4cCI6MjA2MDczNTMxM30.os1exrMEuTuegVPRXQXX4pYEiUv3JNN7134TLomIrrQ";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// For debugging
console.log('Supabase client initialized with URL:', SUPABASE_URL);
