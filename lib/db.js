import monggoose from "mongoose";

export const connectDB = async () => {
 try {
  const connect = await monggoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${connect.connection.host}`);
 } catch (error) {
  console.log("Error connecting to MongoDB:", error);
  process.exit(1);
 }
};
