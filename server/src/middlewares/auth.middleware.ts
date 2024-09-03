import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import { auth } from '../utils/firebase';
import { Context } from '../common';

dotenv.config();

type RequestWithContext = Request & {
  context: Context;
};

/**
 * Authentication middleware function that verifies the user's ID token and sets the user context.
 *
 * @param {Request} req - The incoming request object.
 * @param {Response} res - The outgoing response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @return {void}
 */
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
  // eslint-disable-next-line consistent-return
) => {
  const idToken = req.headers.authorization?.split(' ')[1]; // Extract the token from the bearer string

  if (!idToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const decodedIdToken = await auth.verifyIdToken(idToken);
    const userId = decodedIdToken.uid;
    const context: Context = { user: { id: userId } };
    (req as RequestWithContext).context = context;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

export { RequestWithContext };
export default authMiddleware;
