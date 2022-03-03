import { Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Party } from '../../../model/Party';
import { PartyGroup, PartyGroupStatus } from '../../../model/PartyGroup';
import { Product } from '../../../model/Product';
import GroupsTableProduct from './GroupsTableProduct/GroupsTableProduct';

type Props = {
  party: Party;
  product: Product;
  groups: Array<PartyGroup>;
  onCompleteDelete: (product: Product) => void;
};

export default function GroupsProductSection({ party, product, groups, onCompleteDelete }: Props) {
  const [innerGroupsList, setInnerGroupsList] = useState<Array<PartyGroup>>([]);

  useEffect(() => setInnerGroupsList(groups), [groups]);

  const onDelete = (partyGroup: PartyGroup) => {
    setInnerGroupsList(innerGroupsList.filter((u) => u.id !== partyGroup.id));
    if (innerGroupsList.length === 1) {
      onCompleteDelete(product);
    }
  };

  const onStatusUpdate = (partyGroup: PartyGroup, nextStatus: PartyGroupStatus) => {
    // eslint-disable-next-line functional/immutable-data
    partyGroup.status = nextStatus;
    setInnerGroupsList(innerGroupsList.slice());
  };

  return (
    <Grid container direction="row">
      <Grid item xs={12} sx={{ mt: 7 }}>
        <Typography variant="h2" id={product.id}>
          {product.title}
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <GroupsTableProduct
          party={party}
          product={product}
          groups={innerGroupsList}
          onDelete={onDelete}
          onStatusUpdate={onStatusUpdate}
        />
      </Grid>
    </Grid>
  );
}
