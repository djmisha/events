import LocationSelectModal from "./LocationSelectModal";
import Hamburger from "../Hamburger/Hamburger";
import BackToTop from "../BackToTop/BackToTop";
import UserGreeting from "../User/UserGreeting";

const NavigationBar = ({ setSearchTerm, locationData }) => {
  return (
    <div className="h-[60px] w-full relative bg-white">
      <div className="flex flex-nowrap items-center justify-around relative left-0 h-[60px] pb-0 bg-white md:m-0">
        <div className="flex justify-between w-full pr-2.5 mx-auto">
          <Hamburger locationData={locationData} />
          <div className="min-w-[60px] h-[60px] flex items-center justify-center">
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
