import React, { useMemo } from 'react';
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
  parentPartyName?: string;
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
  parentPartyName,
}: Props) {
  // Memoize the rendering of the logo image based on its URL
  const logoImageUrl = useMemo(() => image, [image]);
  return (
    <Grid
      className={moreThan3Parties ? 'selectedMoreThen3' : 'selectedLessThen3'}
      container
      my={1}
      direction={'row'}
      role={'Institution'}
      data-testid={`PartyItemContainer: ${title}`}
      onKeyDownCapture={(e) => {
        if (action && (e.key === 'Enter' || e.key === ' ')) {
          action(e as any);
        }
      }}
    >
      <PartyAccountItemButton
        partyName={title as string}
        partyRole={subTitle as string}
        image={logoImageUrl}
        selectedItem={moreThan3Parties ? false : selectedItem}
        action={!isDisabled ? action : undefined}
        disabled={isDisabled}
        endSlot={isDisabled ? <Tag value={chip} color="warning" /> : undefined}
        maxCharactersNumberMultiLine={20}
        parentPartyName={parentPartyName as string}
      />
    </Grid>
  );
}
