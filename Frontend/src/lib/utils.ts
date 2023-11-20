const getCorreoFromProvider = (correo: string) => {
    // correo puede venir de la forma:
    // hola@gmail.com
    // google|hola@gmail.com si se logueo con google
    const correoSplit = correo.split('|');
    if (correoSplit.length === 1) {
        return correo;
    }
    return correoSplit[1];
}

export { getCorreoFromProvider }