import React from 'react';
import { Grid } from '@mui/material';
import { PartyAccountItemButton } from '@pagopa/mui-italia/dist/components/PartyAccountItemButton';
import { Tag } from '@pagopa/mui-italia/dist/components/Tag';
import DashboardPartyItem from './DashboardPartyItem';

type Props = {
  isDisabled?: boolean;
  selectedItem?: boolean;
  title: string | undefined;
  subTitle: string | undefined;
  image: string | undefined;
  chip: string;
  action?: React.Dispatch<React.MouseEvent<HTMLDivElement, MouseEvent>>;
  moreThan3Parties?: boolean;
};
export default function PartyItemContainer({
  isDisabled,
  selectedItem,
  title,
  subTitle,
  image,
  chip,
  action,
  moreThan3Parties,
}: Props) {
  return (
    <Grid
      container
      my={1}
      direction={'row'}
      role="PartyItemContainer"
      data-testid={`PartyItemContainer: ${title}`}
    >
      {moreThan3Parties ? (
        <DashboardPartyItem
          disabled={isDisabled}
          selectedItem={selectedItem}
          title={title}
          subTitle={subTitle}
          image={image}
          action={action}
          chip={chip}
        />
      ) : (
        <PartyAccountItemButton
          partyName={title as string}
          partyRole={subTitle as string}
          image={image}
          selectedItem={selectedItem}
          action={!isDisabled ? action : undefined}
          disabled={isDisabled}
          endSlot={isDisabled ? <Tag value={chip} color="warning" /> : undefined}
        />
      )}
    </Grid>
  );
}
