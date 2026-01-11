import type { ProductGroup } from './grouping';

/**
 * 가격 통계 타입
 */
export type PriceStats = {
  min: number; // 최저가
  max: number; // 최고가
  mean: number; // 평균가
  median: number; // 중앙값
  count: number; // 데이터 포인트 개수
  groups: number; // 상품 그룹 개수
};

/**
 * 모든 그룹에서 판매처별 가격을 추출하여 평탄화
 * @param groups 상품 그룹 배열
 * @returns 가격 배열 (숫자)
 */
function extractAllPrices(groups: ProductGroup[]): number[] {
  const prices: number[] = [];
  
  for (const group of groups) {
    for (const item of group.items) {
      const price = parseInt(item.lprice, 10);
      if (!isNaN(price) && price > 0) {
        prices.push(price);
      }
    }
  }
  
  return prices;
}

/**
 * 중앙값 계산
 */
function calculateMedian(sortedPrices: number[]): number {
  const length = sortedPrices.length;
  if (length === 0) return 0;
  
  if (length % 2 === 0) {
    const mid = length / 2;
    return (sortedPrices[mid - 1] + sortedPrices[mid]) / 2;
  } else {
    return sortedPrices[Math.floor(length / 2)];
  }
}

/**
 * 상품 그룹 배열로부터 가격 통계 계산
 * @param groups 상품 그룹 배열
 * @returns 가격 통계
 */
export function calculatePriceStats(groups: ProductGroup[]): PriceStats {
  if (groups.length === 0) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      count: 0,
      groups: 0,
    };
  }

  const prices = extractAllPrices(groups);
  
  if (prices.length === 0) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      count: 0,
      groups: groups.length,
    };
  }

  const sortedPrices = [...prices].sort((a, b) => a - b);
  const sum = prices.reduce((acc, price) => acc + price, 0);

  return {
    min: sortedPrices[0],
    max: sortedPrices[sortedPrices.length - 1],
    mean: Math.round(sum / prices.length),
    median: Math.round(calculateMedian(sortedPrices)),
    count: prices.length,
    groups: groups.length,
  };
}
