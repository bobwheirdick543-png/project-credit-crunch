import { createFileRoute } from "@tanstack/react-router";
import { Showroom } from "@/components/district/ShopPages";
import { pageHead } from "@/lib/metadata";
import { DistrictBankProvider } from "@/lib/DistrictBankContext";

export const Route = createFileRoute("/market/$category/$businessId")({
  ssr: false,
  head: () => pageHead("The Showroom — The District", "Explore venue menus, fictional brand collections and detailed vehicle specifications."),
  component: Page,
});
function Page() {
  const params = Route.useParams();
  return (
    <DistrictBankProvider>
      <Showroom key={params.businessId} {...params} />
    </DistrictBankProvider>
  );
}
