import { Breadcrumbs, Link, Typography } from '@mui/material';
import React from 'react';
import { Product } from '../../../model/Product';

export type ProductNavigationPath = {
description: string;
onClick?:() => void;
};

type Props = {
  selectedProduct: Product;
  paths: Array<ProductNavigationPath>;
};

export default function ProductNavigationBar({ selectedProduct, paths }: Props) {
  return (
    <React.Fragment>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography>
          {selectedProduct.description} 
        </Typography>
        {paths.map(p => p.onClick 
        ? <Link key={p.description} onClick={p.onClick}>{p.description}</Link>
        : <Typography key={p.description}>{p.description}</Typography>
          )}
      </Breadcrumbs>
    </React.Fragment>
  );
}
