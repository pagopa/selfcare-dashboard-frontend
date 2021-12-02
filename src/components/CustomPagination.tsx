import { Pagination } from '@mui/material';
import PaginationItem from '@mui/material/PaginationItem';
import  React  from 'react';
import { Page } from '../model/Page';
import { PageRequest } from '../model/PageRequest';

type Props = {
  page: Page;
  sort?: string;
  onPageRequest: (r: PageRequest) => void;
};

export default function CustomPagination({ page, onPageRequest, sort }: Props) {
  // const [pageEl, setPage] = React.useState(2);
  // const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // const handleChangePage = (
  //   _event: React.MouseEvent<HTMLButtonElement> | null,
  //   newPage: number,
  // ) => {
  //   setPage(newPage);
  // };

  // const handleChangeRowsPerPage = (
  //   event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  // ) => {
  //   setRowsPerPage(parseInt(event.target.value, 10));
  //   setPage(0);
  // };
  return (
    <React.Fragment>
    {/* <TablePagination
      component="div"
      count={100}
      page={pageEl}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    /> */}
    <Pagination
      sx={{ display: 'flex' }}
      color="primary"
      variant="outlined"
      shape="rounded"
      page={page.number + 1}
      count={page.totalPages}
      renderItem={(props2) => <PaginationItem {...props2} sx={{ border: 'none' }} />}
      onChange={(_event: React.ChangeEvent<unknown>, value: number) =>
        onPageRequest({
          page: value - 1,
          size: page.size,
          sort,
        })
      }
    />
    </React.Fragment>
  
  );
}
