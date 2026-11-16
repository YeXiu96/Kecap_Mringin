-- =======================================================
-- CODELAB 5: SCHEMA DATABASE & ROW LEVEL SECURITY (RLS)
-- Jalankan skrip ini di SQL Editor pada Dashboard Supabase
-- =======================================================

-- 1. Buat tabel missions
CREATE TABLE IF NOT EXISTS missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL DEFAULT auth.uid(),
  title TEXT NOT NULL,
  reward_points INTEGER DEFAULT 100,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Aktifkan Row Level Security (RLS)
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;

-- 3. Kebijakan akses data khusus per user (Auth UID)
CREATE POLICY "Operatives can view their own missions"
ON missions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Operatives can insert their own missions"
ON missions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Operatives can update their own missions"
ON missions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Operatives can delete their own missions"
ON missions FOR DELETE USING (auth.uid() = user_id);
