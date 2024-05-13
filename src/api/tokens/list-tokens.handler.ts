import { NextFunction, Request, Response } from 'express';

import { HttpError } from '@/common/api-errors';
import { TokensController } from '@/features';

export const listTokensHandler =
  (controller: TokensController) =>
  async (req: Request<unknown, unknown, unknown, { address: string }>, res: Response, next: NextFunction) => {
    try {
      const result = await controller.listTokens(req.query.address);

      if (result.isFailure) {
        // Here you can define the logic for handling errors in this specific endpoint
        next(new HttpError(500, 'List Tokens Error', result.failure.error));
      } else {
        res.status(200).send(result.content);
      }
    } catch (error) {
      next(new HttpError(500, (error as Error).message));
    }
  };
