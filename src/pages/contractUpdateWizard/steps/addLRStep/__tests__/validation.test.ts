import { validateLegalRepresentative } from '../validation';

const validLR = {
  name: 'Mario',
  surname: 'Rossi',
  taxCode: 'RSSMRA80A01H501U',
  email: 'mario.rossi@comune.it',
};

test('accepts valid data, also with a lowercase tax code', () => {
  expect(validateLegalRepresentative(validLR)).toEqual({});
  expect(validateLegalRepresentative({ ...validLR, taxCode: 'rssmra80a01h501u' })).toEqual({});
});

test('requires every field', () => {
  expect(validateLegalRepresentative({ name: '', surname: '', taxCode: '', email: '' })).toEqual({
    name: 'required',
    surname: 'required',
    taxCode: 'required',
    email: 'required',
  });
});

test.each([
  ['wrong format', 'RSSMRA80A01H50'],
  ['wrong checksum', 'RSSMRA80A01H501A'],
])('rejects a tax code with %s', (_, taxCode) => {
  expect(validateLegalRepresentative({ ...validLR, taxCode }).taxCode).toBe('invalidTaxCode');
});

test('rejects name and surname that do not match the tax code', () => {
  expect(validateLegalRepresentative({ ...validLR, name: 'Luigi', surname: 'Verdi' })).toEqual({
    name: 'nameMismatch',
    surname: 'surnameMismatch',
  });
});

test.each([
  ['invalidEmail', 'not-an-email'],
  ['pecEmail', 'mario.rossi@pec.comune.it'],
])('returns %s for %s', (error, email) => {
  expect(validateLegalRepresentative({ ...validLR, email }).email).toBe(error);
});
