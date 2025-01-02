import React, { useEffect, useState } from 'react';

const Loader = ({ isVisible }) => {
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      setShouldRender(true);
    } else {
      const timeout = setTimeout(() => setShouldRender(false), 500); // Match duration
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  return (
    shouldRender && (
      <div
        className={`p-2 animate-spin drop-shadow-2xl bg-gradient-to-bl from-pink-400 via-purple-400 to-indigo-600 md:w-12 md:h-12 h-8 w-8 aspect-square rounded-full transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="rounded-full h-full w-full bg-slate-100 dark:bg-zinc-900 background-blur-md" />
      </div>
    )
  );
};

export default Loader;
