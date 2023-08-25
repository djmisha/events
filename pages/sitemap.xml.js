import { getLocations } from "../utils/getLocations";
import { allArtists } from "../utils/getArtists";

const URL = "https://www.sandiegohousemusic.com";

function generateSiteMap(locations, artists) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://www.sandiegohousemusic.com</loc>
     </url>
     ${locations
       .map(({ slug }) => {
         return `
          <url>
              <loc>${`${URL}/events/${slug}`}</loc>
          </url>
        `;
       })
       .join("")}
      ${artists
        .map(({ slug }) => {
          return `
          <url>
              <loc>${`${URL}/artist/${slug}`}</loc>
          </url>
        `;
        })
        .join("")}
   </urlset>
 `;
}

const SiteMap = () => {
  // This is an empty component.
  // Its only purpose is to generate the XML file
  // getServerSideProps will do the heavy lifting
};

export async function getServerSideProps({ res }) {
  const locations = getLocations();
  const artists = allArtists;

  // We generate the XML sitemap with the location, artist data
  const sitemap = generateSiteMap(locations, artists);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
