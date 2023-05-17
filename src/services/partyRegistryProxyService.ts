import { PartyRegistryProxyApi } from '../api/PartyRegistryProxyApiClient';
import {
  GeographicTaxonomy,
  geographicTaxonomyResource2geographicTaxonomy,
} from '../model/GeographicTaxonomy';

export const retrieveGeotaxonomyFromDescription = (
  query: string
): Promise<Array<GeographicTaxonomy>> =>
  PartyRegistryProxyApi.getTaxonomiesByQuery(query).then((geographicTaxonomyResource) =>
    geographicTaxonomyResource
      ? geographicTaxonomyResource.map(geographicTaxonomyResource2geographicTaxonomy)
      : []
  );

/* istanbul ignore if */
// if (process.env.REACT_APP_ENABLE_GEOTAXONOMY === 'true') {
//   return getTaxonomiesByQueryMocked(query);
// } else {
// }
