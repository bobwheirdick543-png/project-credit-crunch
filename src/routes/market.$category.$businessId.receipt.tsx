import { createFileRoute, redirect } from "@tanstack/react-router";

// Old receipt flow removed — redirect to District home
export const Route = createFileRoute("/market/$category/$businessId/receipt")({
  ssr: false,
  beforeLoad: () => {
    throw redirect({ to: "/market" });
  },
  component: () => null,
});
