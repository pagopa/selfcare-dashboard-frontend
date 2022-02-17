import { Breadcrumbs, Typography, Link } from '@mui/material';
import React from 'react';

export default function UserBreadcrumb() {
  return (
    <React.Fragment>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          component="button"
          // onClick={() => undefined}
          variant="body2"
          sx={{
            fontWeight: '700',
            color: '#5C6F82 !important',
            textDecoration: 'none !important',
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontWeight: '700',
              color: '#5C6F82 !important',
            }}
          >
            Referenti
          </Typography>
        </Link>
        <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'text.secondary' }}>
          Dettaglio Referente
        </Typography>
      </Breadcrumbs>
    </React.Fragment>
  );
}
