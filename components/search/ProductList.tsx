'use client';

import type { ProductGroup } from '@/lib/utils/grouping';
import ProductGroup from './ProductGroup';

type ProductListProps = {
  groups: ProductGroup[];
};

export default function ProductList({ groups }: ProductListProps) {
  if (groups.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>검색 결과가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {groups.map((group) => (
        <ProductGroup key={group.productId} group={group} />
      ))}
    </div>
  );
}
