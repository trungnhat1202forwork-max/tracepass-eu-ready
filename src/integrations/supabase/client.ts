import { createClient } from "@supabase/supabase-js";

/**
 * Prototype demo-only client.
 * Dự án demo dùng Supabase project external do người dùng cung cấp.
 * Publishable key được phép để ở client. KHÔNG lưu dữ liệu nhạy cảm thật ở đây.
 */
const SUPABASE_URL =
  (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) ??
  "https://xrdqezvcgarzafxosksr.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  (import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string | undefined) ??
  "sb_publishable_HNkhUcCBOCtQt7LMil9CYw_0FQyniDd";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});
