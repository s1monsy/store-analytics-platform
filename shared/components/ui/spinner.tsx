import { cn } from "@/shared/utils/utils";

export function Spinner({ className }: { className?: string }) {
  return <div className={cn("spinner", className)} />;
}

export function PageSpinner() {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <Spinner />
    </div>
  );
}
