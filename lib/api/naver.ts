import type { NaverShopSearchResponse, SearchParams } from '@/types/naver';

/**
 * 네이버 쇼핑 검색 API 호출 (서버 API Route를 통해 호출)
 * @param params 검색 파라미터
 * @returns 검색 결과
 */
export async function searchNaverShop(
  params: SearchParams
): Promise<NaverShopSearchResponse> {
  const { query, display = 100, start = 1, sort = 'sim' } = params;

  if (!query.trim()) {
    throw new Error('검색어를 입력해주세요.');
  }

  const searchParams = new URLSearchParams({
    query: query.trim(),
    display: display.toString(),
    start: start.toString(),
    sort,
  });

  const response = await fetch(`/api/search?${searchParams}`, {
    method: 'GET',
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API 요청 실패: ${response.status}`);
  }

  const data: NaverShopSearchResponse = await response.json();
  return data;
}

/**
 * 무한 스크롤을 위한 페이지네이션 파라미터 타입
 */
export type InfiniteSearchParams = {
  query: string;
  pageParam?: number; // 다음 페이지의 start 값
  display?: number;
  sort?: 'sim' | 'date' | 'asc' | 'dsc';
};

/**
 * 무한 스크롤용 검색 함수 (TanStack Query useInfiniteQuery와 함께 사용)
 */
export async function searchNaverShopInfinite({
  query,
  pageParam = 1,
  display = 100,
  sort = 'sim',
}: InfiniteSearchParams): Promise<NaverShopSearchResponse> {
  return searchNaverShop({
    query,
    start: pageParam,
    display,
    sort,
  });
}
