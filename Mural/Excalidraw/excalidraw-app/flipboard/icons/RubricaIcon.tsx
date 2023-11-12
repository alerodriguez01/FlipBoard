import React from "react";

export const RubricaIcon = (props: { toggle?: boolean, theme: 'light' | 'dark' }) => (
  <svg
    fill={!props.toggle ? "#828282" : props.theme === 'light' ? "#000000" : "#ffffff"}
    width="18"
    height="18"
    version="1.1"
    id="Capa_1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 490 490"
    xmlSpace="preserve"
    stroke="#000000">
    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
    <g id="SVGRepo_iconCarrier"> <g> <g>
      <rect y="162.2" width="117.8" height="327.8"> </rect>
      <rect x="186.3" width="117.8" height="490"></rect>
      <rect x="372.2" y="82.4" width="117.8" height="407.6"></rect>
    </g>
    </g>
    </g>
  </svg>
);