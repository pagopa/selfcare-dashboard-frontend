import useErrorDispatcher from '@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/lib/hooks/useLoading';
import { userSelectors } from '@pagopa/selfcare-common-frontend/lib/redux/slices/userSlice';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { fetchProductAdmins } from '../../../../services/userService';
import { LOADING_TASK_FETCH_PRODUCT_ADMINS } from '../../../../utils/constants';
import { ENV } from '../../../../utils/env';
import {
  Admin,
  AdminPerson,
  getVisibleAdmins,
  useContractUpdateWizard,
} from '../../ContractUpdateWizardContext';
import { PersonFieldError } from '../addLRStep/validation';
import { validateAdmins } from './validation';

export type AdminField = {
  id: keyof AdminPerson;
  label: string;
  value: string;
  error?: string;
  readOnly: boolean;
  onChange: (value: string) => void;
};

export type AdminCard = {
  key: string;
  title: string;
  fields: Array<AdminField>;
  canRemove: boolean;
  // Empty cards added in this step are removed without asking for confirmation
  needsRemoveConfirmation: boolean;
};

export type SummaryField = { id: keyof AdminPerson; label: string; value: string };

const fieldIds: Array<keyof AdminPerson> = ['name', 'surname', 'taxCode', 'email'];

const isEmptyNewAdmin = (admin: Admin) =>
  !admin.userId && fieldIds.every((id) => admin[id].trim() === '');

const errorTranslationKey = (error: PersonFieldError) =>
  error === 'duplicateTaxCode'
    ? 'contractUpdateWizard.addUsers.errors.duplicateTaxCode'
    : `contractUpdateWizard.addLR.errors.${error}`;

export const useAddUsersStep = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useContractUpdateWizard();
  const { partyId, productId } = useParams<{ partyId: string; productId: string }>();
  const loggedUser = useSelector(userSelectors.selectLoggedUser);
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const productName = products?.find((product) => product.id === productId)?.title ?? productId;
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_FETCH_PRODUCT_ADMINS);

  // Users are fetched only once per wizard, so edits survive navigation between steps
  useEffect(() => {
    if (state.adminsStatus !== 'idle') {
      return;
    }
    dispatch({ type: 'loadAdminsStart' });
    setLoading(true);
    fetchProductAdmins(partyId, productId)
      .then((users) =>
        dispatch({
          type: 'loadAdmins',
          admins: users.map(({ id, name, surname, taxCode, email }) => ({
            name,
            surname,
            taxCode,
            email,
            userId: id,
            originalTaxCode: taxCode,
            isLoggedUser: !!loggedUser?.uid && id === loggedUser.uid,
          })),
        })
      )
      .catch((reason) => {
        addError({
          id: `FETCH_PRODUCT_ADMINS_${partyId}_${productId}`,
          blocking: false,
          error: reason,
          techDescription: `An error occurred while fetching the admins of party ${partyId} and product ${productId}`,
          toNotify: true,
        });
        dispatch({ type: 'loadAdmins', admins: [] });
      })
      .finally(() => setLoading(false));
  }, []);

  const legalRepresentative = state.draft.legalRepresentative;
  const summaryFields: Array<SummaryField> = fieldIds.map((id) => ({
    id,
    label: t(`contractUpdateWizard.addLR.fields.${id}`),
    value: legalRepresentative[id],
  }));

  const errorsByAdmin = validateAdmins(state.draft);

  const admins: Array<AdminCard> = getVisibleAdmins(state.draft).map((admin, index) => ({
    key: admin.key,
    title: t('contractUpdateWizard.addUsers.adminTitle', { index: index + 1 }),
    canRemove: !admin.isLoggedUser,
    needsRemoveConfirmation: !isEmptyNewAdmin(admin),
    fields: fieldIds.map((id) => {
      const error = errorsByAdmin[admin.key]?.[id];
      // Like in the Legal Representative step, "required" errors appear only after a continue attempt
      const visibleError = error && (error !== 'required' || state.showErrors) ? error : undefined;
      return {
        id,
        label: t(`contractUpdateWizard.addLR.fields.${id}`),
        value: admin[id],
        error: visibleError && t(errorTranslationKey(visibleError)),
        readOnly: !!admin.isLoggedUser && id !== 'email',
        onChange: (value: string) =>
          dispatch({
            type: 'updateAdmin',
            key: admin.key,
            field: id,
            value: id === 'taxCode' ? value.toUpperCase() : value,
          }),
      };
    }),
  }));

  return {
    productName,
    rolesInfoUrl: `${ENV.URL_DOCUMENTATION}area-riservata/ruoli`,
    summaryFields,
    admins,
    isLoading: state.adminsStatus !== 'loaded',
    addAdmin: () => dispatch({ type: 'addAdmin' }),
    removeAdmin: (key: string) => dispatch({ type: 'removeAdmin', key }),
  };
};
