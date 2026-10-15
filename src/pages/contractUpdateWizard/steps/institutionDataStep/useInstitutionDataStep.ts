import { useTranslation } from 'react-i18next';
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

const institutionFields: Array<{ id: string; getValue: (party?: Party) => string | undefined }> = [
  { id: 'businessName', getValue: (party) => party?.description },
  { id: 'registeredOffice', getValue: (party) => party?.registeredOffice },
  { id: 'zipCode', getValue: (party) => party?.zipCode },
  { id: 'city', getValue: (party) => party?.city },
  { id: 'county', getValue: (party) => party?.county },
  { id: 'digitalAddress', getValue: (party) => party?.digitalAddress },
  { id: 'fiscalCode', getValue: (party) => party?.fiscalCode },
  { id: 'vatNumber', getValue: (party) => party?.vatNumber },
  { id: 'recipientCode', getValue: (party) => party?.recipientCode },
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

  const fields: Array<InstitutionDataField> = institutionFields.map(({ id, getValue }) => ({
    id,
    label: t(`contractUpdateWizard.institutionData.fields.${id}`),
    value: getValue(party)?.trim() || EMPTY_FIELD_VALUE,
  }));

  return { fields, assistanceUrl: ENV.URL_FE.ASSISTANCE };
};
