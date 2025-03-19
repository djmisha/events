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

  // Sign up form state
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [signupErrorMessage, setSignupErrorMessage] = useState("");

  async function logIn() {
    if (isLoggingIn || isSigningUp) return;

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

  async function signUp() {
    if (isLoggingIn || isSigningUp) return;

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
    <main className={styles.container}>
      {/* Login Form */}
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
      </div>

      {/* Sign Up Form */}
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
    </main>
  );
}
