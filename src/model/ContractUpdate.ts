export type LegalRepresentative = {
  name: string;
  surname: string;
  taxCode: string;
  email: string;
};

export type AdminPerson = LegalRepresentative;

export type Admin = AdminPerson & {
  // Local identifier of the card, stable across edits
  key: string;
  // Present only for users loaded from the API
  userId?: string;
  // Tax code returned by the API, used to hide the user when it is the new Legal Representative
  originalTaxCode?: string;
  // The logged user can change only their own email and cannot remove themselves
  isLoggedUser?: boolean;
};

export type ContractUpdateDraft = {
  legalRepresentative: LegalRepresentative;
  admins: Array<Admin>;
};

// Loaded users that have the same tax code as the Legal Representative are not shown as admins
export const getVisibleAdmins = (draft: ContractUpdateDraft): Array<Admin> => {
  const lrTaxCode = draft.legalRepresentative.taxCode.toUpperCase();
  return draft.admins.filter((admin) => !lrTaxCode || admin.originalTaxCode !== lrTaxCode);
};
