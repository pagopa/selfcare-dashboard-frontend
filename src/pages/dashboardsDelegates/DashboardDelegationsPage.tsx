import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

type Props = {
  productsFiltered2Delegates?: boolean;
};

export default function DashboardDelegationsPage({ productsFiltered2Delegates }: Props) {
  const [isError, setIsError] = useState<boolean>(false);
  useEffect(() => {
    if (!productsFiltered2Delegates) {
      setIsError(true);
    }
  }, [productsFiltered2Delegates]);

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
