import { Grid, Typography } from '@mui/material';
import { Party } from '../../../model/Party';
import { PartyGroupExt } from '../../../model/PartyGroup';
import { Product, ProductsMap } from '../../../model/Product';
import MembersGroup from './MembersGroup';

type Props = {
  partyGroup: PartyGroupExt;
  productsMap: ProductsMap;
  isSuspended: boolean;
  fetchPartyGroup: () => void;
  product: Product;
  party: Party;
};

export default function GroupDetail({
  partyGroup,
  productsMap,
  isSuspended,
  fetchPartyGroup,
  product,
  party,
}: Props) {
  function formatDate(data: any) {
    const datePart = data.match(/\d+/g);
    const year = datePart[0];
    const month = datePart[1];
    const day = datePart[2];

    return `${day}/${month}/${year}`;
  }
  const groupStatusClass = isSuspended ? 'CustomDisabledLabel' : 'CustomInfoStyle';
  return (
    <Grid container spacing={2}>
      <Grid container item alignContent="center">
        <Grid item xs={3}>
          <Typography className="CustomLabelStyle" variant="h6">
            NOME
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2" className={groupStatusClass}>
            {partyGroup.name}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={3}>
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
        <Grid item xs={3}>
          <Typography variant="h6" className="CustomLabelStyle">
            PRODOTTO
          </Typography>
        </Grid>
        <Grid item xs={9}>
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
            groupStatusClass={groupStatusClass}
            fetchPartyGroup={fetchPartyGroup}
            party={party}
            product={product}
          />
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={3}>
          <Typography variant="h6" className="CustomLabelStyle">
            DATA CREAZIONE
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2" className={groupStatusClass}>
            {formatDate(partyGroup.createdAt)}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" className="CustomLabelStyle">
            DA
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2" className={groupStatusClass}>
            {`${partyGroup.createdBy.name} ${partyGroup.createdBy.surname}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={3}>
          <Typography variant="h6" className="CustomLabelStyle">
            DATA ULTIMA MODIFICA
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2" className={groupStatusClass}>
            {formatDate(partyGroup.modifiedAt)}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" className="CustomLabelStyle">
            DA
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography
            variant="body2"
            className={groupStatusClass}
          >{`${partyGroup.modifiedBy.name} ${partyGroup.modifiedBy.surname}`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
