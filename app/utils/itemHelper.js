// utils/itemHelper.js

/**
 * Creates a new item object
 * @param {string} name - Item name
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {string} hour - Hour (1-12)
 * @param {string} minute - Minute (00-59)
 * @param {string} ampm - AM or PM
 * @param {string} type - "in" or "out"
 * @returns {object} New item object with id
 */
export function createItem(name, date, hour, minute, ampm, type) {
  if (!name || !date || !hour || !minute || !ampm) return null;

  const timeString = `${hour}:${minute} ${ampm}`;

  if (type === "in") {
    return {
      id: Date.now(),
      name,
      date,
      timeIn: timeString,
    };
  } else {
    return {
      id: Date.now(),
      name,
      date,
      timeOut: timeString,
    };
  }
}
