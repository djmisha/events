/**
 * Cookie utility functions for managing user location preferences
 */

/**
 * Delete a cookie by name
 * @param {string} name - Cookie name
 */
export const deleteCookie = (name) => {
  try {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
  } catch (error) {
    console.error("Error deleting cookie:", error);
  }
};

/**
 * Set a cookie with specified name, value, and options
 * @param {string} name - Cookie name
 * @param {string} value - Cookie value (will be JSON stringified if object)
 * @param {number} days - Expiration in days (default: 30)
 */
export const setCookie = (name, value, days = 30) => {
  try {
    if (value === null || value === undefined) {
      deleteCookie(name);
      return;
    }

    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);

    const cookieValue =
      typeof value === "object" ? JSON.stringify(value) : value;
    document.cookie = `${name}=${encodeURIComponent(
      cookieValue
    )};expires=${expires.toUTCString()};path=/`;
  } catch (error) {
    console.error("Error setting cookie:", error);
  }
};

/**
 * Get a cookie value by name
 * @param {string} name - Cookie name
 * @returns {string|null} Cookie value or null if not found
 */
export const getCookie = (name) => {
  try {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(c.substring(nameEQ.length, c.length));
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting cookie:", error);
    return null;
  }
};

/**
 * Check if cookies are enabled in the browser
 * @returns {boolean} True if cookies are enabled
 */
export const areCookiesEnabled = () => {
  try {
    setCookie("test", "test", 1);
    const result = getCookie("test") === "test";
    deleteCookie("test");
    return result;
  } catch (error) {
    return false;
  }
};
