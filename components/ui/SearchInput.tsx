'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';

type SearchInputProps = {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  initialValue?: string;
};

export default function SearchInput({
  onSearch,
  isLoading = false,
  placeholder = '상품명을 입력하세요',
  initialValue,
}: SearchInputProps) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialValue || '');
  const [isClient, setIsClient] = useState(false);

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // URL 쿼리 파라미터가 변경되면 입력값 업데이트 (클라이언트에서만)
  useEffect(() => {
    if (!isClient) return;
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isClient]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl">
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          disabled={isLoading}
          className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-5 py-4 text-base shadow-sm transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:bg-gray-50"
        />
        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-8 py-4 font-semibold text-white shadow-lg shadow-blue-500/30 transition-all duration-200 hover:from-blue-700 hover:to-blue-600 hover:shadow-xl hover:shadow-blue-500/40 focus:outline-none focus:ring-4 focus:ring-blue-500/30 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-400 disabled:shadow-none"
        >
          {isLoading ? '검색 중...' : '검색'}
        </button>
      </div>
    </form>
  );
}
