import { deleteTrip } from "@/services/tripService";
import { Trip } from "@/types/trip";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { MaterialSymbol } from "react-material-symbols";
import { User } from "@/types/user.ts";
import { useCookies } from "react-cookie";

export function ModalDeleteTrip({ trip }: { trip: Trip }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [cookies] = useCookies(["user"]);
  const user = cookies.user as User;

  const queryClient = useQueryClient();

  const handleDelete = () => {
    deleteTrip(trip.id, user.token)
      .then(async () => {
        queryClient.setQueryData(["alerts"], {
          message: "Trip deleted successfully",
          type: "success",
          active: true,
        });
        await queryClient.invalidateQueries({ queryKey: ["trips"] });
        onOpenChange();
      })
      .catch((err) => {
        queryClient.setQueryData(["alerts"], {
          message: "An error occurred while deleting the trip",
          type: "warning",
          active: true,
        });
        console.error(err);
      });

    setTimeout(() => {
      queryClient.setQueryData(["alerts"], {
        message: "",
        type: "",
        active: false,
      });
    }, 3000);
  };

  return (
    <>
      <MaterialSymbol
        icon="delete"
        size={20}
        color="danger"
        variant="light"
        onClick={onOpen}
        id={`deleteTrip-${trip.id}`}
      />
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader
                className="flex flex-col gap-1"
                id="modalDeleteTripTitle"
              >
                Delete Trip {trip.departure.name} - {trip.arrival.name}
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete the trip from{" "}
                  {trip.departure.name} on{" "}
                  {trip.departureTime.toLocaleString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}{" "}
                  to {trip.arrival.name} on{" "}
                  {trip.arrivalTime.toLocaleString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                  })}
                  ?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Close
                </Button>
                <Button color="danger" onClick={handleDelete} id="deleteBtn">
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
