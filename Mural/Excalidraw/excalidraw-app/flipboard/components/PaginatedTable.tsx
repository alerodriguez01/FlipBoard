'use client';
import { Input, Pagination, Table, TableBody, TableCell, TableHeader, TableRow } from "@nextui-org/react";
import React, { Key, ReactNode, useMemo, useState } from "react";
import { Spinner } from "./Spinner";
import { SearchIcon } from "./icons/SearchIcon";
import useSWR from "swr";

type TableProps = {
  className: string,
  label: string,
  idCurso: string,
  endpoint: string,
  itemType: string,
  renderCell: (item: any, columnKey: Key) => ReactNode;
  headerRightContent: ReactNode
  children: any,
  theme?: 'light'|'dark'
}

const PaginatedTable = (props: TableProps) => {
  
  const [page, setPage] = useState(1);
  const rows = 10;

  const [nombre, setNombre] = useState("");

  const {data, error, isLoading} = useSWR(import.meta.env.VITE_FLIPBOARD_BACKEND_URL + props.endpoint + `?limit=${rows}&offset=${rows*(page-1)}&nombre=${nombre}`,
      (url) => fetch(url).then(res => res.json()), { keepPreviousData: true });

  const loadingState = isLoading ? "loading" : "idle";

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count/rows) : 1
  }, [data?.count, rows]);


  if(error)
    return <h1>{error.message}</h1>

  return (
    <section>
      <header className="flex flex-row justify-between p-5 mb-4 rounded-xl shadow-md dark:shadow-gray-900 bg-white dark:bg-[#18181B]">
        <Input
          radius="none"
          variant="underlined"
          placeholder={`Buscar ${props.itemType}`}
          startContent={<SearchIcon theme={props.theme ?? 'light'}/>}
          className="w-80 bg-transparent"
          onValueChange={(value) => setNombre(value)} />
        {props.headerRightContent}
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
          emptyContent={`No se han encontrado ${props.itemType}s`} >
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