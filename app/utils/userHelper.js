/**
 * Extract and format display name from email or use provided display name
 * @param {string} displayName - User's display name from metadata
 * @param {string} userEmail - User's email address
 * @returns {string} Formatted display name
 *
 * @example
 * getDisplayName(null, "railey.pacheco099@gmail.com") // Returns "Railey Pacheco"
 * getDisplayName("John Doe", "john@example.com") // Returns "John Doe"
 */
export const getDisplayName = (displayName, userEmail) => {
  // Return display name if available
  if (displayName) return displayName;

  // Extract name from email if available
  if (userEmail) {
    // Extract name before @ symbol
    const emailName = userEmail.split("@")[0];

    // Convert to readable format (remove dots, numbers, capitalize)
    // Example: "railey.pacheco099" → "Railey Pacheco"
    const formattedName = emailName
      .replace(/[0-9]/g, "") // Remove numbers
      .replace(/[._-]/g, " ") // Replace dots, underscores, dashes with space
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
      .trim();

    return formattedName || emailName; // Fallback to original if empty
  }

  // Default fallback
  return "User";
};

/**
 * Get the first letter of display name for avatar
 * @param {string} displayName - User's display name
 * @param {string} userEmail - User's email address (fallback)
 * @returns {string} First letter in uppercase
 *
 * @example
 * getAvatarLetter("Railey Pacheco", "railey@gmail.com") // Returns "R"
 * getAvatarLetter(null, "john@example.com") // Returns "J"
 */
export const getAvatarLetter = (displayName, userEmail) => {
  const name = getDisplayName(displayName, userEmail);
  return name.charAt(0).toUpperCase();
};
