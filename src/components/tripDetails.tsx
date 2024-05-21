import { getBuses } from "@/services/busService";
import { getCities } from "@/services/cityService";
import { useForm } from "@tanstack/react-form";
import { ZonedDateTime } from "@internationalized/date";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Input,
} from "@nextui-org/react";
import { City } from "@/types/city";
import { Bus } from "@/types/bus";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SelectedTripCookies, Trip, TripCreate } from "@/types/trip";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { updateTrip } from "@/services/tripService";
import { MaterialSymbol } from "react-material-symbols";
import { User } from "@/types/user.ts";

export function TripDetailsBoard() {
  const [cookies, setCookies] = useCookies(["user", "selectedTrip"]);
  const user = cookies.user as User;

  const { data: cities, isLoading: isLoadingCities } = useQuery<City[], Error>({
    queryKey: ["cities"],
    queryFn: async () =>
      await getCities().then((data) =>
        data.map((city) => ({ id: city.id, name: city.name }))
      ),
  });

  const { data: buses, isLoading: isLoadingBuses } = useQuery<Bus[], Error>({
    queryKey: ["buses"],
    queryFn: () =>
      getBuses().then((data) =>
        data.map((bus) => ({
          id: bus.id,
          company: bus.company,
          capacity: bus.capacity,
        }))
      ),
  });

  const queryClient = useQueryClient();

  const selectedTrip = cookies.selectedTrip as SelectedTripCookies;

  const [onEdit, setOnEdit] = useState(selectedTrip.edit);

  const { Field, handleSubmit, state } = useForm<TripCreate>({
    defaultValues: {
      departure: {
        id:
          cities?.find((city) => city.name === selectedTrip.trip.departure.name)
            ?.id ?? 0,
      },
      departureTime: selectedTrip.trip.departureTime,
      arrivalTime: selectedTrip.trip.arrivalTime,
      arrival: {
        id:
          cities?.find((city) => city.name === selectedTrip.trip.arrival.name)
            ?.id ?? 0,
      },
      price: selectedTrip.trip.price,
      bus: {
        id:
          buses?.find((bus) => bus.company === selectedTrip.trip.bus.company)
            ?.id ?? 0,
      },
      status: selectedTrip.trip.status,
    },
    onSubmit: async ({ value }) => {
      const departureCity = cities?.find(
        (city) => city.id == value.departure.id
      );
      const arrivalCity = cities?.find((city) => city.id == value.arrival.id);
      const bus = buses?.find((bus) => bus.id == value.bus.id);
      const departureTime = new Date(value.departureTime)
        .toISOString()
        .slice(0, 19);
      const arrivalTime = new Date(value.arrivalTime)
        .toISOString()
        .slice(0, 19);
      const price = value.price;

      if (
        !departureCity ||
        !arrivalCity ||
        !bus ||
        !departureTime ||
        !arrivalTime
      ) {
        console.error("Error: Invalid data");
        return;
      }
      const trip: TripCreate = {
        departure: departureCity,
        departureTime: departureTime,
        arrival: arrivalCity,
        arrivalTime: arrivalTime,
        price: price,
        bus: bus,
        status: selectedTrip.trip.status,
      };
      const tripCreated = await updateTrip(
        selectedTrip.trip.id,
        trip,
        user.token
      ).catch((error) => {
        console.error("Error:", error);
        return;
      });

      if (!tripCreated) {
        return;
      }

      const tripUpdated: Trip = {
        id: tripCreated.id,
        departure: tripCreated.departure,
        departureTime: new Date(tripCreated.departureTime),
        arrival: tripCreated.arrival,
        arrivalTime: new Date(tripCreated.arrivalTime),
        price: tripCreated.price,
        bus: tripCreated.bus,
        freeSeats: selectedTrip.trip.freeSeats,
        status: selectedTrip.trip.status,
      };

      setCookies(
        "selectedTrip",
        JSON.stringify({ trip: tripUpdated, edit: false })
      );
      setOnEdit(false);

      await queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
    validators: {
      onSubmit: (value) => {
        if (value.value.departureTime >= value.value.arrivalTime) {
          return "The departure date and time must be less than the arrival date and time.";
        }
        if (value.value.departure.id === value.value.arrival.id) {
          return "The departure city must be different from the arrival city.";
        }
        if (
          value.value.departureTime.toString() ===
          value.value.arrivalTime.toString()
        ) {
          return "The departure date and time must be different from the arrival date and time.";
        }
        if (
          value.value.departureTime < new Date() ||
          value.value.arrivalTime < new Date()
        ) {
          return "The departure or arrival date and time must be greater than the current date and time.";
        }
      },
    },
  });

  if (isLoadingCities || isLoadingBuses) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mx-16">
      <div className="flex flex-row gap-4 justify-end">
        {onEdit && (
          <Button
            color="primary"
            onClick={() => {
              void handleSubmit();
            }}
            id="saveTripBtn"
            variant="flat"
          >
            <MaterialSymbol icon="save" size={20} /> Save
          </Button>
        )}
        {!onEdit && (
          <Button
            color="secondary"
            onClick={() => {
              setOnEdit(true);
            }}
            variant="flat"
            id="editTripBtn"
          >
            <MaterialSymbol icon="edit" size={20} />
            Edit
          </Button>
        )}
      </div>
      <form>
        <div className="flex flex-col">
          <p className="font-medium text-2xl my-4">Trip Details</p>
          {state.errors && (
            <span className="text-red-500" id="errorMessageSpan">
              {state.errors}
            </span>
          )}

          <div className="flex flex-row justify-center gap-8">
            <Field
              name="departure"
              validators={{
                onChange: (value) =>
                  value.value === undefined || value.value.id < 1
                    ? "Please select a departure city from the list."
                    : undefined,
              }}
            >
              {({ state, handleChange, handleBlur }) => (
                <Autocomplete
                  isDisabled={!onEdit}
                  id="departureCity"
                  isRequired
                  label="Departure City"
                  size="lg"
                  itemID=""
                  defaultItems={cities}
                  defaultInputValue={selectedTrip.trip.departure.name}
                  onSelectionChange={(selectedValue) => {
                    const selectedcities = cities?.find(
                      (cities) => cities.id == selectedValue
                    );
                    if (selectedcities) {
                      handleChange({ id: selectedcities.id });
                    }
                  }}
                  onBlur={handleBlur}
                  placeholder="Select departure cities"
                  className="w-full"
                  variant="underlined"
                  isInvalid={state.meta.errors.length > 0}
                  errorMessage={state.meta.errors}
                >
                  {(item) => (
                    <AutocompleteItem
                      key={item.id}
                      textValue={item.name}
                      id={`departure${item.name}`}
                    >
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            </Field>
            <Field
              name="arrival"
              validators={{
                onChange: (value) =>
                  value.value === undefined || value.value.id < 1
                    ? "Please select a arrival cities from the list."
                    : undefined,
              }}
            >
              {({ state, handleChange, handleBlur }) => (
                <Autocomplete
                  isDisabled={!onEdit}
                  isRequired
                  id="arrivalCity"
                  label="Arrival cities"
                  size="lg"
                  defaultItems={cities}
                  defaultInputValue={selectedTrip.trip.arrival.name}
                  onSelectionChange={(selectedValue) => {
                    const selectedcities = cities?.find(
                      (cities) => cities.id == selectedValue
                    );
                    if (selectedcities) {
                      handleChange({ id: selectedcities.id });
                    }
                  }}
                  onBlur={handleBlur}
                  placeholder="Select Arrival cities"
                  className="w-full"
                  variant="underlined"
                  isInvalid={state.meta.errors.length > 0}
                  errorMessage={state.meta.errors}
                >
                  {(item) => (
                    <AutocompleteItem
                      key={item.id}
                      textValue={item.name}
                      id={`arrival${item.name}`}
                    >
                      {item.name}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            </Field>
          </div>
          <div className="flex flex-row gap-8">
            <Field name="departureTime">
              {({ state, handleChange, handleBlur }) => (
                <DatePicker
                  isDisabled={!onEdit}
                  label="Departure Date and Time"
                  variant="underlined"
                  size="lg"
                  hideTimeZone
                  showMonthAndYearPickers
                  isRequired
                  defaultValue={
                    new ZonedDateTime(
                      "era",
                      new Date(
                        selectedTrip.trip.departureTime
                      ).getUTCFullYear(),
                      new Date(selectedTrip.trip.departureTime).getUTCMonth() +
                        1,
                      new Date(selectedTrip.trip.departureTime).getUTCDate(),
                      "Europe/Lisbon",
                      -1,
                      new Date(selectedTrip.trip.departureTime).getUTCHours(),
                      new Date(selectedTrip.trip.departureTime).getUTCMinutes(),
                      new Date(selectedTrip.trip.departureTime).getUTCSeconds()
                    )
                  }
                  onChange={(value: ZonedDateTime) => {
                    handleChange(value.toDate());
                  }}
                  onBlur={handleBlur}
                  isInvalid={state.meta.errors.length > 0}
                  errorMessage={state.meta.errors}
                />
              )}
            </Field>
            <Field name="arrivalTime">
              {({ state, handleChange, handleBlur }) => (
                <DatePicker
                  isDisabled={!onEdit}
                  label="Arrival Date and Time"
                  variant="underlined"
                  size="lg"
                  hideTimeZone
                  showMonthAndYearPickers
                  isRequired
                  defaultValue={
                    new ZonedDateTime(
                      "era",
                      new Date(selectedTrip.trip.arrivalTime).getUTCFullYear(),
                      new Date(selectedTrip.trip.arrivalTime).getUTCMonth() + 1,
                      new Date(selectedTrip.trip.arrivalTime).getUTCDate(),
                      "Europe/Lisbon",
                      -1,
                      new Date(selectedTrip.trip.arrivalTime).getUTCHours(),
                      new Date(selectedTrip.trip.arrivalTime).getUTCMinutes(),
                      new Date(selectedTrip.trip.arrivalTime).getUTCSeconds()
                    )
                  }
                  onChange={(value: ZonedDateTime) => {
                    handleChange(value.toDate());
                  }}
                  onBlur={handleBlur}
                  calendarProps={{ className: "bg-transparent" }}
                  isInvalid={state.meta.errors.length > 0}
                  errorMessage={state.meta.errors}
                />
              )}
            </Field>
          </div>
          <Field
            name="price"
            validators={{
              onChange: (value) =>
                value.value < 1 || value.value === undefined
                  ? "The price value must be greater than 0."
                  : undefined,
            }}
          >
            {({ state, handleChange, handleBlur }) => (
              <Input
                isDisabled={!onEdit}
                type="number"
                label="Price"
                id="priceInput"
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
                onSubmit: (value) =>
                  value.value === undefined || value.value.id < 1
                    ? "Please select a bus from the list."
                    : undefined,
              }}
            >
              {({ state, handleChange, handleBlur }) => (
                <Autocomplete
                  isDisabled={!onEdit}
                  isRequired
                  label="Bus ID"
                  size="lg"
                  defaultItems={buses}
                  defaultInputValue={`${selectedTrip.trip.bus.company} - ${selectedTrip.trip.bus.capacity} Seats`}
                  onSelectionChange={(selectedValue) => {
                    const selectedbuses = buses?.find(
                      (buses) => buses.id == selectedValue
                    );
                    if (selectedbuses) {
                      handleChange({ id: selectedbuses.id });
                    }
                  }}
                  onBlur={handleBlur}
                  placeholder="Select the bus"
                  className="w-full"
                  variant="underlined"
                  isInvalid={state.meta.errors.length > 0}
                  errorMessage={state.meta.errors}
                >
                  {(item) => (
                    <AutocompleteItem
                      key={item.id}
                      textValue={`${item.id} (${item.company} - ${item.capacity} seats)`}
                    >
                      {item.id} ({item.company} - {item.capacity} seats){" "}
                    </AutocompleteItem>
                  )}
                </Autocomplete>
              )}
            </Field>
          </div>
        </div>
      </form>
      <div className="flex mt-8">
        <p className="font-medium text-2xl my-4">Reservations</p>
      </div>
    </div>
  );
}
