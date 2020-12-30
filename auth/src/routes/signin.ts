import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest, BadRequestError } from '@earbtickets/common';

import { AuthHelper } from '../services/auth-helper';
import { User } from '../models/user';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .notEmpty()
      .withMessage('You must supply a password'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new BadRequestError('Invalid credentials');

    const passwordsMatch = await AuthHelper.compare(
      existingUser.password,
      password,
    );
    if (!passwordsMatch) throw new BadRequestError('Invalid credentials');

    const userJwt = AuthHelper.generateJwt(existingUser);

    // Store jwt on session object
    req.session = { jwt: userJwt };

    res.status(200).send(existingUser);
  },
);

export { router as signinRouter };
