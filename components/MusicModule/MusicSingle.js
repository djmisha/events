import Image from "next/image";
import { decode } from "html-entities";
import setDates from "../../utils/setDates";
import Modal from "../Modal/Modal";
import { useState } from "react";

const MusicSingle = ({ id, image, headline, date, content }) => {
  const title = decode(headline);
  const dateFrom = setDates(date).fromNow;
  const [isOpen, SetIsOpen] = useState(false);

  const handleClick = (e) => {
    SetIsOpen(!isOpen);
  };

  return (
    <div id={id} className="single-music" onClick={handleClick}>
      <div className="single-music-image">
        <Image
          src={image}
          alt={headline}
          width={200}
          height={200}
          priority={true}
        />
      </div>
      <span>{title}</span>
      <div className="single-music-time">{dateFrom}</div>
      <Modal
        content={content}
        title={title}
        isOpen={isOpen}
        SetIsOpen={SetIsOpen}
      />
    </div>
  );
};

export default MusicSingle;
