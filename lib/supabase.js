import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gdoffbtktehcbgfjyajv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdkb2ZmYnRrdGVoY2JnZmp5YWp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0OTAwMjksImV4cCI6MjA2MjA2NjAyOX0._7PGUTyPQngWE-nIud0RbdGdUs1ZoGr5h97COYow1Rg'; // Thay bằng Anon Key
export const supabase = createClient(supabaseUrl, supabaseKey);