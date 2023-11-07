'use client';
import endpoints from "@/lib/endpoints";
import { Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import React, { useMemo, useState } from "react";
import useSWR from "swr";
import { Spinner } from "./ui/Spinner";
import { Usuario } from "@/lib/types";

const AlumnosTable = (props: {className: string, idCurso: string}) => {

  const [page, setPage] = useState(1);
  const rows = 10;

  const {data, error, isLoading} = useSWR(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getAllAlumnos(props.idCurso, rows, (page-1)*rows),
      (url) => fetch(url).then(res => res.json()), { keepPreviousData: true });

  const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count/rows) : 0
  }, [data?.count, rows]);

  if(error)
    return <h1>{error.message}</h1>

  return (
    <Table
      aria-label="Tabla de alumnos"
      className={props.className}
      bottomContent={
        pages > 0 ? (
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(page) => setPage(page)}
            />
          </div>
        ) : null
      } >
      <TableHeader>
        <TableColumn key="apellido">Apellido</TableColumn>
        <TableColumn key="nombre">Nombre</TableColumn>
        <TableColumn key="correo">Correo electrónico</TableColumn>
        <TableColumn key="evaluar"> </TableColumn>
        <TableColumn key="eliminar"> </TableColumn>
      </TableHeader>
      <TableBody
        items={data ?? []}
        loadingContent={Spinner}
        loadingState={loadingState}
        emptyContent={"No se han encontrado alumnos"} >
          {(alumno: Usuario) => (
            <TableRow key={alumno?.id}>
              {columnKey => <TableCell>{getKeyValue(alumno, columnKey)}</TableCell>}
            </TableRow>
          )}
      </TableBody>
    </Table>
  );
}

export { AlumnosTable };