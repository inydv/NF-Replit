import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  facebookProvider,
} from "../Configs/Firebase.Config";
import { alert } from "../Utils/AlertGlobalInterface.Util";

class FirebaseAuthService {
  constructor(authInstance) {
    this.auth = authInstance;
  }

  async REGISTER_WITH_EMAIL_AND_PASSWORD(email, password) {
    try {
      const userCred = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const token = await userCred.user.getIdToken();
      return token;
    } catch (error) {
      alert.error(error.message);
    }
  }

  async LOGIN_WITH_EMAIL_AND_PASSWORD(email, password) {
    try {
      const userCred = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const token = await userCred.user.getIdToken();
      return token;
    } catch (error) {
      alert.error(error.message);
    }
  }

  async SEND_PASSWORD_RESET_EMAIL(email) {
    try {
      return sendPasswordResetEmail(this.auth, email);
    } catch (error) {
      alert.error(error.message);
    }
  }

  async CONTINUE_WITH_GOOGLE() {
    try {
      const userCred = await signInWithPopup(this.auth, googleProvider);
      const token = await userCred.user.getIdToken();
      return token;
    } catch (error) {
      alert.error(error.message);
    }
  }

  async CONTINUE_WITH_FACEBOOK() {
    try {
      const userCred = await signInWithPopup(this.auth, facebookProvider);
      const token = await userCred.user.getIdToken();
      return token;
    } catch (error) {
      alert.error(error.message);
    }
  }
}

// Exporting an instance of the class
const firebaseAuthService = new FirebaseAuthService(auth);
export default firebaseAuthService;
