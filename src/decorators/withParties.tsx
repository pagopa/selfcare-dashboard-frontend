import withRetrievedValue from '@pagopa/selfcare-common-frontend/decorators/withRetrievedValue';
import { useParties } from '../hooks/useParties';
import { Party } from '../model/Party';

type WithPartiesProps = {
  parties: Array<Party>;
};

export default function withParties<T extends WithPartiesProps>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<Omit<T, 'parties'>> {
  return withRetrievedValue('parties', useParties, WrappedComponent);
}
