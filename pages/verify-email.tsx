import { useRouter } from "next/router";
import Head from "next/head";

export default function VerifyEmail() {
  const router = useRouter();
  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>Verify Email | Next Events</title>
      </Head>
      <div className="flex justify-center items-center">
        <div className="mb-16 w-full max-w-sm bg-white rounded-lg shadow-lg p-4 md:p-8">
          <h1 className="text-2xl font-semibold text-center mb-6 text-gray-900">
            Email Verification
          </h1>

          <div
            className="mb-5"
            style={{ marginTop: "20px", textAlign: "center" }}
          >
            <p>
              Thank you for verifying your email. You can now log in to your
              account
            </p>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={navigateToLogin}
              className="flex-1 py-3 px-4 border-none rounded-md text-sm font-medium cursor-pointer transition-all duration-150 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
