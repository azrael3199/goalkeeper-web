/* eslint-disable no-console */
import { Request, RequestHandler, Response } from 'express';
import { auth, db } from '../utils/firebase';
import { RequestWithContext } from '../middlewares/auth.middleware';

const usersCollection = db.collection('users');

/**
 * Signs up a new user.
 *
 * @param {Request} req - The request object with the user context.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the user is signed up.
 */
export const signUp: RequestHandler = async (req: Request, res: Response) => {
  const userId = (req as RequestWithContext).context.user.id;
  const userRef = usersCollection.doc(userId);

  try {
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const userData = await auth.getUser(userId);
    if (!userData) {
      return res
        .status(404)
        .json({ error: 'There was an error creating user' });
    }

    const user = {
      id: userId,
      email: userData.email,
      fullName: userData.displayName ?? null,
      photoUrl: userData.photoURL ?? null,
      phone: userData.phoneNumber ?? null,
      lastAccess: Date.now(),
    };

    await userRef.set(user);
    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') console.error(err);
    return res.status(500).json({ error: 'Failed to create user' });
  }
};

/**
 * Sign in a user.
 *
 * @param {Request} req - The request object with the user context.
 * @param {Response} res - The response object.
 * @return {Promise<void>} A promise that resolves when the user is signed in.
 */
export const signIn: RequestHandler = async (req: Request, res: Response) => {
  const userId = (req as RequestWithContext).context.user.id;
  const userRef = usersCollection.doc(userId);

  try {
    const userDoc = await userRef.get();
    if (userDoc.exists) {
      await userRef.update({ lastAccess: new Date() });
      return res.status(200).json({ message: 'User signed in successfully' });
    }
    return res
      .status(404)
      .json({ error: 'User not found. Please sign up first.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
