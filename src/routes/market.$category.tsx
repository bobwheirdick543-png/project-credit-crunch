import { createFileRoute } from "@tanstack/react-router";
import { BusinessListing } from "@/components/district/ShopPages";
import { pageHead } from "@/lib/metadata";
import { DistrictBankProvider } from "@/lib/DistrictBankContext";

export const Route = createFileRoute("/market/$category")({
  ssr: false,
  head: () => pageHead("Local venues — The District", "Browse city-filtered restaurants, dealerships, boutiques and lifestyle venues."),
  component: Page,
});
function Page() {
  const { category } = Route.useParams();
  return (
    <DistrictBankProvider>
      <BusinessListing category={category} />
    </DistrictBankProvider>
  );
}
