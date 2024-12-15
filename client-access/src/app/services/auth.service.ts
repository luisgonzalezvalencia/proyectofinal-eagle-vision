import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from '@angular/fire/auth';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {
    this.auth.onAuthStateChanged((user) => {
      console.log('[onAuthStateChanged]', user);
      this.currentUserSubject.next(user);
    });
  }

  // Observable to get the authenticated user
  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  // Get current user UID
  get userId(): string | null {
    return this.currentUserSubject.value?.uid || null;
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  }

  // Register with email and password
  async register(email: string, password: string): Promise<User | null> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return userCredential.user;
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<User | null> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      return userCredential.user;
    } catch (error) {
      console.error('Error during Google sign in:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  }
}
