import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { screen, waitFor } from '@testing-library/react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { DashboardApi } from '../../../../../../../api/DashboardApiClient';
import { useAppDispatch, useAppSelector } from '../../../../../../../redux/hooks';
import { renderWithProviders } from '../../../../../../../utils/test-utils';
import { PartyLogoUploader } from '../PartyLogoUploader';

// Mock the entire DashboardApi module
jest.mock('../../../../../../../api/DashboardApiClient', () => ({
  DashboardApi: {
    uploadLogo: jest.fn(() => Promise.resolve(true)),
  },
}));

jest.mock('react-dropzone');
jest.mock('react-i18next');
jest.mock('../../../../../../../redux/hooks');
jest.mock('@pagopa/selfcare-common-frontend/lib/services/analyticsService');

jest.mock('../components/PartyLogo', () => ({
  __esModule: true,
  default: ({ loading, urlLogo, isLoaded, setIsLoaded }) => (
    <div data-testid="party-logo" data-loading={loading} data-url={urlLogo}>
      Mock Party Logo
    </div>
  ),
}));

jest.mock('../components/PartyDescription', () => ({
  PartyDescription: ({ loading, isLoaded }) => (
    <div data-testid="party-description" data-loading={loading} data-loaded={isLoaded}>
      Mock Party Description
    </div>
  ),
}));

describe('PartyLogoUploader', () => {
  const mockDispatch = jest.fn();
  const mockTranslate = jest.fn((key) => key);
  const mockOpen = jest.fn();
  let mockOnDropAccepted: (files: Array<File>) => void;
  let mockGetFilesFromEvent: (event: any) => Promise<Array<File>>;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock hooks
    (useAppDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (useAppSelector as jest.Mock).mockReturnValue('mock-logo-url');
    (useTranslation as jest.Mock).mockReturnValue({ t: mockTranslate });

    // Reset uploadLogo mock to success by default
    (DashboardApi.uploadLogo as jest.Mock).mockImplementation(() => Promise.resolve(true));

    // Capture the dropzone callbacks when useDropzone is called
    (useDropzone as jest.Mock).mockImplementation((options) => {
      mockOnDropAccepted = options.onDropAccepted;
      mockGetFilesFromEvent = options.getFilesFromEvent;
      return {
        getRootProps: () => ({ onClick: jest.fn() }),
        getInputProps: () => ({}),
        open: mockOpen,
      };
    });

    URL.createObjectURL = jest.fn(() => 'mock-url');
    URL.revokeObjectURL = jest.fn();
  });

  test('should not render upload components when canUploadLogo is false', () => {
    renderWithProviders(
      <PartyLogoUploader canUploadLogo={false} partyId="123" setclearCache={jest.fn()} />
    );

    expect(screen.queryByTestId('party-logo')).not.toBeInTheDocument();
    expect(screen.queryByTestId('party-description')).not.toBeInTheDocument();
  });

  test('should render upload components when canUploadLogo is true', () => {
    renderWithProviders(
      <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={jest.fn()} />
    );

    expect(screen.getByTestId('party-logo')).toBeInTheDocument();
    expect(screen.getByTestId('party-description')).toBeInTheDocument();
  });

  describe('file upload handling', () => {
    test('should process valid PNG file upload', async () => {
      const mockedSuccesGetFilesFromEvent = jest
        .fn()
        .mockResolvedValue([new File([''], 'test.png', { type: 'image/png' })]);
      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={jest.fn()} />
      );

      const mockFile = new File([''], 'test.png', { type: 'image/png' });
      const event = {
        dataTransfer: {
          files: [mockFile],
        },
      };

      const files = await mockedSuccesGetFilesFromEvent(event);
      expect(files.length).toBe(1);
    });

    test('should reject non-PNG files', async () => {
      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={jest.fn()} />
      );

      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const event = {
        dataTransfer: {
          files: [mockFile],
        },
      };

      const files = await mockGetFilesFromEvent(event);
      expect(files).toEqual([]);
    });

    test('should handle successful file upload', async () => {
      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={jest.fn()} />
      );

      const mockFile = new File([''], 'test.png', { type: 'image/png' });

      Object.defineProperty(mockFile, 'width', { value: 350 });
      Object.defineProperty(mockFile, 'height', { value: 350 });

      mockOnDropAccepted([mockFile]);

      expect(trackEvent).toHaveBeenCalledWith('DASHBOARD_PARTY_CHANGE_LOGO', expect.any(Object));
      expect(DashboardApi.uploadLogo).toHaveBeenCalledWith('123', mockFile);

      await waitFor(() => {
        expect(trackEvent).toHaveBeenCalledWith(
          'DASHBOARD_PARTY_CHANGE_LOGO_SUCCESS',
          expect.any(Object)
        );
      });
    });

    test('should handle upload failure', async () => {
      (DashboardApi.uploadLogo as jest.Mock).mockImplementation(() =>
        Promise.reject(new Error('Upload failed'))
      );

      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={jest.fn()} />
      );

      const mockFile = new File([''], 'test.png', { type: 'image/png' });

      Object.defineProperty(mockFile, 'width', { value: 350 });
      Object.defineProperty(mockFile, 'height', { value: 350 });

      mockOnDropAccepted([mockFile]);

      await waitFor(() => {
        expect(trackEvent).toHaveBeenCalledWith(
          'DASHBOARD_PARTY_CHANGE_LOGO_FAILURE',
          expect.any(Object)
        );
      });
    });

    test('should update loading state during upload', async () => {
      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={jest.fn()} />
      );

      const mockFile = new File([''], 'test.png', { type: 'image/png' });

      Object.defineProperty(mockFile, 'width', { value: 350 });
      Object.defineProperty(mockFile, 'height', { value: 350 });

      mockOnDropAccepted([mockFile]);

      const logo = screen.getByTestId('party-logo');
      expect(logo).toHaveAttribute('data-loading', 'true');

      await waitFor(() => {
        expect(logo).toHaveAttribute('data-loading', 'false');
      });
    });
  });
});
