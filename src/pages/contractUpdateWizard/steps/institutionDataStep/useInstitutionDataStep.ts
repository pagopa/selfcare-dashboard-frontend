import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { Party } from '../../../../model/Party';
import { useAppSelector } from '../../../../redux/hooks';
import { partiesSelectors } from '../../../../redux/slices/partiesSlice';
import { ENV } from '../../../../utils/env';

export const EMPTY_FIELD_VALUE = '-';

export type InstitutionDataField = {
  id: string;
  label: string;
  value: string;
};

type Billing = NonNullable<Party['products'][number]['billing']>;

// vatNumber and recipientCode are usually returned in the billing of the onboarded product
const institutionFields: Array<{
  id: string;
  getValue: (party?: Party, billing?: Billing) => string | undefined;
}> = [
  { id: 'businessName', getValue: (party) => party?.description },
  { id: 'registeredOffice', getValue: (party) => party?.registeredOffice },
  { id: 'zipCode', getValue: (party) => party?.zipCode },
  { id: 'city', getValue: (party) => party?.city },
  { id: 'county', getValue: (party) => party?.county },
  { id: 'digitalAddress', getValue: (party) => party?.digitalAddress },
  { id: 'fiscalCode', getValue: (party) => party?.fiscalCode },
  { id: 'vatNumber', getValue: (party, billing) => billing?.vatNumber || party?.vatNumber },
  {
    id: 'recipientCode',
    getValue: (party, billing) => billing?.recipientCode || party?.recipientCode,
  },
  { id: 'supportEmail', getValue: (party) => party?.supportEmail },
  {
    id: 'geographicTaxonomies',
    getValue: (party) =>
      party?.geographicTaxonomies
        ?.map((taxonomy) => taxonomy.desc)
        .filter(Boolean)
        .join(', '),
  },
];

export const useInstitutionDataStep = () => {
  const { t } = useTranslation();
  const party = useAppSelector(partiesSelectors.selectPartySelected);
  const { productId } = useParams<{ productId?: string }>();
  const billing = party?.products.find((product) => product.productId === productId)?.billing;

  const fields: Array<InstitutionDataField> = institutionFields.map(({ id, getValue }) => ({
    id,
    label: t(`contractUpdateWizard.institutionData.fields.${id}`),
    value: getValue(party, billing)?.trim() || EMPTY_FIELD_VALUE,
  }));

  const assistanceParams = new URLSearchParams({
    ...(productId && { productId }),
    cat: 'contract-update',
  });
  const assistanceUrl = `${ENV.URL_FE.ASSISTANCE}?${assistanceParams.toString()}`;

  return { fields, assistanceUrl };
};
