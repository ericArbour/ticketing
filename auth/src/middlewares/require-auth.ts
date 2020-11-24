import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

/* 
  Called after currentUser in middleware pipeline to ensure that
  currentUser is defined.
*/
export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.currentUser) throw new NotAuthorizedError();

  next();
};
