import * as React from "react";

import { cn } from "@/lib/utils";

function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-line px-2 py-0.5 font-mono text-xs text-muted",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
