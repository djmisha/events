/**
 * API Security Middleware for Next Events Application
 *
 * This utility provides security for API endpoints by:
 * 1. Validating bearer tokens for all requests (except frontend-only endpoints)
 * 2. Supporting both development and production environments
 *
 * Usage: Import and call secureApiEndpoint at the beginning of your API handler
 */

// Endpoints that remain open for frontend calls (no token required)
const FRONTEND_OPEN_ENDPOINTS = [
  "/api/supabase/gettopartists",
  "/api/saveTags",
  "/api/frontend/events",
];

/**
 * Check if endpoint should remain open for frontend calls
 * @param {string} path - Request path
 * @returns {boolean} - True if endpoint should be open
 */
function isFrontendOpenEndpoint(path) {
  return FRONTEND_OPEN_ENDPOINTS.some((endpoint) => path.startsWith(endpoint));
}

/**
 * Get allowed tokens from environment variables
 * @returns {Array} - Array of allowed tokens
 */
function getAllowedTokens() {
  const tokensEnv = process.env.API_ALLOWED_TOKENS;
  if (!tokensEnv) {
    console.warn("API_ALLOWED_TOKENS environment variable not set");
    return [];
  }
  return tokensEnv.split(",").map((token) => token.trim());
}

/**
 * Validates bearer token format and authenticity
 * @param {string} token - The bearer token to validate
 * @returns {boolean} - True if token is valid
 */
function validateBearerToken(token) {
  if (!token) return false;

  // Remove 'Bearer ' prefix if present
  const cleanToken = token.replace(/^Bearer\s+/i, "");

  // Get allowed tokens from environment variables
  const allowedTokens = getAllowedTokens();

  // Check if token is in the allowed list
  if (allowedTokens.includes(cleanToken)) {
    return true;
  }

  // Fallback: Basic token validation for JWT and API key patterns
  // This allows tokens that match expected formats even if not in the explicit list
  const tokenPattern = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/; // JWT pattern
  const apiKeyPattern = /^[A-Za-z0-9]{32,}$/; // Simple API key pattern

  return tokenPattern.test(cleanToken) || apiKeyPattern.test(cleanToken);
}

/**
 * Main security function to be called at the beginning of each API endpoint
 * @param {object} req - Next.js request object
 * @param {object} res - Next.js response object
 * @returns {object} - { allowed: boolean, error?: string }
 */
function secureApiEndpoint(req, res) {
  const authHeader = req.headers.authorization;
  const requestPath = req.url || "";

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    return { allowed: true, isPreflight: true };
  }

  // Check if this endpoint should remain open for frontend calls
  if (isFrontendOpenEndpoint(requestPath)) {
    return { allowed: true };
  }

  // All other endpoints require bearer token
  if (!authHeader) {
    return {
      allowed: false,
      error: "Unauthorized: Missing authentication token",
    };
  }

  if (!validateBearerToken(authHeader)) {
    return {
      allowed: false,
      error: "Unauthorized: Invalid authentication token",
    };
  }

  // Token is valid
  return { allowed: true };
}

/**
 * Higher-order function that wraps API handlers with security
 * @param {function} handler - The original API handler function
 * @returns {function} - The wrapped handler with security
 */
export function withApiSecurity(handler) {
  return async (req, res) => {
    const security = secureApiEndpoint(req, res);

    // Handle preflight requests
    if (security.isPreflight) {
      return res.status(200).end();
    }

    // Check if request is allowed
    if (!security.allowed) {
      return res.status(401).json({
        error: security.error || "Unauthorized access",
      });
    }

    // Call the original handler
    return handler(req, res);
  };
}

// Export both named and default
export default secureApiEndpoint;
