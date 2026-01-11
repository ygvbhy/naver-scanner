export default function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200"></div>
        <div className="absolute left-0 top-0 h-12 w-12 animate-spin rounded-full border-4 border-transparent border-t-blue-600"></div>
      </div>
    </div>
  );
}
