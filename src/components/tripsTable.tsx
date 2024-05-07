import { getTrips } from "@/services/tripService";
import { Trip, TripDataTable } from "@/types/trip";
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
  Tooltip
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, Key, useCallback, useMemo, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";
import { ModalCreateTrip } from "./modalCreateTrip";
import { ModalDeleteTrip } from "./modalDeleteTrip";
import { Link } from "@tanstack/react-router";
import { useCookies } from "react-cookie";

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  full: "warning",
  completed: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["departure" ,"arrival", "price" ,"status", "actions"];

const columns = [
  {name: "ID", uid: "id", sortable: true},
  {name: "DEPARTURE", uid: "departure", sortable: true},
  {name: "DEPARTURE DATE", uid: "departureDate", sortable: true},
  {name: "ARRIVAL", uid: "arrival", sortable: true},
  {name: "ARRIVAL DATE", uid: "arrivalDate", sortable: true},
  {name: "BUS COMPANY", uid: "bus"},
  {name: "PRICE", uid: "price", sortable: true},
  {name: "STATUS", uid: "status", sortable: true},
  {name: "ACTIONS", uid: "actions"},
];

const statusOptions = [
  {name: "Active", uid: "active"},
  {name: "Full", uid: "full"},
  {name: "Completed", uid: "completed"},
];


function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function TripsTable() {
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS));
  const [statusFilter, setStatusFilter] = useState<Selection>("all");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "departureDate",
    direction: "ascending",
  });


  const {data: trips} = useQuery<Trip[], Error>({
   queryKey: ['trips'], 
   queryFn: () => getTrips().then((data) => data.map((trip) => ({...trip, departureTime: new Date(trip.departureTime), arrivalTime: new Date(trip.arrivalTime)}))),
  });


  const tripsData = useMemo(() => {
   return trips?.map((trip) => ({
      id: trip.id,
      departure: trip.departure.name,
      arrival: trip.arrival.name,
      departureDate: trip.departureTime,
      arrivalDate: trip.arrivalTime,
      price: trip.price,
      freeSeats: trip.freeSeats,
      bus: trip.bus.company,
      busCapacity: trip.bus.capacity,
      status: trip.departureTime > new Date() && trip.freeSeats > 0 ? "Active" : trip.departureTime > new Date() && trip.freeSeats <= 0 ? "Full" : "Completed",
   })) ?? [];
  }, [trips]);

  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns]);

  const filteredItems = useMemo(() => {
    let filteredTrips = [...tripsData];

    if (hasSearchFilter) {
      filteredTrips = filteredTrips.filter((trip) =>
        trip.departure.toLowerCase().includes(filterValue.toLowerCase()) ||
        trip.arrival.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
      filteredTrips = filteredTrips.filter((trip) =>
        Array.from(statusFilter).includes(trip.status.toLowerCase()),
      );
    }

    return filteredTrips;
  }, [tripsData, hasSearchFilter, statusFilter, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: TripDataTable, b: TripDataTable) => {
      const first = a[sortDescriptor.column as keyof TripDataTable] as number;
      const second = b[sortDescriptor.column as keyof TripDataTable] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const [, setSelectedTrip] = useCookies(["selectedTrip"]);

  const handleSelectTripEdit = useCallback((trip: TripDataTable) => () => {
    const tripData = JSON.stringify({ trip: trip, type: true});
    setSelectedTrip("selectedTrip", tripData);
  }, [setSelectedTrip]);

  const renderCell = useCallback((trip: TripDataTable, columnKey: Key) => {
    const cellValue = trip[columnKey as keyof TripDataTable];

    switch (columnKey) {
      case "departure":
        return (
            <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{trip.departure}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{trip.departureDate.toLocaleString("en-US", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric"})}</p>
          </div>
        );
      case "arrival":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{trip.arrival}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{trip.arrivalDate.toLocaleString("en-US", {day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric"})}</p>
          </div>
        );
      case "price":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">{trip.price}</p>
            <p className="text-bold text-tiny capitalize text-default-400">{trip.freeSeats} seats left</p>
          </div>
        );
      case "status":
        return (
          <Chip className="capitalize" color={statusColorMap[trip.status.toLowerCase()]} size="sm" variant="flat">
            {trip.status}
          </Chip>
        );
      case "actions":
        return (
            <div className="relative flex items-center">
              <Tooltip content="Details">
                <Button className="text-lg text-default-400 active:opacity-50" variant="light" size="sm">
                  <MaterialSymbol icon="visibility" size={20} />
                </Button>
              </Tooltip>
              <Tooltip content="Edit Trip">
                <Link to="/tripDetails">
                  <Button className="text-lg text-default-400 active:opacity-50" variant="light" size="sm" onClick={handleSelectTripEdit(trip)}>
                    <MaterialSymbol icon="edit" size={20}/>
                  </Button>
                </Link>
              </Tooltip>
              <Tooltip color="danger" content="Delete Trip" >
                <Button className="text-lg text-danger active:opacity-50" variant="light" size="sm">
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
          return cellValue;
    }
  }, [handleSelectTripEdit]);

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

  const onRowsPerPageChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  const onClear = useCallback(()=>{
    setFilterValue("")
    setPage(1)
  },[])

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by departure and arrival cities..."
            startContent={<MaterialSymbol icon="search" size={20}/>}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button endContent={<MaterialSymbol icon="expand_more" />} variant="flat">
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
                <Button endContent={<MaterialSymbol icon="expand_more" />} variant="flat">
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
          <span className="text-default-400 text-small">Total {tripsData.length} Trips</span>
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
  }, [filterValue, onSearchChange, statusFilter, visibleColumns, tripsData.length, onRowsPerPageChange, onClear]);

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
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
            Previous
          </Button>
          <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
            Next
          </Button>
        </div>
      </div>
    );
  }, [page, pages, onPreviousPage, onNextPage]);

  interface Alert {
    message: string;
    type: "success" | "warning" ; 
    active: boolean;  
  }

  const { data: alerts } = useQuery<Alert, Error>({
   queryKey: ['alerts']
  });

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
      <TableBody emptyContent={"No trips found"} items={sortedItems}>
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    </div>
  );
}
