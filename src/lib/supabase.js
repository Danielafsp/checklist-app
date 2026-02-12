import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aargotnpszhrsbradkiv.supabase.co";
const supabaseAnonKey = "sb_publishable_PcoRTC_1LiM4WvyS6zSv3Q_T1IyDQLr";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
