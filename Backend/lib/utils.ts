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
        <img src="https://lh3.googleusercontent.com/pw/ABLVV87r1LgOLuigiJzADB1VEmi0BybBBiAOzRfCI87XIMvxWT4bHwHOVX7EhtPTS3-U4AZF4tVnPVbKlg832FwTQF82kaYHVrR3vPYG3zd8wynOE8UG79UaNBEbTIp9NeNAGl8oJTvjket_wIDi2QWsR7rYZiHwlvW3m8stVG3KLM11CdIl4sEO3_WBMMWHuQ0ZJPvFk5F7Wim7bCCYQZNZuGaMcDiSEHF-qLNOl2itlbWyIrgPbCS0beOey30XTR_PXxH2pceCVSPMhRhQlpyi9eWU7ewlwa4FKyVC0EeqWts5sfDl5JA8T5QA3DlJgBb-F-pm7oIDxG_jhQF9z4mjmrRpknvvdxTrSuC489I60GCfD-ogAIvFJkMpB6w5eROI1OxXYisrNVm5055lXP71GQIU4q_QmcFW6B8LLYc_DBHE4IYjhc9bMX7Y1o4U83ppAkkX0ltg1lNpvD0sgzy-XQWEoafIjazUZ5AyjLi_1GK8AaGegsVn7Bgod5pi2GTJG5_IqCN3MvwDGnhZRQlgFln8khH3b11dMCarR4iEAeT8jXgVCXgOgqQl51IlwkoET17qsZAZbUA8cxYW-G_ZuCT4fmYakzhZCy0ZonQbRsevIsesL3I-zZspY2Ill_5H3SDt-mKQksRAd-EFnNExgr7GBd4usASsKNEcOu_3yYUC0UxIczkEDLXw1-6oaYqj9QnvbTdWzrnYG6c1-WSRqC0wOx84KGXONspinffY_rlsJy-ARpLqQ8HfO1k0GB3McLd_7JP6j6Z3w5n5HplEJJxDqf-vHGVGsVKwOHJVVs5x-sGGi2G0kdIab11ajrBSxmdJyi1dXmvXofZAG4t9b2vNRMHQjHOZBaF6r2vcbYR3zvYW0Vxbyt2wWjq128yPvLvB65C-C-HMHbydCHGT9FC5V6U=w1039-h486-s-no-gm?authuser=0" 
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