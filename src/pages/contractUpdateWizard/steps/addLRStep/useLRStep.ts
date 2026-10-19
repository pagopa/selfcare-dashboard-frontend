import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { ENV } from '../../../../utils/env';
import { LegalRepresentative, useContractUpdateWizard } from '../../ContractUpdateWizardContext';
import { validateLegalRepresentative } from './validation';

export type LegalRepresentativeField = {
  id: keyof LegalRepresentative;
  label: string;
  value: string;
  error?: string;
  hint?: string;
  onChange: (value: string) => void;
};

const fieldIds: Array<keyof LegalRepresentative> = ['name', 'surname', 'taxCode', 'email'];

export const useLRStep = () => {
  const { t } = useTranslation();
  const { state, dispatch } = useContractUpdateWizard();
  const { productId } = useParams<{ productId?: string }>();
  const products = useAppSelector(partiesSelectors.selectPartySelectedProducts);
  const productName = products?.find((product) => product.id === productId)?.title ?? productId;

  const legalRepresentative = state.draft.legalRepresentative;
  const errors = validateLegalRepresentative(legalRepresentative);

  const fields: Array<LegalRepresentativeField> = fieldIds.map((id) => {
    const error = errors[id];
    // Like in the users microfrontend, "required" errors appear only after a continue attempt
    const visibleError = error && (error !== 'required' || state.showErrors) ? error : undefined;
    return {
      id,
      label: t(`contractUpdateWizard.addLR.fields.${id}`),
      value: legalRepresentative[id],
      error: visibleError && t(`contractUpdateWizard.addLR.errors.${visibleError}`),
      hint: id === 'email' ? t('contractUpdateWizard.addLR.emailHint') : undefined,
      onChange: (value: string) =>
        dispatch({
          type: 'updateLegalRepresentative',
          field: id,
          value: id === 'taxCode' ? value.toUpperCase() : value,
        }),
    };
  });

  return { fields, productName, rolesInfoUrl: `${ENV.URL_DOCUMENTATION}area-riservata/ruoli` };
};
