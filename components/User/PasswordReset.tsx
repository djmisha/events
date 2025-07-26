import { useState, useContext } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
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
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/change-password`,
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
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
        <h1 className="text-2xl mb-4 text-center">Reset Password</h1>

        {resetMessage && (
          <div className="p-3 mb-4 bg-blue-50 text-blue-800 rounded-md text-sm text-center">
            {resetMessage}
          </div>
        )}

        <div className="mb-4">
          <label htmlFor="resetEmail" className="block mb-2 font-bold">
            Email Address
          </label>
          <input
            id="resetEmail"
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="your@email.com"
            disabled={isResetting}
          />
        </div>
        <HCaptcha
          sitekey="74e2165e-2f0a-4314-9838-a5720a2e1fac"
          onVerify={(token) => setCaptchaToken(token)}
        />
        <div className="flex gap-4 mt-4">
          <button
            type="button"
            onClick={resetPassword}
            className="flex-1 py-3 px-4 border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-150 bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
            disabled={isResetting || !captchaToken}
          >
            {isResetting ? "Sending..." : "Reset Password"}
          </button>
        </div>
      </div>
    </div>
  );
}
