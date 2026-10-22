import { Admin, ContractUpdateDraft } from '../../../ContractUpdateWizardContext';
import { areAdminsValid, validateAdmins } from '../validation';

const legalRepresentative = {
  name: 'Mario',
  surname: 'Rossi',
  taxCode: 'RSSMRA80A01H501U',
  email: 'mario.rossi@comune.it',
};

const giulio: Admin = {
  key: 'admin-0',
  userId: 'user-2',
  originalTaxCode: 'BNCGLI80A01H501Y',
  name: 'Giulio',
  surname: 'Bianchi',
  taxCode: 'BNCGLI80A01H501Y',
  email: 'giulio.bianchi@comune.it',
};

const draft = (admins: Array<Admin>): ContractUpdateDraft => ({ legalRepresentative, admins });

test('accepts valid admins, also with a PEC email', () => {
  const admins = [{ ...giulio, email: 'giulio.bianchi@pec.comune.it' }];
  expect(validateAdmins(draft(admins))).toEqual({ 'admin-0': {} });
  expect(areAdminsValid(draft(admins))).toBe(true);
  expect(areAdminsValid(draft([]))).toBe(true);
});

test('applies the same field rules used for the Legal Representative', () => {
  const errors = validateAdmins(
    draft([
      { key: 'admin-1', name: '', surname: 'Verdi', taxCode: 'BNCGLI80A01H501X', email: 'wrong' },
    ])
  );
  expect(errors['admin-1']).toEqual({
    name: 'required',
    surname: 'surnameMismatch',
    taxCode: 'invalidTaxCode',
    email: 'invalidEmail',
  });
  expect(areAdminsValid(draft([{ ...giulio, email: '' }]))).toBe(false);
});

test('flags tax codes that are repeated between admins or equal to the Legal Representative one', () => {
  const duplicated: Admin = {
    ...giulio,
    key: 'admin-1',
    userId: undefined,
    originalTaxCode: undefined,
  };
  const sameAsLR: Admin = {
    key: 'admin-2',
    name: 'Mario',
    surname: 'Rossi',
    taxCode: 'rssmra80a01h501u',
    email: 'mario@comune.it',
  };
  const errors = validateAdmins(draft([giulio, duplicated, sameAsLR]));
  expect(errors['admin-0'].taxCode).toBe('duplicateTaxCode');
  expect(errors['admin-1'].taxCode).toBe('duplicateTaxCode');
  expect(errors['admin-2'].taxCode).toBe('duplicateTaxCode');
});

test('ignores loaded users that are the Legal Representative', () => {
  const lrUser: Admin = {
    key: 'admin-3',
    userId: 'user-3',
    originalTaxCode: 'RSSMRA80A01H501U',
    name: '',
    surname: '',
    taxCode: 'RSSMRA80A01H501U',
    email: '',
  };
  expect(validateAdmins(draft([lrUser]))).toEqual({});
  expect(areAdminsValid(draft([lrUser]))).toBe(true);
});

test('validates only the email of the logged user', () => {
  const loggedUser: Admin = { ...giulio, isLoggedUser: true, name: 'Wrong', email: 'invalid' };
  expect(validateAdmins(draft([loggedUser]))).toEqual({ 'admin-0': { email: 'invalidEmail' } });
  expect(validateAdmins(draft([{ ...loggedUser, email: 'ok@comune.it' }]))).toEqual({
    'admin-0': {},
  });
});
