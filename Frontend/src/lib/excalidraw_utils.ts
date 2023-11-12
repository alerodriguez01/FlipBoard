const bytesToHexString = (bytes: Uint8Array) => {
    return Array.from(bytes)
        .map((byte) => `0${byte.toString(16)}`.slice(-2))
        .join("");
};

// excalidraw-app/data/index.ts
const generateRoomId = async () => {
    const buffer = new Uint8Array(10);
    window.crypto.getRandomValues(buffer);
    return bytesToHexString(buffer);
};

const generateEncryptionKey = async <
    T extends "string" | "cryptoKey" = "string",
>(
    returnAs?: T,
): Promise<T extends "cryptoKey" ? CryptoKey : string> => {
    const key = await window.crypto.subtle.generateKey(
        {
            name: "AES-GCM",
            length: 128,
        },
        true, // extractable
        ["encrypt", "decrypt"],
    );
    return (
        returnAs === "cryptoKey"
            ? key
            : (await window.crypto.subtle.exportKey("jwk", key)).k
    ) as T extends "cryptoKey" ? CryptoKey : string;
};

//export const generateCollaborationLinkData = async () => {
export const generateContenidoMural = async () => {
    const roomId = await generateRoomId();
    const roomKey = await generateEncryptionKey();

    if (!roomKey) {
        throw new Error("Couldn't generate room key");
    }

    //return { roomId, roomKey };
    // return `#room=${roomId},${roomKey}`
    return `${roomId},${roomKey}`
};