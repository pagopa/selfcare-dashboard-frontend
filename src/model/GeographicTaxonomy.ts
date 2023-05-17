import { GeographicTaxonomyResource } from './../api/generated/b4f-dashboard/GeographicTaxonomyResource';
export type GeographicTaxonomy = {
  code: string;
  desc: string;
};

export const geographicTaxonomyResource2geographicTaxonomy = (
  geotax: GeographicTaxonomyResource
): GeographicTaxonomy => ({
  code: geotax.code,
  desc: geotax.desc,
});
