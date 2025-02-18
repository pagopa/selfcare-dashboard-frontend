import { styled, MenuItem, Typography } from '@mui/material';
import { ReactNode, HTMLAttributes, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

const CustomMenuItem = styled(MenuItem)(() => ({
  '&:hover': {
    background: 'none',
    cursor: 'auto',
    userSelect: 'text',
  },
}));
type CustomListBoxProps = {
  children?: ReactNode;
} & HTMLAttributes<HTMLDivElement>;

const CustomListBoxComponent = forwardRef<HTMLDivElement, CustomListBoxProps>(
  ({ children, ...rest }, ref) => {
    const { t } = useTranslation();

    const CustomListBoxItem = (
      <CustomMenuItem
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '6px 16px',
        }}
      >
        <Typography sx={{ color: 'text.secondary', flex: '0 0 40%' }}>
          {t('addDelegationPage.selectTechPartner.groupByFiscalCode')}
        </Typography>
        <Typography
          sx={{
            textAlign: 'start',
            flex: 1,
            color: 'text.secondary',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}
        >
          {t('addDelegationPage.selectTechPartner.groupByName')}
        </Typography>
      </CustomMenuItem>
    );

    return (
      <div ref={ref} {...rest}>
        {CustomListBoxItem}
        <div>{children}</div>
      </div>
    );
  }
);

export default CustomListBoxComponent;
