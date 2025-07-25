import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const useCurrentUrl = () => {
  const router = useRouter();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [router.asPath]);

  return currentUrl;
};
