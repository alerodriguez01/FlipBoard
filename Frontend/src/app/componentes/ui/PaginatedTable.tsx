'use client';
import { Button, Input, Pagination, Table, TableBody, TableCell, TableHeader, TableRow } from "@nextui-org/react";
import React, { Key, ReactNode, useMemo, useState } from "react";
import useSWR from "swr";
import { Spinner } from "./Spinner";
import { SearchIcon } from "./icons/SearchIcon";
import { RubricaIcon } from "./icons/RubricaIcon";
import { useTheme } from "next-themes";

type TableProps = {
  className: string,
  label: string,
  idCurso: string,
  editable: boolean,
  endpoint: string,
  itemType: string,
  renderCell: (item: any, columnKey: Key) => ReactNode;
  addButton: ReactNode
  children: any
}

const PaginatedTable = (props: TableProps) => {

  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";
  
  const [page, setPage] = useState(1);
  const rows = 10;

  const {data, error, isLoading} = useSWR(process.env.NEXT_PUBLIC_BACKEND_URL + props.endpoint + `?limit=${rows}&offset=${rows*(page-1)}`,
      (url) => fetch(url).then(res => res.json()), { keepPreviousData: true });

  const loadingState = isLoading || data?.result.length === 0 ? "loading" : "idle";

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count/rows) : 1
  }, [data?.count, rows]);

  if(error)
    return <h1>{error.message}</h1>

  return (
    <section>
      <header className="flex flex-row justify-between">
        <Input
          radius="none"
          variant="underlined"
          placeholder={`Buscar ${props.itemType}`}
          startContent={<SearchIcon/>}
          className="w-[300px]" />
        <div className="flex gap-3">
          {props.addButton}
          <Button startContent={<RubricaIcon theme={currentTheme}/>} className="">Asignar rúbrica</Button>
        </div>
      </header>

      <Table
        aria-label={props.label}
        className={props.className}
        bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                color="default"
                showShadow
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
        } >
        <TableHeader>
          {props.children}
        </TableHeader>
        <TableBody
          items={data?.result ?? []}
          loadingContent={Spinner}
          loadingState={loadingState}
          emptyContent={`No se han encontrado ${props.itemType}`} >
            {(item: any) => (
              <TableRow key={item?.id}>
                {columnKey => <TableCell>{props.renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
        </TableBody>
      </Table>
    </section>
  );
}

export { PaginatedTable };