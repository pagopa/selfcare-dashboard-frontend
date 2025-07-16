import { ProductOnBoardingStatusEnum } from '../../../../../../api/generated/b4f-dashboard/OnboardedProductResource';
import { CountryResource } from '../../../../../../model/CountryResource';
import { Party } from '../../../../../../model/Party';

export const getPartyDisplayInfo = (party: Party, institutionTypesList: Array<string>) => {
  const uniqueInstitutionTypesList = [...new Set(institutionTypesList)];
  const isInstitutionTypePA = institutionTypesList.includes('PA');
  const isAooUo = party.subunitType === 'AOO' || party.subunitType === 'UO';
  const lastPartyVatNumber = party.products[party.products.length - 1]?.billing?.vatNumber;
  const isTaxCodeEquals2Piva = party.fiscalCode === lastPartyVatNumber;

  const ipaCodeForPa = party.products
    .filter((product) => product.productOnBoardingStatus === ProductOnBoardingStatusEnum.ACTIVE)
    .find((product) => product.institutionType === 'PA')?.originId;

  return {
    uniqueInstitutionTypesList,
    isInstitutionTypePA,
    isAooUo,
    lastPartyVatNumber,
    isTaxCodeEquals2Piva,
    ipaCodeForPa,
  };
};

export const getCountryNameByAlpha2 = (
  countries: Array<CountryResource>,
  alpha2?: string
): string => {
  const matchingCountry = countries.find((country) => country.alpha_2 === alpha2);
  return matchingCountry?.name ? `- ${matchingCountry.name}` : '';
};

export const capitalizeFirstLetter = (str?: string): string => {
  if (!str) {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getFormattedForeignAddress = (
  party: Party,
  countries: Array<CountryResource>
): string =>
  `${party.registeredOffice}, ${capitalizeFirstLetter(party.city)} ${getCountryNameByAlpha2(
    countries,
    party.country
  )}`;

export const getSimpleTooltipText = (text?: string, showTooltipAfter?: number): string =>
  text && text.length >= (showTooltipAfter || 45) ? text : '';

export const getTooltipText = (
  isForeignInsurence: boolean,
  formattedForeignAddress: string,
  registeredOffice: string,
  showTooltipAfter: number
): string => {
  if (isForeignInsurence && formattedForeignAddress.length >= showTooltipAfter) {
    return formattedForeignAddress;
  }
  if (registeredOffice.length >= showTooltipAfter) {
    return registeredOffice;
  }
  return '';
};

export const getIpaCodeForPa = (party: Party): string | undefined =>
  party.products
    .filter((product) => product.productOnBoardingStatus === ProductOnBoardingStatusEnum.ACTIVE)
    .find((product) => product.institutionType === 'PA')?.originId;

export const getStructureValue = (subunitType?: string): string =>
  subunitType === 'AOO'
    ? 'Area Organizzativa Omogenea'
    : subunitType === 'UO'
    ? 'Unità Organizzativa'
    : '';
