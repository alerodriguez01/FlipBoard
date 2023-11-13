'use client';
import { Criterio } from "@/lib/types";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React, { Key, useState } from "react";
import { RubricaGridCell } from "./RubricaGridCell";

const RubricaGrid = (props: {label: string, criterios: Criterio[], niveles: any[], evaluable: boolean, dataSetter?: any}) => {

  let n=0;
  const columns = [{nombre: "Criterio", i: -1},...props.niveles.map(niv => ({...niv, i: n++}))];
  const rows = props.criterios;
  const [cambio, setCambio] = useState(false);
  const [nivelSelecc, setNivelSelecc] = useState(new Map());

  const renderCell = (row: Criterio, key: Key) => {
    return (
      <RubricaGridCell 
        crit={row.nombre}
        niv={key.toString()}
        selected={nivelSelecc.get(row.nombre) === key.toString()}
        onClick={(crit, niv) => {
          if(!props.evaluable)
            return;
          if(niv === '-1')
            return;
          setNivelSelecc(nivelSelecc.set(crit,niv));
          props.dataSetter?.(nivelSelecc); 
          setCambio(!cambio);
        }}
      >
        {key === '-1' ? row.nombre : row.descripciones.at(parseInt(key.toString()))}
      </RubricaGridCell>
    )
  }

  return (
    <Table isStriped shadow="none" aria-label={`Rubrica ${props.label}`}>
      <TableHeader>
        {columns.map(col => <TableColumn key={col.i}>{col.nombre}</TableColumn>)}
      </TableHeader>
      <TableBody>
        {rows.map(row => 
          <TableRow key={row.nombre}>
            {columnKey => <TableCell>{renderCell(row, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export { RubricaGrid };