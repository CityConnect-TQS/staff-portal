import { deleteBus } from "@/services/busService";
import { Bus } from "@/types/bus";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Chip} from "@nextui-org/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MaterialSymbol } from "react-material-symbols";
import { Alert } from "./tripsTable";

export function ModalDeleteBus({ bus }: { bus: Bus }) {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const queryClient = useQueryClient();

  const {data: alerts} = useQuery<Alert, Error>({ 
    queryKey: ['alerts']
  });

  const handleDelete = () => {

    deleteBus(bus.id).then(async (res) => {
        if (res) {
            queryClient.setQueryData(['alerts'], {message: "Bus deleted successfully", type: "success", active: true});
            await queryClient.invalidateQueries({queryKey: ['buses']});
            onOpenChange();
        } else {
            queryClient.setQueryData(['alerts'], {message: "An error occurred while deleting the bus. It's currently in use on a trip.", type: "warning", active: true});
        }
    
    }).catch(err => {
        queryClient.setQueryData(['alerts'], {message: "An error occurred while deleting the bus", type: "warning", active: true});
        console.error(err);
    });

    setTimeout(() => {
        queryClient.setQueryData(['alerts'], {message: "", type: "", active: false});
    }
    , 3000);
  }

  return (
    <>
        <Button  endContent onClick={onOpen} color="danger" variant="light"><MaterialSymbol icon="delete" size={20}/></Button>
      
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
              <ModalHeader className="flex flex-col gap-1">Delete Bus {bus.id} - {bus.company}</ModalHeader>
              {alerts?.active && ( 
                <Chip color={alerts.type} variant="flat" radius="sm" size="sm" className="mx-4">
                    {alerts.message}
                </Chip>
              )}
              <ModalBody>
                <p> 
                    Are you sure you want to delete the bus {bus.id} on {bus.company}?
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
