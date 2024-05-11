
import { Bus } from "@/types/bus";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue, Button} from "@nextui-org/react";
import {useMemo, useState } from "react";
import { MaterialSymbol } from "react-material-symbols";

export function BusTable({buses}: {buses: Bus[]}) {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;


  const pages = Math.ceil(buses.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return buses?.slice(start, end)?? [];
  }, [page, buses]);

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
    
  >
    <TableHeader >
      <TableColumn key="id" align="center" >ID</TableColumn>
      <TableColumn key="capacity" align="center">CAPACITY</TableColumn>
      <TableColumn key="actions" align="center">ACTIONS</TableColumn>
    </TableHeader>
    <TableBody items={items}>
      {(item) => (
        <TableRow key={item.id}>
          {Object.keys(item).map((columnKey) => (
            columnKey === "company"? 
              <TableCell key={columnKey} align="center">
                <Button variant="light" endContent  color="primary" size="sm"><MaterialSymbol icon="edit" size={20}/></Button>
                <Button variant="light" endContent color="danger" size="sm"><MaterialSymbol icon="delete" size={20}/></Button>
              </TableCell>
              : <TableCell key={columnKey} align="center">{getKeyValue(item, columnKey)}</TableCell>
          ))}
        </TableRow>
      )}
    </TableBody>
  </Table>
  );
}