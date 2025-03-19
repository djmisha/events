import { useRouter } from "next/router";
import { useState, useContext } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
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
  const [signupSuccessMessage, setSignupSuccessMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  async function signUp() {
    if (isSigningUp || !captchaToken) return;

    setIsSigningUp(true);
    setSignupErrorMessage("");
    setSignupSuccessMessage("");

    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          captchaToken,
        },
      });

      if (error) {
        console.error(error);
        setSignupErrorMessage(error.message);
        return;
      }

      setSignupSuccessMessage(
        "Sign-up successful! Please check your email for verification."
      );
    } catch (err) {
      console.error(err);
      setSignupErrorMessage("An unexpected error occurred");
    } finally {
      setIsSigningUp(false);
      setCaptchaToken(""); // Reset captcha token after use
    }
  }

  return (
    <div className={styles.centerContainer}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Create an Account</h1>

        {signupErrorMessage && (
          <div className={styles.errorMessage}>{signupErrorMessage}</div>
        )}

        {signupSuccessMessage && (
          <div className={styles.successMessage}>{signupSuccessMessage}</div>
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

          <HCaptcha
            sitekey="74e2165e-2f0a-4314-9838-a5720a2e1fac"
            onVerify={(token) => setCaptchaToken(token)}
          />

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={signUp}
              className={`${styles.button} ${styles.secondaryButton}`}
              disabled={isSigningUp || !captchaToken}
            >
              {isSigningUp ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
