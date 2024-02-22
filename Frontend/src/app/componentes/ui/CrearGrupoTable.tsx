import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, getKeyValue } from "@nextui-org/react";
import React, { Key, ReactNode } from "react";
import { Spinner } from "./Spinner";
import { Usuario } from "@/lib/types";
import { PlusIcon } from "./icons/PlusIcon";
import { CrossIcon } from "./icons/CrossIcon";
import { getCorreoFromProvider } from "@/lib/utils";

type TableProps = {
  label: string,
  title: string,
  searchable: boolean,
  onActionPress: (user: Usuario) => void
  items: any[],
  loadingState: any,
  headerContent?: ReactNode,
  theme: string
}

const CrearGrupoTable = (props: TableProps) => {

  const renderCell = (user: Usuario, columnKey: Key) => {
    
    
    if(columnKey === "nombre") {
      let words = user.nombre.split(' ');
      return words.map(w => w[0].toUpperCase()+w.substring(1)).join(' ')
    }

    if(columnKey === "action")
      return (
        <Button isIconOnly variant="light" onPress={() => props.onActionPress(user)}>
          {props.searchable ? <PlusIcon color={props.theme === 'light' ? "#000000" : "#ffffff"}/> : <CrossIcon/>}
        </Button>)

    if(columnKey === "correo") {
      return getCorreoFromProvider(user.correo);
    }

    return getKeyValue(user,columnKey);
  }

  return (
    <section>
      <header className="flex flex-row justify-between self-start mb-2  bg-white dark:bg-[#18181B]">
        <h2 className="min-w-[150px] self-center font-medium">{props.title}</h2>
        {props.headerContent}
      </header>
      <Table
          aria-label={props.label}
          radius="sm"
          className="max-h-[40vh]" isHeaderSticky >
          <TableHeader>
            <TableColumn key={"nombre"} className="min-w-[200px] text-sm font-bold">Nombre</TableColumn>
            <TableColumn key={"correo"} className="min-w-[300px] text-sm font-bold">Correo electrónico</TableColumn>
            <TableColumn key={"action"} className="w-[50px] text-sm font-bold"> </TableColumn>
          </TableHeader>
          <TableBody
            items={props.items ?? []}
            loadingContent={Spinner}
            loadingState={props.loadingState}
            emptyContent={props.searchable ? 'No se han encontrado resultados' : 'Añada participantes presionando el botón +'} >
              {(item: Usuario) => (
                <TableRow key={item?.id}>
                  {columnKey => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                </TableRow>
              )}
          </TableBody>
        </Table>
    </section>
  );
};

export { CrearGrupoTable }