import { GeographicTaxonomyResource } from '../api/generated/party-registry-proxy/GeographicTaxonomyResource';

export const nationalValue = 'ITA';

export type GeographicTaxonomyRegistryProxy = {
  code: string;
  desc: string;
};

export const geographicTaxonomyResource2geographicTaxonomy = (
  geotax: GeographicTaxonomyResource
): GeographicTaxonomyRegistryProxy => ({
  code: geotax.code ?? '',
  desc: geotax.desc ?? '',
});
