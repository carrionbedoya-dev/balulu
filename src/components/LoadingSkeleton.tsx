import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  count?: number;
  type?: "card" | "list" | "hero";
}

export default function LoadingSkeleton({
  count = 4,
  type = "card",
}: LoadingSkeletonProps) {
  if (type === "hero") {
    return (
      <div className="animate-pulse">
        <div className="h-96 bg-balulu-border rounded-balulu mb-4" />
        <div className="h-8 bg-balulu-border rounded w-2/3 mb-2" />
        <div className="h-4 bg-balulu-border rounded w-1/2" />
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white rounded-balulu border border-balulu-border animate-pulse">
            <div className="w-12 h-12 bg-balulu-border rounded-balulu-sm flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-balulu-border rounded w-1/3" />
              <div className="h-3 bg-balulu-border rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="bg-white rounded-balulu overflow-hidden border border-balulu-border"
        >
          <div className="aspect-square bg-balulu-border animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-5 bg-balulu-border rounded w-2/3 animate-pulse" />
            <div className="h-4 bg-balulu-border rounded w-1/2 animate-pulse" />
            <div className="h-4 bg-balulu-border rounded w-full animate-pulse" />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
