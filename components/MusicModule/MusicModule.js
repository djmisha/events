import Image from "next/image";
import Link from "next/link";
import { decode } from "html-entities";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const MusicModule = ({ music }) => {
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
          <div className="single-music-time">{dayjs(date).fromNow()}</div>
        </Link>
      </div>
    );
  });
  return music;
};

export default MusicModule;
