import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hlzndfrjsiipcpaselvv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsem5kZnJqc2lpcGNwYXNlbHZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3NzkwNDIsImV4cCI6MjA4ODM1NTA0Mn0.Z_to8BHZLtnMphXe-e0hL_fUCukHoGEBNSDdR-usoNU';

export const supabase = createClient(supabaseUrl, supabaseKey);
