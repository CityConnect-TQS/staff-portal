import { NavbarStaff } from "@/components/navbar";
import { TripsTable } from "@/components/tripsTable";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }
  },
});

function Index() {
  return (
    <div className="flex flex-col gap-16 p-2">
      <NavbarStaff />
      <div className="px-16">
        <TripsTable />
      </div>
    </div>
  );
}
