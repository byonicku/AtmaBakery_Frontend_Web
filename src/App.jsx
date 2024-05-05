import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "@/page/Routes/AppRoutes";

const queryClient = new QueryClient();

export default function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Toaster position="top-center" richColors duration="3000" />
        <main>{AppRoutes()}</main>
      </QueryClientProvider>
    </>
  );
}
