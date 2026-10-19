import { fireEvent, render, screen } from '@testing-library/react';
import PartyLogo from '../PartyLogo';

describe('PartyLogo', () => {
  test('renders the logo hidden until it is loaded and notifies the load', () => {
    const setIsLoaded = vi.fn();
    render(
      <PartyLogo
        loading={false}
        urlLogo="http://logo.png"
        isLoaded={false}
        setIsLoaded={setIsLoaded}
      />
    );

    const img = screen.getByAltText('logo');
    expect(img).toHaveAttribute('src', 'http://logo.png');
    expect(img.parentElement).toHaveStyle({ display: 'none' });

    fireEvent.load(img);
    expect(setIsLoaded).toHaveBeenCalledWith(true);
  });

  test('is visible when loaded and resets the state on error', () => {
    const setIsLoaded = vi.fn();
    render(
      <PartyLogo loading={false} urlLogo="broken" isLoaded={true} setIsLoaded={setIsLoaded} />
    );

    const img = screen.getByAltText('logo');
    expect(img.parentElement).toHaveStyle({ display: 'flex' });

    fireEvent.error(img);
    expect(setIsLoaded).toHaveBeenCalledWith(false);
  });
});
