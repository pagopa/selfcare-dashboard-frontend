import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { Role } from '../../../../../../../api/generated/party-process/Role';
import { Page } from '../../../../../../../model/Page';
import { PageRequest } from '../../../../../../../model/PageRequest';
import { Product } from '../../../../../../../model/Product';

interface Data {
  name: string;
  email: string;
  role: string;
}

function createData(name: string, email: string, role: string): Data {
  return {
    name,
    email,
    role,
  };
}

const rows = [
  createData('Dario', 'dario@gmail.com', 'Admin'),
  createData('Luca', 'dario@gmail.com', 'Admin'),
  createData('Stefano', 'dario@gmail.com', 'Admin'),
];

interface HeadCell {
  id: keyof Data;
  label: string;
  minWidth: number;
  order: string | null;
  align: string;
}

interface RolesSearchTableProps {
  users: Array<Role>;
  selectedProduct?: Product;
  page: Page;
  onPageRequest: (p: PageRequest) => void;
}

export default function RolesSearchTable(_props: RolesSearchTableProps) {
  const headCells: ReadonlyArray<HeadCell> = [
    {
      id: 'name',
      label: 'name',
      minWidth: 300,
      order: 'eventType',
      align: 'center',
    },
    {
      id: 'email',
      minWidth: 300,
      order: 'eventType',
      align: 'center',
      label: 'email',
    },
    {
      id: 'role',
      label: 'role',
      minWidth: 300,
      order: 'eventType',
      align: 'center',
    },
  ];

  /* TODO vanno aggiunte due colonne */

  return (
    <Paper>
      <TableContainer>
        <Table size="small" stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {headCells.map((column) => (
                <TableCell key={column.id}>
                  <TableSortLabel>
                    {column.label}
                    {/* direction={orderBy === column.order ? order : 'asc'}
                       onClick={(e: any) => {
                        if (column.id !== "actions" && column.order)
                          handleOrdering(column.order, e);
                      }} */}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.name}>
                <TableCell align="right">{row.name}</TableCell>
                <TableCell align="right">{row.email}</TableCell>
                <TableCell align="right">{row.role}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
