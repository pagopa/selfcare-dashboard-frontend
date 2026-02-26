import { Box, Button, CircularProgress, Divider, Grid, Link, Typography } from '@mui/material';
import { ButtonNaked, ProductAvatar } from '@pagopa/mui-italia';
import {
  TitleBox,
  useErrorDispatcher,
  usePermissions,
  useUnloadEventOnExit,
} from '@pagopa/selfcare-common-frontend';
import { Actions } from '@pagopa/selfcare-common-frontend/utils/constants';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { DelegationResource } from '../../api/generated/b4f-dashboard/DelegationResource';
import { Party } from '../../model/Party';
import { Product } from '../../model/Product';
import { DASHBOARD_ROUTES } from '../../routes';
import { fetchDelegations } from '../../services/delegationServices';

type Props = {
  party: Readonly<Party>;
  authorizedDelegableProducts: Readonly<Array<Product>>;
};

export default function DashboardDelegationsPage({
  party,
  authorizedDelegableProducts,
}: Readonly<Props>) {
  const { t } = useTranslation();
  const onExit = useUnloadEventOnExit();
  const history = useHistory();
  const addError = useErrorDispatcher();
  const { hasPermission } = usePermissions();

  const [delegationsList, setDelegationsList] = useState<Array<DelegationResource>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const canCreateDelegation = authorizedDelegableProducts.some((p) =>
    hasPermission(p.id, Actions.CreateDelegation)
  );

  const retrieveDelegationsList = async () => {
    setLoading(true);
    await fetchDelegations(party.partyId)
      .then((r) => setDelegationsList(r))
      .catch((reason) => {
        addError({
          id: `FETCH_PARTY_DELEGATIONS_ERROR-${party.partyId}`,
          blocking: true,
          component: 'SessionModal',
          error: reason,
          techDescription: `Something gone wrong while fetching delegations with party id ${party.partyId}`,
          displayableTitle: t('overview.genericError.title'),
          displayableDescription: (
            <Trans i18nKey="overview.genericError.description">
              A causa di un errore del sistema non è possibile completare la procedura.
              <br />
              Ti chiediamo di riprovare più tardi.
            </Trans>
          ),
          toNotify: true,
        });
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void retrieveDelegationsList();
  }, []);

  const goToAddDelegationsPage = (productId?: string) =>
    onExit(() =>
      history.push(
        resolvePathVariables(DASHBOARD_ROUTES.ADD_DELEGATE.path, {
          partyId: party.partyId,
        }).concat(productId ? `?productId=${productId}` : '')
      )
    );

  return (
    <>
      {!loading ? (
        <Box p={3} sx={{ width: '100%' }}>
          <Grid
            container
            alignItems={'center'}
            px={3}
            sx={{ width: '100%', backgroundColor: 'transparent !important' }}
          >
            <Grid container item xs={12}>
              <Grid item xs={12}>
                <TitleBox
                  variantTitle="h4"
                  variantSubTitle="body1"
                  title={t('overview.delegationsPage.title')}
                  subTitle={t('overview.delegationsPage.subTitle')}
                  mbTitle={2}
                  mbSubTitle={1}
                />
              </Grid>
              <Grid item xs={12} mb={5}>
                <ButtonNaked
                  component="button"
                  color="primary"
                  sx={{ fontWeight: 'fontWeightBold', fontSize: '14', textDecoration: 'underline' }}
                  onClick={() => {
                    window.open(
                      'https://docs.pagopa.it/manuale-di-area-riservata-per-partner-tecnologici/aggiunta-di-una-delega-da-parte-dellente#cose-una-delega'
                    );
                  }}
                >
                  {t('overview.delegationsPage.whatIsDelegation')}
                </ButtonNaked>
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                  <Box>
                    <Typography variant="h6" fontWeight={'fontWeightBold'}>
                      {t('overview.delegationsPage.productsSection.title')}
                    </Typography>
                  </Box>
                  {canCreateDelegation && (
                    <Box>
                      <Button
                        variant="contained"
                        sx={{ height: '40px' }}
                        onClick={() => goToAddDelegationsPage()}
                      >
                        {t('overview.delegationsPage.addDelegationsBtn')}
                      </Button>
                    </Box>
                  )}
                </Box>
              </Grid>
              {authorizedDelegableProducts.map((product) => {
                const delegatesByProduct = delegationsList.filter(
                  (dl) => dl.productId === product.id
                );
                return (
                  <Box
                    key={product.id}
                    width="100%"
                    height={'100%'}
                    sx={{ backgroundColor: 'background.paper' }}
                    p={3}
                    mt={2}
                  >
                    <Box display={'flex'}>
                      <Box mr={2}>
                        <ProductAvatar
                          logoUrl={product.logo}
                          logoBgColor={product.logoBgColor}
                          logoAltText={`${product.title} logo`}
                          size="small"
                        />
                      </Box>
                      <Box>
                        <Typography variant="h6" fontWeight={'fontWeightBold'}>
                          {product.title}
                        </Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Grid item xs={12} my={3}>
                        <Divider sx={{ borderColor: 'background.default' }} />
                      </Grid>
                    </Box>
                    {delegatesByProduct.length === 0 ? (
                      <Box display={'flex'}>
                        <Grid item xs={3}></Grid>
                        <Grid item xs={9}>
                          {hasPermission(product.id, Actions.CreateDelegation) ? (
                            <Typography variant="body1" sx={{ fontSize: '16px' }}>
                              <Trans
                                i18nKey={
                                  'overview.delegationsPage.productsSection.noDelegatesLabelWithLink'
                                }
                              >
                                Nessun delegato per questo prodotto.
                                <Link
                                  onClick={() => goToAddDelegationsPage(product?.id)}
                                  sx={{
                                    fontWeight: 'fontWeightMedium',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                  }}
                                >
                                  creane una adesso
                                </Link>
                              </Trans>
                            </Typography>
                          ) : (
                            <Typography variant="body1" sx={{ fontSize: '16px' }}>
                              {t('overview.delegationsPage.productsSection.noDelegatesLabel')}
                            </Typography>
                          )}
                        </Grid>
                      </Box>
                    ) : (
                      delegatesByProduct.map((del, index) => (
                        <Box key={del.id}>
                          <Box display={'flex'}>
                            <Grid item xs={3}>
                              <Typography variant="body1" sx={{ fontSize: '16px' }}>
                                {t('overview.delegationsPage.productsSection.labelDelegates')}
                              </Typography>
                            </Grid>
                            <Grid item xs={9}>
                              <Typography sx={{ fontSize: '16px', fontWeight: 'fontWeightMedium' }}>
                                {del.brokerName}
                              </Typography>
                            </Grid>
                          </Box>
                          {delegationsList.length - 1 !== index && (
                            <Box>
                              <Grid item xs={12} my={3}>
                                <Divider sx={{ borderColor: 'background.default' }} />
                              </Grid>
                            </Box>
                          )}
                        </Box>
                      ))
                    )}
                  </Box>
                );
              })}
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Box display={'flex'} justifyContent="center" alignItems={'center'} width={'100%'}>
          <CircularProgress />
        </Box>
      )}
    </>
  );
}
