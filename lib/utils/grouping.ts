import type { NaverShopItem } from '@/types/naver';
import { generateGroupId } from './groupId';

/**
 * 상품 그룹 타입
 * 동일 상품(productId)의 여러 판매처를 묶은 그룹
 */
export type ProductGroup = {
  productId: string;
  groupId: string; // URL-safe한 그룹 식별자
  title: string; // HTML 태그 제거된 상품명
  image: string;
  minPrice: number; // 그룹 내 최저가
  items: NaverShopItem[]; // 판매처별 상품 목록 (가격 오름차순 정렬)
  // 대표 상품 정보 (가장 깔끔한 이름 선택)
  representativeItem: NaverShopItem;
};

/**
 * 상품 목록을 productId 기준으로 그룹핑
 * @param items 상품 목록
 * @returns 그룹화된 상품 목록 (최저가 기준 오름차순)
 */
export function groupProductsByProductId(
  items: NaverShopItem[]
): ProductGroup[] {
  const groupMap = new Map<string, NaverShopItem[]>();

  // productId 기준으로 그룹핑
  for (const item of items) {
    const existing = groupMap.get(item.productId) || [];
    existing.push(item);
    groupMap.set(item.productId, existing);
  }

  // 그룹 배열로 변환 및 정렬
  const groups: ProductGroup[] = [];

  for (const [productId, groupItems] of groupMap.entries()) {
    // 그룹 내 상품들을 가격 오름차순으로 정렬
    const sortedItems = groupItems.sort((a, b) => {
      const priceA = parseInt(a.lprice, 10);
      const priceB = parseInt(b.lprice, 10);
      return priceA - priceB;
    });

    // 대표 상품 선택: 가장 깔끔한 이름을 가진 상품
    // (HTML 태그가 적고, 길이가 적당한 것)
    const representative = sortedItems.reduce((best, current) => {
      const bestTitle = best.title.replace(/<[^>]*>/g, '').trim();
      const currentTitle = current.title.replace(/<[^>]*>/g, '').trim();
      
      // HTML 태그가 적고, 길이가 적당한 것을 선호
      const bestScore = bestTitle.length + (best.title.match(/<[^>]*>/g)?.length || 0) * 10;
      const currentScore = currentTitle.length + (current.title.match(/<[^>]*>/g)?.length || 0) * 10;
      
      return currentScore < bestScore ? current : best;
    }, sortedItems[0]);

    groups.push({
      productId,
      groupId: generateGroupId(productId),
      title: representative.title.replace(/<[^>]*>/g, '').trim(),
      image: representative.image,
      minPrice: parseInt(sortedItems[0].lprice, 10),
      items: sortedItems,
      representativeItem: representative,
    });
  }

  // 그룹들을 최저가 기준 오름차순으로 정렬
  return groups.sort((a, b) => a.minPrice - b.minPrice);
}
