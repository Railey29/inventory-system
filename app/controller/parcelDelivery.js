import { supabase } from "../../lib/supabaseClient";

/**
 * Insert a new item into parcel_out table
 * @param {Object} item - { item_name, date, quantity, time_out }
 */
export const addParcelOutItem = async (item) => {
  console.log("ITEM RECEIVED:", item);

  const { data, error } = await supabase
    .from("parcel_out")
    .insert([
      {
        item_name: item.item_name,
        date: item.date,
        quantity: Number(item.quantity),
        time_out: item.time_out,
      },
    ])
    .select();

  console.log("SUPABASE INSERT DATA:", data);
  console.log("SUPABASE INSERT ERROR:", error);

  if (error) return { error };
  return { data };
};

/**
 * Fetch all items from parcel_out table
 */
export const getParcelOutItems = async () => {
  const { data, error } = await supabase
    .from("parcel_out")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    console.error("Error fetching parcel out items:", error);
    return { error };
  }

  return { data };
};

/**
 * Delete a parcel_out item by id
 */
export const deleteParcelOutItem = async (id) => {
  const { data, error } = await supabase
    .from("parcel_out")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting parcel out item:", error);
    return { error };
  }

  return { data };
};

/**
 * Update a parcel_out item by id
 */
export const updateParcelOutItem = async (id, updates) => {
  const { data, error } = await supabase
    .from("parcel_out")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.error("Error updating parcel out item:", error);
    return { error };
  }

  return { data };
};
