import styles from "./WelcomeMessage.module.scss";

export default function WelcomeMessage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Welcome to Our Dance Music Community!</h2>
      <p>
        Discover top artists, explore exciting locations, and immerse yourself
        in vibrant dance music scenes. Start your adventure with us today!
      </p>
    </div>
  );
}
