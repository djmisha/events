/**
 * Debug endpoint to help troubleshoot CORS and security issues
 * This endpoint shows what headers are being received
 * Use this to debug production issues
 */
import { secureApiEndpoint } from "../../utils/apiSecurity";

export default async function handler(req, res) {
  // Apply security checks
  const security = secureApiEndpoint(req, res);
  
  // Handle preflight requests
  if (security.isPreflight) {
    return res.status(200).end();
  }
  
  // Check if request is allowed
  if (!security.allowed) {
    return res.status(401).json({ 
      error: security.error || 'Unauthorized access',
      debug: {
        origin: req.headers.origin,
        referer: req.headers.referer,
        host: req.headers.host,
        userAgent: req.headers['user-agent'],
        authorization: req.headers.authorization ? 'Present' : 'Missing',
        method: req.method,
        environment: process.env.NODE_ENV
      }
    });
  }

  // Return debug information for successful requests
  res.status(200).json({ 
    message: 'Security check passed',
    debug: {
      origin: req.headers.origin,
      referer: req.headers.referer,
      host: req.headers.host,
      userAgent: req.headers['user-agent'],
      authorization: req.headers.authorization ? 'Present' : 'Missing',
      method: req.method,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    }
  });
}
