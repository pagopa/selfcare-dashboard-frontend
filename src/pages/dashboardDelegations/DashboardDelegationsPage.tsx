import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

type Props = {
  isDelegateSectionVisible?: boolean;
};

export default function DashboardDelegationsPage({ isDelegateSectionVisible }: Props) {
  const [isError, setIsError] = useState<boolean>(false);
  useEffect(() => {
    if (!isDelegateSectionVisible) {
      setIsError(true);
    }
  }, [isDelegateSectionVisible]);

  return (
    <>
      {!isError ? (
        <Typography variant="h1" sx={{ fontWeight: '700' }}>
          PAGINA DELEGHE
        </Typography>
      ) : (
        <Typography variant="h1" sx={{ fontWeight: '700' }}>
          NON SEI ABILITATO
        </Typography>
      )}
    </>
  );
}
