import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  Link,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import { ProductAvatar } from '@pagopa/mui-italia/dist/components/ProductAvatar/ProductAvatar';
import { Trans, useTranslation } from 'react-i18next';
import { SubProductResource } from '../../../../../api/generated/b4f-dashboard/SubProductResource';
import { Product } from '../../../../../model/Product';

type Props = {
  image?: string;
  urlLogo: string;
  description: string;
  title: string;
  btnAction?: () => void;
  disableBtn: boolean;
  buttonLabel: string;
  urlPublic?: string;
  product: Product;
  prodActiveWithSubProdInactive?: SubProductResource;
};

export default function NotActiveProductCard({
  image,
  urlLogo,
  description,
  btnAction,
  disableBtn,
  buttonLabel,
  urlPublic,
  title,
  product,
  prodActiveWithSubProdInactive,
}: Props) {
  const theme = useTheme();
  const { t } = useTranslation();
  const truncateText = {
    fontSize: theme.typography.fontSize,
    height: '100%',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitBoxOrient: 'vertical' as const,
  };

  const renderTitleForIoPremium = (title: string) => {
    if (title && title.toLowerCase() === 'io premium') {
      const spliTitle = title.split(' ');
      const baseName = `${spliTitle[0]}`;
      const subName = `${spliTitle[1]}`;
      return (
        <Typography
          variant="h6"
          sx={{
            ...truncateText,
            WebkitLineClamp: 1,
            fontWeight: '400',
          }}
        >
          <strong style={{ fontWeight: 'fontWeightBold' }}>{baseName}</strong>
          {` ${subName}`}
        </Typography>
      );
    } else {
      return title;
    }
  };

  return (
    <Card sx={{ height: '100%', borderRadius: theme.spacing(2), width: '100%' }}>
      <Grid item xs={12}>
        <Box
          sx={{
            width: '100%',
            height: '191px',
            position: 'relative',
            '&::after': { position: 'absolute' },
          }}
        >
          <CardMedia
            component="img"
            height="100%"
            width="100%"
            image={image}
            alt={`${t('overview.depictOf')} ${product.title}`}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Box
          mx={3}
          sx={{
            marginTop: '-2rem',
          }}
          mr={2}
        >
          <ProductAvatar
            logoUrl={urlLogo}
            logoBgColor={
              prodActiveWithSubProdInactive
                ? prodActiveWithSubProdInactive.logoBgColor
                : product.logoBgColor
            }
            logoAltText={`${product.title} logo`}
          />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <CardContent sx={{ height: '100%', width: '100%' }}>
          <Grid item xs={12} mb={1}>
            {prodActiveWithSubProdInactive?.title ? (
              <Tooltip
                title={
                  prodActiveWithSubProdInactive?.title?.length > 21
                    ? `${title}  ${prodActiveWithSubProdInactive.title}`
                    : ''
                }
                placement="top"
                arrow={true}
              >
                <Typography
                  variant="h6"
                  sx={{
                    ...truncateText,
                    WebkitLineClamp: 1,
                  }}
                >
                  <p style={{ fontWeight: '400', padding: '0px', margin: '0px' }}>
                    <strong style={{ fontWeight: 'fontWeightBold' }}>{product?.title}</strong>&nbsp;
                    {prodActiveWithSubProdInactive?.title}
                  </p>
                </Typography>
              </Tooltip>
            ) : (
              <Tooltip title={title.length > 21 ? title : ''} placement="top" arrow={true}>
                <Typography
                  variant="h6"
                  sx={{
                    ...truncateText,
                    WebkitLineClamp: 1,
                  }}
                >
                  {renderTitleForIoPremium(title)}
                </Typography>
              </Tooltip>
            )}
          </Grid>
          <Grid item xs={12} height="48px">
            <Tooltip
              title={description && description.length > 35 ? description : ''}
              placement="top"
              arrow={true}
            >
              <Typography
                sx={{
                  ...truncateText,
                  WebkitLineClamp: 2,
                }}
              >
                {description}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid
            mt={1}
            height="16px"
            item
            xs={12}
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <Trans i18nKey="discoverMore">
              <Link
                sx={{
                  fontSize: 'fontSize',
                  fontWeight: '400px',
                  color: 'primary.main',
                  textDecoration: 'none',
                }}
                href={urlPublic}
              >
                {urlPublic && 'Scopri di più'}
              </Link>
            </Trans>
          </Grid>
          <Stack
            display="flex"
            alignItems="flex-end"
            justifyContent="flex-end"
            direction="row"
            sx={{ width: '100%' }}
            mt={3}
          >
            <CardActions sx={{ p: 0 }}>
              <Button
                onClick={btnAction}
                disabled={disableBtn}
                variant="outlined"
                sx={{
                  height: '40px',
                  fontWeight: 'fontWeightBold',
                  borderWidth: 'medium',
                  borderColor: 'primary.main',
                  '&:hover': { borderWidth: 'medium', backgroundColor: 'transparent' },
                }}
              >
                {buttonLabel}
              </Button>
            </CardActions>
          </Stack>
        </CardContent>
      </Grid>
    </Card>
  );
}
