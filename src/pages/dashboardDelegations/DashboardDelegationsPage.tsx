import { Box, Button, Divider, Grid, Link, Typography } from '@mui/material';
import { NavigationBar, TitleBox, useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend';
import { useEffect, useState } from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { ProductAvatar } from '@pagopa/mui-italia';
import { Party } from '../../model/Party';
import { DASHBOARD_ROUTES } from '../../routes';
import { Product } from '../../model/Product';
import { TechnologyPartner } from '../../model/TechnologyPartner';

type Props = {
  isDelegateSectionVisible?: boolean;
  party: Party;
  delegateEnabledProducts: Array<Product>;
};

export default function DashboardDelegationsPage({
  isDelegateSectionVisible,
  party,
  delegateEnabledProducts,
}: Props) {
  const [isError, setIsError] = useState<boolean>(false);
  const { t } = useTranslation();
  const onExit = useUnloadEventOnExit();
  const overviewRoute = DASHBOARD_ROUTES.OVERVIEW.path;
  const [_techPartners, setTechPartners] = useState<Array<TechnologyPartner>>();
  const overviewPath = resolvePathVariables(overviewRoute, {
    partyId: party.partyId,
  });

  useEffect(() => {
    if (!isDelegateSectionVisible) {
      setIsError(true);
    }
  }, [isDelegateSectionVisible]);

  const history = useHistory();

  const goBack = () => {
    history.goBack();
  };
  const paths = [
    {
      description: t('overview.delegationsPage.delegationsNavigationBar.redirectDescription'),
      icon: AssignmentIcon,
      onClick: () => onExit(() => history.push(party.partyId ? overviewPath : overviewRoute)),
    },
    {
      description: t('overview.delegationsPage.delegationsNavigationBar.titlePageDescription'),
    },
  ];

  useEffect(() => {
    setTechPartners([
      {
        name: 'PT Prova',
        id: '1',
      },
    ]);
  }, []);

  return (
    <>
      {!isError ? (
        <Box p={3} sx={{ width: '100%' }}>
          <Grid
            container
            alignItems={'center'}
            px={3}
            mt={3}
            sx={{ width: '100%', backgroundColor: 'transparent !important' }}
          >
            <Grid container item xs={12}>
              <Grid item xs={12} mb={3}>
                <NavigationBar showBackComponent={true} goBack={goBack} paths={paths} />
              </Grid>
              <Grid item xs={12}>
                <TitleBox
                  variantTitle="h4"
                  variantSubTitle="body1"
                  title={t('overview.delegationsPage.title')}
                  subTitle={t('overview.delegationsPage.subTitle')}
                  mbTitle={2}
                  mbSubTitle={6}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display={'flex'} alignItems="center" justifyContent={'space-between'}>
                  <Box>
                    <Typography variant="h6">
                      {t('overview.delegationsPage.productsSection.title')}
                    </Typography>
                  </Box>
                  <Box>
                    <Button variant="contained" sx={{ height: '40px' }} onClick={() => ''}>
                      {t('overview.delegationsPage.addDelegationsBtn')}
                    </Button>
                  </Box>
                </Box>
              </Grid>
              {isDelegateSectionVisible &&
                delegateEnabledProducts.map((product) => (
                  <Box
                    key={product.id}
                    width="100%"
                    height={'153px'}
                    sx={{ backgroundColor: 'white' }}
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
                        <Typography variant="h6">{product.description}</Typography>
                      </Box>
                    </Box>

                    <Box>
                      <Grid item xs={12} my={3}>
                        <Divider sx={{ borderColor: 'background.default' }} />
                      </Grid>
                    </Box>

                    <Box display={'flex'}>
                      <Grid item xs={2}>
                        <Typography variant="body1" sx={{ fontSize: '16px' }}>
                          {t('overview.delegationsPage.productsSection.labelDelegates')}
                        </Typography>
                      </Grid>

                      <Grid item xs={10}>
                        <Typography variant="body1" sx={{ fontSize: '16px' }}>
                          <Trans
                            i18nKey={'overview.delegationsPage.productsSection.noDelegatesLabel'}
                          >
                            Nessun delegato per questo prodotto.
                            <Link
                              onClick={() => onExit(() => '')} // TODO: add link to redirect in add delegates
                              sx={{
                                fontWeight: 'fontWeightMedium',
                                ml: 1,
                                textDecoration: 'none',
                                cursor: 'pointer',
                              }}
                            >
                              Aggiungi delega
                            </Link>
                          </Trans>
                        </Typography>
                      </Grid>
                    </Box>
                  </Box>
                ))}
            </Grid>
          </Grid>
        </Box>
      ) : (
        <Typography variant="h1" sx={{ fontWeight: '700' }}>
          NON SEI ABILITATO
        </Typography>
      )}
    </>
  );
}
