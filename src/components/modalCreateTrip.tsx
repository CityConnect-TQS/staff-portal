import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Autocomplete, AutocompleteItem} from "@nextui-org/react";

export function ModalCreateTrip() {
  const {isOpen, onOpen, onClose} = useDisclosure();

  const citys = [
    {id: 1, name: 'Aveiro'},
    {id: 2, name: 'Beja'},
    {id: 3, name: 'Braga'},
    {id: 4, name: 'Bragança'},
    {id: 5, name: 'Castelo Branco'},
    {id: 6, name: 'Coimbra'},
    {id: 7, name: 'Évora'},
    {id: 8, name: 'Faro'},
    {id: 9, name: 'Guarda'}
  ];


  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button color="default" variant="bordered" onClick={onOpen}>
            Add Trip
        </Button>
      </div>
      <Modal backdrop={'blur'} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Create Trip</ModalHeader>
              <ModalBody>
                <Autocomplete
                    isRequired
                    label="Favorite Animal"
                    defaultItems={citys}
                    placeholder="Search an animal"
                    defaultSelectedKey="cat"
                    className="max-w-xs"
                    >
                    {(item) => <AutocompleteItem key={item.id}>{item.name}</AutocompleteItem>}
                </Autocomplete>
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  type="password"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
