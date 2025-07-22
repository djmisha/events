import LocationSelectModal from "./LocationSelectModal";
import Hamburger from "../Hamburger/Hamburger";
import BackToTop from "../BackToTop/BackToTop";
import UserGreeting from "../User/UserGreeting";
import styles from "./NavigationBar.module.scss";

const NavigationBar = ({ setSearchTerm, locationData }) => {
  return (
    <div className={styles.mainNavigation}>
      <div className={styles.topNavBar}>
        <div className={styles.navGrid}>
          <Hamburger locationData={locationData} />
          <div className={styles.navSlot}>
            <LocationSelectModal image="/images/icon-map.svg" text="Location" />
          </div>
          <UserGreeting />
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default NavigationBar;
