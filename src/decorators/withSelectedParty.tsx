import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelectedParty } from '../hooks/useSelectedParty';

type DashboardUrlParams = {
  institutionId: string;
};

export default function withSelectedParty<T>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithSelectedParty = (props: T) => {
    const { fetchSelectedParty } = useSelectedParty();
    const { institutionId } = useParams<DashboardUrlParams>();

    useEffect(() => {
      fetchSelectedParty(institutionId).catch((reason) => {
        /* TODO  errorHandling */ console.error(reason);
      });
    }, [institutionId]);
    return <WrappedComponent {...(props as T)} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithSelectedParty.displayName = `withSelectedParty(${displayName})`;

  return ComponentWithSelectedParty;
}
