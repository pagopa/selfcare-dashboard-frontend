import React from 'react';
import { Grid } from '@mui/material';
import { PartyAccountItemButton } from '@pagopa/mui-italia/dist/components/PartyAccountItemButton';
import { Tag } from '@pagopa/mui-italia/dist/components/Tag';

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
      id={moreThan3Parties ? 'selectedMoreThen3' : 'selectedLessThen3'}
      container
      my={1}
      direction={'row'}
      role={'Institution'}
      data-testid={`PartyItemContainer: ${title}`}
    >
      <PartyAccountItemButton
        partyName={title as string}
        partyRole={subTitle as string}
        image={image}
        selectedItem={moreThan3Parties ? false : selectedItem}
        action={!isDisabled ? action : undefined}
        disabled={isDisabled}
        endSlot={isDisabled ? <Tag value={chip} color="warning" /> : undefined}
      />
    </Grid>
  );
}
