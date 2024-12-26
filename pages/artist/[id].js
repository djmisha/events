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
import Hamburger from "../../components/Hamburger/Hamburger";
import GoogleAutoAds from "../../components/3rdParty/googleAds";

export default function Artist({ artistData, events, lastFMdata }) {
  const { name, id } = artistData;

  const title = `${name} - Upcoming Events & Artist Informaton`;
  const description = `${name} Tour Dates, Shows, Concert Tickets & Live Streams. Learn more about ${name}`;

  return (
    <Layout>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <GoogleAutoAds />
      </Head>
      <Hamburger />
      <div className="artist">
        <div className="artist-header">
          <ArtistImage name={id} />
          <h1>{name}</h1>
        </div>
        <ArtistBio name={name} lastFMdata={lastFMdata} />
        {events?.length != 0 && (
          <>
            <h2>{name} Upcoming Events</h2>
            <div id="artistfeed">
              {events?.map((event) => (
                <EventCard event={event} key={event.id} />
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

// Remove getStaticPaths as it's not needed with getServerSideProps

export async function getServerSideProps({ params }) {
  try {
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
