import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "@fontsource-variable/dm-sans";
import "./index.css";
import "react-material-symbols/rounded";
import { NextUIProvider } from "@nextui-org/react";
import { CookiesProvider, useCookies } from "react-cookie";
import { User } from "@/types/user.ts";

const queryClient = new QueryClient();

const router = createRouter({
  routeTree,
  context: {
    user: undefined!,
  },
  basepath: "/staff",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export function App() {
  const [cookies] = useCookies(["user"]);
  const user = cookies.user as User;

  return <RouterProvider router={router} context={{ user }} />;
}

const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <NextUIProvider>
        <ThemeProvider>
          <CookiesProvider>
            <QueryClientProvider client={queryClient}>
              <App />
            </QueryClientProvider>
          </CookiesProvider>
        </ThemeProvider>
      </NextUIProvider>
    </StrictMode>,
  );
}
