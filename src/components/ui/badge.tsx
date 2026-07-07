import * as React from "react";

import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-xs text-muted transition-colors hover:border-line-strong hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
