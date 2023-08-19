import { getLocations } from "../utils/getLocations";

const URL = "https://www.sandiegohousemusic.com";

function generateSiteMap(locations) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the URLs we know already-->
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
   </urlset>
 `;
}

function SiteMap() {
  // This is an empty page. Its only purpose is to generate the XML file
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  const locations = getLocations();

  // We generate the XML sitemap with the location data
  const sitemap = generateSiteMap(locations);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
