import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import CartProvider from "../context/CartProvider";

interface ProvidersProps {
  children: ReactNode;
}

// The QueryClient is the "librarian's memory". We create it ONCE, outside the
// component, so the whole app shares the same memory.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // trust a copy for 1 minute before calling it "old"
      retry: 1, // if a request fails, try one more time, then show the error
    },
  },
});

export default function Providers({ children }: ProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Server state is handled above. The cart is client state, so it gets its own provider. */}
      <CartProvider>{children}</CartProvider>
      {/* A debug panel for developers. It is left out of the production build automatically. */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}