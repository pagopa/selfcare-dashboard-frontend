import { ArrowForward } from '@mui/icons-material';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib/hooks/usePermissions';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { SubProductResource } from '../../../api/generated/b4f-dashboard/SubProductResource';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { DASHBOARD_ROUTES } from '../../../routes';
import { PRODUCT_IDS } from '../../../utils/constants';

type ProductCardsProps = {
  party: Party;
  products: Array<Product>;
};

const isProductEligible = (
  product: Product,
  party: Party,
  hasPermission: (productId: string, action: Actions) => boolean
): Product | SubProductResource | null => {
  const baseInstitutionProduct = party.products.find(
    (ip) =>
      ip.productId === product.id &&
      product.status === 'ACTIVE' &&
      ip.productOnBoardingStatus === 'ACTIVE'
  );

  if (
    !baseInstitutionProduct ||
    baseInstitutionProduct.productOnBoardingStatus !== 'ACTIVE' ||
    !hasPermission(baseInstitutionProduct.productId ?? '', Actions.ViewContract)
  ) {
    return null;
  }

  // If no subproducts, return the base product
  if (!product.subProducts || product.subProducts.length === 0) {
    return product;
  }

  // Check child product
  const childProduct = product.subProducts[0];
  const childInstitutionProduct = party.products.find(
    (ip) => ip.productId === childProduct.id && childProduct.status === 'ACTIVE'
  );

  // Return child if active, otherwise base product
  return childInstitutionProduct?.productOnBoardingStatus === 'ACTIVE' ? childProduct : product;
};

const ProductCards: React.FC<ProductCardsProps> = ({ party, products }) => {
  const { t } = useTranslation();
  const { hasPermission } = usePermissions();
  const history = useHistory();

  const displayProducts = useMemo(
    () =>
      products
        .map((product) => isProductEligible(product, party, hasPermission))
        .filter((product): product is Product => product !== null),
    [products, party, hasPermission]
  );

  const handleProductClick = (product: Product) => {
    trackEvent('DASHBOARD_OPEN_PRODUCT_DOCUMENT', {
      product_role: party.products.find((p) => p.productId === product.id)?.userRole,
      product_id: product.id,
      party_id: party.partyId,
    });
    const baseUrl = resolvePathVariables(DASHBOARD_ROUTES.DOCUMENTS_DETAIL.path, {
      partyId: party.partyId,
    });

    const title =
      product.id === PRODUCT_IDS.PAGOPA_DASHBOARD_PSP
        ? products.find((p) => p.id === PRODUCT_IDS.PAGOPA)?.title
        : product.title;

    const encodedTitle = encodeURIComponent(title ?? '');

    // eslint-disable-next-line functional/no-let
    let queryParams = `?productId=${product.id}&productTitle=${encodedTitle}`;

    // Check if this product is a base product with an active subproduct
    if (product.subProducts && product.subProducts?.length > 0) {
      const activeSubProduct = product.subProducts.find((subProduct) =>
        party.products.some(
          (ip) => ip.productId === subProduct.id && ip.productOnBoardingStatus === 'ACTIVE'
        )
      );

      if (activeSubProduct) {
        queryParams += `&subProductId=${activeSubProduct.id}`;
      }
    }

    // Check if this product is a subproduct itself
    const parentProduct = products.find((p) => p.subProducts?.some((sub) => sub.id === product.id));

    if (parentProduct) {
      queryParams = `?productId=${parentProduct.id}&subProductId=${product.id}&productTitle=${encodedTitle}`;
    }

    history.push(baseUrl.concat(queryParams));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        gap: 5,
      }}
    >
      {displayProducts.map((product) => (
        <Card
          key={product.id}
          sx={{
            width: '100%',
            boxShadow: 1,
            display: 'flex',
            alignItems: 'center',
            py: 5,
            px: 3,
          }}
        >
          <Box
            sx={{
              backgroundColor: product.logoBgColor,
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 32,
              height: 32,
              marginRight: 2,
            }}
          >
            <img
              src={
                product.id === PRODUCT_IDS.PAGOPA_DASHBOARD_PSP
                  ? products.find((p) => p.id === PRODUCT_IDS.PAGOPA)?.logo
                  : product.logo
              }
              alt={`${product.title} logo`}
              style={{
                maxWidth: '80%',
                maxHeight: '80%',
                objectFit: 'contain',
              }}
            />
          </Box>
          <CardContent sx={{ flexGrow: 1, padding: '0 !important' }}>
            <Typography variant="h6" component="div">
              {product.id === PRODUCT_IDS.PAGOPA_DASHBOARD_PSP
                ? products.find((p) => p.id === PRODUCT_IDS.PAGOPA)?.title
                : product.title}
            </Typography>
          </CardContent>
          <ButtonNaked
            component="button"
            endIcon={<ArrowForward />}
            onClick={() => handleProductClick(product)}
            sx={{ color: 'primary.main', fontWeight: 'bold' }}
          >
            {t('documents.viewMore')}
          </ButtonNaked>
        </Card>
      ))}
    </Box>
  );
};

export default ProductCards;
