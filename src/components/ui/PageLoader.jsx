import { useState, useEffect } from 'react';

const PageLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 90) {
          clearInterval(timer);
          return 90;
        }
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 90);
      });
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <div className="h-1 bg-gray-200 dark:bg-gray-700">
        <div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default PageLoader;