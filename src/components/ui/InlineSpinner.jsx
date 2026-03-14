const InlineSpinner = ({ text = 'Loading...', size = 'md' }) => {
  const sizes = {
    sm: 'w-3 h-3 border-2',
    md: 'w-4 h-4 border-2',
    lg: 'w-5 h-5 border-3'
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`
          ${sizes[size]}
          border-blue-600
          border-t-transparent
          rounded-full
          animate-spin
        `}
      />
      <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
    </div>
  );
};

export default InlineSpinner;