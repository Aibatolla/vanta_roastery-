import React from 'react';

/**
 * Full-width divider - amber line only, no borders
 */
export const SectionDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
    return (
        <div className={`w-full bg-[#0a0908] ${className}`}>
            <div className="max-w-4xl mx-auto flex items-center justify-center px-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-700/60" />
                <div className="mx-4 w-2 h-2 rotate-45 bg-amber-600" />
                <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-700/60" />
            </div>
        </div>
    );
};

export default SectionDivider;
