export function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="h-16 animate-pulse rounded-[18px] bg-blush/60" />
      ))}
    </div>
  );
}
