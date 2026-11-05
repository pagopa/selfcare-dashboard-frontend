import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import {
  Box,
  Breadcrumbs,
  Chip,
  Grid,
  IconButton,
  Link,
  Stack,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useErrorDispatcher, useLoading } from '@pagopa/selfcare-common-frontend/lib';
import BackComponent from '@pagopa/selfcare-common-frontend/lib/components/BackComponent';
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/lib/utils/routes-utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import {
  DocumentResource,
  TypeEnum as DocumentTypeEnum,
} from '../../../api/generated/b4f-dashboard/DocumentResource';
import FileCopyOff from '../../../assets/file_copy_off.svg?react';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { DASHBOARD_ROUTES } from '../../../routes';
import { getDocument, getDocumentsList } from '../../../services/documentService';
import {
  LOADING_TASK_FETCH_CONTRACT,
  LOADING_TASK_FETCH_DOCUMENTS_LIST,
  PRODUCT_IDS,
} from '../../../utils/constants';

type DocDetailsProps = {
  party: Party;
  products: Array<Product>;
};

type DisplayDocument = {
  type: DocumentTypeEnum;
  name?: string;
  label: string;
};

type ProductDocuments = {
  productId: string;
  documents: Array<DisplayDocument>;
};

// BE document names may come without extension: documents are PDFs
const withPdfExtension = (fileName: string) =>
  /\.[a-z0-9]+$/i.test(fileName) ? fileName : `${fileName}.pdf`;

const saveFile = (blob: Blob, fileName: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const DashboardDocumentsDetail = ({ party, products }: DocDetailsProps) => {
  const { t } = useTranslation();
  const history = useHistory();
  const showBackComponent = useMediaQuery('@media (max-width: 600px)');
  const addError = useErrorDispatcher();
  const setLoadingDocumentsList = useLoading(LOADING_TASK_FETCH_DOCUMENTS_LIST);
  const setLoadingDocument = useLoading(LOADING_TASK_FETCH_CONTRACT);

  const [productsDocuments, setProductsDocuments] = useState<Array<ProductDocuments>>([]);

  const searchParams = new URLSearchParams(window.location.search);
  const productTitle = searchParams.get('productTitle');
  const productId = searchParams.get('productId');
  const subProductId = searchParams.get('subProductId') ?? undefined;

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

  // A contract without name is still downloadable (the name is mandatory only for attachments)
  const toDisplayDocuments = (
    docProductId: string,
    documents: Array<DocumentResource>
  ): Array<DisplayDocument> =>
    documents.flatMap<DisplayDocument>(({ type, name }) => {
      if (type === DocumentTypeEnum.INSTITUTION) {
        return [
          {
            type,
            name,
            label: name || `Contratto_di_adesione_${mapProductIdToTitle(docProductId)}`,
          },
        ];
      }
      return type && name ? [{ type, name, label: name }] : [];
    });

  useEffect(() => {
    if (!productId) {
      return;
    }
    const productIds = subProductId ? [productId, subProductId] : [productId];

    setLoadingDocumentsList(true);
    // allSettled: a failing product must not hide the documents of the other one
    Promise.allSettled(
      productIds.map((id) =>
        getDocumentsList(party.partyId, id).then((documents) => ({
          productId: id,
          documents: toDisplayDocuments(id, documents),
        }))
      )
    )
      .then((results) => {
        setProductsDocuments(
          results.flatMap((result, i) => {
            if (result.status === 'fulfilled') {
              return [result.value];
            }
            addError({
              id: `getDocumentsList-${party.partyId}-${productIds[i]}`,
              blocking: false,
              error: result.reason,
              techDescription: `Something gone wrong retrieving documents list with party id ${party.partyId} and product id ${productIds[i]}`,
              toNotify: true,
            });
            return [];
          })
        );
      })
      .finally(() => setLoadingDocumentsList(false));
  }, [party.partyId, productId, subProductId]);

  const downloadDocument = (docProductId: string, doc: DisplayDocument) => {
    const fileName = withPdfExtension(doc.name || doc.label);

    trackEvent('DASHBOARD_VIEW_DOCUMENT', {
      product_role: party.products.find((p) => p.productId === docProductId)?.userRole,
      product_id: docProductId,
      party_id: party.partyId,
      document_type: doc.type,
    });

    setLoadingDocument(true);
    getDocument(party.partyId, docProductId, doc.type, doc.name)
      .then((blob) => saveFile(blob, fileName))
      .catch((error) => {
        addError({
          id: `getDocument-${docProductId}-${fileName}`,
          blocking: false,
          error,
          techDescription: `Something gone wrong retrieving document ${fileName} with product id ${docProductId}`,
          toNotify: true,
        });
      })
      .finally(() => setLoadingDocument(false));
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
      <Typography
        variant="h4"
        fontWeight={'fontWeightBold'}
        mt={1}
        sx={{ color: (theme) => theme.colors.neutral.black }}
      >
        {productTitle}
      </Typography>
      <Grid
        container
        mt={3}
        sx={{ gap: 2 }}
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
          <Typography variant="h6" mb={3} sx={{ color: (theme) => theme.colors.neutral.black }}>
            {t('documentsDetails.firstCard.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {t('documentsDetails.firstCard.state')}
          </Typography>
          <Chip size="small" label={t('documentsDetails.firstCard.active')} color="success" />
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
          <Typography variant="h6" mb={2} sx={{ color: (theme) => theme.colors.neutral.black }}>
            {t('documentsDetails.secondCard.title')}
          </Typography>

          <Stack spacing={3}>
            {productsDocuments.map(({ productId: docProductId, documents }) => (
              <Stack key={docProductId} spacing={2}>
                {subProductId && (
                  <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                    {mapProductIdToTitle(docProductId)}
                  </Typography>
                )}
                {documents.map((doc) => (
                  <Box
                    key={`${doc.type}-${doc.label}`}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    px={2}
                    py={1}
                    border={1}
                    borderColor="divider"
                    borderRadius={'8px'}
                  >
                    <ButtonNaked
                      color="primary"
                      onClick={() => downloadDocument(docProductId, doc)}
                      sx={{
                        textAlign: 'start',
                        justifyContent: 'flex-start',
                        color: (theme) => theme.colors.blue[500],
                      }}
                      component={'a'}
                      size="medium"
                    >
                      {doc.label}
                    </ButtonNaked>
                    <IconButton
                      sx={{ color: (theme) => theme.colors.blue[500] }}
                      aria-label={t('documentsDetails.secondCard.download', { name: doc.label })}
                      onClick={() => downloadDocument(docProductId, doc)}
                    >
                      <FileDownloadOutlinedIcon />
                    </IconButton>
                  </Box>
                ))}
                {!documents.some((doc) => doc.type === DocumentTypeEnum.INSTITUTION) && (
                  <Box display="flex" alignItems="center" gap={2}>
                    <FileCopyOff />
                    <Box display="flex" flexDirection="column">
                      <Typography variant="body1" fontWeight={'fontWeightMedium'}>
                        {mapProductIdToTitle(docProductId)}
                      </Typography>
                      <Typography variant="body2">
                        {t('documentsDetails.secondCard.noDocumentFound')}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Stack>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default DashboardDocumentsDetail;
