import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
  email: string;
}

// Globally extends express's request type for the whole project
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

function isUserPayload(a: unknown): a is UserPayload {
  return (
    typeof a === 'object' &&
    a !== null &&
    typeof (a as UserPayload).id === 'string' &&
    typeof (a as UserPayload).email === 'string'
  );
}

// Pulls currentUser out of jwt payload
export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.session?.jwt) return next();

  try {
    // jwt.verify throws if verification fails
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!);
    if (isUserPayload(payload)) req.currentUser = payload;
  } catch (err) {
    // swallow error and keep req.currentUser undefined
  }

  next();
};
