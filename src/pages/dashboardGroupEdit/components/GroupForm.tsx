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
import { ReactComponent as ClearIcon } from '../../../assets/clear.svg';
import { Party } from '../../../model/Party';
import { PartyGroupOnCreation, PartyGroupOnEdit } from '../../../model/PartyGroup';
import { PartyUser } from '../../../model/PartyUser';
import { Product, ProductsMap } from '../../../model/Product';
import { DASHBOARD_ROUTES } from '../../../routes';
import { savePartyGroup, updatePartyGroup } from '../../../services/groupsService';
import { LOADING_TASK_FETCH_USER_PRODUCT, LOADING_TASK_SAVE_GROUP } from '../../../utils/constants';
import { fetchPartyUsers } from '../../../services/usersService';
import { useAppSelector } from '../../../redux/hooks';

const CustomBox = styled(Box)({
  '&::-webkit-scrollbar': {
    width: 8,
  },
  '&::-webkit-scrollbar-track': {
    boxShadow: `inset 10px 10px  #E6E9F2`,
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#0073E6',
  },
  overflowY: 'auto',
  height: '100%',
  maxHeight: '200px',
});

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
      fontSize: '16px',
      fontWeight: '400',
      color: '#5C6F82',
      opacity: '1',
    },
  },
  textArea: {
    '&::placeholder': {
      fontStyle: 'italic',
      fontSize: '16px',
      fontWeight: '400',
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
  initialFormData: PartyGroupOnCreation | PartyGroupOnEdit;
  isClone: boolean;
  partyGroupCloneId?: string;
  goBack?: () => void;
};

export default function AddGroupForm({
  products,
  party,
  initialFormData,
  productsMap,
  isClone,
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

  const isEdit = !!(initialFormData as PartyGroupOnEdit).id;

  useEffect(() => {
    if (productSelected) {
      fetchProductUsers(productSelected);
    }
  }, [productSelected]);

  useEffect(() => {
    if (initialFormData.productId) {
      setProductSelected(productsMap[initialFormData.productId]);
    }
  }, [initialFormData.productId]);

  const goBackInner =
    goBack ??
    (() =>
      history.push(
        resolvePathVariables(
          isEdit
            ? DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.PARTY_GROUP_DETAIL.path
            : DASHBOARD_ROUTES.PARTY_GROUPS.subRoutes.MAIN.path,
          {
            institutionId: party.institutionId,
            groupId: (initialFormData as PartyGroupOnEdit).id,
          }
        )
      ));

  const validate = (values: Partial<PartyGroupOnCreation>) =>
    Object.fromEntries(
      Object.entries({
        name: !values.name ? requiredError : undefined,
        institutionId: !values.institutionId ? requiredError : undefined,
        productId: !productSelected ? requiredError : undefined,
        description: !values.description ? requiredError : undefined,
        members: values.members?.length === 0 ? requiredError : undefined,
      }).filter(([_key, value]) => value)
    );
  const save = (values: PartyGroupOnCreation) => {
    // eslint-disable-next-line functional/immutable-data
    values.productId = (productSelected as Product).id;
    setLoadingSaveGroup(true);
    (isEdit ? updatePartyGroup : savePartyGroup)(
      party,
      productSelected as Product,
      values as PartyGroupOnEdit
    )
      .then(() => {
        unregisterUnloadEvent();
        trackEvent(
          'GROUP_CREATE',
          /* TODO CLONE */ {
            party_id: party.institutionId,
            // TODO only in CLONE -> cloned_group_id: partyGroupCloneId
          }
        );
        addNotify({
          component: 'Toast',
          id: 'SAVE_GROUP',
          title: isEdit ? 'GRUPPO MODIFICATO' : 'GRUPPO CREATO',
          message: (
            <>
              {isEdit
                ? 'Hai modificato correttamente il gruppo '
                : 'Hai creato correttamente il gruppo '}
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
          displayableTitle: isEdit ? 'ERRORE DURANTE LA MODIFICA ' : 'ERRORE DURANTE LA CREAZIONE',
          displayableDescription: isEdit
            ? "C'è stato un errore durante la modifica del gruppo. Riprova"
            : "C'è stato un errore durante la creazione del gruppo. Riprova.",
          techDescription: isEdit
            ? `An error occurred while edit of group ${values.name}`
            : `An error occurred while creation of group ${values.name}`,
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
    placeholder: string,
    fontWeight: number = 400,
    fontSize: number = 16
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
          fontSize,
          fontWeight,
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
      .then((productUsersPage) => {
        const activeUsers = productUsersPage.content.filter((user) => user.status === 'ACTIVE');
        setProductUsers(activeUsers);
        void formik.setFieldValue('members', [], true);
        if (isEdit) {
          setProductUsers(productUsersPage.content);
        } else if (isClone) {
          void formik.setFieldValue(
            'members',
            activeUsers.filter((u) => u.products[0].title !== productSelected.title),
            true
          );
        }
      })
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
          <Grid item container spacing={3} marginBottom={5}>
            <Grid item xs={8} mb={3}>
              <Typography variant="h6" sx={{ fontWeight: '700', color: '#5C6F82' }} pb={1}>
                Nome del gruppo
              </Typography>
              <CustomTextField
                {...baseTextFieldProps('name', '', 'Inserisci il nome del gruppo', 700, 20)}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={3} marginBottom={5}>
            <Grid item xs={8} mb={3}>
              <Typography variant="h6" sx={{ fontWeight: '700', color: '#5C6F82' }} pb={1}>
                Descrizione
              </Typography>
              <CustomTextField
                {...baseTextFieldProps('description', '', 'Inserisci una descrizione')}
                variant="outlined"
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
          <Grid item container spacing={3} marginBottom={4}>
            <Grid item xs={4} mb={3}>
              <Typography variant="h6" sx={{ fontWeight: '700', color: '#5C6F82' }} pb={1}>
                Prodotto
              </Typography>

              <Select
                id="product-select"
                fullWidth
                value={productSelected?.title ?? ''}
                displayEmpty
                variant="standard"
                renderValue={
                  (productSelected) =>
                    productSelected === '' ? (
                      <Typography sx={{ fontStyle: 'italic', fontSize: '16px' }}>
                        Seleziona il prodotto
                      </Typography>
                    ) : (
                      <Typography fontWeight={700} fontSize={20}>
                        {productSelected}
                      </Typography>
                    ) // TODO se Clone && productSelected Undef --> helpertext
                }
              >
                {products
                  .filter((p) => p.userRole === 'ADMIN')
                  .map((p) => (
                    <MenuItem
                      key={p.id}
                      value={p.title}
                      sx={{ fontSize: '14px', color: '#000000' }}
                      onClick={() => setProductSelected(p)}
                    >
                      {p.title}
                    </MenuItem>
                  ))}
              </Select>
            </Grid>
          </Grid>

          <Grid item container spacing={3} marginBottom={5}>
            <Grid item xs={8} mb={3}>
              <Typography variant="h6" sx={{ fontWeight: '700', color: '#5C6F82' }} pb={1}>
                Referenti
              </Typography>

              <Select
                disabled={!productSelected}
                id="member-check-selection"
                variant="standard"
                multiple
                fullWidth
                value={formik.values.members}
                displayEmpty
                renderValue={(selectedUsers) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                    {selectedUsers.length === 0 ? (
                      <Typography sx={{ fontStyle: 'italic', fontSize: '16px' }}>
                        Seleziona i referenti che vuoi assegnare al gruppo
                      </Typography>
                    ) : undefined}
                    {selectedUsers.map((s) => (
                      <Chip
                        color="default"
                        size="small"
                        variant="outlined"
                        key={s.id}
                        label={s.name + ' ' + s.surname}
                        onDelete={() =>
                          formik.setFieldValue(
                            'members',
                            selectedUsers.filter((us) => us !== s),
                            true
                          )
                        }
                        deleteIcon={<ClearIcon onMouseDown={(e) => e.stopPropagation()} />}
                      />
                    ))}
                  </Box>
                )}
              >
                <CustomBox>
                  {Object.values(productUsers).map((u) => {
                    const checkedIndex = formik.values.members.findIndex((s) => s.id === u.id);
                    const isChecked = checkedIndex > -1;
                    const onItemSelected = () => {
                      const nextUsersSelected = isChecked
                        ? formik.values.members.filter((_s, index) => index !== checkedIndex)
                        : formik.values.members.concat(u);
                      void formik.setFieldValue('members', nextUsersSelected, true);
                    };
                    return (
                      <MenuItem
                        key={u.id}
                        value={u.name}
                        sx={{
                          fontSize: '14px',
                          color: '#000000',
                          borderBottom: 'solid',
                          borderBottomWidth: 'thin',
                          borderBottomColor: '#CFDCE6',
                          width: '554px',
                          height: '48px',
                        }}
                      >
                        <Checkbox checked={isChecked} onClick={onItemSelected} />
                        {u.name} {u.surname}
                      </MenuItem>
                    );
                  })}
                </CustomBox>
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
      </form>
    </React.Fragment>
  );
}
