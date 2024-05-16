import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { User } from "@/types/user.ts";

interface AuthContext {
  user: User;
}

export const Route = createRootRouteWithContext<AuthContext>()({
  component: () => <Outlet />,
});
