import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * A reliable hook to get the current image version for cache busting.
 * Subscribes to the React Query cache and re-renders whenever the
 * ['profileImageVersion'] key is updated via setQueryData.
 */
export const useImageVersion = () => {
  const queryClient = useQueryClient();

  // Initialize from cache or default to 0
  const [imageVersion, setImageVersion] = useState(
    () => queryClient.getQueryData(['profileImageVersion']) || 0,
  );

  useEffect(() => {
    // Subscribe to cache changes for the profileImageVersion key
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (
        event?.query?.queryKey?.[0] === 'profileImageVersion' &&
        (event.type === 'updated' || event.type === 'added')
      ) {
        const newVersion = queryClient.getQueryData(['profileImageVersion']);
        if (newVersion) {
          setImageVersion(newVersion);
        }
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  return imageVersion;
};
