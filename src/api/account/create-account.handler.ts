import { NextFunction, Request, Response } from 'express';

import { HttpError } from '@/common/api-errors';
import { AccountController } from '@/features';

export const createAccountHandler =
  (controller: AccountController) => async (req: Request<{ address: string }>, res: Response, next: NextFunction) => {
    try {
      const result = await controller.createAccount(req.body.address);

      if (result.isFailure) {
        // Here you can define the logic for handling errors in this specific endpoint
        next(new HttpError(500, 'Create Account Error', result.failure.error));
      } else {
        res.status(200).send(result.content);
      }
    } catch (error) {
      next(new HttpError(500, (error as Error).message));
    }
  };
