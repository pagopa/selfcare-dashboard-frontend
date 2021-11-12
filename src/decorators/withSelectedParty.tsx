import { useEffect } from 'react';
import { useSelectedParty } from '../hooks/useSelectedParty';

export default function withSelectedParty<T>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithSelectedParty = (props: T) => {
    const { fetchSelectedParty } = useSelectedParty();

    useEffect(() => {
      fetchSelectedParty().catch((reason) => {
        /* TODO  errorHandling */ console.error(reason);
      });
    }, []);
    return <WrappedComponent {...(props as T)} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithSelectedParty.displayName = `withSelectedParty(${displayName})`;

  return ComponentWithSelectedParty;
}
