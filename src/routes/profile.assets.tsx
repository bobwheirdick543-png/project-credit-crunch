import { createFileRoute } from "@tanstack/react-router";
import { AssetsPage } from "@/components/district/AssetsPage";
import { pageHead } from "@/lib/metadata";
import { DistrictBankProvider } from "@/lib/DistrictBankContext";

export const Route = createFileRoute("/profile/assets")({
  ssr: false,
  head: () => pageHead("My Assets — Garage, Wardrobe & Vault", "Your Soul Life vehicles, ownership certificates, wardrobe and meal vouchers."),
  validateSearch: (search: Record<string, unknown>) => ({
    tab: ["garage", "wardrobe", "vault"].includes(String(search["tab"])) ? String(search["tab"]) : "garage",
  }),
  component: Page,
});
function Page() {
  const { tab } = Route.useSearch();
  return (
    <DistrictBankProvider>
      <AssetsPage initialTab={tab} />
    </DistrictBankProvider>
  );
}
