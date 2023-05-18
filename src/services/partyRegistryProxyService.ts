import { PartyRegistryProxyApi } from '../api/PartyRegistryProxyApiClient';
import {
  GeographicTaxonomyRegistryProxy,
  geographicTaxonomyResource2geographicTaxonomy,
} from '../model/GeographicTaxonomy';

export const retrieveGeotaxonomyFromDescription = (
  query: string
): Promise<Array<GeographicTaxonomyRegistryProxy>> =>
  PartyRegistryProxyApi.getTaxonomiesByQuery(query).then((geographicTaxonomyResource) => {
    console.log('xx geographicTaxonomyResource', geographicTaxonomyResource);
    return geographicTaxonomyResource
      ? geographicTaxonomyResource.map(geographicTaxonomyResource2geographicTaxonomy)
      : [];
  });

/* istanbul ignore if */
// if (process.env.REACT_APP_ENABLE_GEOTAXONOMY === 'true') {
//   return getTaxonomiesByQueryMocked(query);
// } else {
// }
