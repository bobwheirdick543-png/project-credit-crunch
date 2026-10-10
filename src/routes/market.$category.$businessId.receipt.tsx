import { createFileRoute } from "@tanstack/react-router";
import { ReceiptPage } from "@/components/district/ShopPages";
import { pageHead } from "@/lib/metadata";
import { DistrictBankProvider } from "@/lib/DistrictBankContext";

export const Route = createFileRoute("/market/$category/$businessId/receipt")({
  ssr: false,
  head: () => pageHead("Payment Receipt — The District", "View verified purchase totals, remaining Soul Vault funds and ownership certificates."),
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search["ref"] === "string" ? search["ref"] : undefined,
  }),
  component: Page,
});
function Page() {
  const params = Route.useParams();
  const { ref } = Route.useSearch();
  return (
    <DistrictBankProvider>
      <ReceiptPage {...params} refId={ref} />
    </DistrictBankProvider>
  );
}
