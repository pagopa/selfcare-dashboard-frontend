import { mockedDocuments } from '../api/__mocks__/DashboardApiClient';
import { DashboardApi } from '../api/DashboardApiClient';
import {
  DocumentResource,
  TypeEnum as DocumentTypeEnum,
} from '../api/generated/b4f-dashboard/DocumentResource';

export const getDocumentsList = (
  institutionId: string,
  productId: string
): Promise<Array<DocumentResource>> => {
  /* istanbul ignore if */
  if (import.meta.env.VITE_API_MOCK_PARTIES === 'true') {
    return Promise.resolve(mockedDocuments);
  }
  return DashboardApi.getDocumentsList(institutionId, productId).then((res) => [
    ...(res?.documents ?? []),
  ]);
};

export const getDocument = (
  institutionId: string,
  productId: string,
  type: DocumentTypeEnum,
  name?: string
): Promise<Blob> => {
  /* istanbul ignore if */
  if (import.meta.env.VITE_API_MOCK_PARTIES === 'true') {
    return Promise.resolve(new Blob([''], { type: 'application/pdf' }));
  }
  return DashboardApi.getDocument(institutionId, productId, type, name);
};
