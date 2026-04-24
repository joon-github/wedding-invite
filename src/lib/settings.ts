import { supabase } from "./supabase";

export async function isFeatureEnabled(key: string): Promise<boolean> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single();

  if (!data) return true;
  return data.value === true || data.value === "true";
}
