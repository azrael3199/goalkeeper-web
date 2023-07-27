import { app } from '@root/configs/firebase';
import {
  GoogleAuthProvider,
  NextOrObserver,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';

const auth = getAuth(app);
// setPersistence(auth, browserLocalPersistence);

const provider = new GoogleAuthProvider();

// Auth methods
export const signUpWithEmailAndPassword = (
  email: string,
  password: string,
  firstname: string,
  lastname: string
): Promise<void | UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password).then(
    async (res: UserCredential) => {
      try {
        await updateProfile(res.user, {
          displayName: `${firstname} ${lastname}`,
        });
      } catch (err) {
        await res.user.delete();
        throw err;
      }
    }
  );

export const loginWithEmailAndPassword = (
  email: string,
  password: string
): Promise<void | UserCredential> =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = (): Promise<void> => signOut(auth);

export const getCurrentUser = (): User | null => auth.currentUser;

// Expose the listener
export const onAuthStateChanged = (cb: NextOrObserver<User | null>) =>
  auth.onAuthStateChanged(cb);
