import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uchxaqmwtcfcdeaicqqj.supabase.co';
const supabaseAnonKey = 'sb_publishable_01YXBNYsfSaaVZcsJA76aQ_NIeoRiRy';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);