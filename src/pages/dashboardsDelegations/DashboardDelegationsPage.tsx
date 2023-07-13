import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

type Props = {
  productsFiltered2Delegations?: boolean;
};

export default function DashboardDelegationsPage({ productsFiltered2Delegations }: Props) {
  const [isError, setIsError] = useState<boolean>(false);
  useEffect(() => {
    if (!productsFiltered2Delegations) {
      setIsError(true);
    }
  }, [productsFiltered2Delegations]);

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
