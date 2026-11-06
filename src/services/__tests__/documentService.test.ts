import { Mock } from 'vitest';
import { DashboardApi } from '../../api/DashboardApiClient';
import { TypeEnum as DocumentTypeEnum } from '../../api/generated/b4f-dashboard/DocumentResource';
import { getDocumentsList } from '../documentService';

vi.mock('../../api/DashboardApiClient', () => ({
  DashboardApi: {
    getDocumentsList: vi.fn(),
  },
}));

describe('documentService', () => {
  beforeEach(() => {
    import.meta.env.VITE_API_MOCK_PARTIES = 'false';
    vi.clearAllMocks();
  });

  test('getDocumentsList returns the documents of the product', async () => {
    const documents = [{ name: 'Contratto.pdf', type: DocumentTypeEnum.INSTITUTION }];
    (DashboardApi.getDocumentsList as Mock).mockResolvedValue({ documents });

    await expect(getDocumentsList('inst-1', 'prod-io')).resolves.toEqual(documents);
    expect(DashboardApi.getDocumentsList).toHaveBeenCalledWith('inst-1', 'prod-io');
  });

  test('getDocumentsList returns an empty list when documents are missing', async () => {
    (DashboardApi.getDocumentsList as Mock).mockResolvedValue({});

    await expect(getDocumentsList('inst-1', 'prod-io')).resolves.toEqual([]);
  });
});
