import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "@/page/Routes/AppRoutes";
import { RefreshProvider } from "./component/RefreshProvider";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <RefreshProvider>
          <Toaster position="top-center" richColors duration="3000" />
          <main>{AppRoutes()}</main>
        </RefreshProvider>
      </QueryClientProvider>
      <SpeedInsights />
      <Analytics />
    </>
  );
}
