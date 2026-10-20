import { CountryResource } from '../../../../../../../model/CountryResource';
import { Party } from '../../../../../../../model/Party';
import { mockedParties } from '../../../../../../../services/__mocks__/partyService';
import {
  capitalizeFirstLetter,
  getCountryNameByAlpha2,
  getFormattedForeignAddress,
  getIpaCodeForPa,
  getPartyDisplayInfo,
  getSimpleTooltipText,
  getStructureValue,
  getTooltipText,
} from '../partyUtils';

const countries = [
  { name: 'Regno Unito', alpha_2: 'GB' },
  { name: 'Francia', alpha_2: 'FR' },
] as Array<CountryResource>;

const buildParty = (overrides: Partial<Party> = {}): Party => ({
  ...mockedParties[0],
  ...overrides,
});

describe('partyUtils', () => {
  describe('getPartyDisplayInfo', () => {
    test('returns PA info with ipa code and vat number equal to fiscal code', () => {
      const party = buildParty({
        fiscalCode: '12345',
        subunitType: undefined,
        products: [
          {
            productId: 'prod-io',
            productOnBoardingStatus: 'PENDING',
            institutionType: 'PA',
            originId: 'pending-origin',
          },
          {
            productId: 'prod-pagopa',
            productOnBoardingStatus: 'ACTIVE',
            institutionType: 'PA',
            originId: 'c_h501',
            billing: { vatNumber: '12345' },
          },
        ] as Party['products'],
      });

      const info = getPartyDisplayInfo(party, ['PA', 'PA', 'GSP']);

      expect(info).toEqual({
        uniqueInstitutionTypesList: ['PA', 'GSP'],
        isInstitutionTypePA: true,
        isAooUo: false,
        lastPartyVatNumber: '12345',
        isTaxCodeEquals2Piva: true,
        ipaCodeForPa: 'c_h501',
      });
    });

    test.each(['AOO', 'UO'])('detects %s subunit and non PA party', (subunitType) => {
      const party = buildParty({ subunitType, fiscalCode: 'abc', products: [] });

      const info = getPartyDisplayInfo(party, ['GSP']);

      expect(info.isAooUo).toBe(true);
      expect(info.isInstitutionTypePA).toBe(false);
      expect(info.lastPartyVatNumber).toBeUndefined();
      expect(info.isTaxCodeEquals2Piva).toBe(false);
      expect(info.ipaCodeForPa).toBeUndefined();
    });
  });

  test('getCountryNameByAlpha2 returns the formatted name or an empty string', () => {
    expect(getCountryNameByAlpha2(countries, 'GB')).toBe('- Regno Unito');
    expect(getCountryNameByAlpha2(countries, 'XX')).toBe('');
    expect(getCountryNameByAlpha2(countries)).toBe('');
    expect(getCountryNameByAlpha2([{ alpha_2: 'DE' } as CountryResource], 'DE')).toBe('');
  });

  test('capitalizeFirstLetter', () => {
    expect(capitalizeFirstLetter('london')).toBe('London');
    expect(capitalizeFirstLetter('')).toBe('');
    expect(capitalizeFirstLetter(undefined)).toBe('');
  });

  test('getFormattedForeignAddress', () => {
    const party = buildParty({
      registeredOffice: 'Baker Street 221b',
      city: 'london',
      country: 'GB',
    });
    expect(getFormattedForeignAddress(party, countries)).toBe(
      'Baker Street 221b, London - Regno Unito'
    );
    expect(
      getFormattedForeignAddress({ ...party, city: undefined, country: 'XX' }, countries)
    ).toBe('Baker Street 221b,  ');
  });

  test('getSimpleTooltipText', () => {
    const long = 'a'.repeat(45);
    expect(getSimpleTooltipText(long)).toBe(long);
    expect(getSimpleTooltipText('a'.repeat(44))).toBe('');
    expect(getSimpleTooltipText('abcde', 5)).toBe('abcde');
    expect(getSimpleTooltipText('abcd', 5)).toBe('');
    expect(getSimpleTooltipText(undefined, 5)).toBe('');
  });

  test('getTooltipText', () => {
    const longForeign = 'f'.repeat(10);
    const longOffice = 'o'.repeat(10);
    expect(getTooltipText(true, longForeign, longOffice, 10)).toBe(longForeign);
    expect(getTooltipText(true, 'short', longOffice, 10)).toBe(longOffice);
    expect(getTooltipText(false, longForeign, longOffice, 10)).toBe(longOffice);
    expect(getTooltipText(false, longForeign, 'short', 10)).toBe('');
  });

  test('getIpaCodeForPa returns originId of the first active PA product', () => {
    const party = buildParty({
      products: [
        {
          productId: 'a',
          productOnBoardingStatus: 'ACTIVE',
          institutionType: 'GSP',
          originId: 'gsp',
        },
        {
          productId: 'b',
          productOnBoardingStatus: 'PENDING',
          institutionType: 'PA',
          originId: 'pending',
        },
        {
          productId: 'c',
          productOnBoardingStatus: 'ACTIVE',
          institutionType: 'PA',
          originId: 'ipa',
        },
      ] as Party['products'],
    });
    expect(getIpaCodeForPa(party)).toBe('ipa');
    expect(getIpaCodeForPa(buildParty({ products: [] }))).toBeUndefined();
  });

  test('getStructureValue', () => {
    expect(getStructureValue('AOO')).toBe('Area Organizzativa Omogenea');
    expect(getStructureValue('UO')).toBe('Unità Organizzativa');
    expect(getStructureValue('OTHER')).toBe('');
    expect(getStructureValue()).toBe('');
  });
});
