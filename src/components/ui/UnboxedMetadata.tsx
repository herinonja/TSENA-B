import React from 'react';

export interface UnboxedMetadataProps {
  items: (string | number | React.ReactNode)[];
  className?: string;
  separator?: string;
}

export const UnboxedMetadata: React.FC<UnboxedMetadataProps> = ({
  items,
  className = '',
  separator = '·',
}) => {
  const filteredItems = items.filter(Boolean);

  return (
    <div className={`flex flex-wrap items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 ${className}`}>
      {filteredItems.map((item, index) => (
        <React.Fragment key={index}>
          <span className="whitespace-nowrap">{item}</span>
          {index < filteredItems.length - 1 && (
            <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-600 font-bold select-none">
              {separator}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
