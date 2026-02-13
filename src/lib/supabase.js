import { createClient } from '@supabase/supabase-js'

// ============================================================
// 🔧 CONFIGURATION SUPABASE
// ============================================================
// 1. Va sur https://supabase.com et crée un projet gratuit
// 2. Dans Settings > API, copie ton URL et ta clé anon
// 3. Remplace les valeurs ci-dessous
// ============================================================

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
