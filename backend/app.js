const express = require("express");
const cors = require("cors");

const requestRoutes = require("./routes/request.route");
const historyRoutes = require("./routes/history.route");
const collectionRoutes = require("./routes/collection.route");
const environmentRoutes = require("./routes/environment.route");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "2mb" }));

app.use("/api/request", requestRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/collection", collectionRoutes);
app.use("/api/environment", environmentRoutes);

module.exports = app;
