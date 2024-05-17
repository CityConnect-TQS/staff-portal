import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
  Autocomplete,
  AutocompleteItem,
  DatePicker,
} from "@nextui-org/react";
import { useForm } from "@tanstack/react-form";
import { ZonedDateTime, now, getLocalTimeZone } from "@internationalized/date";
import { TripCreate } from "@/types/trip";
import { createTrip } from "@/services/tripService";
import { getBuses } from "@/services/busService";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getCities } from "@/services/cityService";
import { City } from "@/types/city";
import { Bus } from "@/types/bus";
import { MaterialSymbol } from "react-material-symbols";
import { User } from "@/types/user.ts";
import { useCookies } from "react-cookie";

export function ModalCreateTrip() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cookies] = useCookies(["user"]);
  const user = cookies.user as User;

  const { data: cities } = useQuery<City[], Error>({
    queryKey: ["cities"],
    queryFn: () =>
      getCities().then((data) =>
        data.map((city) => ({ id: city.id, name: city.name }))
      ),
  });

  const { data: buses } = useQuery<Bus[], Error>({
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

  const { Field, handleSubmit, state } = useForm<TripCreate>({
    defaultValues: {
      departure: { id: 0 },
      departureTime: now(getLocalTimeZone()).toDate(),
      arrivalTime: now(getLocalTimeZone()).toDate(),
      arrival: { id: 0 },
      price: 0.0,
      bus: { id: 0 },
      status: "ONTIME",
    },
    onSubmit: async ({ value }) => {
      const departureCity = cities?.find(
        (city) => city.id == value.departure.id
      )
        ? cities?.find((city) => city.id == value.departure.id)
        : "";
      const arrivalCity = cities?.find((city) => city.id == value.arrival.id)
        ? cities?.find((city) => city.id == value.arrival.id)
        : "";
      const bus = buses?.find((bus) => bus.id == value.bus.id)
        ? buses?.find((bus) => bus.id == value.bus.id)
        : "";
      const departureTime =
        value.departureTime instanceof Date
          ? value.departureTime.toISOString().slice(0, 19)
          : "";
      const arrivalTime =
        value.arrivalTime instanceof Date
          ? value.arrivalTime.toISOString().slice(0, 19)
          : "";

      if (
        !departureCity ||
        !arrivalCity ||
        !bus ||
        !departureTime ||
        !arrivalTime
      ) {
        return;
      }
      const trip: TripCreate = {
        departure: departureCity,
        departureTime: departureTime,
        arrival: arrivalCity,
        arrivalTime: arrivalTime,
        price: value.price,
        bus: bus,
        status: "ONTIME",
      };

      const tripCreated = await createTrip(trip, user.token).catch((error) => {
        console.error("Error:", error);
        return;
      });

      if (!tripCreated) {
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ["trips"] });

      onClose();
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

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Button
          color="primary"
          onClick={onOpen}
          endContent={<MaterialSymbol icon="add" size={20} />}
        >
          Add New
        </Button>
      </div>
      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create Trip
              </ModalHeader>
              <ModalBody>
                <form className="flex flex-col gap-4">
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
                        id="filled-basic"
                        isRequired
                        label="Departure City"
                        defaultItems={cities}
                        defaultInputValue={
                          state.value
                            ? cities?.find((city) => city.id == state.value?.id)
                                ?.name
                            : ""
                        }
                        onSelectionChange={(selectedValue) => {
                          const selectedCity = cities?.find(
                            (city) => city.id == selectedValue
                          );
                          if (selectedCity) {
                            handleChange({ id: selectedCity.id });
                          }
                        }}
                        onBlur={handleBlur}
                        placeholder="Select departure city"
                        className="w-full"
                        variant="underlined"
                        isInvalid={state.meta.errors.length > 0}
                        errorMessage={state.meta.errors}
                      >
                        {(item) => (
                          <AutocompleteItem key={item.id} textValue={item.name}>
                            {item.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  </Field>
                  <Field name="departureTime">
                    {({ state, handleChange, handleBlur }) => (
                      <DatePicker
                        label="Departure Date and Time"
                        variant="underlined"
                        hideTimeZone
                        showMonthAndYearPickers
                        isRequired
                        defaultValue={
                          new ZonedDateTime(
                            "era",
                            state.value instanceof Date
                              ? state.value.getUTCFullYear()
                              : 0,
                            state.value instanceof Date
                              ? state.value.getUTCMonth()
                              : 0,
                            state.value instanceof Date
                              ? state.value.getUTCDay()
                              : 0,
                            "Europe/Lisbon",
                            -1,
                            state.value instanceof Date
                              ? state.value.getUTCHours()
                              : 0,
                            state.value instanceof Date
                              ? state.value.getUTCMinutes()
                              : 0,
                            state.value instanceof Date
                              ? state.value.getUTCSeconds()
                              : 0
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
                  <Field
                    name="arrival"
                    validators={{
                      onChange: (value) =>
                        value.value === undefined || value.value.id < 1
                          ? "Please select a arrival city from the list."
                          : undefined,
                    }}
                  >
                    {({ state, handleChange, handleBlur }) => (
                      <Autocomplete
                        isRequired
                        label="Arrival City"
                        defaultItems={cities}
                        defaultInputValue={
                          cities?.find((city) => city.id == state.value?.id)
                            ?.name
                        }
                        onSelectionChange={(selectedValue) => {
                          const selectedCity = cities?.find(
                            (city) => city.id == selectedValue
                          );
                          if (selectedCity) {
                            handleChange({ id: selectedCity.id });
                          }
                        }}
                        onBlur={handleBlur}
                        placeholder="Select Arrival city"
                        className="w-full"
                        variant="underlined"
                        isInvalid={state.meta.errors.length > 0}
                        errorMessage={state.meta.errors}
                      >
                        {(item) => (
                          <AutocompleteItem key={item.id} textValue={item.name}>
                            {item.name}
                          </AutocompleteItem>
                        )}
                      </Autocomplete>
                    )}
                  </Field>
                  <Field name="arrivalTime">
                    {({ state, handleChange, handleBlur }) => (
                      <DatePicker
                        label="Arrival Date and Time"
                        variant="underlined"
                        hideTimeZone
                        showMonthAndYearPickers
                        isRequired
                        defaultValue={
                          new ZonedDateTime(
                            "era",
                            state.value instanceof Date
                              ? state.value.getUTCFullYear()
                              : 0,
                            state.value instanceof Date
                              ? state.value.getUTCMonth()
                              : 0,
                            state.value instanceof Date
                              ? state.value.getUTCDay()
                              : 0,
                            "Europe/Lisbon",
                            -1,
                            state.value instanceof Date
                              ? state.value.getUTCHours()
                              : 0,
                            state.value instanceof Date
                              ? state.value.getUTCMinutes()
                              : 0,
                            state.value instanceof Date
                              ? state.value.getUTCSeconds()
                              : 0
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
                        type="number"
                        label="Price"
                        placeholder="0.00"
                        className="w-full"
                        isRequired
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">
                              €
                            </span>
                          </div>
                        }
                        defaultValue={
                          state.value ? state.value.toString() : "0.00"
                        }
                        onChange={(e) =>
                          handleChange(Number.parseInt(e.target.value))
                        }
                        onBlur={handleBlur}
                        variant="underlined"
                        isInvalid={state.meta.errors.length > 0}
                        errorMessage={state.meta.errors}
                      />
                    )}
                  </Field>
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
                        isRequired
                        label="Bus"
                        defaultItems={buses}
                        defaultInputValue={
                          state.value &&
                          buses?.find((bus) => bus.id == state.value.id) !==
                            undefined
                            ? buses.find((bus) => bus.id == state.value.id)
                                ?.id +
                              " (" +
                              buses.find((bus) => bus.id == state.value.id)
                                ?.company +
                              " - " +
                              buses.find((bus) => bus.id == state.value.id)
                                ?.capacity +
                              " seats)"
                            : ""
                        }
                        onSelectionChange={(selectedValue) => {
                          const selectedBus = buses?.find(
                            (bus) => bus.id == selectedValue
                          );
                          if (selectedBus) {
                            handleChange({ id: selectedBus.id });
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
                  {state.errors && (
                    <span className="text-red-500">{state.errors}</span>
                  )}
                </form>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => {
                    void handleSubmit();
                  }}
                >
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
