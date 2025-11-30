require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

const projectsRouter = require("./routes/projects");

const app = express();
const PORT = process.env.PORT || 4000;

// Connect DB
connectDB(process.env.MONGODB_URI);

// Middlewares
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN || "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Health route
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// API routes
app.use("/api/projects", projectsRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
