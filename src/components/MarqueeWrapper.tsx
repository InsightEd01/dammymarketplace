
import React from 'react';

type MarqueeWrapperProps = {
  children: React.ReactNode;
};

const MarqueeWrapper: React.FC<MarqueeWrapperProps> = ({ children }) => {
  return (
    <div className="overflow-hidden whitespace-nowrap relative">
      <div className="inline-block animate-marquee">
        <div className="flex">
          {children}
          {children}
        </div>
      </div>
    </div>
  );
};

export default MarqueeWrapper;
