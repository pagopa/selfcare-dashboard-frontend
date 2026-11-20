import ArrowForward from '@mui/icons-material/ArrowForward';
import Cached from '@mui/icons-material/Cached';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { MIAlert, MIButton, MIChip } from '@pagopa/mui-italia';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib/hooks/usePermissions';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { Party } from '../../../../model/Party';
import { Product } from '../../../../model/Product';
import { DASHBOARD_ROUTES } from '../../../../routes';
import { ProductContractUpdateStatus } from '../../../../services/contractUpdateService';
import { PRODUCT_IDS } from '../../../../utils/constants';
import { ENV } from '../../../../utils/env';
import { DocumentProduct, UPDATE_CONTRACT_ACTION } from '../productUtils';
import { PendingRequestDialog } from './PendingRequestDialog';

type ProductCardsProps = {
  party: Party;
  products: Array<Product>;
  documentProducts: Array<DocumentProduct>;
  statuses: Array<ProductContractUpdateStatus>;
};

type ProductCardProps = {
  party: Party;
  products: Array<Product>;
  documentProduct: DocumentProduct;
  status?: ProductContractUpdateStatus;
  canViewDocuments: boolean;
  canUpdateContract: boolean;
  onAddDocument: (productId: string, isInProgress: boolean) => void;
};

const ProductCard = ({
  party,
  products,
  documentProduct,
  status,
  canViewDocuments,
  canUpdateContract,
  onAddDocument,
}: ProductCardProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const { product, productId, parentProduct, parentProductId } = documentProduct;
  const hasMissingDocument = status?.contractUpdateRequired === true;
  const title =
    productId === PRODUCT_IDS.PAGOPA_DASHBOARD_PSP
      ? products.find((candidate) => candidate.id === PRODUCT_IDS.PAGOPA)?.title
      : product.title;
  const displayedTitle = title ?? productId;
  const logo =
    productId === PRODUCT_IDS.PAGOPA_DASHBOARD_PSP
      ? products.find((candidate) => candidate.id === PRODUCT_IDS.PAGOPA)?.logo
      : product.logo;
  const logoAltTitle = product.title ?? parentProduct.title ?? displayedTitle;
  const canAddDocument = hasMissingDocument && canUpdateContract;

  const handleViewDocuments = () => {
    trackEvent('DASHBOARD_OPEN_PRODUCT_DOCUMENT', {
      product_role:
        party.products.find((onboardedProduct) => onboardedProduct.productId === productId)
          ?.userRole ??
        party.products.find((onboardedProduct) => onboardedProduct.productId === parentProductId)
          ?.userRole,
      product_id: productId,
      party_id: party.partyId,
    });

    const baseProductId = parentProduct.id ?? productId;
    const baseUrl = resolvePathVariables(DASHBOARD_ROUTES.DOCUMENTS_DETAIL.path, {
      partyId: party.partyId,
    });
    const subProductQuery = baseProductId !== productId ? `&subProductId=${productId}` : '';

    history.push(
      `${baseUrl}?productId=${baseProductId}${subProductQuery}&productTitle=${encodeURIComponent(
        displayedTitle
      )}`
    );
  };

  return (
    <Card
      key={productId}
      sx={{
        width: '100%',
        border: 1,
        borderColor: 'divider',
        boxShadow: 0,
        display: 'flex',
        alignItems: 'center',
        py: 2,
        px: 2,
      }}
    >
      <Box
        sx={{
          backgroundColor: product.logoBgColor ?? parentProduct.logoBgColor,
          borderRadius: 1,
          border: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          marginRight: 2,
          flexShrink: 0,
        }}
      >
        <img
          src={logo ?? parentProduct.logo}
          alt={`${logoAltTitle} logo`}
          style={{
            maxWidth: '80%',
            maxHeight: '80%',
            objectFit: 'contain',
          }}
        />
      </Box>
      <CardContent
        sx={{
          flexGrow: 1,
          padding: '0 !important',
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="body1" component="div" fontWeight="fontWeightMedium">
          {displayedTitle}
        </Typography>
        {hasMissingDocument && <MIChip color="warning" label={t('documents.missingDocument')} />}
      </CardContent>
      {(canViewDocuments || canAddDocument) && (
        <MIButton
          variant="text"
          endIcon={canAddDocument ? <Cached /> : <ArrowForward />}
          onClick={() =>
            canAddDocument
              ? onAddDocument(
                  status?.productId ?? parentProductId,
                  status?.contractUpdateInProgress === true
                )
              : handleViewDocuments()
          }
          sx={{ whiteSpace: 'nowrap' }}
        >
          {canAddDocument ? t('documents.addDocument') : t('documents.viewMore')}
        </MIButton>
      )}
    </Card>
  );
};

const ProductCards: React.FC<ProductCardsProps> = ({
  party,
  products,
  documentProducts,
  statuses,
}) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const history = useHistory();
  const location = useLocation();
  const [pendingRequestProductId, setPendingRequestProductId] = useState<string>();

  const canViewProductDocuments = ({ productId, parentProductId }: DocumentProduct) =>
    hasPermission(productId, Actions.ViewContract) ||
    hasPermission(parentProductId, Actions.ViewContract);
  const statusesByProductId = useMemo(
    () => new Map(statuses.map((status) => [status.productId, status])),
    [statuses]
  );
  const productsWithPermission = useMemo(
    () => documentProducts.filter(canViewProductDocuments),
    [documentProducts, canViewProductDocuments]
  );
  const productsWithoutPermission = useMemo(
    () => documentProducts.filter((product) => !productsWithPermission.includes(product)),
    [documentProducts, productsWithPermission]
  );
  const hasMissingDocuments = documentProducts.some(
    ({ parentProductId }) => statusesByProductId.get(parentProductId)?.contractUpdateRequired
  );

  const openContractUpdate = (productId: string, isInProgress: boolean) => {
    if (isInProgress) {
      setPendingRequestProductId(productId);
      return;
    }

    history.push(
      resolvePathVariables(ENV.ROUTES.CONTRACT_UPDATE, {
        partyId: party.partyId,
        productId,
      }),
      { returnTo: `${location.pathname}${location.search}${location.hash}` }
    );
  };

  const renderProductCard = (documentProduct: DocumentProduct) => {
    const status = statusesByProductId.get(documentProduct.parentProductId);
    return (
      <ProductCard
        key={documentProduct.productId}
        party={party}
        products={products}
        documentProduct={documentProduct}
        status={status}
        canViewDocuments={canViewProductDocuments(documentProduct)}
        canUpdateContract={
          hasPermission(documentProduct.parentProductId, Actions.ViewContract) &&
          hasPermission(documentProduct.parentProductId, UPDATE_CONTRACT_ACTION)
        }
        onAddDocument={openContractUpdate}
      />
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 3 }}>
      {hasMissingDocuments && (
        <MIAlert severity="warning" title={t('documents.missingDocuments.title')}>
          {t('documents.missingDocuments.description')}
        </MIAlert>
      )}
      {productsWithPermission.map(renderProductCard)}
      {productsWithoutPermission.length > 0 && (
        <>
          <Typography variant="body2" color="text.secondary">
            {t('documents.otherProducts')}
          </Typography>
          {productsWithoutPermission.map(renderProductCard)}
        </>
      )}
      <PendingRequestDialog
        open={pendingRequestProductId !== undefined}
        partyId={party.partyId}
        productId={pendingRequestProductId ?? ''}
        onClose={() => setPendingRequestProductId(undefined)}
      />
    </Box>
  );
};

export default ProductCards;
