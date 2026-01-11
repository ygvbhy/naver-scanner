/**
 * productId를 기반으로 안정적인 groupId 생성
 * URL-safe한 형태로 변환
 */
export function generateGroupId(productId: string): string {
  // productId를 그대로 사용하되, URL-safe하게 인코딩
  // productId가 이미 안정적이므로 추가 해싱은 불필요
  return encodeURIComponent(productId);
}

/**
 * groupId를 productId로 복원
 */
export function parseGroupId(groupId: string): string {
  return decodeURIComponent(groupId);
}
