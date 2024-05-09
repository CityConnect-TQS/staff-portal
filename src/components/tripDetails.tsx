import { getBuses } from "@/services/busService"
import { getCities } from "@/services/cityService"
import { useForm } from "@tanstack/react-form";
import { ZonedDateTime, now, getLocalTimeZone } from '@internationalized/date';
import { Autocomplete, AutocompleteItem, Button, DatePicker, Input } from "@nextui-org/react";
import { City } from "@/types/city";
import { Bus } from "@/types/bus";
import { useQuery } from "@tanstack/react-query";
import { SelectedTripCookies, TripCreate } from "@/types/trip";
import { useState } from "react";
import { useCookies } from "react-cookie";


export function TripDetailsBoard() {

  const { data: cities, isLoading: isLoadingCities} = useQuery<City[], Error>({
    queryKey: ['cities'], 
    queryFn: async () => await getCities().then((data) => data.map((city) => ({id: city.id, name: city.name}))),
   });


  const { data: buses, isLoading: isLoadingBuses } = useQuery<Bus[], Error>({
    queryKey: ['buses'], 
    queryFn: () => getBuses().then((data) => data.map((bus) => ({id: bus.id, company: bus.company, capacity: bus.capacity}))),
  });


  const [cookies] = useCookies(['selectedTrip']);

  const selectedTrip = cookies.selectedTrip as SelectedTripCookies;

  const [onEdit, setOnEdit] = useState(selectedTrip.edit);

  const { Field, handleSubmit, state } = useForm<TripCreate>({
    defaultValues: {
        departure: {id: 0},
        departureTime: now(getLocalTimeZone()).toDate(),
        arrivalTime: now(getLocalTimeZone()).toDate(),
        arrival: {id: 0},
        price: 0.00,
        bus: {id: 0}
    },
    onSubmit: ({ value }) => {
        console.log(value);
        console.log(state)
    },
  });  

  if (isLoadingCities || isLoadingBuses) {
    return <div>Loading...</div>;
  }


  return (
    <div className="mx-16">
      <div className="flex flex-row gap-4 mt-8 justify-end">
        { onEdit &&         
          <Button color="primary" onPress={() => {() => handleSubmit() }}>
            Save
          </Button>
        }
        { !onEdit &&
          <Button color="primary" onPress={() => { setOnEdit(true) }}>
            Edit
          </Button>
        }
      </div>
      <form>
        <div className="flex flex-col mt-8">
        <p className="font-medium text-2xl my-4">Trip Details</p>
         <div className="flex flex-row justify-center gap-8">
            <Field
                name="departure"
                validators={{
                    onChange: (value) => value.value === undefined || value.value.id < 1 ? 'Please select a departure city from the list.' : undefined,
                }}
                
                >
                {({ state, handleChange, handleBlur }) => (
                    <Autocomplete
                      isDisabled={!onEdit}
                      id="filled-basic"
                      isRequired
                      label="Departure City"
                      size="lg"
                      defaultItems={cities}
                      defaultInputValue= {selectedTrip.trip.departure}
                      onSelectionChange={(selectedValue) => {
                      const selectedcities = cities?.find(cities => cities.id == selectedValue);
                      if (selectedcities) {
                          handleChange({id: selectedcities.id});
                      }
                      }}
                      onBlur={handleBlur}
                      placeholder="Select departure cities"
                      className="w-full"
                      variant="underlined"
                      isInvalid={state.meta.errors.length > 0}
                      errorMessage={state.meta.errors}
                    >
                      {(item) => <AutocompleteItem key={item.id} textValue={item.name}>{item.name}</AutocompleteItem>}
                    </Autocomplete>
                )}
            </Field>
            <Field
              name="arrival"
              validators={{
                onChange: (value) => value.value === undefined || value.value.id < 1 ? 'Please select a arrival cities from the list.' : undefined,
              }}
            >
              {({ state, handleChange, handleBlur }) => (
                <Autocomplete
                  isDisabled={!onEdit}
                  isRequired
                  label="Arrival cities"
                  size="lg"
                  defaultItems={cities}
                  defaultInputValue= {selectedTrip.trip.arrival}
                  onSelectionChange={(selectedValue) => {
                    const selectedcities = cities?.find(cities => cities.id == selectedValue);
                    if (selectedcities) {
                      handleChange({id: selectedcities.id});
                    }
                  }}
                  onBlur={handleBlur}
                  placeholder="Select Arrival cities"
                  className="w-full"
                  variant="underlined"
                  isInvalid={state.meta.errors.length > 0}
                  errorMessage={state.meta.errors}
                >
                  {(item) => <AutocompleteItem key={item.id} textValue={item.name}>{item.name}</AutocompleteItem>}
                </Autocomplete>
              )}
            </Field>
            </div>
            <div className="flex flex-row gap-8">
            <Field
              name="departureTime"
              >
              {({ state, handleChange, handleBlur }) => (
                <DatePicker
                  isDisabled={!onEdit}
                  label="Departure Date and Time"
                  variant="underlined"
                  size="lg"
                  hideTimeZone
                  showMonthAndYearPickers
                  isRequired
                  defaultValue={new ZonedDateTime(
                    'era',
                    new Date(selectedTrip.trip.departureDate).getUTCFullYear(),
                    new Date(selectedTrip.trip.departureDate).getUTCMonth(),
                    new Date(selectedTrip.trip.departureDate).getUTCDay(),
                    'Europe/Lisbon',
                    -1, 
                    new Date(selectedTrip.trip.departureDate).getUTCHours(),
                    new Date(selectedTrip.trip.departureDate).getUTCMinutes(),
                    new Date(selectedTrip.trip.departureDate).getUTCSeconds()
                  )}
                  onChange={(value: ZonedDateTime) => {
                    handleChange(value.toDate());
                  }}
                  onBlur={handleBlur}
                  isInvalid={state.meta.errors.length > 0}
                  errorMessage={state.meta.errors}
                />
              )}
            </Field>
            <Field
              name="arrivalTime"
              >
              {({ state, handleChange, handleBlur }) => (
                <DatePicker
                isDisabled={!onEdit}
                label="Arrival Date and Time"
                variant="underlined"
                size="lg"
                hideTimeZone
                showMonthAndYearPickers
                isRequired
                defaultValue={new ZonedDateTime(
                  'era',
                  new Date(selectedTrip.trip.arrivalDate).getUTCFullYear(),
                  new Date(selectedTrip.trip.arrivalDate).getUTCMonth(),
                  new Date(selectedTrip.trip.arrivalDate).getUTCDay(),
                  'Europe/Lisbon',
                  -1, 
                  new Date(selectedTrip.trip.arrivalDate).getUTCHours(),
                  new Date(selectedTrip.trip.arrivalDate).getUTCMinutes(),
                  new Date(selectedTrip.trip.arrivalDate).getUTCSeconds()
                )}
                onChange={(value: ZonedDateTime) => {
                  handleChange(value.toDate());
                }}
                onBlur={handleBlur}
                calendarProps={{className: "bg-transparent"}}
                isInvalid={state.meta.errors.length > 0}
                errorMessage={state.meta.errors}
                />
              )}
            </Field>
          </div>
          <Field
            name="price"
            validators={{
              onChange: (value) => value.value < 1 || value.value === undefined ? 'The price value must be greater than 0.' : undefined,
            }}
            >
            {({ state, handleChange, handleBlur }) => (
              <Input
                isDisabled={!onEdit}
                type="number"
                label="Price"
                placeholder="0.00"
                className="w-full"
                size="lg"
                isRequired
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">€</span>
                  </div>
                }
                defaultValue={selectedTrip.trip.price.toString()}
                onChange={(e) => handleChange(Number.parseInt(e.target.value))}
                onBlur={handleBlur}
                variant="underlined"
                isInvalid={state.meta.errors.length > 0}
                errorMessage={state.meta.errors}
              />
            )}
            </Field>
          </div>
          <div className="flex flex-col mt-8">
            <p className="font-medium text-2xl my-4">Bus Information</p>
            <div className="flex flex-row gap-8">
              <Field
              name="bus"
              validators={{
                onSubmit: (value) => value.value === undefined || value.value.id < 1 ? 'Please select a bus from the list.' : undefined,
              }}
              >
              {({ state, handleChange, handleBlur }) => (
                <Autocomplete
                isDisabled={!onEdit}
                isRequired
                label="Bus ID"
                size="lg"
                defaultItems={buses}
                defaultInputValue={`${selectedTrip.trip.bus} - ${selectedTrip.trip.busCapacity} Seats`}
                onSelectionChange={(selectedValue) => {
                  const selectedbuses = buses?.find(buses => buses.id == selectedValue);
                  if (selectedbuses) {
                    handleChange({id: selectedbuses.id});
                  }
                }}
                onBlur={handleBlur}
                placeholder="Select the bus"
                className="w-full"
                variant="underlined"
                isInvalid={state.meta.errors.length > 0}
                errorMessage={state.meta.errors}
              >
                {(item) => <AutocompleteItem key={item.id} textValue={`${item.id} (${item.company} - ${item.capacity} seats)`}>{item.id} ({item.company} - {item.capacity} seats) </AutocompleteItem>}
              </Autocomplete>
              )}
              </Field>
            </div>
          </div>
          {state.errors && <span className="text-red-500">{state.errors}</span>}
      </form>
      <div className="flex mt-8">
        <p className="font-medium text-2xl my-4">Reservations</p>
      </div>
    </div>
  )

} 