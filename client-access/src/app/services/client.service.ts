import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { addDays, formatISO } from 'date-fns';
import { from, map, Observable } from 'rxjs';
import { MAX_PERIOD_TRIAL } from '../constants';
import { Client, UserClient } from '../models';
@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private clientCollection = 'clients';
  private usersClientCollection = 'usersClient';
  constructor(private firestore: Firestore) {}

  get(userId: string): Observable<Client | null> {
    const colRef = collection(this.firestore, this.clientCollection);
    const q = query(colRef, where('userId', '==', userId));
    return from(getDocs(q)).pipe(
      map((snapshot) => {
        const doc = snapshot.docs[0];
        return doc ? ({ id: doc.id, ...doc.data() } as Client) : null;
      })
    );
  }

  set(data: Omit<Client, 'id'>): Observable<string> {
    const colRef = collection(this.firestore, this.clientCollection);
    return from(addDoc(colRef, data)).pipe(map((docRef) => docRef.id));
  }

  update(clientId: string, data: Partial<Client>): Observable<void> {
    const docRef = doc(this.firestore, `${this.clientCollection}/${clientId}`);
    return from(updateDoc(docRef, data));
  }

  startSubscription(userId: string): Observable<string> {
    const uniqueId = this.generateUniqueInteger();
    const expirationDate = addDays(new Date(), MAX_PERIOD_TRIAL);

    return this.set({
      clientId: uniqueId,
      expirationDate: formatISO(expirationDate),
      userId,
    });
  }

  generateToken(id: string) {
    const token = this.generateUniqueToken();
    // Actualizar el cliente en Firestore con el nuevo token
    return this.update(id, { token });
  }

  getUsers(clientId: number): Observable<UserClient[]> {
    const colRef = collection(this.firestore, this.usersClientCollection);
    const q = query(colRef, where('clientId', '==', clientId));

    return from(getDocs(q)).pipe(
      map((snapshot) =>
        snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as UserClient)
        )
      )
    );
  }

  private generateUniqueInteger(): number {
    const timestamp = Date.now(); // Obtiene el timestamp actual
    const randomComponent = Math.floor(Math.random() * 1000); // Genera un número aleatorio entre 0 y 999
    return parseInt(`${timestamp}${randomComponent}`); // Combina timestamp y número aleatorio
  }

  private generateUniqueToken(): string {
    // Genera un token único basado en una combinación de timestamp y un componente aleatorio
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
