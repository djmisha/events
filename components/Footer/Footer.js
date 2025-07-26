import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="py-20 px-4 pb-10 bg-white text-gray-400 border-t-2 border-gray-200 mt-10">
      <div className="mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-10 mb-10">
        <div className="flex items-start mt-8 min-w-[200px] col-span-1 md:col-span-1">
          <Image
            width={200}
            height={67}
            src="/images/logo.jpeg"
            alt="sandiegohousemusic.com"
            className="max-w-full h-auto"
          />
        </div>

        <div className="col-span-2 flex flex-row gap-4 items-start">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h3 className="text-gray-700 mb-3 text-base">Navigation</h3>
            <Link
              href="/"
              className="text-gray-500 text-lg no-underline transition-colors hover:text-gray-800"
            >
              Home
            </Link>
            <Link
              href="/artists"
              className="text-gray-500 text-lg no-underline transition-colors hover:text-gray-800"
            >
              Top Artists
            </Link>
            <Link
              href="/cities"
              className="text-gray-500 text-lg no-underline transition-colors hover:text-gray-800"
            >
              Events by City
            </Link>
            <Link
              href="/states"
              className="text-gray-500 text-lg no-underline transition-colors hover:text-gray-800"
            >
              Events by State
            </Link>
            <Link
              href="/login"
              className="text-gray-500 text-lg no-underline transition-colors hover:text-gray-800"
            >
              Login / Signup
            </Link>
          </div>
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <h3 className="text-gray-700 mb-3 text-base">Partners</h3>
            <Link
              href="https://djmisha.com"
              target="_blank"
              title="San Diego DJ"
              className="text-gray-500 text-lg no-underline transition-colors hover:text-gray-800"
            >
              San Diego DJ
            </Link>
            <Link
              href="https://edmtrain.com"
              target="_blank"
              className="text-gray-500 text-lg no-underline transition-colors hover:text-gray-800"
            >
              EDM Train
            </Link>
            <Link
              href="https://www.last.fm"
              target="_blank"
              className="text-gray-500 text-lg no-underline transition-colors hover:text-gray-800"
            >
              Last Fm
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-gray-800 mb-6 text-lg">Follow Us</h3>
          <div className="flex gap-5">
            <a
              rel="noreferrer"
              target="_blank"
              href="https://twitch.tv/sdhousemusic/"
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <Image
                width={30}
                height={30}
                src="/images/icon-twitch.svg"
                alt="Twitch"
              />
            </a>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.instagram.com/sdhousemusic/"
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <Image
                width={30}
                height={30}
                src="/images/icon-instagram.svg"
                alt="Instagram"
              />
            </a>
            <a
              rel="noreferrer"
              target="_blank"
              href="https://www.facebook.com/San-Diego-House-Music-135772356433768/"
              className="opacity-70 transition-opacity hover:opacity-100"
            >
              <Image
                width={30}
                height={30}
                src="/images/icon-facebook.svg"
                alt="Facebook"
              />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto pt-8 border-t border-gray-200 text-center ">
        <p className="my-2 text-gray-400 text-xs">
          &copy; 2010 - {new Date().getFullYear()} sandiegohousemusic.com. All
          rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
