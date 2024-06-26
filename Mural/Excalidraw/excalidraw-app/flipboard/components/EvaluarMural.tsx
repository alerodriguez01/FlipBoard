import React, { useState } from 'react'
import { EvaluarForm } from './EvaluarForm';
import { Grupo, Rubrica, Usuario } from '../lib/types';
import { AlumnosTable } from './AlumnosTable';
import { GruposTable } from './GruposTable';
import endpoints from '../lib/endpoints';
import { toMayusFirstLetters } from '../lib/utils';
import { ExcalidrawImperativeAPI } from '../../../src/types';

type CompProps = {
    tipo: "Usuario" | "Grupo",
    idMural: string,
    idCurso: string,
    idUser: string,
    theme: 'light'|'dark',
    rubrica: Rubrica,
    api: ExcalidrawImperativeAPI | null,
    tokenBackend: string
}

const EvaluarMural = (props: CompProps) => {

    const [isEvaluando, setIsEvaluando] = useState(false);
    const [entity, setEntity] = React.useState<any>();
    const nombreConMayus = (nom: string) => nom.split(' ').map(w => w[0].toUpperCase()+w.substring(1)).join(' ');

    if(isEvaluando) {
        return (
            <section className='p-2 flex flex-col'>
                <h2 className="font-semibold text-lg place-self-center">
                    {props.tipo === "Usuario" ? nombreConMayus(entity?.nombre) : `Grupo ${entity?.numero}`}
                </h2>
                <h3 className='place-self-center mb-3'>
                    {toMayusFirstLetters(props.rubrica.nombre)}
                </h3>
                <EvaluarForm
                    api={props.api}
                    rubrica={props.rubrica}
                    endpoint={ props.tipo === "Usuario" ? 
                        endpoints.crearCalificacionAlumno(props.idCurso, entity.id) : 
                        endpoints.crearCalificacionGrupo(props.idCurso, entity.id)
                    }
                    idDocente={props.idUser}
                    onEvaluarSuccess={() => setIsEvaluando(false)}
                    onAtrasPressed={() => setIsEvaluando(false)}
                    dataToParcialUpdate={{
                        idUsuario: props.tipo === "Usuario" ? entity.id : null,
                        idGrupo: props.tipo === "Grupo" ? entity.id : null,
                        idCurso: props.idCurso,
                        idMural: props.idMural,
                      }}
                      tokenBackend={props.tokenBackend}
                />
            </section>
        )
    }
    
    return (
        <section className='p-2'>
            {props.tipo === "Usuario" ?
                <AlumnosTable
                    idCurso={props.idCurso}
                    onEvaluarPress={(user)=>{setIsEvaluando(true); setEntity(user);}}
                    editable={false} evaluable={true} theme={props.theme} evaluarActive={!!props.rubrica}
                    tokenBackend={props.tokenBackend}
                />
                :
                <GruposTable idCurso={props.idCurso}
                    onEvaluarPress={(grupo)=>{setIsEvaluando(true); setEntity(grupo);}}
                    editable={false} evaluable={true} theme={props.theme} evaluarActive={!!props.rubrica}
                    tokenBackend={props.tokenBackend}
                />
            }
        </section>
    )
}

export default EvaluarMural