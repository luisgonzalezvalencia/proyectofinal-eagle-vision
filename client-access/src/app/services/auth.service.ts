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
import { Client } from '../models';
import { ClientService } from './client.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isInitializedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private currentClientSubject = new BehaviorSubject<Client | null>(null);
  private currentToken: string | null = null;

  constructor(private auth: Auth, private clientService: ClientService) {
    this.auth.onAuthStateChanged((user) => {
      this.currentUserSubject.next(user);

      if (user) {
        this.clientService.get(user.uid).subscribe(async (client) => {
          this.currentClientSubject.next(client);
          this.isInitializedSubject.next(true);
          this.currentToken = await user.getIdToken();
        });
      } else {
        this.currentClientSubject.next(null);
        this.isInitializedSubject.next(true);
        this.currentToken = null;
      }
    });
  }

  get currentUser$(): Observable<User | null> {
    return this.currentUserSubject.asObservable();
  }

  get currentClient$(): Observable<Client | null> {
    return this.currentClientSubject.asObservable();
  }

  get isInitialized$(): Observable<boolean> {
    return this.isInitializedSubject.asObservable();
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get currentClient(): Client | null {
    return this.currentClientSubject.value;
  }

  get userId(): string | null {
    return this.currentUserSubject.value?.uid || null;
  }

  get userAccessToken(): string | null {
    return this.currentToken;
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
