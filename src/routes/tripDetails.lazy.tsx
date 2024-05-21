import { NavbarStaff } from "@/components/navbar";
import { TripDetailsBoard } from "@/components/tripDetails";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/tripDetails")({
  component: TripDetails,
  errorComponent: () => <Navigate search={{}} to={"/login"} />,
  beforeLoad: ({ context }) => {
    if (!context.user) {
      throw new Error("User not logged in");
    }
  },
});

function TripDetails() {
  return (
    <div className="flex flex-col gap-16 p-2">
      <NavbarStaff />
      <div>
        <TripDetailsBoard />
      </div>
    </div>
  );
}
