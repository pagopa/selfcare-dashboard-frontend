import { appStateActions } from '@pagopa/selfcare-common-frontend/lib/redux/slices/appStateSlice';
import TitleBox from '@pagopa/selfcare-common-frontend/lib/components/TitleBox';
import { Grid } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { useAppDispatch } from '../../../redux/hooks';
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

const DashboardDocuments = ({ party, products }: DocumentsProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const documentProducts = useMemo(() => getDocumentProducts(party, products), [party, products]);
  const productIds = useMemo(() => getDocumentProductIds(documentProducts), [documentProducts]);
  const [statuses, setStatuses] = useState<Array<ProductContractUpdateStatus>>([]);

  useEffect(() => {
    if (productIds.length === 0) {
      return;
    }

    // eslint-disable-next-line functional/no-let
    let active = true;
    fetchProductsContractUpdateStatus(party.partyId, productIds)
      .then((result) => {
        if (active) {
          setStatuses(result);
        }
      })
      .catch((error) => {
        if (active) {
          setStatuses([]);
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
      <ProductCards
        party={party}
        products={products}
        documentProducts={documentProducts}
        statuses={statuses}
      />
    </Grid>
  );
};

export default DashboardDocuments;
