import NavigationBar, {
    NavigationPath,
  } from '@pagopa/selfcare-common-frontend/lib/components/NavigationBar';
  import { useMemo } from 'react';
  import { Product } from '../model/Product';
  
  type Props = {
    selectedProduct?: Product;
    paths: Array<NavigationPath>;
    showBackComponent?: boolean;
    goBack?: () => void;
    backLabel?: string;
  };
  
  export default function ProductNavigationBar({
    selectedProduct,
    paths,
    showBackComponent,
    goBack,
    backLabel,
  }: Props) {
    const innerPaths = useMemo(
      () => (selectedProduct ? [{ description: selectedProduct.title }].concat(paths) : paths),
      [selectedProduct, paths]
    );
  
    return <NavigationBar paths={innerPaths} showBackComponent={showBackComponent} goBack={goBack} backLabel={backLabel} />;
  }