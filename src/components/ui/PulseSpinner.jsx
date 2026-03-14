const PulseSpinner = ({ size = 'md', color = 'blue' }) => {
  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const colors = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    red: 'bg-red-600',
    yellow: 'bg-yellow-600'
  };

  return (
    <div className="flex space-x-2 justify-center items-center">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={`
            ${sizes[size]}
            ${colors[color]}
            rounded-full
            animate-bounce
          `}
          style={{
            animationDelay: `${i * 0.15}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );
};

export default PulseSpinner;