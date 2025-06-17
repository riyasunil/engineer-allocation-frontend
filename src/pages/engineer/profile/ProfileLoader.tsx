const SkeletonBlock = ({ className = "" }) => (
  <div className={`bg-muted animate-pulse rounded ${className}`} />
);

const ProfileLoader = () => {
  return (
    <div className="space-y-6">
      {/* PageHeader skeleton */}
      <div className="flex justify-between items-center">
        <SkeletonBlock className="h-6 w-32" />
        <SkeletonBlock className="h-8 w-28 rounded-md" />
      </div>

      {/* Top section with Profile Overview & Skills */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Profile Overview */}
        <div className="w-full md:w-1/2 border rounded-lg p-6 space-y-4 animate-pulse bg-muted/30">
          <SkeletonBlock className="h-5 w-40" />
          <div className="flex flex-col items-center gap-2">
            <SkeletonBlock className="w-16 h-16 rounded-full" />
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-3 w-32" />
            <SkeletonBlock className="h-3 w-20" />
          </div>
          <SkeletonBlock className="h-3 w-36" />
          <SkeletonBlock className="h-3 w-28" />
          <SkeletonBlock className="h-10 w-full rounded-md" />
        </div>

        {/* Skills & Expertise */}
        <div className="w-full md:w-1/2 border rounded-lg p-6 space-y-4 animate-pulse bg-muted/30">
          <SkeletonBlock className="h-5 w-40" />
          <div className="space-y-2">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="flex justify-between">
                <SkeletonBlock className="h-3 w-24" />
                <SkeletonBlock className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="border rounded-lg p-6 animate-pulse bg-muted/30 space-y-3">
        <SkeletonBlock className="h-5 w-40" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-3/4" />
      </div>

      {/* Actions */}
      <div className="border rounded-lg p-6 animate-pulse bg-muted/30 space-y-3">
        <SkeletonBlock className="h-5 w-40" />
        <div className="flex gap-3">
          <SkeletonBlock className="h-8 w-32 rounded-md" />
          <SkeletonBlock className="h-8 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default ProfileLoader;
