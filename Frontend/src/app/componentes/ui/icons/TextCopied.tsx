import React from 'react'

const TextCopied = ({theme}: {theme: string}) => {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 12.9L7.14286 16.5L15 7.5" stroke={theme === 'light' ? "#000000" : "#ffffff"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M20 7.5625L11.4283 16.5625L11 16" stroke={theme === 'light' ? "#000000" : "#ffffff"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
  )
}

export default TextCopied