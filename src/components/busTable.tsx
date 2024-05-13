
import { Bus } from "@/types/bus";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, SortDescriptor} from "@nextui-org/react";
import {useMemo, useState } from "react";
import { ModalDeleteBus } from "./modalDeleteBus";
import { ModalCreateBus } from "./modalCreateBus";

export function BusTable({buses}: {buses: Bus[]}) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "id",
    direction: "ascending",
  });

  const pages = Math.ceil(buses.length / rowsPerPage);

  const sortedItems = useMemo(() => {
    return [...buses].sort((a: Bus, b: Bus) => {
      const first = a[sortDescriptor.column as keyof Bus] as number;
      const second = b[sortDescriptor.column as keyof Bus] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [buses, sortDescriptor.column, sortDescriptor.direction]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems?.slice(start, end)?? [];
  }, [page, sortedItems]);


  return (
    <Table 
    bottomContent={
      <div className="flex w-full justify-center">
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    }
    classNames={{
      wrapper: "min-h-[222px]",
      
    }}
    fullWidth
    align="center"
    sortDescriptor={sortDescriptor}
    onSortChange={setSortDescriptor}
    
  >
    <TableHeader >
      <TableColumn key="id" align="center" >ID</TableColumn>
      <TableColumn key="capacity" align="center" allowsSorting>CAPACITY</TableColumn>
      <TableColumn key="actions" align="center">ACTIONS</TableColumn>
    </TableHeader>
    <TableBody emptyContent={"No trips found"} items={items}>
      {(item) => (
        <TableRow key={item.id}>
          {Object.keys(item).map((columnKey) => (
            columnKey === "company"? 
              <TableCell key={columnKey} align="center">
                <div className="flex flex-row">
                <ModalCreateBus bus={item} edit={true} />
                <ModalDeleteBus bus={item}/>
                </div>
              </TableCell>
              : <TableCell key={columnKey} align="center">{getKeyValue(item, columnKey)}</TableCell>
          ))}
        </TableRow>
      )}
    </TableBody>
  </Table>
  );
}