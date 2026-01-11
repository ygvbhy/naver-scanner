'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useInfiniteQuery } from '@tanstack/react-query';
import SearchInput from '@/components/ui/SearchInput';
import ProductList from '@/components/search/ProductList';
import LoadingSpinner from '@/components/search/LoadingSpinner';
import ErrorMessage from '@/components/search/ErrorMessage';
import LoadMoreTrigger from '@/components/search/LoadMoreTrigger';
import MarketStats from '@/components/search/MarketStats';
import { searchNaverShopInfinite } from '@/lib/api/naver';
import { groupProductsByProductId } from '@/lib/utils/grouping';
import { filterByBrands } from '@/lib/utils/brandFilter';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import FilterPanel from '@/components/search/FilterPanel';
import Link from 'next/link';
import type { NaverShopItem } from '@/types/naver';
import { useMemo } from 'react';

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const [sortOption, setSortOption] = useState<'sim' | 'asc'>('sim');
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());

  // 클라이언트 마운트 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  // URL 쿼리 파라미터에서 검색어 복원 (클라이언트에서만)
  useEffect(() => {
    if (!isClient) return;
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== query) {
      setQuery(urlQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isClient]);

  // 무한 스크롤 쿼리
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['naverShop', query, sortOption],
    queryFn: ({ pageParam = 1 }) =>
      searchNaverShopInfinite({
        query,
        pageParam,
        display: 100,
        sort: sortOption,
      }),
    enabled: query.length > 0,
    initialPageParam: 1,
    getNextPageParam: (
      lastPage: { total: number },
      allPages: { total: number }[]
    ) => {
      const currentStart = allPages.length * 100;
      const total = lastPage.total;
      if (currentStart < total) {
        return currentStart + 1;
      }
      return undefined;
    },
  });

  // 모든 페이지의 상품을 합치고 그룹핑
  const allItems = useMemo(() => {
    return (
      data?.pages.flatMap((page: { items: NaverShopItem[] }) => page.items) ||
      []
    );
  }, [data]);

  const groupedProducts = useMemo(() => {
    const grouped = groupProductsByProductId(allItems);
    // 브랜드 필터 적용
    return filterByBrands(grouped, selectedBrands);
  }, [allItems, selectedBrands]);

  // 무한 스크롤 트리거
  const loadMoreRef = useInfiniteScroll({
    hasNextPage: hasNextPage ?? false,
    isFetchingNextPage,
    fetchNextPage,
  });

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    // URL 쿼리 파라미터 업데이트
    const params = new URLSearchParams();
    if (searchQuery.trim()) {
      params.set('q', searchQuery.trim());
      router.push(`/?${params.toString()}`, { scroll: false });
    } else {
      router.push('/', { scroll: false });
    }
  };

  const handleRetry = () => {
    refetch();
  };

  const handleReset = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setQuery('');
    setSortOption('sim');
    setSelectedBrands(new Set());
    router.push('/', { scroll: false });
  };

  const handleFilterReset = () => {
    setSortOption('sim');
    setSelectedBrands(new Set());
  };

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands((prev) => {
      const next = new Set(prev);
      if (next.has(brand)) {
        next.delete(brand);
      } else {
        next.add(brand);
      }
      return next;
    });
  };

  const handleSortChange = (sort: 'sim' | 'asc') => {
    setSortOption(sort);
    // 정렬 변경 시 검색 결과 초기화 (queryKey 변경으로 자동 처리됨)
  };

  const hasActiveFilters = sortOption !== 'sim' || selectedBrands.size > 0;

  const isLoadingInitial = isLoading && query.length > 0;
  const hasResults = groupedProducts.length > 0;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* 헤더 */}
        <div className="mb-10">
          <Link href="/" onClick={handleReset}>
            <h1 className="mb-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
              최저가 검색
            </h1>
          </Link>
          <p className="text-lg text-gray-600">
            상품명을 입력하여 오픈마켓 최저가를 확인하세요
          </p>
        </div>

        {/* 검색창 */}
        <div className="mb-8">
          <SearchInput onSearch={handleSearch} isLoading={isFetching} />
        </div>

        {/* 필터 패널 및 안내 */}
        {hasResults && (
          <div className="mb-6 space-y-4">
            <FilterPanel
              items={allItems}
              selectedBrands={selectedBrands}
              onBrandToggle={handleBrandToggle}
              sortOption={sortOption}
              onSortChange={handleSortChange}
              onReset={handleFilterReset}
              hasActiveFilters={hasActiveFilters}
            />
            <div className="rounded-lg border border-amber-200/60 bg-amber-50/80 px-4 py-2.5 backdrop-blur-sm">
              <p className="text-xs leading-relaxed text-amber-900/90">
                ⚠️ 네이버 쇼핑 기준 데이터이며, 실제 판매가와 차이가 있을 수
                있습니다. 배송비, 옵션, 프로모션 할인 등은 반영되지 않았습니다.
              </p>
            </div>
          </div>
        )}

        {/* 검색 결과 영역 */}
        {hasResults || isLoadingInitial ? (
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
            {/* 좌측: 검색 결과 리스트 */}
            <div>
              {isLoadingInitial && <LoadingSpinner />}
              {isError && (
                <ErrorMessage
                  message={
                    error instanceof Error
                      ? error.message
                      : '검색 중 오류가 발생했습니다.'
                  }
                  onRetry={handleRetry}
                />
              )}
              {hasResults && <ProductList groups={groupedProducts} />}

              {/* 무한 스크롤 트리거 */}
              {hasResults && (
                <LoadMoreTrigger
                  ref={loadMoreRef}
                  isLoading={isFetchingNextPage}
                  hasNextPage={hasNextPage ?? false}
                  error={isError ? (error as Error) : null}
                  onRetry={handleRetry}
                />
              )}
            </div>

            {/* 우측: 가격 인사이트 패널 */}
            <div className="order-first lg:order-last">
              <div className="sticky top-6">
                <MarketStats
                  groups={groupedProducts}
                  isLoading={isLoadingInitial || isFetchingNextPage}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full">
            {isError && (
              <ErrorMessage
                message={
                  error instanceof Error
                    ? error.message
                    : '검색 중 오류가 발생했습니다.'
                }
                onRetry={handleRetry}
              />
            )}
            {!isLoadingInitial && !hasResults && query.length > 0 && (
              <div className="py-20 text-center">
                <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                  <p className="text-lg font-semibold text-gray-700">
                    검색 결과가 없습니다.
                  </p>
                </div>
              </div>
            )}
            {query.length === 0 && (
              <div className="py-20 text-center">
                <div className="mx-auto max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                  <p className="text-lg font-semibold text-gray-700">
                    위 검색창에 상품명을 입력하여 검색해주세요.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
