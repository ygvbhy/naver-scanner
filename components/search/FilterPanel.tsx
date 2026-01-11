'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import type { NaverShopItem } from '@/types/naver';
import { extractBrands } from '@/lib/utils/brandFilter';

type FilterPanelProps = {
  items: NaverShopItem[];
  selectedBrands: Set<string>;
  onBrandToggle: (brand: string) => void;
  sortOption: 'sim' | 'asc';
  onSortChange: (sort: 'sim' | 'asc') => void;
  onReset: () => void;
  hasActiveFilters: boolean;
};

export default function FilterPanel({
  items,
  selectedBrands,
  onBrandToggle,
  sortOption,
  onSortChange,
  onReset,
  hasActiveFilters,
}: FilterPanelProps) {
  const [isBrandExpanded, setIsBrandExpanded] = useState(false);
  const brandDropdownRef = useRef<HTMLDivElement>(null);

  // 브랜드 목록 추출
  const brands = useMemo(() => {
    return extractBrands(items);
  }, [items]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        brandDropdownRef.current &&
        !brandDropdownRef.current.contains(event.target as Node)
      ) {
        setIsBrandExpanded(false);
      }
    };

    if (isBrandExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isBrandExpanded]);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-gray-200/80 bg-white/80 px-5 py-3.5 shadow-sm backdrop-blur-sm">
      {/* 정렬 옵션 */}
      <div className="flex items-center gap-2.5">
        <span className="text-sm font-semibold text-gray-700">정렬</span>
        <select
          value={sortOption}
          onChange={(e) => onSortChange(e.target.value as 'sim' | 'asc')}
          className="rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-gray-300"
        >
          <option value="sim">정확도순</option>
          <option value="asc">가격 낮은순</option>
        </select>
      </div>

      {/* 브랜드 필터 */}
      {brands.length > 0 && (
        <div className="flex items-center gap-2.5">
          <span className="text-sm font-semibold text-gray-700">브랜드</span>
          <div className="relative" ref={brandDropdownRef}>
            <button
              onClick={() => setIsBrandExpanded(!isBrandExpanded)}
              className="flex items-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <span>
                {selectedBrands.size > 0
                  ? `${selectedBrands.size}개 선택`
                  : '전체'}
              </span>
              <span
                className={`transition-transform duration-200 ${
                  isBrandExpanded ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>

            {isBrandExpanded && (
              <div className="absolute left-0 top-full z-10 mt-2 max-h-64 w-72 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
                <div className="p-2">
                  {brands.map((brand) => (
                    <label
                      key={brand}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors duration-150 hover:bg-blue-50"
                    >
                      <input
                        type="checkbox"
                        checked={selectedBrands.has(brand)}
                        onChange={() => onBrandToggle(brand)}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500/30"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 필터 초기화 */}
      {hasActiveFilters && (
        <button
          onClick={onReset}
          className="ml-auto rounded-lg border-2 border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
        >
          필터 초기화
        </button>
      )}
    </div>
  );
}
