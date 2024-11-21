require("dotenv").config();

// Connect Server to MongoDB
const config = require("./config.json");
const mongoose = require('mongoose');

mongoose.connect(config.connectionString)
   .then(() => console.log("MongoDB connected..."))
   .catch((err) => console.error("Could not connect to MongoDB: ", err));

// Import required modules
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require("./routers/UserRoute");
const noteRoutes = require("./routers/NoteRoute");

// Middleware
app.use(express.json());

app.use(
    cors({
        origin: "*",
    })
);

app.get("/", (req, res) => {
    res.json({ data: "Server is running on port 8000"});
});


// Auth API routes
app.use('/auth', userRoutes);

// Notes API routes
app.use("/notes", noteRoutes );

app.listen(8000);

module.exports = app;