import { createFileRoute } from "@tanstack/react-router";
import { NightlifePage } from "@/components/district/Nightlife";
import { pageHead } from "@/lib/metadata";
import { DistrictBankProvider } from "@/lib/DistrictBankContext";

export const Route = createFileRoute("/nightlife")({
  ssr: false,
  head: () => pageHead("District Nightlife — VIP Lounges & Clubs", "Status-gated lounges and clubs where Rep, dress code and your daily driver decide who gets in."),
  component: () => (
    <DistrictBankProvider>
      <NightlifePage />
    </DistrictBankProvider>
  ),
});
