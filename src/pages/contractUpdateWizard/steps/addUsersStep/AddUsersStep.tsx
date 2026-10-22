import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { ButtonNaked, MIPaper } from '@pagopa/mui-italia';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ContractUpdateConfirmDialog } from '../../components/ContractUpdateConfirmDialog';
import { AdminCard, useAddUsersStep } from './useAddUsersStep';

const halfWidthFields = ['name', 'surname'];

export const AddUsersStep = () => {
  const { t } = useTranslation();
  const { productName, rolesInfoUrl, summaryFields, admins, isLoading, addAdmin, removeAdmin } =
    useAddUsersStep();
  const [adminToRemove, setAdminToRemove] = useState<AdminCard>();
  const addButton = useRef<HTMLButtonElement>(null);
  const firstFieldByAdmin = useRef<Record<string, HTMLInputElement | null>>({});
  const previousAdminsCount = useRef<number>();

  // Move the focus to the new card after an addition and to the add button after a removal
  useEffect(() => {
    if (previousAdminsCount.current !== undefined && !isLoading) {
      if (admins.length > previousAdminsCount.current) {
        firstFieldByAdmin.current[admins[admins.length - 1].key]?.focus();
      } else if (admins.length < previousAdminsCount.current) {
        addButton.current?.focus();
      }
    }
    // eslint-disable-next-line functional/immutable-data
    previousAdminsCount.current = isLoading ? undefined : admins.length;
  }, [admins.length, isLoading]);

  const requestRemove = (admin: AdminCard) => {
    if (admin.needsRemoveConfirmation) {
      setAdminToRemove(admin);
    } else {
      removeAdmin(admin.key);
    }
  };

  const confirmRemove = () => {
    if (adminToRemove) {
      removeAdmin(adminToRemove.key);
    }
    setAdminToRemove(undefined);
  };

  return (
    <>
      <Typography
        variant="body2"
        sx={{ maxWidth: 680, color: (theme) => theme.colors.neutral.grey[700] }}
      >
        {t('contractUpdateWizard.addUsers.description', { productName })}
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
        <Typography
          component="h2"
          variant="body2"
          sx={{
            color: (theme) => theme.colors.neutral.grey[700],
            fontWeight: 'fontWeightMedium',
            textTransform: 'uppercase',
          }}
        >
          {t('contractUpdateWizard.addUsers.legalRepresentativeTitle')}
        </Typography>
        <Box component="dl" sx={{ m: 0, mt: 1 }}>
          {summaryFields.map(({ id, label, value }, index) => (
            <Box
              key={id}
              sx={{
                py: 1.5,
                borderTop: index > 0 ? 1 : 0,
                borderColor: (theme) => theme.colors.neutral.grey[100],
              }}
            >
              <Typography
                component="dt"
                variant="caption"
                display="block"
                sx={{ color: (theme) => theme.colors.neutral.grey[700] }}
              >
                {label}
              </Typography>
              <Typography
                component="dd"
                variant="body2"
                sx={{
                  m: 0,
                  color: (theme) => theme.colors.neutral.black,
                  fontWeight: 'fontWeightMedium',
                  wordBreak: 'break-word',
                }}
              >
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </MIPaper>

      {admins.map((admin) => (
        <MIPaper
          key={admin.key}
          component="section"
          aria-labelledby={`contract-update-admin-${admin.key}-title`}
          sx={{ mt: 3, p: 4, borderRadius: 4, boxShadow: '0px 4px 16px rgba(14, 15, 19, 0.1)' }}
        >
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}
          >
            <Typography
              id={`contract-update-admin-${admin.key}-title`}
              component="h2"
              variant="overline"
            >
              {admin.title}
            </Typography>
            {admin.canRemove && (
              <ButtonNaked
                component="button"
                color="error"
                size="medium"
                endIcon={<DeleteOutlineIcon />}
                aria-label={t('contractUpdateWizard.addUsers.removeAriaLabel', {
                  title: admin.title,
                })}
                onClick={() => requestRemove(admin)}
              >
                {t('contractUpdateWizard.addUsers.remove')}
              </ButtonNaked>
            )}
          </Box>
          <Grid container spacing={4}>
            {admin.fields.map(({ id, label, value, error, readOnly, onChange }) => (
              <Grid item xs={12} md={halfWidthFields.includes(id) ? 6 : 12} key={id}>
                <TextField
                  id={`contract-update-admin-${admin.key}-${id}`}
                  label={label}
                  value={value}
                  onChange={(event) => onChange(event.target.value)}
                  error={!!error}
                  helperText={error}
                  inputRef={
                    id === 'name'
                      ? (input: HTMLInputElement | null) => {
                          // eslint-disable-next-line functional/immutable-data
                          firstFieldByAdmin.current[admin.key] = input;
                        }
                      : undefined
                  }
                  InputProps={{ readOnly }}
                  inputProps={{ 'aria-required': !readOnly, 'aria-readonly': readOnly }}
                  fullWidth
                  size="small"
                />
              </Grid>
            ))}
          </Grid>
        </MIPaper>
      ))}

      {!isLoading && (
        <ButtonNaked
          buttonRef={addButton}
          component="button"
          color="primary"
          size="medium"
          startIcon={<AddIcon />}
          sx={{ mt: 3 }}
          onClick={addAdmin}
        >
          {t('contractUpdateWizard.addUsers.add')}
        </ButtonNaked>
      )}

      <ContractUpdateConfirmDialog
        id="contract-update-remove-admin"
        open={!!adminToRemove}
        title={t('contractUpdateWizard.addUsers.removeModal.title')}
        message={t('contractUpdateWizard.addUsers.removeModal.message')}
        closeLabel={t('contractUpdateWizard.addUsers.removeModal.close')}
        onClose={() => setAdminToRemove(undefined)}
        secondaryAction={{
          label: t('contractUpdateWizard.addUsers.removeModal.back'),
          onClick: () => setAdminToRemove(undefined),
        }}
        primaryAction={{
          label: t('contractUpdateWizard.addUsers.removeModal.remove'),
          onClick: confirmRemove,
        }}
      />
    </>
  );
};
