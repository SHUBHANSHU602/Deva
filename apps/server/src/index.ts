import "dotenv/config";
import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import apiRouter from "./routes/api.js";

const app = express();
const port = Number(process.env.PORT || 4000);
const allowedOrigin = process.env.WEB_ORIGIN || "http://localhost:5173";

app.disable("x-powered-by");
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: "80kb" }));
app.use("/api", apiRouter);

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const webDirectory = path.resolve(currentDirectory, "../../web/dist");
app.use(express.static(webDirectory));
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(webDirectory, "index.html"));
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(error);
  res.status(500).json({ error: "Unexpected server error" });
});

app.listen(port, () => {
  console.log(`Deva server listening on http://localhost:${port}`);
});
