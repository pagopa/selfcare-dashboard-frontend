import { Grid } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import { useTranslation } from 'react-i18next';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import ProductCards from './components/ProductCards';

type DocumentsProps = {
  party: Party;
  products: Array<Product>;
};

const DashboardDocuments = ({ party, products }: DocumentsProps) => {
  const { t } = useTranslation();

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
      <ProductCards party={party} products={products} />
    </Grid>
  );
};

export default DashboardDocuments;
