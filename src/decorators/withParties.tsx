import { useEffect } from 'react';
import { useParties } from '../hooks/useParties';

export default function withParties<T>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithParties = (props: T) => {
    const { fetchParties } = useParties();
    useEffect(() => {
      fetchParties().catch((reason) => {
        /* TODO  errorHandling */ console.error(reason);
        return [];
      });
    }, []);

    return <WrappedComponent {...(props as T)} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithParties.displayName = `withParties(${displayName})`;

  return ComponentWithParties;
}
