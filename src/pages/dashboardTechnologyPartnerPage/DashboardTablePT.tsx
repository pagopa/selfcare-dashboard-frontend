import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DelegationResource } from '../../api/generated/b4f-dashboard/DelegationResource';
import { DelegationWithInfo } from '../../api/generated/b4f-dashboard/DelegationWithInfo';
import EmptyFilterResults from './components/EmptyFilterResults';

type Props = {
  tableList: Array<DelegationWithInfo>;
  setTableData: React.Dispatch<React.SetStateAction<Array<DelegationWithInfo>>>;
  retrieveDelegationsList: () => Promise<void>;
};

export default function DashboardTablePT({
  tableList,
  setTableData,
  retrieveDelegationsList,
}: Props) {
  const { t } = useTranslation();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleSearch = () => {
    // eslint-disable-next-line functional/no-let
    let filteredResults = tableList;

    if (filterBy === 'name') {
      filteredResults = filteredResults.filter(
        (item) =>
          item.institutionName &&
          item.institutionName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterBy === 'fiscalCode') {
      filteredResults = filteredResults.filter(
        (item) => item.taxCode && item.taxCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setTableData(filteredResults);
  };

  const handleResetFilter = async () => {
    setSearchTerm('');
    setFilterBy('');
    await retrieveDelegationsList();
  };
  const handleSort = (newOrder?: 'asc' | 'desc') => {
    const currentOrder = newOrder || (order === 'asc' ? 'desc' : 'asc');
    setOrder(currentOrder);

    const sortedResult = [...tableList].sort((a: DelegationResource, b: DelegationResource) => {
      const firstValue = a.institutionName;
      const secondValue = b.institutionName;
      if (firstValue && secondValue) {
        return currentOrder === 'asc'
          ? firstValue.localeCompare(secondValue)
          : secondValue.localeCompare(firstValue);
      } else {
        return currentOrder === 'asc' ? -1 : 1;
      }
    });
    setTableData(sortedResult);
  };

  const renderInputLabel = () => {
    if (filterBy === 'name') {
      return t('overview.ptPage.filterTechPartner.name');
    } else if (filterBy === 'fiscalCode') {
      return t('overview.ptPage.filterTechPartner.taxCode');
    } else {
      return t('overview.ptPage.filterTechPartner.insert');
    }
  };

  const handleSearchBy = (value: string) => {
    setSearchTerm('');
    setFilterBy(value);
  };
  const enableFilterButton =
    (filterBy === 'name' && searchTerm.length >= 3) ||
    (filterBy === 'fiscalCode' && searchTerm.length === 11);

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={5}>
          <FormControl fullWidth={true} size="small">
            <InputLabel>{t('overview.ptPage.filterTechPartner.searchBy')}</InputLabel>
            <Select
              value={filterBy}
              label={t('overview.ptPage.filterTechPartner.searchBy')}
              onChange={(e) => handleSearchBy(e.target.value as string)}
            >
              <MenuItem value="name">{t('overview.ptPage.filterTechPartner.name')}</MenuItem>
              <MenuItem value="fiscalCode">
                {t('overview.ptPage.filterTechPartner.taxCode')}
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={5}>
          <TextField
            label={renderInputLabel()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={filterBy === ''}
            fullWidth
            size="small"
            inputProps={{ maxLength: filterBy === 'fiscalCode' ? 11 : null }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        <Grid item xs={1}>
          <Button
            variant="outlined"
            onClick={handleSearch}
            disabled={!enableFilterButton}
            size="small"
          >
            {t('overview.ptPage.filterTechPartner.buttonLabel')}
          </Button>
        </Grid>
        <Grid item xs={1}>
          <ButtonNaked
            onClick={handleResetFilter}
            color="primary"
            variant="text"
            disabled={filterBy === '' && !searchTerm}
            sx={{ textAlign: 'center' }}
            component="button"
          >
            {t('overview.ptPage.filterTechPartner.resetFilter')}
          </ButtonNaked>
        </Grid>
      </Grid>
      {tableList.length > 0 ? (
        <TableContainer sx={{ height: '100%', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 'auto', height: '100%' }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sortDirection={'asc'}>
                  {t('overview.ptPage.headerPtTableLabels.party')}
                  <IconButton
                    style={{ backgroundColor: 'transparent', padding: '0 8px' }}
                    disableRipple
                    onClick={() => handleSort()}
                  >
                    {order === 'asc' ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )}
                  </IconButton>
                </TableCell>
                <TableCell>{t('overview.ptPage.headerPtTableLabels.product')}</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody sx={{ backgroundColor: 'background.paper' }}>
              {tableList.map((item) => (
                <TableRow key={item.institutionName}>
                  <TableCell>
                    <Typography sx={{ fontWeight: '700' }}>{item.institutionName}</Typography>
                  </TableCell>
                  <TableCell>{codeToLabelProduct(item.productId as string)}</TableCell>
                  <TableCell width={'20%'}>
                    <Typography>-</Typography>
                  </TableCell>
                  <TableCell width={'20%'}>
                    <Typography>-</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography width={'10%'}></Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <EmptyFilterResults handleResetFilter={handleResetFilter} />
      )}
    </>
  );
}
