import { screen } from '@testing-library/react';
import React from 'react';
import { mockedParties } from '../../../../../services/__mocks__/partyService';
import { renderWithProviders } from '../../../../../utils/test-utils';
import PartyDetail from '../components/PartyDetail';

test('Test: Insurance company party cannot see the geotaxonomies', () => {
  const mockedInsuranceCompany = mockedParties[18];

  renderWithProviders(<PartyDetail party={mockedInsuranceCompany} />);

  expect(screen.queryByText('Area geografica')).not.toBeInTheDocument();
});

test('Test: Party with taxCode and zipCode and without vatNumber', () => {
  renderWithProviders(<PartyDetail party={mockedParties[22]} />);
  console.log('mockedParties[22]', mockedParties[22]);
  expect(screen.queryByText('Partita IVA')).not.toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale')).not.toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale / P.IVA')).not.toBeInTheDocument();
  expect(mockedParties[22].registeredOffice).toBe('Via Roma, 10');
});

test('Test: Party with vatNumber and without fiscalCode and zipCode', () => {
  renderWithProviders(<PartyDetail party={mockedParties[23]} />);

  expect(screen.queryByText('Partita IVA')).toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale')).not.toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale / P.IVA')).not.toBeInTheDocument();
  expect(mockedParties[23].registeredOffice).toBe('Via Garibaldi, 10');
});

test('Test: Party with fiscalCode and without vatNumber and zipCode', () => {
  renderWithProviders(<PartyDetail party={mockedParties[24]} />);

  expect(screen.queryByText('Partita IVA')).not.toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale')).toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale / P.IVA')).not.toBeInTheDocument();
  expect(mockedParties[24].registeredOffice).toBe('Corso Vittorio Emanuele, 1');
});

test('Test: Party with zipCode and without fiscalCode and vatNumber', () => {
  renderWithProviders(<PartyDetail party={mockedParties[25]} />);

  expect(screen.queryByText('Partita IVA')).not.toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale')).not.toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale / P.IVA')).not.toBeInTheDocument();
  expect(mockedParties[25].zipCode).toBe('38100');
});

test('Test: Party with different vatNumber and fiscalCode without zipCode', () => {
  renderWithProviders(<PartyDetail party={mockedParties[26]} />);

  expect(screen.queryByText('Partita IVA')).toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale')).toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale / P.IVA')).not.toBeInTheDocument();
  expect(mockedParties[26].registeredOffice).toBe('Via Etnea, 100');
});

test('Test: Party with zipCode and different fiscalCode and vatNumber', () => {
  renderWithProviders(<PartyDetail party={mockedParties[27]} />);

  expect(screen.queryByText('Partita IVA')).toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale')).toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale / P.IVA')).not.toBeInTheDocument();
  expect(mockedParties[27].zipCode).toBe('74100');
});

test('Test: Party with zipCode and equal fiscalCode and vatNumber', () => {
  renderWithProviders(<PartyDetail party={mockedParties[13]} />);

  console.log('mockedParties[13]', mockedParties[13]);

  expect(screen.queryByText('Partita IVA')).not.toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale')).not.toBeInTheDocument();
  expect(screen.queryByText('Codice Fiscale / P.IVA')).toBeInTheDocument();
  expect(mockedParties[13].zipCode).toBe('20121');
});
