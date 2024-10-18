import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const connectDB = async() => {
    try {
        await prisma.$connect();
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.log("Failed to connect to MongoDB:", error);
    }
}

export default prisma;
