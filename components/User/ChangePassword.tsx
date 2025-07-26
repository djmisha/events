import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Button from "../Button/Button";

// Initialize Supabase client directly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function ChangePassword({ user }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Direct initialization to ensure auth is available
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      setSuccess(true);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError(error.message || "Failed to update password");
      console.error("Password update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Change Password</h1>
      </div>

      {success && (
        <div className="bg-green-50 text-green-800 p-3 rounded-md mb-5 border-l-4 border-green-400">
          Password successfully updated!
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-800 p-3 rounded-md mb-5 border-l-4 border-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="newPassword"
            className="block mb-2 font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-3 border border-gray-300 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="mb-8">
          <label
            htmlFor="confirmPassword"
            className="block mb-2 font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-3 border border-gray-300 rounded-md text-base transition-colors focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200"
          />
        </div>

        <div className="mt-3">
          <Button
            href="#"
            variant="primary"
            onClick={null}
            disabled={isLoading}
            type="submit"
            className={null}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </form>
    </div>
  );
}
