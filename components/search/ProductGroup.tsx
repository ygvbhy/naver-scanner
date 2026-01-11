'use client';

import type { ProductGroup } from '@/lib/utils/grouping';
import { formatPrice, stripHtmlTags } from '@/lib/utils/price';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

type ProductGroupProps = {
  group: ProductGroup;
};

export default function ProductGroup({ group }: ProductGroupProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMultipleSellers = group.items.length > 1;
  const searchParams = useSearchParams();
  const currentQuery = searchParams.get('q') || '';

  // 검색어를 쿼리 파라미터로 전달
  const detailUrl = currentQuery
    ? `/products/${group.groupId}?q=${encodeURIComponent(currentQuery)}`
    : `/products/${group.groupId}`;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200/60 bg-white shadow-sm transition-all duration-300 hover:border-gray-300 hover:shadow-xl hover:shadow-gray-200/50">
      {/* 대표 상품 정보 */}
      <Link href={detailUrl} className="flex flex-1 flex-col">
        {/* 상품 이미지 */}
        <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <img
            src={group.image}
            alt={stripHtmlTags(group.title)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
        </div>
        {/* 텍스트 정보 */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="mb-4 line-clamp-2 flex-1 text-base font-semibold leading-snug text-gray-900 transition-colors duration-200 group-hover:text-gray-950">
            {stripHtmlTags(group.title)}
          </h3>
          <div className="mt-auto">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-3">
                <div className="flex flex-col">
                  <span className="text-2xl font-extrabold tracking-tight text-blue-600 transition-colors duration-200 group-hover:text-blue-700">
                    {formatPrice(group.minPrice)}
                  </span>
                  <span className="text-xs font-medium text-gray-500 mt-0.5">
                    비교 기준 가격
                  </span>
                </div>
                {hasMultipleSellers && (
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {group.items.length}개 판매처
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-500">
                정확한 가격은 상세에서 확인하세요
              </div>
            </div>
          </div>
        </div>
      </Link>

      {/* 판매처 목록 (여러 판매처가 있을 때만 표시) */}
      {hasMultipleSellers && (
        <div className="border-t border-gray-100 bg-gray-50/50 p-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-white hover:text-gray-900"
          >
            <span>판매처 목록 보기</span>
            <span
              className={`inline-block transition-transform duration-200 ${
                isExpanded ? 'rotate-180' : ''
              }`}
            >
              ▼
            </span>
          </button>
          {isExpanded && (
            <div className="mt-3 space-y-1">
              {group.items.map((item, index) => (
                <a
                  key={`${item.productId}-${item.mallName}-${index}`}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/item flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-all duration-200 hover:bg-white hover:shadow-sm"
                >
                  <span className="font-medium text-gray-700 transition-colors duration-200 group-hover/item:text-gray-900">
                    {item.mallName}
                  </span>
                  <span className="text-xs font-medium text-gray-500 transition-colors duration-200 group-hover/item:text-blue-600">
                    가격 확인 →
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
