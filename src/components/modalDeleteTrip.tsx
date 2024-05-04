import { deleteTrip } from "@/services/tripService";
import { TripDataTable } from "@/types/trip";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useQueryClient } from "@tanstack/react-query";
import { MaterialSymbol } from "react-material-symbols";

export function ModalDeleteTrip({ trip }: { trip: TripDataTable }) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const queryClient = useQueryClient();

  const handleDelete = () => {

    deleteTrip(trip.id).then(async () => {
        queryClient.setQueryData(['alerts'], {message: "Trip deleted successfully", type: "success", active: true});
        await queryClient.invalidateQueries({queryKey: ['trips']});
        onOpenChange();
    }).catch(err => {
        queryClient.setQueryData(['alerts'], {message: "An error occurred while deleting the trip", type: "warning", active: true});
        console.error(err);
    });

    setTimeout(() => {
        queryClient.setQueryData(['alerts'], {message: "", type: "", active: false});
    }
    , 3000);
  }

  return (
    <>
      <MaterialSymbol icon="delete" size={20} color="danger" variant="light" onClick={onOpen} />
      <Modal 
        backdrop="opaque" 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        classNames={{
          backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Trip {trip.departure} - {trip.arrival}</ModalHeader>
              <ModalBody>
                <p> 
                    Are you sure you want to delete the trip from {trip.departure} on {trip.departureDate.toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric"})} to {trip.arrival} on {trip.arrivalDate.toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric"})}?
                </p>

              </ModalBody>
              <ModalFooter>
                <Button color="default" onPress={onClose}>
                  Close
                </Button>   
                <Button color="danger" onPress={handleDelete}>
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
