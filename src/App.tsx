import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";

const queryClient = new QueryClient();

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <div>
          <p>Hello World</p>
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
