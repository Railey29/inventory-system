import axios from "axios";

// Fetch all parcel-out items
export const fetchParcelOutItems = async () => {
  try {
    const res = await axios.get("/api/parcelDelivery");
    return res.data.map((item) => ({
      id: item.id,
      name: item.item_name,
      date: item.date,
      quantity: item.quantity,
      timeOut: item.time_out,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
};

// Add a new parcel-out item
export const addParcelOutItemHelper = async ({
  item_name,
  date,
  quantity,
  time_out,
}) => {
  try {
    const res = await axios.post("/api/parcelDelivery", {
      item_name,
      date,
      quantity,
      time_out,
    });
    const data = res.data;
    return {
      id: data.id,
      name: data.item_name,
      date: data.date,
      quantity: data.quantity,
      timeOut: data.time_out,
    };
  } catch (err) {
    console.error(err.response?.data || err.message);
    return null;
  }
};
