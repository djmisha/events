import { useRouter } from "next/router";
import { useState, useContext } from "react";
import HCaptcha from "@hcaptcha/react-hcaptcha";
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
    <div className="flex justify-center items-center">
      <div className="mb-16 w-full max-w-sm bg-white rounded-lg shadow-lg p-4 md:p-8">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900">
          Login
        </h1>

        {errorMessage && (
          <div className="p-3 mb-4 bg-red-50 text-red-800 rounded-md text-sm text-center border border-red-200">
            {errorMessage}
          </div>
        )}

        <form>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-colors duration-150 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="your@email.com"
              disabled={isLoggingIn}
            />
          </div>

          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md text-base transition-colors duration-150 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="••••••••"
              disabled={isLoggingIn}
            />
          </div>

          <HCaptcha
            sitekey="74e2165e-2f0a-4314-9838-a5720a2e1fac"
            onVerify={(token) => setCaptchaToken(token)}
          />

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={logIn}
              className="flex-1 py-3 px-4 border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-150 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isLoggingIn || !captchaToken}
            >
              {isLoggingIn ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>

        <p
          className="text-center text-indigo-600 cursor-pointer mt-4"
          onClick={() => router.push("/passwordreset")}
        >
          Forgot your password?
        </p>
      </div>
    </div>
  );
}
