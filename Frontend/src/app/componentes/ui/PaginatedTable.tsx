'use client';
import { Input, Pagination, Table, TableBody, TableCell, TableHeader, TableRow } from "@nextui-org/react";
import React, { Key, ReactNode, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Spinner } from "./Spinner";
import { SearchIcon } from "./icons/SearchIcon";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";

type TableProps = {
  className: string,
  label: string,
  endpoint: string,
  itemType: string,
  renderCell: (item: any, columnKey: Key) => ReactNode;
  notHeader?: boolean
  headerRightContent?: ReactNode
  children: any
  mutarDatos?: number
  searchParams?: string
  isStriped?: boolean
  rows?: number
}

const PaginatedTable = (props: TableProps) => {

  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";
  
  const [page, setPage] = useState(1);
  const rows = props.rows || 10;

  const [nombre, setNombre] = useState("");
  const { data: session, status } = useSession();

  const {data, error, isLoading, mutate} = useSWR(process.env.NEXT_PUBLIC_BACKEND_URL + props.endpoint + `?limit=${rows}&offset=${rows*(page-1)}&nombre=${nombre}&${props.searchParams}`,
      (url) => fetch(url, { headers: { "Authorization": session?.user.token || "" } }).then(res => res.json()), { keepPreviousData: true });

  // para que cada vez que se cree un grupo, se refresque la tabla
  useEffect(() => {
    mutate();
  }, [props.mutarDatos]);

  const loadingState = isLoading ? "loading" : "idle";

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count/rows) : 1
  }, [data?.count, rows]);


  if ((!isLoading && data?.error) || error) return (
    <section className="flex flex-col flex-1 p-10">
      {/* {error.message} */}
      <h1 className="">No se pudieron obtener los datos</h1>
    </section>
  );

  return (
    <section>
      { !props.notHeader && 
        <header className="flex flex-row justify-between p-5 mb-4 rounded-xl shadow-md dark:shadow-gray-900 bg-white dark:bg-[#18181B]">
        <Input
          radius="none"
          variant="underlined"
          placeholder={`Buscar ${props.itemType}`}
          startContent={<SearchIcon theme={currentTheme}/>}
          className="w-80"
          onValueChange={(value) => setNombre(value)} />
        {props.headerRightContent}
      </header>
      }

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
        } 
        isStriped={props.isStriped}
        >
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
                {columnKey => <TableCell key={item?.id+columnKey}>{props.renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
        </TableBody>
      </Table>
    </section>
  );
}

export { PaginatedTable };