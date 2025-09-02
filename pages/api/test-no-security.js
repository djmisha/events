/**
 * Test endpoint WITHOUT security to help debug
 * This endpoint bypasses all security checks
 * Use this to confirm if the issue is with our security or elsewhere
 */

export default function handler(req, res) {
  res.status(200).json({
    message: "Test endpoint working - no security applied",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    headers: {
      origin: req.headers.origin,
      host: req.headers.host,
      referer: req.headers.referer,
      userAgent: req.headers["user-agent"],
    },
  });
}
