import { GeographicTaxonomyResource } from '../api/generated/party-registry-proxy/GeographicTaxonomyResource';
import { PartyRegistryProxyApi } from '../api/PartyRegistryProxyApiClient';
import { geographicTaxonomyResource2geographicTaxonomy } from '../model/GeographicTaxonomy';

export const retrieveGeotaxonomyFromDescription = (
  query: string
): Promise<Array<GeographicTaxonomyResource>> =>
  PartyRegistryProxyApi.getTaxonomiesByQuery(query).then((geographicTaxonomyResource) =>
    geographicTaxonomyResource
      ? geographicTaxonomyResource.map(geographicTaxonomyResource2geographicTaxonomy)
      : []
  );
