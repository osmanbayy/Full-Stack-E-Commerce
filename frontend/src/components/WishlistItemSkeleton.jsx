const WishlistItemSkeleton = () => {
  return (
    <div className="flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden h-full animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-square bg-gray-200"></div>
      
      {/* Content Skeleton */}
      <div className="flex flex-col flex-grow p-4">
        {/* Title Skeleton */}
        <div className="mb-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Rating Skeleton */}
        <div className="flex items-center gap-1 mb-2">
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
        
        {/* Price Skeleton */}
        <div className="mb-4">
          <div className="h-5 bg-gray-200 rounded w-24"></div>
        </div>
        
        {/* Buttons Skeleton */}
        <div className="flex flex-col gap-2 mt-auto">
          <div className="w-full h-11 bg-gray-200 rounded-lg"></div>
          <div className="w-full h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItemSkeleton;

