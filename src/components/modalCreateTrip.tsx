import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input, Autocomplete, AutocompleteItem, DatePicker} from "@nextui-org/react";
import { useForm } from '@tanstack/react-form'
import { ZonedDateTime } from '@internationalized/date';
import { TripCreate } from "@/types/trip";

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

  const buses = [
    {id: 1, capacity: 10, company: 'Renex'},
    {id: 2, capacity: 20, company: 'FlixBus'},
    {id: 3, capacity: 30, company: 'Rede Expresso'},
    {id: 4, capacity: 40, company: 'Citi Express'},
    {id: 5, capacity: 50, company: 'FlixBus'},
    {id: 6, capacity: 60, company: 'Renex'},
    {id: 7, capacity: 70, company: 'Rede Expresso'},
    {id: 8, capacity: 80, company: 'Citi Express'},
  ];

   
  const { Field, handleSubmit, state } = useForm<TripCreate>({
   onSubmit: async ({ value }) => {
     console.log(value);
     console.log(state);
     if (value.departure.id === 0 || value.arrival.id === 0 || value.bus.id === 0 || value.price === 0
       || value.arrival === value.departure || value.departureTime >=  value.arrivalTime){
       return;
     }
     console.log(value);
     console.log(state);
     await Promise.resolve();
  },
  });

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
              <form className="flex flex-col gap-4">
                <Field
                  name="departure"
                  >
                  {({ state, handleChange, handleBlur }) => (
                      <Autocomplete
                        id="filled-basic"
                        isRequired
                        label="Departure City"
                        defaultItems={citys}
                        defaultInputValue= {state.value? citys.find(city => city.id == state.value?.id)?.name : "From"}
                        onSelectionChange={(selectedValue) => {
                          const selectedCity = citys.find(city => city.id == selectedValue);
                          if (selectedCity) {
                            handleChange({id: selectedCity.id});
                          }
                        }}
                        onBlur={handleBlur}
                        placeholder="Select departure city"
                        className="w-full"
                        variant="underlined"
                      >
                        {(item) => <AutocompleteItem key={item.id} textValue={item.name}>{item.name}</AutocompleteItem>}
                      </Autocomplete>
                  )}
                </Field>
                <Field
                  name="departureTime"
                  >
                  {({ state, handleChange, handleBlur }) => (
                    <DatePicker
                      label="Departure Date and Time"
                      variant="underlined"
                      hideTimeZone
                      showMonthAndYearPickers
                      defaultValue={state.value? new ZonedDateTime(
                        'era',
                        state.value?.getUTCFullYear(),
                        state.value?.getUTCMonth(),
                        state.value?.getUTCDay(),
                        'Europe/Lisbon',
                        -1, 
                        state.value?.getUTCHours(),
                        state.value?.getUTCMinutes(),
                        state.value?.getUTCSeconds()
                      ) : new ZonedDateTime( 'era', 2021, 1, 1, 'Europe/Lisbon', -1, 0, 0, 0)}
                      onChange={(value: ZonedDateTime) => {
                        handleChange(value.toDate());
                      }}
                      onBlur={handleBlur}
                      calendarProps={{className: "bg-transparent"}}
                    />
                  )}
                </Field>
                <Field
                  name="arrival"
                  >
                  {({ state, handleChange, handleBlur }) => (
                    <Autocomplete
                      isRequired
                      label="Arrival City"
                      defaultItems={citys}
                      defaultInputValue= {state.value? citys.find(city => city.id == state.value?.id)?.name : "To"}
                      onSelectionChange={(selectedValue) => {
                        const selectedCity = citys.find(city => city.id == selectedValue);
                        if (selectedCity) {
                          handleChange({id: selectedCity.id});
                        }
                      }}
                      onBlur={handleBlur}
                      placeholder="Select Arrival city"
                      className="w-full"
                      variant="underlined"
                    >
                      {(item) => <AutocompleteItem key={item.id} textValue={item.name}>{item.name}</AutocompleteItem>}
                    </Autocomplete>
                  )}
                </Field>
                <Field
                  name="arrivalTime"
                  >
                  {({ state, handleChange, handleBlur }) => (
                    <DatePicker
                    label="Arrival Date and Time"
                    variant="underlined"
                    hideTimeZone
                    showMonthAndYearPickers
                    defaultValue={state.value? new ZonedDateTime(
                      'era',
                      state.value?.getUTCFullYear(),
                      state.value?.getUTCMonth(),
                      state.value?.getUTCDay(),
                      'Europe/Lisbon',
                      -1, 
                      state.value?.getUTCHours(),
                      state.value?.getUTCMinutes(),
                      state.value?.getUTCSeconds()
                    ) : new ZonedDateTime( 'era', 2021, 1, 1, 'Europe/Lisbon', -1, 0, 0, 0)}
                    onChange={(value: ZonedDateTime) => {
                      handleChange(value.toDate());
                    }}
                    onBlur={handleBlur}
                    calendarProps={{className: "bg-transparent"}}
                    />
                  )}
                </Field>
                <Field
                  name="price"
                  >
                  {({ state, handleChange, handleBlur }) => (
                    <Input
                      type="number"
                      label="Price"
                      placeholder="0.00"
                      className="w-full"
                      isRequired
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">€</span>
                        </div>
                      }
                      defaultValue={state.value? state.value.toString() : "0.00"}
                      onChange={(e) => handleChange(Number.parseInt(e.target.value))}
                      onBlur={handleBlur}
                      variant="underlined"
                    />
                  )}
                </Field>
                <Field
                  name="bus"
                  >
                  {({ state, handleChange, handleBlur }) => (
                    <Autocomplete
                    isRequired
                    label="Bus"
                    defaultItems={buses}
                    defaultInputValue= {state.value? buses.find(bus => bus.id == state.value?.id)?.id + " (" + buses.find(bus => bus.id == state.value?.id)?.company + " - " + buses.find(bus => bus.id == state.value?.id)?.capacity + " seats)" : ""}
                    onSelectionChange={(selectedValue) => {
                      const selectedBus = buses.find(bus => bus.id == selectedValue);
                      if (selectedBus) {
                        console.log("changed bus");
                        console.log(selectedBus);
                        handleChange({id: selectedBus.id});
                      }
                    }}
                    onBlur={handleBlur}
                    placeholder="Select the bus"
                    className="w-full"
                    variant="underlined"
                  >
                    {(item) => <AutocompleteItem key={item.id} textValue={`${item.id} (${item.company} - ${item.capacity} seats)`}>{item.id} ({item.company} - {item.capacity} seats) </AutocompleteItem>}
                  </Autocomplete>
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