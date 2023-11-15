'use client';
import { Criterio } from "../lib/types";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React, { Key, useState } from "react";
import { RubricaGridCell } from "./RubricaGridCell";
import { useController } from "react-hook-form";

type GridProps = {
  label: string,
  criterios: Criterio[],
  niveles: any[],
  evaluable: boolean,
  name?: string,
  control?: any
}

const RubricaGrid = React.forwardRef((props: GridProps, ref: any) => {

  let n=0;
  const columns = [{nombre: "Criterio", i: -1},...props.niveles.map(niv => ({...niv, i: n++}))];
  const rows = props.criterios;
  const [cambio, setCambio] = useState(false);
  const [nivelSelecc, setNivelSelecc] = useState(new Map());

  // carniceria con los undefined gracias TS :)
  const {
    field = undefined,
    fieldState: {invalid = undefined, error = undefined}
  } = props.control && props.name ? useController({name: props.name, control: props.control}) : {fieldState: {}};

  const renderCell = (row: Criterio, key: Key) => {
    return (
      <RubricaGridCell 
        crit={row.nombre}
        niv={key.toString()}
        selected={nivelSelecc.get(row.nombre) === parseInt(key.toString())}
        onClick={(crit, niv) => {
          if(!props.evaluable)
            return;
          if(niv === '-1')
            return;
          const newMap = nivelSelecc.set(crit,parseInt(niv));
          setNivelSelecc(newMap);
          field?.onChange(newMap); 
          setCambio(!cambio);
        }}
      >
        {key === '-1' ? row.nombre : row.descripciones.at(parseInt(key.toString()))}
      </RubricaGridCell>
    )
  }

  return (
    <>
    <Table isStriped shadow="none" aria-label={`Rubrica ${props.label}`}>
      <TableHeader>
        {columns.map(col => <TableColumn key={col.i} className={col.i !== -1 ? "px-5" : ""}>{col.nombre}</TableColumn>)}
      </TableHeader>
      <TableBody>
        {rows.map(row => 
          <TableRow key={row.nombre}>
            {columnKey => <TableCell>{renderCell(row, columnKey)}</TableCell>}
          </TableRow>
        )}
      </TableBody>
    </Table>
    {invalid &&
      <p className="text-red-500 text-sm self-start mb-4 ml-4">{error?.message}</p>}
    </>
  );
});

export { RubricaGrid };