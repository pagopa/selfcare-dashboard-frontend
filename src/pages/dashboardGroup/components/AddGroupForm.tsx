import {
  Button,
  Checkbox,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import {
  useUnloadEventInterceptor,
  useUnloadEventOnExit,
} from '@pagopa/selfcare-common-frontend/hooks/useUnloadEventInterceptor';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import { trackEvent } from '@pagopa/selfcare-common-frontend/services/analyticsService';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Party } from '../../../model/Party';
import { PartyGroupOnCreation } from '../../../model/PartyGroup';
import { Product } from '../../../model/Product';
import { ProductsRolesMap } from '../../../model/ProductRole';
import { DASHBOARD_ROUTES } from '../../../routes';
import { savePartyUser } from '../../../services/usersService';
import { LOADING_TASK_SAVE_GROUP } from '../../../utils/constants';

const CustomTextField = styled(TextField)({
  '.MuiInputLabel-asterisk': {
    display: 'none',
  },
  '.MuiInput-root': {
    '&:after': {
      borderBottom: '2px solid #5C6F82',
      color: 'green',
    },
  },
  '.MuiInputLabel-root.Mui-focused': {
    color: '#5C6F82',
    fontWeight: '700',
  },
  '.MuiInputLabel-root': {
    color: '#5C6F82',
    fontSize: '16px',
    fontWeight: '700',
  },
  input: {
    '&::placeholder': {
      fontStyle: 'italic',
      color: '#5C6F82',
      opacity: '1',
    },
  },
});

const requiredError = 'Required';

type Props = {
  products: Array<Product>;
  party: Party;
  productsRolesMap: ProductsRolesMap;
  initialFormData: PartyGroupOnCreation;
  canEdit: boolean;
  goBack?: () => void;
};

export default function AddGroupForm({ products, party, initialFormData, goBack }: Props) {
  const setLoadingSaveGroup = useLoading(LOADING_TASK_SAVE_GROUP);

  const addError = useErrorDispatcher();
  const addNotify = useUserNotify();

  const history = useHistory();

  const [product, setProduct] = useState<Array<string>>([]);
  const [references, setReferences] = useState<Array<string>>([]);

  const { registerUnloadEvent, unregisterUnloadEvent } = useUnloadEventInterceptor();
  const onExit = useUnloadEventOnExit();

  const handleProduct = (event: SelectChangeEvent<typeof product>) => {
    const {
      target: { value },
    } = event;
    setProduct(typeof value === 'string' ? value.split(',') : value);
  };

  const handleReferences = (event: SelectChangeEvent<typeof references>) => {
    const {
      target: { value },
    } = event;
    setReferences(typeof value === 'string' ? value.split(',') : value);
  };

  const goBackInner =
    goBack ??
    (() =>
      history.push(
        resolvePathVariables(
          DASHBOARD_ROUTES.PARTY_PRODUCT_USERS.path, // TODO
          {
            institutionId: '',
            productId: '',
          }
        )
      ));

  const validate = (values: Partial<PartyGroupOnCreation>) => {
    Object.fromEntries(
      Object.entries({
        groupName: !values.name ? requiredError : undefined,
        description: !values.description ? requiredError : undefined,
        product: values.productId ? requiredError : undefined,
        references: values.members?.length === 0 ? requiredError : undefined,
      }).filter(([_key, value]) => value)
    );
  };

  const save = (values: PartyGroupOnCreation) => {
    // TODO
    setLoadingSaveGroup(true);
    savePartyUser(values) // saveGroupUser(....., ...., values) // TODO
      .then(() => {
        unregisterUnloadEvent();
        /*
        trackEvent('GROUP_CREATE', {               // TODO TRACK EVENT
          // TODO
          party_id = party.institutionId,
          product_id = .id,
        });
        */
        addNotify({
          component: 'Toast',
          id: 'SAVE_GROUP',
          title: 'GRUPPO CREATO',
          message: (
            <>
              {'Hai creato correttamente il gruppo '}
              <strong>{`[NOME GRUPPO]`}</strong>
              {' per il prodotto '}
              <strong>{`[NOME PRODOTTO].`}</strong>
            </>
          ),
        });

        goBackInner();
      })
      .catch((reason) =>
        addError({
          component: 'Toast',
          id: 'SAVE_GROUP_ERROR',
          blocking: false,
          displayableTitle: 'ERRORE DURANTE LA CREAZIONE',
          displayableDescription: "C'è stato un errore durante la creazione del gruppo. Riprova.",
          techDescription: `An error occurred while creation of group ${'gruppo'}`,
          error: reason,
          toNotify: true,
        })
      )
      .finally(() => setLoadingSaveGroup(false));
  };

  const formik = useFormik<PartyGroupOnCreation>({
    // TODO
    initialValues: initialFormData,
    validate,
    onSubmit: (values) => {
      save(values);
    },
  });

  useEffect(() => {
    if (formik.dirty) {
      registerUnloadEvent();
    } else {
      unregisterUnloadEvent();
    }
  }, [formik.dirty]);

  const baseTextFieldProps = (
    field: keyof PartyGroupOnCreation, // TODO
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
        <Grid container direction="column">
          <Grid item container spacing={3}>
            <Grid item xs={8} mb={3} sx={{ height: '75px' }}>
              <CustomTextField
                {...baseTextFieldProps('name', 'Nome del gruppo', 'Inserisci il nome del gruppo')}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={3}>
            <Grid item xs={4} mb={3} sx={{ height: '75px' }}>
              <CustomTextField // TODO TEXTAREA
                {...baseTextFieldProps('description', 'Descrizione', 'Inserisci una descrizione')}
              />
            </Grid>

            <Grid item container spacing={3}>
              <Grid item xs={8} mb={3}>
                <Typography variant="h6" sx={{ fontWeight: '700', color: '#5C6F82' }} pb={3}>
                  Prodotto
                </Typography>

                <FormControl sx={{ m: 1, width: 300 }}>
                  <InputLabel id="demo-multiple-name-label">Prodotto</InputLabel>
                  <Select
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    multiple
                    value={product}
                    onChange={handleProduct}
                    input={<OutlinedInput label="Name" />}
                  >
                    {products.map(
                      (products) =>
                        // <MenuItem key={products} value={products}>   // TODO
                        ({ products })
                      // </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {references && (
              <Grid item container spacing={3}>
                <Grid item xs={8} mb={3}>
                  <Typography variant="h6" sx={{ fontWeight: '700', color: '#5C6F82' }} pb={3}>
                    Referenti
                  </Typography>
                  <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="demo-multiple-checkbox-label">Referenti</InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={references}
                      onChange={handleReferences}
                      input={<OutlinedInput label="Tag" />} // TODO
                      renderValue={(selected) => selected.join(', ')}
                    >
                      {references.map((references) => (
                        <MenuItem key={references} value={references}>
                          <Checkbox checked={references.indexOf(references) > -1} />
                          <ListItemText primary={references} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            )}

            <Grid item container spacing={3}>
              <Grid item xs={3} mt={8}>
                <Button
                  sx={{ width: '100%' }}
                  color="primary"
                  variant="outlined"
                  onClick={() => onExit(goBackInner)}
                >
                  Annulla
                </Button>
              </Grid>
              <Grid item xs={3} mt={8}>
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
            </Grid>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
}
