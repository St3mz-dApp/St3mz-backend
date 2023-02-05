import express from "express";
import logger from "morgan";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import { userRouter } from "./router/user.router";
import { testRouter } from "./router/test.router";
import { errorHandler } from "./error/error-handler";

dotenv.config();
const app = express();
const port = process.env.PORT;

// Logger
app.use(logger("dev"));
// Enable CORS
app.use(cors({ origin: "*" }));
// Body parser
app.use(express.json());
// Url parser
app.use(express.urlencoded({ extended: true }));
// HTTP headers security
app.use(helmet());

// Routers
app.get("/", (_req, res) => {
  res.send("✅ Server is up!");
});
app.use("/user", userRouter);
if (process.env.NODE_ENV === "development") {
  app.use("/test", testRouter);
}

// Error handling
app.use(errorHandler);

// Server activation
app.listen(port, () => {
  console.log(`⚡️Listening on port ${port}`);
});
