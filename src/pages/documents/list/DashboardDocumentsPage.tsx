import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import TitleBox from '@pagopa/selfcare-common-frontend/lib/components/TitleBox';
import { Box, CircularProgress, Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { useAppDispatch } from '../../../redux/hooks';
import { useIsPagoPaUser } from '../../../hooks/useIsPagoPaUser';
import {
  fetchProductsContractUpdateStatus,
  ProductContractUpdateStatus,
} from '../../../services/contractUpdateService';
import ProductCards from './components/ProductCards';
import { getDocumentProductIds, getDocumentProducts } from './productUtils';

type DocumentsProps = {
  party: Party;
  products: Array<Product>;
};

type ScopedStatuses = {
  partyId: string;
  productIds: Array<string>;
  statuses: Array<ProductContractUpdateStatus>;
};

const DashboardDocuments = ({ party, products }: DocumentsProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isPagoPaUser = useIsPagoPaUser();
  const documentProducts = useMemo(
    () => getDocumentProducts(party, products, isPagoPaUser),
    [isPagoPaUser, party, products]
  );
  const productIds = useMemo(() => getDocumentProductIds(documentProducts), [documentProducts]);
  const [statusResult, setStatusResult] = useState<ScopedStatuses>();
  const statuses =
    statusResult?.partyId === party.partyId &&
    statusResult.productIds.length === productIds.length &&
    statusResult.productIds.every((productId, index) => productId === productIds[index])
      ? statusResult.statuses
      : undefined;

  useEffect(() => {
    if (productIds.length === 0) {
      return;
    }

    // eslint-disable-next-line functional/no-let
    let active = true;
    fetchProductsContractUpdateStatus(party.partyId, productIds)
      .then((result) => {
        if (active) {
          setStatusResult({ partyId: party.partyId, productIds, statuses: result });
        }
      })
      .catch((error) => {
        if (active) {
          setStatusResult({ partyId: party.partyId, productIds, statuses: [] });
          dispatch(
            appStateActions.addError({
              id: `fetchProductsContractUpdateStatus-${party.partyId}`,
              blocking: false,
              error,
              techDescription: `Something went wrong retrieving document status for party ${party.partyId}`,
              toNotify: true,
            })
          );
        }
      });

    return () => {
      active = false;
    };
  }, [dispatch, party.partyId, productIds]);

  return (
    <Grid sx={{ width: '100%', px: 3, mt: 3 }}>
      <Grid item xs={12}>
        <TitleBox
          variantTitle="h4"
          variantSubTitle="body1"
          mbTitle={2}
          mbSubTitle={5}
          title={t('documents.title')}
          subTitle={t('documents.subTitle')}
        />
      </Grid>
      {productIds.length > 0 && statuses === undefined ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress aria-label={t('documents.title')} />
        </Box>
      ) : (
        <ProductCards
          party={party}
          products={products}
          documentProducts={documentProducts}
          statuses={statuses ?? []}
        />
      )}
    </Grid>
  );
};

export default DashboardDocuments;
