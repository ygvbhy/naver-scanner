'use client';

import type { ProductGroup } from '@/lib/utils/grouping';
import { calculatePriceStats, type PriceStats } from '@/lib/utils/stats';
import { formatPrice } from '@/lib/utils/price';
import { useMemo } from 'react';

type MarketStatsProps = {
  groups: ProductGroup[];
  isLoading?: boolean;
};

export default function MarketStats({ groups, isLoading }: MarketStatsProps) {
  const stats = useMemo(() => {
    return calculatePriceStats(groups);
  }, [groups]);

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
        <h3 className="mb-4 text-base font-bold text-gray-900">가격 인사이트</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse rounded-xl bg-gradient-to-r from-gray-100 to-gray-50"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (stats.count === 0) {
    return (
      <div className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
        <h3 className="mb-4 text-base font-bold text-gray-900">가격 인사이트</h3>
        <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="mb-2 text-base font-bold text-gray-900">가격 인사이트</h3>
        <p className="text-xs font-medium text-gray-500">
          {stats.groups}개 상품 · {stats.count}개 판매처 기준
        </p>
      </div>

      <div className="space-y-5">
        {/* 최저가 */}
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 p-4">
          <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-blue-700">
            최저가
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-blue-600">
            {formatPrice(stats.min)}
          </div>
        </div>

        {/* 최고가 */}
        <div>
          <div className="mb-1.5 text-xs font-semibold text-gray-600">최고가</div>
          <div className="text-2xl font-bold tracking-tight text-gray-900">
            {formatPrice(stats.max)}
          </div>
        </div>

        {/* 평균가 */}
        <div>
          <div className="mb-1.5 text-xs font-semibold text-gray-600">평균가</div>
          <div className="text-xl font-bold tracking-tight text-gray-800">
            {formatPrice(stats.mean)}
          </div>
        </div>

        {/* 중앙값 */}
        <div>
          <div className="mb-1.5 text-xs font-semibold text-gray-600">중앙값</div>
          <div className="text-xl font-bold tracking-tight text-gray-800">
            {formatPrice(stats.median)}
          </div>
        </div>
      </div>

      {/* 안내 문구 */}
      <div className="mt-6 rounded-lg border border-amber-200/60 bg-amber-50/80 px-3.5 py-2.5 backdrop-blur-sm">
        <p className="text-xs leading-relaxed text-amber-900/90">
          배송비, 옵션, 프로모션 할인 등은 제외된 기본 판매가 기준입니다.
        </p>
      </div>
    </div>
  );
}
