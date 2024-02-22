'use client';
import { Criterio } from "@/lib/types";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React, { Key, useState } from "react";
import { RubricaGridCell } from "./RubricaGridCell";

type GridProps = {
  label: string,
  criterios: Criterio[],
  niveles: any[],
  evaluable: boolean,
  valoresEvaluados?: Map<string, number>
}

const RubricaGrid = React.forwardRef((props: GridProps, ref: any) => {

  let n=0;
  const columns = [{nombre: "Criterio", i: -1},...props.niveles.map(niv => ({nombre: niv.puntaje ? `${niv.nombre} (${niv.puntaje} puntos)`:niv.nombre, i: n++}))];
  const rows = props.criterios;
  const [cambio, setCambio] = useState(false);
  const [nivelSelecc, setNivelSelecc] = useState(props.valoresEvaluados ?? new Map());

  const renderCell = (row: Criterio, key: Key) => {
    return (
      <RubricaGridCell 
        crit={row.nombre}
        niv={key.toString()}
        selected={nivelSelecc.get(row.nombre) === parseInt(key.toString())}
        evaluable={props.evaluable}
        onClick={(crit, niv) => {
          if(!props.evaluable)
            return;
          if(niv === '-1')
            return;
          const newMap = nivelSelecc.set(crit,parseInt(niv));
          setNivelSelecc(newMap);
          setCambio(!cambio);
        }}
      >
        {key === '-1' ? (row.nombre) : row.descripciones.at(parseInt(key.toString()))}
      </RubricaGridCell>
    )
  }

  return (
    <>
      <Table isStriped shadow="none" aria-label={`Rubrica ${props.label}`}>
        <TableHeader>
          {columns.map(col => <TableColumn key={col.i} className={"text-sm font-bold" + (col.i !== -1 ? "px-5" : "")}>{col.nombre}</TableColumn>)}
        </TableHeader>
        <TableBody>
          {rows.map(row => 
            <TableRow key={row.nombre}>
              {columnKey => <TableCell>{renderCell(row, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
});

RubricaGrid.displayName = "RubricaGrid";

export { RubricaGrid };