import { act, renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { ContractUpdateWizardProvider } from '../../../ContractUpdateWizardContext';
import { useDetailsStep } from '../useDetailsStep';

const wrapper = ({ children }: { children: ReactNode }) => (
  <ContractUpdateWizardProvider>{children}</ContractUpdateWizardProvider>
);

test('reads and updates the details field of the shared draft', () => {
  const { result } = renderHook(() => useDetailsStep(), { wrapper });
  expect(result.current.details).toBe('');

  act(() => result.current.setDetails('new value'));

  expect(result.current.details).toBe('new value');
});
