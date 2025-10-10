import { storageUserOps } from '@pagopa/selfcare-common-frontend/lib/utils/storage';
import { INTEROP_PRODUCT_ENUM } from './constants';

export const compareDates = (
  dateA?: Date,
  dateB?: Date,
  sortOrder: 'asc' | 'desc' = 'asc'
): number => {
  if (!dateA && !dateB) {
    return 0;
  }
  if (!dateA) {
    return 1;
  }
  if (!dateB) {
    return -1;
  }
  const timeA = dateA.getTime();
  const timeB = dateB.getTime();

  return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
};

export const compareStrings = (strA: string, strB: string, sortOrder: 'asc' | 'desc') =>
  sortOrder === 'asc' ? strA.localeCompare(strB) : strB.localeCompare(strA);

export const startWithProductInterop = (id?: string) =>
  id?.startsWith(INTEROP_PRODUCT_ENUM.INTEROP);

export const addCacheBuster = (url?: string) => {
  if (!url) {
    return undefined;
  }
  // Remove any existing 't' parameter
  const baseUrl = url.replace(/([?&])t=[^&]*(&|$)/, '$1').replace(/([?&])$/, '');
  const separator = baseUrl.includes('?') ? '&' : '?';
  return `${baseUrl}${separator}t=${new Date().getTime()}`;
};

export const isPagoPaUser = storageUserOps.read()?.iss === 'PAGOPA';
