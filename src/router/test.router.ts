import express from "express";

export const testRouter = express.Router();

testRouter.get("/", async (_req, res, next) => {
  try {
    res.status(200).send("🔬 Testing is up!");
  } catch (err: any) {
    next(err);
  }
});
