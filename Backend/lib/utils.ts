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
        <img src="https://lh3.googleusercontent.com/pw/ADCreHf9T3Oz5qHTtXiEstayVo7o_YWfVBFjpNuH48kPFapD-aCAHZK0KhTAbthQDk9mXgaYDruas55jsXxqi3ohFturWeJD3Ex6Z4QaDo2AyvfTMzvw5MeAYb1SRiijo7Md9BNfCHc-ReTPzfJtHJrw5oSd0idUFnqa8bjieqpSgL_N8WZ1v2PuXwQZb8ksA4ZtL-gnRcUBC4h31ZlvRfXjRfDZ5pLCs84RvSKrgnUwlVwGaDNq1QIOqK-gNdPTUwpx8fAMJg3WoRk5jhjWag2Ziml2yL_9HcnL_nirz9vy2_M-HxudtY-FOyp1NQz08JzYkM1NshgAw2PNjXGn5k7RKPzQNlnm37aeLfqLxrS3vRY3lFa8OLROYC7rO9GCZ8-MTCES7PBgblSiSDsNk7ELp0Z6ZWuT_AU9hhICsB00Ruj0xJtXl5T77lccaEXFupEmbk4z95FSYvH8vhx5y4zKVBtnIwYq8NAAO-c_PDBZfxI3T9xTlur1Fq5Y9IS11IcDPwLSKVhh8IC3pLA2C5OVBWEuxOmeFsb6ybv7pgfPWPxfDT1He2Gz5G1_ngXZ9tWJqF9UOAJzKoy8vb-L5IJcDna2bg4tM6EasUA2Iws9oSFo6FKkJ2EylR7kF29oeH7yIMwSbMEAJo9PJ2-SgYM3jldU0jnh1Yje1HPt2S7qHBE-xgyc7J5rjZgNdw7_7F81BkVexTnBrPqibHIrhK-NMKGSF1BHUFGFQ00sSkkQywS4DdJLDl00Y7J5f6yj0xFUVyOhCyBegofO2Fqv_O7r574NqAJscIdekbq9GNHjeMNPqDEoqQro9188LHLjuEYgnM3RMpEN7TlxYkHSBn0dVuCQbyYR3EJ2J82uJa0SNT2GKdNWyj7vRiFkzMQ34-q4w2JqCsbCGmBgtKo1bgh8_aTo4yWAOA25a18r529O3g=w1039-h486-s-no-gm?authuser=0" 
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