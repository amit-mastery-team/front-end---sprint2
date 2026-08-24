import PropTypes from 'prop-types';
import Button from './Button';
import { useI18n } from '@/shared/i18n/I18nProvider';

function LoadingState({ message }) {
  return (
    <div className="state" aria-live="polite">
      <div className="skeleton skeleton--wide" />
      <div className="skeleton skeleton--narrow" />
      <span className="visually-hidden">{message}</span>
    </div>
  );
}

LoadingState.propTypes = { message: PropTypes.string.isRequired };

function ErrorState({ title, message, retryLabel, onRetry }) {
  return (
    <div className="state state--error" role="alert">
      <h4>{title}</h4>
      <p>{message}</p>
      {onRetry ? (
        <Button variant="danger" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </div>
  );
}

ErrorState.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  retryLabel: PropTypes.string.isRequired,
  onRetry: PropTypes.func,
};

function EmptyState({ title, message }) {
  return (
    <div className="state">
      <h4>{title}</h4>
      <p>{message}</p>
    </div>
  );
}

EmptyState.propTypes = { title: PropTypes.string.isRequired, message: PropTypes.string };

/** One place that decides what loading, failure and emptiness look like. */
export default function AsyncBoundary({ loading, error, isEmpty = false, emptyMessage, onRetry, children }) {
  const { t } = useI18n();

  if (loading) return <LoadingState message={t('state.loading')} />;

  if (error) {
    return (
      <ErrorState
        title={t('state.errorTitle')}
        message={error.message}
        retryLabel={t('common.retry')}
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty) return <EmptyState title={t('state.emptyTitle')} message={emptyMessage} />;

  return children;
}

AsyncBoundary.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.instanceOf(Error),
  isEmpty: PropTypes.bool,
  emptyMessage: PropTypes.string,
  onRetry: PropTypes.func,
  children: PropTypes.node,
};
