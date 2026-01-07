import React from 'react';

// Lenis removed. 
// Returning native browser scrolling for maximum reliability on touchpads and mobile.
interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  return (
    <div className="w-full">
      {children}
    </div>
  );
};