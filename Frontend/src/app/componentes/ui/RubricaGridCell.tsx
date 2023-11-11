import React, { ReactNode} from "react";

type CellProps = {
  children: ReactNode,
  crit: string,
  niv: string,
  selected: boolean
  onClick: (crit:string, niv:string) => void
}

const RubricaGridCell = (props: CellProps) => {

  return (
    <div 
      onClick={() => props.onClick(props.crit, props.niv)}
      className={`py-3 ${props.selected ? "bg-blue-500":""}`}
    >
      {props.children}
    </div>
  );
}

export { RubricaGridCell }