const SkeletonCard = () => (
  <div className="border rounded-lg p-4 space-y-3 animate-pulse bg-muted/30">
    <div className="h-4 w-1/4 bg-muted rounded" />
    <div className="h-3 w-1/2 bg-muted rounded" />
    <div className="h-3 w-1/3 bg-muted rounded" />
  </div>
);

export default SkeletonCard;