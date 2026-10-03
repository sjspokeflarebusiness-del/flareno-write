const SUPABASE_URL = "https://ywlytcsnhatnwdmmjvtv.supabase.co";

/*
  In Supabase: Project Settings → API Keys.
  Copy the anon/public key, NOT the service_role key.
*/
const SUPABASE_ANON_KEY = "sb_publishable_J6NluhVQ4zx4_ji2kUj4SA_ltFOys3C";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
