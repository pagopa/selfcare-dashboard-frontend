import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { Box, Grid, TextField, Typography } from '@mui/material';
import { ButtonNaked, MIPaper, MISnackbar } from '@pagopa/mui-italia';
import { useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ContractUpdateConfirmDialog } from '../../components/ContractUpdateConfirmDialog';
import { AdminCard, useAddUsersStep } from './useAddUsersStep';

const halfWidthFields = ['name', 'surname'];
const REMOVED_SNACKBAR_DURATION = 5000;
const REMOVED_SNACKBAR_WIDTH = 560;

export const AddUsersStep = () => {
  const { t } = useTranslation();
  const { productName, rolesInfoUrl, summaryFields, admins, isLoading, addAdmin, removeAdmin } =
    useAddUsersStep();
  const [adminToRemove, setAdminToRemove] = useState<AdminCard>();
  const [isRemovedSnackbarOpen, setIsRemovedSnackbarOpen] = useState(false);
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
        // Opened after moving the focus, so the snackbar gives it back to the add button when it closes
        setIsRemovedSnackbarOpen(true);
      }
    }
    // eslint-disable-next-line functional/immutable-data
    previousAdminsCount.current = isLoading ? undefined : admins.length;
  }, [admins.length, isLoading]);

  // MISnackbar focuses itself on open and MUI pauses the auto-hide while focused, so close it here
  useEffect(() => {
    if (!isRemovedSnackbarOpen) {
      return;
    }
    const timer = setTimeout(() => setIsRemovedSnackbarOpen(false), REMOVED_SNACKBAR_DURATION);
    return () => clearTimeout(timer);
  }, [isRemovedSnackbarOpen]);

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
        <Trans
          i18nKey="contractUpdateWizard.addUsers.description"
          values={{ productName }}
          components={{ 1: <strong /> }}
        >
          {`Verifica i dati degli Amministratori attuali o aggiungi altri Amministratori alla lista. Saranno i responsabili della gestione di <1>{{productName}}</1> e presenti nel contratto di adesione come delegati dal Legale Rappresentante.`}
        </Trans>
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
                  sx={
                    readOnly
                      ? {
                          '& .MuiInputBase-root': {
                            backgroundColor: (theme) => theme.colors.neutral.grey[50],
                          },
                          '& .MuiInputBase-input': {
                            cursor: 'not-allowed',
                            color: (theme) => theme.colors.neutral.grey[700],
                            WebkitTextFillColor: (theme) => theme.colors.neutral.grey[700],
                          },
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: (theme) => theme.colors.neutral.grey[100],
                          },
                        }
                      : undefined
                  }
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

      {/* MISnackbar replaces its own sx when one is passed, so the Figma width is set from here */}
      <Box sx={{ '& .MuiSnackbar-root .MuiAlert-root': { width: { sm: REMOVED_SNACKBAR_WIDTH } } }}>
        <MISnackbar
          open={isRemovedSnackbarOpen}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          severity="success"
          description={t('contractUpdateWizard.addUsers.removedSnackbar')}
          onClose={() => setIsRemovedSnackbarOpen(false)}
        />
      </Box>
    </>
  );
};
