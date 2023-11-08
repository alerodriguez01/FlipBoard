import React from "react";

export const SearchIcon = (props: {opacity?: number, theme: string}) => {
  return (
    <svg viewBox="0 0 24 24" width="24px" height="24px" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M14.9536 14.9458L21 21M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke={props.theme === 'light' ? "#000000" : "#ffffff"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
  );
}