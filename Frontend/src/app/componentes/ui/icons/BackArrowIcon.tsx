import React from "react";

export const BackArrowIcon = (props: { theme: 'light' | 'dark' }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 -960 960 960" width="18">
      <path fill={props.theme === 'light' ? "#000000" : "#ffffff"} d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z"/>
    </svg>
  );
}