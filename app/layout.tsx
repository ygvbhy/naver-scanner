import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from './QueryProvider';

export const metadata: Metadata = {
  title: '네이버 쇼핑 최저가 검색',
  description: '네이버 쇼핑 기준 오픈마켓 최저가를 확인하는 도구',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
