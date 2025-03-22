import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import styles from "../components/User/Login.module.scss";

export default function VerifyEmail() {
  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <>
      <Head>
        <title>Verify Email | Next Events</title>
      </Head>
      <div className={styles.centerContainer}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>Email Verification</h1>

          <div
            className={styles.formGroup}
            style={{ marginTop: "20px", textAlign: "center" }}
          >
            <p>
              Thank you for verifying your email. You can now log in to your
              account
            </p>
          </div>

          <div className={styles.buttonGroup}>
            <button
              type="button"
              onClick={navigateToLogin}
              className={`${styles.button} ${styles.primaryButton}`}
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
