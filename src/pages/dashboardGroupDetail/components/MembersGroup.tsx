import { Grid, Link, Divider, Typography, Chip } from '@mui/material';
import { useHistory } from 'react-router';
import { resolvePathVariables } from '@pagopa/selfcare-common-frontend/utils/routes-utils';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PartyGroupExt } from '../../../model/PartyGroup';
import { Product } from '../../../model/Product';
import { Party, UserStatus } from '../../../model/Party';
import { ProductRolesLists, transcodeProductRole2Title } from '../../../model/ProductRole';
import { PartyUser, PartyUserProduct } from '../../../model/PartyUser';
import { ENV } from '../../../utils/env';
import GroupMenu from './GroupMenu';

type Props = {
  partyGroup: PartyGroupExt;
  product: Product;
  party: Party;
  isSuspended: boolean;
  productRolesLists: ProductRolesLists;
  canEdit: boolean;
};

export default function MembersGroup({
  partyGroup,
  product,
  party,
  isSuspended,
  productRolesLists,
  canEdit,
}: Props) {
  const history = useHistory();

  const [members, setMembers] = useState<Array<PartyUser>>([]);
  const { t } = useTranslation();

  useEffect(() => {
    setMembers(partyGroup.members);
  }, [partyGroup]);

  const onMemberDelete = (member: PartyUser) => {
    const nextMembers = members.filter((u) => u.id !== member.id);
    setMembers(nextMembers);
    // eslint-disable-next-line functional/immutable-data
    partyGroup.members = nextMembers;
  };

  const onMemberStatusUpdate = (
    member: PartyUser,
    userProduct: PartyUserProduct,
    nextStatus: UserStatus
  ) => {
    // eslint-disable-next-line functional/immutable-data
    member.status = nextStatus;
    // eslint-disable-next-line functional/immutable-data
    userProduct.roles[0].status = nextStatus;
    setMembers(members.slice());
  };

  return (
    <Grid container py={2}>
      {members.map((member, index) => {
        const userProduct = member.products.find((p) => p.id === product.id);
        const isMemeberSuspended =
          member.status === 'SUSPENDED' ||
          !userProduct?.roles.find((r) => r.status !== 'SUSPENDED');

        return (
          <Grid key={member.id} item container spacing={1}>
            <Grid item xs={4}>
              <Link
                component="button"
                disabled={isSuspended}
                sx={{
                  width: '100%',
                  textDecoration: 'none',
                  fontWeight: 600,
                  cursor: isSuspended ? 'text' : 'pointer',
                  display: 'flex',
                }}
                onClick={() =>
                  history.push(
                    resolvePathVariables(ENV.ROUTES.USERS_DETAIL, {
                      institutionId: partyGroup.institutionId,
                      userId: member.id,
                    })
                  )
                }
              >
                <Typography
                  className="ShowDots"
                  sx={{
                    color: isSuspended ? '#a2adb8' : '#0073E6',
                    fontWeight: 600,
                    justifyContent: 'flexStart',
                  }}
                  title={`${member.name} ${member.surname}`}
                >
                  {`${member.name} ${member.surname}${
                    member.isCurrentUser ? t('membersGroup.currentUser') : ''
                  }`}
                </Typography>
              </Link>
            </Grid>
            <Grid item xs={3}>
              <Typography
                className="ShowDots"
                color={isMemeberSuspended || isSuspended ? '#9E9E9E' : undefined}
                title={member.email}
                width="100%"
              >
                {member.email}
              </Typography>
            </Grid>
            <Grid item xs={isMemeberSuspended ? 3 : 4}>
              {userProduct?.roles?.map((r, index) => (
                <Grid container key={index}>
                  <Grid item xs={isMemeberSuspended ? 8 : 12}>
                    <Typography
                      title={transcodeProductRole2Title(r.role, productRolesLists)}
                      className="ShowDots"
                      width="100%"
                      color={r.status === 'SUSPENDED' || isSuspended ? '#9E9E9E' : undefined}
                    >
                      {transcodeProductRole2Title(r.role, productRolesLists)}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
            </Grid>

            {isMemeberSuspended && (
              <Grid item xs={1}>
                <Chip
                  label="Sospeso"
                  variant="outlined"
                  sx={{
                    fontWeight: '600',
                    fontSize: '14px',
                    background: '#E0E0E0',
                    border: 'none',
                    borderRadius: '16px',
                    width: '76px',
                    height: '24px',
                  }}
                />
              </Grid>
            )}

            <GroupMenu
              member={member}
              party={party}
              product={product}
              partyGroup={partyGroup}
              userProduct={userProduct}
              isSuspended={isSuspended}
              productRolesLists={productRolesLists}
              onMemberStatusUpdate={onMemberStatusUpdate}
              onMemberDelete={onMemberDelete}
              canEdit={canEdit}
            />
            {index !== partyGroup.members.length - 1 && (
              <Grid item xs={12} py={2}>
                <Divider />
              </Grid>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
}
