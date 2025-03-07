import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../styles/Login.module.scss";

import { createClient } from "../utils/supabase/component";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.signUp({ email, password });

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
      setIsSigningUp(false);
    }
  }

  return (
    <main className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Login or Sign Up</h1>

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
              disabled={isLoggingIn || isSigningUp}
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
              disabled={isLoggingIn || isSigningUp}
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={logIn}
              className={`${styles.button} ${styles.primaryButton}`}
              disabled={isLoggingIn || isSigningUp}
            >
              {isLoggingIn ? "Logging in..." : "Log in"}
            </button>
            <button
              type="button"
              onClick={signUp}
              className={`${styles.button} ${styles.secondaryButton}`}
              disabled={isLoggingIn || isSigningUp}
            >
              {isSigningUp ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
