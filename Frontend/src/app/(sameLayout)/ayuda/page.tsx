import Image, { StaticImageData } from "next/image";
import { ReactNode } from "react";
import { Divider } from "@nextui-org/divider";

const Article = ({ children, id, title }: { children?: ReactNode, id: string, title: string }) => {
    return (
        <>
            <article className="px-2">
                <h1 id={id} className="text-3xl font-bold mb-2">{title}</h1>
                {children}
            </article>
            <div className="my-8 px-2">
                <Divider />
            </div>
        </>
    )
}

const IMG = ({ src, alt }: { src: string, alt: string }) => {
    return <Image src={src} alt={alt} width={0} height={0} sizes="100vw" className="px-6 py-2" style={{ width: '100%', height: 'auto', marginTop: "15px", marginBottom: "15px" }} />
}

const H2 = ({ children, id }: { children: ReactNode, id: string }) => {
    return <h2 id={id} className="text-xl font-bold mb-1 pt-5 pb-2">{children}</h2>
}

const UL = ({ children }: { children: ReactNode }) => {
    return <ul className="list-disc list-inside p-1 ml-2">{children}</ul>
}

const ItalicBold = ({ children }: { children: ReactNode }) => {
    return <span className="italic font-medium">{children}</span>
}

export default function Ayuda() {
    return (
        <section className="flex flex-row h-[calc(100vh-88px)] gap-2 p-1">
            <div className="w-[80%] flex flex-col h-full overflow-y-auto p-8 text-justify">
                <Article id="cursos" title="Información sobre cursos">

                    <H2 id="ver-crear-curso">Ver y crear cursos</H2>

                    <p>
                        En la sección <ItalicBold>Mis cursos</ItalicBold> puede ver todos los cursos de los que forma parte, ya sea como alumno o como docente. Si desea crear un curso,
                        puede realizarlo presionando el botón <ItalicBold>Crear nuevo curso</ItalicBold> [1].
                    </p>
                    <IMG src={"/ayuda/cursos1.png"} alt="Seccion Mis cursos" />

                    <p>
                        Al presionar <ItalicBold>Crear un nuevo curso</ItalicBold>, le aparecerá un cuadro de diálogo con la información del curso a completar.
                    </p>
                    <IMG src={"/ayuda/cursos2.png"} alt="Creacion de un curso" />

                    <H2 id="modificar-curso">Modificar cursos</H2>
                    <p>
                        Si desea modificar la información de un curso, eliminarlo o compartirlo, puede acceder a estas funcionalidades presionando el botón que
                        se muestra en la imagen [1].
                    </p>
                    <IMG src={"/ayuda/cursos3.png"} alt="Opciones de un curso" />

                    <H2 id="curso-murales">Ver murales del curso</H2>
                    <p>
                        Dentro de un curso, podrá encontrar todos los murales que han sido creados para el mismo (ordenados por fecha de creación).
                        Si desea crear un nuevo mural, puede hacerlo presionando <ItalicBold>Crear nuevo mural</ItalicBold> [1].
                        Además, podrá acceder a la sección de los participantes del curso [2] y a la sección de calificaciones [3].
                    </p>
                    <IMG src={"/ayuda/cursos4.png"} alt="Murales de un curso" />

                    <H2 id="curso-participantes">Ver participantes del curso</H2>
                    <p>
                        En la sección <ItalicBold>Ver participantes</ItalicBold> de un curso podrá ver los alumnos y grupos que pertenecen al curso.
                        Además, podrá utilizar esta sección para evaluar haciendo click sobre <ItalicBold>Evaluar</ItalicBold> [1].
                        Para asignar una rúbrica que permita evaluar de manera individual a cada alumno o grupo, haga click en <ItalicBold>Asignar rúbrica</ItalicBold> [2].
                        Si desea invitar más participantes al curso, puede hacerlo presionando en <ItalicBold>Agregar alumnos</ItalicBold> [3].
                    </p>
                    <IMG src={"/ayuda/cursos5.png"} alt="Participantes de un curso" />

                    <H2 id="curso-invitacion" >Invitación para unirse al curso</H2>
                    <p>
                        Al presionar <ItalicBold>Agregar alumnos</ItalicBold>, le aparecerán diferentes opciones para compartir un curso.
                    </p>
                    <UL>
                        <li>Compartir mediante un código QR.</li>
                        <li>Compartir mediante el enlace de invitación al curso.</li>
                        <li>Compartir a través de correo electrónico.</li>
                    </UL>
                    <IMG src={"/ayuda/cursos6.png"} alt="Invitacion a un curso" />

                    <H2 id="curso-creacion-grupo">Creación de grupos</H2>
                    <p>
                        En la pestaña <ItalicBold>Grupos</ItalicBold> de la sección <ItalicBold>Ver participantes</ItalicBold>, podrá crear los grupos que
                        desee presionando sobre <ItalicBold>Crear grupo</ItalicBold> [1].
                        Recuerde que para crear un grupo deberá seleccionar al menos dos participantes.
                    </p>
                    <IMG src={"/ayuda/cursos7.png"} alt="Creacion de grupos" />

                    <H2 id="curso-calificaciones">Ver calificaciones</H2>
                    <p>
                        En la sección <ItalicBold>Ver calificaciones</ItalicBold> de un curso podrá ver y encontrar las calificaciones realizadas.
                    </p>
                    <UL>
                        <li>Bajo la pestaña <ItalicBold>Mural</ItalicBold>, se encuentran las calificaciones realizadas a alumnos o grupos asociadas a un mural.</li>
                        <li>Bajo la pestaña <ItalicBold>Alumno</ItalicBold>, se encuentran las calificaciones realizadas con rúbricas individuales a alumnos del curso.</li>
                        <li>Bajo la pestaña <ItalicBold>Grupo</ItalicBold>, se encuentran las calificaciones realizadas con rúbricas individuales a grupos del curso.</li>
                    </UL>
                    <IMG src={"/ayuda/cursos8.png"} alt="Calificaciones de un curso" />
                    <p>
                        En la sección <ItalicBold>Ver calificaciones</ItalicBold> de un curso, si presiona en <ItalicBold>Ver calificaciones</ItalicBold> podrá visualizar todas las calificaciones
                        realizadas con la rúbrica seleccionada.
                        Para ver una calificación en detalle, puede hacer click sobre <ItalicBold>Ver calificación</ItalicBold> [1].
                    </p>
                    <IMG src={"/ayuda/cursos9.png"} alt="Calificaciones de un curso" />

                </Article>

                <Article id="rubricas" title="Información sobre rúbricas">

                    <H2 id="crear-rubrica">Ver y crear rúbricas</H2>
                    <p>
                        En la sección <ItalicBold>Mis rúbricas</ItalicBold> puede encontrar todas las rúbricas que ha creado utilizando su usuario.
                        Para visualizar una rúbrica en detalle, haga click sobre el nombre de la rúbrica que desee ver.
                        Si desea crear una rúbrica, puede realizarlo presionando el botón <ItalicBold>Crear nueva rúbrica</ItalicBold> [1].
                    </p>
                    <IMG src={"/ayuda/rubricas1.png"} alt="Seccion Mis rubricas" />
                    <p>
                        Al presionar <ItalicBold>Crear nueva rúbrica</ItalicBold>, le aparecerá una nueva pantalla con la información de la rúbrica a completar.
                    </p>
                    <UL>
                        <li>Presionando el botón [1] podrá agregar más niveles para evaluar.</li>
                        <li>Presionando el botón [2] podrá agregar más criterios de evaluación.</li>
                        <li>Para crear finalmente la rúbrica, puede presionar el botón <ItalicBold>Crear rúbrica</ItalicBold> [3].</li>
                    </UL>
                    <IMG src={"/ayuda/rubricas2.png"} alt="Creacion de una rubrica" />
                    <p>
                        Si desea asociar un puntaje a cada nivel creado, puede realizarlo activando la opción <ItalicBold>Usar puntuaciones</ItalicBold> [1].
                        El cálculo del puntaje total al realizar una evaluación se realizará de la siguiente manera:  <span className="italic">Suma de los puntajes de 
                        los niveles seleccionados sobre el máximo puntaje posible</span>. <br />
                        Podrá encontrar un ejemplo completo en  <a href="#ejemplo-1" className="text-blue-500" >Creación de una rúbrica y evaluación de un alumno</a>.
                    </p>
                    <IMG src={"/ayuda/rubricas3.png"} alt="Creacion de una rubrica" />

                    <H2 id="rubrica-asignacion">Asignación de rúbricas</H2>
                    <p>
                        Dentro de un curso, una rúbrica puede ser asignada a tres entidades:
                    </p>
                    <UL>
                        <li>Mural: esto permitirá evaluar el desempeño de los alumnos o grupos en ese mural</li>
                        <li>Alumno: esto permitirá evaluar de manera independiente a cada alumno</li>
                        <li>Grupo: esto permitirá evaluar de manera independiente a cada grupo</li>
                    </UL>
                    <p>
                        A modo de ejemplo, se muestra la asignación de una rúbrica a un mural.
                        Primero, se debe presionar <ItalicBold>Asignar rúbrica</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/rubricas4.png"} alt="Asignacion de una rubrica a un mural" />
                    <p>
                        Luego, se debe seleccionar la rúbrica que se desea asignar y presionar <ItalicBold>Asignar</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/rubricas5.png"} alt="Asignacion de una rubrica a un mural" />

                </Article>

                <Article id="murales" title="Información sobre murales">

                    <H2 id="mural-informacion">Uso de murales</H2>
                    <p>
                        Dentro de un mural podrá trabajar de forma colaborativa con otros participantes, aprovechando todas las ventajas de la 
                        integración con <a href="https://excalidraw.com/" className=" text-blue-500">Excalidraw</a>.
                        Si desea evaluar un alumno o un grupo, puede realizarlo sin tener que salir del mural presionando en <ItalicBold>Evaluar</ItalicBold> [1].
                        Si desea visualizar la información del mural, puede realizarlo colocando el mouse sobre <ItalicBold>Mural</ItalicBold> [2].
                        Para regresar al curso, presione <ItalicBold>Volver</ItalicBold> [3].
                    </p>
                    <IMG src={"/ayuda/murales1.png"} alt="Informacion de un mural" />

                    <H2 id="mural-evaluacion">Evaluación dentro un mural</H2>
                    <p>
                        Presionando el botón <ItalicBold>Evaluar</ItalicBold> sobre el mural le mostrará una sección de evaluación,
                        donde podrá evaluar alumnos y/o grupos con la rúbrica que se ha asignado al mural.
                        La evaluación se podrá realizar únicamente si ha asignado una rúbrica al mural, presionando el botón <ItalicBold>Evaluar</ItalicBold> [1].
                    </p>
                    <IMG src={"/ayuda/murales2.png"} alt="Evaluacion de un mural" />

                </Article>

                <Article id="ejemplos" title="Ejemplos de uso">

                    <H2 id="ejemplo-1">Creación de una rúbrica y evaluación de un alumno</H2>
                    <p>
                        <span className="font-medium">Paso 1:</span> complete los niveles y criterios de la rúbrica, y presione <ItalicBold>Crear rúbrica</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/ej1_1.png"} alt="Ejemplo 1 - Paso 1" />
                    <p>
                        <span className="font-medium">Paso 2:</span> en la pestaña Alumnos de un curso, presione <ItalicBold>Asignar rúbrica</ItalicBold> para poder evaluar a cada alumno con la rúbrica creada.
                    </p>
                    <IMG src={"/ayuda/ej1_2.png"} alt="Ejemplo 1 - Paso 2" />
                    <p>
                        <span className="font-medium">Paso 3:</span> seleccione la rúbrica creada anteriormente y presione <ItalicBold>Asignar</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/ej1_3.png"} alt="Ejemplo 1 - Paso 3" />
                    <p>
                        <span className="font-medium">Paso 4:</span> presione <ItalicBold>Evaluar</ItalicBold> sobre el alumno que desea evaluar.
                    </p>
                    <IMG src={"/ayuda/ej1_4.png"} alt="Ejemplo 1 - Paso 4" />
                    <p>
                        <span className="font-medium">Paso 5:</span> seleccione la rúbrica creada anteriormente y presione <ItalicBold>Ir a evaluar</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/ej1_5.png"} alt="Ejemplo 1 - Paso 5" />
                    <p>
                        <span className="font-medium">Paso 6:</span> seleccione un nivel de evaluación para cada criterio (opcionalmente puede agregar observaciones) y presione <ItalicBold>Guardar</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/ej1_6.png"} alt="Ejemplo 1 - Paso 6" />
                    <p>
                        <span className="font-medium">Paso 7:</span> en la sección Ver calificaciones, dentro de la pestaña <ItalicBold>Alumno</ItalicBold>, presione
                        <ItalicBold>Ver calificaciones</ItalicBold> en la rúbrica creada anteriormente.
                    </p>
                    <IMG src={"/ayuda/ej1_7.png"} alt="Ejemplo 1 - Paso 7" />
                    <p>
                        Finalmente, podrá ver la calificación realizada al alumno. Si desea obtener más detalle, presione <ItalicBold>Ver calificación</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/ej1_8.png"} alt="Ejemplo 1 - Paso 8" />
                    <IMG src={"/ayuda/ej1_9.png"} alt="Ejemplo 1 - Ver detalle de la calificacion creada" />

                    <H2 id="ejemplo-2">Creación de un mural y evaluación de un grupo dentro del mural</H2>
                    <p>
                        <span className="font-medium">Paso 1:</span> dentro de un curso, presione <ItalicBold>Crear nuevo mural</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/ej2_1.png"} alt="Ejemplo 2 - Paso 1" />
                    <p>
                        <span className="font-medium">Paso 2:</span> complete los campos solicitados. Además, puede asignar una rúbrica presionando <ItalicBold>Asignar rúbrica</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/ej2_2.png"} alt="Ejemplo 2 - Paso 2" />
                    <p>
                        <span className="font-medium">Paso 3:</span> seleccione la rúbrica deseada para evaluar el desempeño de los participantes en el mural y presione <ItalicBold>Asignar</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/ej2_3.png"} alt="Ejemplo 2 - Paso 3" />
                    <p>
                        <span className="font-medium">Paso 4:</span> presione <ItalicBold>Crear mural</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/ej2_4.png"} alt="Ejemplo 2 - Paso 4" />
                    <p>
                        <span className="font-medium">Paso 5:</span> dentro del mural, presione <ItalicBold>Evaluar</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/ej2_5.png"} alt="Ejemplo 2 - Paso 5" />
                    <p>
                        <span className="font-medium">Paso 6:</span> diríjase a la pestaña <ItalicBold>Grupos</ItalicBold> y presione <ItalicBold>Evaluar</ItalicBold> sobre el grupo deseado.
                    </p>
                    <IMG src={"/ayuda/ej2_6.png"} alt="Ejemplo 2 - Paso 6" />
                    <p>
                        <span className="font-medium">Paso 7:</span> seleccione un nivel de evaluación para cada criterio (opcionalmente puede agregar observaciones) y presione <ItalicBold>Guardar</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/ej2_7.png"} alt="Ejemplo 2 - Paso 7" />
                    <p>
                        <span className="font-medium">Paso 8:</span> en la sección Ver calificaciones, dentro de la pestaña <ItalicBold>Mural</ItalicBold>, presione <ItalicBold>Ver calificaciones</ItalicBold> en el mural.
                    </p>
                    <IMG src={"/ayuda/ej2_8.png"} alt="Ejemplo 2 - Paso 8" />
                    <p>
                        Finalmente, podrá ver la calificación realizada al grupo. Si desea obtener más detalle, presione <ItalicBold>Ver calificación</ItalicBold>.
                    </p>
                    <IMG src={"/ayuda/ej2_9.png"} alt="Ejemplo 2 - Paso 9" />
                    <IMG src={"/ayuda/ej2_10.png"} alt="Ejemplo 2 - Ver detalle de la calificacion creada" />

                </Article>

            </div>
            <aside className="w-[20%] overflow-y-auto p-4 flex flex-col gap-2">
                <h1 className="text-xl font-semibold">Ayuda</h1>
                <ul className="flex flex-col gap-1">

                    <li className="font-medium pt-2"><a href="#cursos">Información sobre cursos</a></li>
                    <li className="pl-4"><a href="#ver-crear-curso">Ver y crear cursos</a></li>
                    <li className="pl-4"><a href="#modificar-curso">Modificar cursos</a></li>
                    <li className="pl-4"><a href="#curso-murales">Ver murales del curso</a></li>
                    <li className="pl-4"><a href="#curso-participantes">Ver participantes del curso</a></li>
                    <li className="pl-4"><a href="#curso-invitacion">Invitación para unirse al curso</a></li>
                    <li className="pl-4"><a href="#curso-creacion-grupo">Creación de grupos</a></li>
                    <li className="pl-4"><a href="#curso-calificaciones">Ver calificaciones</a></li>

                    <li className="font-medium pt-2"><a href="#rubricas">Información sobre rúbricas</a></li>
                    <li className="pl-4"><a href="#crear-rubrica">Ver y crear rúbricas</a></li>
                    <li className="pl-4"><a href="#rubrica-asignacion">Asignación de rúbricas</a></li>

                    <li className="font-medium pt-2"><a href="#murales">Información sobre murales</a></li>
                    <li className="pl-4"><a href="#mural-informacion">Uso de murales</a></li>
                    <li className="pl-4"><a href="#mural-evaluacion">Evaluación dentro de un mural</a></li>

                    <li className="font-medium pt-2"><a href="#ejemplos">Ejemplos de uso</a></li>
                    <li className="pl-4"><a href="#ejemplo-1">Creación de una rúbrica y evaluación de un alumno</a></li>
                    <li className="pl-4"><a href="#ejemplo-2">Creación de un mural y evaluación de un grupo dentro del mural</a></li>

                </ul>
            </aside>
        </section>
    );
}