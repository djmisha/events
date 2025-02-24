import HomeSearchAutocomplete from "../SearchAutoComplete/HomeSearchAutocomplete";
import styles from "./Hero.module.scss";

const Hero = () => {
  return (
    <div className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.headlineWrapper}>
          <span className={styles.superHeadline}>Your Next Event Awaits</span>
          <h1 className={styles.headline}>
            Discover Electronic <br></br>Dance Music Events
          </h1>
          <p className={styles.subHeadline}>
            Find EDM shows, raves, and festivals near you
          </p>
        </div>
        <div className={styles.search}>
          <HomeSearchAutocomplete />
        </div>
      </div>
    </div>
  );
};

export default Hero;
