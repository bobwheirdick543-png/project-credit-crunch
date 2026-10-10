import { createFileRoute, redirect } from "@tanstack/react-router";

// Old checkout flow removed — redirect to District home
export const Route = createFileRoute("/market/$category/$businessId/checkout")({
  ssr: false,
  beforeLoad: () => {
    throw redirect({ to: "/market" });
  },
  component: () => null,
});
