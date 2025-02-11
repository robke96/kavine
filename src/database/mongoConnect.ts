import mongoose from "mongoose"

export const connectMongoDB = async (dbURI: string) => {
    try {
        if (!dbURI) return console.error("[MONGODB ERROR]: Missing mongodb connection url")

        await mongoose.connect(dbURI);
            console.info("[✅ | MongoDB] - prisijungta prie duomenu bazes");

        return mongoose;
        } catch (error: any) {
            console.error(`[MONGODB ERROR]: ${error.message}`);
    }
}