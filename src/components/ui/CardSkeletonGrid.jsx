const CardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-pulse">
    <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
    </div>
  </div>
);

const CardSkeletonGrid = ({ count = 6, cols = 3 }) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  return (
    <div className={`grid gap-6 ${gridCols[cols] || gridCols[3]}`}>
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
};

export default CardSkeletonGrid;