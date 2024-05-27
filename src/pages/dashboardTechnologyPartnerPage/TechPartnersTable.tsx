import SearchIcon from '@mui/icons-material/Search';
import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
  PaginationItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DelegationWithInfo } from '../../api/generated/b4f-dashboard/DelegationWithInfo';
import EmptyFilterResults from './components/EmptyFilterResults';
import EnhancedTableHeader from './components/EnhanchedTableHeader';

type Props = {
  delegationsWithoutDuplicates: Array<DelegationWithInfo>;
};

export default function TechPartnersTable({ delegationsWithoutDuplicates }: Props) {
  const { t } = useTranslation();
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [filterBy, setFilterBy] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [tableData, setTableData] = useState<Array<DelegationWithInfo>>(
    delegationsWithoutDuplicates
  );
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState('institutionName');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(Math.ceil(tableData.length / itemsPerPage));

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
    let filteredResults = delegationsWithoutDuplicates;

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
    setTableData(delegationsWithoutDuplicates);
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

  useEffect(() => {
    setTotalPages(Math.ceil(delegationsWithoutDuplicates.length / itemsPerPage));
  }, [delegationsWithoutDuplicates]);

  const handleSort = (_event: React.MouseEvent<unknown>, newOrderBy: keyof DelegationWithInfo) => {
    const isAsc = orderBy === newOrderBy && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(newOrderBy);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getVisibleData = (): Array<typeof tableData[number]> => {
    const unsortedVisibleData = tableData.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    // eslint-disable-next-line functional/immutable-data
    return unsortedVisibleData.sort(
      (a: typeof tableData[number] | undefined, b: typeof tableData[number] | undefined) => {
        if (!a || !b) {
          return 0;
        }

        if (orderBy === 'institutionName') {
          return order === 'asc'
            ? (a.institutionName as string).localeCompare(b.institutionName as string)
            : (b.institutionName as string).localeCompare(a.institutionName as string);
        }
        if (orderBy === 'createdAt' && a.createdAt && b.createdAt) {
          return order === 'asc'
            ? a.createdAt.getTime() - b.createdAt.getTime()
            : b.createdAt.getTime() - a.createdAt.getTime();
        }

        return 0;
      }
    );
  };

  const visibleData = getVisibleData();

  return (
    <>
      <Grid
        container
        gap={2}
        width={'100%'}
        display={'grid'}
        gridTemplateColumns={'repeat(12, 1fr)'}
      >
        <Grid item sx={{ gridColumn: 'span 5' }}>
          <FormControl fullWidth={true} size="small">
            <InputLabel id="select-search-by">
              {t('overview.ptPage.filterTechPartner.searchBy')}
            </InputLabel>
            <Select
              id="select-search-by"
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
        <Grid item sx={{ gridColumn: 'span 5' }}>
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

      {visibleData.length > 0 ? (
        <Grid sx={{ backgroundColor: grey[200] }} mt={3} p={'0 16px 16px 16px'}>
          <TableContainer sx={{ display: 'grid', gridColumn: 'span 12', height: '100%', mb: 2 }}>
            <Table
              sx={{ width: '100%', minWidth: 'auto', height: '100%' }}
              aria-label="simple table"
            >
              <EnhancedTableHeader order={order} orderBy={orderBy} onRequestSort={handleSort} />
              <TableBody sx={{ backgroundColor: 'background.paper' }}>
                {visibleData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography sx={{ fontWeight: '700' }}>{item.institutionName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontWeight: '700' }}>{item.taxCode}</Typography>
                    </TableCell>
                    <TableCell>{codeToLabelProduct(item.productId as string)}</TableCell>
                    <TableCell>
                      <Typography>{item.createdAt?.toLocaleDateString()}</Typography>
                    </TableCell>

                    <TableCell>
                      <Typography>-</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography width={'8.3%'}></Typography>
                    </TableCell>
                    <Divider />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Grid container>
            <Grid item xs={6} display="flex" justifyContent="start" alignItems={'center'}>
              <Select
                size="small"
                value={itemsPerPage}
                defaultValue={10}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={70}>70</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6} display="flex" justifyContent="end" alignItems={'center'}>
              <Pagination
                sx={{ display: 'flex', mt: 1 }}
                color="primary"
                shape="rounded"
                page={currentPage}
                count={totalPages}
                boundaryCount={3}
                renderItem={(props2) => (
                  <PaginationItem {...props2} sx={{ border: 'none' }} variant="outlined" />
                )}
                onChange={(_event: React.ChangeEvent<unknown>, value: number) => (
                  handlePageChange(value), window.scrollTo(0, 0)
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      ) : (
        <EmptyFilterResults handleResetFilter={handleResetFilter} />
      )}
    </>
  );
}
