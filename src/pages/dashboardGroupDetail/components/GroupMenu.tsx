import { Box, Divider, MenuItem } from '@mui/material';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import { PartyUser, PartyUserProduct } from '../../../model/PartyUser';
import { deleteGroupRelation } from '../../../services/groupsService';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../utils/constants';
import { Party } from '../../../model/Party';
import { Product } from '../../../model/Product';
import { PartyGroupExt } from '../../../model/PartyGroup';
type Props = {
  member: PartyUser;
  party: Party;
  anchorEl: Element | ((element: Element) => Element) | null | undefined;
  handleClose: () => void;
  fetchPartyGroup: () => void;
  handleChangeMemberState: () => void;
  product: Product;
  partyGroup: PartyGroupExt;
  userProduct: PartyUserProduct | undefined;
};
export default function GroupMenu({
  member,
  party,
  //   anchorEl,
  handleClose,
  fetchPartyGroup,
  handleChangeMemberState,
  product,
  partyGroup,
  userProduct,
}: Props) {
  const addError = useErrorDispatcher();
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);

  return (
    <>
      <Box width="100%" display="flex" justifyContent="center">
        <MenuItem
          onClick={() => {
            setLoading(true);
            deleteGroupRelation(party, product, partyGroup, member.id)
              .then((_) => {
                handleClose();
                fetchPartyGroup();
              })
              .catch((reason) =>
                addError({
                  id: `DELETE_PARTY_GROUP_ERROR-${partyGroup.id}`,
                  blocking: false,
                  error: reason,
                  techDescription: `Something gone wrong while deleting group ${partyGroup.name}`,
                  toNotify: true,
                })
              )
              .finally(() => setLoading(false));
          }}
        >
          Dissocia dal gruppo
        </MenuItem>
      </Box>
      {!member.isCurrentUser && userProduct?.roles.length === 1 && (
        <Box key={member.id}>
          <Box width="170px" margin="4px auto">
            <Divider />
          </Box>
          <Box width="100%" display="flex" justifyContent="center">
            <MenuItem onClick={handleChangeMemberState}>
              {member.status === 'ACTIVE'
                ? 'Sospendi Referente'
                : member.status === 'SUSPENDED'
                ? 'Riabilita Referente'
                : ''}
            </MenuItem>
          </Box>
        </Box>
      )}
    </>
  );
}
