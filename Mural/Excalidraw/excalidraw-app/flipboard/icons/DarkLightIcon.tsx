const DarkLightIcon = ({ theme }: { theme: string }) => {
    return (
        <svg viewBox="0 0 24 24" height="22px" width="22px" focusable="false" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier">  <title>Cambiar tema</title> <desc>Created with Sketch.</desc> <g id="🔍-Product-Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="ic_fluent_dark_theme_24_regular" fill={theme === 'light' ? "#212121" : "#ffffff"} fillRule="nonzero"> <path d="M12,22 C17.5228475,22 22,17.5228475 22,12 C22,6.4771525 17.5228475,2 12,2 C6.4771525,2 2,6.4771525 2,12 C2,17.5228475 6.4771525,22 12,22 Z M12,20.5 L12,3.5 C16.6944204,3.5 20.5,7.30557963 20.5,12 C20.5,16.6944204 16.6944204,20.5 12,20.5 Z" id="🎨-Color"> </path> </g> </g> </g></svg>
    )
}

export default DarkLightIcon