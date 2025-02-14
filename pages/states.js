import Head from "next/head";
import Layout from "../components/layout";
import CitiesStates from "../components/Homepage/CitiesStates";
import { getLocations } from "../utils/getLocations";
import NavigationBar from "../components/NavigationBar/NavigataionBar";

export async function getServerSideProps() {
  const locations = await getLocations();
  return {
    props: {
      locations,
    },
  };
}

const StatesPage = ({ locations }) => {
  return (
    <Layout>
      <Head>
        <title>Events By State</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        ></meta>
      </Head>
      <NavigationBar />
      <h1>Events By State</h1>
      <CitiesStates locations={locations} showStatesOnly={true} />
    </Layout>
  );
};

export default StatesPage;
