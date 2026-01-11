import { NextRequest, NextResponse } from 'next/server';
import type { SearchParams } from '@/types/naver';

const NAVER_API_BASE_URL = 'https://openapi.naver.com/v1/search/shop.json';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');

  if (!query || !query.trim()) {
    return NextResponse.json(
      { error: '검색어를 입력해주세요.' },
      { status: 400 }
    );
  }

  const clientId = process.env.NAVER_CLIENT_ID;
  const clientSecret = process.env.NAVER_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { error: '네이버 API 인증 정보가 설정되지 않았습니다.' },
      { status: 500 }
    );
  }

  const display = searchParams.get('display') || '100';
  const start = searchParams.get('start') || '1';
  const sort = searchParams.get('sort') || 'sim';

  const apiParams = new URLSearchParams({
    query: query.trim(),
    display,
    start,
    sort,
  });

  try {
    const response = await fetch(`${NAVER_API_BASE_URL}?${apiParams}`, {
      headers: {
        'X-Naver-Client-Id': clientId,
        'X-Naver-Client-Secret': clientSecret,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.errorMessage || `API 요청 실패: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: '네트워크 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
