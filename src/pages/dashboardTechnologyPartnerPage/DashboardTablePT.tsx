import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Paper from '@mui/material/Paper';
import { DelegationResource } from '../../api/generated/b4f-dashboard/DelegationResource';

type Props = {
  filteredArray: Array<DelegationResource>;
};

export default function DashboardTablePT({ filteredArray }: Props) {
  const { t } = useTranslation();
  const [orderBy, setOrderBy] = useState<'institutionName' | 'productId'>('institutionName');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const codeToLabelProduct = (code: string) => {
    switch (code) {
      case 'prod-io':
        return 'App Io';
      case 'prod-pagopa':
        return 'Piattaforma pagoPA';
      case 'prod-io, prod-pagopa':
        return 'App Io, Piattaforma pagoPA';

      default:
        return '';
    }
  };

  const handleSort = (field: 'institutionName' | 'productId') => {
    if (field === orderBy) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(field);
      setOrder('asc');
    }
  };

  const sortedData = [...filteredArray].sort((a: any, b: any) => {
    const aValue = orderBy === 'institutionName' ? a.institutionName : a.productId;
    const bValue = orderBy === 'institutionName' ? b.institutionName : b.productId;

    if (order === 'asc') {
      return aValue?.localeCompare(bValue);
    } else {
      return bValue?.localeCompare(aValue);
    }
  });

  const [institutionName, setInstitutionName] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [result, setResult] = useState<DelegationResource | null>(null);

  const handleButtonClick = () => {
    const selectedBroker = filteredArray.find((item) => item.institutionName === institutionName);

    if (selectedBroker) {
      if (selectedBroker?.productId?.includes(selectedProductId)) {
        setResult(selectedBroker);
      } else {
        setResult(null);
      }
    } else {
      setResult(null);
    }
  };

  return (
    <>
      <TextField
        label="Institution Name"
        value={institutionName}
        onChange={(e) => setInstitutionName(e.target.value)}
      />
      <FormControl sx={{ width: '200px' }}>
        <InputLabel>Product ID</InputLabel>
        <Select
          value={selectedProductId}
          label="Product ID"
          onChange={(e) => setSelectedProductId(e.target.value as string)}
        >
          <MenuItem value="prod-io">prod-io</MenuItem>
          <MenuItem value="prod-pagopa">prod-pagopa</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" onClick={handleButtonClick}>
        Cerca
      </Button>
      <TableContainer component={Paper} sx={{ height: '100%', overflow: 'hidden' }}>
        <Table sx={{ minWidth: 'auto', height: '100%' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell sortDirection={'asc'}>
                {t('overview.ptPage.headerPtTableLabels.party')}
                <IconButton
                  style={{ backgroundColor: 'transparent', padding: '0 8px' }}
                  disableRipple
                  onClick={() => handleSort('institutionName')}
                >
                  {orderBy === 'institutionName' ? (
                    order === 'asc' ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )
                  ) : (
                    <ArrowUpwardIcon fontSize="small" />
                  )}
                </IconButton>
              </TableCell>
              <TableCell>
                {t('overview.ptPage.headerPtTableLabels.product')}
                <IconButton
                  style={{ backgroundColor: 'transparent', padding: '0 8px' }}
                  disableRipple
                  onClick={() => handleSort('productId')}
                >
                  {orderBy === 'productId' ? (
                    order === 'asc' ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )
                  ) : (
                    <ArrowDownwardIcon fontSize="small" />
                  )}
                </IconButton>
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {result ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Institution Name</TableCell>
                      <TableCell>Product ID</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>{result.institutionName}</TableCell>
                      <TableCell>{result.productId}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              sortedData.map((tl, index) => (
                <TableRow key={index}>
                  <TableCell width={'25%'}>
                    <Typography
                      sx={{
                        fontWeight: 'fontWeightBold',
                      }}
                    >
                      {tl.institutionName}
                    </Typography>
                  </TableCell>
                  <TableCell width={'25%'}>
                    <Typography sx={{ cursor: 'pointer' }}>
                      {codeToLabelProduct(tl.productId as string)}
                    </Typography>
                  </TableCell>
                  <TableCell width={'25%'}>
                    <Typography sx={{ cursor: 'pointer' }}>-</Typography>
                  </TableCell>
                  <TableCell width={'25%'}>
                    <Typography sx={{ cursor: 'pointer' }}>-</Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
