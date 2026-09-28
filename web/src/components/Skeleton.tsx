import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div className={`animate-pulse bg-slate-800/80 rounded-2xl ${className}`} />
  );
};

export const ActivityCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#131B2E] border border-slate-800 rounded-2xl overflow-hidden h-72 flex flex-col justify-between p-4 space-y-3">
      <Skeleton className="h-36 w-full rounded-xl" />
      <div className="space-y-2 flex-1 pt-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-slate-800">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-7 w-16 rounded-xl" />
      </div>
    </div>
  );
};
