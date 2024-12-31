import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Check the authentication state using Firebase
export const checkAuth = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true); // User is authenticated
      } else {
        resolve(false); // User is not authenticated
      }
    });
  });
};

// Sign up user
export const signUp = async (email: string, password: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Sign in user
export const signIn = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Log out user
export const logOut = async () => {
  await signOut(auth); // Sign out using Firebase auth
  window.location.href = "/pages/login"; // Optionally redirect to login page
};
