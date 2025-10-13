const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const wordRoutes = require("./routes/wordRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API is running 🚀"));
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/words", wordRoutes);

const serverless = require("serverless-http");
module.exports = serverless(app);

