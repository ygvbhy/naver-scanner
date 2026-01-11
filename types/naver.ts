// 네이버 쇼핑 검색 API 응답 타입

export type NaverShopItem = {
  title: string; // 상품명 (HTML 태그 제거 필요)
  link: string; // 네이버 쇼핑 상품 링크
  image: string; // 썸네일 이미지 URL
  lprice: string; // 최저가 (비교 기준 판매가)
  hprice: string; // 최고가
  mallName: string; // 쇼핑몰명
  productId: string; // 상품 ID
  productType: string; // 상품 타입
  brand: string; // 브랜드
  maker: string; // 제조사
  category1: string; // 카테고리1
  category2: string; // 카테고리2
  category3: string; // 카테고리3
  category4: string; // 카테고리4
};

export type NaverShopSearchResponse = {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverShopItem[];
};

export type SearchParams = {
  query: string;
  display?: number; // 기본값: 100
  start?: number; // 기본값: 1
  sort?: 'sim' | 'date' | 'asc' | 'dsc'; // 기본값: 'sim' (정확도순)
};
