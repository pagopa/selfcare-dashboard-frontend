import { Box, Checkbox, FormControlLabel, Link, Typography } from '@mui/material';
import useErrorDispatcher from '@pagopa/selfcare-common-frontend/hooks/useErrorDispatcher';
import useLoading from '@pagopa/selfcare-common-frontend/hooks/useLoading';
import useUserNotify from '@pagopa/selfcare-common-frontend/hooks/useUserNotify';
import { useEffect, useState } from 'react';
import { Party } from '../../../model/Party';
import { PartyUser, PartyUserProduct } from '../../../model/PartyUser';
import { Product } from '../../../model/Product';
import { ProductRolesLists } from '../../../model/ProductRole';
import { savePartyUser } from '../../../services/usersService';
import { LOADING_TASK_UPDATE_PARTY_USER_STATUS } from '../../../utils/constants';

type Props = {
  party: Party;
  user: PartyUser;
  fetchPartyUser: () => void;
  userProduct: PartyUserProduct;
  product: Product;
  productRolesList: ProductRolesLists;
};
export default function UserProductAddRoles({
  party,
  user,
  userProduct,
  product,
  fetchPartyUser,
  productRolesList,
}: Props) {
  const setLoading = useLoading(LOADING_TASK_UPDATE_PARTY_USER_STATUS);
  const addError = useErrorDispatcher();
  const addNotify = useUserNotify();

  const [selectedRoles, setSelectedRoles] = useState<Array<string>>();

  useEffect(() => {
    setSelectedRoles(userProduct.roles.map((r) => r.role));
  }, [userProduct.roles]);

  const onAddMultiRole = () => {
    setLoading(true);
    savePartyUser(party, product, {
      ...user,
      productRoles: selectedRoles ?? [],
      confirmEmail: user.email,
    })
      .then((_) => {
        const newRolesTitles = selectedRoles
          ?.filter((r) => !userProduct.roles.find((ur) => ur.role === r))
          .map((r) => productRolesList.groupByProductRole[r].title);
        addNotify({
          component: 'Toast',
          id: 'ADD_MULTI_ROLE_USER',
          title: 'RUOLO AGGIUNTO',
          message: (
            <>
              {'Hai aggiunto correttamente '}
              {newRolesTitles?.length === 1 ? 'il ruolo' : 'i ruoli'}
              {` ${newRolesTitles?.join(',')} `}
              {' per il referente '}
              <strong>{`${user.name} ${user.surname}`}</strong>
              {'.'}
            </>
          ),
        });
        fetchPartyUser();
      })
      .catch((error) =>
        addError({
          component: 'Toast',
          id: `ADD_MULTI_ROLE_USER_ERROR-${user.id}`,
          displayableTitle: "ERRORE DURANTE L'AGGIUNTA",
          techDescription: `C'è stato un errore durante l'aggiunta del ruolo per il referente ${user.name} ${user.surname}`,
          blocking: false,
          error,
          toNotify: true,
        })
      )
      .finally(() => setLoading(false));
  };

  const handleAddMultiRoles = () => {
    addNotify({
      component: 'SessionModal',
      id: 'ADD_MULTI_ROLES',
      title: 'Assegna ruolo',
      message: (
        <>
          {'Assegna a '}
          <strong> {`${user.name} ${user.surname}`} </strong>
          {'un altro ruolo '}
          <strong> {`${user.userRole}`} </strong>
          {' sul prodotto '}
          <strong> {`${product.title}:`} </strong>

          {productRolesList.groupBySelcRole[userProduct.roles[0].selcRole].map((p) => (
            <>
              <Box key={p.selcRole}>
                <FormControlLabel
                  key={p.selcRole}
                  sx={{ marginTop: 0 }}
                  // checked={role.role.indexOf(p.selcRole) > -1}
                  // disabled = {user.userRole}
                  value={p.selcRole}
                  control={<Checkbox />}
                  label={
                    <>
                      <Typography> {p.title} </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 400,
                          fontSize: '12px',
                          color: '#5C6F82',
                        }}
                      >
                        {p.description}
                      </Typography>
                    </>
                  }
                  onClick={() => setselectedRoles(p)}
                />
              </Box>
            </>
          ))}
        </>
      ),
      confirmLabel: 'Conferma',
      closeLabel: 'Annulla',
      onConfirm: onAddMultiRole,
    });
  };

  const selcRoleProductRoleList = productRolesList.groupBySelcRole[userProduct.roles[0].selcRole];
  return userProduct.roles.length < selcRoleProductRoleList.length &&
    selcRoleProductRoleList[0].multiroleAllowed ? (
    <Link onClick={handleAddMultiRoles} component="button">
      <Typography variant="h3" sx={{ fontSize: '16px', color: '#0073E6' }}>
        + Assegna ruolo
      </Typography>
    </Link>
  ) : (
    <> </>
  );
}
