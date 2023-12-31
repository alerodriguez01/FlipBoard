'use client';
import { Criterio } from "../lib/types";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React, { Key, useEffect, useState } from "react";
import { RubricaGridCell } from "./RubricaGridCell";
import { UseFormSetValue, useController } from "react-hook-form";

type EvaluarForm = {
  valores: Map<string, number>;
  observaciones?: string | undefined;
} & {
  erroresExternos?: string | undefined;
}

type GridProps = {
  label: string,
  criterios: Criterio[],
  niveles: any[],
  evaluable: boolean,
  name?: string,
  control?: any,
  dataToParcialUpdate?: {
    idUsuario?: string,
    idGrupo?: string,
    idCurso: string,
    observaciones: string,
    idRubrica: string,
    idMural?: string,
    idDocente: string,
    setObservaciones: (value: string) => void
  }
}

const RubricaGrid = React.forwardRef((props: GridProps, ref: any) => {

  let n=0;
  const columns = [{nombre: "Criterio", i: -1},...props.niveles.map(niv => ({nombre: niv.puntaje ? `${niv.nombre} (${niv.puntaje} puntos)`:niv.nombre, i: n++}))];
  const rows = props.criterios;
  const [cambio, setCambio] = useState(false);
  const [nivelSelecc, setNivelSelecc] = useState(new Map());

  // carniceria con los undefined gracias TS :)
  const {
    field = undefined,
    fieldState: {invalid = undefined, error = undefined}
  } = props.control && props.name ? useController({name: props.name, control: props.control}) : {fieldState: {}};

  const partialUpdate = async () => {
    // cada vez que se selecciona un nivel, se crea/actualiza una calificacion parcial

    const curso = props.dataToParcialUpdate?.idCurso;
    const type = props.dataToParcialUpdate?.idGrupo ? "grupos" : "alumnos";
    const id = props.dataToParcialUpdate?.idGrupo || props.dataToParcialUpdate?.idUsuario;

    const valores = Array.from(nivelSelecc.values()).concat(Array(props.criterios.length - nivelSelecc.size).fill(-1));

    const res = await fetch(`${import.meta.env.VITE_FLIPBOARD_BACKEND_URL}/api/cursos/${curso}/calificaciones/${type}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idUsuario: props.dataToParcialUpdate?.idUsuario,
        idGrupo: props.dataToParcialUpdate?.idGrupo,
        idCurso: props.dataToParcialUpdate?.idCurso,
        valores: valores,
        observaciones: props.dataToParcialUpdate?.observaciones ?? "",
        idRubrica: props.dataToParcialUpdate?.idRubrica,
        idMural: props.dataToParcialUpdate?.idMural,
        idDocente: props.dataToParcialUpdate?.idDocente,
        isParcial: true
      }),
    });

    if (!res.ok) {
      console.log("Error al crear/actualizar calificacion parcial");
      return;
    }

  }

  useEffect(() => {
    if(props.dataToParcialUpdate?.observaciones) partialUpdate();
  }, [props.dataToParcialUpdate?.observaciones]);


  const [restaurada, setRestaurada] = useState(false);
  useEffect(() => {
    // busco si ya hay una rubrica parcial
    (async () => {

      const curso = props.dataToParcialUpdate?.idCurso;
      const type = props.dataToParcialUpdate?.idGrupo ? "grupos" : "alumnos";
      const id = props.dataToParcialUpdate?.idGrupo || props.dataToParcialUpdate?.idUsuario;
      const idEntidad = type === "alumnos" ? `idAlumno=${id}` : `idGrupo=${id}`;

      const res = await fetch(`${import.meta.env.VITE_FLIPBOARD_BACKEND_URL}/api/cursos/${curso}/calificaciones?isParcial=true&${idEntidad}&rubrica=${props.dataToParcialUpdate?.idRubrica}&idMural=${props.dataToParcialUpdate?.idMural || ""}&idDocente=${props.dataToParcialUpdate?.idDocente}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!res.ok) {
        console.log("Error al buscar calificacion parcial (puede ser que no exista)");
        return;
      }

      const calificacion = await res.json();
      // create a map(string, number) where string is each criterio and number is the nivel selected
      const newMap = new Map<string, number>();
      calificacion.valores?.forEach((val: number, i: number) => {
        if (val > -1) newMap.set(props.criterios[i].nombre, val);
      });
      setNivelSelecc(newMap);
      props.dataToParcialUpdate?.setObservaciones(calificacion.observaciones);
      setRestaurada(true);
    })();

  }, [])

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
          partialUpdate();
        }}
      >
        {key === '-1' ? row.nombre : row.descripciones.at(parseInt(key.toString()))}
      </RubricaGridCell>
    )
  }

  return (
    <>
    { restaurada && <p className="text-sm italic text-gray-400 px-4 self-end">Calificacion parcial restaurada</p>}
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
    {invalid &&
      <p className="text-red-500 text-sm self-start mb-4 ml-4">{error?.message}</p>}
    </>
  );
});

export { RubricaGrid };