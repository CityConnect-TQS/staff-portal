import { getTrips } from "@/services/tripService";
import { Trip } from "@/types/trip";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Selection,
  ChipProps,
  SortDescriptor,
  Tooltip,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, Key, useCallback, useMemo, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { ModalCreateTrip } from "./modalCreateTrip";
import { ModalDeleteTrip } from "./modalDeleteTrip";
import { useNavigate } from "@tanstack/react-router";
import { useCookies } from "react-cookie";
import { User } from "@/types/user.ts";

const statusColorMap: Record<string, ChipProps["color"]> = {
  ontime: "success",
  delayed: "warning",
  arrived: "danger",
};

export interface Alert {
  message: string;
  type: "success" | "warning";
  active: boolean;
}

const INITIAL_VISIBLE_COLUMNS = [
  "departure",
  "arrival",
  "price",
  "status",
  "actions",
];

const columns = [
  { name: "ID", uid: "id", sortable: true },
  { name: "DEPARTURE", uid: "departure", sortable: true },
  { name: "DEPARTURE DATE", uid: "departureTime", sortable: true },
  { name: "ARRIVAL", uid: "arrival", sortable: true },
  { name: "ARRIVAL DATE", uid: "arrivalTime", sortable: true },
  { name: "BUS COMPANY", uid: "bus" },
  { name: "PRICE", uid: "price", sortable: true },
  { name: "STATUS", uid: "status", sortable: true },
  { name: "ACTIONS", uid: "actions" },
];

const statusOptions = [
  { name: "OnTime", uid: "ontime" },
  { name: "Delayed", uid: "delayed" },
  { name: "Arrived", uid: "arrived" },
];

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function TripsTable() {
  const [cookies] = useCookies(["user"]);
  const user = cookies.user as User;

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "departureTime",
    direction: "ascending",
  });

  const navigate = useNavigate();

  const { data: trips, isLoading } = useQuery<Trip[], Error>({
    queryKey: ["trips", user.token],
    queryFn: () =>
      getTrips(user.token).then((data) =>
        data.map((trip) => ({
          ...trip,
          departureTime: new Date(trip.departureTime),
          arrivalTime: new Date(trip.arrivalTime),
        }))
      ),
  });

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    if (!trips) return [];

    let filteredTrips = [...trips];

    if (hasSearchFilter) {
      filteredTrips = filteredTrips.filter(
        (trip) =>
          trip.departure.name
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          trip.arrival.name.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (
      statusFilter !== "all" &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredTrips = filteredTrips.filter((trip) =>
        Array.from(statusFilter).includes(trip.status.toLowerCase())
      );
    }

    return filteredTrips;
  }, [trips, hasSearchFilter, statusFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a: Trip, b: Trip) => {
      const first = a[sortDescriptor.column as keyof Trip];
      const second = b[sortDescriptor.column as keyof Trip];

      if (first instanceof Date && second instanceof Date) {
        return sortDescriptor.direction === "descending"
          ? second.getTime() - first.getTime()
          : first.getTime() - second.getTime();
      } else if (first instanceof Object && second instanceof Object) {
        if ("name" in first && "name" in second) {
          const cmp =
            first.name < second.name ? -1 : first.name > second.name ? 1 : 0;
          return sortDescriptor.direction === "descending" ? -cmp : cmp;
        } else if ("company" in first && "company" in second) {
          const cmp =
            first.company < second.company
              ? -1
              : first.company > second.company
                ? 1
                : 0;
          return sortDescriptor.direction === "descending" ? -cmp : cmp;
        }
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [filteredItems, sortDescriptor.column, sortDescriptor.direction]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    // Return the items with today departure date or later

    return sortedItems.slice(start, end);
  }, [page, rowsPerPage, sortedItems]);

  const [, setCookies] = useCookies(["selectedTrip"]);

  const handleSelectTrip = useCallback(
    (trip: Trip, edit: boolean) => () => {
      const tripData = JSON.stringify({ trip: trip, edit: edit });
      setCookies("selectedTrip", tripData);
      void navigate({ to: "/tripDetails" });
    },
    [navigate, setCookies]
  );

  const renderCell = useCallback(
    (trip: Trip, columnKey: Key) => {
      const cellValue = trip[columnKey as keyof Trip];

      switch (columnKey) {
        case "departure":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {trip.departure.name}
              </p>
              <p className="text-bold text-tiny capitalize text-default-400">
                {trip.departureTime.toLocaleString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
          );
        case "arrival":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">
                {trip.arrival.name}
              </p>
              <p className="text-bold text-tiny capitalize text-default-400">
                {trip.arrivalTime.toLocaleString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                })}
              </p>
            </div>
          );
        case "price":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small capitalize">{trip.price}</p>
              <p className="text-bold text-tiny capitalize text-default-400">
                {trip.freeSeats} seats left
              </p>
            </div>
          );
        case "status":
          return (
            <Chip
              className="capitalize"
              color={statusColorMap[trip.status.toLowerCase()]}
              size="sm"
              variant="flat"
            >
              {trip.status}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center">
              <Tooltip content="Details">
                <Button
                  className="text-lg text-default-400 active:opacity-50"
                  variant="light"
                  size="sm"
                  onClick={handleSelectTrip(trip, false)}
                >
                  <MaterialSymbol icon="visibility" size={20} />
                </Button>
              </Tooltip>
              <Tooltip content="Edit Trip">
                <Button
                  className="text-lg text-default-400 active:opacity-50"
                  variant="light"
                  size="sm"
                  onClick={handleSelectTrip(trip, true)}
                >
                  <MaterialSymbol icon="edit" size={20} />
                </Button>
              </Tooltip>
              <Tooltip color="danger" content="Delete Trip">
                <Button
                  className="text-lg text-danger active:opacity-50"
                  variant="light"
                  size="sm"
                >
                  <ModalDeleteTrip trip={trip} />
                </Button>
              </Tooltip>
            </div>
          );
        default:
          if (cellValue instanceof Date) {
            return cellValue.toLocaleString("en-US", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            });
          }
          if (cellValue instanceof Object) {
            if ("name" in cellValue) {
              return cellValue.name;
            } else if ("company" in cellValue) {
              return cellValue.company;
            }
          }
      }
    },
    [handleSelectTrip]
  );

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      setRowsPerPage(Number(e.target.value));
      setPage(1);
    },
    []
  );

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue("");
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by departure and arrival cities..."
            startContent={<MaterialSymbol icon="search" size={20} />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<MaterialSymbol icon="expand_more" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<MaterialSymbol icon="expand_more" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <ModalCreateTrip />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {trips?.length} Trips
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    statusFilter,
    visibleColumns,
    trips?.length,
    onRowsPerPageChange,
    onClear,
  ]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [page, pages, onPreviousPage, onNextPage]);

  const { data: alerts } = useQuery<Alert, Error>({
    queryKey: ["alerts"],
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-4">
      {alerts?.active && (
        <Chip color={alerts.type} variant="flat" radius="sm">
          {alerts.message}
        </Chip>
      )}
      <Table
        aria-label="Trips Table"
        isHeaderSticky
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          wrapper: "max-h-[600px]",
        }}
        selectedKeys={selectedKeys}
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
              allowsSorting={column.sortable}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No trips found"} items={items}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
