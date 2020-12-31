import { Request, Response, NextFunction } from 'express';

import { CustomError } from '../errors/custom-error';

/*
  If an error is thrown by any previous express handler, this
  middelware will run and allow us to standardize our error
  response.
*/
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }

  console.error(err);

  res.status(400).send({ errors: [{ message: 'Something went wrong' }] });
};
