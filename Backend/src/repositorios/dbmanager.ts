import { PrismaClient } from '@prisma/client'

// Singleton Class para el cliente de prisma
// Prevents using multiple instances of PrismaClient
class PrismaSingleton {
    private static instance: PrismaClient;

    private constructor() { }

    public static getInstance(): PrismaClient {
        if (!PrismaSingleton.instance) {
            PrismaSingleton.instance = new PrismaClient()
        }

        return PrismaSingleton.instance
    }
}

export default PrismaSingleton;