import { DelegationResource, TypeEnum } from '../api/generated/b4f-dashboard/DelegationResource';

export type Delegation = {
  id: string;
  institutionFromRootName: string;
  institutionName: string;
  partnerName: string;
  productId: string;
  to: string;
  type: TypeEnum;
};

export const delegationResource2Delegation = (delegation: DelegationResource): Delegation => ({
  id: delegation.id ?? '',
  institutionFromRootName: delegation.institutionFromRootName ?? '',
  institutionName: delegation.institutionName ?? '',
  partnerName: delegation.partnerName ?? '',
  productId: delegation.productId ?? '',
  to: delegation.to ?? '',
  type: delegation.type ?? (TypeEnum.PT || TypeEnum.AOO || TypeEnum.UO),
});
