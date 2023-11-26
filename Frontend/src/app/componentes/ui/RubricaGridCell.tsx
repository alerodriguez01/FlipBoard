import React, { ReactNode} from "react";

type CellProps = {
  children: ReactNode,
  crit: string,
  niv: string,
  selected: boolean
  onClick: (crit:string, niv:string) => void
  evaluable: boolean
}

const RubricaGridCell = (props: CellProps) => {

  return (
    <div 
      onClick={() => props.onClick(props.crit, props.niv)}
      className={`py-3 ${props.selected ? "border-1.5 shadow rounded border-slate-700 dark:border-slate-200 dark:shadow-slate-700 font-semibold":""} ${props.niv !== "-1" && props.evaluable ? "hover:cursor-pointer" : ""} ${props.niv !== "-1" && " px-2"}`}
    >
      {props.children}
    </div>
  );
}

export { RubricaGridCell }