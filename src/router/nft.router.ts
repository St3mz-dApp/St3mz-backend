import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/nft.service";

export const nftRouter = express.Router();

nftRouter.get(
  "/created-by/:address",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(200)
        .json(await service.createdBy(req.params.address.toLowerCase()));
    } catch (error: any) {
      next(error);
    }
  }
);

nftRouter.get(
  "/owned-by/:address",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res
        .status(200)
        .json(await service.ownedBy(req.params.address.toLowerCase()));
    } catch (error: any) {
      next(error);
    }
  }
);

nftRouter.get(
  "/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json(await service.get(+req.params.id));
    } catch (error: any) {
      next(error);
    }
  }
);

nftRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json(await service.getAll());
  } catch (error: any) {
    next(error);
  }
});
