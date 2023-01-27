import Image from "next/image";
import Link from "next/link";
import { decode } from "html-entities";
import { shuffleArray } from "../../utils/utilities";
import setDates from "../../utils/setDates";
import Modal from "../Modal/Modal";
import MusicSingle from "./MusicSingle";

const MusicModule = ({ music }) => {
  music = shuffleArray(music);
  music = music.map((item) => {
    const {
      id,
      jetpack_featured_media_url: image,
      title,
      date,
      content,
    } = item;
    const { rendered: headline } = title;
    const { rendered: cont } = content;

    return (
      <MusicSingle
        key={id}
        id={id}
        headline={headline}
        content={cont}
        date={date}
        image={image}
      />
    );
  });
  return (
    <>
      <div id="musicfeed">{music}</div>
      <p className="view-more">
        <Link href="https://music.sandiegohousemusic.com">
          View More DJ Mixes &rarr;
        </Link>
      </p>
    </>
  );
};

export default MusicModule;
