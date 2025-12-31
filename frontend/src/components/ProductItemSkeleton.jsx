const ProductItemSkeleton = () => {
  return (
    <div className="rounded-md border-[0.5px] pb-5 animate-pulse">
      <div className="w-full h-64 bg-gray-200 rounded-t-md"></div>
      <div className="pt-3 pb-1 pl-2">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default ProductItemSkeleton;

