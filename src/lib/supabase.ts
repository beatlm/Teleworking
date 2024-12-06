import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eraqeukkrdzisvpaxbiz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVyYXFldWtrcmR6aXN2cGF4Yml6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0OTYxMDYsImV4cCI6MjA0OTA3MjEwNn0.4H9klDS5mxhI-pHsMM9MvSeMPit5yBTSouBPVuKmAzk';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type DayStatusRecord = {
  id: string;
  date: string;
  status: string;
  created_at: string;
  updated_at: string;
};