import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Grid, TextField, Typography } from '@mui/material';
import { ButtonNaked, MIPaper } from '@pagopa/mui-italia';
import { useTranslation } from 'react-i18next';
import { useLRStep } from './useLRStep';

const halfWidthFields = ['name', 'surname'];

export const AddLRStep = () => {
  const { t } = useTranslation();
  const { fields, productName, rolesInfoUrl } = useLRStep();

  return (
    <>
      <Typography
        variant="body2"
        sx={{ maxWidth: 680, color: (theme) => theme.colors.neutral.grey[700] }}
      >
        {t('contractUpdateWizard.addLR.description', { productName })}
      </Typography>
      <ButtonNaked
        component="a"
        href={rolesInfoUrl}
        target="_blank"
        rel="noopener noreferrer"
        color="primary"
        size="small"
        startIcon={<MenuBookIcon />}
        sx={{ mt: 2, color: (theme) => theme.colors.blue[500] }}
      >
        {t('contractUpdateWizard.addLR.rolesInfo')}
      </ButtonNaked>
      <MIPaper padding={24} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {fields.map(({ id, label, value, error, hint, onChange }) => (
            <Grid item xs={12} md={halfWidthFields.includes(id) ? 6 : 12} key={id}>
              <TextField
                id={`contract-update-lr-${id}`}
                label={label}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                error={!!error}
                helperText={error ?? hint}
                inputProps={{ 'aria-required': true }}
                fullWidth
                size="small"
              />
            </Grid>
          ))}
        </Grid>
      </MIPaper>
    </>
  );
};
