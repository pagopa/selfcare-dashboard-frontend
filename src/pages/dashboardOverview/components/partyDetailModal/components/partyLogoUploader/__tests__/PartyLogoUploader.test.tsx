/* eslint-disable functional/no-let, functional/immutable-data */
import { trackEvent } from '@pagopa/selfcare-common-frontend/lib/services/analyticsService';
import { act, screen, waitFor } from '@testing-library/react';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { Mock } from 'vitest';
import { DashboardApi } from '../../../../../../../api/DashboardApiClient';
import { useAppDispatch, useAppSelector } from '../../../../../../../redux/hooks';
import { renderWithProviders } from '../../../../../../../utils/test-utils';
import { PartyLogoUploader } from '../PartyLogoUploader';

const mockAddError = vi.hoisted(() => vi.fn());

// Mock the entire DashboardApi module
vi.mock('../../../../../../../api/DashboardApiClient', () => ({
  DashboardApi: {
    uploadLogo: vi.fn(() => Promise.resolve(true)),
  },
}));

vi.mock('react-dropzone');
vi.mock('react-i18next');
vi.mock('../../../../../../../redux/hooks');
vi.mock('@pagopa/selfcare-common-frontend/lib/services/analyticsService');
vi.mock('@pagopa/selfcare-common-frontend/lib/hooks/useErrorDispatcher', () => ({
  default: () => mockAddError,
}));

vi.mock('../components/PartyLogo', () => ({
  __esModule: true,
  default: ({ loading, urlLogo }: any) => (
    <div data-testid="party-logo" data-loading={loading} data-url={urlLogo}>
      Mock Party Logo
    </div>
  ),
}));

vi.mock('../components/PartyDescription', () => ({
  PartyDescription: ({ loading, isLoaded }: any) => (
    <div data-testid="party-description" data-loading={loading} data-loaded={isLoaded}>
      Mock Party Description
    </div>
  ),
}));

describe('PartyLogoUploader', () => {
  const mockDispatch = vi.fn();
  const mockTranslate = vi.fn((key) => key);
  const mockOpen = vi.fn();
  let mockOnDropAccepted: (files: Array<File>) => void;
  let mockGetFilesFromEvent: (event: any) => Promise<Array<File>>;
  let mockOnDropRejected: (files: Array<any>) => void;
  let mockValidator: (file: any) => { code: string; message: string } | null;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock hooks
    (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    (useAppSelector as Mock).mockReturnValue('mock-logo-url');
    (useTranslation as Mock).mockReturnValue({ t: mockTranslate });

    // Reset uploadLogo mock to success by default
    (DashboardApi.uploadLogo as Mock).mockImplementation(() => Promise.resolve(true));

    // Capture the dropzone callbacks when useDropzone is called
    (useDropzone as Mock).mockImplementation((options) => {
      mockOnDropAccepted = options.onDropAccepted;
      mockGetFilesFromEvent = options.getFilesFromEvent;
      mockOnDropRejected = options.onDropRejected;
      mockValidator = options.validator;
      return {
        getRootProps: () => ({ onClick: vi.fn() }),
        getInputProps: () => ({}),
        open: mockOpen,
      };
    });

    URL.createObjectURL = vi.fn(() => 'mock-url');
    URL.revokeObjectURL = vi.fn();
  });

  test('should not render upload components when canUploadLogo is false', () => {
    renderWithProviders(
      <PartyLogoUploader canUploadLogo={false} partyId="123" setclearCache={vi.fn()} />
    );

    expect(screen.queryByTestId('party-logo')).not.toBeInTheDocument();
    expect(screen.queryByTestId('party-description')).not.toBeInTheDocument();
  });

  test('should render upload components when canUploadLogo is true', () => {
    renderWithProviders(
      <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={vi.fn()} />
    );

    expect(screen.getByTestId('party-logo')).toBeInTheDocument();
    expect(screen.getByTestId('party-description')).toBeInTheDocument();
  });

  describe('file upload handling', () => {
    test('should process valid PNG file upload', async () => {
      const mockedSuccesGetFilesFromEvent = vi
        .fn()
        .mockResolvedValue([new File([''], 'test.png', { type: 'image/png' })]);
      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={vi.fn()} />
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
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={vi.fn()} />
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
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={vi.fn()} />
      );

      const mockFile = new File([''], 'test.png', { type: 'image/png' });

      Object.defineProperty(mockFile, 'width', { value: 350 });
      Object.defineProperty(mockFile, 'height', { value: 350 });

      await act(async () => {
        mockOnDropAccepted([mockFile]);
      });

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
      (DashboardApi.uploadLogo as Mock).mockImplementation(() =>
        Promise.reject(new Error('Upload failed'))
      );

      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={vi.fn()} />
      );

      const mockFile = new File([''], 'test.png', { type: 'image/png' });

      Object.defineProperty(mockFile, 'width', { value: 350 });
      Object.defineProperty(mockFile, 'height', { value: 350 });

      await act(async () => {
        mockOnDropAccepted([mockFile]);
      });

      await waitFor(() => {
        expect(trackEvent).toHaveBeenCalledWith(
          'DASHBOARD_PARTY_CHANGE_LOGO_FAILURE',
          expect.any(Object)
        );
      });
    });

    test('should update loading state during upload', async () => {
      let resolveUpload: (value: boolean) => void = () => {};
      (DashboardApi.uploadLogo as Mock).mockReturnValue(
        new Promise((resolve) => {
          resolveUpload = resolve;
        })
      );

      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={vi.fn()} />
      );

      const mockFile = new File([''], 'test.png', { type: 'image/png' });

      Object.defineProperty(mockFile, 'width', { value: 350 });
      Object.defineProperty(mockFile, 'height', { value: 350 });

      await act(async () => {
        mockOnDropAccepted([mockFile]);
      });

      const logo = screen.getByTestId('party-logo');
      expect(logo).toHaveAttribute('data-loading', 'true');

      resolveUpload(true);

      await waitFor(() => {
        expect(logo).toHaveAttribute('data-loading', 'false');
      });
    });
  });

  describe('dropzone configuration', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
    });

    test('returns no files when the event has no file', async () => {
      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={vi.fn()} />
      );

      await expect(mockGetFilesFromEvent({ target: { files: [] } })).resolves.toEqual([]);
      expect(mockAddError).not.toHaveBeenCalled();
    });

    test('reads png image dimensions from an input change event', async () => {
      // eslint-disable-next-line functional/no-class
      class MockImage {
        public onload: () => void = () => undefined;
        public width = 320;
        public height = 300;
        set src(_value: string) {
          setTimeout(() => this.onload());
        }
      }
      vi.stubGlobal('Image', MockImage);
      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={vi.fn()} />
      );

      const mockFile = new File([''], 'logo.png', { type: 'image/png' });
      const files = await mockGetFilesFromEvent({ target: { files: [mockFile] } });

      expect(files).toEqual([mockFile]);
      expect((files[0] as any).width).toBe(320);
      expect((files[0] as any).height).toBe(300);
      expect(URL.createObjectURL).toHaveBeenCalledWith(mockFile);
    });

    test('notifies a wrong file extension error for non png files', async () => {
      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={vi.fn()} />
      );

      const mockFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      await mockGetFilesFromEvent({ dataTransfer: { files: [mockFile] } });

      expect(mockAddError).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'WRONG_FILE_EXTENSION',
          blocking: false,
          toNotify: false,
          displayableTitle: 'overview.partyLogo.uploadError.title',
          onRetry: mockOpen,
        })
      );
    });

    test('notifies an error when the dropped file is rejected', () => {
      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={vi.fn()} />
      );

      mockOnDropRejected([{ file: new File([''], 'big.png'), errors: [] }]);

      expect(mockAddError).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'WRONG_FILE_EXTENSION',
          displayableDescription: 'overview.partyLogo.uploadError.description',
        })
      );
    });

    test.each([
      [350, 350, null],
      [300, 300, null],
      [400, 400, null],
      [401, 401, 'height-width'],
      [299, 299, 'height-width'],
      [350, 340, 'height-width'],
    ])('validates an image %ix%i', (width, height, expectedCode) => {
      renderWithProviders(
        <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={vi.fn()} />
      );

      const result = mockValidator({ width, height });
      expect(result?.code ?? null).toBe(expectedCode);
    });
  });

  test('updates the logo and asks to clear the cache after a successful upload', async () => {
    const setclearCache = vi.fn();
    renderWithProviders(
      <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={setclearCache} />
    );

    await act(async () => {
      mockOnDropAccepted([new File([''], 'test.png', { type: 'image/png' })]);
    });

    await waitFor(() => expect(setclearCache).toHaveBeenCalledWith(true));
    expect(mockDispatch).toHaveBeenCalledWith(
      expect.objectContaining({ payload: 'mock-logo-url' })
    );
    expect(mockAddError).not.toHaveBeenCalled();
  });

  test('notifies an error when the upload fails', async () => {
    const reason = new Error('Upload failed');
    (DashboardApi.uploadLogo as Mock).mockImplementation(() => Promise.reject(reason));
    const setclearCache = vi.fn();
    renderWithProviders(
      <PartyLogoUploader canUploadLogo={true} partyId="123" setclearCache={setclearCache} />
    );

    await act(async () => {
      mockOnDropAccepted([new File([''], 'test.png', { type: 'image/png' })]);
    });

    await waitFor(() =>
      expect(mockAddError).toHaveBeenCalledWith(
        expect.objectContaining({ id: 'FILE_UPLOAD_ERROR', error: reason, onRetry: mockOpen })
      )
    );
    expect(setclearCache).not.toHaveBeenCalled();
  });
});
