import { useEffect, useState } from 'react';
import { CountryResource } from '../../../../../model/CountryResource';
import { ENV } from '../../../../../utils/env';

export const useCountries = (isForeignInsurence: boolean) => {
  const [countries, setCountries] = useState<Array<CountryResource>>([]);

  const getCountriesJSON = async () => {
    const response = await fetch(ENV.JSON_URL.COUNTRIES);
    setCountries(await response.json());
  };

  useEffect(() => {
    if (isForeignInsurence && countries.length === 0) {
      void getCountriesJSON();
    }
  }, [isForeignInsurence, countries.length]);

  return countries;
};
