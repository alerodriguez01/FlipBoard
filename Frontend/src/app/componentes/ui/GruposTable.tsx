'use client';
import React, { Key } from "react";
import { PaginatedTable } from "./PaginatedTable";
import { Button, Chip, Divider, TableColumn, getKeyValue } from "@nextui-org/react";
import { Grupo, Usuario } from "@/lib/types";
import { CrossIcon } from "./icons/CrossIcon";
import endpoints from "@/lib/endpoints";
import { PersonAddIcon } from "./icons/PersonAddIcon";
import { useTheme } from "next-themes";
import { RubricaIcon } from "./icons/RubricaIcon";
import { GrupoIcon } from "./icons/GrupoIcon";
import { EditIcon } from "./icons/EditIcon";

type TableProps = {
  idCurso: string,
  editable: boolean,
  evaluable: boolean,
  onCrearGrupoPress?: () => void
  onAsignarRubricaPress?: () => void
  onEvaluarPress?: (grupoId: string) => void
  onEditarPress?: (grupoId: string) => void
}

const GruposTable = (props: TableProps) => {

  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";

  const renderCell = React.useCallback((grupo: Grupo, columnKey: Key) => {

    if (columnKey === "evaluar")    
      return props.evaluable && 
        <Button onPress={() => props.onEvaluarPress?.(grupo.id)} radius="full" variant="faded">Evaluar</Button> 


    if (props.editable && columnKey === "actions") 
      return (
        <div className="flex flex-row gap-1">
          <Button onPress={() => alert(`TODO: MODIFICAR idGrupo: ${grupo.id}`)} isIconOnly variant="light">
            <EditIcon theme={currentTheme}/>
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
          {grupo.integrantesModel?.slice(0,-1).map((user: Usuario) => <>{user.correo} <Divider className="mt-1 mb-1"/></>)}
          {grupo.integrantesModel?.at(grupo.integrantesModel?.length-1).correo}
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
      renderCell={(item, cKey) => renderCell(item,cKey)}
      headerRightContent={ props.editable &&
        <div className="flex gap-3">
          <Button variant="faded" startContent={<GrupoIcon theme={currentTheme}/>} onPress={() => props.onCrearGrupoPress?.()}>Crear grupo</Button>
          <Button variant="faded" startContent={<RubricaIcon toggle={true} theme={currentTheme}/>} onPress={() => props.onAsignarRubricaPress?.()}>Asignar rúbrica</Button>
        </div>
      } >
      <TableColumn key="numero" className="w-[100px]" align="center" >Grupo</TableColumn>
      <TableColumn key="integrantes" className="w-[400px]">Integrantes</TableColumn>
      <TableColumn key="correo" className="w-[400px]">Correo electrónico</TableColumn>
      <TableColumn key="evaluar" className="w-[70px]"> </TableColumn>
      <TableColumn key="actions" className="w-[10px]"> </TableColumn>
    </PaginatedTable>
  );
}

export { GruposTable };