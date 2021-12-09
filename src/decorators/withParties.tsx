import { uniqueId } from 'lodash';
import { useEffect } from 'react';
import { useParties } from '../hooks/useParties';
import { useAppDispatch } from '../redux/hooks';
import { AppError, appStateActions } from '../redux/slices/appStateSlice';

export default function withParties<T>(
  WrappedComponent: React.ComponentType<T>
): React.ComponentType<T> {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithParties = (props: T) => {
    const dispatch = useAppDispatch();
    const { fetchParties } = useParties();

    const addError = (error: AppError) => dispatch(appStateActions.addError(error));

    const doFetch = (): void => {
      fetchParties().catch((reason) => {
        addError({
          id: uniqueId(`${ComponentWithParties.displayName}-`),
          blocking: false,
          error: reason,
          techDescription: `An error occurred while fetching parties in component ${ComponentWithParties.displayName}`,
          onRetry: doFetch,
          toNotify: true,
        });
      });
    };

    useEffect(() => {
      doFetch();
    }, []);

    return <WrappedComponent {...(props as T)} />;
  };

  // eslint-disable-next-line functional/immutable-data
  ComponentWithParties.displayName = `withParties(${displayName})`;

  return ComponentWithParties;
}
