import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { useForm } from '@tanstack/react-form'
import { MaterialSymbol } from "react-material-symbols";
import { useQueryClient } from "@tanstack/react-query";
import { BusCreate } from "@/types/bus";
import { createBus } from "@/services/busService";

export function ModalCreateBus({company}: {company: string}) {
  const {isOpen, onOpen, onClose} = useDisclosure();

  const queryClient = useQueryClient();


  const { Field, handleSubmit } = useForm<BusCreate>({
    defaultValues: {
        company: company,
        capacity: 0,
    },
   onSubmit: async ({ value }) => {

    const bus: BusCreate = {
        company: value.company,
        capacity: value.capacity,
    };

    const busCreated = await createBus(bus).catch((error) => {
        console.error('Error:', error);
        return;
      });
 
     if (!busCreated) {
       return;
     }
 
     await queryClient.invalidateQueries({queryKey: ['buses']});
 
     onClose();

  },
  validators: {
    onSubmit: (value) => {
        if (value.value.company === "") {
            return "The company name is required.";
        }
        if (value.value.capacity < 1) {
            return "The capacity must be greater than 0.";
        }
    },
  },
  });

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button color="primary" variant={company? "flat" : "solid"} onClick={onOpen} size="sm" endContent={<MaterialSymbol icon="add" size={20}/>}>
            {company? "" : "Add New"}
        </Button>
      </div>
      <Modal backdrop={'blur'} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Trip</ModalHeader>
              <ModalBody>
              <form className="flex flex-col gap-4">
                <Field
                  name="company"
                  validators={{
                    onChange: (value) => value.value === "" ? 'Please insert a company' : undefined,
                  }}
                >
                  {({ state, handleChange, handleBlur }) => (
                    <Input
                      label="Company"
                      placeholder="Company Name"
                      className="w-full"
                      isRequired
                      defaultValue={state.value}
                      onChange={(e) => handleChange(e.target.value)}
                      onBlur={handleBlur}
                      variant="underlined"
                      isDisabled={company !== ""}
                      isInvalid={state.meta.errors.length > 0}
                      errorMessage={state.meta.errors}
                    />
                  )}
                </Field>
                <Field
                  name="capacity"
                  validators={{
                    onChange: (value) => value.value < 1 || value.value === undefined ? 'The capacity value must be greater than 0.' : undefined,
                  }}
                  >
                  {({ state, handleChange, handleBlur }) => (
                    <Input
                      type="number"
                      label="Capacity"
                      placeholder="0"
                      className="w-full"
                      isRequired
                      defaultValue={state.value? state.value.toString() : "0"}
                      onChange={(e) => handleChange(Number.parseInt(e.target.value))}
                      onBlur={handleBlur}
                      variant="underlined"
                      isInvalid={state.meta.errors.length > 0}
                      errorMessage={state.meta.errors}
                    />
                  )}
                </Field>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" onPress={() => { void handleSubmit() }}>
                  Save
                </Button>
                <Button color="warning" onPress={onClose}>
                  Cancel
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
