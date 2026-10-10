import { createFileRoute, redirect } from "@tanstack/react-router";

// Old business detail flow removed — redirect to District home
export const Route = createFileRoute("/market/$category/$businessId")({
  ssr: false,
  beforeLoad: () => {
    throw redirect({ to: "/market" });
  },
  component: () => null,
});
