import { useRouter } from "next/router";
import { useEffect } from "react";

// This component handles the redirect logic for paginated URLs
export default function PaginatedLocation() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the main events page with page parameter
    if (router.query.id && router.query.page) {
      const { id, page } = router.query;
      router.replace(`/events/${id}?page=${page}#top`);
    }
  }, [router.query, router]);

  return null; // This component doesn't render anything
}

export async function getServerSideProps({ params }) {
  const { id, page } = params;

  // Redirect to the main events page with page parameter
  return {
    redirect: {
      destination: `/events/${id}?page=${page}#top`,
      permanent: false,
    },
  };
}
