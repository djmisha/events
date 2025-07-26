import HomeSearchAutocomplete from "../SearchAutoComplete/HomeSearchAutocomplete";
import QuickLocationFinder from "../QuickLocationFinder/QuickLocationFinder";

const Hero = () => {
  return (
    <div className="relative h-dvh flex items-center justify-center bg-gradient-to-br from-[#18181c] to-[#0a0a0c]">
      <div className="relative z-10 max-w-6xl mx-auto text-center text-white">
        <div className="mb-8">
          <span className="inline-block uppercase text-xs md:text-sm font-medium tracking-wider border-2 border-pink text-pink py-2 px-3 md:py-2 md:px-4 rounded-full mb-2 md:mb-4 shadow-pink/20 shadow bg-transparent">
            Your Next Event Awaits
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold my-1 md:my-2 leading-tight text-[#19c6e6]">
            Discover Electronic <br />
            Dance Music Events
            <span className="block w-full h-1 mt-2 mb-1 bg-[#19c6e6] opacity-80 rounded-full" />
          </h1>
          <p className="text-sm md:text-lg font-normal opacity-90 my-2 md:my-4 text-white">
            Find EDM shows, raves, and festivals near you
          </p>
        </div>
        <div className="max-w-2xl mx-auto bg-[#23232a] p-4 rounded-xl shadow-xl">
          <HomeSearchAutocomplete />
        </div>
        <div className="mt-8">
          <p className="text-base md:text-lg font-medium text-white mb-4">
            or simply
          </p>
          <QuickLocationFinder />
        </div>
      </div>
    </div>
  );
};

export default Hero;
