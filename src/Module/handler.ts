import { NextFunction, Request, Response } from "express";

/** Базовый обработчик запросов */
export default function handler(
  handler: (options: Request) => Promise<unknown>
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await handler(req);
      const response = { data };
      res.send(response.data);
    } catch (e) {
      next(e);
    }
  };
}