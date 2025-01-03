import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb://admin:admin@mongo:27017/functions?authSource=admin",
      {} as mongoose.ConnectOptions
    );
    console.log("Conexión exitosa con MongoDB");
  } catch (error) {
    console.error("Error al conectar con MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
