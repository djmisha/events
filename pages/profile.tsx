import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import type { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import styles from "../styles/Login.module.css";

import { createClient } from "../utils/supabase/component"; // Make sure we're importing the component client
import { createClient as createServerClient } from "../utils/supabase/server-props";

interface Profile {
  id: string;
  username: string;
  full_name: string;
  avatar_url: string;
  website: string;
  updated_at: string;
}

interface ProfileFormProps {
  user: User;
}

export default function ProfilePage({ user }: ProfileFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [profile, setProfile] = useState<Partial<Profile>>({
    username: "",
    full_name: "",
    avatar_url: "",
    website: "",
  });

  // Use the client-side supabase client
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.warn("No profile found");
        } else if (data) {
          setProfile({
            username: data.username || "",
            full_name: data.full_name || "",
            avatar_url: data.avatar_url || "",
            website: data.website || "",
          });
        }
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, [user.id]); // Remove supabase from dependencies to avoid re-fetching

  async function updateProfile() {
    try {
      setLoading(true);

      const updates = {
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from("profiles").upsert(updates, {
        onConflict: "id",
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({ type: "success", text: "Profile updated successfully!" });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1 className={styles.title}>Profile Settings</h1>
        {message && (
          <div
            style={{
              padding: "0.75rem",
              marginBottom: "1rem",
              borderRadius: "6px",
              textAlign: "center",
              backgroundColor:
                message.type === "success" ? "#dcfce7" : "#fee2e2",
              color: message.type === "success" ? "#166534" : "#991b1b",
            }}
          >
            {message.text}
          </div>
        )}
        <form>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="text"
              value={user.email || ""}
              disabled
              className={styles.input}
            />
            <small style={{ color: "#6b7280", fontSize: "0.75rem" }}>
              Your email cannot be changed
            </small>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <input
              id="username"
              type="text"
              value={profile.username}
              onChange={(e) =>
                setProfile({ ...profile, username: e.target.value })
              }
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="full_name" className={styles.label}>
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="avatar_url" className={styles.label}>
              Avatar URL
            </label>
            <input
              id="avatar_url"
              type="url"
              value={profile.avatar_url}
              onChange={(e) =>
                setProfile({ ...profile, avatar_url: e.target.value })
              }
              className={styles.input}
              placeholder="https://example.com/avatar.png"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="website" className={styles.label}>
              Website
            </label>
            <input
              id="website"
              type="url"
              value={profile.website}
              onChange={(e) =>
                setProfile({ ...profile, website: e.target.value })
              }
              className={styles.input}
              placeholder="https://example.com"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={updateProfile}
              className={`${styles.button} ${styles.primaryButton}`}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/")}
              className={`${styles.button} ${styles.secondaryButton}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Use server-side client for getServerSideProps
  const supabase = createServerClient(context);

  const { data, error } = await supabase.auth.getUser();

  if (error || !data) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: data.user,
    },
  };
}
