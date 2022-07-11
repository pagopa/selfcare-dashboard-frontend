import { useMemo } from 'react';
import {
  Typography,
  Button,
  Box,
  Grid,
  CardContent,
  Link,
  Chip,
  Card,
  CardActions,
  useTheme,
  Tooltip,
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
    <Card
      raised
      sx={{
        height: '200px',
      }}
    >
      <CardContent sx={{ height: '100%' }}>
        <Grid container sx={{ height: '100%' }}>
          <Grid item xs={12} display="flex" alignItems="center">
            <Box display="flex" flexDirection="column" justifyContent="center" mr={2}>
              <img src={urlLogo} />
            </Box>
            <Box display="flex" flexDirection="column" justifyContent="center">
              {cardTitle && (
                <Box display="flex" alignItems={'center'}>
                  <Tooltip title={cardTitle.length > 27 ? cardTitle : ''}>
                    <Typography
                      variant="h6"
                      sx={{
                        fontSize: theme.typography.fontSize,
                        height: '100%',
                        width: '100%',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical' as const,
                        WebkitLineClamp: 2,
                      }}
                    >
                      {cardTitle}
                    </Typography>
                  </Tooltip>
                </Box>
              )}
              {!disableBtn &&
                activeSubProducts.map((p) => (
                  <Chip
                    key={p.id}
                    label={p.title}
                    color="primary"
                    size="small"
                    sx={{ borderRadius: theme.shape, mt: 1, width: '80px' }}
                  />
                ))}
            </Box>
          </Grid>
          <Grid item xs={12} display="flex">
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
                <CardActions sx={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    onClick={btnAction}
                    disabled={disableBtn}
                    variant="contained"
                    sx={{ height: '40px' }}
                  >
                    {buttonLabel}
                  </Button>
                </CardActions>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
