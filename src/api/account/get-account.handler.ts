import { NextFunction, Request, Response } from 'express';

import { HttpError } from '@/common/api-errors';
import { AccountController } from '@/features';
import { AccountNotFoundError } from '@/features/account/domain/account.errors';

export const getAccountHandler =
  (controller: AccountController) =>
  async (req: Request<unknown, unknown, unknown, { address: string }>, res: Response, next: NextFunction) => {
    try {
      const result = await controller.getAccount(req.query.address);

      if (result.isFailure) {
        // Here you can define the logic for handling errors in this specific endpoint
        if (result.failure.error instanceof AccountNotFoundError) {
          next(new HttpError(404, result.failure.error.message));
        } else {
          next(new HttpError(500, 'Get Account Error', result.failure.error));
        }
      } else {
        res.status(200).send(result.content);
      }
    } catch (error) {
      next(new HttpError(500, (error as Error).message));
    }
  };
