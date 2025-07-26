import Head from "next/head";
import Layout from "../../components/layout";
import {
  getArtistData,
  getArtistEvents,
  getArtistLastFM,
} from "../../utils/getArtists";
import ArtistImage from "../../components/Artists/ArtistImage";
import ArtistBio from "../../components/Artists/ArtistBio";
import EventCard from "../../components/EventCard/EventCard";
import GoogleAutoAds from "../../components/3rdParty/googleAds";
import NavigationBar from "../../components/Navigation/NavigataionBar";
import { useEventModalManager } from "../../hooks/useEventModal";

export default function Artist({ artistData, events, lastFMdata }) {
  const { name, id } = artistData;
  const { openEventId, setOpenEventId } = useEventModalManager();
  const title = `${name} - Upcoming Events & Artist Informaton`;
  const description = `${name} Tour Dates, Shows, Concert Tickets & Live Streams. Learn more about ${name}`;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <GoogleAutoAds />
      </Head>
      <NavigationBar />
      <div className="text-center [&_h1]:border-none [&_h1]:text-center pt-10">
        <div className="artist-header">
          <ArtistImage id={id} />
          <h1>{name}</h1>
        </div>
        <ArtistBio name={name} lastFMdata={lastFMdata} />
        {events?.length != 0 && (
          <>
            <h2 className="text-xl mb-4">{name} Upcoming Events</h2>
            <div className="p-0 pb-10 transition-all duration-300 ease-out sm:px-2.5 sm:grid sm:grid-cols-2 sm:gap-4 md:mb-5 xl:grid-cols-3">
              {events?.map((event) => (
                <EventCard
                  event={event}
                  key={event.id}
                  openEventId={openEventId}
                  setOpenEventId={setOpenEventId}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params, res }) {
  try {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=86400, stale-while-revalidate=86400"
    );

    const artistData = await getArtistData(params.id);
    const events = await getArtistEvents(artistData.id);
    const lastFMdata = await getArtistLastFM(artistData.name);

    return {
      props: {
        artistData,
        events,
        lastFMdata: lastFMdata || null,
      },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}
