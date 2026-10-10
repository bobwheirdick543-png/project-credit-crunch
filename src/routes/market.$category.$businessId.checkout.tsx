import { createFileRoute } from "@tanstack/react-router";
import { Checkout } from "@/components/district/ShopPages";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/market/$category/$businessId/checkout")({
  ssr: false,
  head: () =>
    pageHead(
      "Checkout — The District",
      "Review your itemized purchase, gifting selections, VAT and service charges."
    ),
  component: Page,
});

function Page() {
  const params = Route.useParams();
  return <Checkout {...params} />;
}
