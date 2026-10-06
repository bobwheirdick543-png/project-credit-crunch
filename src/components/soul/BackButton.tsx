import { useRouter } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.history.back()}
      className="glass-pill fixed left-4 top-20 z-30 flex items-center gap-1 px-3 py-2 text-sm font-medium"
    >
      <ChevronLeft className="h-4 w-4" />
      Back
    </button>
  );
}
