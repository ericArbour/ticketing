import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';

import { UserDoc } from '../models/user';

const scryptAsync = promisify(scrypt);

export class AuthHelper {
  static async toHash(password: string) {
    // Create a random salt for each hashed password so that
    // two identical passwords do not result in the same hash
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    // Attach salt so it can be used by compare below
    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') == hashedPassword;
  }

  static generateJwt(user: UserDoc) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_KEY!,
    );
  }
}
