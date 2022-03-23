import { Grid, Typography } from '@mui/material';
import { Party } from '../../../model/Party';
import { PartyGroupExt } from '../../../model/PartyGroup';
import { Product, ProductsMap } from '../../../model/Product';
import { ProductRolesLists } from '../../../model/ProductRole';
import MembersGroup from './MembersGroup';

type Props = {
  partyGroup: PartyGroupExt;
  productsMap: ProductsMap;
  isSuspended: boolean;
  product: Product;
  party: Party;
  productRolesLists: ProductRolesLists;
};

function GroupDetail({
  partyGroup,
  productsMap,
  isSuspended,
  product,
  party,
  productRolesLists,
}: Props) {
  function formatDate(data?: Date) {
    const d = new Date(data as Date);
    return d.toLocaleDateString('it', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  const groupStatusClass = isSuspended ? 'CustomDisabledLabel' : 'CustomInfoStyle';
  return (
    <Grid container spacing={2}>
      <Grid container item alignContent="center">
        <Grid item xs={4}>
          <Typography className="CustomLabelStyle" variant="h6">
            NOME
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body2" className={groupStatusClass}>
            {partyGroup.name}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={4}>
          <Typography variant="h6" className="CustomLabelStyle">
            DESCRIZIONE
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="body2" className={groupStatusClass}>
            {partyGroup.description}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={4}>
          <Typography variant="h6" className="CustomLabelStyle">
            PRODOTTO
          </Typography>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="body2" className={groupStatusClass}>
            {productsMap[partyGroup.productId].title}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={12}>
          <Typography variant="h6" className="CustomLabelStyle">
            REFERENTI
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <MembersGroup
            partyGroup={partyGroup}
            party={party}
            product={product}
            isSuspended={isSuspended}
            productRolesLists={productRolesLists}
          />
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={4}>
          <Typography variant="h6" className="CustomLabelStyle">
            DATA CREAZIONE
          </Typography>
        </Grid>

        <Grid item xs={8}>
          {partyGroup.createdAt ? (
            <Typography variant="body2" className={groupStatusClass}>
              {formatDate(partyGroup.createdAt)}
            </Typography>
          ) : (
            ''
          )}
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" className="CustomLabelStyle">
            DA
          </Typography>
        </Grid>
        <Grid item xs={8}>
          {partyGroup.createdBy ? (
            <Typography variant="body2" className={groupStatusClass}>
              {`${partyGroup.createdBy.name} ${partyGroup.createdBy?.surname}`}
            </Typography>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={4}>
          <Typography variant="h6" className="CustomLabelStyle">
            DATA ULTIMA MODIFICA
          </Typography>
        </Grid>
        <Grid item xs={8}>
          {partyGroup.modifiedAt ? (
            <Typography variant="body2" className={groupStatusClass}>
              {formatDate(partyGroup.modifiedAt)}
            </Typography>
          ) : (
            ''
          )}
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" className="CustomLabelStyle">
            DA
          </Typography>
        </Grid>
        <Grid item xs={8}>
          {partyGroup.modifiedBy ? (
            <Typography
              variant="body2"
              className={groupStatusClass}
            >{`${partyGroup.modifiedBy?.name} ${partyGroup.modifiedBy?.surname}`}</Typography>
          ) : (
            ''
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}
export default GroupDetail;
