import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input} from "@nextui-org/react";
import { useForm } from '@tanstack/react-form'
import { MaterialSymbol } from "react-material-symbols";
import { useQueryClient } from "@tanstack/react-query";
import { Bus, BusCreate } from "@/types/bus";
import { createBus, updateBus } from "@/services/busService";
import { useCookies } from "react-cookie";
import { User } from "@/types/user";

export function ModalCreateBus({ company, edit, bus }: {company?: string, edit: boolean, bus?: Bus}) {
  const {isOpen, onOpen, onClose} = useDisclosure();

  const [cookies] = useCookies(["user"]);
  const user = cookies.user as User;

  const queryClient = useQueryClient();

  const { Field, handleSubmit } = useForm<BusCreate>({
    defaultValues: {
      company: edit ? (bus?.company?? "") : (company? company : ""),
      capacity: edit ? (bus?.capacity?? 0) : 0,
    },
   onSubmit: async ({ value }) => {

    console.log("value", value);

    const busNew: BusCreate = {
        company: value.company,
        capacity: value.capacity,
    };

    if (edit && bus) {
      const busUpdated = await updateBus(bus.id, busNew, user.token).catch((error) => {
        console.error('Error:', error);
        return;
      })

      if (!busUpdated) {
        return;
      }

    } else {
      const busCreated = await createBus(busNew, user.token).catch((error) => {
        console.error('Error:', error);
        return;
      });
 
     if (!busCreated) {
       return;
     }

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
        {edit ? <Button variant="light" endContent onClick={onOpen} color="primary" size="sm"><MaterialSymbol icon="edit" size={20}/></Button> : 
            <Button color="primary" variant={company? "flat" : "solid"} onClick={onOpen} size="sm" endContent={<MaterialSymbol icon="add" size={20}/>}>
              {company? "" : "Add New"}
            </Button>
        }

      </div>
      <Modal backdrop={'blur'} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{edit ? "Edit Trip" : "Create Trip" }</ModalHeader>
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
