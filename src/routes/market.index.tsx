import { createFileRoute } from "@tanstack/react-router";
import { Hub } from "@/components/district/Hub";
import { pageHead } from "@/lib/metadata";

export const Route = createFileRoute("/market/")({
  ssr: false,
  head: () =>
    pageHead(
      "The District — City Hub",
      "Explore your city, premium venues and lifestyle destinations in Soul Life."
    ),
  component: Hub,
});
