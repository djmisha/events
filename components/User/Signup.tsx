import { useRouter } from "next/router";
import { useState, useContext } from "react";
import styles from "./Login.module.scss";
import { AppContext } from "../../features/AppContext";

export default function Signup() {
  const router = useRouter();
  const { supabase } = useContext(AppContext);

  // Sign up form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupErrorMessage, setSignupErrorMessage] = useState("");

  async function signUp() {
    if (isSigningUp) return;

    setIsSigningUp(true);
    setSignupErrorMessage("");

    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
      });

      if (error) {
        console.error(error);
        setSignupErrorMessage(error.message);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setSignupErrorMessage("An unexpected error occurred");
    } finally {
      setIsSigningUp(false);
    }
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Create an Account</h1>

      {signupErrorMessage && (
        <div className={styles.errorMessage}>{signupErrorMessage}</div>
      )}

      <form>
        <div className={styles.formGroup}>
          <label htmlFor="signupEmail" className={styles.label}>
            Email Address
          </label>
          <input
            id="signupEmail"
            type="email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            className={styles.input}
            placeholder="your@email.com"
            disabled={isSigningUp}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="signupPassword" className={styles.label}>
            Create a Password
          </label>
          <input
            id="signupPassword"
            type="password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            className={styles.input}
            placeholder="••••••••"
            disabled={isSigningUp}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={signUp}
            className={`${styles.button} ${styles.secondaryButton}`}
            disabled={isSigningUp}
          >
            {isSigningUp ? "Signing up..." : "Sign up"}
          </button>
        </div>
      </form>
    </div>
  );
}
