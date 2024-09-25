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
  
  export const codeToLabelProduct = (code: string) => {
    switch (code) {
      case 'prod-io':
        return 'Io';
      case 'prod-pagopa':
        return 'Piattaforma pagoPA';
      case 'prod-io, prod-pagopa':
        return 'Io, Piattaforma pagoPA';
      default:
        return '';
    }
  };
  