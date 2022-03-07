import {
  Box,
  Button,
  Checkbox,
  Chip,
  Grid,
  MenuItem,
  Select,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
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
import { User } from '@pagopa/selfcare-common-frontend/model/User';
import { userSelectors } from '@pagopa/selfcare-common-frontend/redux/slices/userSlice';
import { Party } from '../../../model/Party';
import { PartyGroupExt, PartyGroupOnCreation } from '../../../model/PartyGroup';
import { PartyUser } from '../../../model/PartyUser';
import { Product, ProductsMap } from '../../../model/Product';
import { DASHBOARD_ROUTES } from '../../../routes';
import { savePartyGroup } from '../../../services/groupsService';
import { LOADING_TASK_FETCH_USER_PRODUCT, LOADING_TASK_SAVE_GROUP } from '../../../utils/constants';
import { fetchPartyUsers } from '../../../services/usersService';
import { useAppSelector } from '../../../redux/hooks';

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
  productsMap: ProductsMap;
  PartyGroupExt: PartyGroupExt;
  initialFormData: PartyGroupOnCreation;
  canEdit: boolean;
  goBack?: () => void;
};

export default function AddGroupForm({
  products,
  party,
  initialFormData,
  productsMap,
  PartyGroupExt,
  goBack,
}: Props) {
  const currentUser = useAppSelector(userSelectors.selectLoggedUser);

  const setLoadingSaveGroup = useLoading(LOADING_TASK_SAVE_GROUP);
  const setLoadingFetchUserProduct = useLoading(LOADING_TASK_FETCH_USER_PRODUCT);

  const addError = useErrorDispatcher();
  const addNotify = useUserNotify();

  const history = useHistory();

  const [productSelected, setProductSelected] = useState<Product>();
  const [productUsers, setProductUsers] = useState<Array<PartyUser>>([]);

  const { registerUnloadEvent, unregisterUnloadEvent } = useUnloadEventInterceptor();
  const onExit = useUnloadEventOnExit();

  useEffect(() => {
    if (productSelected) {
      fetchProductUsers(productSelected);
    }
  }, [productSelected]);

  const goBackInner =
    goBack ??
    (() =>
      history.push(
        resolvePathVariables(DASHBOARD_ROUTES.PARTY_GROUP.path, {
          institutionId: PartyGroupExt.institutionId,
          groupId: PartyGroupExt.id,
        })
      ));

  const validate = (values: Partial<PartyGroupOnCreation>) => {
    Object.fromEntries(
      Object.entries({
        groupName: !values.name ? requiredError : undefined,
        description: !values.description ? requiredError : undefined,
        product: !values.productId ? requiredError : undefined,
        references: values.members?.length === 0 ? requiredError : undefined,
      }).filter(([_key, value]) => value)
    );
  };

  const save = (values: PartyGroupOnCreation) => {
    setLoadingSaveGroup(true);
    savePartyGroup(party, productSelected as Product, values)
      .then(() => {
        unregisterUnloadEvent();
        trackEvent('GROUP_CREATE', {
          party_id: PartyGroupExt.institutionId,
          group_id: PartyGroupExt.id,
        });
        addNotify({
          component: 'Toast',
          id: 'SAVE_GROUP',
          title: 'GRUPPO CREATO',
          message: (
            <>
              {'Hai creato correttamente il gruppo '}
              <strong>{`${values.name}`}</strong>
              {' per il prodotto '}
              <strong>{`${productSelected?.title}`}</strong>
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
          techDescription: `An error occurred while creation of group ${values.name}`,
          error: reason,
          toNotify: true,
        })
      )
      .finally(() => setLoadingSaveGroup(false));
  };

  const formik = useFormik<PartyGroupOnCreation>({
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
    field: keyof PartyGroupOnCreation,
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
          maxLength: 200,
        },
      },
    };
  };

  const fetchProductUsers = (productSelected: Product) => {
    setLoadingFetchUserProduct(true);
    fetchPartyUsers(
      { page: 0, size: 2000 },
      party,
      productsMap,
      currentUser ?? ({ uid: 'NONE' } as User),
      true,
      productSelected,
      [],
      []
    )
      .then((productUsersPage) => setProductUsers(productUsersPage.content))
      .catch((reason) =>
        addError({
          id: 'FETCH_PRODUCT_USERS',
          blocking: false,
          error: reason,
          techDescription: `An error occurred while fetching product users ${party.institutionId} of product ${productSelected.id}`,
          toNotify: true,
        })
      )
      .finally(() => setLoadingFetchUserProduct(false));
  };

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Grid container direction="column">
          <Grid item container spacing={3}>
            <Grid item xs={8} mb={3}>
              <Typography variant="h6" sx={{ fontWeight: '700', color: '#5C6F82' }} pb={3}>
                Nome del gruppo
              </Typography>
              <CustomTextField
                {...baseTextFieldProps('name', '', 'Inserisci il nome del gruppo')}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={3}>
            <Grid item xs={8} mb={3}>
              <Typography variant="h6" sx={{ fontWeight: '700', color: '#5C6F82' }} pb={3}>
                Descrizione
              </Typography>
              <CustomTextField
                {...baseTextFieldProps('description', '', 'Inserisci una descrizione')}
                variant="outlined"
                multiline
                rows={3} // TODO MAX LENGHT 200
              />
            </Grid>

            <Grid item container spacing={3}>
              <Grid item xs={4} mb={3}>
                <Typography variant="h6" sx={{ fontWeight: '700', color: '#5C6F82' }} pb={3}>
                  Prodotto
                </Typography>
                <Select
                  placeholder="Seleziona il prodotto" // Todo fix
                  id="product-select"
                  fullWidth
                  value={productSelected?.title ?? ''}
                  variant="standard" // TODO Placeholder?
                >
                  {products.map((p) => (
                    <MenuItem key={p.id} value={p.title} onClick={() => setProductSelected(p)}>
                      {p.title}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>

            <Grid item container spacing={3}>
              <Grid item xs={8} mb={3}>
                <Typography variant="h6" sx={{ fontWeight: '700', color: '#5C6F82' }} pb={3}>
                  Referenti
                </Typography>

                <Select
                  disabled={!productSelected}
                  id="member-check-selection"
                  variant="standard"
                  // TODO PLACE HOLDER
                  multiple
                  fullWidth
                  value={formik.values.members}
                  renderValue={(selectedUsers) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedUsers.map((s) => (
                        <Chip
                          key={s.id}
                          label={s.name + ' ' + s.surname}
                          onDelete={() => {}} // TODO onDelete for closing chip
                          deleteIcon={<ClearIcon sx={{ color: '#FFFFFF !important' }} />} // Todo Check color of icon
                        />
                      ))}
                    </Box>
                  )}
                >
                  {Object.values(productUsers)
                    .filter((user) => user.status === 'ACTIVE')
                    .map((u) => {
                      const checkedIndex = formik.values.members.findIndex((s) => s.id === u.id);
                      const isChecked = checkedIndex > -1;
                      const onItemSelected = () => {
                        const nextUsersSelected = isChecked
                          ? formik.values.members.filter((_s, index) => index !== checkedIndex)
                          : formik.values.members.concat(u);
                        void formik.setFieldValue('members', nextUsersSelected);
                      };
                      return (
                        <MenuItem
                          key={u.id}
                          value={u.name}
                          sx={{ borderBottom: '1px', borderBottomColor: '#CFDCE6' }}
                        >
                          <Checkbox checked={isChecked} onClick={onItemSelected} />
                          {u.name} {u.surname}
                        </MenuItem>
                      );
                    })}
                </Select>
              </Grid>
            </Grid>

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
