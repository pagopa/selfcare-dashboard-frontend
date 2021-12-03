import { uniqueId } from 'lodash';
import { Component, ErrorInfo, Fragment, ReactNode } from 'react';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { AppError, appStateActions, appStateSelectors } from '../../redux/slices/appStateSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { handleErrors } from '../../services/errorService';
import SessionModal from '../SessionModal';
import BlockingErrorPage from './components/BlockingErrorPage';

interface Props {
  children: ReactNode;
  errors: Array<AppError>;
  addError: (error: AppError) => void;
  removeError: (error: AppError) => void;
}

class ErrorBoundary extends Component<Props> {
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.addError({
      id: uniqueId('uncaught-'),
      techDescription: 'Uncaught error',
      error,
      errorInfo,
      blocking: true,
      toNotify: true,
    });
  }

  public render() {
    const hasError = this.props.errors.length > 0;
    const blockingErrors = this.props.errors.filter((e) => e.blocking);
    const hasBlockingError = blockingErrors.length > 0;

    if (hasError) {
      handleErrors(this.props.errors);
    }

    if (!hasBlockingError) {
      return (
        <Fragment>
          {this.props.children}
          {hasError && this.buildErrorModal(this.props.errors[0])}
        </Fragment>
      );
    } else {
      return <BlockingErrorPage description={blockingErrors[0].displayableDescription} />;
    }
  }

  buildErrorModal(error: AppError) {
    return (
      <SessionModal
        open={true}
        title="Errore"
        message={error.displayableDescription ?? 'Spiacenti, qualcosa è andato storto.'}
        onConfirm={error.onRetry ? () => this.retryError(error) : undefined}
        handleClose={() => {
          this.popError(error);
          if (error.onClose) {
            error.onClose();
          }
        }}
      />
    );
  }

  retryError(error: AppError) {
    this.popError(error);
    if (error.onRetry) {
      error.onRetry();
    }
  }

  popError(error: AppError) {
    this.props.removeError(error);
  }
}

const errorsSelector = createSelector(appStateSelectors.selectErrors, (errors) => errors);

function mapStateToProps(state: RootState) {
  return { errors: errorsSelector(state) };
}

const mapDispatchToProps = (dispatch: AppDispatch) => ({
  addError: (error: AppError) => dispatch(appStateActions.addError(error)),
  removeError: (error: AppError) => dispatch(appStateActions.removeError(error)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorBoundary);
