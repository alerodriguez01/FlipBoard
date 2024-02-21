'use client';
import { Usuario } from "@/lib/types";
import { Button, TableColumn, getKeyValue } from "@nextui-org/react";
import React, { Key } from "react";
import { CrossIcon } from "./icons/CrossIcon";
import { getCorreoFromProvider } from "@/lib/utils";
import { PaginatedTable } from "./PaginatedTable";
import endpoints from "@/lib/endpoints";

type TableProps = {

};

const UsuariosTable = (props: TableProps) => {
    const renderCell = React.useCallback((user: Usuario, columnKey: Key) => {
    
        if (columnKey === "eliminar") 
          return (
            <Button onPress={() => alert("todo: eliminar")} isIconOnly variant="light">
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
            label={"Tabla de usuarios"} 
            endpoint={endpoints.getAllUsuarios()} 
            itemType={"usuario"} 
            renderCell={(item, cKey) => renderCell(item,cKey)}
        >
            <TableColumn key="nombre" className="w-[500px] text-sm font-bold">Nombre</TableColumn>
            <TableColumn key="correo" className="w-[500px] text-sm font-bold">Correo electrónico</TableColumn>
            <TableColumn key="evaluar" className="w-[70px] text-sm font-bold" align="center"> </TableColumn>
            <TableColumn key="eliminar" className="w-[10px] text-sm font-bold"> </TableColumn>
        </PaginatedTable>
      );
}

export { UsuariosTable }