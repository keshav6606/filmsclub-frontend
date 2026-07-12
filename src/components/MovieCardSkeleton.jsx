import React from "react";

const MovieCardSkeleton = () => {
  return (
    <div className="rounded-[14px] overflow-hidden bg-bgColorSecondary">
      {/* Poster skeleton */}
      <div className="aspect-[2/3] w-full shimmer-effect" />
      {/* Info skeleton */}
      <div className="p-2.5 space-y-1.5 bg-bgColorSecondary">
        <div className="h-3.5 w-4/5 shimmer-effect rounded" />
        <div className="h-2.5 w-1/3 shimmer-effect rounded" />
      </div>
    </div>
  );
};

export default MovieCardSkeleton;
