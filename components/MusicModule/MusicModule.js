import Image from "next/image";
import Link from "next/link";
import { decode } from "html-entities";
import { shuffleArray } from "../../utils/utilities";
import setDates from "../../utils/setDates";

const MusicModule = ({ music }) => {
  music = shuffleArray(music);

  music = music.map((item) => {
    const {
      id,
      link,
      jetpack_featured_media_url: image,
      title,
      date,
      content,
    } = item;
    const { rendered: headline } = title;

    return (
      <div key={id} className="single-music">
        <Link href={link}>
          <div className="single-music-image">
            <Image
              src={image}
              alt={headline}
              width={200}
              height={200}
              priority={true}
            />
          </div>
          <span>{decode(headline)}</span>
          <div className="single-music-time">{setDates(date).fromNow}</div>
        </Link>
      </div>
    );
  });
  return (
    <>
      <div id="musicfeed">{music}</div>
      <p className="view-more">
        <Link href="https://music.sandiegohousemusic.com">
          See More DJ Mixes &rarr;
        </Link>
      </p>
    </>
  );
};

export default MusicModule;
