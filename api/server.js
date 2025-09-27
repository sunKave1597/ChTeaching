const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const userController = require("./controllers/userController");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
    console.log(`✅ Server running successfully on http://localhost:${PORT}`);
});

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
app.get("/api/users", userController.getUsers);
app.post("/api/users", userController.createUser);
app.put("/api/users/:id", userController.updateUser);


module.exports = app;