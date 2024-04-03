import { MongoClient } from 'mongodb';
import dotenv from "dotenv";

dotenv.config();
const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@tech.of4l8iy.mongodb.net/?retryWrites=true&w=majority`;
export const client = new MongoClient(uri);
export const connectDB = async() =>  {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
    } catch (err) {
        console.error(err);
    }
}