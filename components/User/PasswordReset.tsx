import { useState, useContext } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import styles from "./PasswordReset.module.scss";
import { AppContext } from "../../features/AppContext";

export default function PasswordReset() {
  const { supabase } = useContext(AppContext);

  const [resetEmail, setResetEmail] = useState("");
  const [isResetting, setIsResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");

  async function resetPassword() {
    if (isResetting || !captchaToken) return;

    setIsResetting(true);
    setResetMessage("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail({
        email: resetEmail,
        redirectUrl: "https://your-app.com/reset-password",
        captchaToken,
      });

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
      setCaptchaToken(""); // Reset captcha token after use
    }
  }

  return (
    <div className={styles.centerContainer}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Reset Password</h1>

        {resetMessage && (
          <div className={styles.resetMessage}>{resetMessage}</div>
        )}

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
        <HCaptcha
          sitekey="74e2165e-2f0a-4314-9838-a5720a2e1fac"
          onVerify={(token) => setCaptchaToken(token)}
        />
        <div className={styles.buttonGroup}>
          <button
            type="button"
            onClick={resetPassword}
            className={`${styles.button} ${styles.secondaryButton}`}
            disabled={isResetting || !captchaToken}
          >
            {isResetting ? "Sending..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
