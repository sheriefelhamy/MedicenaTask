import cors from "cors";
import express from "express";
import env from "./config/env.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: [ env.corsOrigin, "https://medicena-task.vercel.app" ] }));
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "medicena-api" });
  });

  app.use("/api/requests", requestRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.use((error, _req, res, _next) => {
    console.error(error);
    const status = error.status || 500;
    res.status(status).json({ message: error.message || "Internal server error" });
  });

  return app;
}
