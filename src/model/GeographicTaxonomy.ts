import { GeographicTaxonomy } from '../api/generated/b4f-dashboard/GeographicTaxonomy';
import { GeographicTaxonomyResource } from '../api/generated/party-registry-proxy/GeographicTaxonomyResource';

export const nationalValue = 'ITA';

export const geographicTaxonomyResource2geographicTaxonomy = (
  geotax: GeographicTaxonomy
): GeographicTaxonomyResource => ({
  code: geotax.code,
  desc: geotax.desc,
});
