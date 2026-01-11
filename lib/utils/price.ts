/**
 * 가격을 원화 형식으로 포맷팅
 * @param price 가격 문자열 또는 숫자
 * @returns 포맷된 가격 문자열 (예: "12,000원")
 */
export function formatPrice(price: string | number): string {
  const numPrice = typeof price === 'string' ? parseInt(price, 10) : price;
  if (isNaN(numPrice)) return '가격 정보 없음';
  return `${numPrice.toLocaleString('ko-KR')}원`;
}

/**
 * HTML 태그 제거
 * @param html HTML 문자열
 * @returns 태그가 제거된 순수 텍스트
 */
export function stripHtmlTags(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}
