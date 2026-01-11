type ErrorMessageProps = {
  message: string;
  onRetry?: () => void;
};

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="py-20 text-center">
      <div className="mx-auto max-w-md rounded-2xl border border-red-200 bg-red-50/50 p-6">
        <p className="mb-6 text-base font-medium text-red-700">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40"
          >
            다시 시도
          </button>
        )}
      </div>
    </div>
  );
}
