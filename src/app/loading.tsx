import { LoaderCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 bg-background/80">
      <div className="grid h-dvh w-full place-content-center">
        <LoaderCircle className="h-40 w-40 animate-spin text-foreground/20" />
      </div>
    </div>
  );
}
