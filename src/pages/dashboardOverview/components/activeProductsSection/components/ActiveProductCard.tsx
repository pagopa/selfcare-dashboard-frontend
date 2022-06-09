import React, { useMemo } from 'react';
import { Typography, Button, Box, Grid, Card, CardContent, Link, Chip } from '@mui/material';
import { Trans } from 'react-i18next';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend';
import { useHistory } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { ENV } from '../../../../../utils/env';
import { Party } from '../../../../../model/Party';
import { Product, SubProduct } from '../../../../../model/Product';

type Props = {
  cardTitle: string;
  buttonLabel: string;
  disableBtn: boolean;
  urlLogo?: string;
  btnAction?: () => void;
  tooltip: string;
  party: Party;
  product: Product;
};
export default function ActiveProductCard({
  cardTitle,
  buttonLabel,
  disableBtn,
  urlLogo,
  btnAction,
  party,
  product,
}: Props) {
  const onExit = useUnloadEventOnExit();
  const history = useHistory();
  const usersRoute = ENV.ROUTES.USERS;
  const usersPath = resolvePathVariables(usersRoute, {
    partyId: party.partyId,
  });

  const activeSubProducts: Array<SubProduct> = useMemo(
    () => product.subProducts.filter((p) => p.status === 'ACTIVE' && !disableBtn) ?? [],
    [product.subProducts]
  );
  return (
    <React.Fragment>
      <Card
        sx={{
          height: '180px',
          border: 'none',
          borderRadius: '16px !important',
          boxShadow:
            '0px 8px 10px -5px rgba(0, 43, 85, 0.1), 0px 16px 24px 2px rgba(0, 43, 85, 0.05), 0px 6px 30px 5px rgba(0, 43, 85, 0.1)',
        }}
      >
        <CardContent>
          <Box display="flex">
            <Box
              sx={{ columnWidth: '88px', height: '88px', textAlign: 'center', pt: '10px' }}
              mr={2}
            >
              <img src={urlLogo} />
            </Box>
            <Box>
              {cardTitle && (
                <Box display="flex" alignItems={'center'}>
                  <Typography variant="h6">{cardTitle}</Typography>
                </Box>
              )}

              {activeSubProducts.map((p) => (
                <Chip
                  key={p.id}
                  label={p.title}
                  color="primary"
                  size="small"
                  sx={{ borderRadius: '4px', mt: 1 }}
                />
              ))}
            </Box>
          </Box>

          <Grid item xs={12} justifyContent="center" height="45'px">
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
              {disableBtn ? (
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="start"
                  sx={{ color: '#5C6F82', cursor: 'pointer' }}
                >
                  <Typography sx={{ fontSize: '16px' }}>
                    <Trans i18nKey="activeProductCard.disableInfo">
                      Per gestire questo prodotto, chiedi a uno dei suoi
                      <Link
                        onClick={() =>
                          onExit(() => history.push(party.partyId ? usersPath : usersRoute))
                        }
                        sx={{ fontWeight: '600' }}
                      >
                        Amministratori
                      </Link>
                    </Trans>
                  </Typography>
                </Box>
              ) : (
                <Button
                  onClick={btnAction}
                  disabled={disableBtn}
                  variant="contained"
                  sx={{ height: '40px' }}
                >
                  {buttonLabel}
                </Button>
              )}
            </Box>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
}
