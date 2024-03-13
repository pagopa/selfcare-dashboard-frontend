import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { TFunction } from 'i18next';
import * as React from 'react';
import { withTranslation } from 'react-i18next';
import { useTokenExchange } from '../../../../../hooks/useTokenExchange';
import { Party } from '../../../../../model/Party';
import { Product } from '../../../../../model/Product';

type Props = {
  /** If this component should be displayed or not */
  open: boolean;
  /** The title to show in the popup */
  title: string;
  /** The body to show in the popup */
  message: React.ReactNode;
  /** If defined, it will render a confirm button using this function as behavior */
  onConfirm?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  /** The confirm label text */
  onConfirmLabel?: string;
  /** indicates if pary is authorized for prod-interopl */
  authorizedProdInterop?: boolean;
  /** indicates if pary is authorized for prod-interop-coll */
  authorizedProdColl?: boolean;
  /** indicates if pary is authorized for prod-interop-atst */
  authorizedProdAtst?: boolean;
  /** The function invoked when clicking on close button or in the showed X icon */
  handleClose: () => void | undefined;
  /** If defined, it allow to set a different behavior when clicking on X icon */
  handleExit?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  /** Close button text */
  onCloseLabel?: string;
  /** The popup height */
  height?: string;
  /** The popup minHeight */
  minHeight?: string;
  /** The popup width */
  width?: string;
  t: TFunction<'translation', undefined>;
  /** If true show modal close icon */
  showCloseIcon?: boolean;
  /** If false not show the close button, default true */
  showCloseButton?: boolean;
  /** party products */
  products?: Array<Product>;
  /** party list */
  party?: Party;
};

/** Selfcare's popup */
function SessionModalInteropProduct({
  t,
  open,
  title,
  message,
  onConfirm,
  onConfirmLabel = t('SessionModalInteropProduct.confirmButton'),
  authorizedProdInterop,
  authorizedProdAtst,
  authorizedProdColl,
  handleClose,
  handleExit = handleClose,
  onCloseLabel = t('SessionModalInteropProduct.closeButton'),
  height,
  minHeight,
  width = '33.3em',
  showCloseIcon = false,
  showCloseButton = true,
  products,
  party,
}: Props) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const [selectedEnviroment, setSelectedEnviroment] = React.useState<string>('');
  const { invokeProductBo } = useTokenExchange();

  const handleTokenExchange = async (prodEnv: string): Promise<void> => {
    if (products && party) {
      if (prodEnv === 'Collaudo') {
        const productInteropColl = products.find((p) => p.id === 'prod-interop-coll');
        if (productInteropColl) {
          return invokeProductBo(productInteropColl, party);
        }
      } else {
        const productInteropAtst = products.find((p) => p.id === 'prod-interop-atst');
        if (productInteropAtst) {
          return invokeProductBo(productInteropAtst, party);
        }
      }
    }
  };

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      aria-labelledby="responsive-dialog-title"
    >
      <Grid container sx={{ height, minHeight, width }} px={4}>
        <Grid item xs={12} mt={4}>
          {showCloseIcon && (
            <IconButton
              onClick={handleExit}
              style={{ position: 'absolute', top: '20px', right: '16px', zIndex: 100 }}
            >
              <ClearOutlinedIcon />
            </IconButton>
          )}
          <Typography sx={{ fontSize: '24px', fontWeight: '700' }}>{title}</Typography>
        </Grid>

        <Box width="100%">
          <Grid item xs={12} my={1} mb={3}>
            <Typography sx={{ fontSize: '18px', fontWeight: '400' }}>{message}</Typography>
          </Grid>

          <Grid item xs={12}>
            <RadioGroup>
              {authorizedProdAtst && (
                <FormControlLabel
                  value="Attestazione"
                  onClick={() => setSelectedEnviroment('Attestazione')}
                  control={<Radio />}
                  label={
                    <>
                      <Typography>
                        {t('overview.activeProducts.activeProductsEnvModal.envUatButton')}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {t('overview.activeProducts.activeProductsEnvModal.uatEnviromentMessage')}
                      </Typography>
                    </>
                  }
                  sx={{ mb: 1 }}
                />
              )}

              {authorizedProdColl && (
                <FormControlLabel
                  value="Collaudo"
                  onClick={() => setSelectedEnviroment('Collaudo')}
                  control={<Radio />}
                  label={
                    <>
                      <Typography>
                        {t('overview.activeProducts.activeProductsEnvModal.envDevButton')}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {t('overview.activeProducts.activeProductsEnvModal.devEnviromentMessage')}
                      </Typography>
                    </>
                  }
                  sx={{ mb: 1 }}
                />
              )}
              {authorizedProdInterop && (
                <FormControlLabel
                  value={'Produzione'}
                  onClick={() => setSelectedEnviroment('Produzione')}
                  control={<Radio />}
                  label={
                    <>
                      <Typography>
                        {t('overview.activeProducts.activeProductsEnvModal.envProdButton')}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {t('overview.activeProducts.activeProductsEnvModal.prodEnviromentMessage')}
                      </Typography>
                    </>
                  }
                  sx={{ mb: 1 }}
                />
              )}
            </RadioGroup>
          </Grid>

          <Grid item xs={12} my={1}>
            <Box display="flex" justifyContent={'flex-end'}>
              {showCloseButton && (
                <Box mb={3} mt={0}>
                  <Button
                    onClick={() => {
                      setSelectedEnviroment('');
                      handleClose();
                    }}
                    color="primary"
                    variant="outlined"
                  >
                    {onCloseLabel}
                  </Button>
                </Box>
              )}
              {onConfirm && (
                <Box mb={3} display="flex" flexDirection="row-reverse">
                  <Button
                    sx={{ marginLeft: 2 }}
                    color="primary"
                    variant="contained"
                    onClick={(e) =>
                      selectedEnviroment === 'Produzione'
                        ? onConfirm(e)
                        : handleTokenExchange(selectedEnviroment)
                    }
                    disabled={selectedEnviroment.length < 1}
                  >
                    {onConfirmLabel}
                  </Button>
                </Box>
              )}
            </Box>
          </Grid>
        </Box>
      </Grid>
    </Dialog>
  );
}
export default withTranslation()(SessionModalInteropProduct);
