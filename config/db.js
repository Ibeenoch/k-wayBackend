import mongoose from "mongoose";

export const connectDb = async() => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL).then((conn) => {
            console.log(`mongodb connected and running on ${conn.connection.host}`)
        })
    } catch (error) {
       console.log(error);
       process.exit(1) 
    }
}