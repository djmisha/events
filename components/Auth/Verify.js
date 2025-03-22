import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Modal from "../Modal/VerifyModal";
import Button from "../Button/Button";

const Verify = () => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (router.query.code) {
      setShowModal(true);
    }
  }, [router.query]);

  const closeModal = () => {
    setShowModal(false);
    const newUrl = window.location.pathname;
    window.history.replaceState({}, document.title, newUrl);
  };

  return (
    showModal && (
      <Modal onClose={closeModal}>
        <div className="verification-success">
          <h2>Email Verified</h2>
          <p>
            Thank you for confirming your email. You may now login to our site.{" "}
          </p>
          <div className="verification-actions">
            <Link href="/login">
              <Button variant="primary">Go to Login</Button>
            </Link>
          </div>
        </div>
      </Modal>
    )
  );
};

export default Verify;
