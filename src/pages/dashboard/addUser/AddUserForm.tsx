import React from 'react';
import {
  FormControlLabel,
  Grid,
  RadioGroup,
  TextField,
  Divider,
  Radio,
  Button,
  Typography,
} from '@mui/material';
import { useFormik } from 'formik';
import { UserRole } from '../../../model/Party';

interface FormValues {
  name: string;
  surname: string;
  taxCode: string; // This should not be optional, it is temporarily because of the "from" below
  email: string;
  userRole: UserRole | null;
}
const taxCodeRegexp = new RegExp(
  '^[A-Za-z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z]{1}[0-9lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]{1}$'
);
const emailRegexp = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
const requiredError = 'Required';
export default function AddUserForm() {
  const validate = (values: FormValues) =>
    Object.fromEntries(
      Object.entries({
        name: !values.name ? requiredError : undefined,
        surname: !values.surname ? requiredError : undefined,
        taxCode: !values.taxCode
          ? requiredError
          : !taxCodeRegexp.test(values.taxCode)
          ? 'Il Codice Fiscale inserito non è valido '
          : undefined,
        email: !values.email
          ? requiredError
          : !emailRegexp.test(values.email)
          ? 'L’indirizzo email non è valido'
          : undefined,
        userRole: !values.userRole ? requiredError : undefined,
      }).filter(([_key, value]) => value)
    );

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      taxCode: '',
      email: '',
      userRole: null,
    },
    validate,
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });

  const baseTextFieldProps = (field: keyof FormValues, label: string, placeholder: string) => {
    const isError = !!formik.errors[field] && formik.errors[field] !== requiredError;

    return {
      id: field,
      type: 'text',
      value: formik.values[field],
      label,
      placeholder,
      error: isError,
      helperText: isError ? formik.errors[field] : undefined,
      required: true,
      variant: 'standard' as const,
      onChange: formik.handleChange,
      sx: { width: '100%' },
      InputProps: {
        style: {
          fontSize: '16px',
          fontStyle: 'italic',
          fontWeight: 400,
          lineHeight: '24px',
          color: '#5C6F82',
          textAlign: 'start' as const,
          paddingLeft: '16px',
        },
      },
    };
  };
  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={4} mb={3} sx={{ height: '75px' }}>
            <TextField {...baseTextFieldProps('name', 'Nome', 'Inserisci il nome del referente')} />
          </Grid>
          <Grid item xs={4} mb={3} sx={{ height: '75px' }}>
            <TextField
              {...baseTextFieldProps('surname', 'Cognome', 'Inserisci il cognome del referente')}
            />
          </Grid>
          <Grid item xs={8} mb={3} sx={{ height: '75px' }}>
            <TextField
              {...baseTextFieldProps(
                'taxCode',
                'Codice Fiscale',
                'Inserisci il Codice Fiscale del referente'
              )}
            />
          </Grid>
          <Grid item xs={8} mb={4} sx={{ height: '75px' }}>
            <TextField
              {...baseTextFieldProps(
                'email',
                'Email',
                'Inserisci l’indirizzo email istituzionale del referente'
              )}
            />
          </Grid>

          <Grid item xs={8} mb={3}>
            <Typography> Ruoli* </Typography>
            <RadioGroup
              aria-label="user"
              name="userRole"
              value={formik.values.userRole}
              onChange={formik.handleChange}
            >
              <FormControlLabel
                value="ADMIN"
                control={<Radio />}
                label="Referente amministrativo"
              />
              <Divider sx={{ border: '1px solid #CFDCE6', my: '8px' }} />
              <FormControlLabel value="LIMITED" control={<Radio />} label="Referente tecnico" />
            </RadioGroup>
          </Grid>
        </Grid>
        <Grid item xs={3} mt={12}>
          <p>{formik.isValid} </p>
          <Button
            disabled={!formik.dirty || !formik.isValid}
            sx={{ width: '100%' }}
            color="primary"
            variant="contained"
            // onClick={onConfirm}
            type="submit"
          >
            Conferma
          </Button>
        </Grid>
      </form>
    </React.Fragment>
  );
}
