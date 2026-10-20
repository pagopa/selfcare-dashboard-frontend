import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TableCellWithStyle from '../TableCellWithStyle';

const renderCell = (text: string | React.ReactElement) =>
  render(
    <table>
      <tbody>
        <tr>
          <TableCellWithStyle text={text} />
        </tr>
      </tbody>
    </table>
  );

const mockWidths = (scrollWidth: number, clientWidth: number) => {
  vi.spyOn(HTMLElement.prototype, 'scrollWidth', 'get').mockReturnValue(scrollWidth);
  vi.spyOn(HTMLElement.prototype, 'clientWidth', 'get').mockReturnValue(clientWidth);
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('TableCellWithStyle', () => {
  test('shows a tooltip with the full text when the text overflows', async () => {
    mockWidths(200, 100);
    const user = userEvent.setup({ delay: null });
    renderCell('A very long institution name');

    await user.hover(screen.getByText('A very long institution name'));

    expect(await screen.findByRole('tooltip')).toHaveTextContent('A very long institution name');
  });

  test('does not show a tooltip when the text fits', async () => {
    mockWidths(100, 100);
    const user = userEvent.setup({ delay: null });
    renderCell('Short name');

    await user.hover(screen.getByText('Short name'));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  test('does not show a tooltip for element content even when overflowing', async () => {
    mockWidths(200, 100);
    const user = userEvent.setup({ delay: null });
    renderCell(<button>Clickable name</button>);

    await user.hover(screen.getByRole('button', { name: 'Clickable name' }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
