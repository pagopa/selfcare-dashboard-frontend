import { fireEvent, render, screen } from '@testing-library/react';
import EnhancedTableHeader from '../EnhanchedTableHeader';

const renderHeader = (order: 'asc' | 'desc', orderBy: string, onRequestSort = vi.fn()) => {
  render(
    <table>
      <EnhancedTableHeader order={order} orderBy={orderBy} onRequestSort={onRequestSort} />
    </table>
  );
  return onRequestSort;
};

describe('EnhancedTableHeader', () => {
  test('renders all column labels and marks the active ascending column', () => {
    renderHeader('asc', 'institutionName');

    ['Ente', 'Codice fiscale', 'Prodotto', 'Delegato il'].forEach((label) =>
      expect(screen.getByText(label)).toBeInTheDocument()
    );
    expect(screen.getByText('sorted ascending')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')[0]).toHaveAttribute('aria-sort', 'ascending');
  });

  test('marks the active descending column', () => {
    renderHeader('desc', 'createdAt');

    expect(screen.getByText('sorted descending')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')[3]).toHaveAttribute('aria-sort', 'descending');
  });

  test('calls onRequestSort for sortable columns and disables the others', () => {
    const onRequestSort = renderHeader('asc', 'institutionName');

    fireEvent.click(screen.getByText('Delegato il'));
    expect(onRequestSort).toHaveBeenCalledWith(expect.anything(), 'createdAt');

    fireEvent.click(screen.getByText('Ente'));
    expect(onRequestSort).toHaveBeenLastCalledWith(expect.anything(), 'institutionName');

    expect(screen.getByRole('button', { name: 'Prodotto' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    expect(screen.getByRole('button', { name: 'Codice fiscale' })).toHaveAttribute(
      'aria-disabled',
      'true'
    );
    expect(screen.getByRole('button', { name: /Ente/ })).not.toHaveAttribute('aria-disabled');
  });
});
