import { Grid, Tab, Tabs, Typography } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import React, { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { HashLink } from 'react-router-hash-link';
import useScrollSpy from 'react-use-scrollspy';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { useTranslation } from 'react-i18next';
import { Product, ProductsMap } from '../../model/Product';
import { Party } from '../../model/Party';
import { useAppSelector } from '../../redux/hooks';
import AddGroupButton from './components/AddGroupButton';
import NoGroups from './components/NoGroups';
import GroupsProductSection from './components/GroupsProductSection';

interface Props {
  party: Party;
  activeProducts: Array<Product>;
  productsMap: ProductsMap;
}

function GroupsPage({ party, activeProducts, productsMap }: Props) {
  useEffect(() => trackEvent('GROUP_LIST', { party_id: party.institutionId }), [party]);
  const { t } = useTranslation();

  const prodSectionRefs = useMemo(
    () => activeProducts.map((_) => React.createRef<HTMLDivElement>()),
    [activeProducts]
  );

  const activeSection = useScrollSpy({ sectionElementRefs: prodSectionRefs, offsetPx: -80 });

  const scrollWithOffset = (el: HTMLElement) => {
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -80;
    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });
  };

  const currentUser = useAppSelector(userSelectors.selectLoggedUser) as User;

  const [productsFetchStatus, setProductsFetchStatus] = useState<
    Record<string, { loading: boolean; noData: boolean }>
  >(() =>
    Object.fromEntries(activeProducts.map((p) => [[p.id], { loading: true, noData: false }]))
  );

  const productHavingGroups = useMemo(
    () =>
      Object.entries(productsFetchStatus)
        .filter(([_productId, { noData }]) => !noData)
        .map(([productId]) => productsMap[productId]),
    [productsFetchStatus]
  );

  const isLoading: boolean = useMemo(
    () => !!Object.entries(productsFetchStatus).find(([_productId, { loading }]) => loading),
    [productsFetchStatus]
  );

  const titleVariant = 'h1';
  const mbTitle = 2;

  return (
    <Grid
      container
      px={2}
      mt={10}
      sx={{ width: '985px', backgroundColor: 'transparent !important' }}
    >
      <Grid item xs={12}>
        <Grid container direction="row" justifyContent="space-between" columns={9}>
          <Grid item xs={6}>
            <TitleBox
              title={t('dashboardGroup.groupsPage.title')}
              variantTitle={titleVariant}
              mbTitle={mbTitle}
              subTitle={t('dashboardGroup.groupsPage.subTitle')}
            />
          </Grid>
          {productHavingGroups.length > 0 && (
            <Grid item xs={1}>
              <Typography variant={titleVariant} mb={mbTitle}>
                &nbsp;
              </Typography>
              <AddGroupButton party={party} />
            </Grid>
          )}
        </Grid>
      </Grid>

      {productHavingGroups.length > 1 && (
        <Grid
          item
          xs={12}
          mt={5}
          sx={{
            borderBottom: 1,
            borderBottomWidth: '2px',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            backgroundColor: '#F5F6F7',
          }}
        >
          <Tabs variant="fullWidth" scrollButtons="auto" value={activeSection}>
            {productHavingGroups.map((p, i) => (
              <Tab
                key={p.id}
                label={p.title}
                component={HashLink}
                to={`#${p.id}`}
                value={i}
                scroll={scrollWithOffset}
              />
            ))}
          </Tabs>
        </Grid>
      )}
      <Grid item xs={12} sx={{ height: '100%' }}>
        <Grid container direction="row" alignItems={'center'}>
          {activeProducts.map((product, i) => (
            <Grid key={product.id} item xs={12} ref={prodSectionRefs[i]}>
              <GroupsProductSection
                currentUser={currentUser}
                party={party}
                product={product}
                onFetchStatusUpdate={(loading, noData) => {
                  setProductsFetchStatus((previousState) => ({
                    ...previousState,
                    [product.id]: { loading, noData },
                  }));
                }}
              />
            </Grid>
          ))}
          {!isLoading && productHavingGroups.length === 0 && <NoGroups party={party} />}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default GroupsPage;
