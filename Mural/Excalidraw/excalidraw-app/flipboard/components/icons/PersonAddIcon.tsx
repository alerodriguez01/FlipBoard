import React from "react";

export const PersonAddIcon = (props: {theme: string}) => {
  return (
    <svg fill={props.theme === 'light' ? "#000000" : "#ffffff"} height="24px" width="24px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" xmlSpace="preserve"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <g> <polygon points="451.368,229.053 451.368,168.421 410.947,168.421 410.947,229.053 350.316,229.053 350.316,269.474 410.947,269.474 410.947,330.105 451.368,330.105 451.368,269.474 512,269.474 512,229.053 "></polygon> </g> </g> <g> <g> <path d="M239.915,276.724c33.652-18.238,56.506-53.864,56.506-94.829c0-59.531-48.259-107.789-107.789-107.789 S80.842,122.364,80.842,181.895c0,40.965,22.854,76.591,56.506,94.829C66.732,283.298,0,352.877,0,437.895h377.263 C377.263,352.877,310.531,283.298,239.915,276.724z"></path> </g> </g> </g></svg>
  );
}