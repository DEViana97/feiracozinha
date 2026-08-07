import { Skeleton } from "@/components/ui/skeleton";

export default function PublicLoading() {
  return (
    <div className="space-y-4 px-4 py-6">
      <Skeleton className="h-56 w-full rounded-2xl" />
      <Skeleton className="h-10 w-2/3" />
      <div className="flex gap-2">
        <Skeleton className="h-16 w-28 rounded-xl" />
        <Skeleton className="h-16 w-28 rounded-xl" />
        <Skeleton className="h-16 w-28 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
