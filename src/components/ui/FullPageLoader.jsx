const FullPageLoader = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
      <div className="text-center space-y-6">
        {/* Animated Logo */}
        <div className="relative">
          <div className="w-24 h-24 border-4 border-blue-200 dark:border-blue-900 rounded-full animate-ping opacity-75"></div>
          <div className="absolute inset-0 w-24 h-24 border-4 border-blue-600 dark:border-blue-400 rounded-full animate-spin border-t-transparent"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400 animate-pulse">
              MERN
            </span>
          </div>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {message}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
            Please wait while we prepare your content...
          </p>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.15}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FullPageLoader;