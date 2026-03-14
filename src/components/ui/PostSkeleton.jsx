const PostSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-video bg-gray-200 dark:bg-gray-700"></div>

      {/* Content Skeleton */}
      <div className="p-6 space-y-4">
        {/* Category Skeleton */}
        <div className="w-20 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>

        {/* Excerpt Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
        </div>

        {/* Author Skeleton */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      </div>
    </div>
  );
};

export default PostSkeleton;