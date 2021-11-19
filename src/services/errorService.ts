import { AppError } from '../redux/slices/appStateSlice';

export const handleErrors = (errors: Array<AppError>) => {
  errors.forEach((e) => {
    console.error('An error occurred: ', e);
  });
};
