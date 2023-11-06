import React from "react";

export const RubricaIcon = (props: {toggle?: boolean}) => (
  <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" opacity={props.toggle ? 1 : 0.3}>
    <path d="M80-120v-480h220v480H80Zm290 0v-720h220v720H370Zm290 0v-400h220v400H660Z"/>
  </svg>
);
