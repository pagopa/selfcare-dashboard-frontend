import { Grid, Tab, Tabs, Typography } from '@mui/material';
import TitleBox from '@pagopa/selfcare-common-frontend/components/TitleBox';
import React, { useEffect, useMemo, useState } from 'react';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { HashLink } from 'react-router-hash-link';
import useScrollSpy from 'react-use-scrollspy';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { Product, ProductsMap } from '../../model/Product';
import { Party } from '../../model/Party';
import { useAppSelector } from '../../redux/hooks';
import { PartyGroup } from '../../model/PartyGroup';
import { fetchPartyGroups } from '../../services/groupsService';
import { LOADING_TASK_FETCH_PARTY_GROUPS } from '../../utils/constants';
import AddGroupButton from './components/AddGroupButton';
import NoGroups from './components/NoGroups';
import GroupsProductSection from './components/GroupsProductSection';

interface Props {
  party: Party;
  activeProducts: Array<Product>;
  productsMap: ProductsMap;
}

type ProductId2GroupMap = { [productId: string]: [Product, Array<PartyGroup>] };

function GroupsPage({ party, activeProducts, productsMap }: Props) {
  useEffect(() => trackEvent('GROUP_LIST', { party_id: party.institutionId }), [party]);

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

  const currentUser = useAppSelector(userSelectors.selectLoggedUser);

  const [groupsByProduct, setGroupsByProduct] = useState<ProductId2GroupMap>();

  const setLoading = useLoading(LOADING_TASK_FETCH_PARTY_GROUPS);
  const addError = useErrorDispatcher();

  const fetchGroups = () => {
    setLoading(true);
    fetchPartyGroups(party, productsMap, currentUser ?? ({ uid: 'NONE' } as User), activeProducts)
      .then((data) => {
        setGroupsByProduct(
          data.reduce((acc, g) => {
            if (!acc[g.productId]) {
              // eslint-disable-next-line functional/immutable-data
              acc[g.productId] = [productsMap[g.productId], []];
            }
            // eslint-disable-next-line functional/immutable-data
            acc[g.productId][1].push(g);
            return acc;
          }, {} as ProductId2GroupMap)
        );
      })
      .catch((reason) =>
        addError({
          id: 'FETCH_PARTY_GROUPS_ERROR',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while fetching party groups ${party.institutionId}`,
          toNotify: true,
        })
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (party && activeProducts && activeProducts.length > 0) {
      fetchGroups();
    }
  }, [party, activeProducts]);

  const onProductGroupsTotallyDeleted = (product: Product) => {
    setGroupsByProduct(
      Object.fromEntries(
        Object.entries(groupsByProduct as ProductId2GroupMap).filter(([_, [p]]) => p !== product)
      ) as ProductId2GroupMap
    );
  };

  const productsHavingGroupCount = groupsByProduct ? Object.keys(groupsByProduct).length : -1;

  const titleVariant = 'h1';
  const mbTitle = 2;

  return groupsByProduct ? (
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
              title="Gruppi"
              variantTitle={titleVariant}
              mbTitle={mbTitle}
              subTitle="Consulta e crea dei gruppi (es. uno per ogni Dipartimento o Ufficio) in modo da gestire meglio il lavoro del tuo Ente."
            />
          </Grid>
          {productsHavingGroupCount > 0 && (
            <Grid item xs={1}>
              <Typography variant={titleVariant} mb={mbTitle}>
                &nbsp;
              </Typography>
              <AddGroupButton party={party} />
            </Grid>
          )}
        </Grid>
      </Grid>

      {productsHavingGroupCount > 1 && (
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
            {Object.values(groupsByProduct).map(([p], i) => (
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
          {Object.values(groupsByProduct).map(([product, groups], i) => (
            <Grid key={product.id} item xs={12} ref={prodSectionRefs[i]}>
              <GroupsProductSection
                party={party}
                product={product}
                groups={groups}
                onCompleteDelete={onProductGroupsTotallyDeleted}
              />
            </Grid>
          ))}
          {productsHavingGroupCount === 0 && <NoGroups party={party} />}
        </Grid>
      </Grid>
    </Grid>
  ) : (
    <></>
  );
}

export default GroupsPage;
