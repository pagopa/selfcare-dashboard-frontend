import { OpenInNew } from '@mui/icons-material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import {
  Box,
  Breadcrumbs,
  Chip,
  Grid,
  IconButton,
  Link,
  ListItem,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend/lib';
import BackComponent from '@pagopa/selfcare-common-frontend/lib/components/BackComponent';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { storageTokenOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { OnboardingInfo } from '../../api/generated/b4f-dashboard/OnboardingInfo';
import { ReactComponent as FileCopyOff } from '../../assets/file_copy_off.svg';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { DASHBOARD_ROUTES } from '../../routes';
import { getOnboardingInfo } from '../../services/partyService';
import {
  LOADING_TASK_FETCH_CONTRACT,
  LOADING_TASK_FETCH_ONBOARDING_INFO,
  PRODUCT_IDS,
} from '../../utils/constants';
import { ENV } from '../../utils/env';

type DocDetailsProps = {
  party: Party;
  products: Array<Product>;
};

const DashboardDocumentsDetail = ({ party, products }: DocDetailsProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const showBackComponent = useMediaQuery('@media (max-width: 600px)');
  const addError = useErrorDispatcher();
  const setLoadingOnboardingInfo = useLoading(LOADING_TASK_FETCH_ONBOARDING_INFO);
  const setLoadigContract = useLoading(LOADING_TASK_FETCH_CONTRACT);

  const [documents, setDocuments] = useState<Array<OnboardingInfo>>([]);

  const productTitle = new URLSearchParams(window.location.search).get('productTitle');
  const productId = new URLSearchParams(window.location.search).get('productId');
  const subProductId = new URLSearchParams(window.location.search).get('subProductId') ?? undefined;
  const productIds = subProductId ? `${productId},${subProductId}` : `${productId}`;

  const mapProductIdToTitle = (id: string) => {
    if (id === PRODUCT_IDS.PAGOPA_DASHBOARD_PSP) {
      return products.find((p) => p.id === PRODUCT_IDS.PAGOPA)?.title;
    } else {
      const product = products.find((p) => p.id === id);
      const subProduct = products
        .find((p) => p.id === productId)
        ?.subProducts?.find((p) => p.id === id);

      return product ? product.title : subProduct?.title ?? '';
    }
  };

  useEffect(() => {
    if (productId) {
      setLoadingOnboardingInfo(true);
      getOnboardingInfo(party.partyId, productIds)
        .then((res) => {
          setDocuments(res);
        })
        .catch((error) => {
          addError({
            id: `getOnboardingInfo-${party.partyId}`,
            blocking: false,
            error,
            techDescription: `Something gone wrong retrieving onboarding info with party id ${party.partyId}`,
            toNotify: true,
          });
        })
        .finally(() => setLoadingOnboardingInfo(false));
    }
  }, [productId, subProductId]);

  const openContractFile = (productId?: string) => {
    if (!productId) {
      return;
    }

    const token = storageTokenOps.read();

    trackEvent('DASHBOARD_VIEW_DOCUMENT', {
      product_role: party.products.find((p) => p.productId === productId)?.userRole,
      product_id: productId,
      party_id: party.partyId,
    });

    setLoadigContract(true);

    void fetch(
      `${ENV.URL_API.API_DASHBOARD}/v2/institutions/${party.partyId}/contract?productId=${productId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'content-type': 'application/octet-stream',
        },
      }
    )
      .then(async (response) => {
        if (!response.ok) {
          return addError({
            id: `contract-${productId}`,
            blocking: false,
            error: new Error(),
            techDescription: `Something gone wrong retrieving contract with product id ${productId}`,
            toNotify: true,
          });
        }

        try {
          const arrayBuffer = await response.arrayBuffer();

          const pdfBlob = new Blob([arrayBuffer], { type: 'application/pdf' });

          const pdfUrl = URL.createObjectURL(pdfBlob);

          window.open(pdfUrl, '_blank');
        } catch (error) {
          addError({
            id: `contract-${productId}`,
            blocking: false,
            error: error as Error,
            techDescription: `Something gone wrong decoding contract with product id ${productId}`,
            toNotify: true,
          });
        }
      })
      .catch((error) => {
        addError({
          id: `contract-${productId}`,
          blocking: false,
          error,
          techDescription: `Something gone wrong retrieving contract with product id ${productId}`,
          toNotify: true,
        });
      })
      .finally(() => setLoadigContract(false));
  };

  return (
    <Grid sx={{ width: '100%', px: 3, mt: 3 }}>
      {showBackComponent && (
        <BackComponent
          goBack={() => history.goBack()}
          backLabel={t('documents.backButton')}
          color={'primary.main'}
        />
      )}

      {!showBackComponent && (
        <Breadcrumbs
          aria-label="breadcrumb"
          separator={<ArrowForwardIosIcon style={{ height: '8px', width: '8px' }} />}
        >
          <ButtonNaked
            onClick={() =>
              history.push(
                resolvePathVariables(DASHBOARD_ROUTES.DOCUMENTS.path, { partyId: party.partyId })
              )
            }
            size="medium"
          >
            {t('documents.title')}
          </ButtonNaked>
          <Link color="text.disabled" underline="none">
            {productTitle}
          </Link>
        </Breadcrumbs>
      )}
      <Typography variant="h4" fontWeight={'fontWeightBold'} mt={1}>
        {productTitle}
      </Typography>
      <Grid
        container
        mt={3}
        sx={{ gap: '8px' }}
        alignItems="flex-start"
        justifyContent="space-between"
        flexWrap={{ xs: 'wrap', md: 'nowrap' }}
      >
        <Grid
          item
          xs={12}
          md={6}
          p={3}
          bgcolor={'background.paper'}
          sx={{ height: 'auto', alignSelf: 'flex-start' }}
          borderRadius={'8px'}
        >
          <Typography fontSize={'14px'} fontWeight={'fontWeightBold'} mb={3}>
            {t('documentsDetails.firstCard.title')}
          </Typography>
          <Grid container alignItems="center">
            <Grid item xs={4}>
              <ListItem sx={{ p: 0, width: 'auto', mr: 1 }}>
                {t('documentsDetails.firstCard.state')}
              </ListItem>
            </Grid>
            <Chip label={t('documentsDetails.firstCard.active')} color="success" />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          md={6}
          p={3}
          bgcolor={'background.paper'}
          borderRadius={'8px'}
          sx={{ height: 'auto', alignSelf: 'flex-start' }}
        >
          <Typography fontSize={'14px'} fontWeight={'fontWeightBold'}>
            {t('documentsDetails.secondCard.title')}
          </Typography>

          <Grid mt={3} spacing={1}>
            {documents.map((doc, i) => (
              <Grid container key={i} alignItems="center" spacing={1} marginBottom={3}>
                <Grid item ml={4}>
                  <Grid display="flex">
                    {doc.contractAvailable ? (
                      <InsertDriveFileIcon color="primary" />
                    ) : (
                      <FileCopyOff />
                    )}
                  </Grid>
                </Grid>

                <Grid item xs>
                  <Box display="flex" flexDirection="column">
                    {(documents.length > 1 || !doc.contractAvailable) && (
                      <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                        {mapProductIdToTitle(doc.productId ?? '')}
                      </Typography>
                    )}

                    {doc.contractAvailable ? (
                      <ButtonNaked
                        color="primary"
                        onClick={() => openContractFile(doc.productId)}
                        sx={{ textAlign: 'start', justifyContent: 'flex-start' }}
                        component={'a'}
                        size="medium"
                      >{`Contratto_di_adesione_${mapProductIdToTitle(
                        doc.productId ?? ''
                      )}`}</ButtonNaked>
                    ) : (
                      <Typography variant="body2">
                        {t('documentsDetails.secondCard.noDocumentFound')}
                      </Typography>
                    )}
                  </Box>
                </Grid>

                {doc.contractAvailable && (
                  <Grid item>
                    <Box display="flex" alignItems="center" height="100%">
                      <IconButton onClick={() => openContractFile(doc.productId)}>
                        <OpenInNew />
                      </IconButton>
                    </Box>
                  </Grid>
                )}
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardDocumentsDetail;
