import { PartyRegistryProxyApi } from '../api/PartyRegistryProxyApiClient';
import {
  GeographicTaxonomyRegistryProxy,
  geographicTaxonomyResource2geographicTaxonomy,
} from '../model/GeographicTaxonomy';

export const retrieveGeotaxonomyFromDescription = (
  query: string
): Promise<Array<GeographicTaxonomyRegistryProxy>> =>
  PartyRegistryProxyApi.getTaxonomiesByQuery(query).then((geographicTaxonomyResource) =>
    geographicTaxonomyResource
      ? geographicTaxonomyResource.map(geographicTaxonomyResource2geographicTaxonomy)
      : []
  );
