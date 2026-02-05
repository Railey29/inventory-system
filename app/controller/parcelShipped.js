import { supabase } from "../../lib/supabaseClient";
/**
 * Insert a new item into parcel_in table
 * @param {Object} item - { item_name, date, quantity, time_in }
 */
export const addParcelInItem = async (item) => {
  const { data, error } = await supabase
    .from("parcel_in")
    .insert([item])
    .select(); // return inserted row

  if (error) {
    console.error("Error adding parcel in item:", error);
    return { error };
  }

  return { data };
};

/**
 * Fetch all items from parcel_in table
 */
export const getParcelInItems = async () => {
  const { data, error } = await supabase
    .from("parcel_in")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching parcel in items:", error);
    return { error };
  }

  return { data };
};

/**
 * Delete a parcel_in item by id
 */
export const deleteParcelInItem = async (id) => {
  const { data, error } = await supabase
    .from("parcel_in")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting parcel in item:", error);
    return { error };
  }

  return { data };
};

/**
 * Update a parcel_in item by id
 */
export const updateParcelInItem = async (id, updates) => {
  const { data, error } = await supabase
    .from("parcel_in")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating parcel in item:", error);
    return { error };
  }

  return { data };
};
