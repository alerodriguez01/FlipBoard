'use client';
import React, { Key } from "react";
import { PaginatedTable } from "./PaginatedTable";
import { Button, Chip, Divider, TableColumn, getKeyValue } from "@nextui-org/react";
import { Grupo, Usuario } from "../lib/types";
import { CrossIcon } from "./icons/CrossIcon";
import endpoints from "../lib/endpoints";
import { RubricaIcon } from "./icons/RubricaIcon";
import { GrupoIcon } from "./icons/GrupoIcon";
import { EditIcon } from "./icons/EditIcon";
import { getCorreoFromProvider } from "../lib/utils";

type TableProps = {
  idCurso: string,
  editable: boolean,
  evaluable: boolean,
  theme: 'light'|'dark',
  onCrearGrupoPress?: () => void
  onAsignarRubricaPress?: () => void
  onEvaluarPress?: (grupo: Grupo) => void
  onEditarPress?: (grupoId: string) => void
  evaluarActive?: boolean // si es true, se puede evaluar (hay rubrica asignada)
}

const GruposTable = (props: TableProps) => {

  const renderCell = React.useCallback((grupo: Grupo, columnKey: Key) => {

    if (columnKey === "evaluar")    
      return props.evaluable && 
        <Button onPress={() => props.onEvaluarPress?.(grupo)} radius="full" variant="faded" isDisabled={!props.evaluarActive}>Evaluar</Button> 


    if (props.editable && columnKey === "actions") 
      return (
        <div className="flex flex-row gap-1">
          <Button onPress={() => alert(`TODO: MODIFICAR idGrupo: ${grupo.id}`)} isIconOnly variant="light">
            <EditIcon theme={props.theme}/>
          </Button>
          <Button onPress={() => alert(`TODO: ELIMINAR grupo: ${grupo.id}`)}isIconOnly variant="light">
            <CrossIcon/>
          </Button>
        </div>
      );

    if (columnKey === "integrantes"){
      const conMayus = (nombre: string) => nombre.split(' ').map(w => w[0].toUpperCase()+w.substring(1)).join(' ');
      return (
        <>
          {grupo.integrantesModel?.slice(0,-1).map((user: Usuario) => <>{conMayus(user.nombre)} <Divider className="mt-1 mb-1"/></>)}
          {conMayus(grupo.integrantesModel?.at(grupo.integrantesModel?.length-1).nombre)}
        </>
      );
    } 

    if (columnKey === "correo")
      return (
        <>
          {grupo.integrantesModel?.slice(0,-1).map((user: Usuario) => <>{getCorreoFromProvider(user.correo)} <Divider className="mt-1 mb-1"/></>)}
          {getCorreoFromProvider(grupo.integrantesModel?.at(grupo.integrantesModel?.length-1).correo)}
        </>
      );

    return getKeyValue(grupo, columnKey);

  }, []);

  return (
    <PaginatedTable 
      className={""} 
      label={"Tabla de grupos"} 
      idCurso={props.idCurso} 
      endpoint={endpoints.getAllGrupos(props.idCurso)} 
      itemType={"grupo"} 
      theme={props.theme}
      renderCell={(item, cKey) => renderCell(item,cKey)}
      headerRightContent={ props.editable &&
        <div className="flex gap-3">
          <Button variant="faded" startContent={<GrupoIcon theme={props.theme}/>} onPress={() => props.onCrearGrupoPress?.()}>Crear grupo</Button>
          <Button variant="faded" startContent={<RubricaIcon toggle={true} theme={props.theme}/>} onPress={() => props.onAsignarRubricaPress?.()}>Asignar rúbrica</Button>
        </div>
      } >
      <TableColumn key="numero" className="w-[100px] text-sm font-bold" align="center" >Grupo</TableColumn>
      <TableColumn key="integrantes" className="w-[400px] text-sm font-bold">Integrantes</TableColumn>
      <TableColumn key="correo" className="w-[400px] text-sm font-bold">Correo electrónico</TableColumn>
      <TableColumn key="evaluar" className="w-[70px]"> </TableColumn>
      <TableColumn key="actions" className="w-[10px]"> </TableColumn>
    </PaginatedTable>
  );
}

export { GruposTable };