import Signup from "../User/Signup";
import styles from "./SignupCTA.module.scss";

export default function SignupCTA() {
  return (
    <section className={styles.ctaSignup}>
      <div className={styles.ctaLeft}>
        <h2>Create an Account Today!</h2>
        <ul>
          <li>Save your default location</li>
          <li>Add favorite artists</li>
          <li>Coming soon: favorite venues</li>
          <li>And much more...</li>
        </ul>
      </div>
      <div className={styles.ctaRight}>
        <Signup />
      </div>
    </section>
  );
}
