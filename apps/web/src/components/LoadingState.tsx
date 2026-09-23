export function LoadingState({ label = "Loading your practice lab…" }: { label?: string }) {
  return (
    <div className="center-state">
      <span className="loader" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="center-state error-state">
      <strong>Something blocked this screen.</strong>
      <p>{message}</p>
      {onRetry && <button className="button button-primary" onClick={onRetry}>Try again</button>}
    </div>
  );
}
