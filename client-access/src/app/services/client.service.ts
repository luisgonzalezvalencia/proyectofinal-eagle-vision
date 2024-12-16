import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  Firestore,
  getDocs,
  query,
  where,
} from '@angular/fire/firestore';
import { addDays, formatISO } from 'date-fns';
import { from, map, Observable } from 'rxjs';
import { MAX_PERIOD_TRIAL } from '../constants';
import { Client } from '../models';
@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private collectionPath = 'clients';
  constructor(private firestore: Firestore) {}

  get(userId: string): Observable<Client | null> {
    const colRef = collection(this.firestore, this.collectionPath);
    const q = query(colRef, where('userId', '==', userId));
    return from(getDocs(q)).pipe(
      map((snapshot) => {
        const doc = snapshot.docs[0];
        return doc ? ({ id: doc.id, ...doc.data() } as Client) : null;
      })
    );
  }

  set(data: Client): Observable<string> {
    const colRef = collection(this.firestore, this.collectionPath);
    return from(addDoc(colRef, data)).pipe(map((docRef) => docRef.id));
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

  private generateUniqueInteger(): number {
    const timestamp = Date.now(); // Obtiene el timestamp actual
    const randomComponent = Math.floor(Math.random() * 1000); // Genera un número aleatorio entre 0 y 999
    return parseInt(`${timestamp}${randomComponent}`); // Combina timestamp y número aleatorio
  }
}
