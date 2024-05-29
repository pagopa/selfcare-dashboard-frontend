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
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { ButtonNaked } from '@pagopa/mui-italia';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DelegationWithInfo } from '../../api/generated/b4f-dashboard/DelegationWithInfo';
import { codeToLabelProduct, compareDates, compareStrings } from '../../utils/helperFunctions';
import EmptyFilterResults from './components/EmptyFilterResults';
import EnhancedTableHeader from './components/EnhanchedTableHeader';
import TableCellWithTooltip from './components/TableCellWithTooltip';

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

  useEffect(() => {
    setTotalPages(Math.ceil(tableData.length / itemsPerPage));
  }, [tableData, itemsPerPage]);

  const renderInputLabel = (filterBy: string) => {
    if (filterBy === 'name') {
      return t('overview.ptPage.filterTechPartner.name');
    } else if (filterBy === 'fiscalCode') {
      return t('overview.ptPage.filterTechPartner.taxCode');
    } else {
      return t('overview.ptPage.filterTechPartner.insert');
    }
  };

  const handleResetFilter = async () => {
    setSearchTerm('');
    setFilterBy('');
    setTableData(delegationsWithoutDuplicates);
  };

  const handleSearchBy = (value: string) => {
    setSearchTerm('');
    setFilterBy(value);
  };

  const enableFilterButton =
    (filterBy === 'name' && searchTerm.length >= 3) ||
    (filterBy === 'fiscalCode' && searchTerm.length === 11);

  const getVisibleData = (data: Array<typeof tableData[number]>): Array<typeof tableData[number]> =>
    data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).sort((a, b) => {
      if (orderBy === 'institutionName') {
        return compareStrings(a.institutionName || '', b.institutionName || '', order);
      }

      if (orderBy === 'createdAt') {
        return compareDates(a.createdAt, b.createdAt, order);
      }

      return 0;
    });

  const handleSort = (_event: React.MouseEvent<unknown>, newOrderBy: keyof DelegationWithInfo) => {
    const isAsc = orderBy === newOrderBy && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(newOrderBy);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    // eslint-disable-next-line functional/no-let
    let filteredResults = [...delegationsWithoutDuplicates];

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      if (filterBy === 'name') {
        filteredResults = filteredResults.filter((item) =>
          item.institutionName?.toLowerCase().includes(searchTermLower)
        );
      } else if (filterBy === 'fiscalCode') {
        filteredResults = filteredResults.filter((item) =>
          item.taxCode?.toLowerCase().includes(searchTermLower)
        );
      }
    }

    const visibleData = getVisibleData(filteredResults);
    setTableData(visibleData);
  };

  return (
    <Grid width={'100%'} height={'100%'}>
      <Grid
        container
        gap={2}
        width={'100%'}
        display={'grid'}
        gridTemplateColumns={'repeat(12, 1fr)'}
        alignItems={'center'}
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
            label={renderInputLabel(filterBy)}
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

      {tableData.length > 0 ? (
        <Grid sx={{ backgroundColor: grey[200] }} mt={3} p={'0 16px 16px 16px'}>
          <Grid sx={{ width: '100%', height: '100%' }}>
            <Table aria-label="simple table">
              <EnhancedTableHeader order={order} orderBy={orderBy} onRequestSort={handleSort} />
              <TableBody sx={{ backgroundColor: 'background.paper' }}>
                {getVisibleData(tableData).map((item, _index) => (
                  <>
                    <TableRow key={item.id}>
                      <TableCellWithTooltip text={item.institutionName ?? '-'} />
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'DM Mono' }}>
                          {item.taxCode?.toUpperCase() ?? '-'}
                        </Typography>
                      </TableCell>
                      <TableCell>{codeToLabelProduct(item.productId as string) ?? '-'}</TableCell>
                      <TableCell>
                        <Typography>{item.createdAt?.toLocaleDateString() ?? '-'}</Typography>
                      </TableCell>
                    </TableRow>
                    <Divider />
                  </>
                ))}
              </TableBody>
            </Table>
          </Grid>

          <Grid container mt={2}>
            {delegationsWithoutDuplicates.length > 10 && (
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
            )}
            {totalPages > 1 && tableData.length > itemsPerPage && (
              <Grid item xs={6} display="flex" justifyContent="end" alignItems={'center'}>
                <Pagination
                  sx={{ display: 'flex', mt: 1, alignItems: 'center' }}
                  color="primary"
                  hidePrevButton={currentPage === 1}
                  hideNextButton={currentPage === totalPages}
                  page={currentPage}
                  count={totalPages}
                  renderItem={(props2) => (
                    <PaginationItem {...props2} sx={{ border: 'none' }} variant="outlined" />
                  )}
                  onChange={(_event: React.ChangeEvent<unknown>, value: number) =>
                    handlePageChange(value)
                  }
                />
              </Grid>
            )}
          </Grid>
        </Grid>
      ) : (
        <EmptyFilterResults handleResetFilter={handleResetFilter} />
      )}
    </Grid>
  );
}
