import React, { useMemo } from 'react';
import {
  Typography,
  Button,
  Box,
  Grid,
  CardContent,
  Link,
  Chip,
  Paper,
  useTheme,
} from '@mui/material';
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
  const theme = useTheme();

  const activeSubProducts: Array<SubProduct> = useMemo(
    () => product.subProducts.filter((p) => p.status === 'ACTIVE') ?? [],
    [product.subProducts]
  );
  return (
    <React.Fragment>
      <Paper
        elevation={8}
        sx={{
          height: '200px',
          borderRadius: theme.spacing(2),
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
              {!disableBtn &&
                activeSubProducts.map((p) => (
                  <Chip
                    key={p.id}
                    label={p.title}
                    color="primary"
                    size="small"
                    sx={{ borderRadius: theme.shape, mt: 1 }}
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
                        sx={{ fontWeight: 'fontWeightMedium' }}
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
      </Paper>
    </React.Fragment>
  );
}
