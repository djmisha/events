import Head from "next/head";
import Layout from "../components/layout";
import CitiesStates from "../components/Homepage/CitiesStates";
import { getLocations } from "../utils/getLocations";
import NavigationBar from "../components/Navigation/NavigataionBar";

export async function getServerSideProps() {
  const locations = await getLocations();
  return {
    props: {
      locations,
    },
  };
}

const CitiesPage = ({ locations }) => {
  return (
    <Layout>
      <Head>
        <title>Events By City</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        ></meta>
      </Head>
      <NavigationBar />
      <h1>Events By City</h1>
      <CitiesStates locations={locations} showCitiesOnly={true} />
    </Layout>
  );
};

export default CitiesPage;
