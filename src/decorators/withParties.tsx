import withRetrievedValue from '@pagopa/selfcare-common-frontend/lib/decorators/withRetrievedValue';
import { useParties } from '../hooks/useParties';
import { BaseParty } from '../model/Party';

export type WithPartiesProps = {
  parties: Array<BaseParty>;
};

export default function withParties<T extends WithPartiesProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'parties' | 'reload'>> {
  return withRetrievedValue('parties', useParties, WrappedComponent);
}
