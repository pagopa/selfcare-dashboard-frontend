import { useMemo } from 'react';
import {
  Typography,
  Box,
  CardContent,
  Link,
  Chip,
  Card,
  useTheme,
  Tooltip,
  Grid,
  IconButton,
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { Trans, useTranslation } from 'react-i18next';
import { useUnloadEventOnExit } from '@pagopa/selfcare-common-frontend';
import { useHistory } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { ProductAvatar } from '@pagopa/mui-italia';
import { ENV } from '../../../../../utils/env';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';
import { SubProductResource } from '../../../../../api/generated/b4f-dashboard/SubProductResource';

type Props = {
  cardTitle: string;
  buttonLabel: string;
  disableBtn: boolean;
  urlLogo: string;
  btnAction?: () => void;
  party: Party;
  product: Product;
};
export default function ActiveProductCard({
  cardTitle,
  disableBtn,
  urlLogo,
  btnAction,
  party,
  product,
}: Props) {
  const onExit = useUnloadEventOnExit();
  const history = useHistory();
  const { t } = useTranslation();
  const usersRoute = ENV.ROUTES.USERS;
  const usersPath = resolvePathVariables(usersRoute, {
    partyId: party.partyId ?? '',
  }).concat(`#${product.id}`);
  const theme = useTheme();

  const activeSubProducts: Array<SubProductResource> = useMemo(
    () =>
      product.subProducts?.filter((p) =>
        party.products.some(
          (us) => us.productId === p.id && us.productOnBoardingStatus === 'ACTIVE'
        )
      ) ?? [],
    [party]
  );

  return (
    <Card
      id={product.id}
      raised
      sx={{
        borderRadius: theme.spacing(2),
        minWidth: '272px',
        maxWidth: '450px',
      }}
    >
      <CardContent sx={{ display: 'flex', pb: 2 }}>
        {/* Logo */}
        <Grid container xs={12}>
          <Box display={'flex'} width="100%" alignItems="center">
            <Grid item>
              <ProductAvatar
                logoUrl={urlLogo}
                logoBgColor={product.logoBgColor}
                logoAltText={`${product.title} logo`}
                size="default"
              />
            </Grid>
            {/* Title */}
            {cardTitle && (
              <Grid item width={'100%'} ml={2}>
                {activeSubProducts.map((p) => (
                  <Chip
                    key={p.id}
                    label={t('overview.activeProducts.premiumProduct')}
                    size="small"
                    sx={{
                      display: 'flex',
                      mb: 1,
                      borderRadius: theme.shape,
                      width: '80px',
                      backgroundColor: 'warning.main',
                      color: 'colorTextPrimary',
                    }}
                  />
                ))}
                <Box>
                  <Tooltip
                    title={cardTitle.length > 27 ? cardTitle : ''}
                    placement="top"
                    arrow={true}
                  >
                    <Typography
                      sx={{
                        fontSize: '22px',
                        fontWeight: 'medium',
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
              </Grid>
            )}
          </Box>
        </Grid>
      </CardContent>
      <Box px={3}>
        {disableBtn ? (
          // info label
          <Box display={'flex'} justifyContent={'flex-start'}>
            <Typography sx={{ fontSize: '14px' }}>
              <Trans i18nKey="activeProductCard.disableInfo">
                Per gestire questo prodotto, chiedi a uno dei suoi
                <Link
                  onClick={() => onExit(() => history.push(party.partyId ? usersPath : usersRoute))}
                  sx={{ fontWeight: 'fontWeightMedium' }}
                >
                  Amministratori
                </Link>
              </Trans>
            </Typography>
          </Box>
        ) : (
          //  Action
          <Box display={'flex'} justifyContent={'flex-end'}>
            <IconButton onClick={btnAction} disabled={disableBtn} id={`forward_${product.id}`}>
              <Box
                sx={{
                  backgroundColor: 'primary.main',
                  height: '44px',
                  color: 'white',
                  borderRadius: '48px',
                }}
              >
                <ArrowForward sx={{ m: 1 }} />{' '}
              </Box>
            </IconButton>
          </Box>
        )}
      </Box>
    </Card>
  );
}
