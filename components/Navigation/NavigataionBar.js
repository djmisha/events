import { makeLocations } from "../../utils/utilities";
import LocationSelect from "./LocationSelect";
import Hamburger from "../Hamburger/Hamburger";
import BackToTop from "../BackToTop/BackToTop";
import UserGreeting from "../User/UserGreeting";
import styles from "./NavigationBar.module.scss";

const NavigationBar = ({ setSearchTerm, locationData }) => {
  const locations = makeLocations();

  return (
    <div className={styles.mainNavigation}>
      <div className={styles.topNavBar}>
        <div className={styles.navGrid}>
          <Hamburger locationData={locationData} />
          <div className={styles.navSlot}>
            {locations?.length > 0 ? (
              <LocationSelect
                image="/images/icon-map.svg"
                text="city"
                title="Select Location"
                setSearchTerm={setSearchTerm}
                navItems={locations}
                isLocation={true}
              />
            ) : (
              <div className={styles.navPlaceholder} />
            )}
          </div>
          <UserGreeting />
        </div>
      </div>
      <BackToTop />
    </div>
  );
};

export default NavigationBar;
