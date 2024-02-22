'use client';
import { Usuario } from "@/lib/types";
import { Button, Chip, TableColumn, getKeyValue } from "@nextui-org/react";
import React, { Key, } from "react";
import { CrossIcon } from "./icons/CrossIcon";
import { getCorreoFromProvider } from "@/lib/utils";
import { PaginatedTable } from "./PaginatedTable";
import endpoints from "@/lib/endpoints";
import { EditIcon } from "./icons/EditIcon";
import { useTheme } from "next-themes";

type TableProps = {
    onEliminarPress?: (user: Usuario) => void,
    onModificarPress?: (user: Usuario) => void,
    mutarDatos?: number,
    currentUserId: string
};

const UsuariosTable = (props: TableProps) => {

    const {theme} = useTheme();

    const renderCell = React.useCallback((user: Usuario, columnKey: Key) => {
        if (columnKey === "eliminar" && user.id !== props.currentUserId) 
          return (
            <Button onPress={() => props.onEliminarPress?.(user)} isIconOnly variant="light">
              <CrossIcon/>
            </Button>
          );
          
        if (columnKey === "modificar")
            return (
                <Button onPress={() => props.onModificarPress?.(user)} isIconOnly variant="light" disabled={user.correo.startsWith("google|")}>
                    <EditIcon theme={theme === 'light' ? 'light' : 'dark'}/>
                </Button>
            );

        if (columnKey === "tipo" && !!user.superUser)
            return <Chip size="md" color="warning" variant="bordered">Administrador</Chip>;        
    
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
            mutarDatos={props.mutarDatos}
            rows={15}
            isStriped
        >
            <TableColumn key="nombre" className="w-[50%] text-sm font-bold">Nombre</TableColumn>
            <TableColumn key="correo" className="w-[50%] text-sm font-bold">Correo electrónico</TableColumn>
            <TableColumn key="tipo" className="text-sm font-bold" align="center"> </TableColumn>
            <TableColumn key="modificar" className="text-sm font-bold"> </TableColumn>
            <TableColumn key="eliminar" className="text-sm font-bold"> </TableColumn>
        </PaginatedTable>
      );
}

export { UsuariosTable }