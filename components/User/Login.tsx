import { useRouter } from "next/router";
import { useState, useContext } from "react";
import styles from "./Login.module.scss";
import { AppContext } from "../../features/AppContext";

export default function Login() {
  const router = useRouter();
  const { supabase } = useContext(AppContext);

  // Login form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");

  async function logIn() {
    if (isLoggingIn) return;

    setIsLoggingIn(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error(error);
        setErrorMessage(error.message);
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function resetPassword() {
    if (isResetting) return;

    setIsResetting(true);
    setResetMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail);

      if (error) {
        console.error(error);
        if (error.message.includes("captcha verification process failed")) {
          setResetMessage("Captcha verification failed. Please try again.");
        } else {
          setResetMessage(error.message);
        }
        return;
      }

      setResetMessage("Password reset email sent!");
    } catch (err) {
      console.error(err);
      setResetMessage("An unexpected error occurred");
    } finally {
      setIsResetting(false);
    }
  }

  return (
    <div className={styles.formContainer}>
      <h1 className={styles.title}>Login</h1>

      {errorMessage && (
        <div className={styles.errorMessage}>{errorMessage}</div>
      )}

      <form>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="your@email.com"
            disabled={isLoggingIn}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
            placeholder="••••••••"
            disabled={isLoggingIn}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={logIn}
            className={`${styles.button} ${styles.primaryButton}`}
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Log in"}
          </button>
        </div>
      </form>

      <p
        className={styles.forgotPassword}
        onClick={() => setShowForgotPassword(!showForgotPassword)}
      >
        Forgot your password?
      </p>

      {showForgotPassword && (
        <div className={styles.resetContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="resetEmail" className={styles.label}>
              Email Address
            </label>
            <input
              id="resetEmail"
              type="email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className={styles.input}
              placeholder="your@email.com"
              disabled={isResetting}
            />
          </div>
          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={resetPassword}
              className={`${styles.button} ${styles.secondaryButton}`}
              disabled={isResetting}
            >
              {isResetting ? "Sending..." : "Reset Password"}
            </button>
          </div>
          {resetMessage && (
            <div className={styles.resetMessage}>{resetMessage}</div>
          )}
        </div>
      )}
    </div>
  );
}
