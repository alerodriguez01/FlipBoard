'use client';
import { Pagination, Table, TableBody, TableCell, TableHeader, TableRow } from "@nextui-org/react";
import React, { Key, ReactNode, useMemo, useState } from "react";
import useSWR from "swr";
import { Spinner } from "./Spinner";

type TableProps = {
  className: string,
  label: string,
  idCurso: string,
  editable: boolean,
  endpoint: string,
  itemType: string,
  renderCell: (item: any, columnKey: Key) => ReactNode;
  children: any
}

const PaginatedTable = (props: TableProps) => {

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
  );
}

export { PaginatedTable };