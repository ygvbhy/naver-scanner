# 환경 변수 설정

네이버 쇼핑 검색 API를 사용하기 위해 환경 변수를 설정해야 합니다.

## 설정 방법

1. 프로젝트 루트에 `.env.local` 파일을 생성하세요.

2. 다음 내용을 추가하세요:

```
NAVER_CLIENT_ID=your_client_id_here
NAVER_CLIENT_SECRET=your_client_secret_here
```

3. 네이버 개발자 센터(https://developers.naver.com)에서 API 키를 발급받으세요.
   - 애플리케이션 등록 후 "Client ID"와 "Client Secret"을 발급받을 수 있습니다.
   - 검색 API 사용을 위해 "검색" 서비스를 활성화해야 합니다.

## 주의사항

- `.env.local` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
- 서버 사이드에서만 사용되므로 `NEXT_PUBLIC_` 접두사가 없습니다.
- API 키는 서버 API Route를 통해 안전하게 처리됩니다.
