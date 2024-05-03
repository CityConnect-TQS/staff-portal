import { NavbarStaff } from "@/components/navbar";
import { TripsTable } from "@/components/tripsTable";
import { createLazyFileRoute } from "@tanstack/react-router";

export const Route = createLazyFileRoute("/")({
  component: Index,
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