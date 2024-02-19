import fs from 'fs/promises'

export const templateHtml = (message: string) => {
    return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Notificación</title>
        <style>
            img {
                width: 300px;
                height: auto;
            }
            p {
                font-size: 14px;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <img src="https://i.imgur.com/0xdMkKP.jpg"
        alt="FlipBoard" 
        border="0"
        >
        <p>${message}</p>
    </body>
    </html>
    `;
}

// throws on error
export const base64ToFile = async (base64: string, path: string, fileName: string): Promise<void> => {
    //create dir if unexistent
    await fs.mkdir(path, { recursive: true });
    const data = base64.replace(/^data:image\/jpeg;base64,/, "");
    await fs.writeFile(`${path}/${fileName}`, data, 'base64');
}