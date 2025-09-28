const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const client = require("prom-client"); // Prometheus client
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// --------------------
// Prometheus Metrics
// --------------------

// Collect default Node.js metrics (CPU, memory, event loop, etc.)
client.collectDefaultMetrics();

// Histogram for request durations
const httpRequestDurationSeconds = new client.Histogram({
  name: "backend_request_duration_seconds",
  help: "Duration of backend HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5, 10]
});

// Counter for total requests
const httpRequestsTotal = new client.Counter({
  name: "backend_requests_total",
  help: "Total number of backend requests",
  labelNames: ["method", "route", "status_code"]
});

// Middleware to track request metrics
app.use((req, res, next) => {
  const end = httpRequestDurationSeconds.startTimer();
  res.on("finish", () => {
    const labels = { method: req.method, route: req.path, status_code: res.statusCode };
    httpRequestsTotal.inc(labels);
    end(labels);
  });
  next();
});

// --------------------
// Routes
// --------------------
app.use("/api/users", require("./routes/userRoutes"));

// Metrics endpoint for Prometheus
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", client.register.contentType);
    res.end(await client.register.metrics());
  } catch (err) {
    res.status(500).end(err);
  }
});

// --------------------
// Connect to MongoDB & Start Server
// --------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () =>
      console.log(`Server running on port ${process.env.PORT}`)
    );
  })
  .catch((err) => console.error("MongoDB connection error:", err));
