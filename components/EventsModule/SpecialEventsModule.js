import Image from "next/image";

const SpecialEventsModule = ({ locationData }) => {
  const { city } = locationData;
  const isSanDiego = city === "San Diego";
  return (
    <>
      {isSanDiego && (
        <div className="single-event special-event">
          <div class="event-info">
            <div
              class="event-date"
              itemprop="startDate"
              content="Wed Dec 28 2022 16:00:00 GMT-0800 (Pacific Standard Time)"
            >
              <div>Sunday, May 5</div>
            </div>
            <div class="event-title-artist">
              <span class="event-title" itemprop="name">
                <i>
                  Vinyl Preservation Society presents: <br />
                </i>
                Viva Vinyl!
                <br />
                <br />
              </span>
              <div class="event-venue">
                with DJs playing all vinyl sets...
                <br />
                <br />
              </div>
              <span class="event-artist" itemprop="name">
                <div class="artist">DJ Misha</div>
                <div class="artist">Tim Seeley</div>
                <div class="artist">MixdUpMike</div>
                <div class="artist">DJ FroDaddy</div>
                <div class="artist">Mario Moreno</div>
              </span>
            </div>
            <div
              class="event-venue"
              itemprop="location"
              itemtype="http://schema.org/Place"
            >
              <span itemprop="name">
                <br />
                Hole in the Wall <br />
                <a
                  rel="noreferrer"
                  href="https://maps.app.goo.gl/YipDsTJyN4FYrxxz7"
                  target="_blank"
                >
                  <span>2820 Lytton St, San Diego, CA 92110</span>
                </a>
                <br />
                <br />
                <div>12-8pm | No Cover</div>
              </span>{" "}
            </div>
            <div
              class="event-location"
              itemtype="http://schema.org/PostalAddress"
              itemprop="address"
              content="2820 Lytton St, San Diego, CA 92110"
            ></div>
            {/* <Image
              src="/images/events/Cinco-Party.jpg"
              alt="Cinco Party"
              // width={150}
              // height={150}
              fill={true}
            /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default SpecialEventsModule;
