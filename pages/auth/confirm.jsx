import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { createClient } from "../../utils/supabase/component";

export default function AuthConfirmPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Confirming your authentication...");
  const [error, setError] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function confirmAuth() {
      try {
        // Get the token from URL query params
        const { token_hash } = router.query;

        if (!token_hash) {
          setMessage("No confirmation token found.");
          return;
        }

        // Handle the auth confirmation
        // This depends on what you're trying to do in your confirm page
        // If it's email confirmation:
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: "email",
        });

        if (error) {
          setError(error.message);
        } else {
          setMessage("Successfully confirmed! Redirecting...");
          // Redirect after successful confirmation
          setTimeout(() => router.push("/"), 2000);
        }
      } catch (err) {
        console.error("Auth confirmation error:", err);
        setError("An error occurred during authentication confirmation.");
      }
    }

    // Only run confirmation if we have query params
    if (router.isReady) {
      confirmAuth();
    }
  }, [router.isReady, router.query]);

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "100px auto",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1>Authentication Confirmation</h1>

      {error ? (
        <div style={{ color: "red", marginTop: "20px" }}>
          <p>Error: {error}</p>
          <button
            onClick={() => router.push("/login")}
            style={{
              marginTop: "15px",
              padding: "8px 16px",
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Return to Login
          </button>
        </div>
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}

// This ensures the page is always rendered at request time, not build time
export async function getServerSideProps() {
  return {
    props: {},
  };
}
