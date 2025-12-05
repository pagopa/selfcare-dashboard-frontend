/* eslint-disable functional/immutable-data */
// hooks/useLogoExists.ts
import { useEffect, useState } from 'react';

export const useLogoExists = (logoUrl: string | undefined): boolean | null => {
  const [logoExists, setLogoExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (!logoUrl) {
      setLogoExists(false);
      return;
    }

    // Reset state when URL changes
    setLogoExists(null);

    const img = new Image();

    img.onload = () => {
      setLogoExists(true);
    };

    img.onerror = () => {
      setLogoExists(false);
    };

    img.src = logoUrl;

    // Cleanup
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [logoUrl]);

  return logoExists;
};
