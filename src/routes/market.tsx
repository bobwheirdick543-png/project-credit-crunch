import { Outlet, createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/lib/metadata";
import { DistrictBankProvider } from "@/lib/DistrictBankContext";

export const Route = createFileRoute("/market")({
  ssr: false,
  head: () =>
    pageHead(
      "The District — City Hub",
      "Explore your city, premium venues and lifestyle destinations in Soul Life."
    ),
  component: () => (
    <DistrictBankProvider>
      <Outlet />
    </DistrictBankProvider>
  ),
});
