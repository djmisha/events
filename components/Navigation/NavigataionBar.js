import { makeLocations } from "../../utils/utilities";
import LocationSelect from "./LocationSelect";
import Hamburger from "../Hamburger/Hamburger";
import BackToTop from "../BackToTop/BackToTop";
import UserGreeting from "../User/UserGreeting";

const NavigationBar = ({ setSearchTerm, locationData }) => {
  const locations = makeLocations();

  return (
    <div className="main-navigation">
      <div className="top-nav-bar">
        <div className="nav-grid">
          <Hamburger locationData={locationData} />
          <div className="nav-slot">
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
              <div className="nav-placeholder" />
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
