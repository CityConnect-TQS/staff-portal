import { NavbarStaff } from "@/components/navbar";
import { TripDetailsBoard } from "@/components/tripDetails";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/tripDetails")({
  component: TripDetails,
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
