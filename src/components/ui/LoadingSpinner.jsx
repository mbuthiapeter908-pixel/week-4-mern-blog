const LoadingSpinner = ({ size = 'md', color = 'blue', fullPage = false }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const colors = {
    blue: 'border-blue-600',
    purple: 'border-purple-600',
    green: 'border-green-600',
    red: 'border-red-600',
    yellow: 'border-yellow-600',
    gray: 'border-gray-600',
    white: 'border-white'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div
        className={`
          ${sizes[size]} 
          ${colors[color]}
          border-4
          border-t-transparent
          rounded-full
          animate-spin
        `}
      />
      <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
        Loading...
      </p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;