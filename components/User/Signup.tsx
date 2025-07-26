import { useRouter } from "next/router";
import { useState, useContext } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
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
        username: signupEmail,
        options: {
          captchaToken,
          emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/verify-email`,
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
    <div className="flex justify-center items-center">
      <div className="mb-16 w-full max-w-sm bg-white rounded-lg shadow-lg p-4 md:p-8">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900">
          Create an Account
        </h1>

        <form>
          <div className="mb-5">
            <label
              htmlFor="signupEmail"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="signupEmail"
              type="email"
              value={signupEmail}
              onChange={(e) => setSignupEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-colors duration-150 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="your@email.com"
              disabled={isSigningUp}
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="signupPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Create a Password
            </label>
            <input
              id="signupPassword"
              type="password"
              value={signupPassword}
              onChange={(e) => setSignupPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-colors duration-150 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="••••••••"
              disabled={isSigningUp}
            />
          </div>

          <HCaptcha
            sitekey="74e2165e-2f0a-4314-9838-a5720a2e1fac"
            onVerify={(token) => setCaptchaToken(token)}
          />

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={signUp}
              className="flex-1 py-3 px-4 border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-150 bg-gray-50 text-gray-600 border border-gray-300 hover:bg-gray-100 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSigningUp || !captchaToken}
            >
              {isSigningUp ? "Signing up..." : "Sign up"}
            </button>
          </div>
          {signupErrorMessage && (
            <div className="p-3 mt-4 bg-red-50 text-red-800 rounded-md text-sm text-center border border-red-200">
              {signupErrorMessage}
            </div>
          )}

          {signupSuccessMessage && (
            <div className="p-3 mt-4 bg-green-50 text-green-800 rounded-md text-sm text-center border border-green-200">
              {signupSuccessMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
