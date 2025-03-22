import { useRouter } from "next/router";
import { useState, useContext } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
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
  const [captchaToken, setCaptchaToken] = useState("");

  async function logIn() {
    if (isLoggingIn || !captchaToken) return;

    setIsLoggingIn(true);
    setErrorMessage("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          captchaToken,
        },
      });

      if (error) {
        console.error(error);
        if (error.message.includes("captcha verification process failed")) {
          setErrorMessage("Captcha verification failed. Please try again.");
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      router.push("/");
    } catch (err) {
      console.error(err);
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsLoggingIn(false);
      setCaptchaToken(""); // Reset captcha token after use
    }
  }

  return (
    <div className={styles.centerContainer}>
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

          <HCaptcha
            sitekey="74e2165e-2f0a-4314-9838-a5720a2e1fac"
            onVerify={(token) => setCaptchaToken(token)}
          />

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={logIn}
              className={`${styles.button} ${styles.primaryButton}`}
              disabled={isLoggingIn || !captchaToken}
            >
              {isLoggingIn ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>

        <p
          className={styles.forgotPassword}
          onClick={() => router.push("/passwordreset")}
        >
          Forgot your password?
        </p>
      </div>
    </div>
  );
}
