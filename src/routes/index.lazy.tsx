import { NavbarStaff } from "@/components/navbar";
import { TripsTable } from "@/components/tripsTable";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
  errorComponent: () => <Navigate search={{}} to={"/login"} />,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw new Error("User not logged in");
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
