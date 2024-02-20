'use client';
import { Criterio } from "@/lib/types";

import { Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@nextui-org/react";
import React, { Key, useEffect, useState } from "react";
import { RubricaGridCell } from "./RubricaGridCell";
import { UseFormSetValue, useController } from "react-hook-form";
import { useSession } from "next-auth/react";

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
  valoresEvaluados?: Map<string, number>,
  name: string,
  control: any
  dataToParcialUpdate?: {
    idUsuario?: string,
    idGrupo?: string,
    idCurso: string,
    observaciones: string,
    idRubrica: string,
    idMural?: string,
    idDocente: string,
    setObservaciones: UseFormSetValue<EvaluarForm>
  }
}

const ControllableRubricaGrid = React.forwardRef((props: GridProps, ref: any) => {

  let n = 0;
  const columns = [{ nombre: "Criterio", i: -1 }, ...props.niveles.map(niv => ({ nombre: niv.puntaje ? `${niv.nombre} (${niv.puntaje} puntos)` : niv.nombre, i: n++ }))];
  const rows = props.criterios;
  const [cambio, setCambio] = useState(false);
  const [nivelSelecc, setNivelSelecc] = useState(props.valoresEvaluados ?? new Map());

  const {
    field,
    fieldState: { invalid, error }
  } = useController({ name: props.name, control: props.control });

  const { data: session, status } = useSession();

  const partialUpdate = async (reset?: boolean) => {
    // cada vez que se selecciona un nivel, se crea/actualiza una calificacion parcial

    const curso = props.dataToParcialUpdate?.idCurso;
    const type = props.dataToParcialUpdate?.idGrupo ? "grupos" : "alumnos";
    const id = props.dataToParcialUpdate?.idGrupo || props.dataToParcialUpdate?.idUsuario;

    let valores: number[];
    if(!reset) valores = Array.from(nivelSelecc.values()).concat(Array(props.criterios.length - nivelSelecc.size).fill(-1));
    else valores = Array(props.criterios.length).fill(-1);
    

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cursos/${curso}/calificaciones/${type}/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session?.user.token || ''
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/cursos/${curso}/calificaciones?isParcial=true&${idEntidad}&rubrica=${props.dataToParcialUpdate?.idRubrica}&idMural=${props.dataToParcialUpdate?.idMural || ""}&idDocente=${props.dataToParcialUpdate?.idDocente}`, {
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
      field?.onChange(newMap);
      props.dataToParcialUpdate?.setObservaciones("observaciones", calificacion.observaciones);
      setRestaurada(true);
    })();

  }, [])

  const renderCell = (row: Criterio, key: Key) => {
    return (
      <RubricaGridCell
        crit={row.nombre}
        niv={key.toString()}
        selected={nivelSelecc.get(row.nombre) === parseInt(key.toString())}
        evaluable={props.evaluable}
        onClick={(crit, niv) => {
          if (!props.evaluable)
            return;
          if (niv === '-1')
            return;

          let newMap;
          if(nivelSelecc.get(crit) === parseInt(niv)) {
            newMap = nivelSelecc;
            newMap.delete(crit);
          }
          else
            newMap = nivelSelecc.set(crit, parseInt(niv));

          setNivelSelecc(newMap);
          field?.onChange(newMap);
          setCambio(!cambio);
          partialUpdate();
        }}
      >
        {key === '-1' ? (row.nombre) : row.descripciones.at(parseInt(key.toString()))}
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
      <footer className="flex flex-row justify-between items-center mb-4">
        {invalid &&
          <p className="text-red-500 text-sm ml-4">{error?.message}</p>}
        <Button 
          className="ml-auto mr-4" size="sm"
          variant="ghost"
          onPress={() => {
            const map = new Map();
            setNivelSelecc(map);
            field?.onChange(map); 
            setCambio(!cambio);
            partialUpdate(true);
          }}
        >Limpiar selección</Button>
      </footer>
      
    </>
  );
});

ControllableRubricaGrid.displayName = "RubricaGrid";

export { ControllableRubricaGrid };