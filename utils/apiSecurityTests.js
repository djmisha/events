/**
 * Example test file demonstrating how to test the API security
 * This file shows different scenarios for testing the secured endpoints
 */

// Example 1: Testing with allowed domain (should work in production)
async function testAllowedDomain() {
  try {
    const response = await fetch("https://your-domain.com/api/hello", {
      method: "GET",
      headers: {
        Origin: "https://sandiegohouse.com",
      },
    });

    const data = await response.json();
    console.log("Allowed domain test:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 2: Testing with Bearer token (should work for mobile app)
async function testWithBearerToken() {
  try {
    const response = await fetch("https://your-domain.com/api/hello", {
      method: "GET",
      headers: {
        Authorization: "Bearer your-api-token-here",
        Origin: "https://some-other-domain.com",
      },
    });

    const data = await response.json();
    console.log("Bearer token test:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 3: Testing unauthorized request (should fail in production)
async function testUnauthorized() {
  try {
    const response = await fetch("https://your-domain.com/api/hello", {
      method: "GET",
      headers: {
        Origin: "https://unauthorized-domain.com",
      },
    });

    const data = await response.json();
    console.log("Unauthorized test:", data);
  } catch (error) {
    console.error("Expected error:", error);
  }
}

// Example 4: Testing CORS preflight request
async function testCorsPreFlight() {
  try {
    const response = await fetch("https://your-domain.com/api/hello", {
      method: "OPTIONS",
      headers: {
        Origin: "https://sandiegohouse.com",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });

    console.log("CORS preflight status:", response.status);
    console.log("CORS headers:", {
      "Access-Control-Allow-Origin": response.headers.get(
        "Access-Control-Allow-Origin"
      ),
      "Access-Control-Allow-Methods": response.headers.get(
        "Access-Control-Allow-Methods"
      ),
      "Access-Control-Allow-Headers": response.headers.get(
        "Access-Control-Allow-Headers"
      ),
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 5: Testing POST request with data
async function testPostWithToken() {
  try {
    const response = await fetch("https://your-domain.com/api/saveTags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer your-api-token-here",
        Origin: "https://mobile-app-domain.com",
      },
      body: JSON.stringify({
        tags: [{ name: "house" }, { name: "techno" }],
      }),
    });

    const data = await response.json();
    console.log("POST with token test:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

// Example 6: Testing with different token formats
async function testDifferentTokenFormats() {
  // JWT format
  const jwtToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

  // API Key format
  const apiKey = "abcdef1234567890abcdef1234567890abcdef12";

  for (const token of [jwtToken, apiKey]) {
    try {
      const response = await fetch("https://your-domain.com/api/hello", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Origin: "https://mobile-app.com",
        },
      });

      const data = await response.json();
      console.log(`Token format test (${token.substring(0, 10)}...):`, data);
    } catch (error) {
      console.error("Error with token:", token.substring(0, 10), error);
    }
  }
}

// Run tests (uncomment to use)
// testAllowedDomain();
// testWithBearerToken();
// testUnauthorized();
// testCorsPreFlight();
// testPostWithToken();
// testDifferentTokenFormats();

export {
  testAllowedDomain,
  testWithBearerToken,
  testUnauthorized,
  testCorsPreFlight,
  testPostWithToken,
  testDifferentTokenFormats,
};
