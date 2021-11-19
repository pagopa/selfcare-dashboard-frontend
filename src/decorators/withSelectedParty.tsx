import { uniqueId } from 'lodash';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { useSelectedParty } from '../hooks/useSelectedParty';
import { useAppDispatch } from '../redux/hooks';
import { AppError, appStateActions } from '../redux/slices/appStateSlice';

type DashboardUrlParams = {
  institutionId: string;
};

export default function withSelectedParty<T>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithSelectedParty = (props: T) => {
    const dispatch = useAppDispatch();
    const { fetchSelectedParty } = useSelectedParty();
    const { institutionId } = useParams<DashboardUrlParams>();

    const addError = (error: AppError) => dispatch(appStateActions.addError(error));

    const doFetch = (): void => {
      fetchSelectedParty(institutionId).catch((reason) => {
        addError({
          id: uniqueId(`${ComponentWithSelectedParty.displayName}-`),
          blocking: false,
          error: reason,
          techDescription: `An error occurred while retrieving selected party having IPACode ${institutionId} in component ${ComponentWithSelectedParty.displayName}`,
          onRetry: doFetch,
        });
      });
    };

    useEffect(() => {
      doFetch();
    }, [institutionId]);
    return <WrappedComponent {...(props as T)} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithSelectedParty.displayName = `withSelectedParty(${displayName})`;

  return ComponentWithSelectedParty;
}
