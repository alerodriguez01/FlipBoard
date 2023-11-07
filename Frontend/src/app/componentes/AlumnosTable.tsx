'use client';
import endpoints from "@/lib/endpoints";
import { Button, Chip, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import React, { Key, useMemo, useState } from "react";
import useSWR from "swr";
import { Spinner } from "./ui/Spinner";
import { Usuario } from "@/lib/types";
import { CrossIcon } from "./ui/icons/CrossIcon";

const AlumnosTable = (props: {className: string, idCurso: string}) => {

  const [page, setPage] = useState(1);
  const rows = 10;

  const {data, error, isLoading} = useSWR(process.env.NEXT_PUBLIC_BACKEND_URL + endpoints.getAllAlumnos(props.idCurso, rows, (page-1)*rows),
      (url) => fetch(url).then(res => res.json()), { keepPreviousData: true });

  const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count/rows) : 1
  }, [data?.count, rows]);

  //funcion para renderizar cada celda
  const renderCell = React.useCallback((user: Usuario, columnKey: Key) => {

    const esDocente = user.cursosDocente.includes(props.idCurso);

    if (columnKey === "evaluar")
      return !esDocente ? (<Button radius="full">Evaluar</Button>) : <Chip size="md" color="secondary" variant="bordered">Docente</Chip>;

    if (columnKey === "eliminar")
      return (<Button onPress={() => alert(`TODO: ELIMINAR userID: ${user.id}`)}isIconOnly variant="light"><CrossIcon/></Button>);

    //agregarle las mayusculas al nombre
    if(columnKey === "nombre"){
      let words = user.nombre.split(' ');
      return words.map(w => w[0].toUpperCase()+w.substring(1)).join(' ')
    }
    
    return getKeyValue(user, columnKey);

  }, []);

  if(error)
    return <h1>{error.message}</h1>

  return (
    <Table
      aria-label="Tabla de alumnos"
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
              {columnKey => <TableCell>{renderCell(alumno, columnKey)}</TableCell>}
            </TableRow>
          )}
      </TableBody>
    </Table>
  );
}

export { AlumnosTable };