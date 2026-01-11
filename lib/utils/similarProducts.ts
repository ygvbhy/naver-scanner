import type { ProductGroup } from './grouping';
import { stripHtmlTags } from './price';

/**
 * 상품명 정규화 (비슷한 상품 찾기용)
 */
function normalizeTitle(title: string): string {
  return stripHtmlTags(title)
    .toLowerCase()
    .replace(/[^\w가-힣\s]/g, '') // 특수문자 제거
    .replace(/\s+/g, ' ') // 공백 정규화
    .trim();
}

/**
 * 두 상품명의 유사도 계산 (간단한 Jaccard 유사도)
 */
function calculateSimilarity(title1: string, title2: string): number {
  const normalized1 = normalizeTitle(title1);
  const normalized2 = normalizeTitle(title2);

  if (normalized1 === normalized2) return 1.0;

  const words1 = new Set(normalized1.split(/\s+/));
  const words2 = new Set(normalized2.split(/\s+/));

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  if (union.size === 0) return 0;

  return intersection.size / union.size;
}

/**
 * 비슷한 상품 그룹 찾기
 * @param targetGroup 기준 그룹
 * @param allGroups 모든 그룹 목록
 * @param limit 추천 개수 (기본 5개)
 * @param threshold 유사도 임계값 (기본 0.3, 덜 공격적으로)
 */
export function findSimilarProducts(
  targetGroup: ProductGroup,
  allGroups: ProductGroup[],
  limit: number = 5,
  threshold: number = 0.3
): ProductGroup[] {
  const similarities = allGroups
    .filter((group) => group.productId !== targetGroup.productId)
    .map((group) => ({
      group,
      similarity: calculateSimilarity(
        targetGroup.representativeItem.title,
        group.representativeItem.title
      ),
    }))
    .filter((item) => item.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map((item) => item.group);

  return similarities;
}
