import { Grid, Typography } from '@mui/material';
import { PartyGroupExt } from '../../../model/PartyGroup';
import { ProductsMap } from '../../../model/Product';
import GroupUsers from './GroupUsers';

type Props = {
  group: PartyGroupExt;
  productsMap: ProductsMap;
  isSuspended: boolean;
};

export default function GroupDetail({ group, productsMap, isSuspended }: Props) {
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
        <Grid item xs={3}>
          <Typography variant="body2" className={groupStatusClass}>
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
        <Grid item xs={9}>
          <Typography variant="body2" className={groupStatusClass}>
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
        <Grid item xs={12}>
          <GroupUsers groupStatusClass={groupStatusClass} />
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
            {formatDate(group.createdAt)}
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography variant="h6" className="CustomLabelStyle">
            DA
          </Typography>
        </Grid>
        <Grid item xs={9}>
          <Typography variant="body2" className={groupStatusClass}>
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
        <Grid item xs={9}>
          <Typography variant="body2" className={groupStatusClass}>
            {formatDate(group.modifiedAt)}
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
          >{`${group.modifiedBy.name} ${group.modifiedBy.surname}`}</Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}
