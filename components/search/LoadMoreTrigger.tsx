'use client';

import { forwardRef } from 'react';
import LoadingSpinner from './LoadingSpinner';

type LoadMoreTriggerProps = {
  isLoading: boolean;
  hasNextPage: boolean;
  error?: Error | null;
  onRetry?: () => void;
};

const LoadMoreTrigger = forwardRef<HTMLDivElement, LoadMoreTriggerProps>(
  function LoadMoreTrigger(
    { isLoading, hasNextPage, error, onRetry },
    ref
  ) {
  if (!hasNextPage) {
    return (
      <div className="py-12 text-center">
        <p className="text-sm font-medium text-gray-500">
          모든 상품을 불러왔습니다.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto max-w-md rounded-xl border border-red-200 bg-red-50/50 p-6">
          <p className="mb-6 text-base font-medium text-red-700">
            추가 로드 중 오류가 발생했습니다.
          </p>
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

  return (
    <div ref={ref} className="py-8">
      {isLoading && <LoadingSpinner />}
    </div>
  );
  }
);

export default LoadMoreTrigger;
