import React, { useEffect, useState } from 'react';
import {
  FormControlLabel,
  Grid,
  RadioGroup,
  TextField,
  Divider,
  Radio,
  Button,
  Typography,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';import { Party } from '../../../model/Party';
import { savePartyUser } from '../../../services/usersService';
import useLoading from '../../../hooks/useLoading';
import { AppError, appStateActions } from '../../../redux/slices/appStateSlice';
import { useAppDispatch } from '../../../redux/hooks';
import { LOADING_TASK_SAVE_PARTY_USER } from '../../../utils/constants';
import { Product } from '../../../model/Product';import { PartyUserOnCreation } from '../../../model/PartyUser';

const taxCodeRegexp = new RegExp(
  '^[A-Za-z]{6}[0-9lmnpqrstuvLMNPQRSTUV]{2}[abcdehlmprstABCDEHLMPRST]{1}[0-9lmnpqrstuvLMNPQRSTUV]{2}[A-Za-z]{1}[0-9lmnpqrstuvLMNPQRSTUV]{3}[A-Za-z]{1}$'
);
const emailRegexp = new RegExp('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$');
const requiredError = 'Required';

type Props = {
  party: Party;
  selectedProduct: Product;
};

export default function AddUserForm({ party, selectedProduct }: Props) {
  const dispatch = useAppDispatch();
  const setLoading = useLoading(LOADING_TASK_SAVE_PARTY_USER);
  const addError = (error: AppError) => dispatch(appStateActions.addError(error));

  const [productsRole, setProductsRole] = useState <Array<any>>();
  useEffect(() => {
    const mockedUsers = [
      {
        id: 'uid1',
        value:'ADMIN',
        productRole:'Ref. Amministrativo',
      },
      {
        id: 'uid2',
        value:'TECH_ADMIN',
        productRole:'Ref. Tecninco',
      },
      {
        id: 'uid3',
        value:'ADMIN',
        productRole:'Ref. Amministrativo',
      }];
     
    setProductsRole(mockedUsers);
  }, []);

  const validate = (values: Partial<PartyUserOnCreation>) =>
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

  const formik = useFormik<Partial<PartyUserOnCreation>>({
    initialValues: {
      name: '',
      surname: '',
      taxCode: '',
      email: '',
      userRole: undefined,
    },
    validate,
    onSubmit: (values) => {
      setLoading(true);
      savePartyUser(party, selectedProduct, values as PartyUserOnCreation)
        .catch((reason) =>
          addError({
            id: 'SAVE_PARTY_USER',
            blocking: false,
            error: reason,
            techDescription: `An error occurred while saving party user ${party.institutionId}`,
            toNotify: true,
          })
        )
        .finally(() => setLoading(false));
    },
  });

  const baseTextFieldProps = (
    field: keyof PartyUserOnCreation,
    label: string,
    placeholder: string
  ) => {
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
             {productsRole?.map((p, index) => 
             <Box key={p.id}>  
             <FormControlLabel
                value={p.value}
                control={<Radio />}
                label={p.productRole}
              />
              {index !== productsRole.length -1 && <Divider sx={{ border: '1px solid #CFDCE6', my: '8px' }} />}
              </Box>)}
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
            type="submit"
          >
            Conferma
          </Button>
        </Grid>
      </form>
    </React.Fragment>
  );
}
