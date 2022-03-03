import { Grid, Typography } from '@mui/material';
import { PartyGroupExt } from '../../../model/PartyGroup';
import { ProductsMap } from '../../../model/Product';
import GroupUsers from './GroupUsers';

type Props = {
  group: PartyGroupExt;
  productsMap: ProductsMap;
};
export default function GroupDetail({ group, productsMap }: Props) {
  function formatDate(data: any) {
    const datePart = data.match(/\d+/g);
    const year = datePart[0];
    const month = datePart[1];
    const day = datePart[2];

    return `${day}/${month}/${year}`;
  }

  return (
    <Grid container spacing={2}>
      <Grid container item alignContent="center">
        <Grid item xs={3}>
          <Typography className="CustomLabelStyle" variant="h6">
            NOME
          </Typography>
        </Grid>
        <Grid item xs={9} className="userInfoStyle">
          <Typography variant="body2" className="CustomInfoStyle">
            {group.name}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={3}>
          <Typography variant="h6" className="CustomLabelStyle">
            DESCRIZIONE
          </Typography>
        </Grid>
        <Grid item xs={3} className="userInfoStyle">
          <Typography variant="body2" className="CustomInfoStyle">
            {group.description}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={3}>
          <Typography variant="h6" className="CustomLabelStyle">
            PRODOTTO
          </Typography>
        </Grid>
        <Grid item xs={9} className="userInfoStyle">
          <Typography variant="body2" className="CustomInfoStyle">
            {productsMap[group.productId].title}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={12}>
          <Typography variant="h6" className="CustomLabelStyle">
            REFERENTI
          </Typography>
        </Grid>
        <Grid item xs={12} className="userInfoStyle">
          <GroupUsers />
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={3}>
          <Typography variant="h6" className="CustomLabelStyle">
            DATA CREAZIONE
          </Typography>
        </Grid>
        <Grid item xs={9} className="userInfoStyle">
          <Typography variant="body2" className="CustomInfoStyle">
            {formatDate(group.createdAt)}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" className="CustomLabelStyle">
            DA
          </Typography>
        </Grid>
        <Grid item xs={9} className="userInfoStyle">
          <Typography variant="body2" className="CustomInfoStyle">
            {`${group.createdBy.name} ${group.createdBy.surname}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid container item alignContent="center">
        <Grid item xs={3}>
          <Typography variant="h6" className="CustomLabelStyle">
            DATA ULTIMA MODIFICA
          </Typography>
        </Grid>
        <Grid item xs={9} className="userInfoStyle">
          <Typography variant="body2" className="CustomInfoStyle">
            {formatDate(group.modifiedAt)}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" className="CustomLabelStyle">
            DA
          </Typography>
        </Grid>
        <Grid item xs={9} className="userInfoStyle">
          <Typography
            variant="body2"
            className="CustomInfoStyle"
          >{`${group.modifiedBy.name} ${group.modifiedBy.surname}`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
