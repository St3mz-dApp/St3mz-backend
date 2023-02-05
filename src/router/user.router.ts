import express from "express";
import { ErrorCode } from "../error/error-code";
import { ErrorException } from "../error/error-exception";
import { BaseUser, User } from "../model/user.model";
import * as userService from "../service/user.service";

export const userRouter = express.Router();

userRouter.get("/", async (_req, res, next) => {
  try {
    const users: User[] = await userService.findAll();
    res.status(200).json(users);
  } catch (err: any) {
    next(err);
  }
});

userRouter.get("/:address", async (req, res, next) => {
  try {
    const address: string = req.params.address;
    const user = await userService.find(address);
    res.status(200).json(user);
  } catch (err: any) {
    next(err);
  }
});

userRouter.post("/", async (req, res, next) => {
  try {
    const user: BaseUser = req.body;
    const newUser = await userService.create(user);
    res.status(201).json(newUser);
  } catch (err: any) {
    next(err);
  }
});
