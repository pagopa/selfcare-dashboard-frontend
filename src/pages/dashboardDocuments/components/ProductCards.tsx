import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { usePermissions } from '@pagopa/selfcare-common-frontend/lib/hooks/usePermissions';
import { Actions } from '@pagopa/selfcare-common-frontend/lib/utils/constants';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SubProductResource } from '../../../api/generated/b4f-dashboard/SubProductResource';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
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
    (ip) => ip.productId === product.id && product.status === 'ACTIVE'
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
  const displayProducts = useMemo(
    () =>
      products
        .map((product) => isProductEligible(product, party, hasPermission))
        .filter((product): product is Product => product !== null),
    [products, party, hasPermission]
  );

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
              src={product.logo}
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
            endIcon={<ArrowForwardIosIcon />}
            onClick={() => console.log('view product details', product)}
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
