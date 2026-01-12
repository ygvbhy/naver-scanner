import type { ProductGroup } from './grouping';
import type { NaverShopItem } from '@/types/naver';

/**
 * 검색 결과에서 고유한 브랜드 목록 추출
 * @param items 상품 아이템 배열
 * @returns 브랜드명 배열 (정렬됨, 빈 값 제외)
 */
export function extractBrands(items: NaverShopItem[]): string[] {
  const brandSet = new Set<string>();

  for (const item of items) {
    // brand 또는 maker 필드 활용
    if (item.brand && item.brand.trim()) {
      brandSet.add(item.brand.trim());
    }
    if (item.maker && item.maker.trim()) {
      brandSet.add(item.maker.trim());
    }
  }

  return Array.from(brandSet).sort();
}

/**
 * 브랜드 필터 적용
 * @param groups 상품 그룹 배열
 * @param selectedBrands 선택된 브랜드 Set
 * @returns 필터링된 상품 그룹 배열
 */
export function filterByBrands(
  groups: ProductGroup[],
  selectedBrands: Set<string>
): ProductGroup[] {
  if (selectedBrands.size === 0) {
    return groups;
  }

  return groups.filter((group) => {
    // 그룹 내 모든 아이템 중 하나라도 선택된 브랜드와 일치하면 포함
    return group.items.some((item) => {
      const itemBrand = item.brand?.trim() || '';
      const itemMaker = item.maker?.trim() || '';
      return selectedBrands.has(itemBrand) || selectedBrands.has(itemMaker);
    });
  });
}
