/**
 * Utility for making authenticated server-side API calls
 * This helper automatically adds the internal server token to API requests
 */

/**
 * Make an authenticated API call from server-side code
 * @param {string} endpoint - The API endpoint (e.g., '/api/events/123')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - The response data
 */
export async function authenticatedFetch(endpoint, options = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.INTERNAL_API_TOKEN}`,
    "User-Agent": "NextJS-Internal-Client",
  };

  const mergedOptions = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, mergedOptions);

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`API call failed: ${response.status} - ${errorData}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Authenticated fetch failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Make an authenticated GET request
 * @param {string} endpoint - The API endpoint
 * @returns {Promise} - The response data
 */
export async function authenticatedGet(endpoint) {
  return authenticatedFetch(endpoint, { method: "GET" });
}

/**
 * Make an authenticated POST request
 * @param {string} endpoint - The API endpoint
 * @param {object} data - The data to send
 * @returns {Promise} - The response data
 */
export async function authenticatedPost(endpoint, data) {
  return authenticatedFetch(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Make an authenticated PUT request
 * @param {string} endpoint - The API endpoint
 * @param {object} data - The data to send
 * @returns {Promise} - The response data
 */
export async function authenticatedPut(endpoint, data) {
  return authenticatedFetch(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}
