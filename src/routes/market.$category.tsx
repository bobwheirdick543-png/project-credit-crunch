import { createFileRoute, redirect } from "@tanstack/react-router";

// Old category flow removed — redirect to District home
export const Route = createFileRoute("/market/$category")({
  ssr: false,
  beforeLoad: () => {
    throw redirect({ to: "/market" });
  },
  component: () => null,
});
