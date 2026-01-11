'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { parseGroupId } from '@/lib/utils/groupId';
import { groupProductsByProductId, type ProductGroup } from '@/lib/utils/grouping';
import { findSimilarProducts } from '@/lib/utils/similarProducts';
import { formatPrice, stripHtmlTags } from '@/lib/utils/price';
import LoadingSpinner from '@/components/search/LoadingSpinner';
import ErrorMessage from '@/components/search/ErrorMessage';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import type { NaverShopItem } from '@/types/naver';

export default function ProductDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const groupId = params.groupId as string;
  const productId = parseGroupId(groupId);
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);
  
  // URL에서 검색어 가져오기
  const searchQuery = searchParams.get('q') || '';

  // 클라이언트에서만 실행
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 모든 검색 결과 캐시에서 데이터 찾기 (클라이언트에서만)
  const allGroups = useMemo(() => {
    if (!isClient) return [];

    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    // 'naverShop'으로 시작하는 모든 쿼리 찾기
    const searchQueries = queries.filter(
      (query) => query.queryKey[0] === 'naverShop'
    );

    if (searchQueries.length === 0) return [];

    // 모든 쿼리의 데이터를 합치기
    const allItems: NaverShopItem[] = [];
    for (const query of searchQueries) {
      const data = query.state.data as
        | { pages: { items: NaverShopItem[] }[] }
        | undefined;
      if (data?.pages) {
        for (const page of data.pages) {
          allItems.push(...page.items);
        }
      }
    }

    if (allItems.length === 0) return [];

    return groupProductsByProductId(allItems);
  }, [queryClient, isClient]);

  // 현재 그룹 찾기
  const currentGroup = useMemo(() => {
    if (!isClient) return undefined;
    return allGroups.find((group) => group.productId === productId);
  }, [allGroups, productId, isClient]);

  // 비슷한 상품 찾기
  const similarProducts = useMemo(() => {
    if (!isClient || !currentGroup || allGroups.length === 0) return [];
    return findSimilarProducts(currentGroup, allGroups, 5, 0.3);
  }, [currentGroup, allGroups, isClient]);

  // 클라이언트에서 데이터 로드 중
  if (!isClient) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <LoadingSpinner />
        </div>
      </main>
    );
  }

  // 그룹을 찾을 수 없는 경우
  if (!currentGroup) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="text-center">
            <p className="mb-2 text-base font-medium text-gray-900">
              상품 정보를 찾을 수 없습니다.
            </p>
            <p className="mb-6 text-sm text-gray-500">
              검색 결과에서 상품을 클릭하여 상세 정보를 확인하세요.
            </p>
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-blue-600 transition-colors duration-200 hover:text-blue-700"
            >
              검색 페이지로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const representative = currentGroup.representativeItem;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* 뒤로가기 */}
        <Link
          href={searchQuery ? `/?q=${encodeURIComponent(searchQuery)}` : '/'}
          className="mb-8 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-white hover:text-gray-900 hover:shadow-sm"
        >
          <span>←</span>
          <span>검색 결과로 돌아가기</span>
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
          {/* 좌측: 대표 상품 영역 */}
          <div>
            <div className="mb-8">
              {/* 큰 이미지 */}
              <div className="group/image mb-8 aspect-square w-full max-w-lg overflow-hidden rounded-2xl bg-gradient-to-br from-gray-100 to-gray-50 shadow-xl transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={currentGroup.image}
                  alt={stripHtmlTags(currentGroup.title)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                />
              </div>
              <h1 className="mb-6 text-3xl font-extrabold leading-tight tracking-tight text-gray-900">
                {stripHtmlTags(currentGroup.title)}
              </h1>
              {/* 핵심 정보 */}
              <div className="space-y-2 text-xs text-gray-600">
                {representative.brand && (
                  <div>
                    <span className="font-semibold">브랜드:</span>{' '}
                    {representative.brand}
                  </div>
                )}
                {representative.maker && (
                  <div>
                    <span className="font-semibold">제조사:</span>{' '}
                    {representative.maker}
                  </div>
                )}
                {representative.category1 && (
                  <div>
                    <span className="font-semibold">카테고리:</span>{' '}
                    {[
                      representative.category1,
                      representative.category2,
                      representative.category3,
                    ]
                      .filter(Boolean)
                      .join(' > ')}
                  </div>
                )}
              </div>
            </div>

            {/* 비슷한 상품 섹션 */}
            {similarProducts.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-5 text-base font-bold text-gray-900">비슷한 상품</h2>
                <div className="space-y-3">
                  {similarProducts.map((group) => {
                    const similarUrl = searchQuery
                      ? `/products/${group.groupId}?q=${encodeURIComponent(searchQuery)}`
                      : `/products/${group.groupId}`;
                    return (
                      <Link
                        key={group.groupId}
                        href={similarUrl}
                        className="group/item flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-md"
                      >
                        <div className="flex-shrink-0">
                          <div className="h-24 w-24 overflow-hidden rounded-lg bg-gradient-to-br from-gray-100 to-gray-50 transition-transform duration-300 group-hover/item:scale-105">
                            <img
                              src={group.image}
                              alt={stripHtmlTags(group.title)}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="mb-2 line-clamp-2 text-sm font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover/item:text-gray-950">
                            {stripHtmlTags(group.title)}
                          </h3>
                          <div className="text-lg font-extrabold text-blue-600 transition-colors duration-200 group-hover/item:text-blue-700">
                            {formatPrice(group.minPrice)}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 우측: 판매처별 가격 리스트 */}
          <div>
            <h2 className="mb-6 text-base font-bold text-gray-900">
              판매처별 가격{' '}
              <span className="font-normal text-gray-500">
                ({currentGroup.items.length}개)
              </span>
            </h2>
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-lg">
              <ul className="divide-y divide-gray-100">
                {currentGroup.items.map((item, index) => (
                  <li key={`${item.productId}-${item.mallName}-${index}`}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/item flex items-center justify-between px-5 py-5 transition-all duration-200 hover:bg-blue-50/50"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-semibold text-gray-900 transition-colors duration-200 group-hover/item:text-gray-950">
                          {item.mallName}
                        </div>
                      </div>
                      <div className="ml-6 flex-shrink-0">
                        <span className="text-2xl font-extrabold tracking-tight text-blue-600 transition-all duration-200 group-hover/item:text-blue-700">
                          {formatPrice(item.lprice)}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 데이터 신뢰성 안내 */}
            <div className="mt-6 rounded-xl border border-amber-200/60 bg-amber-50/80 px-4 py-3.5 backdrop-blur-sm">
              <p className="text-xs leading-relaxed text-amber-900/90">
                ⚠️ 네이버 쇼핑 기준 데이터이며, 실제 판매가와 차이가 있을 수
                있습니다. 배송비, 옵션, 프로모션 할인 등은 반영되지 않았습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
