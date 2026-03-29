import supabaseAdmin from "../utils/supabaseAdmin";

export async function createActivityLog(data) {
  const payload = {
    user_id: data.userId || null,
    user_name: data.userName || "Unknown User",
    user_type: data.userType || "staff",
    action: data.action || "Unknown Action",
    module: data.module || "Unknown Module",
    details: data.details || "",
    ip_address: data.ipAddress || "",
  };

  const { data: insertedLog, error } = await supabaseAdmin
    .from("activity_logs")
    .insert([payload])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return insertedLog;
}

export async function getActivityLogs(filters = {}) {
  let query = supabaseAdmin
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters.userType && filters.userType !== "all") {
    query = query.eq("user_type", filters.userType);
  }

  if (filters.search) {
    const safeSearch = filters.search.trim();
    query = query.or(
      `user_name.ilike.%${safeSearch}%,action.ilike.%${safeSearch}%,module.ilike.%${safeSearch}%,details.ilike.%${safeSearch}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}