import { headers } from "next/headers";
import CalculatorPage from "./calculator-page";
import {
  HOME_DESCRIPTION,
  HOME_OPEN_GRAPH_DESCRIPTION,
  HOME_OPEN_GRAPH_TITLE,
  HOME_TITLE,
  metadataForPage,
} from "./site-config";

export async function generateMetadata() {
  const requestHeaders = await headers();

  return metadataForPage({
    host: requestHeaders.get("host"),
    path: "/",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    openGraphTitle: HOME_OPEN_GRAPH_TITLE,
    openGraphDescription: HOME_OPEN_GRAPH_DESCRIPTION,
  });
}

export default function HomePage() {
  return <CalculatorPage />;
}
