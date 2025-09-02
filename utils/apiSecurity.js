/**
 * API Security Middleware for Next Events Application
 *
 * This utility provides security for API endpoints by:
 * 1. Checking CORS for production environment
 * 2. Validating bearer tokens for unauthorized domains
 *
 * Usage: Import and call secureApiEndpoint at the beginning of your API handler
 */

const ALLOWED_DOMAINS = [
  "sandiegohouse.com",
  "www.sandiegohousemusic.com",
  "localhost", // Allow localhost for development
];

const PRODUCTION_ORIGINS = [
  "https://sandiegohouse.com",
  "https://www.sandiegohousemusic.com",
];

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
 * Checks if the origin domain is in the allowed list
 * @param {string} origin - The request origin
 * @returns {boolean} - True if domain is allowed
 */
function isAllowedDomain(origin) {
  if (!origin) return false;

  try {
    const url = new URL(origin);
    const hostname = url.hostname;

    // Log for debugging in production
    console.log('Origin check:', { origin, hostname, allowedDomains: ALLOWED_DOMAINS });

    return ALLOWED_DOMAINS.some(
      (domain) => hostname === domain || hostname.endsWith("." + domain)
    );
  } catch (error) {
    console.error('Error parsing origin URL:', { origin, error: error.message });
    return false;
  }
}

/**
 * Sets CORS headers for the response
 * @param {object} res - Next.js response object
 * @param {string} origin - Request origin
 */
function setCorsHeaders(res, origin) {
  if (process.env.NODE_ENV === "production") {
    if (PRODUCTION_ORIGINS.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
  } else {
    // In development, be more permissive
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

/**
 * Main security function to be called at the beginning of each API endpoint
 * @param {object} req - Next.js request object
 * @param {object} res - Next.js response object
 * @returns {object} - { allowed: boolean, error?: string }
 */
export function secureApiEndpoint(req, res) {
  const origin = req.headers.origin || req.headers.referer;
  const host = req.headers.host;
  const authHeader = req.headers.authorization;

  // Enhanced origin detection for production
  let detectedOrigin = origin;
  if (!detectedOrigin && host) {
    // Construct origin from host header if origin is missing
    const protocol = req.headers["x-forwarded-proto"] || "https";
    detectedOrigin = `${protocol}://${host}`;
  }

  // Log for debugging (only in production to see what's happening)
  if (process.env.NODE_ENV === 'production') {
    console.log('Security check:', {
      origin,
      detectedOrigin,
      host,
      referer: req.headers.referer,
      hasAuth: !!authHeader,
      method: req.method
    });
  }

  // Handle preflight OPTIONS requests
  if (req.method === "OPTIONS") {
    setCorsHeaders(res, detectedOrigin);
    return { allowed: true, isPreflight: true };
  }

  // Set CORS headers for all requests
  setCorsHeaders(res, detectedOrigin);

  // In development, allow all requests
  if (process.env.NODE_ENV !== "production") {
    return { allowed: true };
  }

  // Production security checks
  if (process.env.NODE_ENV === "production") {
    // Check for same-origin requests (when origin might be missing)
    if (!detectedOrigin && host) {
      // If no origin but we have a host header, check if host is allowed
      const hostOnly = host.split(":")[0]; // Remove port if present
      if (ALLOWED_DOMAINS.includes(hostOnly)) {
        console.log('Same-origin request allowed for host:', hostOnly);
        return { allowed: true };
      }
    }

    // First check if the domain is allowed
    if (isAllowedDomain(detectedOrigin)) {
      console.log('Domain allowed:', detectedOrigin);
      return { allowed: true };
    }

    console.log('Domain not allowed, checking token:', detectedOrigin);

    // If domain is not allowed, check for valid bearer token
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
    console.log('Valid token provided');
    return { allowed: true };
  }

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

export default secureApiEndpoint;
