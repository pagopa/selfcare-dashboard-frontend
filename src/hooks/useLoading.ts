import { uniqueId } from 'lodash';
import { useRef } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { appStateActions } from '../redux/slices/appStateSlice';

export default function (task: string): (loading: boolean) => void {
  const dispatch = useAppDispatch();
  const ref = useRef(uniqueId());
  return (loading: boolean) =>
    dispatch(appStateActions.setLoading({ task: `${task}[${ref.current}]`, loading }));
}
