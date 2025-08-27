import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Layout from "../components/layout";
import { getArtistsCounts } from "../utils/getArtists";
import { filterSurpriseGuest } from "../utils/utilities";
import NavigationBar from "../components/Navigation/NavigataionBar";
import TopArtistsCard from "../components/TopArtistsCard/TopArtistsCard";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "../components/ui/pagination";

const title = "Top Touring EDM DJ's & Artists";

/**
 * Gets server side data for page,
 * revalidates every 1 month
 *
 * @param {*} param0
 * @returns all events on EDM Train
 */
export async function getStaticProps() {
  const KEY = process.env.NEXT_PUBLIC_API_KEY_EDMTRAIN;
  const EDMURL = "https://edmtrain.com/api/events?";
  const URL = EDMURL + "&client=" + KEY;

  let apiResponse;

  try {
    apiResponse = await fetch(URL);
  } catch (error) {
    console.error("Fetch failed: ", error);
    throw new Error(`Fetch failed: ${error.message}`);
  }

  if (!apiResponse.ok) {
    throw new Error(`HTTP error! status: ${apiResponse.status}`);
  }

  const json = await apiResponse.json();
  const uniqueArtists = getArtistsCounts(json.data);

  return {
    props: {
      uniqueArtists,
    },
    revalidate: 2419200, // 1 month
  };
}

const Artists = ({ uniqueArtists }) => {
  const filteredArtists = filterSurpriseGuest(uniqueArtists);
  const apiEvents = filteredArtists.slice(0, 30);
  const hasFetched = useRef(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; // 3 cols on large screens, divisible by 1, 2, and 3
  const totalItems = filteredArtists.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Calculate current items to display
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentArtists = filteredArtists.slice(startIndex, endIndex);

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top of the page when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!hasFetched.current && apiEvents) {
      async function postData() {
        try {
          await fetch(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/supabase/posttopartists`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(apiEvents),
            }
          );
        } catch (error) {
          console.error("Fetch failed: ", error);
        }
      }

      postData();
      hasFetched.current = true;
    }
  }, [apiEvents]);

  return (
    <Layout>
      <Head>
        <title>
          {title} - Page {currentPage}
        </title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        ></meta>
      </Head>
      <NavigationBar />
      <>
        <div className="text-center my-6">
          <h1>Top Touring Artists</h1>
          <p className="text-gray-600 mt-2">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} artists (Page {currentPage} of {totalPages})
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 p-2 md:gap-6">
          {currentArtists?.map((artist) => (
            <TopArtistsCard key={artist.id} artist={artist} />
          ))}
        </div>

        {/* Pagination Component */}
        {totalPages > 1 && (
          <div className="mt-8 mb-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      currentPage > 1 && handlePageChange(currentPage - 1)
                    }
                    className={
                      currentPage <= 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {/* First page */}
                {currentPage > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    {currentPage > 4 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                  </>
                )}

                {/* Pages around current page */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((page) => {
                    return page >= currentPage - 2 && page <= currentPage + 2;
                  })
                  .map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => handlePageChange(page)}
                        isActive={page === currentPage}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                {/* Last page */}
                {currentPage < totalPages - 2 && (
                  <>
                    {currentPage < totalPages - 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      currentPage < totalPages &&
                      handlePageChange(currentPage + 1)
                    }
                    className={
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </>
    </Layout>
  );
};

export default Artists;
