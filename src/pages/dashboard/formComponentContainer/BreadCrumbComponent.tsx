import { Breadcrumbs, Link, Typography } from '@mui/material';
import React from 'react';

type Props=
{
  firstPath?: string;
  secondPath?: string;
  actualPage?: string;
};

export default function BreadCrumbComponent({firstPath,secondPath,actualPage} : Props) {
  return (
    <React.Fragment>
      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          {firstPath}
          AppIO
        </Link>
        <Link underline="hover" color="inherit" href="/getting-started/installation/">
        {secondPath}
          Ruoli
        </Link>
        <Typography color="text.primary">{actualPage} Aggiungi un Referente</Typography>
      </Breadcrumbs>
    </React.Fragment>
  );
}
