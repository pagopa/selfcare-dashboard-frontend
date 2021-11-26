import { Breadcrumbs, Link, Typography } from '@mui/material';
import React from 'react';

export default function BreadCrumbComponent() {
  return (
    <React.Fragment>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          AppIO
        </Link>
        <Link underline="hover" color="inherit" href="/getting-started/installation/">
          Ruoli
        </Link>
        <Typography color="text.primary">Aggiungi un Referente</Typography>
      </Breadcrumbs>
    </React.Fragment>
  );
}
