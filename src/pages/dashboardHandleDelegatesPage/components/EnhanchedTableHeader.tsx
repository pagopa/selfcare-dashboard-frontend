import { Grid, TableCell, TableHead, TableRow, TableSortLabel } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { useTranslation } from 'react-i18next';
import { DelegationWithInfo } from '../../../api/generated/b4f-dashboard/DelegationWithInfo';

type headerData = {
  id: keyof DelegationWithInfo;
  label: string;
  width: number | string;
};

type EnhancedTableHeaderProps = {
  order: 'asc' | 'desc';
  orderBy: string;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof DelegationWithInfo) => void;
};

const EnhancedTableHeader = ({ order, orderBy, onRequestSort }: EnhancedTableHeaderProps) => {
  const { t } = useTranslation();

  const createSortHandler =
    (property: keyof DelegationWithInfo) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  const headerData: ReadonlyArray<headerData> = [
    {
      id: 'institutionName',
      label: t('overview.ptPage.headerPtTableLabels.party'),
      width: '25%',
    },
    {
      id: 'taxCode',
      label: t('overview.ptPage.headerPtTableLabels.taxCode'),
      width: '25%',
    },
    {
      id: 'productId',
      label: t('overview.ptPage.headerPtTableLabels.product'),
      width: '25%',
    },
    {
      id: 'createdAt',
      label: t('overview.ptPage.headerPtTableLabels.createdAt'),
      width: '25%',
    },
  ];

  return (
    <TableHead>
      <TableRow>
        {headerData.map((item) => (
          <TableCell
            key={item.id}
            sx={{ width: item.width }}
            sortDirection={orderBy === item.id ? order : 'asc'}
          >
            <TableSortLabel
              active={orderBy === item.id}
              direction={orderBy === item.id ? order : 'asc'}
              onClick={createSortHandler(item.id)}
              hideSortIcon={item.id === 'productId' || item.id === 'taxCode'}
              disabled={item.id === 'productId' || item.id === 'taxCode'}
            >
              {item.label}
              {orderBy === item.id ? (
                <Grid component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Grid>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default EnhancedTableHeader;
