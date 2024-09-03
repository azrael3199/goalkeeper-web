import { app } from '@root/configs/firebase';
import {
  GoogleAuthProvider,
  NextOrObserver,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { AxiosError } from 'axios';
import { userLogin, userRegister } from '../services/apis/user';

const auth = getAuth(app);
// setPersistence(auth, browserLocalPersistence);
auth.useDeviceLanguage();

const googleProvider = new GoogleAuthProvider();

// Auth methods
export const signUpWithEmailAndPassword = (
  email: string,
  password: string,
  firstname: string,
  lastname: string
): Promise<void | UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (res: UserCredential) => {
      // Create a user in Firebase with the provided details and also update their profile
      try {
        await updateProfile(res.user, {
          displayName: `${firstname} ${lastname}`,
        });
        return res;
      } catch (err) {
        await res.user.delete();
        throw err;
      }
    })
    .then(async (res: UserCredential) => {
      if (res) {
        // Firebase Registration is done. Now register to custom backend
        // eslint-disable-next-line no-useless-catch
        try {
          const idToken = await res.user.getIdToken();
          const response = await userRegister(idToken);

          if (response.status === 201) {
            return res;
          }
          throw new Error('Failed to create user');
        } catch (err) {
          await res.user.delete();
          // @ts-expect-error No error type on AxiosError
          if ((err as AxiosError).response?.data?.error) {
            // @ts-expect-error No error type on AxiosError
            throw new Error((err as AxiosError).response?.data?.error);
          } else {
            throw err;
          }
        }
      } else {
        throw new Error('Failed to create user');
      }
    });

export const loginWithEmailAndPassword = (
  email: string,
  password: string
): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, email, password).then(async (res) => {
    if (res) {
      // eslint-disable-next-line no-useless-catch
      try {
        const idToken = await res.user.getIdToken();
        const response = await userLogin(idToken);
        if (response.status === 200) {
          return res;
        }
        throw new Error('Failed to create user');
      } catch (err) {
        // @ts-expect-error No error type on AxiosError
        if ((err as AxiosError).response?.data?.error) {
          // @ts-expect-error No error type on AxiosError
          throw new Error((err as AxiosError).response?.data?.error);
        } else {
          throw err;
        }
      }
    } else {
      throw new Error('Failed to login');
    }
  });

export const authWithGoogle = (register = false): Promise<UserCredential> =>
  signInWithPopup(auth, googleProvider).then(async (res: UserCredential) => {
    if (res) {
      if (!register) {
        // We are trying to log in
        // eslint-disable-next-line no-useless-catch
        try {
          const idToken = await res.user.getIdToken();
          const response = await userLogin(idToken);
          if (response.status === 200 || response.status === 201) {
            return res;
          }
          if (response.status === 404) {
            throw new Error('User not found. Please Sign Up first');
          }
          throw new Error('Failed to login');
        } catch (err) {
          // @ts-expect-error No error type on AxiosError
          if ((err as AxiosError).response?.data?.error) {
            // @ts-expect-error No error type on AxiosError
            throw new Error((err as AxiosError).response?.data?.error);
          } else {
            throw err;
          }
        }
      } else {
        // eslint-disable-next-line no-useless-catch
        try {
          const idToken = await res.user.getIdToken();
          const response = await userRegister(idToken);
          if (response.status === 201) {
            return res;
          }
          if (response.status === 400) {
            // User is already present in the database, login the user
            const loginResponse = await userLogin(idToken);
            if (loginResponse.status === 200) {
              return res;
            }
            throw new Error('Failed to create user');
          }
          throw new Error('Failed to create user');
        } catch (err) {
          throw err;
        }
      }
    }
    if (register) {
      throw new Error('Failed to Sign Up');
    } else {
      throw new Error('Failed to Sign In');
    }
  });

export const logout = (): Promise<void> => signOut(auth);

export const getCurrentUser = (): User | null => auth.currentUser;

// Expose the listener
export const onAuthStateChanged = (cb: NextOrObserver<User | null>) =>
  auth.onAuthStateChanged(cb);
