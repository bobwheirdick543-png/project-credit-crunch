import { useRouter } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();
  return <Button type="button" variant="ghost" className="glass-pill rounded-full" onClick={() => router.history.back()}><ArrowLeft /> Back</Button>;
}