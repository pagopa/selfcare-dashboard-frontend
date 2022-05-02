// import React from 'react'
import { Box } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { CustomAvatar } from '@pagopa/selfcare-common-frontend';
import logoPlaceholder from '../../../../../../../assets/logo-placeholder.svg';

export default function PartyLogo({ loading, urlLogo }: Props) {
  console.log(urlLogo);
  return (
    <Box width="60px" height="60px" mr={2}>
      {!loading ? (
        <CustomAvatar
          customSrc={urlLogo ? urlLogo : logoPlaceholder ? logoPlaceholder : undefined}
          customWidth="100%"
          customHeight="100%"
          loading={loading}
          id="partyLogo"
        />
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: '50%',
            width: '100%',
            height: '100%',
            alignItems: 'center',
          }}
        >
          <CircularProgress sx={{ color: '#5C6F82' }} size={30} />
        </Box>
      )}
    </Box>
  );
}
