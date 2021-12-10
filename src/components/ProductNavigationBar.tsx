import { Breadcrumbs, Link, Typography } from '@mui/material';
import React from 'react';
import { Product } from '../model/Product';

export type ProductNavigationPath = {
  description: string;
  onClick?: () => void;
};

type Props = {
  selectedProduct: Product;
  paths: Array<ProductNavigationPath>;
};

export default function ProductNavigationBar({ selectedProduct, paths }: Props) {
  return (
    <React.Fragment>
      <Breadcrumbs aria-label="breadcrumb">
        <Typography variant="body2" sx={{ fontWeight: '700', color: 'text.secondary' }}>
          {selectedProduct.description}
        </Typography>
        {paths.map((p) =>
          p.onClick ? (
            <Link
              key={p.description}
              variant="body2"
              onClick={p.onClick}
              sx={{
                fontWeight: '700',
                color: '#5C6F82 !important',
                textDecoration: 'none !important',
              }}
            >
              {p.description}
            </Link>
          ) : (
            <Typography key={p.description} variant="body2" sx={{ color: 'text.secondary' }}>
              {p.description}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </React.Fragment>
  );
}
