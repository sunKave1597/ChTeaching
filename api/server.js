const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
        });

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); 
    }
};

connectDB();


app.get("/", (req, res) => {
    res.send("API is running and MongoDB is connected 🚀");
});

const userRoutes = require("./routes/userRoutes"); 
app.use("/api/users", userRoutes);
module.exports = app;