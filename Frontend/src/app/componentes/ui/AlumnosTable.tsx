'use client';
import React, { Key } from "react";
import { PaginatedTable } from "./PaginatedTable";
import { Button, Chip, TableColumn, getKeyValue } from "@nextui-org/react";
import { Usuario } from "@/lib/types";
import { CrossIcon } from "./icons/CrossIcon";
import endpoints from "@/lib/endpoints";
import { PersonAddIcon } from "./icons/PersonAddIcon";
import { useTheme } from "next-themes";
import { RubricaIcon } from "./icons/RubricaIcon";
import { getCorreoFromProvider } from "@/lib/utils";

type TableProps = {
  idCurso: string,
  editable: boolean,
  evaluable: boolean,
  onAgregarAlumnoPress?: () => void
  onAsignarRubricaPress?: () => void
  onEvaluarPress?: (user: Usuario) => void
  onEliminarPress?: (user: Usuario) => void
}

const AlumnosTable = (props: TableProps) => {

  const {theme} = useTheme();
  const currentTheme = theme === "dark" ? "dark" : "light";

  const renderCell = React.useCallback((user: Usuario, columnKey: Key) => {

    const esDocente = user.cursosDocente.includes(props.idCurso);

    if (columnKey === "evaluar") {
      if(esDocente)
        return <Chip size="md" color="secondary" variant="bordered">Docente</Chip>;
      
      return props.evaluable ? 
        <Button onPress={() => props.onEvaluarPress?.(user)} radius="full" variant="faded" className="">Evaluar</Button> 
        :
        <></>  
    }

    if (props.editable && columnKey === "eliminar" && !esDocente) 
      return (
        <Button onPress={() => props.onEliminarPress?.(user)}isIconOnly variant="light">
          <CrossIcon/>
        </Button>
      );

    //agregarle las mayusculas al nombre
    if(columnKey === "nombre"){
      let words = user.nombre.split(' ');
      return words.map(w => w[0].toUpperCase()+w.substring(1)).join(' ')
    }

    if(columnKey === "correo") {
      return getCorreoFromProvider(user.correo);
    }

    return getKeyValue(user, columnKey);

  }, []);

  return (
    <PaginatedTable 
      className={""} 
      label={"Tabla de alumnos"} 
      idCurso={props.idCurso} 
      endpoint={endpoints.getAllAlumnos(props.idCurso)} 
      itemType={"alumno"} 
      renderCell={(item, cKey) => renderCell(item,cKey)}
      headerRightContent={ props.editable &&
        <div className="flex gap-3">
          <Button variant="faded" startContent={<PersonAddIcon theme={currentTheme}/>} onPress={() => props.onAgregarAlumnoPress?.()}>Agregar alumno</Button>
          <Button variant="faded" startContent={<RubricaIcon toggle={true} theme={currentTheme}/>} onPress={() => props.onAsignarRubricaPress?.()}>Asignar rúbrica</Button>
        </div>
      } >
      <TableColumn key="nombre" className="w-[500px] text-sm font-bold">Nombre</TableColumn>
      <TableColumn key="correo" className="w-[500px] text-sm font-bold">Correo electrónico</TableColumn>
      <TableColumn key="evaluar" className="w-[70px] text-sm font-bold" align="center"> </TableColumn>
      <TableColumn key="eliminar" className="w-[10px] text-sm font-bold"> </TableColumn>
    </PaginatedTable>
  );
}

export { AlumnosTable };